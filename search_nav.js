const fs = require('fs');
const lines = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('<!-- Sidebar -->') || 
      l.includes('<!-- Main Content -->') || 
      l.includes('<!-- Top Nav -->') || 
      l.includes('<!-- Content Area -->')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
