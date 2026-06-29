const fs = require('fs');
const child_process = require('child_process');

const lines = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8').split('\n');
let scriptStarted = false;
let js = '';
for(let l of lines) {
  if (l.includes('<script>')) {
    scriptStarted = true;
    continue;
  }
  if (l.includes('</script>') && scriptStarted) break;
  if (scriptStarted) js += l + '\n';
}
fs.writeFileSync('temp.js', js);
try {
  child_process.execSync('node -c temp.js', { stdio: 'inherit' });
  console.log('No syntax errors.');
} catch (e) {
  console.error('Syntax error found!');
}
