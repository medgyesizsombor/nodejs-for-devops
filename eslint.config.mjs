import globals from 'globals';
import js from '@eslint/js';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/']
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        myCustomGlobal: 'readonly',
        ...globals.jest
      }
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'max-len': ['error', { 'code': 80 }]
    }
  }
];