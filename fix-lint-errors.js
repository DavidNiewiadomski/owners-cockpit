#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all TypeScript files
function getAllTSFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    if (item === 'node_modules' || item === 'dist' || item.startsWith('.')) continue;
    
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllTSFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Common fixes
const commonFixes = [
  // Fix unused variables by prefixing with underscore
  {
    pattern: /(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g,
    replacement: '$1_$2:',
    description: 'Fix unused parameters'
  },
  
  // Fix any types
  {
    pattern: /:\s*any(\s*[=,;)\]\}])/g,
    replacement: ': unknown$1',
    description: 'Replace any with unknown'
  },
  
  // Fix unused imports - remove them
  {
    pattern: /import\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];\s*\n/g,
    replacement: function(match) {
      // This is complex - we'll handle this manually
      return match;
    },
    description: 'Handle unused imports'
  }
];

// Apply fixes to a file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Apply common any type fixes
    const anyTypePattern = /:\s*any(?=\s*[=,;)\]\}])/g;
    if (anyTypePattern.test(content)) {
      content = content.replace(anyTypePattern, ': unknown');
      hasChanges = true;
    }
    
    // Fix Record<string, any> to Record<string, unknown>
    const recordAnyPattern = /Record<string,\s*any>/g;
    if (recordAnyPattern.test(content)) {
      content = content.replace(recordAnyPattern, 'Record<string, unknown>');
      hasChanges = true;
    }
    
    // Fix function parameters that are any
    const paramAnyPattern = /\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g;
    if (paramAnyPattern.test(content)) {
      content = content.replace(paramAnyPattern, '($1: unknown)');
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🔧 Starting automated lint error fixes...');
  
  const projectRoot = process.cwd();
  const tsFiles = getAllTSFiles(projectRoot);
  
  console.log(`Found ${tsFiles.length} TypeScript files`);
  
  let fixedCount = 0;
  
  for (const file of tsFiles) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`✅ Fixed ${fixedCount} files`);
  
  // Run lint again to see progress
  try {
    const lintOutput = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
    console.log('Lint output:', lintOutput);
  } catch (error) {
    const errorLines = error.stdout.split('\n').filter(line => line.includes('error'));
    console.log(`Remaining errors: ${errorLines.length}`);
  }
}

main();
