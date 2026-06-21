const { pool } = require("./src/config/db");

async function updateSchema() {
  try {
    // Check if column exists first to prevent errors on multiple runs
    const [cols] = await pool.query("SHOW COLUMNS FROM users LIKE 'google_id'");
    if (cols.length === 0) {
      await pool.query("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE NULL AFTER id;");
      console.log("Added google_id column.");
    }
    
    const [colsAvatar] = await pool.query("SHOW COLUMNS FROM users LIKE 'avatar'");
    if (colsAvatar.length === 0) {
      await pool.query("ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL;");
      console.log("Added avatar column.");
    }
    
    await pool.query("ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL;");
    console.log("Modified password column to allow NULL.");
    
    console.log("Database schema updated successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

updateSchema();
