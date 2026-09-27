import re

filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/about.ejs'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Add id="about" to the about section if not present
if 'id="about"' not in content:
    content = content.replace('<section class="relative py-20', '<section id="about" class="relative py-20')

# Update fetch logic to hide the section
if "about.is_active === 'false'" not in content:
    logic = '''        if (about.is_active === 'false' || about.is_active === false) {
          const aboutSec = document.getElementById('about');
          if (aboutSec) aboutSec.style.display = 'none';
        } else {
          const aboutSec = document.getElementById('about');
          if (aboutSec) aboutSec.style.display = '';
        }
        if (about.title) {'''
    content = content.replace('if (about.title) {', logic)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated about.ejs logic")
