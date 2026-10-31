import { defineConfig } from 'vitest/config';

export default defineConfig({
  // JSX automático sin @vitejs/plugin-react: el sistema de diseño no necesita más.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
