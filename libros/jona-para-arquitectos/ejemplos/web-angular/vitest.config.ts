import { defineConfig } from 'vitest/config';

// Configuración adicional para `ng test` (runner Vitest, entorno jsdom, sin navegador).
export default defineConfig({
  test: {
    // Arranca el servidor mock (../mock-server) en un puerto libre para las pruebas HTTP.
    globalSetup: ['./test/mockServer.globalSetup.ts'],
  },
});
