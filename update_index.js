const fs = require('fs');
const filePath = 'e:/WEBSITE/APRIPROGRAM/Apriprogram/views/index.ejs';
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
  {
    regex: /if\s*\(data\.settings\.services\)\s*\{\s*try\s*\{\s*const\s*srvTitle\s*=\s*document\.querySelector\('#services h2'\);/s,
    replacement: `if (data.settings.services) {
          try {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
               if (data.settings.services.is_active === 'false' || data.settings.services.is_active === false) {
                  servicesSection.style.display = 'none';
               } else {
                  servicesSection.style.display = '';
               }
            }
            const srvTitle = document.querySelector('#services h2');`
  },
  {
    regex: /if\s*\(data\.settings\.projects\)\s*\{\s*try\s*\{\s*const\s*prjTitle\s*=\s*document\.querySelector\('#project h2'\);/s,
    replacement: `if (data.settings.projects) {
          try {
            const projectSection = document.getElementById('project');
            if (projectSection) {
               if (data.settings.projects.is_active === 'false' || data.settings.projects.is_active === false) {
                  projectSection.style.display = 'none';
               } else {
                  projectSection.style.display = '';
               }
            }
            const prjTitle = document.querySelector('#project h2');`
  },
  {
    regex: /if\s*\(data\.settings\.timeline\)\s*\{\s*try\s*\{\s*const\s*tmTitle\s*=\s*document\.querySelector\('\.timeline-section h2'\)[^\n]*\n/s,
    replacement: `if (data.settings.timeline) {
          try {
            const tmTitle = document.querySelector('.timeline-section h2') || document.querySelectorAll('main section')[3]?.querySelector('h2');
            const timelineSection = tmTitle ? tmTitle.closest('section') : null;
            if (timelineSection) {
               if (data.settings.timeline.is_active === 'false' || data.settings.timeline.is_active === false) {
                  timelineSection.style.display = 'none';
               } else {
                  timelineSection.style.display = '';
               }
            }\n`
  },
  {
    regex: /if\s*\(data\.settings\.faq\)\s*\{\s*try\s*\{\s*const\s*faqTitle\s*=\s*document\.getElementById\('dyn-faq-title'\);/s,
    replacement: `if (data.settings.faq) {
          try {
            const faqSection = document.getElementById('faq');
            if (faqSection) {
               if (data.settings.faq.is_active === 'false' || data.settings.faq.is_active === false) {
                  faqSection.style.display = 'none';
               } else {
                  faqSection.style.display = '';
               }
            }
            const faqTitle = document.getElementById('dyn-faq-title');`
  },
  {
    regex: /if\s*\(data\.settings\.cta\)\s*\{\s*try\s*\{\s*if\s*\(data\.settings\.cta\.title\)\s*document\.getElementById\('dyn-cta-title'\)\.innerHTML\s*=\s*data\.settings\.cta\.title;/s,
    replacement: `if (data.settings.cta) {
          try {
            const ctaSection = document.getElementById('contact');
            if (ctaSection) {
               if (data.settings.cta.is_active === 'false' || data.settings.cta.is_active === false) {
                  ctaSection.style.display = 'none';
               } else {
                  ctaSection.style.display = '';
               }
            }
            if (data.settings.cta.title) document.getElementById('dyn-cta-title').innerHTML = data.settings.cta.title;`
  }
];

replacements.forEach(r => {
  content = content.replace(r.regex, r.replacement);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('done');
