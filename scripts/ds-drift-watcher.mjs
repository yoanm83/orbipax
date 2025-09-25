#!/usr/bin/env node

/**
 * DS Drift Watcher - Design System Drift Detection Scanner
 *
 * Complementary static analysis tool that detects style drift patterns
 * not always caught by ESLint/Stylelint. Read-only audit, no modifications.
 *
 * Categories detected:
 * - TW-ArbitraryColor: Hardcoded colors in Tailwind arbitrary values
 * - Inline-Color: Inline styles with non-tokenized colors
 * - Dangerous-Reset: outline:none, box-shadow:none patterns
 * - Native-In-ModulesUI: Native HTML elements in modules/ui layers
 * - Missing-FocusHint: Triggers/buttons without focus management
 */

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Categories and their detection patterns
const CATEGORIES = {
  'TW-ArbitraryColor': {
    pattern: /(?:bg|text|border|ring|shadow|outline|fill|stroke)-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|oklch\([^v][^)]*\))[^\]]*\]/gi,
    description: 'Tailwind arbitrary value with hardcoded color',
    suggestion: 'Use design tokens: bg-[var(--token)] or semantic classes'
  },
  'Inline-Color': {
    pattern: /style\s*=\s*\{[^}]*(?:color|background|backgroundColor|borderColor|outlineColor|boxShadow)\s*:\s*['"`](?!var\(--)[^'"`]*['"`]/gi,
    description: 'Inline style with non-tokenized color',
    suggestion: 'Use CSS variables: color: "var(--token)" or Tailwind classes'
  },
  'Dangerous-Reset': {
    pattern: /(?:outline|box-shadow)\s*:\s*['"`]?\s*none\s*['"`]?/gi,
    description: 'Dangerous focus reset that harms accessibility',
    suggestion: 'Use focus-visible:ring-0 or proper focus management utilities'
  },
  'Native-In-ModulesUI': {
    pattern: /<(?:select|textarea|button)\b|<input\b[^>]*type\s*=\s*["'](?:checkbox|radio)["']/gi,
    description: 'Native HTML element in modules UI layer',
    suggestion: 'Use primitives: Select, Textarea, Button, Checkbox, RadioGroup',
    pathFilter: /src[/\\]modules[/\\].*[/\\]ui[/\\]/
  },
  'Missing-FocusHint': {
    pattern: /(?:Trigger|Button)[^{]*\{[^}]*className[^}]*\}/gs,
    description: 'Trigger/Button component potentially missing focus styles',
    suggestion: 'Add focus-visible:ring-2 focus-visible:ring-offset-2',
    pathFilter: /src[/\\]shared[/\\]ui[/\\]primitives[/\\]/,
    validateMatch: (match) => {
      // Check if focus-visible or ring classes are present
      return !match.includes('focus-visible') && !match.includes('ring-');
    }
  }
};

// File extensions to scan
const SCAN_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', '.next', 'dist', 'coverage', 'build', '.git', 'tmp'];

class DriftScanner {
  constructor() {
    this.violations = [];
    this.fileCount = 0;
    this.startTime = Date.now();
  }

  /**
   * Walk directory tree and collect files to scan
   */
  walkDir(dir, files = []) {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      const relativePath = relative(PROJECT_ROOT, fullPath);

      if (stats.isDirectory()) {
        // Skip excluded directories
        if (!EXCLUDE_DIRS.includes(entry)) {
          this.walkDir(fullPath, files);
        }
      } else if (stats.isFile()) {
        // Check if file should be scanned
        const ext = entry.substring(entry.lastIndexOf('.'));
        if (SCAN_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  /**
   * Scan a single file for violations
   */
  scanFile(filePath) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const relativePath = relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');

      this.fileCount++;

      // Check each category
      for (const [category, config] of Object.entries(CATEGORIES)) {
        // Apply path filter if specified
        if (config.pathFilter && !config.pathFilter.test(relativePath)) {
          continue;
        }

        // Reset regex lastIndex
        config.pattern.lastIndex = 0;

        let match;
        while ((match = config.pattern.exec(content)) !== null) {
          // Additional validation if needed
          if (config.validateMatch && !config.validateMatch(match[0])) {
            continue;
          }

          // Find line number
          const beforeMatch = content.substring(0, match.index);
          const lineNumber = beforeMatch.split('\n').length;

          // Extract snippet (max 100 chars)
          const lineContent = lines[lineNumber - 1] || '';
          const snippet = lineContent.trim().substring(0, 100);

          this.violations.push({
            category,
            file: relativePath,
            line: lineNumber,
            snippet: snippet + (lineContent.trim().length > 100 ? '...' : ''),
            suggestion: config.suggestion
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning ${filePath}: ${error.message}`);
    }
  }

  /**
   * Generate markdown report
   */
  generateReport() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const timestamp = new Date().toISOString().split('T')[0];

    // Count violations by category
    const categoryCounts = {};
    for (const category of Object.keys(CATEGORIES)) {
      categoryCounts[category] = this.violations.filter(v => v.category === category).length;
    }

    let report = `# DS Drift Watcher Report

**Date:** ${timestamp}
**Duration:** ${duration}s
**Files Scanned:** ${this.fileCount}
**Total Violations:** ${this.violations.length}

---

## Summary by Category

| Category | Count | Description |
|----------|-------|-------------|
`;

    for (const [category, config] of Object.entries(CATEGORIES)) {
      const count = categoryCounts[category];
      const emoji = count === 0 ? '✅' : count < 5 ? '⚠️' : '❌';
      report += `| ${emoji} ${category} | ${count} | ${config.description} |\n`;
    }

    report += `
---

## Detailed Violations

`;

    if (this.violations.length === 0) {
      report += '🎉 **No design system drift detected!** All code follows token conventions.\n';
    } else {
      report += `| Category | File | Line | Snippet | Suggestion |
|----------|------|------|---------|------------|
`;

      // Sort violations by category, then file, then line
      const sortedViolations = this.violations.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        if (a.file !== b.file) return a.file.localeCompare(b.file);
        return a.line - b.line;
      });

      for (const violation of sortedViolations) {
        const fileLink = `${violation.file}:${violation.line}`;
        const snippet = violation.snippet.replace(/\|/g, '\\|');
        report += `| ${violation.category} | \`${fileLink}\` | ${violation.line} | \`${snippet}\` | ${violation.suggestion} |\n`;
      }
    }

    report += `
---

## How to Fix

### TW-ArbitraryColor
Replace hardcoded colors with design tokens:
- ❌ \`bg-[#ff0000]\` → ✅ \`bg-destructive\`
- ❌ \`text-[rgb(255,255,255)]\` → ✅ \`text-white\` or \`text-background\`

### Inline-Color
Use CSS variables or Tailwind classes:
- ❌ \`style={{ color: '#ff0000' }}\` → ✅ \`className="text-destructive"\`
- ❌ \`style={{ backgroundColor: 'rgb(0,0,0)' }}\` → ✅ \`className="bg-black"\`

### Dangerous-Reset
Use proper focus management:
- ❌ \`outline: none\` → ✅ \`focus-visible:outline-none focus-visible:ring-2\`
- ❌ \`box-shadow: none\` → ✅ \`shadow-none\` (if not for focus)

### Native-In-ModulesUI
Import and use primitives:
\`\`\`tsx
import { Select } from '@/shared/ui/primitives/Select'
import { Button } from '@/shared/ui/primitives/Button'
import { Checkbox } from '@/shared/ui/primitives/Checkbox'
\`\`\`

### Missing-FocusHint
Add focus-visible utilities to interactive components:
\`\`\`tsx
className={cn(
  "...",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
)}
\`\`\`

---

## Integration

### Run Locally
\`\`\`bash
npm run ds:drift
\`\`\`

### CI Integration (Non-blocking)
\`\`\`yaml
- name: DS Drift Check
  run: npm run ds:drift
  continue-on-error: true

- name: Upload Drift Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: ds-drift-report
    path: tmp/ds_drift_watcher_report.md
\`\`\`

---

*This report complements ESLint/Stylelint rules. It's a read-only audit for awareness, not enforcement.*
`;

    return report;
  }

  /**
   * Main execution
   */
  run() {
    console.log('🔍 DS Drift Watcher - Scanning for design system drift...\n');

    const srcPath = join(PROJECT_ROOT, 'src');
    if (!existsSync(srcPath)) {
      console.error('❌ src/ directory not found');
      process.exit(1);
    }

    // Collect files
    console.log('📂 Collecting files...');
    const files = this.walkDir(srcPath);
    console.log(`   Found ${files.length} files to scan\n`);

    // Scan files
    console.log('🔎 Scanning for violations...');
    for (const file of files) {
      this.scanFile(file);
    }

    // Generate report
    console.log('\n📝 Generating report...');
    const report = this.generateReport();

    // Write report
    const reportPath = join(PROJECT_ROOT, 'tmp', 'ds_drift_watcher_report.md');

    // Ensure tmp directory exists
    const tmpDir = join(PROJECT_ROOT, 'tmp');
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir, { recursive: true });
    }

    writeFileSync(reportPath, report, 'utf-8');

    // Summary output
    console.log('\n✅ Scan complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   • Files scanned: ${this.fileCount}`);
    console.log(`   • Total violations: ${this.violations.length}`);

    if (this.violations.length > 0) {
      const categories = [...new Set(this.violations.map(v => v.category))];
      console.log(`   • Categories affected: ${categories.join(', ')}`);
    }

    console.log(`\n📄 Report saved to: ${reportPath}`);
    console.log('\n💡 Run "npm run lint:fix" to auto-fix some issues with ESLint/Stylelint');

    // Always exit 0 (non-blocking audit)
    process.exit(0);
  }
}

// Execute scanner
const scanner = new DriftScanner();
scanner.run();