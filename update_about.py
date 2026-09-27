import sys
import re

filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/about.ejs'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Hardcoded Title
content = content.replace(
    '''<h1 class="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6">
              Halo, Saya <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Dede Apriyansah</span>
            </h1>''',
    '''<h1 class="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6" id="dyn-about-title">
              Halo, Saya <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan" id="dyn-about-name">Dede Apriyansah</span>
            </h1>'''
)

# Replace Subtitle 1 & 2
content = content.replace(
    '''<p class="text-base sm:text-lg text-slate-500 dark:text-[#a0a0a0] leading-relaxed mb-4">
              Saya adalah seorang Web Developer yang berbasis di <span class="font-semibold text-slate-700 dark:text-slate-300">Kota Metro, Indonesia</span>. Saya berdedikasi untuk membantu bisnis, startup, dan individu mewujudkan ide mereka ke dalam bentuk website yang modern, responsif, dan profesional.
            </p>''',
    '''<p class="text-base sm:text-lg text-slate-500 dark:text-[#a0a0a0] leading-relaxed mb-4">
              Saya adalah seorang Web Developer yang berbasis di <span class="font-semibold text-slate-700 dark:text-slate-300" id="dyn-about-location">Kota Metro, Indonesia</span>. <span id="dyn-about-desc">Saya berdedikasi untuk membantu bisnis, startup, dan individu mewujudkan ide mereka ke dalam bentuk website yang modern, responsif, dan profesional.</span>
            </p>'''
)

# Add the fetch logic at the end before </body>
script_addition = '''
    // Fetch Settings
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data && data.success && data.settings && data.settings.about) {
        const about = data.settings.about;
        if (about.title) {
          const h1 = document.getElementById('dyn-about-title');
          if(h1) h1.innerHTML = about.title + ' <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan" id="dyn-about-name">' + (about.developer_name || '') + '</span>';
        }
        if (about.developer_location) {
          const loc = document.getElementById('dyn-about-location');
          if(loc) loc.innerHTML = about.developer_location;
        }
        if (about.developer_description) {
          const desc = document.getElementById('dyn-about-desc');
          if(desc) desc.innerHTML = about.developer_description;
        }
      }
    }).catch(console.error);
'''

if "fetch('/api/settings')" not in content:
    content = content.replace('</script>\n  <script src="/js/i18n.js"></script>', script_addition + '\n  </script>\n  <script src="/js/i18n.js"></script>')

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated about.ejs")
