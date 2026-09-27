const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs', 'utf-8');
const lines = content.split('\n');
const match = lines.findIndex(l => l.includes('aboutProfileInput'));
if (match !== -1) {
    console.log("Found event listener for aboutProfileInput!");
} else {
    console.log("Event listener missing!");
}
