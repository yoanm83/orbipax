#!/usr/bin/env node

/**
 * SENTINEL v1.1: Health Philosophy Guard
 * Enforces OrbiPax CMH development philosophy and blocks violations
 * Enhanced with fast/full modes, allowlist, and SoC/RLS manifest
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
  constructor(options = {}) {
    this.violations = [];
    this.checkedFiles = [];
    this.projectRoot = process.cwd();
    this.mode = options.mode || 'full'; // 'fast' or 'full'
    this.debug = process.env.DEBUG === 'true';

    // Load configurations
    this.allowlist = this.loadAllowlist();
    this.socManifest = this.loadSoCManifest();
    this.rlsManifest = this.loadRLSManifest();
  }

  // Load Tailwind v4 semantic token allowlist
  loadAllowlist() {
    const allowlistPath = path.join(this.projectRoot, 'scripts', 'sentinel', 'tailwind-allowlist.json');
    if (fs.existsSync(allowlistPath)) {
      return JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
    }

    // Default semantic tokens for OrbiPax Health
    return {
      colors: [
        'primary', 'secondary', 'tertiary',
        'success', 'warning', 'critical', 'info',
        'surface', 'background', 'foreground',
        'muted', 'accent', 'destructive',
        'clinical-primary', 'clinical-secondary',
        'patient-data', 'provider-action',
        'emergency', 'routine', 'urgent'
      ],
      spacing: [
        'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl',
        'clinical-touch', 'form-spacing', 'card-padding'
      ],
      allowed_numeric: [1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 44, 48, 64]
    };
  }

  // Load SoC (Separation of Concerns) manifest
  loadSoCManifest() {
    const manifestPath = path.join(this.projectRoot, 'scripts', 'sentinel', 'soc-manifest.json');
    if (fs.existsSync(manifestPath)) {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }

    // Default SoC rules for OrbiPax architecture
    return {
      layers: {
        ui: {
          allowed_imports: ['@/modules/*/application', '@/shared/ui', '@/lib/ui'],
          forbidden_imports: ['@/modules/*/domain', '@/modules/*/infrastructure'],
          description: 'UI components can only import from Application layer and shared UI'
        },
        application: {
          allowed_imports: ['@/modules/*/domain', '@/shared/application', '@/lib/validation'],
          forbidden_imports: ['@/modules/*/infrastructure', '@/modules/*/ui'],
          description: 'Application layer coordinates between UI and Domain'
        },
        domain: {
          allowed_imports: ['@/shared/domain', '@/lib/types'],
          forbidden_imports: ['@/modules/*/infrastructure', '@/modules/*/application', '@/modules/*/ui'],
          description: 'Domain layer contains pure business logic'
        },
        infrastructure: {
          allowed_imports: ['@/modules/*/domain', '@/shared/infrastructure', '@/lib/database'],
          forbidden_imports: ['@/modules/*/ui', '@/modules/*/application'],
          description: 'Infrastructure implements domain contracts'
        }
      }
    };
  }

  // Load RLS (Row Level Security) manifest
  loadRLSManifest() {
    const manifestPath = path.join(this.projectRoot, 'scripts', 'sentinel', 'rls-manifest.json');
    if (fs.existsSync(manifestPath)) {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }

    // Default RLS rules for OrbiPax healthcare data
    return {
      required_filters: {
        'organization_id': {
          tables: ['patients', 'appointments', 'notes', 'assessments', 'treatments'],
          description: 'All clinical data must be filtered by organization'
        },
        'provider_id': {
          tables: ['notes', 'assessments', 'treatments'],
          description: 'Provider-specific data requires provider filtering'
        }
      },
      clinical_entities: [
        'patients', 'appointments', 'notes', 'assessments', 'treatments',
        'medications', 'allergies', 'diagnoses', 'vitals', 'documents'
      ],
      exempt_operations: [
        'system_audit', 'migration', 'backup', 'analytics_aggregation'
      ]
    };
  }

  // Main validation entry point
  async validate() {
    console.log(`🏥 SENTINEL v1.1: Health Philosophy Guard (${this.mode.toUpperCase()} mode)`);
    console.log('Validating OrbiPax CMH development compliance...\n');

    try {
      // Get staged files for commit validation
      const stagedFiles = this.getStagedFiles();

      if (stagedFiles.length === 0) {
        console.log('✅ No staged files to validate');
        return true;
      }

      console.log(`📋 Validating ${stagedFiles.length} staged files...`);
      this.checkedFiles = stagedFiles;

      // Run validation gates based on mode
      if (this.mode === 'fast') {
        // Fast mode: Critical gates only (pre-commit)
        await this.validateAuditSummary();
        await this.validatePathsAndAliases(stagedFiles);
        await this.validateSoCBoundaries(stagedFiles);
        await this.validateUITokens(stagedFiles);
      } else {
        // Full mode: All gates (pre-push, CI)
        await this.validateAuditSummary();
        await this.validatePathsAndAliases(stagedFiles);
        await this.validateDuplicates(stagedFiles);
        await this.validateSoCBoundaries(stagedFiles);
        await this.validateRLSCompliance(stagedFiles);
        await this.validateUITokens(stagedFiles);
        await this.validateAccessibility(stagedFiles);
        await this.validateZodSchemas(stagedFiles);
        await this.validateBFFWrappers(stagedFiles);
      }

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

  // GATE 1: Enhanced AUDIT SUMMARY validation with stricter requirements
  async validateAuditSummary() {
    console.log('🔍 [GATE 1] Validating AUDIT SUMMARY (Enhanced v1.1)...');

    const tmpDir = path.join(this.projectRoot, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      this.addViolation('NO_AUDIT', 'No /tmp directory found for AUDIT SUMMARY reports');
      return;
    }

    // Look for recent AUDIT SUMMARY in tmp directory
    const tmpFiles = fs.readdirSync(tmpDir)
      .filter(file => file.endsWith('.md') && (file.includes('audit') || file.includes('AUDIT')))
      .sort((a, b) => {
        const aTime = fs.statSync(path.join(tmpDir, a)).mtime;
        const bTime = fs.statSync(path.join(tmpDir, b)).mtime;
        return bTime - aTime; // Most recent first
      });

    if (tmpFiles.length === 0) {
      this.addViolation('NO_AUDIT', 'No AUDIT SUMMARY found in /tmp directory. Create using template from CLAUDE.md');
      return;
    }

    // Check latest audit summary for required sections and content quality
    const latestAudit = tmpFiles[0];
    const auditPath = path.join(tmpDir, latestAudit);
    const auditContent = fs.readFileSync(auditPath, 'utf8');

    // Check file age (should be recent)
    const auditAge = Date.now() - fs.statSync(auditPath).mtime.getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (auditAge > maxAge) {
      this.addViolation('NO_AUDIT', `AUDIT SUMMARY is stale (${Math.round(auditAge / (60 * 60 * 1000))} hours old). Create fresh audit for current changes`);
    }

    // Enhanced required sections with content validation
    const requiredSections = [
      {
        header: '### 📋 Contexto de la Tarea',
        minLength: 100,
        required: ['objetivo', 'alcance']
      },
      {
        header: '### 🔍 Búsqueda por Directorios',
        minLength: 50,
        required: ['src/', 'modules/']
      },
      {
        header: '### 🏗️ Arquitectura & Capas',
        minLength: 80,
        required: ['UI→Application→Domain→Infrastructure']
      },
      {
        header: '### 🔒 RLS/Multi-tenant',
        minLength: 60,
        required: ['organization_id', 'tenant']
      },
      {
        header: '### ✅ Validación Zod',
        minLength: 40,
        required: ['schema', 'validation']
      },
      {
        header: '### 🎨 UI & Accesibilidad',
        minLength: 60,
        required: ['semantic', 'tokens', 'WCAG']
      },
      {
        header: '### 🛡️ Wrappers BFF',
        minLength: 40,
        required: ['withAuth', 'withSecurity']
      },
      {
        header: '### 🚦 Go/No-Go Decision',
        minLength: 30,
        required: ['GO', 'NO-GO']
      }
    ];

    for (const section of requiredSections) {
      const sectionIndex = auditContent.indexOf(section.header);
      if (sectionIndex === -1) {
        this.addViolation('NO_AUDIT', `AUDIT SUMMARY missing required section: ${section.header}`);
        continue;
      }

      // Extract section content
      const nextSectionIndex = auditContent.indexOf('###', sectionIndex + 1);
      const sectionContent = nextSectionIndex === -1
        ? auditContent.substring(sectionIndex)
        : auditContent.substring(sectionIndex, nextSectionIndex);

      // Validate section content length
      if (sectionContent.length < section.minLength) {
        this.addViolation('NO_AUDIT', `AUDIT SUMMARY section '${section.header}' too brief (${sectionContent.length} chars, min ${section.minLength})`);
      }

      // Validate required keywords
      const missingKeywords = section.required.filter(keyword =>
        !sectionContent.toLowerCase().includes(keyword.toLowerCase())
      );

      if (missingKeywords.length > 0) {
        this.addViolation('NO_AUDIT', `AUDIT SUMMARY section '${section.header}' missing required content: ${missingKeywords.join(', ')}`);
      }
    }

    // Validate Go/No-Go decision is explicit
    const goSection = auditContent.match(/###\s*🚦\s*Go\/No-Go Decision[\s\S]*?(?=###|$)/i);
    if (goSection) {
      const goContent = goSection[0];
      if (!goContent.match(/\b(GO|PROCEED|CONTINUE)\b/i) && !goContent.match(/\b(NO-GO|STOP|BLOCK)\b/i)) {
        this.addViolation('NO_AUDIT', 'AUDIT SUMMARY Go/No-Go decision must explicitly state GO or NO-GO');
      }
    }

    if (this.debug) {
      console.log(`📄 Using AUDIT SUMMARY: ${latestAudit} (${Math.round(auditAge / (60 * 1000))} minutes old)`);
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

  // GATE 4: Enhanced SoC validation using declarative manifest
  async validateSoCBoundaries(stagedFiles) {
    console.log('🔍 [GATE 4] Validating SoC boundaries (Manifest-driven v1.1)...');

    for (const file of stagedFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');
      const layer = this.detectLayer(file);

      if (!layer) continue; // Skip files not in recognized layers

      const layerRules = this.socManifest.layers[layer];
      if (!layerRules) continue;

      // Extract all imports from the file
      const imports = content.match(/from\s+['"`][^'"`]+['"`]/g) || [];

      for (const importStatement of imports) {
        const importPath = importStatement.match(/['"`]([^'"`]+)['"`]/)[1];

        // Skip relative imports and node_modules
        if (!importPath.startsWith('@/')) continue;

        // Check against forbidden imports
        const isForbidden = layerRules.forbidden_imports.some(pattern =>
          this.matchesPattern(importPath, pattern)
        );

        if (isForbidden) {
          this.addViolation('SOC_VIOLATION',
            `${layer.toUpperCase()} layer violation in ${file}: '${importPath}' violates boundary rules. ${layerRules.description}`);
        }

        // Check if import is in allowed list (if defined)
        if (layerRules.allowed_imports && layerRules.allowed_imports.length > 0) {
          const isAllowed = layerRules.allowed_imports.some(pattern =>
            this.matchesPattern(importPath, pattern)
          );

          if (!isAllowed && importPath.startsWith('@/modules/')) {
            this.addViolation('SOC_VIOLATION',
              `${layer.toUpperCase()} layer violation in ${file}: '${importPath}' not in allowed imports. ${layerRules.description}`);
          }
        }
      }
    }

    if (this.debug) {
      console.log('📋 SoC Manifest loaded:', JSON.stringify(this.socManifest.layers, null, 2));
    }

    console.log('✅ SoC boundaries validation completed');
  }

  // Detect which architectural layer a file belongs to
  detectLayer(filePath) {
    if (filePath.includes('/ui/') || filePath.includes('/components/')) return 'ui';
    if (filePath.includes('/application/')) return 'application';
    if (filePath.includes('/domain/')) return 'domain';
    if (filePath.includes('/infrastructure/')) return 'infrastructure';
    return null;
  }

  // Match import path against pattern (supports wildcards)
  matchesPattern(importPath, pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(importPath);
  }

  // GATE 5: Enhanced RLS validation using manifest-driven rules
  async validateRLSCompliance(stagedFiles) {
    console.log('🔍 [GATE 5] Validating RLS compliance (Manifest-driven v1.1)...');

    for (const file of stagedFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Skip exempt files
      const allExemptOperations = [
        ...(this.rlsManifest.exempt_operations.system_level || []),
        ...(this.rlsManifest.exempt_operations.administrative || []),
        ...(this.rlsManifest.exempt_operations.reference_data || [])
      ];

      const isExempt = allExemptOperations.some(exempt =>
        file.includes(exempt) || content.includes(`@exempt:${exempt}`)
      );

      if (isExempt) {
        if (this.debug) {
          console.log(`⏭️  Skipping RLS check for exempt file: ${file}`);
        }
        continue;
      }

      // Check clinical entity access against manifest
      const allClinicalEntities = [
        ...(this.rlsManifest.clinical_entities.phi_protected || []),
        ...(this.rlsManifest.clinical_entities.organizational_data || [])
      ];

      for (const entity of allClinicalEntities) {
        if (content.includes(entity) || content.includes(entity.slice(0, -1))) { // singular form
          const hasDbOperation = content.includes('.from(') || content.includes('.select(') ||
                                content.includes('.insert(') || content.includes('.update(') ||
                                content.includes('.delete(');

          if (hasDbOperation) {
            // Check required filters based on entity
            let missingFilters = [];

            for (const [filterField, filterRule] of Object.entries(this.rlsManifest.required_filters)) {
              if (filterRule.tables.includes(entity)) {
                const hasFilter = content.includes(filterField) ||
                                content.includes(filterField.replace('_', '')) || // camelCase
                                content.includes('whereOrganization') || // helper method
                                content.includes('withOrgFilter');

                if (!hasFilter) {
                  missingFilters.push(filterField);
                }
              }
            }

            if (missingFilters.length > 0) {
              this.addViolation('RLS_RISK',
                `Clinical entity '${entity}' in ${file} missing required filters: ${missingFilters.join(', ')}. ` +
                `Add ${missingFilters.map(f => `${f} filtering`).join(' and ')} for HIPAA compliance`);
            }

            // Check for explicit RLS bypass (dangerous)
            if (content.includes('rlsDisabled') || content.includes('bypassRLS') || content.includes('.rls(false)')) {
              this.addViolation('RLS_RISK',
                `Explicit RLS bypass detected in ${file} for '${entity}'. This is dangerous for PHI protection`);
            }
          }
        }
      }

      // Check for cross-organization data access patterns
      if (content.includes('JOIN') && allClinicalEntities.some(e => content.includes(e))) {
        if (!content.includes('ON') || !content.includes('organization_id')) {
          this.addViolation('RLS_RISK',
            `Cross-table JOIN in ${file} may leak data across organizations. Ensure organization_id filtering in JOIN conditions`);
        }
      }
    }

    if (this.debug) {
      console.log('📋 RLS Manifest loaded:', JSON.stringify(this.rlsManifest, null, 2));
    }

    console.log('✅ RLS compliance validation completed');
  }

  // GATE 6: Enhanced UI tokens validation with allowlist
  async validateUITokens(stagedFiles) {
    console.log('🔍 [GATE 6] Validating UI tokens (Allowlist-driven v1.1)...');

    for (const file of stagedFiles) {
      if (!file.endsWith('.tsx') && !file.endsWith('.jsx')) continue;

      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // Enhanced hardcoded colors detection with allowlist checking
      const colorPattern = /(?:bg-|text-|border-|ring-|from-|to-|via-|fill-|stroke-)([a-zA-Z0-9-]+)/g;
      let colorMatch;
      const violations = [];

      while ((colorMatch = colorPattern.exec(content)) !== null) {
        const colorToken = colorMatch[1];

        // Check if it's a semantic token (allowed)
        const isSemanticToken = this.allowlist.colors.some(allowedColor =>
          colorToken.startsWith(allowedColor) || colorToken === allowedColor
        );

        // Check if it's an allowed numeric value
        const numericMatch = colorToken.match(/(\w+)-(\d+)/);
        const isAllowedNumeric = numericMatch &&
          this.allowlist.allowed_numeric.includes(parseInt(numericMatch[2]));

        // Check for forbidden hardcoded patterns
        const isForbiddenHardcode = /(?:red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/.test(colorToken);

        if (isForbiddenHardcode && !isSemanticToken && !isAllowedNumeric) {
          violations.push(colorToken);
        }
      }

      if (violations.length > 0) {
        this.addViolation('UI_HARDCODE',
          `Hardcoded colors in ${file}: ${violations.join(', ')}. Use semantic tokens: ${this.allowlist.colors.slice(0, 5).join(', ')}, etc.`);
      }

      // Enhanced spacing validation with allowlist
      const spacingPattern = /(?:p|m|w|h|top|right|bottom|left|gap|space)-([a-zA-Z0-9-]+)/g;
      let spacingMatch;
      const spacingViolations = [];

      while ((spacingMatch = spacingPattern.exec(content)) !== null) {
        const spacingToken = spacingMatch[1];

        // Check if it's a semantic spacing token
        const isSemanticSpacing = this.allowlist.spacing.some(allowedSpacing =>
          spacingToken === allowedSpacing
        );

        // Check if it's an allowed numeric value
        const isAllowedNumeric = this.allowlist.allowed_numeric.includes(parseInt(spacingToken));

        if (!isSemanticSpacing && !isAllowedNumeric && /^\d+$/.test(spacingToken)) {
          spacingViolations.push(spacingToken);
        }
      }

      if (spacingViolations.length > 3) { // Allow some numeric spacing
        this.addViolation('UI_HARDCODE',
          `Excessive hardcoded spacing in ${file}: ${spacingViolations.join(', ')}. Use semantic tokens: ${this.allowlist.spacing.join(', ')}`);
      }

      // Check for hex colors (always forbidden)
      const hexColors = content.match(/#[0-9A-Fa-f]{3,6}/g);
      if (hexColors) {
        this.addViolation('UI_HARDCODE',
          `Hex colors in ${file}: ${hexColors.join(', ')}. Use OKLCH-based semantic tokens instead`);
      }

      // Check for RGB/HSL colors (forbidden in healthcare UI)
      const rgbColors = content.match(/(?:rgb|hsl|rgba|hsla)\([^)]+\)/g);
      if (rgbColors) {
        this.addViolation('UI_HARDCODE',
          `RGB/HSL colors in ${file}: ${rgbColors.join(', ')}. Use OKLCH-based semantic tokens for accessibility`);
      }
    }

    if (this.debug) {
      console.log('📋 Tailwind Allowlist loaded:', JSON.stringify(this.allowlist, null, 2));
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

  // Generate enhanced stable report with consistent formatting
  async generateReport() {
    const timestamp = new Date().toISOString();
    const reportFilename = `health_guard_report_${new Date().toISOString().split('T')[0]}.md`;
    const reportPath = path.join(this.projectRoot, 'tmp', reportFilename);

    // Also create a stable report for CI/scripts
    const stableReportPath = path.join(this.projectRoot, 'tmp', 'health_guard_violations.md');

    const violationsByCode = this.violations.reduce((acc, violation) => {
      if (!acc[violation.code]) acc[violation.code] = [];
      acc[violation.code].push(violation);
      return acc;
    }, {});

    const report = `# Health Guard Violations Report v1.1

**Generated**: ${timestamp}
**Mode**: ${this.mode.toUpperCase()}
**Guard Version**: Sentinel v1.1
**Files Analyzed**: ${this.checkedFiles.length}

## 📊 Summary

- **Total Violations**: ${this.violations.length}
- **Violation Types**: ${Object.keys(violationsByCode).length}
- **Status**: ${this.violations.length === 0 ? '✅ PASSED' : '❌ FAILED'}

${this.mode === 'fast' ? '⚡ **Fast Mode**: Critical gates only (pre-commit validation)' : '🔍 **Full Mode**: Complete validation (pre-push/CI)'}

## 🚦 GATES Status

| Gate | Status | Description |
|------|--------|-------------|
| 1 - AUDIT SUMMARY | ${this.hasViolationType('NO_AUDIT') ? '❌' : '✅'} | Enhanced validation with content quality checks |
| 2 - PATH VALIDATION | ${this.hasViolationType('PATH_GUESS') ? '❌' : '✅'} | Confirmed imports and TypeScript aliases |
| 3 - DUPLICATE DETECTION | ${this.mode === 'fast' ? '⏭️' : (this.hasViolationType('DUPLICATE_FOUND') ? '❌' : '✅')} | ${this.mode === 'fast' ? 'Skipped in fast mode' : 'No duplicate components or functionality'} |
| 4 - SOC BOUNDARIES | ${this.hasViolationType('SOC_VIOLATION') ? '❌' : '✅'} | Manifest-driven layer isolation validation |
| 5 - RLS COMPLIANCE | ${this.mode === 'fast' ? '⏭️' : (this.hasViolationType('RLS_RISK') ? '❌' : '✅')} | ${this.mode === 'fast' ? 'Skipped in fast mode' : 'Manifest-driven organization filtering'} |
| 6 - UI TOKENS | ${this.hasViolationType('UI_HARDCODE') ? '❌' : '✅'} | Allowlist-driven semantic token validation |
| 7 - ACCESSIBILITY | ${this.mode === 'fast' ? '⏭️' : (this.hasViolationType('A11Y_FAIL') ? '❌' : '✅')} | ${this.mode === 'fast' ? 'Skipped in fast mode' : 'WCAG 2.1 AA compliance'} |
| 8 - ZOD VALIDATION | ${this.mode === 'fast' ? '⏭️' : (this.hasViolationType('NO_ZOD_SCHEMA') ? '❌' : '✅')} | ${this.mode === 'fast' ? 'Skipped in fast mode' : 'Zod schemas for forms and APIs'} |
| 9 - BFF WRAPPERS | ${this.mode === 'fast' ? '⏭️' : (this.hasViolationType('WRAPPERS_MISSING') ? '❌' : '✅')} | ${this.mode === 'fast' ? 'Skipped in fast mode' : 'Correct security wrapper order'} |

## 🚫 Violations by Category

${this.violations.length === 0 ? '✨ **No violations found!** All Health philosophy compliance checks passed.' :
Object.entries(violationsByCode).map(([code, violations]) => `
### ${code} (${violations.length} occurrence${violations.length > 1 ? 's' : ''})

**Impact**: ${REASON_CODES[code]}

${violations.map((v, i) => `${i + 1}. ${v.message}`).join('\n')}

**Resolution**: ${this.getResolutionSteps(code)}
`).join('\n')}

## 📋 Configuration Status

- **SoC Manifest**: ${fs.existsSync(path.join(this.projectRoot, 'scripts', 'sentinel', 'soc-manifest.json')) ? '✅ Custom' : '⚠️  Default'}
- **RLS Manifest**: ${fs.existsSync(path.join(this.projectRoot, 'scripts', 'sentinel', 'rls-manifest.json')) ? '✅ Custom' : '⚠️  Default'}
- **Tailwind Allowlist**: ${fs.existsSync(path.join(this.projectRoot, 'scripts', 'sentinel', 'tailwind-allowlist.json')) ? '✅ Custom' : '⚠️  Default'}

## 📚 Health Philosophy References

- **[IMPLEMENTATION_GUIDE.md](../../docs/IMPLEMENTATION_GUIDE.md)**: Architecture and layer boundaries
- **[CLAUDE.md](../../CLAUDE.md)**: AUDIT-FIRST workflow and templates
- **[SENTINEL_PRECHECKLIST.md](../../docs/SENTINEL_PRECHECKLIST.md)**: Exhaustive validation protocols

## 🔧 Next Steps

${this.violations.length > 0 ? `
### ❌ Violations Must Be Fixed

1. **Review each violation** listed above with its specific resolution steps
2. **Update your code** to address the Health philosophy violations
3. **Re-run validation**: \`npm run health:guard\` (fast) or \`npm run health:guard:verbose\` (full)
4. **Ensure AUDIT SUMMARY** is complete and follows the enhanced template requirements
5. **Follow the manifest-driven rules** for SoC, RLS, and UI tokens

### 🚨 Critical Violations
${this.violations.filter(v => ['RLS_RISK', 'NO_AUDIT', 'SOC_VIOLATION'].includes(v.code)).length > 0 ?
'The following violations are critical for healthcare compliance and must be fixed immediately:\n' +
this.violations.filter(v => ['RLS_RISK', 'NO_AUDIT', 'SOC_VIOLATION'].includes(v.code))
  .map(v => `- **${v.code}**: ${v.message}`).join('\n') :
'No critical violations detected.'}
` : `
### ✅ All Validations Passed!

Your changes follow OrbiPax Health philosophy and are ready for:
${this.mode === 'fast' ?
'- **Commit**: Continue with \`git commit\`\n- **Full validation**: Will run on \`git push\`' :
'- **Push to remote**: \`git push origin <branch>\`\n- **Pull request creation**: All gates passed'}

🎉 **Excellent work maintaining healthcare code quality!**
`}

---

*Health Guard Sentinel v1.1 - Automated OrbiPax CMH Philosophy Enforcement*
*Enhanced with fast/full modes, allowlist validation, and manifest-driven rules*
`;

    // Ensure tmp directory exists
    const tmpDir = path.dirname(reportPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Write both reports
    fs.writeFileSync(reportPath, report);
    fs.writeFileSync(stableReportPath, report);

    if (this.debug) {
      console.log(`📄 Report generated: ${reportFilename}`);
      console.log(`📄 Stable report: health_guard_violations.md`);
    }
  }

  // Check if violations of a specific type exist
  hasViolationType(code) {
    return this.violations.some(v => v.code === code);
  }

  // Get specific resolution steps for each violation type
  getResolutionSteps(code) {
    const resolutions = {
      'NO_AUDIT': 'Create complete AUDIT SUMMARY in /tmp using CLAUDE.md template with all 8 required sections',
      'PATH_GUESS': 'Verify all import paths exist in repository and use correct TypeScript aliases from tsconfig.json',
      'DUPLICATE_FOUND': 'Consolidate duplicate functionality or create consolidation plan in AUDIT SUMMARY',
      'SOC_VIOLATION': 'Respect layer boundaries: UI→Application→Domain→Infrastructure. Check SoC manifest rules',
      'RLS_RISK': 'Add organization_id filtering for clinical data access. Follow RLS manifest requirements',
      'UI_HARDCODE': 'Replace hardcoded values with semantic tokens from Tailwind allowlist',
      'A11Y_FAIL': 'Add ARIA labels, focus styles, and ensure 44px minimum touch targets for healthcare accessibility',
      'NO_ZOD_SCHEMA': 'Implement Zod validation schemas for all forms and API endpoints handling clinical data',
      'WRAPPERS_MISSING': 'Add BFF security wrappers in correct order: withAuth→withSecurity→withRateLimit→withAudit',
      'PROMPT_FORMAT_ERROR': 'Follow Health philosophy prompt templates and guidelines from CLAUDE.md'
    };

    return resolutions[code] || 'Follow OrbiPax Health philosophy guidelines';
  }
}

// Main execution
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const mode = args.includes('--fast') ? 'fast' :
               args.includes('--full') ? 'full' :
               process.env.GUARD_MODE || 'full';

  const options = { mode };

  const guard = new HealthGuard(options);
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