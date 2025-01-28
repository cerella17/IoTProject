import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "mattiaguariglia",
  password: "",
  database: "iot",
});
