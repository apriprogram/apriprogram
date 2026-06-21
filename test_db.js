const { initDatabase, pool } = require("./src/config/db");

async function run() {
  try {
    await initDatabase();
    console.log("Success!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}
run();
