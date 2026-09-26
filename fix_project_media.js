const fs = require('fs');

let settingsEjs = fs.readFileSync('views/admin/tabs/settings.ejs', 'utf-8');

// The exact string in the file (using regex to ignore exact whitespace/newlines)
const targetRegex = /<div>\s*<label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1\.5">Image Alt<\/label>\s*<input type="text" id="project-image_alt"[^>]+>\s*<\/div>\s*<\/div>/;

const replacementHtml = `              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Image Alt</label>
                <input type="text" id="project-image_alt" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1C1E26] border border-slate-200 dark:border-brand-border rounded-xl focus:border-brand-blue outline-none text-slate-900 dark:text-white text-sm" placeholder="Alt text">
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Media Detail Project</label>
              <p class="text-[10px] sm:text-xs text-slate-500 mb-3">Upload foto atau video yang tampil sebagai galeri media pada halaman detail project.</p>
              <input type="hidden" id="project-media_items">
              <div id="project-media-list" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3"></div>
              <label class="file-upload-btn inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-brand-border dark:bg-brand-dark dark:text-slate-300 dark:hover:bg-slate-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                Upload Foto / Video
                <input type="file" accept="image/*,video/*" onchange="uploadProjectMediaItem(this)" class="hidden">
              </label>
            </div>`;

if (targetRegex.test(settingsEjs)) {
  settingsEjs = settingsEjs.replace(targetRegex, replacementHtml);
  fs.writeFileSync('views/admin/tabs/settings.ejs', settingsEjs, 'utf-8');
  console.log('Successfully added Media Detail Project to settings.ejs');
} else {
  console.log('Regex did not match anything in settings.ejs');
}

let scriptsEjs = fs.readFileSync('views/admin/scripts/settings-page.ejs', 'utf-8');
const saveTargetRegex = /const data = {\s*original_key: document\.getElementById\('project-original-key'\)\.value,\s*title: document\.getElementById\('project-title'\)\.value,/;
const saveReplacement = `const data = {
    original_key: document.getElementById('project-original-key').value,
    media_items: projectMediaItems,
    title: document.getElementById('project-title').value,`;

if (saveTargetRegex.test(scriptsEjs)) {
  scriptsEjs = scriptsEjs.replace(saveTargetRegex, saveReplacement);
  fs.writeFileSync('views/admin/scripts/settings-page.ejs', scriptsEjs, 'utf-8');
  console.log('Successfully updated save payload in settings-page.ejs');
} else {
  console.log('Could not find save payload in settings-page.ejs');
}

