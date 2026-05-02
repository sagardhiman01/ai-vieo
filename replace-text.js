const fs = require('fs');
const path = require('path');

const files = [
    'admin.html',
    'js/cms.js',
    'pages/about.html',
    'pages/contact.html',
    'pages/portfolio.html',
    'pages/services.html'
];

files.forEach(file => {
    let p = path.join(__dirname, file);
    if (!fs.existsSync(p)) return;
    
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace 'Gaa-tha' with 'Layers Cut Media' globally (case-sensitive replacements to preserve casing if needed, but here simple regex with 'gi' is okay if we just use 'Layers Cut Media')
    content = content.replace(/Gaa-tha/g, 'Layers Cut Media');
    content = content.replace(/gaa-tha/g, 'Layers Cut Media');
    content = content.replace(/gaathaa/gi, 'Layers Cut Media');
    
    fs.writeFileSync(p, content);
    console.log(`Replaced text in ${file}`);
});
