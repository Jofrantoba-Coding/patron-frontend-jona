import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

// Collect entries from JONA-pattern subfolders (each folder has an index.ts)
function collectFolderEntries(dir: string, prefix: string): Record<string, string> {
  const entries: Record<string, string> = {};
  try {
    readdirSync(resolve(__dirname, dir)).forEach((name) => {
      const fullPath = resolve(__dirname, dir, name);
      if (statSync(fullPath).isDirectory()) {
        const indexTs = resolve(fullPath, 'index.ts');
        try {
          statSync(indexTs);
          entries[`${prefix}/${name}`] = indexTs;
        } catch {}
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
        ...collectFolderEntries('src/atoms', 'atoms'),
        ...collectFolderEntries('src/molecules', 'molecules'),
        ...collectFolderEntries('src/hooks', 'hooks'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
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
