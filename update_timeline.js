const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows] = await connection.query(`SELECT setting_value FROM settings WHERE section = 'timeline_items' AND setting_key = 'requirement-gathering'`);
  if (rows.length > 0) {
    let data = JSON.parse(rows[0].setting_value);
    data.title = 'Pengumpulan Kebutuhan';
    data.button_text = 'Pelajari Lebih Lanjut';
    data.step_label = 'Langkah 1 &bull; Perencanaan & Analisis';
    await connection.query(`UPDATE settings SET setting_value = ? WHERE section = 'timeline_items' AND setting_key = 'requirement-gathering'`, [JSON.stringify(data)]);
    console.log('Updated requirement-gathering');
  }

  const [rows2] = await connection.query(`SELECT setting_value FROM settings WHERE section = 'timeline_items' AND setting_key = 'ui-ux-coding'`);
  if (rows2.length > 0) {
    let data = JSON.parse(rows2[0].setting_value);
    data.button_text = 'Pelajari Lebih Lanjut';
    data.step_label = 'Langkah 2 &bull; Desain & Pengembangan';
    await connection.query(`UPDATE settings SET setting_value = ? WHERE section = 'timeline_items' AND setting_key = 'ui-ux-coding'`, [JSON.stringify(data)]);
    console.log('Updated ui-ux-coding');
  }

  const [rows3] = await connection.query(`SELECT setting_value FROM settings WHERE section = 'timeline_items' AND setting_key = 'deployment-support'`);
  if (rows3.length > 0) {
    let data = JSON.parse(rows3[0].setting_value);
    data.button_text = 'Pelajari Lebih Lanjut';
    data.step_label = 'Langkah 3 &bull; Pengujian & Peluncuran';
    await connection.query(`UPDATE settings SET setting_value = ? WHERE section = 'timeline_items' AND setting_key = 'deployment-support'`, [JSON.stringify(data)]);
    console.log('Updated deployment-support');
  }
  
  const [rows4] = await connection.query(`SELECT setting_value FROM settings WHERE section = 'projects'`);
  if (rows4.length > 0) {
    let data = JSON.parse(rows4[0].setting_value);
    if(data.title) {
        data.title = 'Portofolio<br>proyek kami';
    }
    await connection.query(`UPDATE settings SET setting_value = ? WHERE section = 'projects'`, [JSON.stringify(data)]);
    console.log('Updated projects');
  }
  
  const [rows5] = await connection.query(`SELECT setting_value FROM settings WHERE section = 'timeline'`);
  if (rows5.length > 0) {
    let data = JSON.parse(rows5[0].setting_value);
    data.title = 'Pengembangan<br>Proses';
    data.subtitle = 'Langkah demi langkah proses pengembangan website kami untuk memastikan proyek Anda selesai tepat waktu dengan kualitas tinggi.';
    await connection.query(`UPDATE settings SET setting_value = ? WHERE section = 'timeline'`, [JSON.stringify(data)]);
    console.log('Updated timeline');
  }

  await connection.end();
}

run().catch(console.error);
