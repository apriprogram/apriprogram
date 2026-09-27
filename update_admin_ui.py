import re

filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/tabs/settings.ejs'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Add is_active to Navbar if it doesn't exist
navbar_target = '''<label class="block text-sm font-medium text-slate-900 dark:text-white mb-1">Navbar Settings</label>'''
if "navbar-is_active" not in content:
    navbar_target_replacement = '''<div class="flex flex-row items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-brand-border">
                    <label class="block text-sm font-medium text-slate-900 dark:text-white">Tampilkan Navbar</label>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="navbar-is_active" class="sr-only peer">
                      <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                  <label class="block text-sm font-medium text-slate-900 dark:text-white mb-1">Navbar Settings</label>'''
    # We might need to find where "Navbar Settings" is.
    content = content.replace('''<h4 class="text-sm font-medium text-slate-900 dark:text-white">Navbar Settings</h4>
                    <p class="text-xs text-slate-500">Ubah logo dan menu navigasi pada bagian atas website.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">''',
    '''<h4 class="text-sm font-medium text-slate-900 dark:text-white">Navbar Settings</h4>
                    <p class="text-xs text-slate-500">Ubah logo dan menu navigasi pada bagian atas website.</p>
                  </div>
                </div>

                <div class="flex flex-row items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-brand-border">
                    <label class="block text-sm font-medium text-slate-900 dark:text-white">Tampilkan Navbar</label>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="navbar-is_active" class="sr-only peer">
                      <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">''')

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated settings.ejs for navbar-is_active")

# Update settings-page.ejs to include is_active for navbar
js_filename = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/admin/scripts/settings-page.ejs'
with open(js_filename, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Make sure navbar fields include is_active
if "navbar: ['logo_image', 'logo_text', 'nav_links_data']" in js_content:
    js_content = js_content.replace(
        "navbar: ['logo_image', 'logo_text', 'nav_links_data']",
        "navbar: ['is_active', 'logo_image', 'logo_text', 'nav_links_data']"
    )

with open(js_filename, 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Updated settings-page.ejs")

