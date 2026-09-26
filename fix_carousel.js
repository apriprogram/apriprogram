const fs = require('fs');
let content = fs.readFileSync('views/index.ejs', 'utf8');

const regex = /function renderProjectCarousel\(projectItems\).*?\}\s*function renderTimeline/s;
const replacement = `function renderProjectCarousel(projectItems) {
      const carousel = document.getElementById('productCarousel');
      if (!carousel || !projectItems || projectItems.length === 0) return;
      const activeProjects = projectItems
        .filter(isActiveItem)
        .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
      if (activeProjects.length === 0) return;
      
      carousel.innerHTML = activeProjects.map(project => \`
        <div class="shrink-0 w-[85vw] md:w-[45vw] lg:w-[23vw] snap-start flex flex-col gap-4 sm:gap-6 cursor-pointer group" onclick="window.location.href='/portfolio/\${encodeURIComponent(project.slug || '')}'">
          <div class="relative w-full aspect-[4/3] sm:aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#1a1a1a]">
            <img src="\${escapeServiceHtml(project.image)}" alt="\${escapeServiceHtml(project.image_alt || project.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 no-reveal" />
          </div>
          <div class="flex flex-col gap-1.5">
            <h3 class="text-lg sm:text-[1.35rem] font-normal text-slate-900 dark:text-white leading-snug">\${escapeServiceHtml(project.title)}</h3>
            <p class="text-xs sm:text-[13px] text-slate-500 dark:text-[#a0a0a0] mt-1 sm:mt-2 tracking-wide">\${escapeServiceHtml(formatServicePublishDate(project.publish_date || ''))} &nbsp;&nbsp; \${escapeServiceHtml(project.category || 'Portfolio')}</p>
            <a href="/portfolio/\${encodeURIComponent(project.slug || '')}" class="text-xs sm:text-sm font-medium text-slate-900 dark:text-white group-hover:underline mt-1 flex items-center gap-1">\${escapeServiceHtml(project.button_text || 'Read details')} &gt;</a>
          </div>
        </div>
      \`).join('') + '<div class="shrink-0 w-1"></div>';
    }

    function renderTimeline`;

content = content.replace(regex, replacement);
fs.writeFileSync('views/index.ejs', content);
console.log('Replaced successfully');
