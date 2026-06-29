const fs = require('fs');
const lines = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="order-modal"') || l.includes('id="user-modal"') || l.includes('<!-- Modals -->')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
