const fs = require('fs');

const path = 'views/admin/dashboard.ejs';
let content = fs.readFileSync(path, 'utf-8');

// 1. Include components.js in <head>
if (!content.includes('<script src="/js/components.js"></script>')) {
  content = content.replace('</title>', '</title>\n  <script src="/js/components.js"></script>');
}

// 2. Remove getStatusBadgeHtml from dashboard.ejs
const badgeStart = content.indexOf('function getStatusBadgeHtml(status) {');
if (badgeStart !== -1) {
  const badgeEnd = content.indexOf('return `<span class="inline-flex', badgeStart);
  const badgeEndComplete = content.indexOf('</span>`;', badgeEnd) + 9;
  const nextBracket = content.indexOf('}', badgeEndComplete) + 1;
  content = content.substring(0, badgeStart) + content.substring(nextBracket);
}

// 3. Update renderOrders actions
const ordersActionsTarget = `<td class="py-4 px-6 text-center flex justify-center gap-2">
            <button onclick='viewOrderDetail(\${o.id})' class="p-2 bg-blue-100 dark:bg-blue-500/10 text-brand-blue dark:text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-500/20 rounded-lg transition-colors" title="Lihat Detail">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </button>
            <button onclick='openOrderModal(\${o.id})' class="p-2 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-500/20 rounded-lg transition-colors" title="Edit Data">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            <button onclick="deleteOrder(\${o.id})" class="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-200 dark:hover:bg-red-500/20 rounded-lg transition-colors" title="Hapus">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </td>`;
const ordersActionsReplacement = `<td class="py-4 px-6 text-center flex justify-center gap-2">
            \${getActionButtonHtml('view', \`viewOrderDetail(\${o.id})\`, 'Lihat Detail')}
            \${getActionButtonHtml('edit', \`openOrderModal(\${o.id})\`, 'Edit Data')}
            \${getActionButtonHtml('delete', \`deleteOrder(\${o.id})\`, 'Hapus')}
          </td>`;
content = content.replace(ordersActionsTarget, ordersActionsReplacement);

// 4. Update renderUsers actions
const usersActionsTarget = `<td class="py-4 px-6 text-center flex justify-center gap-2">
            <button onclick="openUserModal(\${u.id}, '\${u.email}', '\${u.role}')" class="p-2 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-500/20 rounded-lg transition-colors" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            <button onclick="deleteUser(\${u.id})" class="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-200 dark:hover:bg-red-500/20 rounded-lg transition-colors" title="Hapus">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </td>`;
const usersActionsReplacement = `<td class="py-4 px-6 text-center flex justify-center gap-2">
            \${getActionButtonHtml('edit', \`openUserModal(\${u.id}, '\${u.email}', '\${u.role}')\`, 'Edit')}
            \${getActionButtonHtml('delete', \`deleteUser(\${u.id})\`, 'Hapus')}
          </td>`;
content = content.replace(usersActionsTarget, usersActionsReplacement);

fs.writeFileSync(path, content);
console.log('dashboard JS refactored');
