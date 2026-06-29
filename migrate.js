/**
 * migrate.js — Apriprogram Database Migration
 *
 * Menjalankan migrasi database menggunakan koneksi yang sama dengan aplikasi.
 * Cara pakai: node migrate.js
 *
 * Opsi:
 *   node migrate.js --fresh   → Hapus & buat ulang semua tabel (HATI-HATI: data hilang!)
 *   node migrate.js           → Buat tabel jika belum ada (aman, data tidak hilang)
 */

const { pool, initDatabase } = require('./src/config/db');
const bcrypt = require('bcrypt');

const isFresh = process.argv.includes('--fresh');

async function dropAllTables() {
  console.log('⚠️  Mode FRESH: Menghapus semua tabel...');
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.query('DROP TABLE IF EXISTS visitors');
  await pool.query('DROP TABLE IF EXISTS settings');
  await pool.query('DROP TABLE IF EXISTS orders');
  await pool.query('DROP TABLE IF EXISTS users');
  await pool.query('DROP TABLE IF EXISTS contacts');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✅ Semua tabel berhasil dihapus.');
}

async function createTables() {
  console.log('🔧 Membuat tabel...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(120)  NOT NULL,
      email      VARCHAR(160)  NOT NULL,
      message    TEXT          NOT NULL,
      created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('  ✔ Tabel contacts');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      email      VARCHAR(160)  NOT NULL UNIQUE,
      password   VARCHAR(255)  NOT NULL,
      full_name  VARCHAR(100)  DEFAULT '',
      whatsapp   VARCHAR(20)   DEFAULT '',
      company    VARCHAR(100)  DEFAULT '',
      country    VARCHAR(50)   DEFAULT '',
      google_id  VARCHAR(255)  DEFAULT NULL,
      avatar     VARCHAR(255)  DEFAULT NULL,
      role       ENUM('super admin', 'admin', 'client') DEFAULT 'client',
      created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('  ✔ Tabel users');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      user_id          INT           NOT NULL,
      website_type     VARCHAR(100)  DEFAULT NULL,
      package_name     VARCHAR(50)   DEFAULT NULL,
      package_price    VARCHAR(50)   DEFAULT NULL,
      project_name     VARCHAR(200)  DEFAULT NULL,
      domain_name      VARCHAR(100)  DEFAULT NULL,
      description      TEXT          DEFAULT NULL,
      features         TEXT          DEFAULT NULL,
      target_date      VARCHAR(50)   DEFAULT NULL,
      notes            TEXT          DEFAULT NULL,
      files            TEXT          DEFAULT NULL,
      project_document TEXT          DEFAULT NULL,
      reference_links  TEXT          DEFAULT NULL,
      primary_color    VARCHAR(50)   DEFAULT NULL,
      secondary_color  VARCHAR(50)   DEFAULT NULL,
      typography       VARCHAR(100)  DEFAULT NULL,
      design_style     VARCHAR(100)  DEFAULT NULL,
      payment_proof    TEXT          DEFAULT NULL,
      status           VARCHAR(50)   DEFAULT 'Pending DP',
      created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('  ✔ Tabel orders');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      section       VARCHAR(50)   NOT NULL,
      setting_key   VARCHAR(100)  NOT NULL,
      setting_value TEXT          DEFAULT NULL,
      UNIQUE KEY unique_setting (section, setting_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('  ✔ Tabel settings');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS visitors (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      ip_address VARCHAR(45)   NOT NULL,
      user_agent TEXT          DEFAULT NULL,
      visited_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('  ✔ Tabel visitors');
}

async function seedData() {
  console.log('\n🌱 Seeding data awal...');

  // Super admin default
  const [existing] = await pool.query("SELECT id FROM users WHERE email = 'apriprogram@gmail.com'");
  if (existing.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      "INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)",
      ['apriprogram@gmail.com', hash, 'Admin Apriprogram', 'super admin']
    );
    console.log('  ✔ Admin default dibuat: apriprogram@gmail.com / admin123');
    console.log('  ⚠️  Segera ganti password admin di production!');
  } else {
    console.log('  → Admin sudah ada, skip.');
  }

  // Default settings
  const defaultSettings = [
    ['hero',     'title_main',     'Website Profesional Untuk'],
    ['hero',     'title_gradient', 'Meningkatkan Bisnis Anda'],
    ['hero',     'subtitle',       'Membantu Anda membangun landing page, toko online, hingga sistem operasional custom.'],
    ['hero',     'cta_text',       'Pesan Sekarang'],
    ['hero',     'cta_link',       '#contact'],
    ['cta',      'title',          'Siap Membangun<br>Sistem Digital?'],
    ['cta',      'subtitle',       'Konsultasikan kebutuhan teknologi Anda sekarang juga.'],
    ['cta',      'button_text',    'Hubungi WhatsApp'],
    ['cta',      'button_link',    '#'],
    ['footer',   'description',    'Membantu perusahaan, agensi, dan startup menciptakan ekosistem digital terbaik.'],
    ['footer',   'copyright',      '2026 PT. Apriprogram Teknologi. All rights reserved.'],
    ['services', 'title',          'Our services<br>to help you'],
    ['services', 'subtitle',       'Kami menyediakan berbagai layanan digital profesional.'],
    ['services', 'button_text',    'View all services'],
    ['services', 'button_link',    '#contact'],
  ];

  for (const [section, key, value] of defaultSettings) {
    await pool.query(
      "INSERT IGNORE INTO settings (section, setting_key, setting_value) VALUES (?, ?, ?)",
      [section, key, value]
    );
  }
  console.log(`  ✔ ${defaultSettings.length} setting default diinsert.`);
}

async function run() {
  try {
    console.log('🚀 Apriprogram Database Migration');
    console.log('=====================================');

    if (isFresh) {
      await dropAllTables();
    }

    await createTables();
    await seedData();

    console.log('\n✅ Migrasi selesai!');
    console.log('   Jalankan server: npm run dev');
  } catch (err) {
    console.error('\n❌ Migrasi gagal:', err.message);
    process.exit(1);
  } finally {
    pool.end();
  }
}

run();
