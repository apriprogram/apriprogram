-- ============================================================
-- APRIPROGRAM — Database Migration
-- File: database/schema.sql
-- Deskripsi: Buat ulang seluruh tabel dari nol (fresh install)
-- Jalankan: mysql -u root -p apriprogram_db < database/schema.sql
-- ============================================================

-- Gunakan database yang sudah ada (buat manual jika belum ada)
-- CREATE DATABASE IF NOT EXISTS apriprogram_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE apriprogram_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. Tabel: contacts
-- Menyimpan pesan dari form kontak di landing page
-- ------------------------------------------------------------
DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120)  NOT NULL,
  email      VARCHAR(160)  NOT NULL,
  message    TEXT          NOT NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 2. Tabel: users
-- Menyimpan akun pengguna (admin & client)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 3. Tabel: orders
-- Menyimpan pesanan layanan dari klien
-- Status valid: 'Pending DP', 'Proses', 'Revisi', 'Selesai', 'Batal'
-- ------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
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
  project_document TEXT          DEFAULT NULL,  -- path file dokumen (bisa multiple, pisah koma)
  reference_links  TEXT          DEFAULT NULL,
  primary_color    VARCHAR(50)   DEFAULT NULL,
  secondary_color  VARCHAR(50)   DEFAULT NULL,
  typography       VARCHAR(100)  DEFAULT NULL,
  design_style     VARCHAR(100)  DEFAULT NULL,
  payment_proof    TEXT          DEFAULT NULL,  -- path bukti pembayaran
  status           VARCHAR(50)   DEFAULT 'Pending DP',
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 4. Tabel: settings
-- Menyimpan konfigurasi dinamis platform (dikelola via admin)
-- Key format: section + setting_key (misal: 'hero' + 'title_main')
-- Di frontend bind ke element dengan id="{section}-{setting_key}"
-- ------------------------------------------------------------
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  section       VARCHAR(50)   NOT NULL,
  setting_key   VARCHAR(100)  NOT NULL,
  setting_value TEXT          DEFAULT NULL,
  UNIQUE KEY unique_setting (section, setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 5. Tabel: visitors
-- Tracking pengunjung unik harian (per sesi)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS visitors;
CREATE TABLE visitors (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45)   NOT NULL,
  user_agent TEXT          DEFAULT NULL,
  visited_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Tabel: pricelists
-- Menyimpan daftar harga layanan untuk ditampilkan atau dikelola
-- ------------------------------------------------------------
DROP TABLE IF EXISTS pricelists;
CREATE TABLE pricelists (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  service_type  VARCHAR(100)  NOT NULL,
  price         VARCHAR(50)   NOT NULL,
  features      TEXT          DEFAULT NULL,
  status        ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SEED DATA — Data awal wajib
-- ============================================================

-- Admin default (password: admin123 — GANTI segera di production!)
-- Hash bcrypt dari 'admin123' dengan 10 rounds:
-- $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- Gunakan node migrate.js untuk membuat hash yang sesuai secara otomatis.

-- Default settings konten landing page
INSERT IGNORE INTO settings (section, setting_key, setting_value) VALUES
  ('hero',     'title_main',     'Website Profesional Untuk'),
  ('hero',     'title_gradient', 'Meningkatkan Bisnis Anda'),
  ('hero',     'subtitle',       'Membantu Anda membangun landing page, toko online, hingga sistem operasional custom. Desain responsif, SEO-friendly, dan dikembangkan khusus untuk pertumbuhan bisnis Anda.'),
  ('hero',     'cta_text',       'Pesan Sekarang'),
  ('hero',     'cta_link',       '#contact'),
  ('cta',      'title',          'Siap Membangun<br>Sistem Digital?'),
  ('cta',      'subtitle',       'Konsultasikan kebutuhan teknologi Anda sekarang juga. Kami siap merancang solusi digital terbaik.'),
  ('cta',      'button_text',    'Hubungi WhatsApp'),
  ('cta',      'button_link',    '#'),
  ('footer',   'description',    'Membantu perusahaan, agensi, dan startup menciptakan ekosistem digital terbaik yang modern dan fungsional.'),
  ('footer',   'copyright',      '2026 PT. Apriprogram Teknologi. All rights reserved.'),
  ('services', 'title',          'Our services<br>to help you'),
  ('services', 'subtitle',       'Kami menyediakan berbagai layanan digital profesional.'),
  ('services', 'button_text',    'View all services'),
  ('services', 'button_link',    '#contact');
