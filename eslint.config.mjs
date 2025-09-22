// OrbiPax ESLint Configuration - Flat Config (Modern ESLint)
// Enforces modular monolith architecture boundaries and quality gates
// SoC Rules: UI → Application → Domain; Infrastructure only from Application

import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import unused from "eslint-plugin-unused-imports";

export default [
  // Global ignores
  {
    ignores: [
      "dist",
      "build",
      ".next",
      "node_modules",
      "tmp",
      "coverage",
      "*.config.js",
      "*.config.ts"
    ]
  },

  // Base configuration for all TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@typescript-eslint": ts,
      "import": importPlugin,
      "jsx-a11y": jsxA11y,
      "unused-imports": unused
    },
    rules: {
      // =================================================================
      // CORE QUALITY RULES
      // =================================================================
      "no-console": ["error", { "allow": ["warn", "error"] }],
      "no-alert": "error",
      "eqeqeq": ["error", "always"],
      "curly": "error",
      "no-var": "error",
      "prefer-const": "error",

      // TypeScript strict rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      // Import hygiene
      "import/no-default-export": "error",
      "import/order": ["error", {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@/shared/**",
            "group": "internal",
            "position": "before"
          },
          {
            "pattern": "@/modules/**",
            "group": "internal",
            "position": "after"
          }
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],

      // Clean imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ],

      // =================================================================
      // ACCESSIBILITY HINTS (JSX)
      // =================================================================
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/label-has-associated-control": "warn",
      "jsx-a11y/no-redundant-roles": "warn"
    }
  },

  // =================================================================
  // UI LAYER BOUNDARY ENFORCEMENT
  // =================================================================
  {
    files: ["src/modules/**/ui/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
    rules: {
      // UI cannot import from Infrastructure layer
      "no-restricted-imports": ["error", {
        "patterns": [
          {
            "group": ["**/infrastructure/**", "**/infra/**"],
            "message": "UI layer cannot import from Infrastructure. Use Application layer instead. (ui → application → infrastructure)"
          },
          {
            "group": ["**/db/**", "**/database/**"],
            "message": "UI layer cannot import database modules. Use Application layer services instead."
          },
          {
            "group": ["**/repositories/**"],
            "message": "UI layer cannot import repositories. Use Application layer use cases instead."
          }
        ]
      }],

      // Server Components and RSC hints
      "no-restricted-syntax": ["warn", {
        "selector": "CallExpression[callee.name='fetch']",
        "message": "Avoid direct fetch in UI components. Use Server Actions or Application layer services instead."
      }]
    }
  },

  // =================================================================
  // DOMAIN LAYER PURITY ENFORCEMENT
  // =================================================================
  {
    files: ["src/modules/**/domain/**/*.{ts,tsx}"],
    rules: {
      // Domain must remain pure - no external dependencies except shared
      "no-restricted-imports": ["error", {
        "patterns": [
          {
            "group": ["**/ui/**"],
            "message": "Domain layer cannot import from UI. Domain must be pure and framework-agnostic."
          },
          {
            "group": ["**/infrastructure/**", "**/infra/**"],
            "message": "Domain layer cannot import from Infrastructure. Use dependency inversion via interfaces."
          },
          {
            "group": ["**/application/**"],
            "message": "Domain layer cannot import from Application. Dependency direction must be application → domain."
          },
          {
            "group": ["react", "next/**", "@/components/**"],
            "message": "Domain layer must stay framework-free. Only Zod and shared utilities allowed."
          }
        ]
      }],

      // Enforce pure functions and immutability
      "no-restricted-syntax": ["error", {
        "selector": "AssignmentExpression[left.type='MemberExpression']",
        "message": "Avoid mutation in Domain layer. Prefer immutable updates and pure functions."
      }]
    }
  },

  // =================================================================
  // APPLICATION LAYER CONTRACTS
  // =================================================================
  {
    files: ["src/modules/**/application/**/*.{ts,tsx}"],
    rules: {
      // JSON-serializable contract enforcement
      "no-restricted-syntax": ["warn", {
        "selector": "ReturnStatement > NewExpression",
        "message": "Return plain JSON-serializable objects from Application boundaries, not class instances."
      }],

      // Server Actions must be async and return plain objects
      "no-restricted-syntax": ["warn", {
        "selector": "FunctionDeclaration[async=false][id.name=/Action$/]",
        "message": "Server Actions must be async functions. Add 'async' keyword."
      }]
    }
  },

  // =================================================================
  // INFRASTRUCTURE LAYER ISOLATION
  // =================================================================
  {
    files: ["src/modules/**/infrastructure/**/*.{ts,tsx}"],
    rules: {
      // Infrastructure should not import from UI
      "no-restricted-imports": ["error", {
        "patterns": [
          {
            "group": ["**/ui/**"],
            "message": "Infrastructure layer cannot import from UI. Keep infrastructure concerns separate."
          }
        ]
      }]
    }
  },

  // =================================================================
  // SHARED RESOURCES RULES
  // =================================================================
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      // Shared should not import from any specific module
      "no-restricted-imports": ["error", {
        "patterns": [
          {
            "group": ["@/modules/**"],
            "message": "Shared utilities cannot import from specific modules. Keep shared resources generic."
          }
        ]
      }]
    }
  },

  // =================================================================
  // SPECIAL RULES FOR CONFIG FILES
  // =================================================================
  {
    files: ["*.config.{js,ts}", "*.config.{mjs,mts}"],
    rules: {
      "import/no-default-export": "off" // Config files commonly use default exports
    }
  },

  // =================================================================
  // NEXT.JS APP ROUTER EXCEPTIONS
  // =================================================================
  {
    files: ["src/app/**/page.{ts,tsx}", "src/app/**/layout.{ts,tsx}", "src/app/**/loading.{ts,tsx}", "src/app/**/error.{ts,tsx}", "src/app/**/not-found.{ts,tsx}"],
    rules: {
      "import/no-default-export": "off" // Next.js requires default exports for these files
    }
  }
];

// =================================================================
// ARCHITECTURAL BOUNDARY REFERENCE
// =================================================================
// Allowed import directions:
// ✅ ui → application (same module)
// ✅ application → domain | infrastructure | shared
// ✅ domain → shared (pure utilities only)
// ✅ infrastructure → shared
//
// ❌ FORBIDDEN:
// ❌ ui → infrastructure (bypass application layer)
// ❌ domain → infrastructure/ui (break purity)
// ❌ cross-module deep imports (use public APIs)
//
// WRAPPER ORDER: withAuth → withSecurity → withRateLimit → withAudit → withIdempotency
//
// EXCEPTIONS: Add // eslint-disable-next-line with clear justification
// Document persistent exceptions in docs/soc/exceptions.md with ADR