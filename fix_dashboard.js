const fs = require('fs');

let content = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8');

// Remove the spurious <script> block that was injected at line ~88 (second script tag before the HTML)
// Strategy: Find the pattern and remove it
// The second injected <script> block starts with: \n  <script>\n    // Dark Mode Toggle Logic
const injection = content.indexOf('\n  <script>\n    // Dark Mode Toggle Logic');
const injection2 = content.indexOf('\n  <script>\n    // Dark Mode Toggle Logic', injection + 1);
if (injection2 > -1) {
  // Remove from injection2 to the closing </script> of that block
  const closingTag = content.indexOf('</script>', injection2);
  const nextContent = content.indexOf('\n', closingTag + 9);
  console.log('Found second injection at char:', injection2, '-> removing up to char:', nextContent);
  content = content.slice(0, injection2) + content.slice(nextContent);
} else {
  console.log('No second injection found');
}

// Now check for triple script tags
const s1 = content.indexOf('<script>');
const s2 = content.indexOf('<script>', s1 + 1);
const s3 = content.indexOf('<script>', s2 + 1);
console.log('Script tags at:', s1, s2, s3 > -1 ? s3 : 'none');

fs.writeFileSync('views/admin/dashboard.ejs', content);
console.log('Done, total lines:', content.split('\n').length);
