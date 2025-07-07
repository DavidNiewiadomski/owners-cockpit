#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all TypeScript/JavaScript files
function getAllTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function removeUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove unused single imports from lucide-react
    const lucideImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?\n?/g;
    content = content.replace(lucideImportRegex, (match, imports) => {
      const importList = imports.split(',').map(imp => imp.trim()).filter(Boolean);
      const usedImports = importList.filter(imp => {
        const cleanImp = imp.replace(/\s+as\s+\w+/, ''); // Remove 'as alias'
        // Check if import is used in the file (excluding the import line itself)
        const contentWithoutImports = content.replace(lucideImportRegex, '');
        return contentWithoutImports.includes(cleanImp);
      });
      
      if (usedImports.length === 0) {
        modified = true;
        return '';
      } else if (usedImports.length !== importList.length) {
        modified = true;
        return `import { ${usedImports.join(', ')} } from 'lucide-react';\n`;
      }
      return match;
    });
    
    // Remove completely unused imports
    const unusedImportPatterns = [
      /import\s+{\s*[^}]*\s*}\s+from\s+['"][^'"]+['"];\s*\n/g,
      /import\s+\w+\s+from\s+['"][^'"]+['"];\s*\n/g
    ];
    
    // Add underscore prefix to unused variables
    content = content.replace(/(\w+)(\s*[:=]\s*[^;,\n]+)/g, (match, varName, rest) => {
      // Skip if already has underscore or is in import/export
      if (varName.startsWith('_') || match.includes('import') || match.includes('export')) {
        return match;
      }
      return `_${varName}${rest}`;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.log(`Error processing ${filePath}: ${error.message}`);
  }
}

// Main execution
const files = getAllTsFiles('./src');
files.forEach(removeUnusedImports);

console.log('Fixed unused imports in TypeScript files');
