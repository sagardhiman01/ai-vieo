const fs = require('fs');
const path = require('path');

const files = [
  'pages/about.html',
  'pages/contact.html',
  'pages/portfolio.html',
  'pages/services.html',
  'pages/testimonials.html',
];

const replacements = {
  '--bg: #0d0d0f;': '--bg: #A0A5B1;',
  '--bg: #0a0a0c;': '--bg: #A0A5B1;',
  '--accent: #3A6EA5;': '--accent: #c8cdd6;',
  '--teal: #5FA8A8;': '--teal: #d0d5dd;',
  '--white: #EAEAEA;': '--white: #FFFFFF;',
  '--grey: rgba(234,234,234,0.5);': '--grey: rgba(255,255,255,0.65);',
  'rgba(95,168,168,0.4)': 'rgba(255,255,255,0.5)',
  'rgba(95,168,168,0.8)': 'rgba(255,255,255,0.9)',
  'rgba(95,168,168,0.05)': 'rgba(255,255,255,0.08)',
  'rgba(95,168,168,0.03)': 'rgba(255,255,255,0.05)',
  'rgba(95,168,168,0.2)': 'rgba(255,255,255,0.3)',
  'rgba(95,168,168,0.3)': 'rgba(255,255,255,0.4)',
  'rgba(95,168,168,0.7)': 'rgba(255,255,255,0.8)',
  '0x0d0d0f': '0xA0A5B1',
  '0x0a0a0c': '0xA0A5B1',
  '0x0a0a1e': '0xb0b8c8',
  '0x0a0a1a': '0xb0b8c8',
  '0x3A6EA5': '0xc8d0e0',
  '0x5FA8A8': '0xd0d5dd',
  '0x080812': '0x8a90a0',
  '0x050510': '0x8a90a0',
  '0x03080f': '0x8a90a0',
  '0x050515': '0x8a90a0',
  '0x0a1628': '0x3a4560',
  '#0d0d0f': '#A0A5B1',
  '#111116': '#b0b5c0'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
