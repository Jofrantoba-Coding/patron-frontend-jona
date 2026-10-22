import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

const EXACT_VERSION = /^\d+\.\d+\.\d+$/;

describe('S-CRUD-21 pinned dependencies', () => {
  it('pins jona-ui to exactly 1.5.0 with no range operator', () => {
    expect(pkg.dependencies['jona-ui']).toBe('1.5.0');
  });

  it('pins every dependency to an exact version', () => {
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    const names = Object.keys(all);
    expect(names).toContain('jona-ui');
    expect(names).toContain('@testing-library/user-event');
    const ranged = names.filter((name) => !EXACT_VERSION.test(all[name]));
    expect(ranged).toEqual([]);
  });
});
