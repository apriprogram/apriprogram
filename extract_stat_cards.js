const fs = require('fs');

const dashboardTabPath = 'views/admin/tabs/dashboard.ejs';
let content = fs.readFileSync(dashboardTabPath, 'utf-8');

// The generic stat card component
const statCardEjs = `<div class="bg-white dark:bg-brand-card rounded-2xl border border-slate-200 dark:border-brand-border relative overflow-hidden group shadow-sm">
  <div class="p-6">
    <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2"><%= title %></p>
    <div class="flex items-end gap-3">
      <h3 class="text-5xl font-bold text-slate-900 dark:text-white tracking-tight" id="<%= idName %>">-</h3>
    </div>
  </div>
  <div class="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
    <svg viewBox="0 0 300 100" class="w-full h-full <%= colorClass %>" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <%- svgPath %>
    </svg>
  </div>
</div>`;
fs.writeFileSync('views/admin/components/stat-card.ejs', statCardEjs);

// Now let's replace the first two cards in tabs/dashboard.ejs with the component include
// Card 1
const card1 = `<div class="bg-white dark:bg-brand-card rounded-2xl border border-slate-200 dark:border-brand-border relative overflow-hidden group shadow-sm">
            <div class="p-6">
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Total Pengguna</p>
              <div class="flex items-end gap-3">
                <h3 class="text-5xl font-bold text-slate-900 dark:text-white tracking-tight" id="stat-users">-</h3>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 300 100" class="w-full h-full text-brand-blue" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M0 80 Q 50 20, 100 60 T 200 40 T 300 10" />
                <circle cx="200" cy="40" r="4.5" fill="currentColor" />
              </svg>
            </div>
          </div>`;

const replace1 = `<%- include('../components/stat-card', {
            title: 'Total Pengguna',
            idName: 'stat-users',
            colorClass: 'text-brand-blue',
            svgPath: '<path d="M0 80 Q 50 20, 100 60 T 200 40 T 300 10" /><circle cx="200" cy="40" r="4.5" fill="currentColor" />'
          }) %>`;

content = content.replace(card1, replace1);

// Card 2
const card2 = `<div class="bg-white dark:bg-brand-card rounded-2xl border border-slate-200 dark:border-brand-border relative overflow-hidden group shadow-sm">
            <div class="p-6">
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Total Pesanan</p>
              <div class="flex items-end gap-3">
                <h3 class="text-5xl font-bold text-slate-900 dark:text-white tracking-tight" id="stat-orders">-</h3>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 300 100" class="w-full h-full text-orange-500" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M0 50 Q 50 100, 120 40 T 220 70 T 300 20" />
                <circle cx="220" cy="70" r="4.5" fill="currentColor" />
              </svg>
            </div>
          </div>`;

const replace2 = `<%- include('../components/stat-card', {
            title: 'Total Pesanan',
            idName: 'stat-orders',
            colorClass: 'text-orange-500',
            svgPath: '<path d="M0 50 Q 50 100, 120 40 T 220 70 T 300 20" /><circle cx="220" cy="70" r="4.5" fill="currentColor" />'
          }) %>`;

content = content.replace(card2, replace2);

fs.writeFileSync(dashboardTabPath, content);
console.log('Cards 1 and 2 extracted');
