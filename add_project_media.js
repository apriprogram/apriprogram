const fs = require('fs');

// 1. Update settings.ejs
let settingsEjs = fs.readFileSync('views/admin/tabs/settings.ejs', 'utf-8');

const targetHtml = `              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Image Alt</label>
                <input type="text" id="project-image_alt" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm" placeholder="Alt text">
              </div>
            </div>`;

const replacementHtml = `              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Image Alt</label>
                <input type="text" id="project-image_alt" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm" placeholder="Alt text">
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Media Detail Project</label>
              <p class="text-[10px] sm:text-xs text-slate-500 mb-3">Upload foto atau video yang tampil sebagai kartu pada halaman detail project.</p>
              <input type="hidden" id="project-media_items">
              <div id="project-media-list" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3"></div>
              <label class="file-upload-btn inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-brand-border dark:bg-brand-dark dark:text-slate-300 dark:hover:bg-slate-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                Upload Foto / Video
                <input type="file" accept="image/*,video/*" onchange="uploadProjectMediaItem(this)" class="hidden">
              </label>
            </div>`;

settingsEjs = settingsEjs.replace(targetHtml, replacementHtml);
fs.writeFileSync('views/admin/tabs/settings.ejs', settingsEjs, 'utf-8');
console.log('Updated settings.ejs');


// 2. Update settings-page.ejs
let scriptsEjs = fs.readFileSync('views/admin/scripts/settings-page.ejs', 'utf-8');

const jsInjectCode = `
let projectMediaItems = [];

function syncProjectMediaInput() {
  const input = document.getElementById('project-media_items');
  if (input) input.value = JSON.stringify(projectMediaItems);
}

function renderProjectMediaItems() {
  const container = document.getElementById('project-media-list');
  if (!container) return;
  syncProjectMediaInput();

  if (!projectMediaItems.length) {
    container.innerHTML = '<div class="sm:col-span-2 rounded-xl border border-dashed border-slate-200 dark:border-brand-border px-4 py-6 text-center text-xs text-slate-500">Belum ada media detail.</div>';
    return;
  }

  container.innerHTML = projectMediaItems.map((item, index) => \`
    <div class="rounded-xl border border-slate-200 dark:border-brand-border overflow-hidden bg-slate-50 dark:bg-[#14151a]">
      <div class="aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
        \${item.type === 'video'
          ? \`<video src="\${escapeSettingsHtml(item.url)}" class="w-full h-full object-cover" controls></video>\`
          : \`<img src="\${escapeSettingsHtml(item.url)}" class="w-full h-full object-cover" alt="Media \${index + 1}">\`
        }
      </div>
      <div class="p-3 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">\${item.type === 'video' ? 'VIDEO' : 'FOTO'}</span>
          <button type="button" onclick="removeProjectMediaItem(\${index})" class="text-[10px] text-red-500 hover:text-red-600 font-medium">Hapus</button>
        </div>
        <input type="text" value="\${escapeSettingsHtml(item.title || '')}" onchange="updateProjectMediaTitle(\${index}, this.value)" placeholder="Judul media" class="w-full px-3 py-1.5 bg-white dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-lg text-xs outline-none focus:border-brand-blue text-slate-900 dark:text-white">
      </div>
    </div>
  \`).join('');
}

function updateProjectMediaTitle(index, value) {
  if (!projectMediaItems[index]) return;
  projectMediaItems[index].title = value;
  syncProjectMediaInput();
}

function removeProjectMediaItem(index) {
  projectMediaItems.splice(index, 1);
  renderProjectMediaItems();
}

async function uploadProjectMediaItem(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const res = await fetch('/admin/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      projectMediaItems.push({ url: data.url, type: data.type || (file.type.startsWith('video/') ? 'video' : 'image'), title: file.name.replace(/\\.[^/.]+$/, '') });
      renderProjectMediaItems();
    } else {
      alert('Upload failed: ' + (data.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert('Terjadi kesalahan saat upload media');
  }
  input.value = '';
}
`;

scriptsEjs = scriptsEjs.replace('let serviceMediaItems = [];', 'let serviceMediaItems = [];\n' + jsInjectCode);

// Update openProjectModal
const targetOpenNew = `  if (slug) {`;
const replaceOpenNew = `  projectMediaItems = [];
  renderProjectMediaItems();
  if (slug) {`;
scriptsEjs = scriptsEjs.replace(targetOpenNew, replaceOpenNew);

const targetOpenExisting = `      setProjectDescriptionEditor(proj.description || '');`;
const replaceOpenExisting = `      setProjectDescriptionEditor(proj.description || '');
      projectMediaItems = Array.isArray(proj.media_items) ? proj.media_items : [];
      renderProjectMediaItems();`;
scriptsEjs = scriptsEjs.replace(targetOpenExisting, replaceOpenExisting);

// Add media_items to saveProjectItem
const saveTargetStr = `const data = {
    original_key: document.getElementById('project-original-key').value,
    title: document.getElementById('project-title').value,`;
const saveReplaceStr = `const data = {
    original_key: document.getElementById('project-original-key').value,
    media_items: projectMediaItems,
    title: document.getElementById('project-title').value,`;
scriptsEjs = scriptsEjs.replace(saveTargetStr, saveReplaceStr);


fs.writeFileSync('views/admin/scripts/settings-page.ejs', scriptsEjs, 'utf-8');
console.log('Updated settings-page.ejs');
