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
    await pool.query("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL");
    await pool.query("ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL");
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
    await pool.query("ALTER TABLE orders ADD COLUMN start_date VARCHAR(50) DEFAULT ''");
    await pool.query("ALTER TABLE orders ADD COLUMN invoice_data LONGTEXT DEFAULT NULL");
    await pool.query("ALTER TABLE orders ADD COLUMN discount DECIMAL(15,2) DEFAULT 0");
    await pool.query("ALTER TABLE orders ADD COLUMN tax_pct DECIMAL(5,2) DEFAULT 0");
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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ip_address VARCHAR(45) NOT NULL,
      user_agent TEXT,
      visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    ['footer', 'copyright', '2026 PT. Apriprogram Teknologi. All rights reserved.'],
    ['services', 'title', 'Our services<br>to help you'],
    ['services', 'subtitle', 'Kami menyediakan berbagai layanan digital profesional, mulai dari desain antarmuka hingga pengembangan sistem yang dirancang khusus untuk pertumbuhan bisnis Anda.'],
    ['services', 'button_text', 'View all services'],
    ['services', 'button_link', '#contact'],
    ['projects', 'title', 'Our projects<br>portfolio'],
    ['projects', 'subtitle', 'Lihat beberapa karya terbaik kami yang telah membantu berbagai bisnis mencapai tujuannya dengan solusi digital modern.']
  ];

  for (const [section, key, value] of defaultSettings) {
    await pool.query(
      "INSERT IGNORE INTO settings (section, setting_key, setting_value) VALUES (?, ?, ?)",
      [section, key, value]
    );
  }

  const defaultServices = [
    {
      title: 'Website Company Profile',
      slug: 'website-company-profile',
      category: 'Web Design',
      short_description: 'Website profil perusahaan yang rapi, cepat, dan siap membangun kepercayaan calon pelanggan.',
      description: 'Layanan pembuatan website company profile untuk menampilkan profil bisnis, layanan, portofolio, kontak, dan kebutuhan branding digital secara profesional.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      publish_date: '2026-05-19',
      button_text: 'Read details',
      button_link: '#contact',
      sort_order: 1,
      status: 'active',
      featured: 'featured',
      meta_title: 'Website Company Profile - Apriprogram',
      meta_description: 'Jasa pembuatan website company profile profesional untuk bisnis, UMKM, sekolah, dan perusahaan.'
    },
    {
      title: 'Aplikasi Web & Dashboard',
      slug: 'aplikasi-web-dashboard',
      category: 'Web App',
      short_description: 'Sistem web dan dashboard custom untuk mengelola data, operasional, dan proses bisnis.',
      description: 'Pengembangan aplikasi web custom, dashboard admin, sistem internal, dan integrasi fitur sesuai alur kerja bisnis Anda.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      publish_date: '2026-05-20',
      button_text: 'Read details',
      button_link: '#contact',
      sort_order: 2,
      status: 'active',
      featured: 'featured',
      meta_title: 'Aplikasi Web dan Dashboard Custom - Apriprogram',
      meta_description: 'Bangun aplikasi web dan dashboard custom untuk kebutuhan operasional bisnis Anda.'
    },
    {
      title: 'Toko Online Custom',
      slug: 'toko-online-custom',
      category: 'E-Commerce',
      short_description: 'Toko online custom yang responsif, mudah digunakan, dan siap mendukung penjualan.',
      description: 'Pembuatan toko online custom dengan katalog produk, halaman transaksi, integrasi pembayaran, dan fitur pendukung e-commerce lainnya.',
      image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=600&q=80',
      publish_date: '2026-05-21',
      button_text: 'Read details',
      button_link: '#contact',
      sort_order: 3,
      status: 'active',
      featured: 'featured',
      meta_title: 'Toko Online Custom - Apriprogram',
      meta_description: 'Jasa pembuatan toko online custom untuk bisnis yang ingin berjualan secara digital.'
    },
    {
      title: 'SEO Optimization',
      slug: 'seo-optimization',
      category: 'Marketing',
      short_description: 'Optimasi struktur website agar lebih mudah ditemukan dan dipahami mesin pencari.',
      description: 'Optimasi SEO teknis, meta tag, struktur konten, performa halaman, dan fondasi website agar lebih siap bersaing di pencarian.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
      publish_date: '2026-05-22',
      button_text: 'Read details',
      button_link: '#contact',
      sort_order: 4,
      status: 'active',
      featured: 'not-featured',
      meta_title: 'SEO Optimization - Apriprogram',
      meta_description: 'Layanan optimasi SEO untuk meningkatkan fondasi pencarian website bisnis Anda.'
    }
  ];

  for (const service of defaultServices) {
    await pool.query(
      "INSERT IGNORE INTO settings (section, setting_key, setting_value) VALUES ('service_items', ?, ?)",
      [service.slug, JSON.stringify(service)]
    );
  }

  const defaultProjects = [
    {
      title: 'Website Company Profile',
      slug: 'website-company-profile',
      category: 'Web Design',
      short_description: 'Bangun kredibilitas digital perusahaan Anda dengan desain yang profesional.',
      description: 'Bangun kredibilitas digital perusahaan Anda dengan desain yang profesional, responsif, dan mencerminkan identitas unik brand Anda.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      image_alt: 'Website Company Profile',
      client_name: 'PT Contoh Makmur',
      technology_stack: 'React, Node.js, Tailwind',
      project_url: 'https://example.com',
      detail_url: '#',
      button_text: 'Lihat detail',
      sort_order: 1,
      status: 'active',
      featured: 'featured',
      meta_title: 'Website Company Profile Project - Apriprogram',
      meta_description: 'Proyek pembuatan website company profile responsif dan profesional.'
    },
    {
      title: 'Aplikasi Web & Dashboard',
      slug: 'aplikasi-web-dashboard',
      category: 'Web App',
      short_description: 'Otomatisasi operasional bisnis dengan sistem manajemen internal.',
      description: 'Otomatisasi operasional bisnis dengan sistem manajemen internal, analitik data real-time, dan antarmuka pengguna yang terstruktur.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      image_alt: 'Aplikasi Web & Dashboard',
      client_name: 'Startup XYZ',
      technology_stack: 'Vue.js, Laravel, MySQL',
      project_url: 'https://example.com/app',
      detail_url: '#',
      button_text: 'Lihat detail',
      sort_order: 2,
      status: 'active',
      featured: 'featured',
      meta_title: 'Web Dashboard Project - Apriprogram',
      meta_description: 'Proyek pengembangan aplikasi web internal dan analitik.'
    },
    {
      title: 'Toko Online Custom',
      slug: 'toko-online-custom',
      category: 'E-Commerce',
      short_description: 'Platform e-commerce yang cepat dan terintegrasi dengan payment gateway.',
      description: 'Tingkatkan konversi penjualan Anda dengan platform e-commerce yang cepat, dapat disesuaikan, dan terintegrasi dengan payment gateway.',
      image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800&q=80',
      image_alt: 'Toko Online E-Commerce',
      client_name: 'Store Global',
      technology_stack: 'Next.js, Node.js, PostgreSQL',
      project_url: 'https://example-store.com',
      detail_url: '#',
      button_text: 'Lihat detail',
      sort_order: 3,
      status: 'active',
      featured: 'featured',
      meta_title: 'E-Commerce Custom Project - Apriprogram',
      meta_description: 'Proyek toko online custom dengan integrasi lengkap payment gateway.'
    }
  ];

  for (const project of defaultProjects) {
    await pool.query(
      "INSERT IGNORE INTO settings (section, setting_key, setting_value) VALUES ('project_items', ?, ?)",
      [project.slug, JSON.stringify(project)]
    );
  }

  const defaultTimelines = [
    {
      step_number: '1',
      step_label: 'Step 1 &bull; Planning & Analysis',
      icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-slate-900 dark:text-white w-4 h-4 sm:w-[18px] sm:h-[18px]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>',
      title: 'Requirement Gathering',
      slug: 'requirement-gathering',
      short_description: 'Kami memulai dengan memahami tujuan bisnis, target audiens, dan kebutuhan fitur spesifik Anda.',
      description: 'Kami memulai dengan memahami tujuan bisnis, target audiens, dan kebutuhan fitur spesifik Anda. Tahap ini memastikan kami membangun solusi yang tepat untuk pertumbuhan bisnis Anda.',
      image: '/assets/timeline/step1.jpg',
      image_alt: 'Planning & Analysis',
      button_text: 'Learn More',
      button_link: '#',
      layout_position: 'left',
      sort_order: 1,
      status: 'active',
      meta_title: 'Timeline - Planning & Analysis',
      meta_description: 'Tahap awal perencanaan proyek dan analisis kebutuhan.'
    },
    {
      step_number: '2',
      step_label: 'Step 2 &bull; Design & Development',
      icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-slate-900 dark:text-white w-4 h-4 sm:w-[18px] sm:h-[18px]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>',
      title: 'UI/UX & Coding',
      slug: 'ui-ux-coding',
      short_description: 'Tim kami mendesain antarmuka yang intuitif lalu menerjemahkannya ke dalam kode.',
      description: 'Tim kami mendesain antarmuka yang intuitif lalu menerjemahkannya ke dalam kode yang bersih dan terstruktur. Anda akan selalu dilibatkan dalam proses revisi hingga hasil sempurna.',
      image: '/assets/timeline/step2.jpg',
      image_alt: 'Design & Development',
      button_text: 'Learn More',
      button_link: '#',
      layout_position: 'right',
      sort_order: 2,
      status: 'active',
      meta_title: 'Timeline - Design & Development',
      meta_description: 'Proses desain antarmuka dan pengembangan kode.'
    },
    {
      step_number: '3',
      step_label: 'Step 3 &bull; Testing & Launch',
      icon: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-slate-900 dark:text-white w-4 h-4 sm:w-[18px] sm:h-[18px]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      title: 'Deployment & Support',
      slug: 'deployment-support',
      short_description: 'Sebelum peluncuran, website melalui uji coba ketat di berbagai perangkat.',
      description: 'Sebelum peluncuran, website melalui uji coba ketat di berbagai perangkat. Setelah rilis, kami memberikan panduan penggunaan serta dukungan pemeliharaan jangka panjang.',
      image: '/assets/timeline/step3.jpg',
      image_alt: 'Testing & Launch',
      button_text: 'Learn More',
      button_link: '#',
      layout_position: 'left',
      sort_order: 3,
      status: 'active',
      meta_title: 'Timeline - Testing & Launch',
      meta_description: 'Uji coba ketat dan rilis proyek ke publik.'
    }
  ];

  for (const timeline of defaultTimelines) {
    await pool.query(
      "INSERT IGNORE INTO settings (section, setting_key, setting_value) VALUES ('timeline_items', ?, ?)",
      [timeline.slug, JSON.stringify(timeline)]
    );
  }

  const defaultFaqs = [
    {
      question: 'Berapa lama waktu yang dibutuhkan untuk membuat website?',
      answer: 'Waktu pengerjaan bergantung pada kompleksitas proyek. Untuk website company profile standar, biasanya memakan waktu 1-2 minggu. Sementara untuk custom web app atau e-commerce bisa memakan waktu 1-3 bulan.',
      slug: 'waktu-pengerjaan',
      sort_order: 1,
      status: 'active'
    },
    {
      question: 'Apakah saya akan mendapatkan akses penuh ke website?',
      answer: 'Ya, setelah proyek selesai dan pembayaran dilunasi, kami akan memberikan akses penuh ke dashboard admin, source code (jika diminta), serta aset desain yang terkait dengan proyek Anda.',
      slug: 'akses-penuh',
      sort_order: 2,
      status: 'active'
    },
    {
      question: 'Bagaimana sistem pembayaran di Apriprogram?',
      answer: 'Kami menerapkan sistem pembayaran bertahap (termin). Umumnya, pembayaran dilakukan dalam 2 atau 3 tahap: DP (Down Payment) sebelum proyek dimulai, pembayaran tengah saat milestone tertentu tercapai, dan pelunasan setelah proyek siap dirilis.',
      slug: 'sistem-pembayaran',
      sort_order: 3,
      status: 'active'
    },
    {
      question: 'Apakah ada biaya tambahan setelah website live?',
      answer: 'Biaya pembuatan sudah termasuk hosting dan domain untuk 1 tahun pertama. Untuk tahun berikutnya, Anda hanya perlu membayar biaya perpanjangan server dan domain. Kami juga menawarkan paket maintenance terpisah jika Anda butuh bantuan update konten dan sistem.',
      slug: 'biaya-tambahan',
      sort_order: 4,
      status: 'active'
    }
  ];

  for (const faq of defaultFaqs) {
    await pool.query(
      "INSERT IGNORE INTO settings (section, setting_key, setting_value) VALUES ('faq_items', ?, ?)",
      [faq.slug, JSON.stringify(faq)]
    );
  }
}
module.exports = {
  pool,
  initDatabase
};
