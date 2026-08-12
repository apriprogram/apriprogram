require('dotenv').config();
const mysql = require('mysql2/promise');
(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'apriprogram',
    waitForConnections: true
  });
  // Update cta_link to register URL
  const [result] = await pool.query(
    "UPDATE settings SET setting_value = ? WHERE section = 'hero' AND setting_key = 'cta_link'",
    ['/login?type=register']
  );
  console.log('Updated rows:', result.affectedRows);

  // Also check current value
  const [rows] = await pool.query(
    "SELECT setting_value FROM settings WHERE section = 'hero' AND setting_key = 'cta_link'"
  );
  console.log('Current cta_link:', rows[0]?.setting_value);
  process.exit(0);
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
