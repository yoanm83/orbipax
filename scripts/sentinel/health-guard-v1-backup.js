#!/usr/bin/env node

/**
 * SENTINEL v1: Health Philosophy Guard
 * Enforces OrbiPax CMH development philosophy and blocks violations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Reason Codes for violations
const REASON_CODES = {
  NO_AUDIT: 'AUDIT SUMMARY missing or incomplete',
  PATH_GUESS: 'Invented paths not confirmed in repository',
  DUPLICATE_FOUND: 'Duplicate functionality without consolidation plan',
  SOC_VIOLATION: 'Layer boundary violation (UI→App→Domain→Infra)',
  RLS_RISK: 'Missing organization_id filtering or RLS violation',
  UI_HARDCODE: 'Hardcoded colors/tokens instead of semantic Tailwind v4',
  A11Y_FAIL: 'Missing accessibility requirements (WCAG 2.1 AA)',
  NO_ZOD_SCHEMA: 'Validation without Zod schema',
  WRAPPERS_MISSING: 'Missing or incorrect BFF wrapper order',
  PROMPT_FORMAT_ERROR: 'Prompt format not following Health guidelines'
};

class HealthGuard {
  constructor() {
    this.violations = [];
    this.checkedFiles = [];
    this.projectRoot = process.cwd();
  }

  // Main validation entry point
  async validate() {
    console.log('🏥 SENTINEL v1: Health Philosophy Guard');
    console.log('Validating OrbiPax CMH development compliance...\n');

    try {
      // Get staged files for commit validation
      const stagedFiles = this.getStagedFiles();

      if (stagedFiles.length === 0) {
        console.log('✅ No staged files to validate');
        return true;
      }

      console.log(`📋 Validating ${stagedFiles.length} staged files...`);

      // Run all validation gates
      await this.validateAuditSummary();
      await this.validatePathsAndAliases(stagedFiles);
      await this.validateDuplicates(stagedFiles);
      await this.validateSoCBoundaries(stagedFiles);
      await this.validateRLSCompliance(stagedFiles);
      await this.validateUITokens(stagedFiles);
      await this.validateAccessibility(stagedFiles);
      await this.validateZodSchemas(stagedFiles);
      await this.validateBFFWrappers(stagedFiles);

      // Generate report
      await this.generateReport();

      // Return validation result
      if (this.violations.length > 0) {
        console.log(`\n❌ HEALTH GUARD FAILED: ${this.violations.length} violations found`);
        console.log('📄 See detailed report at: tmp/health_guard_violations.md\n');

        this.violations.forEach(violation => {
          console.log(`🚫 ${violation.code}: ${violation.message}`);
        });

        return false;
      }

      console.log('\n✅ HEALTH GUARD PASSED: All validations successful');
      return true;

    } catch (error) {
      console.error('💥 Health Guard Error:', error.message);
      return false;
    }
  }

  // Get staged files from git
  getStagedFiles() {
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return output.trim().split('\n').filter(file =>
        file && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
      );
    } catch (error) {
      // If not in git repo or no staged files
      return [];
    }
  }

  // GATE 1: Validate AUDIT SUMMARY presence and completeness
  async validateAuditSummary() {
    console.log('🔍 [GATE 1] Validating AUDIT SUMMARY...');

    const tmpDir = path.join(this.projectRoot, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      this.addViolation('NO_AUDIT', 'No /tmp directory found for AUDIT SUMMARY reports');
      return;
    }

    // Look for recent AUDIT SUMMARY in tmp directory
    const tmpFiles = fs.readdirSync(tmpDir).filter(file =>
      file.endsWith('.md') && file.includes('audit')
    );

    if (tmpFiles.length === 0) {
      this.addViolation('NO_AUDIT', 'No AUDIT SUMMARY found in /tmp directory');
      return;
    }

    // Check latest audit summary for required sections
    const latestAudit = tmpFiles[tmpFiles.length - 1];
    const auditPath = path.join(tmpDir, latestAudit);
    const auditContent = fs.readFileSync(auditPath, 'utf8');

    const requiredSections = [
      '### 📋 Contexto de la Tarea',
      '### 🔍 Búsqueda por Directorios',
      '### 🏗️ Arquitectura & Capas',
      '### 🔒 RLS/Multi-tenant',
      '### ✅ Validación Zod',
      '### 🎨 UI & Accesibilidad',
      '### 🛡️ Wrappers BFF',
      '### 🚦 Go/No-Go Decision'
    ];

    const missingSections = requiredSections.filter(section =>
      !auditContent.includes(section)
    );

    if (missingSections.length > 0) {
      this.addViolation('NO_AUDIT', `AUDIT SUMMARY missing required sections: ${missingSections.join(', ')}`);
    }

    console.log('✅ AUDIT SUMMARY validation completed');
  }

  // GATE 2: Validate paths and TypeScript aliases
  async validatePathsAndAliases(stagedFiles) {
    console.log('🔍 [GATE 2] Validating paths and aliases...');

    for (const file of stagedFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for import paths
      const importMatches = content.match(/from\s+['"`]([^'"`]+)['"`]/g);
      if (importMatches) {
        for (const importMatch of importMatches) {
          const importPath = importMatch.match(/['"`]([^'"`]+)['"`]/)[1];

          // Skip node_modules and relative paths
          if (importPath.startsWith('.') || !importPath.startsWith('@/')) continue;

          // Validate @/ alias paths exist
          const resolvedPath = importPath.replace('@/', 'src/');
          const fullPath = path.join(this.projectRoot, resolvedPath);

          if (!fs.existsSync(fullPath) && !fs.existsSync(fullPath + '.ts') && !fs.existsSync(fullPath + '.tsx')) {
            this.addViolation('PATH_GUESS', `Invalid import path in ${file}: ${importPath}`);
          }
        }
      }
    }

    console.log('✅ Paths and aliases validation completed');
  }

  // GATE 3: Validate for duplicates
  async validateDuplicates(stagedFiles) {
    console.log('🔍 [GATE 3] Validating duplicates...');

    // Check for duplicate component names
    const componentNames = new Map();

    for (const file of stagedFiles) {
      if (!file.endsWith('.tsx')) continue;

      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Extract component names
      const componentMatches = content.match(/export\s+(function|const)\s+(\w+)/g);
      if (componentMatches) {
        for (const match of componentMatches) {
          const componentName = match.match(/(\w+)$/)[1];

          if (componentNames.has(componentName)) {
            this.addViolation('DUPLICATE_FOUND', `Duplicate component '${componentName}' in ${file} and ${componentNames.get(componentName)}`);
          } else {
            componentNames.set(componentName, file);
          }
        }
      }
    }

    console.log('✅ Duplicates validation completed');
  }

  // GATE 4: Validate Separation of Concerns (SoC)
  async validateSoCBoundaries(stagedFiles) {
    console.log('🔍 [GATE 4] Validating SoC boundaries...');

    for (const file of stagedFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Check UI components don't import from domain or infrastructure
      if (file.includes('/ui/') || file.includes('/components/')) {
        if (content.includes('from \'@/') || content.includes('from "@/')) {
          const domainImports = content.match(/from\s+['"`]@\/[^'"`]*\/domain\/[^'"`]*['"`]/g);
          const infraImports = content.match(/from\s+['"`]@\/[^'"`]*\/infrastructure\/[^'"`]*['"`]/g);

          if (domainImports) {
            this.addViolation('SOC_VIOLATION', `UI component ${file} imports from domain layer: ${domainImports.join(', ')}`);
          }

          if (infraImports) {
            this.addViolation('SOC_VIOLATION', `UI component ${file} imports from infrastructure layer: ${infraImports.join(', ')}`);
          }
        }
      }

      // Check domain doesn't import from infrastructure
      if (file.includes('/domain/')) {
        const infraImports = content.match(/from\s+['"`]@\/[^'"`]*\/infrastructure\/[^'"`]*['"`]/g);
        if (infraImports) {
          this.addViolation('SOC_VIOLATION', `Domain layer ${file} imports from infrastructure: ${infraImports.join(', ')}`);
        }
      }
    }

    console.log('✅ SoC boundaries validation completed');
  }

  // GATE 5: Validate RLS and multi-tenant compliance
  async validateRLSCompliance(stagedFiles) {
    console.log('🔍 [GATE 5] Validating RLS compliance...');

    for (const file of stagedFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for database queries without organization_id
      if (content.includes('.from(') || content.includes('.select(')) {
        if (!content.includes('organization_id') && !content.includes('organizationId')) {
          this.addViolation('RLS_RISK', `Database query in ${file} missing organization_id filtering`);
        }
      }

      // Check for user data access without proper filtering
      if (content.includes('patients') || content.includes('appointments') || content.includes('notes')) {
        if (file.includes('/infrastructure/') || file.includes('/application/')) {
          if (!content.includes('organization') && !content.includes('tenant')) {
            this.addViolation('RLS_RISK', `Clinical data access in ${file} missing organization boundaries`);
          }
        }
      }
    }

    console.log('✅ RLS compliance validation completed');
  }

  // GATE 6: Validate UI tokens and hardcoding
  async validateUITokens(stagedFiles) {
    console.log('🔍 [GATE 6] Validating UI tokens...');

    for (const file of stagedFiles) {
      if (!file.endsWith('.tsx') && !file.endsWith('.jsx')) continue;

      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for hardcoded colors
      const hardcodedColors = content.match(/(?:bg-|text-|border-|ring-|from-|to-|via-)(?:red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/g);

      if (hardcodedColors) {
        this.addViolation('UI_HARDCODE', `Hardcoded colors in ${file}: ${hardcodedColors.join(', ')} - use semantic tokens instead`);
      }

      // Check for hex colors
      const hexColors = content.match(/#[0-9A-Fa-f]{3,6}/g);
      if (hexColors) {
        this.addViolation('UI_HARDCODE', `Hex colors in ${file}: ${hexColors.join(', ')} - use semantic tokens instead`);
      }

      // Check for hardcoded spacing
      const hardcodedSpacing = content.match(/(?:p|m|w|h|top|right|bottom|left|gap|space)-\d+/g);
      if (hardcodedSpacing && hardcodedSpacing.length > 5) {
        this.addViolation('UI_HARDCODE', `Excessive hardcoded spacing in ${file} - consider using design tokens`);
      }
    }

    console.log('✅ UI tokens validation completed');
  }

  // GATE 7: Validate accessibility requirements
  async validateAccessibility(stagedFiles) {
    console.log('🔍 [GATE 7] Validating accessibility...');

    for (const file of stagedFiles) {
      if (!file.endsWith('.tsx') && !file.endsWith('.jsx')) continue;

      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for interactive elements without proper accessibility
      if (content.includes('<button') || content.includes('<input') || content.includes('<select')) {
        // Check for ARIA labels
        if (!content.includes('aria-label') && !content.includes('aria-labelledby')) {
          this.addViolation('A11Y_FAIL', `Interactive elements in ${file} missing ARIA labels`);
        }

        // Check for focus management
        if (!content.includes('focus:') && !content.includes('focus-visible:')) {
          this.addViolation('A11Y_FAIL', `Interactive elements in ${file} missing focus styles`);
        }
      }

      // Check for minimum touch targets
      if (content.includes('min-h-[') && !content.includes('min-h-[44px]')) {
        const smallTargets = content.match(/min-h-\[(\d+)px\]/g);
        if (smallTargets) {
          const violations = smallTargets.filter(target => {
            const size = parseInt(target.match(/\d+/)[0]);
            return size < 44;
          });

          if (violations.length > 0) {
            this.addViolation('A11Y_FAIL', `Touch targets in ${file} smaller than 44px: ${violations.join(', ')}`);
          }
        }
      }
    }

    console.log('✅ Accessibility validation completed');
  }

  // GATE 8: Validate Zod schemas
  async validateZodSchemas(stagedFiles) {
    console.log('🔍 [GATE 8] Validating Zod schemas...');

    for (const file of stagedFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for form validation without Zod
      if (content.includes('useForm') || content.includes('validation')) {
        if (!content.includes('zodResolver') && !content.includes('z.')) {
          this.addViolation('NO_ZOD_SCHEMA', `Form validation in ${file} not using Zod schema`);
        }
      }

      // Check for API endpoints without validation
      if (content.includes('export async function') && (content.includes('POST') || content.includes('PUT') || content.includes('PATCH'))) {
        if (!content.includes('z.') && !content.includes('.parse(')) {
          this.addViolation('NO_ZOD_SCHEMA', `API endpoint in ${file} missing Zod validation`);
        }
      }
    }

    console.log('✅ Zod schemas validation completed');
  }

  // GATE 9: Validate BFF wrappers
  async validateBFFWrappers(stagedFiles) {
    console.log('🔍 [GATE 9] Validating BFF wrappers...');

    for (const file of stagedFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for API routes with proper wrappers
      if (content.includes('export async function') && (file.includes('/api/') || file.includes('/actions/'))) {
        const wrappers = ['withAuth', 'withSecurity', 'withRateLimit', 'withAudit'];
        const missingWrappers = wrappers.filter(wrapper => !content.includes(wrapper));

        if (missingWrappers.length > 0) {
          this.addViolation('WRAPPERS_MISSING', `API endpoint in ${file} missing wrappers: ${missingWrappers.join(', ')}`);
        }

        // Check wrapper order
        if (content.includes('withAuth') && content.includes('withSecurity')) {
          const authIndex = content.indexOf('withAuth');
          const securityIndex = content.indexOf('withSecurity');

          if (authIndex > securityIndex) {
            this.addViolation('WRAPPERS_MISSING', `Incorrect wrapper order in ${file} - should be withAuth → withSecurity → withRateLimit → withAudit`);
          }
        }
      }
    }

    console.log('✅ BFF wrappers validation completed');
  }

  // Add violation to the list
  addViolation(code, message) {
    this.violations.push({
      code,
      message,
      description: REASON_CODES[code]
    });
  }

  // Generate detailed report
  async generateReport() {
    const reportPath = path.join(this.projectRoot, 'tmp', 'health_guard_violations.md');

    const report = `# Health Guard Violations Report

Generated: ${new Date().toISOString()}

## Summary
- **Total Violations**: ${this.violations.length}
- **Files Checked**: ${this.checkedFiles.length}

## GATES Status
${this.violations.length === 0 ? '✅ All GATES passed' : '❌ Some GATES failed'}

## Violations Found

${this.violations.length === 0 ? 'No violations found! 🎉' : this.violations.map(violation => `
### ${violation.code}
**Description**: ${violation.description}
**Details**: ${violation.message}
`).join('\n')}

## Reason Codes Reference

${Object.entries(REASON_CODES).map(([code, description]) => `
- **${code}**: ${description}`).join('\n')}

## Next Steps

${this.violations.length > 0 ? `
1. Fix the violations listed above
2. Run the health guard again: \`npm run health:guard\`
3. Ensure AUDIT SUMMARY is complete and follows the template
4. Follow the Health philosophy guidelines in IMPLEMENTATION_GUIDE.md
` : `
All validations passed! Your changes follow OrbiPax Health philosophy.
You can proceed with the commit/PR.
`}
`;

    // Ensure tmp directory exists
    const tmpDir = path.dirname(reportPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, report);
  }
}

// Main execution
async function main() {
  const guard = new HealthGuard();
  const success = await guard.validate();
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { HealthGuard, REASON_CODES };