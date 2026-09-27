import re

js_filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs'
with open(js_filename, 'r', encoding='utf-8') as f:
    js_content = f.read()

target = "about: ['is_active', 'title', 'subtitle', 'developer_name', 'developer_location', 'developer_description']"
replacement = "about: ['is_active', 'title', 'subtitle', 'developer_name', 'developer_location', 'developer_description', 'profile_image']"

if target in js_content:
    js_content = js_content.replace(target, replacement)
    print("Replaced settingsFields about")
else:
    print("Target not found")

with open(js_filename, 'w', encoding='utf-8') as f:
    f.write(js_content)
