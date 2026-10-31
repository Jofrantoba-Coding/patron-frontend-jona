import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    // Arranca el servidor mock (../mock-server) en un puerto libre para las pruebas HTTP.
    globalSetup: ['./test/mockServer.globalSetup.ts'],
  },
});
