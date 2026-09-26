const { pool } = require('./src/config/db');

async function seedSettings() {
  try {
    const services = [
      {
        slug: 'web-company-profile',
        title: 'Website Company Profile',
        short_description: 'Bangun kredibilitas perusahaan Anda dengan website profile profesional.',
        description: 'Layanan pembuatan website company profile untuk meningkatkan profesionalisme dan kepercayaan publik terhadap perusahaan Anda. Desain elegan, responsif, dan mudah dinavigasi.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>',
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=60',
        sort_order: 1,
        status: 'active'
      },
      {
        slug: 'web-ecommerce',
        title: 'Toko Online (E-Commerce)',
        short_description: 'Jual produk Anda secara online dengan platform e-commerce yang aman dan cepat.',
        description: 'Tingkatkan penjualan Anda melalui toko online yang terintegrasi dengan payment gateway dan sistem pengiriman yang lengkap.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
        sort_order: 2,
        status: 'active'
      },
      {
        slug: 'custom-web-app',
        title: 'Aplikasi Web Custom',
        short_description: 'Sistem dan aplikasi berbasis web untuk kebutuhan spesifik bisnis Anda.',
        description: 'Solusi sistem informasi, ERP, CRM, dan dashboard analitik kustom yang dibuat khusus menyesuaikan alur kerja bisnis Anda secara spesifik.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
        sort_order: 3,
        status: 'active'
      },
      {
        slug: 'ui-ux-design',
        title: 'Desain UI/UX',
        short_description: 'Desain antarmuka modern yang berfokus pada kenyamanan pengguna.',
        description: 'Layanan desain UI/UX untuk website dan aplikasi mobile yang estetik, intuitif, dan memberikan pengalaman terbaik bagi pengguna.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
        sort_order: 4,
        status: 'active'
      },
      {
        slug: 'seo-optimization',
        title: 'Optimasi SEO',
        short_description: 'Tingkatkan peringkat website Anda di halaman pertama Google.',
        description: 'Optimasi mesin pencari untuk memastikan website Anda mudah ditemukan oleh calon pelanggan yang mencari produk atau layanan Anda.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60',
        sort_order: 5,
        status: 'active'
      },
      {
        slug: 'api-integration',
        title: 'Integrasi API',
        short_description: 'Hubungkan berbagai sistem untuk otomasi alur kerja Anda.',
        description: 'Layanan pembuatan dan integrasi API pihak ketiga seperti payment gateway, pengiriman, dan layanan cloud untuk kelancaran bisnis.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
        sort_order: 6,
        status: 'active'
      }
    ];

    const projects = [
      {
        slug: 'proj-ecommerce-fashion',
        title: 'Fashion E-Commerce Store',
        category: 'E-Commerce',
        publish_date: '2025-10-15',
        button_text: 'Read details',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
        image_alt: 'Fashion Store',
        sort_order: 1,
        status: 'active',
        description: 'A modern e-commerce platform built for a premium fashion brand, featuring advanced filtering, seamless checkout, and integrated inventory management.'
      },
      {
        slug: 'proj-corporate-law',
        title: 'Firma Hukum & Partner',
        category: 'Company Profile',
        publish_date: '2025-08-22',
        button_text: 'Read details',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=60',
        image_alt: 'Firma Hukum',
        sort_order: 2,
        status: 'active',
        description: 'Professional company profile website for a leading law firm, designed to project authority, trust, and ease of access to legal consultations.'
      },
      {
        slug: 'proj-saas-dashboard',
        title: 'CRM Analytics Dashboard',
        category: 'Web App',
        publish_date: '2025-11-05',
        button_text: 'Read details',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
        image_alt: 'Analytics Dashboard',
        sort_order: 3,
        status: 'active',
        description: 'Custom CRM and analytics dashboard providing real-time data visualization and comprehensive reporting for enterprise clients.'
      },
      {
        slug: 'proj-real-estate',
        title: 'Platform Properti Modern',
        category: 'Marketplace',
        publish_date: '2025-07-12',
        button_text: 'Read details',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60',
        image_alt: 'Real Estate Platform',
        sort_order: 4,
        status: 'active',
        description: 'A comprehensive real estate listing platform with advanced map integrations, virtual tours, and automated booking systems.'
      },
      {
        slug: 'proj-health-clinic',
        title: 'Sistem Informasi Klinik',
        category: 'Web App',
        publish_date: '2025-09-30',
        button_text: 'Read details',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60',
        image_alt: 'Health Clinic',
        sort_order: 5,
        status: 'active',
        description: 'Complete health information system featuring patient management, doctor scheduling, and integrated billing services.'
      },
      {
        slug: 'proj-edutech',
        title: 'Portal Belajar Online',
        category: 'E-Learning',
        publish_date: '2025-12-10',
        button_text: 'Read details',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=60',
        image_alt: 'Edutech Platform',
        sort_order: 6,
        status: 'active',
        description: 'Interactive e-learning platform supporting video courses, live classes, quizzes, and digital certifications.'
      }
    ];

    for (const s of services) {
      await pool.query(
        "INSERT INTO settings (section, setting_key, setting_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        ['service_items', s.slug, JSON.stringify(s)]
      );
    }
    console.log('Inserted 6 services.');

    for (const p of projects) {
      await pool.query(
        "INSERT INTO settings (section, setting_key, setting_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        ['project_items', p.slug, JSON.stringify(p)]
      );
    }
    console.log('Inserted 6 projects.');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedSettings();
