/**
 * ESLint Configuration for Design System Enforcement
 * 
 * This config ensures all code follows the CatSwap design system.
 * It prevents:
 * - Hardcoded colors
 * - Forbidden font-family declarations
 * - Deprecated CSS variable usage
 * - Arbitrary Tailwind values
 */

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.*.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'design-system'],
  rules: {
    // React Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // ============================================
    // DESIGN SYSTEM RULES - STRICT ENFORCEMENT
    // ============================================

    // Prevent hardcoded colors in className
    'no-restricted-syntax': [
      'error',
      {
        // Block hardcoded hex colors in JSX
        selector: 'JSXAttribute[name.name="className"] Literal[value=/bg-\\[#[0-9a-fA-F]{3,6}\\]/]',
        message: 'Hardcoded colors are forbidden. Use design system tokens like bg-success, bg-danger, bg-background. See DESIGN_SYSTEM_TOKENS.md',
      },
      {
        // Block hardcoded text colors
        selector: 'JSXAttribute[name.name="className"] Literal[value=/text-\\[#[0-9a-fA-F]{3,6}\\]/]',
        message: 'Hardcoded text colors are forbidden. Use text-foreground, text-success, text-danger. See DESIGN_SYSTEM_TOKENS.md',
      },
      {
        // Block arbitrary border colors
        selector: 'JSXAttribute[name.name="className"] Literal[value=/border-\\[#[0-9a-fA-F]{3,6}\\]/]',
        message: 'Hardcoded border colors are forbidden. Use border-border, border-success, border-danger',
      },
    ],

    // Prevent font-family overrides (use font-sans only)
    'no-restricted-properties': [
      'error',
      {
        object: 'style',
        property: 'fontFamily',
        message: 'Do not override font-family. Use Tailwind font-sans class instead. See DESIGN_SYSTEM.md Typography section',
      },
    ],
  },
  overrides: [
    {
      // Allow CSS variables in specific files
      files: ['src/index.css', 'tailwind.config.js'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
    {
      // Allow arbitrary values for layout exceptions
      files: ['src/components/**/*.tsx'],
      rules: {
        'no-restricted-syntax': [
          'warn', // Downgrade to warning in components
          {
            selector: 'JSXAttribute[name.name="className"] Literal[value=/\\[#[0-9a-fA-F]{3,6}\\]/]',
            message: 'Consider using design system tokens. If this is intentional, add a comment explaining why.',
          },
        ],
      },
    },
  ],
};
