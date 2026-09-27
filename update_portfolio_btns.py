import re

portfolio_detail = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/portfolio-detail.ejs'
with open(portfolio_detail, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace "Lihat Website" block with nothing, we'll put the buttons in the breadcrumb / title area like services
content = re.sub(r'<% if \(projectUrl\) { %>.*?<% } %>', '', content, flags=re.DOTALL)

# Add the buttons under the title in portfolio-detail.ejs
btn_html = '''
          <div class="flex flex-row gap-2 sm:gap-3 w-full lg:w-fit mt-6 lg:mt-0 items-center">
            <a href="/portfolio" class="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 sm:px-5 sm:py-3 text-[11px] sm:text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-brand-blue hover:text-brand-blue dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:border-brand-blue dark:hover:text-white"><svg class="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>Kembali</a>
            <a href="/login?type=register" class="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-brand-blue px-3 py-2 sm:px-6 sm:py-3 text-[11px] sm:text-sm font-semibold text-white transition-colors hover:bg-brand-blue/80 dark:bg-brand-blue/90 dark:hover:bg-brand-blue/70">Pesan Sekarang</a>
          </div>
'''
# inject into the hero section of portfolio-detail
if 'class="flex flex-col gap-4"' in content:
    content = content.replace('class="flex flex-col gap-4"', 'class="flex flex-col gap-4 w-full"')
    content = content.replace('<h1 class="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight max-w-3xl"><%= project.title %></h1>', '<h1 class="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight max-w-3xl"><%= project.title %></h1>' + btn_html)

with open(portfolio_detail, 'w', encoding='utf-8') as f:
    f.write(content)


portfolio_list = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/portfolio.ejs'
with open(portfolio_list, 'r', encoding='utf-8') as f:
    content2 = f.read()

# in portfolio.ejs, put the buttons near the title just like services.ejs
if 'class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"' not in content2:
    content2 = content2.replace('<div class="max-w-3xl">', '<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">\n        <div class="max-w-3xl">')
    # find the closing div of max-w-3xl
    content2 = content2.replace('</p>\n        </div>', '</p>\n        </div>\n' + btn_html.replace('href="/portfolio"', 'href="/#project"') + '\n      </div>')
    
with open(portfolio_list, 'w', encoding='utf-8') as f:
    f.write(content2)

print("Updated portfolio buttons")
