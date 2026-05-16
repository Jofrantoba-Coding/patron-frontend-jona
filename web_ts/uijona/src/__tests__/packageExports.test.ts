import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  exports: Record<string, unknown>;
};

describe('package exports', () => {
  it('exposes direct subpath imports for every public component family entry', () => {
    const indexSource = readFileSync(resolve(process.cwd(), 'src/index.ts'), 'utf8');
    const expectedSubpaths = Array.from(indexSource.matchAll(/export \* from '\.\/([^']+)'/g))
      .map(([, subpath]) => `./${subpath}`);

    expectedSubpaths.forEach((subpath) => {
      expect(packageJson.exports).toHaveProperty(subpath);
    });
  });

  it('does not expose component names removed from the atom layer', () => {
    expect(packageJson.exports).not.toHaveProperty('./atoms/EyebrowAtom');
    expect(packageJson.exports).not.toHaveProperty('./atoms/SectionShellAtom');
    expect(packageJson.exports).not.toHaveProperty('./atoms/RatingAtom');
    expect(packageJson.exports).not.toHaveProperty('./atoms/ToastAtom');
  });
});
