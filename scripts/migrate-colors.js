#!/usr/bin/env node

/**
 * Color Migration Script v2
 *
 * Scans CSS files and replaces hardcoded colors with design token variables.
 * - Only uses existing design tokens (never adds new ones)
 * - Prefers matches in the same hue, then saturation, then lightness
 * - Has an outer bound - colors too different are logged but not changed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Design tokens - FIXED, never add to this
const DESIGN_TOKENS = {
  // Brand Colors - Green
  '--kpn-green-100': '#ecfbec',
  '--kpn-green-200': '#d9f6d9',
  '--kpn-green-300': '#c0f0c0',
  '--kpn-green-500': '#00c300',
  '--kpn-green-600': '#00a800',
  '--kpn-green-700': '#008c00',

  // Brand Colors - Lime
  '--kpn-lime-100': '#f9ffe3',
  '--kpn-lime-300': '#edff9a',
  '--kpn-lime-400': '#e5ff6f',
  '--kpn-lime-500': '#ddff44',
  '--kpn-lime-600': '#bfe125',

  // Brand Colors - Blue
  '--kpn-blue-50': '#f2f7fe',
  '--kpn-blue-100': '#e5f0fd',
  '--kpn-blue-200': '#b7d4fa',
  '--kpn-blue-300': '#9ac0f7',
  '--kpn-blue-400': '#3385f1',
  '--kpn-blue-500': '#0066ee',
  '--kpn-blue-600': '#0d56b5',

  // Red
  '--kpn-red-500': '#e22e22',
  '--kpn-red-600': '#c72519',

  // Grayscale
  '--gray-000': '#ffffff',
  '--gray-100': '#f3f3f3',
  '--gray-200': '#d3d3d3',
  '--gray-300': '#939393',
  '--gray-400': '#737373',
  '--gray-500': '#131313',
};

// Maximum distance allowed for replacement (in HSL space weighted)
const MAX_DISTANCE = 25;

// Parse hex color to RGB
function hexToRgb(hex) {
  hex = hex.replace('#', '').toLowerCase();
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Calculate weighted color distance (prioritizing hue, then saturation, then lightness)
function colorDistance(hsl1, hsl2) {
  // Hue difference (handle circular nature)
  let hueDiff = Math.abs(hsl1.h - hsl2.h);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;

  // For grays (low saturation), hue doesn't matter much
  const satAvg = (hsl1.s + hsl2.s) / 2;
  const hueWeight = satAvg < 10 ? 0.1 : 3.0; // Low weight for grays
  const satWeight = 1.5;
  const lightWeight = 1.0;

  const distance = Math.sqrt(
    Math.pow(hueDiff * hueWeight, 2) +
    Math.pow((hsl1.s - hsl2.s) * satWeight, 2) +
    Math.pow((hsl1.l - hsl2.l) * lightWeight, 2)
  );

  return distance;
}

// Check if a color is a gray (low saturation)
function isGray(hsl) {
  return hsl.s < 10;
}

// Normalize hex color
function normalizeHex(hex) {
  hex = hex.toLowerCase().replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return '#' + hex;
}

// Parse rgb/rgba to RGB object
function parseRgb(str) {
  const match = str.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  return null;
}

// Find the best matching token for a color
function findBestToken(colorValue) {
  let rgb;
  let originalHex;

  // Parse the color
  if (colorValue.startsWith('#')) {
    originalHex = normalizeHex(colorValue);
    rgb = hexToRgb(colorValue);
  } else if (colorValue.toLowerCase().startsWith('rgb(')) {
    rgb = parseRgb(colorValue);
    if (rgb) {
      originalHex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
    }
  }

  if (!rgb) return null;

  const inputHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const inputIsGray = isGray(inputHsl);

  // Check for exact match first
  for (const [tokenName, tokenHex] of Object.entries(DESIGN_TOKENS)) {
    if (normalizeHex(tokenHex) === originalHex) {
      return { token: tokenName, exact: true, distance: 0 };
    }
  }

  // Find closest match, preferring same color family
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const [tokenName, tokenHex] of Object.entries(DESIGN_TOKENS)) {
    const tokenRgb = hexToRgb(tokenHex);
    if (!tokenRgb) continue;

    const tokenHsl = rgbToHsl(tokenRgb.r, tokenRgb.g, tokenRgb.b);
    const tokenIsGray = isGray(tokenHsl);

    // Prefer matching gray to gray, color to color
    if (inputIsGray !== tokenIsGray) {
      continue; // Skip: don't match grays to colors
    }

    const distance = colorDistance(inputHsl, tokenHsl);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = tokenName;
    }
  }

  // Only return if within acceptable distance
  if (bestMatch && bestDistance <= MAX_DISTANCE) {
    return { token: bestMatch, exact: false, distance: bestDistance };
  }

  // Return null with distance info for logging
  return { token: null, exact: false, distance: bestDistance, original: colorValue };
}

// Process a CSS file
function processCssFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const changes = [];
  const skipped = [];

  // Skip tokens.css itself
  if (filePath.includes('tokens.css')) {
    return { modified: false, changes: [], skipped: [] };
  }

  // Regex patterns for colors
  const hexPattern = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b/g;
  const rgbPattern = /rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi;

  // Track replacements to avoid duplicates
  const replacements = new Map();
  const skippedColors = new Map();

  // Find all hex colors
  let match;
  while ((match = hexPattern.exec(content)) !== null) {
    const color = match[0];
    if (replacements.has(color) || skippedColors.has(color)) continue;

    const result = findBestToken(color);

    if (result && result.token) {
      replacements.set(color, result);
    } else if (result) {
      skippedColors.set(color, result);
    }
  }

  // Find all rgb colors (but not rgba with transparency)
  while ((match = rgbPattern.exec(content)) !== null) {
    const color = match[0];
    if (replacements.has(color) || skippedColors.has(color)) continue;

    const result = findBestToken(color);

    if (result && result.token) {
      replacements.set(color, result);
    } else if (result) {
      skippedColors.set(color, result);
    }
  }

  // Apply replacements
  for (const [originalColor, result] of replacements) {
    const replacement = `var(${result.token})`;
    const escapedColor = originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create regex that doesn't match inside var() or as part of another color
    const regex = new RegExp(escapedColor, 'gi');

    const newContent = content.replace(regex, (match, offset) => {
      // Check if this is already inside a var()
      const before = content.substring(Math.max(0, offset - 20), offset);
      if (before.includes('var(') && !before.includes(')')) {
        return match; // Don't replace inside var()
      }
      return replacement;
    });

    if (newContent !== content) {
      content = newContent;
      modified = true;
      changes.push({
        original: originalColor,
        replacement: replacement,
        exact: result.exact,
        distance: result.distance
      });
    }
  }

  // Collect skipped colors
  for (const [color, result] of skippedColors) {
    skipped.push({
      color,
      distance: result.distance
    });
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return { modified, changes, skipped };
}

// Find all CSS files
function findCssFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item === 'node_modules' || item === '.git' || item === 'dist') {
        continue;
      }
      findCssFiles(fullPath, files);
    } else if (item.endsWith('.css')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Main
function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(projectRoot, 'src');

  console.log('🎨 Color Migration Script v2');
  console.log('='.repeat(50));
  console.log(`Scanning: ${srcDir}`);
  console.log(`Max distance threshold: ${MAX_DISTANCE}\n`);

  const cssFiles = findCssFiles(srcDir);
  console.log(`Found ${cssFiles.length} CSS files\n`);

  let totalChanges = 0;
  let filesModified = 0;
  const allSkipped = [];

  for (const file of cssFiles) {
    const relativePath = path.relative(projectRoot, file);
    const { modified, changes, skipped } = processCssFile(file);

    if (modified) {
      filesModified++;
      totalChanges += changes.length;

      console.log(`✅ ${relativePath}`);
      for (const change of changes) {
        const status = change.exact ? '(exact)' : `(distance: ${change.distance.toFixed(1)})`;
        console.log(`   ${change.original} → ${change.replacement} ${status}`);
      }
      console.log('');
    }

    if (skipped.length > 0) {
      for (const s of skipped) {
        allSkipped.push({ file: relativePath, ...s });
      }
    }
  }

  console.log('='.repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`   Files modified: ${filesModified}`);
  console.log(`   Total replacements: ${totalChanges}`);

  if (allSkipped.length > 0) {
    console.log(`\n⚠️  Skipped colors (too different from design tokens):`);
    const uniqueSkipped = new Map();
    for (const s of allSkipped) {
      if (!uniqueSkipped.has(s.color)) {
        uniqueSkipped.set(s.color, { files: [s.file], distance: s.distance });
      } else {
        uniqueSkipped.get(s.color).files.push(s.file);
      }
    }
    for (const [color, data] of uniqueSkipped) {
      console.log(`   ${color} (distance: ${data.distance.toFixed(1)}) in ${data.files.length} file(s)`);
    }
  }

  console.log('\n✨ Done!');
}

main();
