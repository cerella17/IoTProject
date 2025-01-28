#include <WiFi.h>
#include "mqtt_handler.h"
#include <WiFiClientSecure.h>     
#include <time.h>                 // Per sincronizzare l’ora via NTP

// Credenziali WiFi (puoi spostarli in config.h se preferisci)
const char* ssid = "TIM-2.5";
const char* password = "cerella91";

// Parametri del broker MQTT (usa la porta 8883 per TLS)
const char* mqtt_server = "192.168.1.119"; 
const int mqtt_port = 8883;               // Porta per connessione TLS

const char* ca_cert = R"EOF(
-----BEGIN CERTIFICATE-----
MIIC+TCCAeGgAwIBAgIUGNN04Rhrr44FYLhN2x8gDyID9u4wDQYJKoZIhvcNAQEL
BQAwEzERMA8GA1UEAwwITXlSb290Q0EwHhcNMjUwMTA4MTM0NDUwWhcNMjYwMTA4
MTM0NDUwWjAWMRQwEgYDVQQDDAttcXR0LWJyb2tlcjCCASIwDQYJKoZIhvcNAQEB
BQADggEPADCCAQoCggEBAJ9U8nG4HoqMG0joSQOBFxKCPQrtz2VvkKxr9V4apha0
bfkI0rMpo8dfiJHtxgE/GGOebjC6Af7VvfM8l/iMqFpSbO5OoMDr5lNvdmGicdTb
Qod2vZij/dJMEfV1dsR0DhBBOgUkVENqawr1Z4mUeWQnvb2483OxiaGGrFtplbeu
YBvk35XghJmc83anacDu/e7PSuhg8IKHzkKHw+wrqgiTcjM+Oby30ET9FoxvsrOQ
b+CbKkvbzhjgqnj8m7TZdg0qBoULkY9RTI4Xe1muBXs+k55szgtra5Ceno9vTm/8
e08bbhJBKrzad3Hl5lJIX/Mc4MANW29VV1HseNzEYOkCAwEAAaNCMEAwHQYDVR0O
BBYEFBl+X3ZZTgrEncAvUd0E2E2Lz+B5MB8GA1UdIwQYMBaAFK5hVU+m94r/M3EU
xeCXDMZg8veVMA0GCSqGSIb3DQEBCwUAA4IBAQB0SCdEQafzW7JiQGkTJHafnX3/
WECj/wI2B9fqymlxk5TYJfxJTb61KSNXQxTcU9zZezlSnann+J5J6oGNuj6EMXEP
h4UVSrCDUemWbLTJYuPqoBfGlyNXR6Ng0T8Bmlv+dMKMWA3UooKaMUuQgB8kyaDq
Gw/QeWRujvBeyW8dfSRdW9fARpqYtchynUXDhAm6DGRFAyH3H9BaQq3q1IG0VXxf
HQJcVcRxQuJfS9zEd4y5xcy0a5ic1iObCQrY9TzXXAzGm1a9j4f057eUV/QUJN8s
NUig7KS1xV8iKuBjuJ4JDsj6l7MsLyHq32NilWfXcIDqM+e8dASAAyOy4IA1
-----END CERTIFICATE-----
)EOF";
const char* client_cert = R"EOF(
-----BEGIN CERTIFICATE-----
MIIC+TCCAeGgAwIBAgIUGNN04Rhrr44FYLhN2x8gDyID9u8wDQYJKoZIhvcNAQEL
BQAwEzERMA8GA1UEAwwITXlSb290Q0EwHhcNMjUwMTA4MTM0NDU0WhcNMjYwMTA4
MTM0NDU0WjAWMRQwEgYDVQQDDAttcXR0LWNsaWVudDCCASIwDQYJKoZIhvcNAQEB
BQADggEPADCCAQoCggEBALprNkW1RRYFzXBOICUugN/tcW1ulS5D9bjFWUJq4VvQ
6nZpPXD1KCfbsIBSzlrtdvagxTDRaTnuaZFtOnRk7lScaAtpEl7pW1deIlAJ2AjU
WNo7eE2oT7Y9k4tMbaKy4FECEb6VSpwL9s5liiI7TmxwydSNM7Vk0UVla8N8VGMA
4DZqH41jAOxMm0tswa2V4t1I0Cuq2z0FZRzStRu/LJ3nhkoM5Q7w23ED75CEK+Bm
wvXBkYJCSVpPkTp1nfA+QbqoDKsdDc3yum7DDvApNVz7whzxoBCH/JiGFK11spRp
vpOgeTTSXenJjFlvefVwAsGcVJJMaIhqQVBwny/RvbMCAwEAAaNCMEAwHQYDVR0O
BBYEFGVCMD77BLXbt4huNT/5A4VD0hkWMB8GA1UdIwQYMBaAFK5hVU+m94r/M3EU
xeCXDMZg8veVMA0GCSqGSIb3DQEBCwUAA4IBAQBgYlMuZUvIC27AwwyYuKKjKw3U
5m8uebx2TbS+fzCZvDwHkgKGtimnLirDTNVdUX91GvINT0wc+3FIgzySx9YJgw83
o6E0Do9EcK6hKSJFxgqBduxGXl+t8ItNFHHzuEyolW7mmdLVKE3tmPB/0vfTGA8F
J5Z8oj6fOXarUVkoq7y9EqZEANZPxMkGqbEHJai9FylCIqQkTYXJZE/BOK9q6nby
mxt3AYmgqYJwfRKByojg3WcvVhb2iFlJoyee/7wNpkALVTIyrZEihC39KEnC5h+x
YCUPTlifP/J3/GhBEJclktbdCfuoiNdWbriUekQANJCllqDA4OVpkzykQMMr
-----END CERTIFICATE-----
)EOF";

const char* client_key = R"EOF(
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6azZFtUUWBc1w
TiAlLoDf7XFtbpUuQ/W4xVlCauFb0Op2aT1w9Sgn27CAUs5a7Xb2oMUw0Wk57mmR
bTp0ZO5UnGgLaRJe6VtXXiJQCdgI1FjaO3hNqE+2PZOLTG2isuBRAhG+lUqcC/bO
ZYoiO05scMnUjTO1ZNFFZWvDfFRjAOA2ah+NYwDsTJtLbMGtleLdSNArqts9BWUc
0rUbvyyd54ZKDOUO8NtxA++QhCvgZsL1wZGCQklaT5E6dZ3wPkG6qAyrHQ3N8rpu
ww7wKTVc+8Ic8aAQh/yYhhStdbKUab6ToHk00l3pyYxZb3n1cALBnFSSTGiIakFQ
cJ8v0b2zAgMBAAECggEABKF9K6YhHTbvr4aBTesl0Go5kxpYIloV1I0ydm/pQTqj
WGWs3Q15/eN7MvTbo26ase20eE37azD89lvcQ9/t+7QW8ZGenzT0y+rOt2ZHM5Dy
1Bj+GA/CSyikbaVsY8pFwD1o628R92ZkryPelpMak58JpHoNesgSWsL2Nlj0T7E/
BgC7Crr33kqUIQOzUZwXq6SjGcD8DEuMVB+J124LqXOfsVGeWHB4W7X1isv3YPdS
QrvbZ51MRVUh9qL4vvfcj0xCZ3SFb8Mlz/4GJ0NY+egsHECGauX5gVgaZHoovXnv
yjdV9NiPEQq7b88GxfPWlUMA/pWNvVQdXJ3xwdBgwQKBgQDcaJ6hSSsz2ut46DdO
Qz1Z/bhqPA4hUGhfvEjKBEqwqzHlyRuT05G5/+2dSPHlt1+s0Czc9ljcO7hf28oO
gqyXGMEfI8tmrC4+hjQ7/dJxmdfwyxczv5nfCcUPPLdpVndsfVJxMQ7MTdZIovRm
70Xbg8ctKwdJlLfIUxbAOcQCGwKBgQDYhX/Zjh99neOVjqLX2SQggImtQ+JC1+uM
CIAsq0k5+6CwtZJkaDdg8QmLZieh2LiVgla6SmLXAW+tUVB0E4cMQiqXZsfDZFlO
wZYI1m1e7RoQyAEAOFZ2+1EaGx0Sk7KX4ZteyYBHw+xFM0NRI/IWtvqJ59ATzkuG
FVykgLmsSQKBgB82jahnlT+ttAUWVaa2rPyOisw4nwOmwHE2V9SMEQu94r4Y4dfo
cU226a6JgwA2HM17Wa8dD+54Yp7ooE+3v7tSHR9M0WRD4/SkysboJiJCWCtYh3uj
maXVW1vSDGNVhGoPwVoYSXEzYLI+qX/eSLVSjyVdX5XTAsfSxHkKdTCbAoGBALco
30kbJ9psiMvIGEr9fckc0tpGNY2T98bCniKrVst856b0Qf08B7Sy0f8hEF+h5Ctd
UZ5PNKNqrJzxz1wR9MjS5BKlOFE6fy3XJuMc+PI3IjiV5/rWrZYC7M1nqEVBue8v
Qu6BCEotG55CSizGepDqgq/L8EIA3fRz96WU2vw5AoGBANbzPl7TesUT0dktFdGu
h59TCgrmUN6AosGkZi/771/JKnktFIRiU7HfMsgefFYPW1ahz3l1/NQyq2yeXfJt
5el22ZCV07bZNWK12hM6owx+0kHHyCTvlvTy/39PmwfsT3A6oHHGOYMLr1WlNldf
FsMv2M34MY9JXiJnsx+6GHER
-----END PRIVATE KEY-----
)EOF";


// Oggetti MQTT
WiFiClientSecure espClient;  // <-- Usa il client sicuro
PubSubClient client(espClient);

void setupMQTT() {
    Serial.println("Inizio connessione WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connesso!");
    Serial.print("IP assegnato: ");
    Serial.println(WiFi.localIP());

    // --------------------------
    // 1) SINCRONIZZA L'ORA (NTP)
    // --------------------------
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    Serial.println("Attendo sincronizzazione NTP...");
    time_t now = time(nullptr);
    while (now < 8 * 3600 * 2) {
        delay(500);
        Serial.print(".");
        now = time(nullptr);
    }
    Serial.println();
    struct tm timeinfo;
    getLocalTime(&timeinfo);
    Serial.print("Data/Ora attuale: ");
    Serial.print(asctime(&timeinfo));

    // ---------------------------------------
    // 2) CONFIGURA LA CONNESSIONE SSL/TLS
    // ---------------------------------------
    espClient.setCACert(ca_cert);
    espClient.setCertificate(client_cert);
    espClient.setPrivateKey(client_key);

    // Aggiungi questo debug
    Serial.println("Verifica configurazione SSL:");
    if (espClient.getCACert() != nullptr) {
        Serial.println(" - CA Certificate: OK");
    } else {
        Serial.println(" - CA Certificate: MANCANTE");
    }
    if (espClient.getCertificate() != nullptr) {
        Serial.println(" - Client Certificate: OK");
    } else {
        Serial.println(" - Client Certificate: MANCANTE");
    }
    if (espClient.getPrivateKey() != nullptr) {
        Serial.println(" - Private Key: OK");
    } else {
        Serial.println(" - Private Key: MANCANTE");
    }

    // Imposta il server MQTT e la callback
    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(mqttCallback);

    // Prova la connessione MQTT
    Serial.println("Connessione al broker MQTT in TLS...");
    connectToBroker();
}

void connectToBroker() {
    while (!client.connected()) {
        Serial.print("Connecting to MQTT broker (TLS)...");
        String clientId = "ESP32Client_" + String(random(0xffff), HEX);
        
        if (client.connect(clientId.c_str())) {
            Serial.println(" connesso!");
            client.subscribe("test/topic");
        } else {
            Serial.print(" fallito, rc=");
            Serial.print(client.state());
            if (espClient.lastError() != 0) {
                Serial.printf(" (SSL Error: %d)", espClient.lastError());
            }
            Serial.println(" -> Riprovo in 5 secondi");
            delay(5000);
        }
    }
}

void mqttLoop() {
    if (!client.connected()) {
        connectToBroker();
    }
    client.loop();
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Messaggio ricevuto sul topic: ");
    Serial.println(topic);
    Serial.print("Payload: ");
    for (int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
    }
    Serial.println();
}
