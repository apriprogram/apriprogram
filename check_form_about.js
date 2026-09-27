const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/tabs/settings.ejs', 'utf-8');
const lines = content.split('\n');
const match = lines.findIndex(l => l.includes('id="form-about"'));
if (match !== -1) {
    console.log(lines.slice(Math.max(0, match - 5), match + 50).join('\n'));
} else {
    console.log('Not found form-about');
}
