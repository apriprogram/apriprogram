const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "apriprogram_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(160) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('super admin', 'admin', 'client') DEFAULT 'client',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Alter table if 'super admin' is not in ENUM
  try {
    await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('super admin', 'admin', 'client') DEFAULT 'client'");
    await pool.query("UPDATE users SET role = 'super admin' WHERE role = 'admin'");
  } catch(e) {
    console.warn("Could not alter users role enum:", e.message);
  }

  // Add new columns for users
  try {
    await pool.query("ALTER TABLE users ADD COLUMN full_name VARCHAR(100) DEFAULT ''");
    await pool.query("ALTER TABLE users ADD COLUMN whatsapp VARCHAR(20) DEFAULT ''");
    await pool.query("ALTER TABLE users ADD COLUMN company VARCHAR(100) DEFAULT ''");
    await pool.query("ALTER TABLE users ADD COLUMN country VARCHAR(50) DEFAULT ''");
  } catch(e) {
    // Silently ignore if columns exist
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      website_type VARCHAR(100),
      package_name VARCHAR(50),
      package_price VARCHAR(50),
      project_name VARCHAR(200),
      domain_name VARCHAR(100),
      description TEXT,
      features TEXT,
      target_date VARCHAR(50),
      notes TEXT,
      files TEXT,
      project_document VARCHAR(255),
      reference_links TEXT,
      primary_color VARCHAR(50),
      secondary_color VARCHAR(50),
      typography VARCHAR(100),
      design_style VARCHAR(100),
      payment_proof VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Pending DP',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Add new columns for orders if they don't exist
  try {
    await pool.query("ALTER TABLE orders ADD COLUMN project_document VARCHAR(255) DEFAULT ''");
    await pool.query("ALTER TABLE orders ADD COLUMN domain_name VARCHAR(100) DEFAULT ''");
    await pool.query("ALTER TABLE orders ADD COLUMN package_price VARCHAR(50) DEFAULT ''");
  } catch(e) {
    // Silently ignore if columns exist
  }

  // Ensure file columns support longer data for multiple uploads
  try {
    await pool.query("ALTER TABLE orders MODIFY COLUMN project_document TEXT");
    await pool.query("ALTER TABLE orders MODIFY COLUMN payment_proof TEXT");
  } catch(e) {
    console.warn("Could not modify orders columns to TEXT:", e.message);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section VARCHAR(50) NOT NULL,
      setting_key VARCHAR(100) NOT NULL,
      setting_value TEXT,
      UNIQUE KEY unique_setting (section, setting_key)
    )
  `);

  const [adminUsers] = await pool.query("SELECT id FROM users WHERE email = 'apriprogram@gmail.com'");
  if (adminUsers.length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await pool.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      ['apriprogram@gmail.com', hashedPassword, 'super admin']
    );
    console.log("Default admin user created");
  }

  // Insert 2 example client users
  const clients = [
    { email: 'client1@apriprogram.com', pass: 'client123' },
    { email: 'client2@apriprogram.com', pass: 'client123' }
  ];
  for (let c of clients) {
    const [existingClient] = await pool.query("SELECT id FROM users WHERE email = ?", [c.email]);
    if (existingClient.length === 0) {
      const hashed = await bcrypt.hash(c.pass, 10);
      await pool.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [c.email, hashed, 'client']);
      console.log("Example client created:", c.email);
    }
  }

  // Insert default settings
  const defaultSettings = [
    ['hero', 'title_main', 'Website Profesional Untuk'],
    ['hero', 'title_gradient', 'Meningkatkan Bisnis Anda'],
    ['hero', 'subtitle', 'Membantu Anda membangun landing page, toko online, hingga sistem operasional custom. Desain responsif, SEO-friendly, dan dikembangkan khusus untuk pertumbuhan bisnis Anda.'],
    ['hero', 'cta_text', 'Pesan Sekarang'],
    ['hero', 'cta_link', '#contact'],
    ['cta', 'title', 'Siap Membangun<br>Sistem Digital?'],
    ['cta', 'subtitle', 'Konsultasikan kebutuhan teknologi Anda sekarang juga. Kami siap merancang solusi digital terbaik yang dibentuk dari eksekusi cepat, fokus, dan komitmen pada kualitas.'],
    ['cta', 'button_text', 'Hubungi WhatsApp'],
    ['cta', 'button_link', '#'],
    ['footer', 'description', 'Membantu perusahaan, agensi, dan startup menciptakan ekosistem digital terbaik yang modern dan fungsional.'],
    ['footer', 'copyright', '2026 PT. Apriprogram Teknologi. All rights reserved.']
  ];

  for (const [section, key, value] of defaultSettings) {
    await pool.query(
      "INSERT IGNORE INTO settings (section, setting_key, setting_value) VALUES (?, ?, ?)",
      [section, key, value]
    );
  }
}

module.exports = {
  pool,
  initDatabase
};
