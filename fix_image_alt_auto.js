const fs = require('fs');
let content = fs.readFileSync('views/admin/scripts/settings-page.ejs', 'utf-8');
content = content.replace(/image_alt:\s*value\('image_alt'\),/g, "image_alt: value('image_alt') || value('title'),");
fs.writeFileSync('views/admin/scripts/settings-page.ejs', content, 'utf-8');
console.log('Successfully updated image_alt to be automatic in settings-page.ejs');
