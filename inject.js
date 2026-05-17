const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'pages/about.html',
    'pages/contact.html',
    'pages/portfolio.html',
    'pages/services.html'
];

const cssLinkIndex = `<link rel="stylesheet" href="css/modern-effects.css">\n</head>`;
const cssLinkPages = `<link rel="stylesheet" href="../css/modern-effects.css">\n</head>`;

const jsScriptIndex = `<script src="js/modern-effects.js"></script>\n</body>`;
const jsScriptPages = `<script src="../js/modern-effects.js"></script>\n</body>`;

files.forEach(file => {
    let p = path.join(__dirname, file);
    if (!fs.existsSync(p)) return;
    
    let content = fs.readFileSync(p, 'utf8');
    
    // Add CSS before </head>
    if (!content.includes('modern-effects.css')) {
        if (file === 'index.html') {
            content = content.replace('</head>', cssLinkIndex);
        } else {
            content = content.replace('</head>', cssLinkPages);
        }
    }
    
    // Add JS before </body>
    if (!content.includes('modern-effects.js')) {
        if (file === 'index.html') {
            content = content.replace('</body>', jsScriptIndex);
        } else {
            content = content.replace('</body>', jsScriptPages);
        }
    }
    
    // Fix index.html JS bug
    if (file === 'index.html' && !content.includes("if(title) {")) {
        content = content.replace(
            `const title = document.getElementById('split-text');\n        const text = title.innerText;`,
            `const title = document.getElementById('split-text');\n        if(title) {\n        const text = title.innerText;`
        );
        content = content.replace(
            `title.innerHTML += \`<span class="word"><span class="char">\${char}</span></span>\`;\n            }\n        });`,
            `title.innerHTML += \`<span class="word"><span class="char">\${char}</span></span>\`;\n            }\n        });\n        }`
        );
    }
    
    fs.writeFileSync(p, content);
    console.log(`Updated ${file}`);
});
