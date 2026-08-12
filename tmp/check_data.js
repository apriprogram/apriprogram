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
  const [rows] = await pool.query(
    "SELECT section, COUNT(*) as cnt FROM settings WHERE section IN ('project_items','timeline_items','faq_items') GROUP BY section"
  );
  console.log('DB data counts:', JSON.stringify(rows));
  const [sample] = await pool.query(
    "SELECT section, setting_key, SUBSTRING(setting_value,1,100) as val FROM settings WHERE section IN ('project_items','timeline_items','faq_items') LIMIT 5"
  );
  console.log('Sample rows:', JSON.stringify(sample));
  process.exit(0);
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
