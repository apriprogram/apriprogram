const mysql = require('mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apriprogram_db'
  });

  // Services section
  await db.execute(
    `UPDATE settings SET setting_value = ? WHERE section = 'services' AND setting_key = 'subtitle'`,
    ['Layanan kami untuk membantu Anda']
  );
  await db.execute(
    `UPDATE settings SET setting_value = ? WHERE section = 'services' AND setting_key = 'button_text'`,
    ['Lihat semua layanan']
  );

  // Projects section
  await db.execute(
    `UPDATE settings SET setting_value = ? WHERE section = 'projects' AND setting_key = 'title'`,
    ['Portofolio proyek kami']
  );

  // Timeline section
  await db.execute(
    `UPDATE settings SET setting_value = ? WHERE section = 'timeline' AND setting_key = 'title'`,
    ['Proses Pengembangan Kami']
  );
  await db.execute(
    `UPDATE settings SET setting_value = ? WHERE section = 'timeline' AND setting_key = 'subtitle'`,
    ['Proses langkah demi langkah pengembangan website kami untuk memastikan proyek Anda diselesaikan tepat waktu dengan kualitas tinggi.']
  );

  // FAQ section
  await db.execute(
    `UPDATE settings SET setting_value = ? WHERE section = 'faq' AND setting_key = 'title'`,
    ['Jawaban untuk pertanyaan utama Anda']
  );

  console.log('Database updated successfully.');
  process.exit(0);
}

main().catch(console.error);
