const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs', 'utf-8');
const lines = content.split('\n');
const match = lines.findIndex(l => l.includes('function updateImagePreview('));
console.log(lines.slice(match, match + 25).join('\n'));
