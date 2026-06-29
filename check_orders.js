const { pool } = require('./src/config/db');

async function checkOrders() {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');
    console.log(`Found ${rows.length} orders in the database.`);
  } catch (err) {
    console.error('Error fetching orders:', err);
  } finally {
    pool.end();
  }
}
checkOrders();
