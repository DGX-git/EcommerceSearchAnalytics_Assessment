// load.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

export async function loadToPostgres(records) {
  const client = new Client({
    connectionString: process.env.PG_CONNECTION_STRING
  });

  await client.connect();

  const query = `
    INSERT INTO search_logs (
      search_id, customer_name, customer_email, ip_addresses,
      search_keyword, brands, categories, collections, attributes,
      min_price, max_price, min_rating, total_results, search_date
    )
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14
    )
    ON CONFLICT (search_id) DO NOTHING;
  `;

  for (const r of records) {
    await client.query(query, [
      r.search_id,
      r.customer_name,
      r.customer_email,
      r.ip_addresses,
      r.search_keyword,
      r.brands,
      r.categories,
      r.collections,
      r.attributes,
      r.min_price,
      r.max_price,
      r.min_rating,
      r.total_results,
      r.search_date
    ]);
  }

  console.log("✅ Data loaded into PostgreSQL successfully");

  await client.end();
}
