const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const migrationsDir = path.resolve(__dirname, "../../Database/migrations");
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  console.error(
    "Missing DATABASE_URL or SUPABASE_DATABASE_URL. Set it in your environment or .env file."
  );
  process.exit(1);
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations(client) {
  const res = await client.query("SELECT name FROM migrations ORDER BY run_at");
  return res.rows.map((row) => row.name);
}

async function runMigrations() {
  const client = new Client({ connectionString });

  await client.connect();
  await ensureMigrationsTable(client);

  const appliedMigrations = await getAppliedMigrations(client);
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (appliedMigrations.includes(file)) {
      console.log(`Skipping already applied migration: ${file}`);
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`Applying migration: ${file}`);
    await client.query(sql);
    await client.query("INSERT INTO migrations(name) VALUES($1)", [file]);
  }

  console.log("All migrations applied.");
  await client.end();
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error.message || error);
  process.exit(1);
});
