const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs', 'utf-8');
const lines = content.split('\n');
const match = lines.findIndex(l => l.includes('const about = JSON.parse(setting.setting_value)'));
if (match !== -1) {
    console.log(lines.slice(match - 5, match + 15).join('\n'));
} else {
    console.log('JSON parse for about not found');
}
