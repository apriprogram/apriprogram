const fs = require('fs');
const path = require('path');

function processFile(filename) {
  const filepath = path.join('views', filename);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf-8');
  
  // Replace the old div class with aspect-[4/3] for all media types so they fill the card
  const targetRegex = /class="<%= item\.type === 'video' \? 'aspect-video' : 'aspect-\[4\/3\]' %> bg-slate-100 dark:bg-white\/\[0\.06\] relative">/g;
  const replacement = `class="aspect-[4/3] h-full w-full bg-slate-100 dark:bg-white/[0.06] relative">`;
              
  content = content.replace(targetRegex, replacement);
  
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log('Successfully updated ' + filename);
}

processFile('portfolio-detail.ejs');
processFile('service-detail.ejs');
