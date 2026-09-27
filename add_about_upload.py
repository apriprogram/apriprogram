import re

filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/tabs/settings.ejs'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

upload_field = '''<div class="mb-4">
                    <label class="block text-sm font-medium text-slate-900 dark:text-white mb-1">Developer Photo</label>
                    <div class="flex items-center gap-4">
                      <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-brand-border shrink-0">
                        <img id="about-profile_image-preview" src="/assets/dede.png" alt="Developer Photo" class="w-full h-full object-cover">
                      </div>
                      <div class="flex-1">
                        <input type="text" id="about-profile_image" class="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-brand-border rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white" placeholder="/assets/dede.png">
                        <div class="mt-2 flex gap-2">
                          <input type="file" id="about-profile_image-file" class="hidden" accept="image/*">
                          <button type="button" onclick="document.getElementById('about-profile_image-file').click()" class="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Upload Image</button>
                        </div>
                      </div>
                    </div>
                  </div>'''

if 'id="about-profile_image"' not in content:
    # insert before "Developer Name"
    content = content.replace('<label class="block text-sm font-medium text-slate-900 dark:text-white mb-1">Developer Name</label>', upload_field + '\n                  <label class="block text-sm font-medium text-slate-900 dark:text-white mb-1">Developer Name</label>')

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added photo upload field to settings.ejs")

js_filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs'
with open(js_filename, 'r', encoding='utf-8') as f:
    js_content = f.read()

if "'profile_image'" not in js_content and "about: [" in js_content:
    js_content = js_content.replace("about: ['is_active', 'title', 'subtitle', 'developer_name', 'developer_location', 'developer_profile']", "about: ['is_active', 'title', 'subtitle', 'developer_name', 'developer_location', 'developer_profile', 'profile_image']")

# Add event listener for the file upload in JS
js_upload_logic = '''
    const aboutProfileInput = document.getElementById('about-profile_image-file');
    if(aboutProfileInput) {
      aboutProfileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if(data.success) {
            document.getElementById('about-profile_image').value = data.url;
            document.getElementById('about-profile_image-preview').src = data.url;
            showToast('Foto berhasil diunggah', 'success');
          } else {
            showToast(data.message || 'Gagal mengunggah foto', 'error');
          }
        } catch (err) {
          showToast('Terjadi kesalahan', 'error');
        }
      });
    }
'''
if "aboutProfileInput" not in js_content:
    # Inject it near other event listeners (e.g., logo upload)
    js_content = js_content.replace('document.addEventListener("DOMContentLoaded", () => {', 'document.addEventListener("DOMContentLoaded", () => {' + js_upload_logic)

with open(js_filename, 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Added JS logic for About profile image upload")
