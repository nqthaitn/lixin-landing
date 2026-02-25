import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/counter.js', 'src/javascript.svg', 'src/supabase.js', 'src/admin.js', 'src/main.js', 'src/newsStorage.js'],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },
    },
  },
});