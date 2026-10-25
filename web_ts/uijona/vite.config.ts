import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readdirSync, statSync, copyFileSync, mkdirSync } from 'fs';

// Collect entries from JONA-pattern subfolders (each folder has an index.ts)
function collectFolderEntries(dir: string, prefix: string): Record<string, string> {
  const entries: Record<string, string> = {};
  try {
    readdirSync(resolve(__dirname, dir)).forEach((name: string) => {
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
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.stories.ts',
        'src/**/*.stories.tsx',
        'src/test/**',
        'src/__tests__/**',
      ],
      outDir: 'dist',
      insertTypesEntry: true,
    }),
    // Copy the plain CSS files to dist after build: the token file and the
    // opt-in base styles (D7).
    {
      name: 'copy-theme-css',
      closeBundle() {
        [
          ['src/theme/tokens.css', 'dist/theme/tokens.css'],
          ['src/styles/base.css', 'dist/base.css'],
        ].forEach(([from, to]) => {
          const dest = resolve(__dirname, to);
          mkdirSync(resolve(dest, '..'), { recursive: true });
          copyFileSync(resolve(__dirname, from), dest);
        });
      },
    },
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'theme/index': resolve(__dirname, 'src/theme/index.ts'),
        ...collectFolderEntries('src/atoms', 'atoms'),
        ...collectFolderEntries('src/molecules', 'molecules'),
        ...collectFolderEntries('src/layouts', 'layouts'),
        ...collectFolderEntries('src/organisms', 'organisms'),
        ...collectFolderEntries('src/pages', 'pages'),
        ...collectFolderEntries('src/hooks', 'hooks'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'clsx', 'tailwind-merge'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'tokens.css') return 'theme/tokens.css';
          return assetInfo.name ?? 'assets/[name][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
