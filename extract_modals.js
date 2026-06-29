const fs = require('fs');

const modalsContent = fs.readFileSync('views/admin/partials/modals.ejs', 'utf-8');

// The file has clear sections based on the id attributes:
// <div id="user-modal" ...
// <div id="order-modal" ...
// <div id="detail-modal" ...
// <div id="delete-modal" ...
// We can split by looking at these div ids, but we have to be careful about nested divs.
// Since we don't have a full HTML parser, let's just use string search or regex.

// Let's do a simple parse:
function extractDiv(html, idStart) {
  let startIndex = html.indexOf(idStart);
  if (startIndex === -1) return '';
  // find the exact start of the <div containing the id
  let divStart = html.lastIndexOf('<div', startIndex);
  
  let depth = 0;
  let endIndex = -1;
  // A very naive but usually effective HTML parser for a single root element
  // We need to count <div and </div> from divStart.
  let pos = divStart;
  while (pos < html.length) {
    let nextOpen = html.indexOf('<div', pos + 1);
    let nextClose = html.indexOf('</div', pos + 1);
    
    if (nextClose === -1) break; // Error
    
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen;
    } else {
      depth--;
      pos = nextClose;
      if (depth === 0) {
        // we found the matching close tag
        endIndex = html.indexOf('>', pos) + 1;
        break;
      }
    }
  }
  
  // also grab any preceding comments
  let precedingCommentStart = html.lastIndexOf('<!--', divStart);
  let precedingCommentEnd = html.indexOf('-->', precedingCommentStart);
  if (precedingCommentStart !== -1 && precedingCommentEnd !== -1 && precedingCommentEnd < divStart) {
    // only if the comment is immediately preceding (allowing whitespaces)
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

const userModal = extractDiv(modalsContent, 'id="user-modal"');
const orderModal = extractDiv(modalsContent, 'id="order-modal"');
const detailModal = extractDiv(modalsContent, 'id="detail-modal"');
const deleteModal = extractDiv(modalsContent, 'id="delete-modal"');

if (userModal) fs.writeFileSync('views/admin/components/modal-user.ejs', userModal);
if (orderModal) fs.writeFileSync('views/admin/components/modal-order.ejs', orderModal);
if (detailModal) fs.writeFileSync('views/admin/components/modal-detail.ejs', detailModal);
if (deleteModal) fs.writeFileSync('views/admin/components/modal-delete.ejs', deleteModal);

// Now update dashboard.ejs to include the 4 components instead of partials/modals
let dashboard = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8');
dashboard = dashboard.replace("<%- include('partials/modals') %>", 
  "<%- include('components/modal-user') %>\n  <%- include('components/modal-order') %>\n  <%- include('components/modal-detail') %>\n  <%- include('components/modal-delete') %>");

fs.writeFileSync('views/admin/dashboard.ejs', dashboard);

// Delete the old modals file
fs.unlinkSync('views/admin/partials/modals.ejs');

console.log('Modals extracted successfully');
