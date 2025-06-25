#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get lint output
const lintOutput = execSync('npm run lint', { encoding: 'utf8', cwd: process.cwd() });

// Parse the lint output to find unused variable errors
const unusedVarErrors = [];
const lines = lintOutput.split('\n');

for (const line of lines) {
  if (line.includes("is defined but never used") || line.includes("is assigned a value but never used")) {
    // Parse the file path, line number, and variable name
    const match = line.match(/^([^:]+):(\d+):(\d+)\s+error\s+'([^']+)'/);
    if (match) {
      const [, filePath, lineNum, , varName] = match;
      unusedVarErrors.push({
        filePath: filePath.trim(),
        lineNum: parseInt(lineNum),
        varName: varName.trim()
      });
    }
  }
}

console.log(`Found ${unusedVarErrors.length} unused variable errors`);

// Group by file to fix them efficiently
const errorsByFile = {};
for (const error of unusedVarErrors) {
  if (!errorsByFile[error.filePath]) {
    errorsByFile[error.filePath] = [];
  }
  errorsByFile[error.filePath].push(error);
}

// Fix each file
for (const [filePath, errors] of Object.entries(errorsByFile)) {
  try {
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Sort errors by line number in descending order to avoid line number shifts
    errors.sort((a, b) => b.lineNum - a.lineNum);
    
    for (const error of errors) {
      const lineIndex = error.lineNum - 1;
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex];
        const varName = error.varName;
        
        // Simple regex replacements for common patterns
        if (line.includes(`const ${varName} =`) || line.includes(`let ${varName} =`)) {
          lines[lineIndex] = line.replace(new RegExp(`\\b${varName}\\b`), `_${varName}`);
        } else if (line.includes(`${varName}:`)) {
          // Function parameter destructuring
          lines[lineIndex] = line.replace(new RegExp(`\\b${varName}:`), `${varName}: _${varName}`);
        } else if (line.includes(`(${varName},`) || line.includes(`(${varName})`) || line.includes(`, ${varName},`) || line.includes(`, ${varName})`)) {
          // Function parameters
          lines[lineIndex] = line.replace(new RegExp(`\\b${varName}\\b`), `_${varName}`);
        } else if (line.includes(`} catch (${varName})`)) {
          // Catch blocks
          lines[lineIndex] = line.replace(`} catch (${varName})`, `} catch (_${varName})`);
        }
      }
    }
    
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Fixed ${errors.length} errors in ${filePath}`);
    
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

console.log('Done fixing unused variables');
