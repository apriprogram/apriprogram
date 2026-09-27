import re

js_filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs'
with open(js_filename, 'r', encoding='utf-8') as f:
    js_content = f.read()

preview_logic = '''
            if (el) {
              if (el.type === 'checkbox') {
                el.checked = setting.setting_value === 'true';
              } else {
                el.value = setting.setting_value;
              }
              // special handling for image previews
              if (el.id === 'navbar-logo_image') {
                const preview = document.getElementById('navbar-logo_image-preview');
                if (preview && setting.setting_value) preview.src = setting.setting_value;
              }
              if (el.id === 'about-profile_image') {
                const preview = document.getElementById('about-profile_image-preview');
                if (preview && setting.setting_value) preview.src = setting.setting_value;
              }
            }
'''
if "if (el.id === 'about-profile_image')" not in js_content:
    # try replacing the standard el setting logic
    target = '''            if (el) {
              if (el.type === 'checkbox') {
                el.checked = setting.setting_value === 'true';
              } else {
                el.value = setting.setting_value;
              }
            }'''
    js_content = js_content.replace(target, preview_logic)

with open(js_filename, 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Updated load preview logic")
