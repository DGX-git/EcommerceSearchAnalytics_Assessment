import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

// Fix for ES modules (__dirname equivalent)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function parseCSV() {
  const filePath = path.join(
    __dirname,
    "raw_data",
    "nov 15 - nov 30.csv"
  );

  const content = fs.readFileSync(filePath, "utf8");

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true
  });

  return records;
}
