/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Node by default (core, server, inventory); jsdom only for component specs.
    environment: 'node',
    environmentMatchGlobs: [['src/**/*.spec.tsx', 'jsdom']],
    include: ['{src,test,mock-server,scripts}/**/*.spec.{ts,tsx}'],
  },
});
