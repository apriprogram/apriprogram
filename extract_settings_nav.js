const fs = require('fs');

const settingsTabPath = 'views/admin/tabs/settings.ejs';
let content = fs.readFileSync(settingsTabPath, 'utf-8');

const navComponentEjs = `<div class="bg-white dark:bg-brand-card p-2 rounded-2xl border border-slate-200 dark:border-brand-border shadow-sm sticky top-24">
  <button onclick="showSettingSection('navbar')" id="btn-navbar" class="setting-nav active w-full text-left px-4 py-3 rounded-xl text-sm font-medium bg-slate-100 dark:bg-brand-darker text-brand-blue dark:text-white mb-1 transition-colors">Navbar</button>
  <button onclick="showSettingSection('hero')" id="btn-hero" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">Hero Section</button>
  <button onclick="showSettingSection('services')" id="btn-services" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">Services</button>
  <button onclick="showSettingSection('projects')" id="btn-projects" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">Projects</button>
  <button onclick="showSettingSection('timeline')" id="btn-timeline" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">Timeline</button>
  <button onclick="showSettingSection('faq')" id="btn-faq" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">FAQ</button>
  <button onclick="showSettingSection('cta')" id="btn-cta" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">CTA</button>
  <button onclick="showSettingSection('footer')" id="btn-footer" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker transition-colors">Footer</button>
</div>`;

fs.writeFileSync('views/admin/components/settings-nav.ejs', navComponentEjs);

const oldNav = `<div class="bg-white dark:bg-brand-card p-2 rounded-2xl border border-slate-200 dark:border-brand-border shadow-sm sticky top-24">
            <button onclick="showSettingSection('navbar')" id="btn-navbar" class="setting-nav active w-full text-left px-4 py-3 rounded-xl text-sm font-medium bg-slate-100 dark:bg-brand-darker text-brand-blue dark:text-white mb-1 transition-colors">Navbar</button>
            <button onclick="showSettingSection('hero')" id="btn-hero" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">Hero Section</button>
            <button onclick="showSettingSection('services')" id="btn-services" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">Services</button>
            <button onclick="showSettingSection('projects')" id="btn-projects" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">Projects</button>
            <button onclick="showSettingSection('timeline')" id="btn-timeline" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">Timeline</button>
            <button onclick="showSettingSection('faq')" id="btn-faq" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">FAQ</button>
            <button onclick="showSettingSection('cta')" id="btn-cta" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker mb-1 transition-colors">CTA</button>
            <button onclick="showSettingSection('footer')" id="btn-footer" class="setting-nav w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-darker transition-colors">Footer</button>
          </div>`;

content = content.replace(oldNav, "<%- include('../components/settings-nav') %>");
fs.writeFileSync(settingsTabPath, content);
console.log('Settings nav extracted');
