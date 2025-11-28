#!/usr/bin/env node

/**
 * Script pour corriger les problèmes de contraste de texte sur fonds colorés
 * Assure que le texte sur fond coloré a toujours une couleur spécifiée appropriée
 */

const fs = require('fs');
const path = require('path');

// Patterns à détecter et corriger
const coloredBackgrounds = [
  'amber', 'yellow', 'green', 'blue', 'red', 'purple', 'orange', 'pink', 'indigo', 'cyan', 'teal'
];

// Fonction pour analyser et corriger le contenu
function fixColoredBackgroundContrast(content, filePath) {
  let fixed = content;
  let changes = [];
  
  // Pattern 1: Texte dans des divs avec fond coloré mais sans couleur de texte
  coloredBackgrounds.forEach(color => {
    // Chercher les bg-{color}-100 sans text-{color}-*
    const bgPattern = new RegExp(`bg-${color}-100[^>]*>([^<]*)<`, 'g');
    let match;
    while ((match = bgPattern.exec(content)) !== null) {
      const fullMatch = match[0];
      const textContent = match[1];
      
      // Si le texte n'a pas déjà une couleur spécifiée
      if (!fullMatch.includes(`text-${color}-`) && textContent.trim()) {
        console.log(`  ⚠️ Found uncolored text on ${color} background in ${filePath}`);
      }
    }
  });
  
  // Fix spécifiques pour les patterns communs
  const fixes = [
    // Fix pour les divs avec bg-*-100 et du texte direct
    {
      pattern: /className="([^"]*bg-(amber|yellow|green|blue|red|purple|orange)-100[^"]*)">\s*([^<]+)</g,
      replacement: (match, classes, color, text) => {
        if (!classes.includes(`text-${color}-`)) {
          const colorMap = {
            'amber': 'text-amber-900 dark:text-amber-100',
            'yellow': 'text-yellow-900 dark:text-yellow-100',
            'green': 'text-green-900 dark:text-green-100',
            'blue': 'text-blue-900 dark:text-blue-100',
            'red': 'text-red-900 dark:text-red-100',
            'purple': 'text-purple-900 dark:text-purple-100',
            'orange': 'text-orange-900 dark:text-orange-100'
          };
          const newClass = `${classes} ${colorMap[color]}`;
          changes.push(`Added ${colorMap[color]} for ${color} background`);
          return `className="${newClass}">${text}<`;
        }
        return match;
      }
    },
    
    // Fix pour les metrics/values dans des backgrounds colorés
    {
      pattern: /<div className="([^"]*bg-(amber|yellow|green|blue|red|purple|orange)-100[^"]*)">([^<]*)<div className="text-2xl font-bold">([^<]+)<\/div>/g,
      replacement: (match, outerClasses, color, before, value) => {
        const textColor = {
          'amber': 'text-amber-950',
          'yellow': 'text-yellow-950',
          'green': 'text-green-950',
          'blue': 'text-blue-950',
          'red': 'text-red-950',
          'purple': 'text-purple-950',
          'orange': 'text-orange-950'
        }[color];
        
        if (!match.includes(`text-${color}-`)) {
          changes.push(`Fixed metric value color on ${color} background`);
          return `<div className="${outerClasses}">${before}<div className="text-2xl font-bold ${textColor}">${value}</div>`;
        }
        return match;
      }
    },
    
    // Fix pour les backgrounds avec dark mode
    {
      pattern: /bg-(amber|yellow|green|blue|red|purple|orange)-100 dark:bg-\1-900\/2[05]/g,
      replacement: (match, color) => {
        // S'assurer que les bordures sont présentes
        if (!match.includes('border')) {
          changes.push(`Added border to ${color} background`);
          return `${match} border border-${color}-200 dark:border-${color}-800/50`;
        }
        return match;
      }
    }
  ];
  
  // Appliquer les fixes
  fixes.forEach(({ pattern, replacement }) => {
    const before = fixed;
    fixed = fixed.replace(pattern, replacement);
    if (before !== fixed) {
      console.log(`  ✅ Applied fixes in ${filePath}`);
    }
  });
  
  return { content: fixed, changes };
}

// Fonction principale pour traiter les fichiers
function processFile(filePath) {
  const ext = path.extname(filePath);
  if (ext !== '.tsx' && ext !== '.jsx') return;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const { content: fixed, changes } = fixColoredBackgroundContrast(content, filePath);
  
  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, 'utf-8');
    console.log(`✅ Fixed ${changes.length} issues in: ${filePath}`);
    changes.forEach(change => console.log(`   - ${change}`));
  }
}

// Fonction pour parcourir les répertoires
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

// Créer aussi un fichier de guidelines
const guidelines = `
/**
 * Guidelines pour les couleurs de texte sur fonds colorés
 * 
 * RÈGLE PRINCIPALE: Toujours spécifier une couleur de texte appropriée sur fond coloré
 */

export const coloredBackgroundTextColors = {
  // Pour fond amber-100 / dark:amber-900/20
  amber: {
    title: 'text-amber-950 dark:text-amber-50',
    body: 'text-amber-900 dark:text-amber-100',
    secondary: 'text-amber-800 dark:text-amber-200'
  },
  
  // Pour fond green-100 / dark:green-900/25
  green: {
    title: 'text-green-950 dark:text-green-50',
    body: 'text-green-900 dark:text-green-100',
    secondary: 'text-green-800 dark:text-green-200'
  },
  
  // Pour fond blue-100 / dark:blue-900/25
  blue: {
    title: 'text-blue-950 dark:text-blue-50',
    body: 'text-blue-900 dark:text-blue-100',
    secondary: 'text-blue-800 dark:text-blue-200'
  },
  
  // Pour fond red-100 / dark:red-900/25
  red: {
    title: 'text-red-950 dark:text-red-50',
    body: 'text-red-900 dark:text-red-100',
    secondary: 'text-red-800 dark:text-red-200'
  },
  
  // Pour fond purple-100 / dark:purple-900/25
  purple: {
    title: 'text-purple-950 dark:text-purple-50',
    body: 'text-purple-900 dark:text-purple-100',
    secondary: 'text-purple-800 dark:text-purple-200'
  }
};

// Exemple d'utilisation:
// <div className="bg-amber-100 dark:bg-amber-900/20">
//   <h3 className="text-amber-950 dark:text-amber-50">Titre</h3>
//   <p className="text-amber-900 dark:text-amber-100">Contenu</p>
//   <span className="text-amber-800 dark:text-amber-200">Détails</span>
// </div>
`;

// Sauvegarder les guidelines
fs.writeFileSync(
  path.join(process.cwd(), 'lib', 'colored-background-guidelines.ts'),
  guidelines,
  'utf-8'
);

console.log('\n🎨 Starting colored background contrast fix...\n');

// Traiter les répertoires principaux
['app', 'components'].forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`📁 Processing ${dir}...`);
    processDirectory(dirPath);
  }
});

console.log('\n✅ Guidelines saved to lib/colored-background-guidelines.ts');
console.log('\n✨ Colored background fix complete!');
