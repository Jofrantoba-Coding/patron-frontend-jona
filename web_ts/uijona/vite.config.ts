import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// Build one entry per atom and molecule for tree-shaking
function collectEntries(dir: string, prefix: string): Record<string, string> {
  const entries: Record<string, string> = {};
  try {
    readdirSync(resolve(__dirname, dir)).forEach((file) => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const name = file.replace(/\.(tsx|ts)$/, '');
        entries[`${prefix}/${name}`] = resolve(__dirname, dir, file);
      }
    });
  } catch {}
  return entries;
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      outDir: 'dist',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...collectEntries('src/atoms', 'atoms'),
        ...collectEntries('src/molecules', 'molecules'),
        ...collectEntries('src/hooks', 'hooks'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // One file per module — enables true tree-shaking
        preserveModules: true,
        preserveModulesRoot: 'src',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
