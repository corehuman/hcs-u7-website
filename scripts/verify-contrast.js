#!/usr/bin/env node

/**
 * Script de vérification finale du contraste
 * Détecte tous les cas où le texte pourrait ne pas avoir le bon contraste sur fond coloré
 */

const fs = require('fs');
const path = require('path');

let issues = [];
let filesChecked = 0;

const colorBackgrounds = [
  'amber', 'green', 'blue', 'red', 'purple', 'orange', 'pink', 'indigo', 'cyan', 'teal'
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileIssues = [];
  
  lines.forEach((line, index) => {
    // Détecter les fonds colorés
    colorBackgrounds.forEach(color => {
      if (line.includes(`bg-${color}-100`)) {
        // Vérifier les 5 prochaines lignes pour des textes sans couleur appropriée
        for (let i = 1; i <= 5 && index + i < lines.length; i++) {
          const nextLine = lines[index + i];
          
          // Si on trouve un élément de texte
          if (nextLine.match(/<(span|p|div|h[1-6])(?![^>]*text-(?:amber|green|blue|red|purple|orange|pink|indigo|cyan|teal)-)/)) {
            // Si pas de couleur appropriée
            if (!nextLine.includes(`text-${color}-`)) {
              fileIssues.push({
                line: index + i + 1,
                content: nextLine.trim(),
                background: color,
                message: `Text without ${color} color on ${color} background`
              });
            }
          }
          
          // Vérifier text-foreground sur fond coloré (problématique)
          if (nextLine.includes('text-foreground/')) {
            fileIssues.push({
              line: index + i + 1,
              content: nextLine.trim(),
              background: color,
              message: `text-foreground/* on ${color} background - should use text-${color}-*`
            });
          }
          
          // Vérifier les className vides sur fond coloré
          if (nextLine.includes('className=""') || nextLine.match(/<(span|p)>(?!.*className)/)) {
            fileIssues.push({
              line: index + i + 1,
              content: nextLine.trim(),
              background: color,
              message: `Element without className on ${color} background`
            });
          }
        }
        
        // Vérifier si le fond a une bordure
        if (!line.includes('border')) {
          fileIssues.push({
            line: index + 1,
            content: line.trim(),
            background: color,
            message: `${color} background without border`
          });
        }
      }
    });
    
    // Vérifier les importance === 'critical' sans couleurs conditionnelles
    if (line.includes("importance === 'critical'")) {
      // Vérifier si la ligne suivante a des couleurs conditionnelles
      const context = lines.slice(Math.max(0, index - 2), Math.min(lines.length, index + 3)).join('\n');
      if (!context.includes("importance === 'critical' ?") || !context.match(/text-\w+-\d+/)) {
        fileIssues.push({
          line: index + 1,
          content: line.trim(),
          message: `importance === 'critical' without conditional text colors`
        });
      }
    }
  });
  
  if (fileIssues.length > 0) {
    issues.push({
      file: filePath,
      issues: fileIssues
    });
  }
  
  return fileIssues.length;
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (ext !== '.tsx' && ext !== '.jsx') return;
  
  filesChecked++;
  checkFile(filePath);
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      if (item === 'node_modules' || item === '.git' || item === '.next') return;
      processDirectory(itemPath);
    } else if (stats.isFile()) {
      processFile(itemPath);
    }
  });
}

console.log('🔍 Verifying contrast on all colored backgrounds...\n');

['app', 'components'].forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    processDirectory(dirPath);
  }
});

console.log(`\n📊 Verification Results:`);
console.log(`Files checked: ${filesChecked}`);
console.log(`Files with potential issues: ${issues.length}`);

if (issues.length > 0) {
  console.log('\n⚠️ Potential contrast issues found:\n');
  issues.forEach(({file, issues}) => {
    console.log(`📄 ${file}:`);
    issues.forEach(issue => {
      console.log(`  Line ${issue.line}: ${issue.message}`);
      if (issue.content) {
        console.log(`    > ${issue.content.substring(0, 80)}...`);
      }
    });
    console.log('');
  });
  
  console.log('💡 Fix suggestions:');
  console.log('  - Replace text-foreground/* with text-{color}-* on colored backgrounds');
  console.log('  - Add appropriate text colors for all elements on colored backgrounds');
  console.log('  - Ensure all colored backgrounds have borders');
  console.log('  - Use conditional colors when importance === "critical"');
} else {
  console.log('\n✅ All text on colored backgrounds has proper contrast!');
}
