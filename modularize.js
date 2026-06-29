const fs = require('fs');
const path = require('path');

// 1. Create backup
const backupDir = path.join(__dirname, 'backup_code');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const originalPath = path.join(__dirname, 'views', 'admin', 'dashboard.ejs');
const backupPath = path.join(backupDir, `dashboard_backup_${timestamp}.ejs`);
fs.copyFileSync(originalPath, backupPath);
console.log('Backup created at', backupPath);

// 2. Read lines
const lines = fs.readFileSync(originalPath, 'utf-8').split('\n');

// 3. Find boundaries
const dashboardStart = lines.findIndex(l => l.includes('id="tab-dashboard"'));
const settingsStart = lines.findIndex(l => l.includes('id="tab-settings"'));
const ordersStart = lines.findIndex(l => l.includes('id="tab-orders"'));
const usersStart = lines.findIndex(l => l.includes('id="tab-users"'));
const userModalStart = lines.findIndex(l => l.includes('id="user-modal"'));
const scriptStart = lines.findIndex((l, i) => i > userModalStart && l.includes('<script>'));

console.log('Boundaries:', {
  dashboardStart, settingsStart, ordersStart, usersStart, userModalStart, scriptStart
});

// 4. Extract sections
const getSection = (start, end) => lines.slice(start, end).join('\n');

const dashboardTab = getSection(dashboardStart, settingsStart);
const settingsTab = getSection(settingsStart, ordersStart);
const ordersTab = getSection(ordersStart, usersStart);
const usersTab = getSection(usersStart, userModalStart);
const modals = getSection(userModalStart, scriptStart);

// 5. Create directories
const tabsDir = path.join(__dirname, 'views', 'admin', 'tabs');
const partialsDir = path.join(__dirname, 'views', 'admin', 'partials');
if (!fs.existsSync(tabsDir)) fs.mkdirSync(tabsDir, { recursive: true });
if (!fs.existsSync(partialsDir)) fs.mkdirSync(partialsDir, { recursive: true });

// 6. Write files
fs.writeFileSync(path.join(tabsDir, 'dashboard.ejs'), dashboardTab);
fs.writeFileSync(path.join(tabsDir, 'settings.ejs'), settingsTab);
fs.writeFileSync(path.join(tabsDir, 'orders.ejs'), ordersTab);
fs.writeFileSync(path.join(tabsDir, 'users.ejs'), usersTab);
fs.writeFileSync(path.join(partialsDir, 'modals.ejs'), modals);
console.log('Extracted components created.');

// 7. Rebuild dashboard.ejs
const newDashboardLines = [
  ...lines.slice(0, dashboardStart),
  "      <%- include('tabs/dashboard') %>",
  "      <%- include('tabs/settings') %>",
  "      <%- include('tabs/orders') %>",
  "      <%- include('tabs/users') %>",
  "      <%- include('partials/modals') %>",
  ...lines.slice(scriptStart)
];

fs.writeFileSync(originalPath, newDashboardLines.join('\n'));
console.log('dashboard.ejs updated successfully.');
