const db = require('./src/config/db.js');

async function fixNav() {
    try {
        const pool = db.pool;
        const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = "nav_links_data"');
        if (rows && rows.length > 0) {
            let data = JSON.parse(rows[0].setting_value);
            
            // Remove the incorrect one and keep just the correct ones
            data = data.filter(l => !(l.label === 'Tentang' && l.link === '/about'));
            // Remove any other 'Tentang'
            data = data.filter(l => !(l.text === 'Tentang' && l.url === '/about'));
            
            // Add 'Tentang' properly after 'Kontak'
            const newAbout = { text: 'Tentang', url: '/about' };
            let kontakIndex = data.findIndex(l => l.text === 'Kontak' || l.url === '#contact');
            if (kontakIndex !== -1) {
                data.splice(kontakIndex + 1, 0, newAbout);
            } else {
                data.push(newAbout);
            }
            
            console.log("Fixed nav_links_data:", data);
            await pool.query('UPDATE settings SET setting_value = ? WHERE setting_key = "nav_links_data"', [JSON.stringify(data)]);
        }
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
fixNav();
