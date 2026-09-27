const fs = require('fs');
let content = fs.readFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/tabs/settings.ejs', 'utf-8');

const navTarget = '<button onclick=\"showSettingSection(\\'footer\\')\" id=\"btn-footer\"';
const navAbout = '<button onclick=\"showSettingSection(\\'about\\')\" id=\"btn-about\" class=\"setting-nav w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-0.5 transition-colors\">About</button>\n            ' + navTarget;
content = content.replace(navTarget, navAbout);

const formTarget = '<!-- Footer Form -->';
const formAbout = \
            <!-- About Form -->
            <form id="form-about" class="setting-form hidden space-y-4">
              <div class="bg-white dark:bg-brand-card p-5 rounded-2xl border border-slate-200 dark:border-brand-border flex flex-col sm:flex-row items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-slate-50 dark:bg-brand-dark flex items-center justify-center text-brand-blue shrink-0 mt-1">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div class="flex-1 space-y-4 w-full">
                  <div class="flex flex-row items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-brand-border">
                    <label class="block text-sm font-medium text-slate-900 dark:text-white">Tampilkan Section About</label>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="about-is_active" class="sr-only peer">
                      <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                  <label class="block text-sm font-medium text-slate-900 dark:text-white mb-1">About Section</label>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Judul</label>
                    <input type="text" id="about-title" class="w-full px-4 py-3 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Deskripsi</label>
                    <textarea id="about-subtitle" rows="2" class="w-full px-4 py-3 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm"></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Developer</label>
                    <input type="text" id="about-developer_name" class="w-full px-4 py-3 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Lokasi Developer</label>
                    <input type="text" id="about-developer_location" class="w-full px-4 py-3 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm">
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Profile Developer</label>
                    <textarea id="about-developer_description" rows="4" class="w-full px-4 py-3 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm"></textarea>
                  </div>
                </div>
              </div>
              <button type="submit" class="hidden">Submit</button>
            </form>
            <!-- Footer Form -->\;
content = content.replace(formTarget, formAbout);

fs.writeFileSync('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/tabs/settings.ejs', content);
console.log('Done!');
