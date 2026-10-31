import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    // Arranca el servidor mock (../mock-server) en un puerto libre para las pruebas HTTP.
    globalSetup: ['./test/mockServer.globalSetup.ts'],
  },
});
