const { pool } = require('./src/config/db');
Promise.all([
  pool.query("ALTER TABLE orders ADD COLUMN discount DECIMAL(15,2) DEFAULT 0"),
  pool.query("ALTER TABLE orders ADD COLUMN tax_pct DECIMAL(5,2) DEFAULT 0")
])
.then(() => { console.log('Columns added.'); process.exit(0); })
.catch(err => { console.log('Already exists or error:', err.message); process.exit(0); });
