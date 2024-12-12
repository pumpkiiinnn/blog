import { defineConfig } from '@zhangyu1818/eslint-config'

export default defineConfig(
  {
    presets: {
      javascript: {
        'no-undef': 'off',
      },
      prettier: true,
      tailwindcss: true,
    },
  },
  [
    {
      ignores: ['postcss.config.js', 'prettier.config.mjs'],
    },
  ],
)
