import { setupDatabase } from "./setupDatabase.js";
import { parseCSV } from "./parseCSV.js";
import { transformData } from "./transform.js";
import { loadToPostgres } from "./load.js";

async function runETL() {
  console.log("🛠 Running database setup...");
  await setupDatabase();

  console.log("📥 Extracting CSV...");
  const rawRecords = parseCSV();

  console.log("🔄 Transforming...");
  const transformed = transformData(rawRecords);

  console.log("📤 Loading into PostgreSQL...");
  await loadToPostgres(transformed);

  console.log("🎉 ETL Completed Successfully!");
}

runETL();
