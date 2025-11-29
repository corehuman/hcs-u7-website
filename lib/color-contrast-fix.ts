/**
 * Color Contrast Fix Guidelines for Professional Dark Mode
 * Target audience: Scientists, Developers, Programmers
 * 
 * Principe: Mode dark moderne avec contraste optimal WCAG AAA
 */

export const colorFix = {
  // Text opacity guidelines (remplace text-muted-foreground partout)
  text: {
    // Primary text: full opacity
    primary: 'text-foreground', // 100%
    
    // Secondary text (descriptions, labels)
    secondary: 'text-foreground/85', // était text-muted-foreground
    
    // Tertiary text (hints, timestamps)
    tertiary: 'text-foreground/75',
    
    // Small text (must be higher contrast)
    small: 'text-foreground/90', // text-xs needs more contrast
    
    // Disabled
    disabled: 'text-foreground/50'
  },
  
  // Background colors (remplace tous les bg-*-50)
  backgrounds: {
    // Success states
    success: {
      light: 'bg-green-100',
      dark: 'dark:bg-green-900/25', // Plus visible en dark
      border: 'border-green-200 dark:border-green-800/50'
    },
    
    // Warning/Highlight states
    warning: {
      light: 'bg-amber-100',
      dark: 'dark:bg-amber-900/25',
      border: 'border-amber-200 dark:border-amber-800/50'
    },
    
    // Error states
    error: {
      light: 'bg-red-100',
      dark: 'dark:bg-red-900/25',
      border: 'border-red-200 dark:border-red-800/50'
    },
    
    // Info states
    info: {
      light: 'bg-blue-100',
      dark: 'dark:bg-blue-900/25',
      border: 'border-blue-200 dark:border-blue-800/50'
    },
    
    // Neutral highlights
    neutral: {
      light: 'bg-gray-100',
      dark: 'dark:bg-gray-800/30',
      border: 'border-gray-200 dark:border-gray-700/50'
    }
  },
  
  // Component specific
  components: {
    // Cards and panels
    card: 'bg-card border-border',
    cardHighlight: 'bg-card/90 border-primary/20',
    
    // Buttons
    buttonHover: 'hover:bg-accent hover:text-accent-foreground',
    
    // Code blocks (pour développeurs)
    codeBlock: 'bg-gray-900 dark:bg-gray-950/95 text-gray-100',
    codeInline: 'bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100',
    
    // Tooltips
    tooltip: 'bg-popover text-popover-foreground border-border',
    
    // Badges
    badgeDefault: 'bg-secondary text-secondary-foreground',
    badgeSuccess: 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100',
    badgeWarning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100',
    badgeError: 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100'
  },
  
  // Professional color scheme for dark mode
  darkMode: {
    // Main backgrounds
    background: 'bg-gray-950', // Very dark for less eye strain
    surface: 'bg-gray-900', // Slightly lighter for cards
    elevated: 'bg-gray-850', // For elevated surfaces
    
    // Accents for code/terminal feel
    primary: 'text-blue-400', // Bright but not harsh
    secondary: 'text-cyan-400',
    accent: 'text-amber-400',
    
    // Semantic colors
    success: 'text-green-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    
    // Borders
    borderDefault: 'border-gray-800',
    borderHover: 'border-gray-700',
    borderFocus: 'border-blue-500'
  }
};

/**
 * Utility function to fix contrast issues
 * Usage: fixContrast('bg-yellow-50 dark:bg-yellow-950/30') 
 * Returns: 'bg-amber-100 dark:bg-amber-900/25 border border-amber-200 dark:border-amber-800/50'
 */
export function fixContrast(className: string): string {
  // Mapping des anciennes classes vers les nouvelles
  const replacements: Record<string, string> = {
    // Text replacements
    'text-muted-foreground': 'text-foreground/85',
    'text-gray-500': 'text-foreground/75',
    'text-gray-400': 'text-foreground/70',
    
    // Background replacements - Light mode
    'bg-yellow-50': 'bg-amber-100',
    'bg-green-50': 'bg-green-100',
    'bg-blue-50': 'bg-blue-100',
    'bg-red-50': 'bg-red-100',
    'bg-orange-50': 'bg-orange-100',
    'bg-purple-50': 'bg-purple-100',
    'bg-gray-50': 'bg-gray-100',
    
    // Background replacements - Dark mode
    'dark:bg-yellow-950/30': 'dark:bg-amber-900/25',
    'dark:bg-green-950/30': 'dark:bg-green-900/25',
    'dark:bg-blue-950/30': 'dark:bg-blue-900/25',
    'dark:bg-red-950/30': 'dark:bg-red-900/25',
    'dark:bg-orange-950/30': 'dark:bg-orange-900/25',
    'dark:bg-purple-950/30': 'dark:bg-purple-900/25',
    'dark:bg-gray-950/30': 'dark:bg-gray-800/30'
  };
  
  let fixed = className;
  Object.entries(replacements).forEach(([old, replacement]) => {
    fixed = fixed.replace(new RegExp(old, 'g'), replacement);
  });
  
  return fixed;
}

/**
 * Get proper contrast class based on text size
 */
export function getTextContrast(size: 'xs' | 'sm' | 'base' | 'lg', importance: 'primary' | 'secondary' | 'tertiary' = 'secondary'): string {
  if (size === 'xs') {
    // Small text needs higher contrast
    return importance === 'primary' ? 'text-foreground' : 'text-foreground/90';
  }
  
  if (size === 'sm') {
    return importance === 'primary' ? 'text-foreground' : 'text-foreground/85';
  }
  
  // Base and larger can have standard contrast
  return importance === 'primary' ? 'text-foreground' : 
         importance === 'secondary' ? 'text-foreground/85' : 
         'text-foreground/75';
}
