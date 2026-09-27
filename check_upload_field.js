const fs = require('fs');
const content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/tabs/settings.ejs', 'utf-8');
console.log('about-profile_image exists?', content.includes('about-profile_image'));
console.log('Developer Photo label exists?', content.includes('Developer Photo'));
