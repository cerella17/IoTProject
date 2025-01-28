import { getAllSensori } from "../utils/sensors";

export default defineEventHandler(async (event) => {
  try {
    const sensori = await getAllSensori();
    return sensori;
  } catch (error) {
    console.error("Errore durante il recupero dei sensori:", error);
    throw createError({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});
