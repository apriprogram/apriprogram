const fs = require('fs');

let content = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8');

const newGrid = `        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
          <!-- Card 1: Pengguna (Insights style) -->
          <div class="bg-white dark:bg-brand-card rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div>
              <div class="flex justify-between items-center mb-6">
                <h4 class="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">Total Pengguna</h4>
                <div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span class="text-[11px] font-semibold text-slate-500">Weekly</span>
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <div class="mb-2">
                <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1 block">User Growth</span>
                <div class="flex items-start gap-1.5">
                  <h3 class="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tighter" id="stat-users">-</h3>
                  <svg class="w-4 h-4 text-orange-500 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 19L19 5M19 5v10M19 5H9"></path></svg>
                </div>
              </div>
            </div>

            <!-- SVG Chart -->
            <div class="absolute inset-x-0 bottom-24 h-28 pointer-events-none px-6">
              <svg viewBox="0 0 300 100" class="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-orange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f97316" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 80 L 100 20 L 250 20 L 250 100 L 0 100 Z" fill="url(#grad-orange)" />
                <path d="M0 80 L 100 20 L 250 20" fill="none" stroke="#f97316" stroke-width="3" stroke-linejoin="round" />
                <circle cx="250" cy="20" r="5" fill="#f97316" stroke="#fff" stroke-width="2.5" />
                <line x1="250" y1="25" x2="250" y2="100" stroke="#f97316" stroke-width="1.5" stroke-dasharray="3,3" stroke-opacity="0.4" />
              </svg>
            </div>

            <!-- Footer -->
            <div class="mt-auto pt-6 flex justify-between items-end relative z-10">
              <p class="text-[11px] font-medium text-slate-400 dark:text-slate-500 max-w-[130px] leading-relaxed">Expect your users to rise and shine before this month closes.</p>
              <button class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </button>
            </div>
            
            <!-- Indicators like image bottom -->
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-30">
              <div class="w-2.5 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-800 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
            </div>
          </div>
          
          <!-- Card 2: Pesanan (Conversion style) -->
          <div class="bg-white dark:bg-brand-card rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div>
              <div class="flex justify-between items-center mb-6">
                <h4 class="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">Total Pesanan</h4>
                <div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span class="text-[11px] font-semibold text-slate-500">Weekly</span>
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <div class="mb-2">
                <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1 block">Order Rate</span>
                <div class="flex items-start gap-1.5">
                  <h3 class="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tighter" id="stat-orders">-</h3>
                  <svg class="w-4 h-4 text-blue-500 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 19L19 5M19 5v10M19 5H9"></path></svg>
                </div>
              </div>
            </div>

            <div class="absolute inset-x-0 bottom-24 h-28 pointer-events-none px-4">
              <svg viewBox="0 0 300 100" class="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path d="M0 70 C 60 70, 90 20, 150 20 C 210 20, 240 80, 300 80" fill="none" stroke="#3b82f6" stroke-width="14" stroke-linecap="round" stroke-opacity="0.15" filter="url(#glow-blue)" />
                <path d="M0 70 C 60 70, 90 20, 150 20 C 210 20, 240 80, 300 80" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" />
                <circle cx="150" cy="20" r="8" fill="#3b82f6" filter="url(#glow-blue)" />
                <circle cx="150" cy="20" r="4" fill="#60a5fa" />
              </svg>
            </div>

            <div class="mt-auto pt-6 flex justify-between items-end relative z-10">
              <p class="text-[11px] font-medium text-slate-400 dark:text-slate-500 max-w-[130px] leading-relaxed">Orders set to rise this month.</p>
              <button class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </button>
            </div>
            
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-30">
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-800 rounded-full"></div>
              <div class="w-2.5 h-1 bg-slate-300 rounded-full"></div>
            </div>
          </div>

          <!-- Card 3: Status Pesanan (ROI minimal style) -->
          <div class="bg-white dark:bg-brand-card rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div>
              <div class="flex justify-between items-center mb-6">
                <h4 class="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">Status Pesanan</h4>
                <div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span class="text-[11px] font-semibold text-slate-500">Breakdown</span>
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <div class="mb-4">
                <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1 block">Total Orders</span>
                <div class="flex items-start gap-1.5">
                  <h3 class="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tighter" id="stat-status-total">-</h3>
                  <svg class="w-4 h-4 text-emerald-500 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 19L19 5M19 5v10M19 5H9"></path></svg>
                </div>
              </div>
            </div>

            <!-- Custom minimalist list for breakdown -->
            <div class="space-y-3.5 z-10 relative mt-2 pb-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2 h-2 rounded-full bg-slate-300"></div>
                  <span class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Pending</span>
                </div>
                <span class="text-[14px] font-extrabold text-slate-800 dark:text-slate-200" id="stat-pending">0</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  <span class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Proses</span>
                </div>
                <span class="text-[14px] font-extrabold text-slate-800 dark:text-slate-200" id="stat-proses">0</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                  <span class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Revisi</span>
                </div>
                <span class="text-[14px] font-extrabold text-slate-800 dark:text-slate-200" id="stat-revisi">0</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <span class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Selesai</span>
                </div>
                <span class="text-[14px] font-extrabold text-slate-800 dark:text-slate-200" id="stat-selesai">0</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-2 h-2 rounded-full bg-red-400"></div>
                  <span class="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Batal</span>
                </div>
                <span class="text-[14px] font-extrabold text-slate-800 dark:text-slate-200" id="stat-batal">0</span>
              </div>
            </div>

            <!-- Soft gradient orb (like the ROI image) -->
            <div class="absolute -right-8 top-1/3 w-40 h-40 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-30">
              <div class="w-1 h-1 bg-slate-800 rounded-full"></div>
              <div class="w-2.5 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
            </div>
          </div>

          <!-- Card 4: Pengunjung -->
          <div class="bg-white dark:bg-brand-card rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div>
              <div class="flex justify-between items-center mb-6">
                <h4 class="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">Total Pengunjung</h4>
                <div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span class="text-[11px] font-semibold text-slate-500">Weekly</span>
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <div class="mb-2">
                <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1 block">Website Traffic</span>
                <div class="flex items-start gap-1.5">
                  <h3 class="text-[44px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tighter" id="stat-visitors">-</h3>
                  <svg class="w-4 h-4 text-purple-500 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 19L19 5M19 5v10M19 5H9"></path></svg>
                </div>
              </div>
            </div>

            <div class="absolute inset-x-0 bottom-24 h-28 pointer-events-none px-4">
              <svg viewBox="0 0 300 100" class="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path d="M0 90 C 80 90, 120 30, 220 30 C 260 30, 280 60, 300 60" fill="none" stroke="#a855f7" stroke-width="14" stroke-linecap="round" stroke-opacity="0.15" filter="url(#glow-purple)" />
                <path d="M0 90 C 80 90, 120 30, 220 30 C 260 30, 280 60, 300 60" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round" />
                <circle cx="220" cy="30" r="8" fill="#a855f7" filter="url(#glow-purple)" />
                <circle cx="220" cy="30" r="4" fill="#d8b4fe" />
              </svg>
            </div>

            <div class="mt-auto pt-6 flex justify-between items-end relative z-10">
              <p class="text-[11px] font-medium text-slate-400 dark:text-slate-500 max-w-[130px] leading-relaxed">Website traffic is steadily increasing over time.</p>
              <button class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-purple-500 hover:bg-purple-50 transition-colors shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </button>
            </div>
            
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-30">
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div class="w-2.5 h-1 bg-slate-800 rounded-full"></div>
            </div>
          </div>
        </div>`;

const gridRegex = /<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">[\s\S]*?<!-- Settings Tab -->/m;
content = content.replace(gridRegex, newGrid + '\n      </div>\n\n      <!-- Settings Tab -->');

fs.writeFileSync('views/admin/dashboard.ejs', content);
console.log("Premium stats built!");
