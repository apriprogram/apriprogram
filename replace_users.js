const fs = require('fs');
let c = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8');
c = c.replace(/Data Pengguna/g, 'Users');
c = c.replace(/<h3 class="text-2xl font-semibold text-slate-900 dark:text-white">Manajemen Pengguna<\/h3>/g, '<h3 class="text-2xl font-semibold text-slate-900 dark:text-white">Users</h3>');
c = c.replace(/<p class="text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider text-\[11px\] font-bold">Pusat Akses & Otoritas Sistem<\/p>/g, '<p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">Pusat Akses & Otoritas Sistem</p>');
fs.writeFileSync('views/admin/dashboard.ejs', c);
console.log('Done!');
