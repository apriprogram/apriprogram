const fs = require('fs');
let content = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8');

// 1. Sidebar CSS & active state
content = content.replace(
  `    /* Sidebar Active State */
    .nav-item.active { background-color: #f1f5f9; color: #3b82f6; }
    .dark .nav-item.active { background-color: #1C1E26; color: #ffffff; }`,
  `    /* Sidebar Active State */
    .nav-item {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-item:hover {
      background-color: #f1f5f9;
      color: #3b82f6;
    }
    .dark .nav-item:hover {
      background-color: #1C1E26;
      color: #ffffff;
    }
    .nav-item.active { 
      background-color: #f1f5f9; 
      color: #3b82f6; 
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.25);
    }
    .dark .nav-item.active { 
      background-color: #1C1E26; 
      color: #ffffff;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.35);
    }

    /* Tab Content Animation */
    @keyframes fadeScaleIn {
      from { opacity: 0; transform: scale(0.99) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .tab-content:not(.hidden) {
      animation: fadeScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }`
);

// 2. Sidebar Header
content = content.replace(
  `        <img src="/assets/logo/apriprogram.png" alt="Apriprogram Logo" class="h-8 w-auto" />
      </div>
      <div>
        <span class="font-semibold text-sm uppercase text-slate-900 dark:text-white tracking-wide block leading-tight mb-1">Apriprogram</span>
        <span class="text-[10px] text-slate-500 font-medium block leading-tight">Admin Panel</span>
      </div>`,
  `        <img src="/assets/logo/apriprogram.png" alt="Apriprogram Logo" class="h-6 w-auto" />
      </div>
      <div>
        <span class="font-medium text-[15px] text-slate-900 dark:text-white block leading-tight tracking-normal">Admin Panel</span>
      </div>`
);

// 3. Sidebar Padding & rounded
content = content.replace(/gap-3 px-4 py-3 rounded-xl/g, 'gap-2.5 px-3 py-2.5 rounded-lg');
// 4. Pesanan modal style: keep new modal applied if this script is rerun
content = content.replace(
  'id="order-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"',
  'id="order-modal" class="fixed inset-0 bg-slate-900/45 z-50 hidden opacity-0 transition-opacity duration-300"'
);
content = content.replace(
  'id="detail-modal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center hidden opacity-0 transition-opacity duration-300"',
  'id="detail-modal" class="fixed inset-0 bg-slate-900/45 z-50 hidden opacity-0 transition-opacity duration-300"'
);
content = content.replace(
  'bg-white dark:bg-brand-card w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-brand-border shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col max-h-[90vh]" id="order-modal-content"',
  'fixed right-0 top-0 h-screen w-full max-w-[720px] bg-white border-l border-slate-200 shadow-[-18px_0_60px_rgba(15,23,42,0.22)] overflow-hidden transform translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col rounded-none" id="order-modal-content"'
);
content = content.replace(
  'bg-white dark:bg-brand-card w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-brand-border shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col max-h-[90vh]" id="detail-modal-content"',
  'fixed right-0 top-0 h-screen w-full max-w-[720px] bg-white border-l border-slate-200 shadow-[-18px_0_60px_rgba(15,23,42,0.22)] overflow-hidden transform translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col rounded-none" id="detail-modal-content"'
);
content = content.replace(/Payment Request/g, 'Detail Pesanan');
content = content.replace(/Send your request payment base on your need\./g, 'Ringkasan data pesanan dan dokumen pendukung klien.');
content = content.replace(/Ubah rincian pesanan dan status proyek/g, 'Kelola rincian pesanan, dokumen, dan status proyek');
fs.writeFileSync('views/admin/dashboard.ejs', content);
console.log("Updated UI!");