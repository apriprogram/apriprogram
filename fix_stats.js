const fs = require('fs');
let content = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8');

const newGrid = `        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Stat Card 1 -->
          <div class="bg-white dark:bg-brand-card rounded-2xl border border-slate-200 dark:border-brand-border relative overflow-hidden group shadow-sm">
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
          </div>
          
          <!-- Stat Card 2 -->
          <div class="bg-white dark:bg-brand-card rounded-2xl border border-slate-200 dark:border-brand-border relative overflow-hidden group shadow-sm">
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
          </div>

          <!-- Stat Card 3 (Status Pesanan) -->
          <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border border-slate-200 dark:border-brand-border shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Status Pesanan</p>
              <span class="text-xs font-bold text-slate-800 dark:text-white" id="stat-status-total">-</span>
            </div>
            <div class="space-y-2.5">
              <div>
                <div class="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                  <span>Pending</span><span id="stat-pending">0</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5"><div id="bar-pending" class="bg-orange-400 h-1.5 rounded-full" style="width: 0%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                  <span>Proses</span><span id="stat-proses">0</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5"><div id="bar-proses" class="bg-blue-400 h-1.5 rounded-full" style="width: 0%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                  <span>Revisi</span><span id="stat-revisi">0</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5"><div id="bar-revisi" class="bg-yellow-400 h-1.5 rounded-full" style="width: 0%"></div></div>
              </div>
              <div class="flex gap-2">
                <div class="flex-1">
                  <div class="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                    <span>Selesai</span><span id="stat-selesai">0</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5"><div id="bar-selesai" class="bg-green-400 h-1.5 rounded-full" style="width: 0%"></div></div>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                    <span>Batal</span><span id="stat-batal">0</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5"><div id="bar-batal" class="bg-red-400 h-1.5 rounded-full" style="width: 0%"></div></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stat Card 4 (Visitors) -->
          <div class="bg-white dark:bg-brand-card p-6 rounded-2xl border border-slate-200 dark:border-brand-border relative overflow-hidden group shadow-sm">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Total Pengunjung</p>
            <div class="flex items-end gap-3">
              <h3 class="text-5xl font-bold text-slate-900 dark:text-white tracking-tight" id="stat-visitors">-</h3>
            </div>
          </div>
        </div>`;

const gridRegex = /<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">[\s\S]*?<!-- Settings Tab -->/m;
content = content.replace(gridRegex, newGrid + '\n      </div>\n\n      <!-- Settings Tab -->');

const loadStatsFunc = `
    async function loadDashboardStats() {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        const data = await res.json();
        if (data.success) {
          document.getElementById('stat-users').innerText = data.stats.users;
          document.getElementById('stat-orders').innerText = data.stats.orders;
          document.getElementById('stat-status-total').innerText = data.stats.total_orders;
          
          const st = data.stats.statuses;
          document.getElementById('stat-pending').innerText = st['pending dp'] || 0;
          document.getElementById('stat-proses').innerText = st['proses'] || 0;
          document.getElementById('stat-revisi').innerText = st['revisi'] || 0;
          document.getElementById('stat-selesai').innerText = st['selesai'] || 0;
          document.getElementById('stat-batal').innerText = st['batal'] || 0;
          
          const tot = data.stats.total_orders || 1;
          document.getElementById('bar-pending').style.width = ((st['pending dp'] || 0) / tot * 100) + '%';
          document.getElementById('bar-proses').style.width = ((st['proses'] || 0) / tot * 100) + '%';
          document.getElementById('bar-revisi').style.width = ((st['revisi'] || 0) / tot * 100) + '%';
          document.getElementById('bar-selesai').style.width = ((st['selesai'] || 0) / tot * 100) + '%';
          document.getElementById('bar-batal').style.width = ((st['batal'] || 0) / tot * 100) + '%';

          document.getElementById('stat-visitors').innerText = data.stats.visitors;
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    }

    // Initial load for dashboard stats
    loadDashboardStats();
    loadUsers();
  </script>`;

content = content.replace(`    // Initial load for dashboard stats\n    loadUsers();\n  </script>`, loadStatsFunc);

fs.writeFileSync('views/admin/dashboard.ejs', content);
console.log("Restored stats!");
