import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { MARCA_NONCE } from './src/servidor/documento';

export default defineConfig({
  plugins: [react()],
  // Vite pone nonce="MARCA_NONCE" en cada <script> y <style> del index.html compilado; el
  // servidor lo reemplaza en cada respuesta por un valor nuevo (src/servidor/documento.ts).
  html: { cspNonce: MARCA_NONCE },
  // `vite build` deja el cliente en dist/client; `vite build --ssr ... --outDir dist/server`, el servidor.
  build: { outDir: 'dist/client' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
