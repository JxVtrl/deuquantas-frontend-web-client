import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next',
    'next/typescript',
    'plugin:@typescript-eslint/recommended',
  ),
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-console': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
    },
  },
];

// Adicionar a configuração de ignore corretamente
export const ignores = ['.next/', 'node_modules/', 'dist/'];

export default eslintConfig;
