import re

js_filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs'
with open(js_filename, 'r', encoding='utf-8') as f:
    js_content = f.read()

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
    js_content = js_content.replace('document.addEventListener("DOMContentLoaded", () => {', 'document.addEventListener("DOMContentLoaded", () => {' + js_upload_logic)

with open(js_filename, 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Added JS logic for About profile image upload")
