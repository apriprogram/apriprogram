const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'apriprogram_db'
  });

  const newTexts = {
    services: { title: 'Layanan Kami', subtitle: 'Pilih solusi digital terbaik untuk meningkatkan kualitas bisnis Anda.' },
    projects: { title: 'Portfolio Proyek', subtitle: 'Beberapa hasil karya terbaik yang pernah kami kerjakan.' },
    timeline: { title: 'Proses Kerja', subtitle: 'Langkah-langkah terstruktur dari awal hingga website siap digunakan.' },
    faq: { title: 'Tanya Jawab', subtitle: 'Pertanyaan yang sering diajukan mengenai layanan kami.' },
    cta: { title: 'Mulai Proyek Anda', subtitle: 'Hubungi kami sekarang untuk mewujudkan ide digital Anda.' }
  };

  for (const [section, texts] of Object.entries(newTexts)) {
    await connection.query("UPDATE settings SET setting_value = ? WHERE section = ? AND setting_key = 'title'", [texts.title, section]);
    await connection.query("UPDATE settings SET setting_value = ? WHERE section = ? AND setting_key = 'subtitle'", [texts.subtitle, section]);
    console.log('Updated ' + section);
  }

  // update about
  const [aboutRows] = await connection.query("SELECT setting_value FROM settings WHERE section = 'about' AND setting_key = 'about'");
  if (aboutRows.length > 0) {
    try {
      const data = JSON.parse(aboutRows[0].setting_value || '{}');
      data.title = 'Tentang Developer';
      data.subtitle = 'Mengenal lebih dekat siapa di balik layanan pembuatan website ini.';
      await connection.query("UPDATE settings SET setting_value = ? WHERE section = 'about' AND setting_key = 'about'", [JSON.stringify(data)]);
      console.log('Updated about');
    } catch(e) {}
  }

  await connection.end();
}

updateDB();
