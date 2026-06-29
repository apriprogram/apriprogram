const fs = require('fs');
let c = fs.readFileSync('views/admin/dashboard.ejs', 'utf8');
const headerHTML = `        <!-- Dashboard Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, Admin</p>
          </div>
          <a href="/" target="_blank" class="px-4 py-2 bg-[#e6e6e6] hover:bg-[#d4d4d4] dark:bg-slate-800 dark:hover:bg-slate-700 text-black dark:text-white font-medium rounded-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_2px_5px_rgba(0,0,0,0.05)] border border-[#d1d1d1] dark:border-slate-700 transition-all flex items-center gap-2 text-xs shrink-0">
            View Website
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>`;

c = c.replace(/<body class="bg-slate-50/g, '<body class="bg-[#EFEFEF]');
c = c.replace(/<main class="flex-1 flex flex-col min-w-0 bg-slate-50/g, '<main class="flex-1 flex flex-col min-w-0 bg-[#EFEFEF]');
c = c.replace(/<div id="tab-dashboard" class="tab-content space-y-6">\s*<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">/, '<div id="tab-dashboard" class="tab-content space-y-6">\n' + headerHTML + '\n\n        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">');
fs.writeFileSync('views/admin/dashboard.ejs', c);
console.log("Restored final touches!");
