#!/usr/bin/env node

/**
 * Font Sync Script
 * Reads globals.css, extracts font names from CSS variables,
 * and updates layout.tsx with correct Google Fonts imports
 */

import fs from 'fs';
import path from 'path';

// Font mapping from display names to Google Fonts API names and their properties
// Generic system fonts that should not be imported from Google Fonts
const SYSTEM_FONTS = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  '-apple-system',
  'BlinkMacSystemFont',
]);

const FONT_MAPPINGS = {
  'Geist Mono': {
    name: 'Geist_Mono',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800'],
    variable: true,
  },
  'Roboto Mono': {
    name: 'Roboto_Mono',
    weights: ['100', '200', '300', '400', '500', '600', '700'],
    variable: false,
  },
  Roboto: {
    name: 'Roboto',
    weights: ['100', '300', '400', '500', '700', '900'],
    variable: true,
  },
  Inter: {
    name: 'Inter',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: true,
  },
  'Open Sans': {
    name: 'Open_Sans',
    weights: ['300', '400', '500', '600', '700', '800'],
    variable: false,
  },
  Lato: {
    name: 'Lato',
    weights: ['100', '300', '400', '700', '900'],
    variable: true,
  },
  Montserrat: {
    name: 'Montserrat',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: true,
  },
  Poppins: {
    name: 'Poppins',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: true,
  },
  'Source Sans Pro': {
    name: 'Source_Sans_Pro',
    weights: ['200', '300', '400', '600', '700', '900'],
    variable: false,
  },
  Oswald: {
    name: 'Oswald',
    weights: ['200', '300', '400', '500', '600', '700'],
    variable: false,
  },
  Raleway: {
    name: 'Raleway',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: true,
  },
  Ubuntu: {
    name: 'Ubuntu',
    weights: ['300', '400', '500', '700'],
    variable: false,
  },
  'Playfair Display': {
    name: 'Playfair_Display',
    weights: ['400', '500', '600', '700', '800', '900'],
    variable: false,
  },
  Merriweather: {
    name: 'Merriweather',
    weights: ['300', '400', '700', '900'],
    variable: false,
  },
  Nunito: {
    name: 'Nunito',
    weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
    variable: true,
  },
  'Work Sans': {
    name: 'Work_Sans',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: true,
  },
  'Fira Sans': {
    name: 'Fira_Sans',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: false,
  },
  Quicksand: {
    name: 'Quicksand',
    weights: ['300', '400', '500', '600', '700'],
    variable: false,
  },
  Inconsolata: {
    name: 'Inconsolata',
    weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
    variable: false,
  },
  'JetBrains Mono': {
    name: 'JetBrains_Mono',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800'],
    variable: true,
  },
  'Space Grotesk': {
    name: 'Space_Grotesk',
    weights: ['300', '400', '500', '600', '700'],
    variable: true,
  },
  'IBM Plex Sans': {
    name: 'IBM_Plex_Sans',
    weights: ['100', '200', '300', '400', '500', '600', '700'],
    variable: true,
  },
  'IBM Plex Mono': {
    name: 'IBM_Plex_Mono',
    weights: ['100', '200', '300', '400', '500', '600', '700'],
    variable: true,
  },
  'Roboto Condensed': {
    name: 'Roboto_Condensed',
    weights: ['300', '400', '700'],
    variable: false,
  },
  'Roboto Flex': {
    name: 'Roboto_Flex',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: true,
  },
  'Roboto Serif': {
    name: 'Roboto_Serif',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: false,
  },
  'Roboto Slab': {
    name: 'Roboto_Slab',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: false,
  },
  serif: {
    name: 'serif',
    weights: ['400'],
    variable: false,
  },
  Rubik: {
    name: 'Rubik',
    weights: ['300', '400', '500', '600', '700', '800', '900'],
    variable: true,
  },
  // Add more mappings as needed
};

function normalizeFontName(fontName) {
  // Clean up the font name (remove quotes, extra spaces)
  const cleanName = fontName.replace(/['"]/g, '').trim();

  // Return the mapped font info or create a default one
  return (
    FONT_MAPPINGS[cleanName] || {
      name: cleanName
        .replace(/\s+/g, '_')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      weights: ['400', '500', '600', '700'],
      variable: false,
    }
  );
}

function extractFontsFromCSS(cssContent) {
  const fonts = {
    sans: null,
    serif: null,
    mono: null,
  };

  // Match --font-* variable declarations
  const fontRegex = /--font-(sans|serif|mono):\s*([^;]+);/g;
  let match;

  while ((match = fontRegex.exec(cssContent)) !== null) {
    const [, type, fontStack] = match;
    // Extract the first font from the stack (the primary font)
    const firstFont = fontStack.split(',')[0].replace(/['"]/g, '').trim();
    fonts[type] = firstFont;
  }

  return fonts;
}

function generateFontImport(fonts) {
  const uniqueFonts = new Map();

  // Collect unique Google Fonts (not system fonts) and their usages
  if (fonts.sans) {
    const fontInfo = normalizeFontName(fonts.sans);
    if (!SYSTEM_FONTS.has(fonts.sans) && !uniqueFonts.has(fontInfo.name)) {
      uniqueFonts.set(fontInfo.name, {
        importName: 'FontSans',
        originalName: fonts.sans,
      });
    }
  }

  if (fonts.serif) {
    const fontInfo = normalizeFontName(fonts.serif);
    if (!SYSTEM_FONTS.has(fonts.serif) && !uniqueFonts.has(fontInfo.name)) {
      uniqueFonts.set(fontInfo.name, {
        importName: 'FontSerif',
        originalName: fonts.serif,
      });
    }
  }

  if (fonts.mono) {
    const fontInfo = normalizeFontName(fonts.mono);
    if (!SYSTEM_FONTS.has(fonts.mono) && !uniqueFonts.has(fontInfo.name)) {
      uniqueFonts.set(fontInfo.name, {
        importName: 'FontMono',
        originalName: fonts.mono,
      });
    }
  }

  // Generate imports - only for Google Fonts
  const imports = [];
  for (const [fontName, { importName }] of uniqueFonts) {
    imports.push(`${fontName} as ${importName}`);
  }

  if (imports.length === 0) {
    return '';
  }

  return `import {\n  ${imports.join(',\n  ')}\n} from "next/font/google";`;
}

function updateLayoutFile(fonts, layoutPath) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  // Generate new import statement
  const newImport = generateFontImport(fonts);

  // If no imports needed (all system fonts), remove any existing Google Font imports
  if (!newImport) {
    const importRegexes = [
      /import\s*{\s*[^}]*\s*}\s*from\s*["']next\/font\/google["'];?\s*\n/g,
      /import\s*{\s*[\s\S]*?\s*}\s*from\s*["']next\/font\/google["'];?\s*\n/g,
    ];

    let newContent = layoutContent;
    for (const regex of importRegexes) {
      newContent = newContent.replace(regex, '');
    }

    fs.writeFileSync(layoutPath, newContent, 'utf8');
    console.log('✅ Removed Google Font imports (all fonts are system fonts)');
    return;
  }

  // Replace the existing font import - try multiple patterns
  const importRegexes = [
    /import\s*{\s*[^}]*\s*}\s*from\s*["']next\/font\/google["'];?/,
    /import\s*{\s*[\s\S]*?\s*}\s*from\s*["']next\/font\/google["'];?/,
  ];

  let newContent = layoutContent;
  let matched = false;

  for (const regex of importRegexes) {
    if (regex.test(layoutContent)) {
      newContent = layoutContent.replace(regex, newImport);
      matched = true;
      break;
    }
  }

  if (!matched) {
    // If no import found, add it after the Metadata import
    newContent = layoutContent.replace(
      /(import type { Metadata } from "next";)/,
      `$1\n${newImport}`
    );
  }

  fs.writeFileSync(layoutPath, newContent, 'utf8');
  console.log('✅ Updated layout.tsx with new font imports');
}

function updateFontVariables(fonts, layoutPath) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');

  let newContent = layoutContent;

  // Update each font configuration individually
  if (fonts.sans) {
    if (SYSTEM_FONTS.has(fonts.sans)) {
      // System font - no import needed, just use the font name
      const sansConfig = `const fontSans = {\n  variable: '--font-sans',\n};`;

      // Replace existing fontSans config
      const sansRegex = /(const fontSans = )[^;]+;/;
      if (sansRegex.test(newContent)) {
        newContent = newContent.replace(sansRegex, sansConfig);
      }
    } else {
      // Google Font
      const fontInfo = normalizeFontName(fonts.sans);
      const importName = 'FontSans';
      const weights = JSON.stringify(fontInfo.weights);
      const sansConfig = `const fontSans = ${importName}({\n  subsets: ['latin'],\n  weight: ${weights},\n  variable: '--font-sans',\n});`;

      // Replace existing fontSans config
      const sansRegex = /(const fontSans = )[^;]+;/;
      if (sansRegex.test(newContent)) {
        newContent = newContent.replace(sansRegex, sansConfig);
      }
    }
  }

  if (fonts.serif) {
    if (SYSTEM_FONTS.has(fonts.serif)) {
      // System font - no import needed, just use the font name
      const serifConfig = `const fontSerif = {\n  variable: '--font-serif',\n};`;

      // Replace existing fontSerif config
      const serifRegex = /(const fontSerif = )[^;]+;/;
      if (serifRegex.test(newContent)) {
        newContent = newContent.replace(serifRegex, serifConfig);
      }
    } else {
      // Google Font
      const fontInfo = normalizeFontName(fonts.serif);
      const importName = 'FontSerif';
      const weights = JSON.stringify(fontInfo.weights);
      const serifConfig = `const fontSerif = ${importName}({\n  subsets: ['latin'],\n  weight: ${weights},\n  variable: '--font-serif',\n});`;

      // Replace existing fontSerif config
      const serifRegex = /(const fontSerif = )[^;]+;/;
      if (serifRegex.test(newContent)) {
        newContent = newContent.replace(serifRegex, serifConfig);
      }
    }
  }

  if (fonts.mono) {
    if (SYSTEM_FONTS.has(fonts.mono)) {
      // System font - no import needed, just use the font name
      const monoConfig = `const fontMono = {\n  variable: '--font-mono',\n};`;

      // Replace existing fontMono config
      const monoRegex = /(const fontMono = )[^;]+;/;
      if (monoRegex.test(newContent)) {
        newContent = newContent.replace(monoRegex, monoConfig);
      }
    } else {
      // Google Font
      const fontInfo = normalizeFontName(fonts.mono);
      const importName = 'FontMono';
      const weights = JSON.stringify(fontInfo.weights);
      const monoConfig = `const fontMono = ${importName}({\n  subsets: ['latin'],\n  weight: ${weights},\n  variable: '--font-mono',\n});`;

      // Replace existing fontMono config
      const monoRegex = /(const fontMono = )[^;]+;/;
      if (monoRegex.test(newContent)) {
        newContent = newContent.replace(monoRegex, monoConfig);
      }
    }
  }

  if (newContent !== layoutContent) {
    fs.writeFileSync(layoutPath, newContent, 'utf8');
    console.log('✅ Updated font configurations in layout.tsx');
  }
}

function main() {
  try {
    const cssPath = path.join(process.cwd(), 'app', 'globals.css');
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');

    if (!fs.existsSync(cssPath)) {
      throw new Error(`CSS file not found: ${cssPath}`);
    }

    if (!fs.existsSync(layoutPath)) {
      throw new Error(`Layout file not found: ${layoutPath}`);
    }

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const fonts = extractFontsFromCSS(cssContent);

    console.log('📝 Extracted fonts from CSS:');
    console.log(`  Sans: ${fonts.sans || 'Not found'}`);
    console.log(`  Serif: ${fonts.serif || 'Not found'}`);
    console.log(`  Mono: ${fonts.mono || 'Not found'}`);

    if (!fonts.sans && !fonts.serif && !fonts.mono) {
      throw new Error('No font variables found in CSS file');
    }

    updateLayoutFile(fonts, layoutPath);
    updateFontVariables(fonts, layoutPath);

    console.log('\n🎉 Font synchronization completed successfully!');
    console.log(
      `Updated layout.tsx with fonts: ${Object.values(fonts).filter(Boolean).join(', ')}`
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
