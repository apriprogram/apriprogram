import re

def update_buttons(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update Language button to be outline only
    # Remove bg-slate-100/90, dark:bg-white/10, hover:bg-slate-200/90, dark:hover:bg-white/20
    # Add bg-transparent hover:bg-transparent
    if 'id="languageToggle"' in content:
        content = re.sub(r'bg-slate-[0-9]+/[0-9]+', 'bg-transparent', content)
        content = re.sub(r'dark:bg-white/[0-9]+', 'bg-transparent', content)
        content = re.sub(r'hover:bg-slate-[0-9]+/[0-9]+', 'hover:bg-transparent', content)
        content = re.sub(r'dark:hover:bg-white/[0-9]+', 'hover:bg-transparent', content)
        
        # fix duplicated bg-transparent
        content = re.sub(r'(bg-transparent\s*)+', 'bg-transparent ', content)
        content = re.sub(r'(hover:bg-transparent\s*)+', 'hover:bg-transparent ', content)

    # Hero section 'Pesan Sekarang' button: make it full rounded
    # In index.ejs, it might be <a href="/login?type=register" class="... rounded-2xl ... bg-brand-blue ...">Pesan Sekarang</a>
    # Actually let's look for rounded-xl or rounded-2xl or rounded-lg on "Pesan Sekarang"
    if 'Pesan Sekarang' in content:
        # replace rounded-[something] with rounded-full for the Pesan Sekarang button
        content = re.sub(r'class="([^"]*)rounded-(lg|xl|2xl|3xl)([^"]*)"([^>]*)>([^<]*)Pesan Sekarang',
                         r'class="\1rounded-full\3"\4>\5Pesan Sekarang', content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated buttons in", filename)

update_buttons('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/index.ejs')
update_buttons('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/about.ejs')
update_buttons('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/services.ejs')
update_buttons('e:/WEBSITE/APRIPROGRAM/Apriprogram/views/portfolio.ejs')

