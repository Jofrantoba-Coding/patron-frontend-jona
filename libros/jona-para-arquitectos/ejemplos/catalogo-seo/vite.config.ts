import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: isSsrBuild
    ? // `vite build --ssr --outDir dist/server`: los tres procesos del servidor, con el código que comparten.
      {
        rollupOptions: {
          input: {
            principal: 'src/servidor/principal.ts',
            generarEstatico: 'src/servidor/generarEstatico.ts',
            previsualizarEstatico: 'src/servidor/previsualizarEstatico.ts',
          },
        },
      }
    : // `vite build`: el cliente, con la plantilla index.html, en dist/client.
      { outDir: 'dist/client' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
}));
