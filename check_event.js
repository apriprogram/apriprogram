const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs', 'utf-8');
const lines = content.split('\n');
const match = lines.findIndex(l => l.includes('aboutProfileInput'));
if (match !== -1) {
    console.log(lines.slice(Math.max(0, match - 5), match + 25).join('\n'));
} else {
    console.log('Not found');
}
