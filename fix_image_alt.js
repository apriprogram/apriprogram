const fs = require('fs');
let content = fs.readFileSync('views/admin/tabs/settings.ejs', 'utf-8');

// Use regex to remove Image Alt section and replace grid layout
const targetRegex = /<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">\s*<div>\s*<label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1\.5">Image URL<\/label>([\s\S]*?)<\/label>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div>\s*<label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1\.5">Image Alt<\/label>\s*<input type="text" id="project-image_alt"[^>]+>\s*<\/div>\s*<\/div>/;

const replacement = `<div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Image URL</label>$1</label>
                  </div>
                </div>
              </div>
              <input type="hidden" id="project-image_alt" value="">
            </div>`;

if (targetRegex.test(content)) {
  content = content.replace(targetRegex, replacement);
  fs.writeFileSync('views/admin/tabs/settings.ejs', content, 'utf-8');
  console.log('Successfully replaced Image Alt section in settings.ejs');
} else {
  console.log('Regex did not match in settings.ejs. Let me try a simpler regex.');
  
  const altRegex = /<div>\s*<label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1\.5">Image Alt<\/label>\s*<input type="text" id="project-image_alt"[^>]+>\s*<\/div>/g;
  if(altRegex.test(content)) {
      content = content.replace(altRegex, '<input type="hidden" id="project-image_alt" value="">');
      content = content.replace('<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">\r\n              <div>\r\n                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Image URL', '<div class="grid grid-cols-1 gap-4">\r\n              <div>\r\n                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Image URL');
      content = content.replace('<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">\n              <div>\n                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Image URL', '<div class="grid grid-cols-1 gap-4">\n              <div>\n                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Image URL');
      
      fs.writeFileSync('views/admin/tabs/settings.ejs', content, 'utf-8');
      console.log('Successfully replaced using simpler regex');
  } else {
      console.log('Even simpler regex failed.');
  }
}
