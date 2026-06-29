const bcrypt = require('bcrypt');
const { pool } = require('./src/config/db');

async function seed() {
  try {
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Create 4 dummy users
    const users = [
      { email: 'budi.jaya@example.com', full_name: 'Budi Jaya', whatsapp: '+6281234567801', company: 'PT Maju Bersama', country: 'Indonesia' },
      { email: 'siti.amalia@example.com', full_name: 'Siti Amalia', whatsapp: '+6281234567802', company: 'Amalia Boutique', country: 'Indonesia' },
      { email: 'jhon.doe@company.com', full_name: 'John Doe', whatsapp: '+1234567890', company: 'Tech Innovators Inc.', country: 'USA' },
      { email: 'rudi.hartono@corp.id', full_name: 'Rudi Hartono', whatsapp: '+6281234567803', company: 'CV Karya Abadi', country: 'Indonesia' }
    ];

    const userIds = [];
    for (const u of users) {
      const [result] = await pool.query(
        `INSERT INTO users (email, password, role, full_name, whatsapp, company, country, avatar) 
         VALUES (?, ?, 'client', ?, ?, ?, ?, '')`,
        [u.email, passwordHash, u.full_name, u.whatsapp, u.company, u.country]
      );
      userIds.push(result.insertId);
    }

    console.log('4 Dummy users inserted.');

    // Create 4 dummy orders based on the inserted users
    const orders = [
      {
        user_id: userIds[0],
        website_type: 'Company Profile',
        package_name: 'Premium Corporate',
        project_name: 'Maju Bersama Corporate Website',
        domain_name: 'majubersama.com',
        package_price: '5500000',
        target_date: '2026-08-15',
        start_date: '2026-07-01',
        primary_color: '#1E3A8A',
        secondary_color: '#F59E0B',
        design_style: 'Modern, Profesional, Clean',
        status: 'Proses'
      },
      {
        user_id: userIds[1],
        website_type: 'E-Commerce / Toko Online',
        package_name: 'Pro E-Commerce',
        project_name: 'Amalia Fashion Store',
        domain_name: 'amaliaboutique.id',
        package_price: '8500000',
        target_date: '2026-09-01',
        start_date: '2026-07-10',
        primary_color: '#BE185D',
        secondary_color: '#FDF2F8',
        design_style: 'Feminine, Elegan, Minimalis',
        status: 'Pending DP'
      },
      {
        user_id: userIds[2],
        website_type: 'Web Application / SaaS',
        package_name: 'Custom Enterprise',
        project_name: 'Tech Innovators Dashboard',
        domain_name: 'app.techinnovators.com',
        package_price: '25000000',
        target_date: '2026-11-20',
        start_date: '2026-06-15',
        primary_color: '#0F172A',
        secondary_color: '#38BDF8',
        design_style: 'Dark Mode, High-tech, Dashboard',
        status: 'Proses'
      },
      {
        user_id: userIds[3],
        website_type: 'Landing Page',
        package_name: 'Basic Landing',
        project_name: 'Promo Karya Abadi',
        domain_name: 'promo.karyaabadi.co.id',
        package_price: '2500000',
        target_date: '2026-07-10',
        start_date: '2026-07-01',
        primary_color: '#16A34A',
        secondary_color: '#FFFFFF',
        design_style: 'Sales-oriented, To the point, Clean',
        status: 'Revisi'
      }
    ];

    for (const o of orders) {
      await pool.query(
        `INSERT INTO orders (user_id, website_type, package_name, project_name, domain_name, package_price, target_date, start_date, primary_color, secondary_color, design_style, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [o.user_id, o.website_type, o.package_name, o.project_name, o.domain_name, o.package_price, o.target_date, o.start_date, o.primary_color, o.secondary_color, o.design_style, o.status]
      );
    }
    console.log('4 Dummy orders inserted.');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
