const fs = require('fs');
const path = require('path');

const modelsDirectory = path.join(__dirname, '../models');

fs.readdir(modelsDirectory, (err, files) => {
  if (err) {
    console.error('Error reading models directory:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(modelsDirectory, file);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }

      const updatedData = data.replace(/sequelize\.define\('(\w+)',/g, (match, p1) => {
        return `sequelize.define('${p1.toLowerCase()}',`;
      });

      fs.writeFile(filePath, updatedData, 'utf8', err => {
        if (err) {
          console.error(`Error writing file ${file}:`, err);
          return;
        }
        console.log(`Updated table name in ${file}`);
      });
    });
  });
});