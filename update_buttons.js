const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await connection.query(`UPDATE settings SET setting_value = 'Lihat semua layanan' WHERE section = 'services' AND setting_key = 'button_text'`);
  console.log('Updated services button text');

  await connection.query(`UPDATE settings SET setting_value = 'Lihat semua portofolio' WHERE section = 'projects' AND setting_key = 'button_text'`);
  console.log('Updated projects button text');

  await connection.end();
}

run().catch(console.error);
