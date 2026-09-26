const fs = require('fs');
let content = fs.readFileSync('views/admin/tabs/settings.ejs', 'utf-8');

const targetStr = '<label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Description</label>\r\n              <textarea id="project-description" rows="3" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm" placeholder="Penjelasan lengkap tentang project ini"></textarea>';
const targetStrLf = '<label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Description</label>\n              <textarea id="project-description" rows="3" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm" placeholder="Penjelasan lengkap tentang project ini"></textarea>';


const replacement = `<style>
                #project-description-editor h3 { margin-top: 1.25rem; margin-bottom: .5rem; font-size: 1.15rem; font-weight: 600; }
                #project-description-editor p { margin-bottom: 1rem; }
                #project-description-editor ul { margin: 1rem 0; padding-left: 1.5rem; list-style: disc; }
                #project-description-editor ol { margin: 1rem 0; padding-left: 1.5rem; list-style: decimal; }
                #project-description-editor a { color: #243CFF; text-decoration: underline; }
                #project-description-editor b, #project-description-editor strong { font-weight: 600; }
                #project-description-editor i, #project-description-editor em { font-style: italic; }
                #project-description-editor:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
              </style>
              <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Deskripsi Lengkap</label>
              <input type="hidden" id="project-description">
              <div class="rounded-xl border border-slate-200 dark:border-brand-border overflow-hidden bg-slate-50 dark:bg-[#1C1E26]">
                <div class="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-brand-border bg-white dark:bg-[#14151a] px-2 py-2">
                  <button type="button" onclick="formatProjectDescription('bold')" class="px-2 py-1 rounded-md text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">B</button>
                  <button type="button" onclick="formatProjectDescription('italic')" class="px-2 py-1 rounded-md text-xs italic text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">I</button>
                  <button type="button" onclick="formatProjectDescription('insertUnorderedList')" class="px-2 py-1 rounded-md text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">List</button>
                  <button type="button" onclick="formatProjectDescription('formatBlock', 'H3')" class="px-2 py-1 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">H3</button>
                  <button type="button" onclick="insertProjectDescriptionLink()" class="px-2 py-1 rounded-md text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Link</button>
                  <button type="button" onclick="formatProjectDescription('removeFormat')" class="px-2 py-1 rounded-md text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">Clear</button>
                </div>
                <div id="project-description-editor" contenteditable="true" oninput="syncProjectDescriptionEditor()" class="min-h-[140px] w-full px-4 py-3 text-sm leading-relaxed text-slate-900 dark:text-white outline-none" data-placeholder="Penjelasan lengkap tentang project ini"></div>
              </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync('views/admin/tabs/settings.ejs', content, 'utf-8');
  console.log('Replaced targetStr successfully');
} else if (content.includes(targetStrLf)) {
  content = content.replace(targetStrLf, replacement);
  fs.writeFileSync('views/admin/tabs/settings.ejs', content, 'utf-8');
  console.log('Replaced targetStrLf successfully');
} else {
  console.log('Target not found');
}
