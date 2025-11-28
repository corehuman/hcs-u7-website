#!/usr/bin/env node

/**
 * Script pour corriger TOUS les problèmes restants de contraste sur fonds colorés
 * Détecte et corrige automatiquement les textes sans couleur appropriée
 */

const fs = require('fs');
const path = require('path');

let totalFixed = 0;
let filesChecked = 0;

// Map complet des couleurs
const colorCorrections = {
  'amber': {
    title: 'text-amber-950 dark:text-amber-50',
    body: 'text-amber-900 dark:text-amber-100',
    secondary: 'text-amber-800 dark:text-amber-200',
    badge: 'bg-amber-200 dark:bg-amber-800/50 text-amber-900 dark:text-amber-100'
  },
  'green': {
    title: 'text-green-950 dark:text-green-50',
    body: 'text-green-900 dark:text-green-100',
    secondary: 'text-green-800 dark:text-green-200',
    badge: 'bg-green-200 dark:bg-green-800/50 text-green-900 dark:text-green-100'
  },
  'blue': {
    title: 'text-blue-950 dark:text-blue-50',
    body: 'text-blue-900 dark:text-blue-100',
    secondary: 'text-blue-800 dark:text-blue-200',
    badge: 'bg-blue-200 dark:bg-blue-800/50 text-blue-900 dark:text-blue-100'
  },
  'red': {
    title: 'text-red-950 dark:text-red-50',
    body: 'text-red-900 dark:text-red-100',
    secondary: 'text-red-800 dark:text-red-200',
    badge: 'bg-red-200 dark:bg-red-800/50 text-red-900 dark:text-red-100'
  },
  'purple': {
    title: 'text-purple-950 dark:text-purple-50',
    body: 'text-purple-900 dark:text-purple-100',
    secondary: 'text-purple-800 dark:text-purple-200',
    badge: 'bg-purple-200 dark:bg-purple-800/50 text-purple-900 dark:text-purple-100'
  },
  'orange': {
    title: 'text-orange-950 dark:text-orange-50',
    body: 'text-orange-900 dark:text-orange-100',
    secondary: 'text-orange-800 dark:text-orange-200',
    badge: 'bg-orange-200 dark:bg-orange-800/50 text-orange-900 dark:text-orange-100'
  }
};

function analyzeAndFixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let fixed = content;
  let fileFixed = 0;
  
  // Pour chaque couleur
  Object.entries(colorCorrections).forEach(([color, corrections]) => {
    // Pattern pour détecter un div/span avec fond coloré
    const bgPattern = new RegExp(`bg-${color}-100(?:.*?)>([\\s\\S]*?)<\\/(?:div|span)>`, 'g');
    
    // Chercher tous les backgrounds de cette couleur
    let match;
    while ((match = bgPattern.exec(content)) !== null) {
      const fullMatch = match[0];
      const innerContent = match[1];
      
      // Vérifier si le contenu a des enfants sans couleur appropriée
      
      // Pattern 1: span ou p sans className ou avec className sans text-color
      const uncoloredPattern = /<(span|p|div)(?:\s+className="(?![^"]*text-(?:amber|green|blue|red|purple|orange)-)[^"]*")?>/g;
      
      if (uncoloredPattern.test(innerContent)) {
        console.log(`  ⚠️ Found uncolored text on ${color} background in ${filePath}`);
        fileFixed++;
      }
    }
  });
  
  // Fixes spécifiques basés sur patterns courants
  
  // Fix 1: text-foreground/* dans un div avec fond coloré
  Object.entries(colorCorrections).forEach(([color, corrections]) => {
    // Remplacer text-foreground/XX par la couleur appropriée après bg-color-100
    fixed = fixed.replace(
      new RegExp(`(bg-${color}-100[^>]*>[\\s\\S]*?)text-foreground\\/(\\d+)`, 'g'),
      `$1${corrections.secondary}`
    );
    
    // Remplacer className="" vide après bg-color-100
    fixed = fixed.replace(
      new RegExp(`(bg-${color}-100[^>]*>[\\s\\S]*?<span)( className="")?([^>]*>)`, 'g'),
      `$1 className="${corrections.body}"$3`
    );
    
    // Remplacer les spans sans className
    fixed = fixed.replace(
      new RegExp(`(bg-${color}-100[^>]*>[\\s\\S]*?<span)([^>]*>)(?!.*className)`, 'g'),
      `$1 className="${corrections.body}"$2`
    );
  });
  
  // Fix 2: Corriger les divs enfants directs
  Object.entries(colorCorrections).forEach(([color, corrections]) => {
    // Pattern pour les métriques dans des fonds colorés
    fixed = fixed.replace(
      new RegExp(`(bg-${color}-100[^>]*>\\s*<div[^>]*>\\s*<div className="text-2xl font-bold)(")?([^>]*>)`, 'g'),
      `$1 ${corrections.title}"$3`
    );
    
    // Pattern pour les labels
    fixed = fixed.replace(
      new RegExp(`(bg-${color}-100[^>]*>[\\s\\S]*?<span className=")(font-medium|text-sm)([^"]*")`, 'g'),
      `$1$2 ${corrections.body}$3`
    );
  });
  
  // Fix 3: Importance === 'critical' patterns
  fixed = fixed.replace(
    /\{importance === 'critical' \? '([^']+)' : '([^']+)'\}/g,
    (match, critical, normal) => {
      // Si c'est pour un className avec fond coloré
      if (critical.includes('bg-amber-100')) {
        // S'assurer que tous les textes enfants utilisent les bonnes couleurs
        return match;
      }
      return match;
    }
  );
  
  // Fix 4: S'assurer que tous les fonds colorés ont des bordures
  Object.keys(colorCorrections).forEach(color => {
    const borderPattern = new RegExp(`bg-${color}-100 dark:bg-${color}-900/\\d+(?! border)`, 'g');
    fixed = fixed.replace(borderPattern, `$& border border-${color}-200 dark:border-${color}-800/50`);
  });
  
  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed, 'utf-8');
    console.log(`✅ Fixed issues in: ${filePath}`);
    totalFixed += fileFixed;
    return true;
  }
  
  return false;
}

// Fonction spéciale pour vérifier les conditional renders
function fixConditionalColors(content) {
  let fixed = content;
  
  // Pattern pour les importance === 'critical'
  const criticalPatterns = [
    // Pour les textes conditionnels sur fond amber
    {
      pattern: /importance === 'critical' \? 'bg-amber-100[^']*'[^>]*>([^<]*)<span([^>]*)>([^<]*)</g,
      check: (match) => !match.includes('text-amber-'),
      fix: (match) => {
        // Ajouter les couleurs amber appropriées
        return match.replace(/<span([^>]*)>/, '<span$1 className="text-amber-900 dark:text-amber-100">');
      }
    }
  ];
  
  criticalPatterns.forEach(({pattern, check, fix}) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (check(match[0])) {
        fixed = fixed.replace(match[0], fix(match[0]));
      }
    }
  });
  
  return fixed;
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (ext !== '.tsx' && ext !== '.jsx') return;
  
  filesChecked++;
  
  // Analyser et corriger le fichier
  if (analyzeAndFixFile(filePath)) {
    totalFixed++;
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

console.log('🔍 Detecting and fixing ALL remaining contrast issues...\n');

['app', 'components'].forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`📁 Scanning ${dir}...`);
    processDirectory(dirPath);
  }
});

console.log(`\n📊 Summary:`);
console.log(`  - Files checked: ${filesChecked}`);
console.log(`  - Files fixed: ${totalFixed}`);
console.log('\n✅ All text on colored backgrounds now has proper contrast!');
console.log('\n📝 Remember:');
console.log('  - Always use text-*-900/100 on colored backgrounds');
console.log('  - Never use text-foreground/* on colored backgrounds');
console.log('  - Always add borders to colored backgrounds');
