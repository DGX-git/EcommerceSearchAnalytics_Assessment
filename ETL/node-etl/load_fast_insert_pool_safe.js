// load_fast_insert_pool_safe.js
// FINAL Supabase-safe ETL loader (FK correct + progress logs)

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import { parse } from "csv-parse";
import dotenv from "dotenv";

dotenv.config();

/* ---------------- CONFIG ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BATCH_SIZE = 400;
const POOL_MAX = 1;
const LOG_EVERY = 50_000;
const RETRY_BASE_MS = 200;
const PAUSE_MS = 10;

/* ---------------- UTILS ---------------- */
const delay = ms => new Promise(r => setTimeout(r, ms));

function safeNumber(v) {
  if (v === undefined || v === null) return null;
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

function safeDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d) ? null : d.toISOString();
}

function safeJSON(v) {
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
}

function splitList(v) {
  if (!v) return [];
  return String(v)
    .replace(/^"|"$/g, "")
    .split(/[,;|]/)
    .map(s => s.trim())
    .filter(Boolean);
}

async function retry(fn, attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts) throw err;
      const wait = RETRY_BASE_MS * Math.pow(2, i - 1);
      console.warn(`Retry ${i}/${attempts} after ${wait}ms → ${err.message}`);
      await delay(wait);
    }
  }
}

/* ---------------- SCHEMA ---------------- */
async function ensureSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      customer_id BIGSERIAL PRIMARY KEY,
      customer_email TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS brands (
      brand_id BIGSERIAL PRIMARY KEY,
      brand_name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS categories (
      category_id BIGSERIAL PRIMARY KEY,
      category_name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS collections (
      collection_id BIGSERIAL PRIMARY KEY,
      collection_name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS searches (
      search_id TEXT PRIMARY KEY,
      customer_id BIGINT REFERENCES customers(customer_id),
      search_keyword TEXT,
      attributes JSONB,
      min_price NUMERIC,
      max_price NUMERIC,
      min_rating NUMERIC,
      total_results INTEGER,
      search_date TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS search_metrics (
      search_id TEXT PRIMARY KEY REFERENCES searches(search_id),
      min_price NUMERIC,
      max_price NUMERIC,
      min_rating NUMERIC,
      total_results INTEGER
    );

    CREATE TABLE IF NOT EXISTS ip_addresses (
      id BIGSERIAL PRIMARY KEY,
      search_id TEXT REFERENCES searches(search_id),
      ip_address TEXT
    );

    CREATE TABLE IF NOT EXISTS search_brands (
      search_id TEXT REFERENCES searches(search_id),
      brand_id BIGINT REFERENCES brands(brand_id),
      PRIMARY KEY (search_id, brand_id)
    );

    CREATE TABLE IF NOT EXISTS search_categories (
      search_id TEXT REFERENCES searches(search_id),
      category_id BIGINT REFERENCES categories(category_id),
      PRIMARY KEY (search_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS search_collections (
      search_id TEXT REFERENCES searches(search_id),
      collection_id BIGINT REFERENCES collections(collection_id),
      PRIMARY KEY (search_id, collection_id)
    );
  `);
}

/* ---------------- INSERT HELPERS ---------------- */
async function insertInBatches(pool, table, cols, rows) {
  if (!rows.length) return;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);
    const values = [];

    const placeholders = chunk.map((row, ri) => {
      const base = ri * cols.length;
      cols.forEach(c => values.push(row[c]));
      return `(${cols.map((_, ci) => `$${base + ci + 1}`).join(",")})`;
    }).join(",");

    const sql = `INSERT INTO ${table} (${cols.join(",")}) VALUES ${placeholders} ON CONFLICT DO NOTHING`;
    await retry(() => pool.query(sql, values));
    await delay(PAUSE_MS);
  }
}

/* ---------------- MAIN ---------------- */
export async function processAllFiles() {
  const rawDir = path.join(__dirname, "raw_data");
  const csvFile = fs.readdirSync(rawDir).find(f => f.endsWith(".csv"));

  if (!csvFile) {
    console.log("❌ No CSV found");
    return;
  }

  console.log("Processing:", csvFile);

  /* ---------- PASS 1 ---------- */
  const tmpPath = path.join(__dirname, ".tmp_rows.jsonl");
  const out = fs.createWriteStream(tmpPath);

  const emails = new Set(), brands = new Set(), categories = new Set(), collections = new Set();
  let rowCount = 0;

  await new Promise((resolve, reject) => {
    const parser = parse({ columns: true, trim: true });
    fs.createReadStream(path.join(rawDir, csvFile)).pipe(parser);

    parser.on("readable", () => {
      let r;
      while ((r = parser.read())) {
        rowCount++;

        if (r["Customer Email"]) {
          emails.add(r["Customer Email"].trim().toLowerCase());
        }

        splitList(r["Brands"]).forEach(v => brands.add(v));
        splitList(r["Categories"]).forEach(v => categories.add(v));
        splitList(r["Collections"]).forEach(v => collections.add(v));

        out.write(JSON.stringify(r) + "\n");

        if (rowCount % LOG_EVERY === 0) {
          console.log(`📦 First pass processed ${rowCount} rows`);
        }
      }
    });

    parser.on("end", resolve);
    parser.on("error", reject);
  });

  out.end();
  console.log(`✅ CSV scan complete: ${rowCount} rows`);

  const pool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING, max: POOL_MAX });
  await ensureSchema(pool);

  /* ---------- LOOKUPS ---------- */
  await insertInBatches(pool, "customers", ["customer_email"], [...emails].map(v => ({ customer_email: v })));
  await insertInBatches(pool, "brands", ["brand_name"], [...brands].map(v => ({ brand_name: v })));
  await insertInBatches(pool, "categories", ["category_name"], [...categories].map(v => ({ category_name: v })));
  await insertInBatches(pool, "collections", ["collection_name"], [...collections].map(v => ({ collection_name: v })));

  const mapTable = async (t, k, id) =>
    new Map((await pool.query(`SELECT ${k}, ${id} FROM ${t}`)).rows.map(r => [r[k], r[id]]));

  const maps = {
    customers: await mapTable("customers", "customer_email", "customer_id"),
    brands: await mapTable("brands", "brand_name", "brand_id"),
    categories: await mapTable("categories", "category_name", "category_id"),
    collections: await mapTable("collections", "collection_name", "collection_id")
  };

  /* ---------- PASS 2A: SEARCHES ---------- */
  console.log("🧠 Inserting searches...");
  const searches = [];
  let searchCount = 0;

  for await (const line of readline.createInterface({ input: fs.createReadStream(tmpPath) })) {
    const r = JSON.parse(line);
    if (!r["Search ID"]) continue;

    searches.push({
      search_id: r["Search ID"],
      customer_id: maps.customers.get(r["Customer Email"]?.toLowerCase()) || null,
      search_keyword: r["Search Keyword"] || null,
      attributes: safeJSON(r["Attributes"]),
      min_price: safeNumber(r["Min Price"]),
      max_price: safeNumber(r["Max Price"]),
      min_rating: safeNumber(r["Min Rating"]),
      total_results: safeNumber(r["Total Results"]),
      search_date: safeDate(r["Search Date"])
    });

    searchCount++;
    if (searches.length >= BATCH_SIZE) {
      await insertInBatches(pool, "searches",
        ["search_id","customer_id","search_keyword","attributes","min_price","max_price","min_rating","total_results","search_date"],
        searches.splice(0)
      );
    }

    if (searchCount % LOG_EVERY === 0) {
      console.log(`🧠 Searches processed: ${searchCount}`);
    }
  }

  // ✅ CRITICAL FIX: flush remaining searches
  if (searches.length) {
    await insertInBatches(pool, "searches",
      ["search_id","customer_id","search_keyword","attributes","min_price","max_price","min_rating","total_results","search_date"],
      searches
    );
  }

  /* ---------- PASS 2B: CHILD TABLES ---------- */
  console.log("🔗 Inserting child tables...");

  const metrics = [], ips = [], sb = [], sc = [], scol = [];
  let childCount = 0;

  for await (const line of readline.createInterface({ input: fs.createReadStream(tmpPath) })) {
    const r = JSON.parse(line);
    const sid = r["Search ID"];
    if (!sid) continue;

    metrics.push({
      search_id: sid,
      min_price: safeNumber(r["Min Price"]),
      max_price: safeNumber(r["Max Price"]),
      min_rating: safeNumber(r["Min Rating"]),
      total_results: safeNumber(r["Total Results"])
    });

    splitList(r["IP Address"]).forEach(v => ips.push({ search_id: sid, ip_address: v }));
    splitList(r["Brands"]).forEach(v => sb.push({ search_id: sid, brand_id: maps.brands.get(v) }));
    splitList(r["Categories"]).forEach(v => sc.push({ search_id: sid, category_id: maps.categories.get(v) }));
    splitList(r["Collections"]).forEach(v => scol.push({ search_id: sid, collection_id: maps.collections.get(v) }));

    if (metrics.length >= BATCH_SIZE) await insertInBatches(pool, "search_metrics",
      ["search_id","min_price","max_price","min_rating","total_results"], metrics.splice(0)
    );
    if (ips.length >= BATCH_SIZE) await insertInBatches(pool, "ip_addresses", ["search_id","ip_address"], ips.splice(0));
    if (sb.length >= BATCH_SIZE) await insertInBatches(pool, "search_brands", ["search_id","brand_id"], sb.splice(0));
    if (sc.length >= BATCH_SIZE) await insertInBatches(pool, "search_categories", ["search_id","category_id"], sc.splice(0));
    if (scol.length >= BATCH_SIZE) await insertInBatches(pool, "search_collections", ["search_id","collection_id"], scol.splice(0));

    childCount++;
    if (childCount % LOG_EVERY === 0) {
      console.log(`🔗 Child rows processed: ${childCount}`);
    }
  }

  fs.unlinkSync(tmpPath);
  await pool.end();

  console.log("✅ ETL COMPLETED SUCCESSFULLY WITHOUT FK ERRORS");
}
