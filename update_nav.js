const { pool } = require('./src/config/db');

async function updateNav() {
  try {
    const [rows] = await pool.query("SELECT setting_value FROM settings WHERE section = 'navbar' AND setting_key = 'nav_links_data'");
    if (rows.length > 0) {
      const data = JSON.parse(rows[0].setting_value);
      console.log("Current nav:", data);
      
      // Remove 'Tentang'
      const filteredData = data.filter(item => item.url !== '/about');
      
      // Add 'Tentang' to the end (right of 'Kontak' assuming 'Kontak' is the last one currently)
      filteredData.push({ text: 'Tentang', url: '/about' });
      
      await pool.query("UPDATE settings SET setting_value = ? WHERE section = 'navbar' AND setting_key = 'nav_links_data'", [JSON.stringify(filteredData)]);
      console.log("Updated nav:", filteredData);
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

updateNav();
