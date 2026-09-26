const fs = require('fs');
let content = fs.readFileSync('src/controllers/adminController.js', 'utf-8');

const regex = /image_alt: \(body\.image_alt \|\| ""\)\.trim\(\),/g;
const replacement = `image_alt: (body.image_alt || "").trim(),\n    media_items: Array.isArray(body.media_items) ? body.media_items : [],`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/controllers/adminController.js', content, 'utf-8');
  console.log('Successfully updated normalizeProjectPayload');
} else {
  console.log('Could not find target content');
}
