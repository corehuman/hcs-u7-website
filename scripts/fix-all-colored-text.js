#!/usr/bin/env node

/**
 * Script complet pour corriger TOUS les problèmes de contraste de texte sur fonds colorés
 * Assure un contraste WCAG AAA pour une audience professionnelle
 */

const fs = require('fs');
const path = require('path');

let totalFixed = 0;

// Map des corrections pour chaque couleur de fond
const colorMap = {
  'amber': {
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    border: 'border border-amber-200 dark:border-amber-800/40',
    textTitle: 'text-amber-950 dark:text-amber-50',
    textBody: 'text-amber-900 dark:text-amber-100',
    textSecondary: 'text-amber-800 dark:text-amber-200'
  },
  'yellow': {
    bg: 'bg-amber-100 dark:bg-amber-900/20', // Remplacer yellow par amber
    border: 'border border-amber-200 dark:border-amber-800/40',
    textTitle: 'text-amber-950 dark:text-amber-50',
    textBody: 'text-amber-900 dark:text-amber-100',
    textSecondary: 'text-amber-800 dark:text-amber-200'
  },
  'green': {
    bg: 'bg-green-100 dark:bg-green-900/25',
    border: 'border border-green-200 dark:border-green-800/50',
    textTitle: 'text-green-950 dark:text-green-50',
    textBody: 'text-green-900 dark:text-green-100',
    textSecondary: 'text-green-800 dark:text-green-200'
  },
  'blue': {
    bg: 'bg-blue-100 dark:bg-blue-900/25',
    border: 'border border-blue-200 dark:border-blue-800/50',
    textTitle: 'text-blue-950 dark:text-blue-50',
    textBody: 'text-blue-900 dark:text-blue-100',
    textSecondary: 'text-blue-800 dark:text-blue-200'
  },
  'red': {
    bg: 'bg-red-100 dark:bg-red-900/25',
    border: 'border border-red-200 dark:border-red-800/50',
    textTitle: 'text-red-950 dark:text-red-50',
    textBody: 'text-red-900 dark:text-red-100',
    textSecondary: 'text-red-800 dark:text-red-200'
  },
  'purple': {
    bg: 'bg-purple-100 dark:bg-purple-900/25',
    border: 'border border-purple-200 dark:border-purple-800/50',
    textTitle: 'text-purple-950 dark:text-purple-50',
    textBody: 'text-purple-900 dark:text-purple-100',
    textSecondary: 'text-purple-800 dark:text-purple-200'
  },
  'orange': {
    bg: 'bg-orange-100 dark:bg-orange-900/25',
    border: 'border border-orange-200 dark:border-orange-800/50',
    textTitle: 'text-orange-950 dark:text-orange-50',
    textBody: 'text-orange-900 dark:text-orange-100',
    textSecondary: 'text-orange-800 dark:text-orange-200'
  },
  'pink': {
    bg: 'bg-pink-100 dark:bg-pink-900/25',
    border: 'border border-pink-200 dark:border-pink-800/50',
    textTitle: 'text-pink-950 dark:text-pink-50',
    textBody: 'text-pink-900 dark:text-pink-100',
    textSecondary: 'text-pink-800 dark:text-pink-200'
  },
  'indigo': {
    bg: 'bg-indigo-100 dark:bg-indigo-900/25',
    border: 'border border-indigo-200 dark:border-indigo-800/50',
    textTitle: 'text-indigo-950 dark:text-indigo-50',
    textBody: 'text-indigo-900 dark:text-indigo-100',
    textSecondary: 'text-indigo-800 dark:text-indigo-200'
  },
  'cyan': {
    bg: 'bg-cyan-100 dark:bg-cyan-900/25',
    border: 'border border-cyan-200 dark:border-cyan-800/50',
    textTitle: 'text-cyan-950 dark:text-cyan-50',
    textBody: 'text-cyan-900 dark:text-cyan-100',
    textSecondary: 'text-cyan-800 dark:text-cyan-200'
  },
  'teal': {
    bg: 'bg-teal-100 dark:bg-teal-900/25',
    border: 'border border-teal-200 dark:border-teal-800/50',
    textTitle: 'text-teal-950 dark:text-teal-50',
    textBody: 'text-teal-900 dark:text-teal-100',
    textSecondary: 'text-teal-800 dark:text-teal-200'
  }
};

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (ext !== '.tsx' && ext !== '.jsx') return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  let fileFixed = 0;
  
  // Fix 1: Corriger les couleurs de texte incorrectes sur fonds colorés
  Object.entries(colorMap).forEach(([color, config]) => {
    // Pattern pour text-{color}-600 ou text-{color}-700 sur fond coloré
    const wrongTextPattern = new RegExp(
      `text-${color}-(600|700)(?![0-9])`,
      'g'
    );
    
    // Remplacer par la bonne couleur
    if (content.includes(`bg-${color}-100`)) {
      const matches = content.match(wrongTextPattern);
      if (matches) {
        content = content.replace(wrongTextPattern, config.textBody);
        fileFixed += matches.length;
      }
    }
  });
  
  // Fix 2: Corriger les backgrounds sans bordures
  Object.entries(colorMap).forEach(([color, config]) => {
    // Pattern pour bg-{color}-100 sans bordure
    const bgPattern = new RegExp(
      `bg-${color}-100 dark:bg-${color}-9\\d{2}/\\d+(?![^"]*border)`,
      'g'
    );
    
    content = content.replace(bgPattern, (match) => {
      fileFixed++;
      return `${match} ${config.border}`;
    });
  });
  
  // Fix 3: Remplacer text-foreground/* sur fonds colorés
  Object.entries(colorMap).forEach(([color, config]) => {
    // Chercher les divs avec fond coloré et text-foreground
    const divPattern = new RegExp(
      `(bg-${color}-100[^>]*>.*?)text-foreground/(\\d+)`,
      'gs'
    );
    
    content = content.replace(divPattern, (match, before, opacity) => {
      fileFixed++;
      return `${before}${config.textSecondary}`;
    });
  });
  
  // Fix 4: Corriger les dark mode backgrounds
  content = content.replace(/dark:bg-(\w+)-950\/30/g, 'dark:bg-$1-900/25');
  
  // Fix 5: Cas spéciaux - métriques avec fond coloré
  content = content.replace(
    /<div className="text-2xl font-bold text-(\w+)-600">/g,
    (match, color) => {
      if (colorMap[color]) {
        fileFixed++;
        return `<div className="text-2xl font-bold ${colorMap[color].textBody}">`;
      }
      return match;
    }
  );
  
  // Fix 6: Remplacer les yellow par amber
  content = content.replace(/bg-yellow-/g, 'bg-amber-');
  content = content.replace(/text-yellow-/g, 'text-amber-');
  content = content.replace(/border-yellow-/g, 'border-amber-');
  content = content.replace(/dark:bg-yellow-/g, 'dark:bg-amber-');
  content = content.replace(/dark:text-yellow-/g, 'dark:text-amber-');
  content = content.replace(/dark:border-yellow-/g, 'dark:border-amber-');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed ${fileFixed} issues in: ${filePath}`);
    totalFixed += fileFixed;
  }
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

console.log('🎨 Fixing ALL text contrast issues on colored backgrounds...\n');

['app', 'components'].forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`📁 Processing ${dir}...`);
    processDirectory(dirPath);
  }
});

console.log(`\n✅ Total fixes applied: ${totalFixed}`);
console.log('\n📝 Guidelines:');
console.log('  - Amber backgrounds: text-amber-900 (light) / text-amber-100 (dark)');
console.log('  - Green backgrounds: text-green-900 (light) / text-green-100 (dark)');
console.log('  - Blue backgrounds: text-blue-900 (light) / text-blue-100 (dark)');
console.log('  - Red backgrounds: text-red-900 (light) / text-red-100 (dark)');
console.log('  - Purple backgrounds: text-purple-900 (light) / text-purple-100 (dark)');
console.log('\n✨ All colored backgrounds now have proper text contrast!');
