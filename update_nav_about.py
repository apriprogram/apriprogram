import sys

filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/about.ejs'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Desktop Nav Order
desktop_nav_old = '''      <div class="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:flex">
        <a href="/#home" class="hover:text-slate-900 dark:hover:text-white transition-colors">Home</a>
        <a href="/about" class="text-brand-blue font-semibold">Tentang</a>
        <a href="/#services" class="hover:text-slate-900 dark:hover:text-white transition-colors">Layanan</a>
        <a href="/portfolio" class="text-slate-900 dark:text-white hover:text-slate-900 dark:hover:text-white transition-colors">Portfolio</a>
        <a href="/#faq" class="hover:text-slate-900 dark:hover:text-white transition-colors notranslate" translate="no">FAQ</a>
        <a href="/#contact" class="hover:text-slate-900 dark:hover:text-white transition-colors">Kontak</a>
      </div>'''

desktop_nav_new = '''      <div class="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:flex">
        <a href="/#home" class="hover:text-slate-900 dark:hover:text-white transition-colors">Home</a>
        <a href="/#services" class="hover:text-slate-900 dark:hover:text-white transition-colors">Layanan</a>
        <a href="/portfolio" class="text-slate-900 dark:text-white hover:text-slate-900 dark:hover:text-white transition-colors">Portfolio</a>
        <a href="/#faq" class="hover:text-slate-900 dark:hover:text-white transition-colors notranslate" translate="no">FAQ</a>
        <a href="/#contact" class="hover:text-slate-900 dark:hover:text-white transition-colors">Kontak</a>
        <a href="/about" class="text-brand-blue font-semibold">Tentang</a>
      </div>'''

if desktop_nav_old in content:
    content = content.replace(desktop_nav_old, desktop_nav_new)
    print("Desktop nav updated")

# Fix Mobile Nav Order
mobile_nav_old = '''        <a href="/#home" class="hover:text-brand-blue dark:hover:text-white transition-colors">Home</a>
        <a href="/about" class="text-brand-blue font-semibold">Tentang</a>
        <a href="/#services" class="hover:text-brand-blue dark:hover:text-white transition-colors">Layanan</a>
        <a href="/portfolio" class="hover:text-brand-blue dark:hover:text-white transition-colors">Portfolio</a>
        <a href="/#faq" class="hover:text-brand-blue dark:hover:text-white transition-colors notranslate" translate="no">FAQ</a>
        <a href="/#contact" class="hover:text-brand-blue dark:hover:text-white transition-colors">Kontak</a>'''

mobile_nav_new = '''        <a href="/#home" class="hover:text-brand-blue dark:hover:text-white transition-colors">Home</a>
        <a href="/#services" class="hover:text-brand-blue dark:hover:text-white transition-colors">Layanan</a>
        <a href="/portfolio" class="hover:text-brand-blue dark:hover:text-white transition-colors">Portfolio</a>
        <a href="/#faq" class="hover:text-brand-blue dark:hover:text-white transition-colors notranslate" translate="no">FAQ</a>
        <a href="/#contact" class="hover:text-brand-blue dark:hover:text-white transition-colors">Kontak</a>
        <a href="/about" class="text-brand-blue font-semibold">Tentang</a>'''

if mobile_nav_old in content:
    content = content.replace(mobile_nav_old, mobile_nav_new)
    print("Mobile nav updated")

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
