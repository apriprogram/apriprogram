const db = require('./src/config/db.js');

async function updateNav() {
    try {
        const pool = db.pool;
        if (typeof pool.query !== 'function' && !pool.promise) {
            console.log('Using standard query');
        }
        
        let queryFn = pool.query.bind(pool);
        if (pool.promise) {
             queryFn = pool.promise().query.bind(pool.promise());
        }

        const [rows] = await queryFn('SELECT setting_value FROM settings WHERE setting_key = "nav_links_data"');
        if (rows && rows.length > 0) {
            let data = JSON.parse(rows[0].setting_value);
            console.log("Current nav_links_data:", data);
            
            // Reorder to put 'Tentang' after 'Kontak'
            const aboutLink = data.find(l => l.link === '/about' || l.label === 'Tentang');
            data = data.filter(l => l.link !== '/about' && l.label !== 'Tentang');
            
            if (aboutLink) {
                let kontakIndex = data.findIndex(l => l.link === '#contact' || l.link === '/#contact' || l.label === 'Kontak');
                if (kontakIndex !== -1) {
                    data.splice(kontakIndex + 1, 0, aboutLink);
                } else {
                    data.push(aboutLink);
                }
            } else {
                let kontakIndex = data.findIndex(l => l.link === '#contact' || l.link === '/#contact' || l.label === 'Kontak');
                const newAbout = { label: 'Tentang', link: '/about' };
                if (kontakIndex !== -1) {
                    data.splice(kontakIndex + 1, 0, newAbout);
                } else {
                    data.push(newAbout);
                }
            }
            
            console.log("New nav_links_data:", data);
            await queryFn('UPDATE settings SET setting_value = ? WHERE setting_key = "nav_links_data"', [JSON.stringify(data)]);
            console.log("Updated nav_links_data in DB.");
        }
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
updateNav();
