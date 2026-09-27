const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs', 'utf-8');
const lines = content.split('\n');
console.log(lines.slice(Math.max(0, lines.length - 20)).join('\n'));
