import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    // Arranca el servidor mock (../mock-server) en un puerto libre para las pruebas HTTP.
    globalSetup: ['./test/mockServer.globalSetup.ts'],
  },
});
