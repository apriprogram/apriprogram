const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'apriprogram_db'
  });

  const [rows] = await connection.query("SELECT DISTINCT section FROM settings");
  console.log(rows.map(r => r.section));
  await connection.end();
}

checkDB();
