import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const fromHere = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: { historyApiFallback: true },
  resolve: {
    // Desarrollo ágil cross-folder: 'jona-ui' resuelve al CÓDIGO FUENTE de la
    // librería, así los cambios en ../uijona/src se reflejan sin build ni install.
    alias: {
      'jona-ui': fromHere('../uijona/src/index.ts'),
    },
    dedupe: ['react', 'react-dom'],
  },
  // La librería está en fuente, no la pre-bundleamos.
  optimizeDeps: { exclude: ['jona-ui'] },
});
