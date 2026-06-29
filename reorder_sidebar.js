const fs = require('fs');

const path = 'views/admin/partials/sidebar.ejs';
let content = fs.readFileSync(path, 'utf-8');

// The new HTML for the sidebar links
const newLinks = `      <button onclick="switchTab('dashboard')" id="nav-dashboard" class="nav-item active w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-card transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        Dasbor
      </button>

      <p class="px-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-6 mb-2 uppercase tracking-wider">Order</p>
      <button onclick="switchTab('orders')" id="nav-orders" class="nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-card transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        Pesanan Masuk
      </button>

      <p class="px-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-6 mb-2 uppercase tracking-wider">Settings</p>
      <button onclick="switchTab('settings')" id="nav-settings" class="nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-card transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
        Site Settings
      </button>
      <button onclick="switchTab('users')" id="nav-users" class="nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-card transition-colors">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        Users
      </button>`;

const startToken = '<div class="flex-1 overflow-y-auto py-4 px-3 space-y-1">';
const endToken = '    <div class="p-4 border-t border-slate-200 dark:border-brand-border">';

const startIdx = content.indexOf(startToken) + startToken.length;
const endIdx = content.indexOf(endToken);

content = content.substring(0, startIdx) + '\n' + newLinks + '\n    </div>\n\n' + content.substring(endIdx);
fs.writeFileSync(path, content);
console.log('Sidebar reordered');
