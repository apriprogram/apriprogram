const fs = require('fs');
const path = require('path');

const originalPath = path.join(__dirname, 'views', 'admin', 'dashboard.ejs');
const lines = fs.readFileSync(originalPath, 'utf-8').split('\n');

const sidebarStart = lines.findIndex(l => l.includes('<!-- Sidebar -->'));
const sidebarEnd = lines.findIndex(l => l.includes('<!-- Main Content -->'));
const navbarStart = lines.findIndex(l => l.includes('<!-- Top Nav -->'));
const navbarEnd = lines.findIndex(l => l.includes('<!-- Content Area -->'));

const sidebarContent = lines.slice(sidebarStart, sidebarEnd).join('\n');
const navbarContent = lines.slice(navbarStart, navbarEnd).join('\n');

const partialsDir = path.join(__dirname, 'views', 'admin', 'partials');

fs.writeFileSync(path.join(partialsDir, 'sidebar.ejs'), sidebarContent);
fs.writeFileSync(path.join(partialsDir, 'navbar.ejs'), navbarContent);

const newLines = [
  ...lines.slice(0, sidebarStart),
  "  <%- include('partials/sidebar') %>",
  ...lines.slice(sidebarEnd, navbarStart),
  "    <%- include('partials/navbar') %>",
  ...lines.slice(navbarEnd)
];

fs.writeFileSync(originalPath, newLines.join('\n'));
console.log('Sidebar and Navbar modularized successfully.');
