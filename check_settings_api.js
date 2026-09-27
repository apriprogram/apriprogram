const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/src/server.js', 'utf-8');
const lines = content.split('\n');
const match = lines.findIndex(l => l.includes("app.post('/api/admin/settings'"));
console.log(lines.slice(match, match + 30).join('\n'));
