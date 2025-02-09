const aedes = require("aedes")();
const fs = require("fs");
const tls = require("tls");
const axios = require("axios");

const options = {
  key: fs.readFileSync("broker.key"),
  cert: fs.readFileSync("broker.crt"),
  ca: [fs.readFileSync("ca.crt")],
  requestCert: true,
  rejectUnauthorized: true,
};

const port = 8883;
const server = tls.createServer(options, aedes.handle);

server.listen(port, function () {
  console.log(`Broker MQTT (Aedes) in TLS sulla porta ${port}`);
});

aedes.on("client", (client) => {
  console.log(`Nuovo client connesso: ${client?.id || "?"}`);
});

// Configurazione API
const API_KEY = "your-secret-api-key";
const API_CONFIG = {
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
};

aedes.on("publish", async (packet, client) => {
  if (client) {
    console.log(
      `Client ${client.id} ha pubblicato:`,
      packet.topic,
      packet.payload.toString()
    );

    // Verifica se il messaggio proviene dal topic "rfid/data"
    if (packet.topic === "rfid/data") {
      console.log("ricevuto rfid/data");
      const rfidTag = packet.payload.toString();
      const areaId = 1; // Imposta l'ID dell'area che vuoi controllare

      try {
        // Verifica l'autorizzazione sulla blockchain
        //fai una chiamata all'API per verificare l'autorizzazione a local host
        const response = await axios.post(
          "http://localhost:3000/api/blockchain/check-permission",
          { rfid: rfidTag, areaId: areaId }
        );
        const isAuthorized = response.data.authorized;

        // Rispondi all'ESP32 con un messaggio su "rfid/authorization"
        const responseTopic = "rfid/authorization";
        if (isAuthorized) {
          console.log(
            "Tag RFID autorizzato sulla blockchain. Invio segnale 'authorized'."
          );
          aedes.publish({ topic: responseTopic, payload: "authorized" });
        } else {
          console.log(
            "Tag RFID non autorizzato sulla blockchain. Invio segnale 'unauthorized'."
          );
          aedes.publish({ topic: responseTopic, payload: "unauthorized" });
        }
      } catch (error) {
        console.error(
          "Errore durante la verifica dell'accesso sulla blockchain:",
          error
        );
        // In caso di errore, nega l'accesso per sicurezza
        aedes.publish({ topic: "rfid/authorization", payload: "unauthorized" });
      }
    } else if (packet.topic === "sensors/data") {
      // Gestione dati sensore
      try {
        // Sostituisci 'nan' con null prima del parsing JSON
        const payloadStr = packet.payload.toString().replace(/nan/g, "null");
        const sensorPayload = JSON.parse(payloadStr);
        console.log(sensorPayload.device_id);
        let stanza = 0;
        if (sensorPayload.device_id === "ESP1") {
          stanza = 1;
        } else if (sensorPayload.device_id === "ESP2") {
          stanza = 2;
        }

        // Crea l'oggetto per il sensore di fumo
        const smokeData = {
          sensorId: "smoke1",
          value: sensorPayload.smokeLevel,
          tipo: "smoke",
          stanza: stanza,
        };

        // Crea l'oggetto per il sensore di temperatura
        const temperatureData = {
          sensorId: "temp1",
          value: sensorPayload.temperature,
          tipo: "temperatura",
          stanza: stanza,
        };

        // Invia i dati del sensore di fumo con l'API key
        axios
          .post(
            "http://localhost:3000/api/add-data-to-sensor",
            smokeData,
            API_CONFIG
          )
          .then((response) => {
            console.log("Dati del sensore di fumo inviati con successo:");
          })
          .catch((error) => {
            console.error("Errore nell'invio dei dati del sensore di fumo:");
          });

        // Invia i dati del sensore di temperatura con l'API key

        axios
          .post(
            "http://localhost:3000/api/add-data-to-sensor",
            temperatureData,
            API_CONFIG
          )
          .then((response) => {
            console.log(
              "Dati del sensore di temperatura inviati con successo:"
            );
          })
          .catch((error) => {
            console.error(
              "Errore nell'invio dei dati del sensore di temperatura:",
              error.message
            );
          });
      } catch (error) {
        console.error(
          "Errore nella gestione dei dati dei sensori:",
          error.message
        );
      }
    }
  }
});
