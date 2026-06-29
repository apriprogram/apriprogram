const fs = require('fs');
let content = fs.readFileSync('views/admin/dashboard.ejs', 'utf-8');

const newStyle = `<style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .dark ::-webkit-scrollbar-thumb { background: #2A2B36; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    .dark ::-webkit-scrollbar-thumb:hover { background: #3f3f4e; }
    
    /* Sidebar Active & Hover State */
    .nav-item { transition: all 0.2s ease-in-out; }
    .nav-item:hover, .nav-item.active { 
      background-color: #F5F5F5 !important; 
      color: #0f172a !important; 
    }
    .dark .nav-item:hover, .dark .nav-item.active { 
      background-color: #1C1E26 !important; 
      color: #ffffff !important; 
    }
    
    /* Upload Button Styles */
    .file-upload-btn {
      position: relative;
      overflow: hidden;
    }
    .file-upload-btn input[type="file"] {
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      width: 100%; height: 100%;
      opacity: 0; cursor: pointer;
    }
  </style>`;

content = content.replace(/<style>[\s\S]*?<\/style>/, newStyle);
fs.writeFileSync('views/admin/dashboard.ejs', content);
console.log('CSS Fixed');
