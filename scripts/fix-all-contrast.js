#!/usr/bin/env node

/**
 * Script pour corriger tous les problèmes de contraste dans l'application
 * Cible: Mode dark optimisé pour développeurs et scientifiques
 * 
 * Usage: node scripts/fix-all-contrast.js
 */

const fs = require('fs');
const path = require('path');

// Mappings de remplacement
const replacements = [
  // Text contrast fixes
  { from: /text-muted-foreground/g, to: 'text-foreground/85' },
  { from: /text-gray-500(?!\d)/g, to: 'text-foreground/75' },
  { from: /text-gray-400(?!\d)/g, to: 'text-foreground/70' },
  { from: /text-gray-300(?!\d)/g, to: 'text-foreground/65' },
  
  // Background colors - Light mode (remplacer *-50 par *-100)
  { from: /bg-yellow-50(?!\d)/g, to: 'bg-amber-100' },
  { from: /bg-green-50(?!\d)/g, to: 'bg-green-100' },
  { from: /bg-blue-50(?!\d)/g, to: 'bg-blue-100' },
  { from: /bg-red-50(?!\d)/g, to: 'bg-red-100' },
  { from: /bg-orange-50(?!\d)/g, to: 'bg-orange-100' },
  { from: /bg-purple-50(?!\d)/g, to: 'bg-purple-100' },
  { from: /bg-pink-50(?!\d)/g, to: 'bg-pink-100' },
  { from: /bg-indigo-50(?!\d)/g, to: 'bg-indigo-100' },
  { from: /bg-cyan-50(?!\d)/g, to: 'bg-cyan-100' },
  { from: /bg-teal-50(?!\d)/g, to: 'bg-teal-100' },
  
  // Background colors - Dark mode (améliorer l'opacité)
  { from: /dark:bg-yellow-950\/30/g, to: 'dark:bg-amber-900/25' },
  { from: /dark:bg-green-950\/30/g, to: 'dark:bg-green-900/25' },
  { from: /dark:bg-blue-950\/30/g, to: 'dark:bg-blue-900/25' },
  { from: /dark:bg-red-950\/30/g, to: 'dark:bg-red-900/25' },
  { from: /dark:bg-orange-950\/30/g, to: 'dark:bg-orange-900/25' },
  { from: /dark:bg-purple-950\/30/g, to: 'dark:bg-purple-900/25' },
  { from: /dark:bg-pink-950\/30/g, to: 'dark:bg-pink-900/25' },
  { from: /dark:bg-indigo-950\/30/g, to: 'dark:bg-indigo-900/25' },
  { from: /dark:bg-cyan-950\/30/g, to: 'dark:bg-cyan-900/25' },
  { from: /dark:bg-teal-950\/30/g, to: 'dark:bg-teal-900/25' },
  
  // Special fixes for small text (needs higher contrast)
  { from: /className="text-xs text-foreground\/70"/g, to: 'className="text-xs text-foreground/85"' },
  { from: /className="text-xs text-foreground\/75"/g, to: 'className="text-xs text-foreground/85"' },
  { from: /className="text-xs text-foreground\/80"/g, to: 'className="text-xs text-foreground/90"' },
];

// Directories to process
const dirsToProcess = [
  'app',
  'components',
];

// File extensions to process
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

let filesProcessed = 0;
let totalReplacements = 0;

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!extensions.includes(ext)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  let fileReplacements = 0;
  
  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(from, to);
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed ${fileReplacements} contrast issues in: ${filePath}`);
    totalReplacements += fileReplacements;
    filesProcessed++;
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Skip node_modules and .git
      if (item === 'node_modules' || item === '.git' || item === '.next') return;
      processDirectory(itemPath);
    } else if (stats.isFile()) {
      processFile(itemPath);
    }
  });
}

console.log('🎨 Starting contrast fix for professional dark mode...\n');

dirsToProcess.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`📁 Processing ${dir}...`);
    processDirectory(dirPath);
  }
});

console.log('\n✨ Contrast fix complete!');
console.log(`📊 Summary: Fixed ${totalReplacements} issues in ${filesProcessed} files`);
console.log('\n💡 Recommendations:');
console.log('  - Test in both light and dark modes');
console.log('  - Verify WCAG AAA compliance');
console.log('  - Check component hover states');
console.log('  - Review error and success states');
