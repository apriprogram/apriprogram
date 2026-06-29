const fs = require('fs');

const path = 'views/admin/dashboard.ejs';
let content = fs.readFileSync(path, 'utf-8');

// For detail-modal
content = content.replace(
  "document.getElementById('detail-modal-content').classList.remove('scale-95');",
  "document.getElementById('detail-modal-content').classList.remove('translate-x-full');"
);
content = content.replace(
  "document.getElementById('detail-modal-content').classList.add('scale-95');",
  "document.getElementById('detail-modal-content').classList.add('translate-x-full');"
);

// For order-modal
content = content.replace(
  "document.getElementById('order-modal-content').classList.remove('scale-95');",
  "document.getElementById('order-modal-content').classList.remove('translate-x-full');"
);
content = content.replace(
  "document.getElementById('order-modal-content').classList.add('scale-95');",
  "document.getElementById('order-modal-content').classList.add('translate-x-full');"
);

fs.writeFileSync(path, content);
console.log('Modals fixed');
