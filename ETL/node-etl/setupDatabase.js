// setupDatabase.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

// These should match your .env
const DB_NAME = "ecommerce_search";

export async function setupDatabase() {
  console.log("🛠 Checking and creating database/table if needed...");

  // 1️⃣ Connect to default postgres DB
  const adminClient = new Client({
    connectionString: process.env.PG_ADMIN_CONNECTION_STRING, // admin user
  });

  await adminClient.connect();

  // 2️⃣ Create database if it doesn't exist
  const checkDB = `
    SELECT 1 FROM pg_database WHERE datname='${DB_NAME}';
  `;
  const result = await adminClient.query(checkDB);

  if (result.rowCount === 0) {
    console.log(`📌 Database "${DB_NAME}" does not exist. Creating...`);
    await adminClient.query(`CREATE DATABASE ${DB_NAME};`);
  } else {
    console.log(`✔ Database "${DB_NAME}" already exists`);
  }

  await adminClient.end();

  // 3️⃣ Connect to the created DB and create table if missing
  const dbClient = new Client({
    connectionString: process.env.PG_CONNECTION_STRING,
  });

  await dbClient.connect();

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS search_logs (
      search_id TEXT PRIMARY KEY,
      customer_name TEXT,
      customer_email TEXT,
      ip_addresses TEXT[],
      search_keyword TEXT,
      brands TEXT,
      categories TEXT,
      collections TEXT,
      attributes TEXT,
      min_price NUMERIC,
      max_price NUMERIC,
      min_rating NUMERIC,
      total_results INT,
      search_date TIMESTAMP
    );
  `;

  await dbClient.query(createTableQuery);
  console.log("✔ Table 'search_logs' is ready");

  await dbClient.end();

  console.log("✅ Database setup complete!");
}
