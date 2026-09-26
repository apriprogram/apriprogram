const fs = require('fs');
let content = fs.readFileSync('views/admin/scripts/settings-page.ejs', 'utf-8');

const regex = /const payload = \{\s*original_key: document\.getElementById\('project-original-key'\)\.value,\s*title:/g;
const replacement = `const payload = {
    original_key: document.getElementById('project-original-key').value,
    media_items: projectMediaItems,
    title:`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('views/admin/scripts/settings-page.ejs', content, 'utf-8');
  console.log('Successfully updated save payload in settings-page.ejs');
} else {
  console.log('Could not find save payload with regex');
}
