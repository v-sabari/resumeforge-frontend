import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'api/render-pdf.js',
      'api/_pdf-compiled.css',
      'api/_pagination.text.js',
      'scripts/build-pagination.mjs',
      'scripts/fetch-bundled-fonts.mjs',
      // QA audit harnesses (Node .cjs scripts + generated bundles), not app
      // source. See docs/qa/field-coverage-matrix.md.
      'qa-artifacts/**',
    ],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Project convention: no PropTypes/Flow used, and JSX copy intentionally
      // uses raw apostrophes/quotes. Both rules are stylistic, not correctness.
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];
