const fs = require('fs');
const path = 'e:\\WEBSITE APRIPROGRAM\\Apriprogram\\views\\client\\order.ejs';
let txt = fs.readFileSync(path, 'utf8');
txt = txt.replace(/\\`/g, '`');
fs.writeFileSync(path, txt);
console.log('Fixed backslashes');
