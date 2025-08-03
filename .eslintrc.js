module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', 'react-native', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true,
  },
  globals: {
    NodeJS: 'readonly',
    RequestInit: 'readonly',
    localStorage: 'readonly',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-useless-escape': 'warn',
    'no-undef': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
