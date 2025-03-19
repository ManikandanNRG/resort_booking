const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'models');
const files = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));

files.forEach(file => {
  if (file === 'index.js') return;

  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace incorrect database path
  content = content.replace(
    /require\(['"]\.\.\/src\/config\/database['"]\)/g,
    "require('../config/database')"
  );

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});