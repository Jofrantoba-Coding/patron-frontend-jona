import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));

async function collectDtsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return collectDtsFiles(path);
      return entry.isFile() && entry.name.endsWith('.d.ts') ? [path] : [];
    })
  );

  return files.flat();
}

const reactImportPattern = /from ['"](?:\.\.\/)+node_modules\/react['"]/g;
const reactInlineImportPattern = /import\(['"](?:\.\.\/)+node_modules\/react['"]\)/g;
const reactDefaultPattern = /import \{ default as React \} from ['"]react['"];/g;
const inlineImportQuotePattern = /import\('([^']+)'\)/g;
const classValueTypeImportPattern = /import \{ ClassValue \} from ['"]clsx['"];/g;
const importBlockSpacingPattern =
  /((?:import [^\r\n]+;\r?\n)+)\r?\n(?=(?:export\s+)?(?:declare|interface|type|const|function|class|enum)|interface|type)/g;

const files = await collectDtsFiles(distDir);

await Promise.all(
  files.map(async (file) => {
    const source = await readFile(file, 'utf8');
    const normalized = source
      .replace(reactImportPattern, "from 'react'")
      .replace(reactInlineImportPattern, "import('react')")
      .replace(reactDefaultPattern, "import React from 'react';")
      .replace(inlineImportQuotePattern, 'import("$1")')
      .replace(classValueTypeImportPattern, "import { type ClassValue } from 'clsx';")
      .replace(importBlockSpacingPattern, '$1');

    if (normalized !== source) {
      await writeFile(file, normalized);
    }
  })
);
