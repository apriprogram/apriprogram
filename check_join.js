const { pool } = require('./src/config/db');

async function checkOrders() {
  try {
    const [rows] = await pool.query('SELECT o.*, u.full_name, u.email, u.whatsapp FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
    console.log(`Found ${rows.length} orders from JOIN query.`);
  } catch (err) {
    console.error('Error fetching orders:', err);
  } finally {
    pool.end();
  }
}
checkOrders();
