const { pool, initDatabase } = require("./src/config/db");

async function runMigration() {
  console.log("Starting migration...");
  try {
    await initDatabase();
    console.log("Migration completed successfully. Orders table should now exist.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
