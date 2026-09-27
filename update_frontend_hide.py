import re

def add_hide_logic(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add id="cta" to CTA section if it's missing (it usually has class="py-24")
    if 'id="cta"' not in content:
        content = re.sub(r'<section class="(relative py-24|py-24)', r'<section id="cta" class="\1', content)

    # In the fetch logic, add navbar and cta logic
    addition = '''
        if (data.settings.navbar) {
          try {
            const navbar = document.getElementById('mainHeader');
            if (navbar) {
               if (data.settings.navbar.is_active === 'false' || data.settings.navbar.is_active === false) {
                  navbar.style.display = 'none';
               } else {
                  navbar.style.display = '';
               }
            }
          } catch(e) {}
        }
        if (data.settings.cta) {
          try {
            const ctaSec = document.getElementById('cta');
            if (ctaSec) {
               if (data.settings.cta.is_active === 'false' || data.settings.cta.is_active === false) {
                  ctaSec.style.display = 'none';
               } else {
                  ctaSec.style.display = '';
               }
            }
            const ctaTitle = document.querySelector('#cta h2');
            const ctaDesc = document.querySelector('#cta p');
            const ctaBtn = document.querySelector('#cta a:last-child');
            if(ctaTitle && data.settings.cta.title) ctaTitle.innerHTML = data.settings.cta.title;
            if(ctaDesc && data.settings.cta.subtitle) ctaDesc.innerHTML = data.settings.cta.subtitle;
            if(ctaBtn && data.settings.cta.button_text) ctaBtn.innerHTML = data.settings.cta.button_text;
            if(ctaBtn && data.settings.cta.button_link) ctaBtn.href = data.settings.cta.button_link;
          } catch(e) {}
        }
'''
    if 'if (data.settings.cta)' not in content:
        # inject just before "if (data.settings.services)" or at the start of fetch
        if 'if (data.settings.services)' in content:
            content = content.replace('if (data.settings.services) {', addition + '        if (data.settings.services) {')
        elif 'if (data.settings.about)' in content: # in about.ejs
            content = content.replace('if (data.settings.about) {', addition + '        if (data.settings.about) {')
        else: # about.ejs has if (about.title) inside the fetch
            # in about.ejs it looks like:
            content = content.replace('const about = data.settings.about;', addition + '        const about = data.settings.about;')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated", filename)

add_hide_logic('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/index.ejs')
add_hide_logic('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/about.ejs')

