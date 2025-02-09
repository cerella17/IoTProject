import { pool } from "./db";

export async function getSensoriByStanza(stanzaId: number) {
  try {
    const query = `
      SELECT 
        s.id,
        s.tipo,
        s.valore,
        s.stanza,
        st.nome as nome_stanza
      FROM sensori s
      JOIN stanze st ON s.stanza = st.id
      WHERE s.stanza = $1
    `;

    const result = await pool.query(query, [stanzaId]);
    return result.rows;
  } catch (error) {
    console.error("Errore nel recupero dei sensori:", error);
    throw error;
  }
}

export async function getAllSensori() {
  try {
    const query = `
      WITH RankedSensori AS (
        SELECT 
          s.id,
          s.id_sensore,
          s.tipo,
          s.valore,
          s.stanza,
          s.timestamp,
          st.nome as nome_stanza,
          CASE 
            WHEN NOW() - s.timestamp <= interval '30 seconds' THEN true 
            ELSE false 
          END as attivo,
          ROW_NUMBER() OVER (PARTITION BY s.id_sensore, s.stanza ORDER BY s.id DESC) as rn
        FROM sensori s
        JOIN stanze st ON s.stanza = st.id
      )
      SELECT 
        id,
        id_sensore,
        tipo,
        valore,
        stanza,
        nome_stanza,
        timestamp,
        attivo
      FROM RankedSensori
      WHERE rn = 1
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Errore nel recupero dei sensori:", error);
    throw error;
  }
}

export async function updateSensoreValue(sensorId: number, newValue: number) {
  try {
    const query = `
      UPDATE sensori
      SET valore = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [newValue, sensorId]);
    return result.rows[0];
  } catch (error) {
    console.error("Errore nell'aggiornamento del valore del sensore:", error);
    throw error;
  }
}

export async function insertSensoreValue(
  sensorId: number,
  newValue: number,
  tipo: string,
  stanza: number
) {
  try {
    const query = `
      INSERT INTO sensori(id_sensore, valore, tipo,timestamp,stanza)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING *
    `;

    const result = await pool.query(query, [sensorId, newValue, tipo, stanza]);
    return result.rows[0];
  } catch (error) {
    console.error("Errore nell'inserimento del valore del sensore:", error);
    throw error;
  }
}
