import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Solo el proceso de renderizado pasa por Vite; main y preload los empaqueta build-electron.mjs.
  root: 'src/renderer',
  base: './',
  plugins: [react()],
  build: { outDir: '../../dist/renderer', emptyOutDir: true },
  test: {
    root: '.',
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    // Arranca el servidor mock (../mock-server) en un puerto libre para las pruebas HTTP.
    globalSetup: ['./test/mockServer.globalSetup.ts'],
  },
});
