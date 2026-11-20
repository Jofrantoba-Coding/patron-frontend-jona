import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // `vite build` deja el cliente en dist/client; `vite build --ssr ... --outDir dist/server`, el servidor.
  build: { outDir: 'dist/client' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
