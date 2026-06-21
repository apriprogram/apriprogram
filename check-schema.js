const { pool } = require("./src/config/db");

async function checkSchema() {
  try {
    const [rows] = await pool.query("DESCRIBE users;");
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkSchema();
