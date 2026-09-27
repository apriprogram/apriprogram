import sys

def process_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        changed = False

        desktop_nav_old = '''        <a href="#services" class="hover:text-slate-900 dark:hover:text-white transition-colors">Layanan</a>
        <a href="/portfolio" class="hover:text-slate-900 dark:hover:text-white transition-colors">Portfolio</a>
        <a href="#faq" class="hover:text-slate-900 dark:hover:text-white transition-colors notranslate" translate="no">FAQ</a>
        <a href="#contact" class="hover:text-slate-900 dark:hover:text-white transition-colors">Kontak</a>'''

        desktop_nav_old_2 = '''        <a href="/about" class="text-slate-900 dark:text-white hover:text-slate-900 dark:hover:text-white transition-colors">Tentang</a>
        <a href="/#services" class="hover:text-slate-900 dark:hover:text-white transition-colors">Layanan</a>
        <a href="/portfolio" class="text-slate-900 dark:text-white hover:text-slate-900 dark:hover:text-white transition-colors">Portfolio</a>
        <a href="/#faq" class="hover:text-slate-900 dark:hover:text-white transition-colors notranslate" translate="no">FAQ</a>
        <a href="/#contact" class="hover:text-slate-900 dark:hover:text-white transition-colors">Kontak</a>'''

        mobile_nav_old = '''        <a href="#services" class="hover:text-brand-blue dark:hover:text-white transition-colors">Layanan</a>
        <a href="/portfolio" class="hover:text-brand-blue dark:hover:text-white transition-colors">Portfolio</a>
        <a href="#faq" class="hover:text-brand-blue dark:hover:text-white transition-colors notranslate" translate="no">FAQ</a>
        <a href="#contact" class="hover:text-brand-blue dark:hover:text-white transition-colors">Kontak</a>'''

        mobile_nav_old_2 = '''        <a href="/about" class="text-brand-blue font-semibold">Tentang</a>
        <a href="/#services" class="hover:text-brand-blue dark:hover:text-white transition-colors">Layanan</a>
        <a href="/portfolio" class="hover:text-brand-blue dark:hover:text-white transition-colors">Portfolio</a>
        <a href="/#faq" class="hover:text-brand-blue dark:hover:text-white transition-colors notranslate" translate="no">FAQ</a>
        <a href="/#contact" class="hover:text-brand-blue dark:hover:text-white transition-colors">Kontak</a>'''
        
        # We know some variations exist, let's just find and replace using regex
        import re
        
        # For index.ejs the links might be #about, /about, etc.
        # Let's search for the pattern
        
        # If this is index.ejs we might have JS that sets the links
        pass

    except Exception as e:
        print(f"Error reading {filename}: {e}")

process_file('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/index.ejs')
process_file('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/portfolio.ejs')
process_file('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/services.ejs')
