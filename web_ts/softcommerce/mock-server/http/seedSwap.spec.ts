import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { useTestServer } from './test-server.js';

const SEED_DIR = fileURLToPath(new URL('../data', import.meta.url));
const OTHER_MENU = [
  { id_menu: 900, id_menu_padre: null, menu_item: 'S', descripcion: 'Only Item', nombre: 'mnOnly' },
];

const tempDir = mkdtempSync(join(tmpdir(), 'softcommerce-seed-'));
cpSync(SEED_DIR, tempDir, { recursive: true });
writeFileSync(join(tempDir, 'menu.json'), JSON.stringify(OTHER_MENU));
afterAll(() => rmSync(tempDir, { recursive: true, force: true }));

describe('S-MOCK-13 seed isolation', () => {
  const api = useTestServer({ dataDir: tempDir });

  it('serves a replaced menu.json with no server code change', async () => {
    const res = await api.call('GET', '/menu', { tenant: 'demo' });
    expect(res.body.items).toEqual(OTHER_MENU);
  });

  it('keeps every other seed file from the same directory', async () => {
    const res = await api.call('GET', '/auth/session-options');
    expect(res.body.items.length).toBeGreaterThan(0);
  });
});

describe('seed loading failure', () => {
  it('names the missing seed file', async () => {
    const { loadSeed } = await import('./loadSeed.js');
    expect(() => loadSeed(join(tempDir, 'missing'))).toThrow(/users\.json/);
  });
});
