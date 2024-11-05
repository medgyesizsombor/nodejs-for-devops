const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Ensure the dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Minify each .js file in the src directory
fs.readdirSync(srcDir).forEach(file => {
  if (path.extname(file) === '.js') {
    const srcPath = path.join(srcDir, file);
    const distPath = path.join(distDir, file);
    
    const code = fs.readFileSync(srcPath, 'utf8');
    
    minify(code).then(result => {
      fs.writeFileSync(distPath, result.code);
      console.log(`Minified ${file}`);
    }).catch(err => {
      console.error(`Error minifying ${file}:`, err);
    });
  }
});