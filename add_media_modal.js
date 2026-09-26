const fs = require('fs');
const path = require('path');

const modalHtml = `
<div id="mediaModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 opacity-0 pointer-events-none transition-opacity duration-300">
  <button onclick="closeMediaModal()" class="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-all z-10">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
  </button>
  <div id="mediaModalContent" class="relative w-full max-w-5xl max-h-[90vh] p-4 flex items-center justify-center opacity-0 scale-95 transition-all duration-300 transform">
  </div>
</div>
<script>
function openMediaModal(url, type) {
  const modal = document.getElementById('mediaModal');
  const content = document.getElementById('mediaModalContent');
  
  if (type === 'video') {
    content.innerHTML = '<video src="' + url + '" class="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" controls autoplay playsinline></video>';
  } else {
    content.innerHTML = '<img src="' + url + '" class="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain">';
  }
  
  modal.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    content.classList.remove('opacity-0', 'scale-95');
  }, 50);
}

function closeMediaModal() {
  const modal = document.getElementById('mediaModal');
  const content = document.getElementById('mediaModalContent');
  
  content.classList.add('opacity-0', 'scale-95');
  setTimeout(() => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      content.innerHTML = '';
    }, 300);
  }, 50);
}

document.getElementById('mediaModal').addEventListener('click', (e) => {
  if (e.target.id === 'mediaModal' || e.target.id === 'mediaModalContent') {
    closeMediaModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMediaModal();
});
</script>
</body>`;

function processFile(filename, isProject) {
  const filepath = path.join('views', filename);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf-8');
  
  // Replace the old article format with the new one
  const targetRegex = /<article class="overflow-hidden rounded-\[1\.75rem\] border border-slate-200 bg-slate-50 dark:border-white\/10 dark:bg-white\/\[0\.04\]">[\s\S]*?<\/article>/g;
  
  const altText = isProject ? '<%= item.title || project.title %>' : '<%= item.title || service.title %>';
  
  const replacement = `<article class="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] cursor-pointer" onclick="openMediaModal('<%= item.url %>', '<%= item.type %>')">
                <div class="<%= item.type === 'video' ? 'aspect-video' : 'aspect-[4/3]' %> bg-slate-100 dark:bg-white/[0.06] relative">
                  <% if (item.type === 'video') { %>
                    <video src="<%= item.url %>" class="h-full w-full object-cover"></video>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  <% } else { %>
                    <img src="<%= item.url %>" alt="${altText}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.closest('article').remove()">
                    <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors opacity-0 group-hover:opacity-100">
                       <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                       </div>
                    </div>
                  <% } %>
                </div>
              </article>`;
              
  content = content.replace(targetRegex, replacement);
  
  // Inject modal before body end if not already injected
  if (!content.includes('id="mediaModal"')) {
    content = content.replace(/<\/body>/, modalHtml);
  }
  
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log('Successfully updated ' + filename);
}

processFile('portfolio-detail.ejs', true);
processFile('service-detail.ejs', false);
