#!/usr/bin/env node
// Usage: npm run inventory -- <softcommerce-desktop root> [--out <file>]
// Reads <root>/src (read-only) and writes the GUI class inventory as UTF-8 CSV.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildInventory, toCsv } from './lib.mjs';

const DEFAULT_OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'inventory.csv');

/**
 * @param {string[]} argv
 * @param {{ stderr?: (message: string) => void, readFile?: (file: string) => Buffer, defaultOut?: string }} [io]
 * @returns {number} process exit code
 */
export function main(argv, { stderr = (m) => console.error(m), readFile, defaultOut = DEFAULT_OUT } = {}) {
  const outIndex = argv.indexOf('--out');
  const out = outIndex === -1 ? defaultOut : argv[outIndex + 1];
  const root = argv.find((a, i) => a !== '--out' && (outIndex === -1 || i !== outIndex + 1));
  if (!root || !out) {
    stderr('usage: inventory <root> [--out <file>]');
    return 2;
  }
  const srcRoot = path.join(root, 'src');
  if (!fs.existsSync(srcRoot) || !fs.statSync(srcRoot).isDirectory()) {
    stderr(`inventory: source directory not found: ${srcRoot}`);
    return 1;
  }
  const { rows } = buildInventory(srcRoot, {
    readFile,
    onSkip: (rel, error) => stderr(`inventory: skipped unreadable file ${rel}: ${error.message}`),
  });
  fs.writeFileSync(out, toCsv(rows), 'utf8');
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
