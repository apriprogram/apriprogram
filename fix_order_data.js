const fs = require('fs');

const path = 'views/admin/dashboard.ejs';
let content = fs.readFileSync(path, 'utf-8');

// 1. Modify renderOrders buttons
content = content.replace(
  /onclick='viewOrderDetail\(\$\{JSON\.stringify\(o\)\.replace\(\/'\/g, "&#39;"\)\}\)'/g,
  "onclick='viewOrderDetail(${o.id})'"
);
content = content.replace(
  /onclick='openOrderModal\(\$\{JSON\.stringify\(o\)\.replace\(\/'\/g, "&#39;"\)\}, false\)'/g,
  "onclick='openOrderModal(${o.id})'"
);

// 2. Modify viewOrderDetail
const viewFuncTarget = `function viewOrderDetail(order) {`;
const viewFuncReplacement = `function viewOrderDetail(id) {
      const order = ordersData.find(o => o.id === id);
      if (!order) return;`;
content = content.replace(viewFuncTarget, viewFuncReplacement);

// 3. Modify openOrderModal
const openFuncTarget = `function openOrderModal(order = null) {`;
const openFuncReplacement = `function openOrderModal(id = null) {
      let order = null;
      if (id && typeof id === 'number') {
        order = ordersData.find(o => o.id === id);
      }`;
content = content.replace(openFuncTarget, openFuncReplacement);

fs.writeFileSync(path, content);
console.log('Order data passing fixed');
