const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/src/server.js', 'utf-8');
const lines = content.split('\n');
const match = lines.findIndex(l => l.includes('3000') || l.includes('listen') || l.includes('PORT'));
if (match !== -1) {
    console.log(lines.slice(Math.max(0, match - 5), match + 10).join('\n'));
}
