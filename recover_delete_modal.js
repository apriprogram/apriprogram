const fs = require('fs');

const backupPath = 'backup_code/dashboard_backup_2026-06-28T18-56-06-682Z.ejs';
const backupHTML = fs.readFileSync(backupPath, 'utf-8');

function extractDiv(html, idStart) {
  let startIndex = html.indexOf(idStart);
  if (startIndex === -1) return '';
  let divStart = html.lastIndexOf('<div', startIndex);
  let depth = 0;
  let endIndex = -1;
  let pos = divStart;
  while (pos < html.length) {
    let nextOpen = html.indexOf('<div', pos + 1);
    let nextClose = html.indexOf('</div', pos + 1);
    if (nextClose === -1) break; 
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen;
    } else {
      depth--;
      pos = nextClose;
      if (depth === 0) {
        endIndex = html.indexOf('>', pos) + 1;
        break;
      }
    }
  }
  
  let precedingCommentStart = html.lastIndexOf('<!--', divStart);
  let precedingCommentEnd = html.indexOf('-->', precedingCommentStart);
  if (precedingCommentStart !== -1 && precedingCommentEnd !== -1 && precedingCommentEnd < divStart) {
    let between = html.substring(precedingCommentEnd + 3, divStart).trim();
    if (between === '') {
      divStart = precedingCommentStart;
    }
  }
  if (endIndex !== -1) {
    return html.substring(divStart, endIndex);
  }
  return '';
}

const deleteModal = extractDiv(backupHTML, 'id="delete-modal"');

if (deleteModal) {
    fs.writeFileSync('views/admin/components/modal-delete.ejs', deleteModal);
    console.log('modal-delete.ejs restored from backup');
} else {
    console.log('id="delete-modal" not found in backup');
}
