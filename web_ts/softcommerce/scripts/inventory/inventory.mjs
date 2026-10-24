#!/usr/bin/env node
// Usage: npm run inventory -- <softcommerce-desktop root> [--out <file>] [--overrides <file>]
// Reads <root>/src (read-only) and the wave override map, and writes the GUI class inventory as UTF-8 CSV.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildInventory, InventoryError, loadOverrides, toCsv } from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUT = path.join(HERE, 'inventory.csv');
const DEFAULT_OVERRIDES = path.join(HERE, 'wave-overrides.json');

/**
 * @param {string[]} argv
 * @param {{ stderr?: (message: string) => void, readFile?: (file: string) => Buffer, defaultOut?: string, defaultOverrides?: string }} [io]
 * @returns {number} process exit code
 */
export function main(
  argv,
  { stderr = (m) => console.error(m), readFile, defaultOut = DEFAULT_OUT, defaultOverrides = DEFAULT_OVERRIDES } = {},
) {
  /** @type {Record<string, string | undefined>} */
  const flags = {};
  /** @type {string[]} */
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out' || argv[i] === '--overrides') flags[argv[i]] = argv[++i];
    else positional.push(argv[i]);
  }
  const out = '--out' in flags ? flags['--out'] : defaultOut;
  const overridesFile = '--overrides' in flags ? flags['--overrides'] : defaultOverrides;
  const root = positional[0];
  if (!root || !out || !overridesFile) {
    stderr('usage: inventory <root> [--out <file>] [--overrides <file>]');
    return 2;
  }
  const srcRoot = path.join(root, 'src');
  if (!fs.existsSync(srcRoot) || !fs.statSync(srcRoot).isDirectory()) {
    stderr(`inventory: source directory not found: ${srcRoot}`);
    return 1;
  }
  try {
    const overrides = loadOverrides(overridesFile);
    const { rows } = buildInventory(srcRoot, {
      readFile,
      overrides,
      onSkip: (rel, error) => stderr(`inventory: skipped unreadable file ${rel}: ${error.message}`),
    });
    fs.writeFileSync(out, toCsv(rows), 'utf8');
    return 0;
  } catch (error) {
    if (!(error instanceof InventoryError) && /** @type {NodeJS.ErrnoException} */ (error).code !== 'ENOENT') throw error;
    stderr(`inventory: ${/** @type {Error} */ (error).message}`);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
