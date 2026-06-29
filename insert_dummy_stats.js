const mysql = require('mysql2/promise');

async function run() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'apriprogram_db'
    });

    console.log("Adding fake visitors, users, and orders...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert 5 visitors for today
    for(let i=0; i<5; i++) {
      await pool.query("INSERT INTO visitors (ip_address, user_agent, visited_at) VALUES (?, ?, NOW())", ['127.0.0.1', 'Fake Browser']);
    }

    // Insert 3 users for today
    for(let i=0; i<3; i++) {
      await pool.query("INSERT INTO users (email, password, role, created_at) VALUES (?, 'pass', 'client', NOW())", [`fake_client_${Date.now()}_${i}@test.com`]);
    }

    // Insert 4 orders for today
    const statuses = ['Pending DP', 'Proses', 'Revisi', 'Selesai', 'Batal'];
    for(let i=0; i<4; i++) {
      const status = statuses[i % statuses.length];
      await pool.query("INSERT INTO orders (user_id, project_name, status, created_at) VALUES (1, 'Fake Project', ?, NOW())", [status]);
    }

    console.log("Dummy data inserted successfully!");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

run();
