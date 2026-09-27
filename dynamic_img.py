import re

filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/about.ejs'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Make the image src dynamic
img_tag = '''<img src="/assets/dede.png" alt="Dede Apriyansah" class="w-full h-full object-cover rounded-full" onerror="this.src='https://ui-avatars.com/api/?name=Dede+Apriyansah&background=243CFF&color=fff&size=512'">'''
new_img_tag = '''<img id="dyn-about-image" src="/assets/dede.png" alt="Dede Apriyansah" class="w-full h-full object-cover rounded-full" onerror="this.src='https://ui-avatars.com/api/?name=Dede+Apriyansah&background=243CFF&color=fff&size=512'">'''

content = content.replace(img_tag, new_img_tag)

# Update fetch logic to set the image
fetch_addition = '''
        if (about.profile_image) {
          const imgEl = document.getElementById('dyn-about-image');
          if (imgEl) imgEl.src = about.profile_image;
        }
'''
if 'if (about.profile_image)' not in content:
    content = content.replace('if (about.title) {', fetch_addition + '        if (about.title) {')

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated about.ejs with dynamic profile image logic")
