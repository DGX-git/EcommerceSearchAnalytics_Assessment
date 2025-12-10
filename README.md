# SwapnilB_EcommerceSearchAnalytics_Assessment
E-Commerce Search Analytics Dashboard

# 📊 Node.js ETL Pipeline for Ecommerce Search Analytics (Supabase / PostgreSQL)

## Overview

This project implements a **Supabase-safe, production-ready Node.js ETL pipeline** designed to process large CSV files (800k+ rows) containing ecommerce search analytics data.

The pipeline emphasizes:
- Memory-efficient streaming
- Foreign-key safe inserts
- Stable long-running execution
- Compatibility with Supabase Session Mode

A **two-pass streaming architecture** ensures correct ordering between parent and child tables.

---

## ✅ Features

- Streaming CSV parsing (no full file load into memory)
- Foreign-key safe insert ordering
- Automatic schema creation
- Batch inserts with retry and exponential backoff
- Progress logging for long-running jobs
- Supabase session-safe (`pool.max = 1`)
- Clean Git hygiene (`raw_data` folder committed, CSV files ignored)

---

## 📁 Project Structure

node-etl/
├── index.js # Entry point
├── load_fast_insert_pool_safe.js # Core ETL logic
├── extract.js # Optional CSV downloader
├── transform.js # Utility helpers
├── raw_data/ # CSV input directory
│ └── .gitkeep
├── .env # Environment variables (INCLUDED in git)
├── package.json
├── .gitignore
└── README.md

---

## 🔧 Prerequisites

Ensure the following are installed:

### 1️⃣ Node.js
- Version **18 or higher**

```bash
node -v

2️⃣ PostgreSQL / Supabase

A running PostgreSQL database or Supabase project
Supabase Session Mode enabled

3️⃣ Git
git --version

📦 Dependencies

Installed via npm install:
1. pg – PostgreSQL client
2. csv-parse – Streaming CSV parsing
3. dotenv – Environment variable loader
4. axios – Optional CSV downloader

⚙️ Environment Configuration
✅ .env File (Tracked in Git)

Unlike most projects, this repository intentionally includes the .env file in version control.

⚠️ Important:
Before running the ETL, always cross-check the .env values to ensure they point to the correct database (local / staging / production).

Example .env file
PG_CONNECTION_STRING=postgres://USER:PASSWORD@HOST:PORT/postgres

📂 Raw Data Setup

Place CSV files inside the raw_data/ directory:

raw_data/
└── nov 15 - nov 30.csv

Notes
Only .csv files are processed
CSV contents are ignored by Git
The raw_data folder itself is committed using .gitkeep

🗄 Database Schema

The ETL automatically creates all required tables if they do not exist.

Core Tables
1. customers
2. brands
3. categories
4. collections
5. searches

Child / Mapping Tables
1. search_metrics
2. ip_addresses
3. search_brands
4. search_categories
5. search_collections

All foreign keys are enforced and inserts are ordered to prevent FK violations.

🔄 ETL Execution Flow
Internal Processing Steps

1. First Pass (Streaming)
Reads CSV row-by-row
Collects lookup values
Writes rows to a temporary JSONL file

2. Lookup Inserts
Inserts customers, brands, categories, and collections
Builds in-memory ID maps

3. Second Pass – Parent Inserts
Inserts all records into searches
Flushes remaining batches

4. Second Pass – Child Inserts
Inserts metrics, IP addresses, and mapping tables
Maintains foreign-key safety

5. Cleanup
Removes temporary files
Closes database connections

▶️ Running the ETL
1️⃣ Install dependencies
npm install

2️⃣ Verify environment
✅ Cross-check .env values

3️⃣ Run the pipeline
node index.js