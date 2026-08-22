import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    ignores: ['dist/**', 'node_modules/**'],

    rules: {
      'no-console': 'off',

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
