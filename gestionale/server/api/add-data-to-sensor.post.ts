import { insertSensoreValue } from "../utils/sensors";

const API_KEY = process.env.NUXT_API_KEY;

export default defineEventHandler(async (event) => {
  try {
    // Verifica dell'API key
    const headers = getHeaders(event);
    const apiKey = headers["x-api-key"];

    if (!apiKey || apiKey !== API_KEY) {
      throw createError({
        statusCode: 401,
        message: "Accesso non autorizzato",
      });
    }

    const body = await readBody(event);
    const { sensorId, value, tipo, stanza } = body;

    console.log(body);

    // Validazione dei dati in ingresso
    if (!sensorId || value === undefined || !tipo || !stanza) {
      throw createError({
        statusCode: 400,
        message:
          "Tutti i campi sono obbligatori: sensorId, value, tipo, stanza",
      });
    }

    // Inserimento del nuovo valore del sensore
    const nuovoSensore = await insertSensoreValue(
      sensorId,
      value,
      tipo,
      stanza
    );

    return {
      success: true,
      data: nuovoSensore,
    };
  } catch (error) {
    console.error("Errore durante l'aggiunta dei dati del sensore:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Errore interno del server",
    });
  }
});
