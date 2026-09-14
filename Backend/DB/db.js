import pkg from "pg";
const { Pool } = pkg;


if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL en el archivo .env")
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export const query = async (text, params = []) => {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result;
  } finally {
    client.release();
  }
}