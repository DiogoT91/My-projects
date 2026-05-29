const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const seedsDir = path.resolve(__dirname, "../../Database/seeds");
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  console.error(
    "Missing DATABASE_URL or SUPABASE_DATABASE_URL. Set it in your environment or .env file."
  );
  process.exit(1);
}

async function runSeeds() {
  const client = new Client({ connectionString });

  await client.connect();

  const files = fs
    .readdirSync(seedsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const filePath = path.join(seedsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`Applying seed: ${file}`);
    await client.query(sql);
  }

  console.log("All seed files applied.");
  await client.end();
}

runSeeds().catch((error) => {
  console.error("Seed failed:", error.message || error);
  process.exit(1);
});
