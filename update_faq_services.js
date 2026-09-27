const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows6] = await connection.query(`SELECT setting_value FROM settings WHERE section = 'faq' AND setting_key = 'faq'`);
  if (rows6.length > 0) {
    let data = JSON.parse(rows6[0].setting_value);
    data.title = 'Jawaban untuk pertanyaan teratas Anda';
    await connection.query(`UPDATE settings SET setting_value = ? WHERE section = 'faq' AND setting_key = 'faq'`, [JSON.stringify(data)]);
    console.log('Updated faq title');
  }

  const [rows7] = await connection.query(`SELECT setting_value FROM settings WHERE section = 'services' AND setting_key = 'services'`);
  if (rows7.length > 0) {
    let data = JSON.parse(rows7[0].setting_value);
    if(data.title) {
        data.title = 'Layanan kami untuk<br>membantu Anda';
    }
    await connection.query(`UPDATE settings SET setting_value = ? WHERE section = 'services' AND setting_key = 'services'`, [JSON.stringify(data)]);
    console.log('Updated services title');
  }

  await connection.end();
}

run().catch(console.error);
