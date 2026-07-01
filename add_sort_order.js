const { pool } = require('./src/config/db');

async function migrate() {
  try {
    await pool.execute('ALTER TABLE contents ADD COLUMN sort_order INT DEFAULT 0');
    console.log("Added sort_order column");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists");
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}

migrate();
