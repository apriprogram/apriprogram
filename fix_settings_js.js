const fs = require('fs');
let content = fs.readFileSync('views/admin/scripts/settings-page.ejs', 'utf-8');

const functionsCode = `
function syncProjectDescriptionEditor() {
  const editor = document.getElementById('project-description-editor');
  const input = document.getElementById('project-description');
  if (editor && input) input.value = editor.innerHTML.trim();
}

function setProjectDescriptionEditor(value = '') {
  const editor = document.getElementById('project-description-editor');
  const input = document.getElementById('project-description');
  if (editor) editor.innerHTML = value || '';
  if (input) input.value = value || '';
}

function formatProjectDescription(command, value = null) {
  const editor = document.getElementById('project-description-editor');
  if (!editor) return;
  editor.focus();
  document.execCommand(command, false, value);
  syncProjectDescriptionEditor();
}

function insertProjectDescriptionLink() {
  const url = prompt('Masukkan URL link');
  if (!url) return;
  formatProjectDescription('createLink', url);
}
`;

content = content.replace("function openProjectModal(slug = '') {", functionsCode + "\nfunction openProjectModal(slug = '') {");

const openModalReplace = `  ['title', 'slug', 'client_name', 'category', 'short_description', 'description', 'image', 'image_alt', 'technology_stack', 'project_url', 'detail_url', 'button_text', 'sort_order', 'meta_title', 'meta_description'].forEach(field => {
    const el = document.getElementById(\`project-\${field}\`);
    if (el) el.value = field === 'button_text' ? 'Lihat detail' : field === 'sort_order' ? '1' : '';
  });
  setProjectDescriptionEditor('');`;

content = content.replace(`  ['title', 'slug', 'client_name', 'category', 'short_description', 'description', 'image', 'image_alt', 'technology_stack', 'project_url', 'detail_url', 'button_text', 'sort_order', 'meta_title', 'meta_description'].forEach(field => {
    const el = document.getElementById(\`project-\${field}\`);
    if (el) el.value = field === 'button_text' ? 'Lihat detail' : field === 'sort_order' ? '1' : '';
  });`, openModalReplace);

const openModalExistingReplace = `      Object.keys(proj).forEach(field => {
        const el = document.getElementById(\`project-\${field}\`);
        if (el && proj[field] !== undefined && proj[field] !== null) el.value = proj[field];
      });
      setProjectDescriptionEditor(proj.description || '');`;

content = content.replace(`      Object.keys(proj).forEach(field => {
        const el = document.getElementById(\`project-\${field}\`);
        if (el && proj[field] !== undefined && proj[field] !== null) el.value = proj[field];
      });`, openModalExistingReplace);

fs.writeFileSync('views/admin/scripts/settings-page.ejs', content, 'utf-8');
console.log('Successfully injected project editor scripts and updated openProjectModal.');
