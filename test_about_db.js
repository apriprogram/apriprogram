const db = require('./src/config/db.js');

async function testAbout() {
    try {
        const pool = db.pool;
        const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = "about"');
        if (rows && rows.length > 0) {
            console.log("About settings found:", rows[0].setting_value);
        } else {
            console.log("About settings not found, inserting a default one...");
            const defaultAbout = {
                is_active: 'true',
                title: 'Halo, Saya',
                developer_name: 'Dede Apriyansah',
                developer_location: 'Kota Metro, Indonesia',
                developer_description: 'Saya berdedikasi untuk membantu bisnis, startup, dan individu mewujudkan ide mereka ke dalam bentuk website yang modern, responsif, dan profesional.'
            };
            await pool.query('INSERT INTO settings (section, setting_key, setting_value) VALUES (?, ?, ?)', ['about', 'about', JSON.stringify(defaultAbout)]);
            console.log("Inserted default about settings");
        }
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
testAbout();
