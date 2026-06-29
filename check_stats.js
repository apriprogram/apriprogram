const mysql = require('mysql2/promise');

async function check() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apriprogram_db'
  });

  const [[usersRows]] = await pool.query(`
    SELECT 
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as harian,
      SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) as mingguan,
      SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as bulanan,
      SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as tahunan
    FROM users WHERE role = 'client'
  `);
  
  const [[ordersRows]] = await pool.query(`
    SELECT 
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as harian,
      SUM(CASE WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) as mingguan,
      SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as bulanan,
      SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as tahunan
    FROM orders
  `);

  const [[visRows]] = await pool.query(`
    SELECT 
      SUM(CASE WHEN DATE(visited_at) = CURDATE() THEN 1 ELSE 0 END) as harian,
      SUM(CASE WHEN YEARWEEK(visited_at, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) as mingguan,
      SUM(CASE WHEN MONTH(visited_at) = MONTH(CURDATE()) AND YEAR(visited_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as bulanan,
      SUM(CASE WHEN YEAR(visited_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as tahunan
    FROM visitors
  `);

  console.log(JSON.stringify({
    users: {
      Harian: Number(usersRows.harian || 0),
      Mingguan: Number(usersRows.mingguan || 0),
      Bulanan: Number(usersRows.bulanan || 0),
      Tahunan: Number(usersRows.tahunan || 0)
    },
    orders: {
      Harian: Number(ordersRows.harian || 0),
      Mingguan: Number(ordersRows.mingguan || 0),
      Bulanan: Number(ordersRows.bulanan || 0),
      Tahunan: Number(ordersRows.tahunan || 0)
    },
    visitors: {
      Harian: Number(visRows.harian || 0),
      Mingguan: Number(visRows.mingguan || 0),
      Bulanan: Number(visRows.bulanan || 0),
      Tahunan: Number(visRows.tahunan || 0)
    }
  }, null, 2));
  
  process.exit(0);
}
check();
