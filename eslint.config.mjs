import prettierConfig from 'eslint-config-prettier';
import eslintImport from 'eslint-plugin-import';
import eslintPrettier from 'eslint-plugin-prettier';
import eslintSecurity from 'eslint-plugin-security';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Base ESLint configuration
    ignores: ['dist/**', 'node_modules/**', 'logs/**', '*.mjs', '*.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 2022
      },
      globals: {
        node: true,
        es2022: true
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    }
  },

  // Enable recommended configurations
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Security plugin
  {
    plugins: {
      security: eslintSecurity
    },
    rules: {
      ...eslintSecurity.configs.recommended.rules
    }
  },

  // Import plugin
  {
    plugins: {
      import: eslintImport
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      }
    },
    rules: {
      // Import/Export rules - Configured to work with VS Code auto-organize
      // 'import/order': [
      //   'warn', // Warning to not conflict with auto-organize
      //   {
      //     groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], ['type']],
      //     'newlines-between': 'never', // Match typical auto-organize behavior
      //     alphabetize: {
      //       order: 'asc',
      //       caseInsensitive: true
      //     },
      //     warnOnUnassignedImports: false
      //   }
      // ],
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/no-cycle': 'warn',
      'import/no-unused-modules': 'warn',
      'import/no-deprecated': 'warn'
    }
  },

  // Main rules configuration
  {
    plugins: {
      prettier: eslintPrettier
    },
    rules: {
      // Prettier integration - let Prettier handle its own config
      'prettier/prettier': 'error',

      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': [
        'warn', // Warn for decorators and internal functions
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true
        }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          ignoreRestArgs: true, // Allow any in rest parameters
          fixToUnknown: true
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn', // Allow with warning
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for most cases
      '@typescript-eslint/strict-boolean-expressions': [
        'off', // Disabled as it's too restrictive
        {
          allowString: true, // Allow string checks
          allowNumber: false,
          allowNullableObject: true, // Allow nullable object checks
          allowNullableBoolean: true, // Allow nullable boolean checks
          allowNullableString: true, // Allow nullable string checks
          allowNullableNumber: false,
          allowAny: false
        }
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false
        }
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // Naming conventions - More flexible
      '@typescript-eslint/naming-convention': [
        'warn', // warn
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow', // Allow leading underscore for unused params
          trailingUnderscore: 'allow'
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'], // Allow PascalCase for decorators
          leadingUnderscore: 'allow'
        },
        {
          selector: 'typeLike',
          format: ['PascalCase']
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE', 'PascalCase']
        },
        {
          selector: 'property',
          format: null // Allow any format for object properties
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow'
        }
      ],

      // General JavaScript rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-return-assign': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': 'error',
      'require-await': 'off', // Using TypeScript version
      yoda: 'error',

      // Code quality
      complexity: ['warn', 15], // Increased from 10
      'max-depth': ['warn', 5], // Increased from 4
      'max-nested-callbacks': ['warn', 4], // Increased from 3
      'max-params': ['warn', 5], // Increased from 4
      'max-statements': ['warn', 25], // Increased from 20
      'max-lines': ['warn', 400], // Increased from 300
      'max-lines-per-function': ['warn', 85], // Increased from 50

      // Best practices
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'default-case': 'error',
      'default-case-last': 'error',
      'dot-notation': 'error',
      'guard-for-in': 'error',
      'no-caller': 'error',
      'no-constructor-return': 'error',
      'no-else-return': 'error',
      'no-empty-function': 'error',
      'no-eq-null': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 0, 1, 2, 5, 10, 20, 100, 1000, 1024, 5000, 10000], // Common numbers including timeouts
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
          enforceConst: false, // Don't enforce const for literals
          detectObjects: false // Don't check object properties
        }
      ],
      'no-multi-spaces': 'error',
      'no-new': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-proto': 'error',
      'no-self-compare': 'error',
      'no-useless-escape': 'error',
      'no-with': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      radix: 'error',

      // Security rules
      'security/detect-object-injection': 'off', // Disabled as it's common pattern in TypeScript with proper typing
      'security/detect-non-literal-fs-filename': 'off', // Disabled as it's common in utility functions
      'security/detect-non-literal-regexp': 'off', // Disabled for template parsing

      // Disable some overly strict rules
      '@typescript-eslint/no-extraneous-class': 'off', // Allow utility classes
      '@typescript-eslint/no-useless-constructor': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'no-empty-function': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/unified-signatures': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      'no-param-reassign': 'off', // Disabled for utility functions

      // Allow some patterns common in decorators and framework code
      'no-new': 'warn',
      'prefer-template': 'warn'
    }
  },

  // Prettier config to disable conflicting rules
  prettierConfig
);
