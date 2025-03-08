// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    // Global ignores
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**', // This will completely ignore the dist directory
      '**/*.js.map',
    ],
    // TypeScript files config
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
      ],
      
      // General code style rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'log'] }],
      'no-unused-vars': 'off', // TypeScript rule handles this
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        // Add globals for Node.js environment
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        exports: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
  },
  // Add a specific configuration for CommonJS files in the dist directory
  {
    files: ['**/*.js', '**/*.mjs'],
    ignores: ["coverage/**"],
    rules: {
      // Disable rules that don't make sense for compiled JS
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-undef': 'off'
    },
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        // Add globals for Node.js environment
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        exports: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    }
  }
);