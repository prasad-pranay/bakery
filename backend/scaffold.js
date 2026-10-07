const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

const dirs = [
  'src/config',
  'src/controllers',
  'src/middleware',
  'src/models',
  'src/routes',
  'src/services',
  'src/utils',
  'src/validators'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(projectRoot, dir), { recursive: true });
});

console.log("Directories created.");
