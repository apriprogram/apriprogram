const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await connection.query(`UPDATE settings SET setting_value = 'Langkah demi langkah proses pengembangan website kami untuk memastikan proyek Anda selesai tepat waktu dengan kualitas tinggi.' WHERE section = 'timeline' AND setting_key = 'subtitle'`);
  await connection.query(`UPDATE settings SET setting_value = 'Proses Pengerjaan' WHERE section = 'timeline' AND setting_key = 'title'`);

  await connection.query(`UPDATE settings SET setting_value = 'Jawaban untuk pertanyaan teratas Anda' WHERE section = 'faq' AND setting_key = 'title'`);
  
  await connection.query(`UPDATE settings SET setting_value = 'Portofolio proyek<br>kami' WHERE section = 'projects' AND setting_key = 'title'`);
  
  await connection.query(`UPDATE settings SET setting_value = 'Layanan kami<br>untuk membantu Anda' WHERE section = 'services' AND setting_key = 'title'`);

  console.log('Updated title and subtitles correctly!');
  await connection.end();
}

run().catch(console.error);
