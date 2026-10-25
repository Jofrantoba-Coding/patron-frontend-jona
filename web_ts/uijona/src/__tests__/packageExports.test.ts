import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import ts from 'typescript';

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
    expect(packageJson.exports).not.toHaveProperty('./atoms/JEyebrow');
    expect(packageJson.exports).not.toHaveProperty('./atoms/JSectionShell');
    expect(packageJson.exports).not.toHaveProperty('./atoms/JRating');
    expect(packageJson.exports).not.toHaveProperty('./atoms/JToast');
  });

  it('does not expose legacy component subpaths without the J prefix', () => {
    const exportSubpaths = Object.keys(packageJson.exports);
    const legacyLayerNames = exportSubpaths.filter((subpath) =>
      /(?:Atom|Molecule|Organism|UiHome)/.test(subpath),
    );
    const publicComponentSubpaths = exportSubpaths.filter((subpath) =>
      /^\.\/(?:atoms|molecules|layouts|organisms|pages)\//.test(subpath),
    );
    const unprefixedComponents = publicComponentSubpaths.filter((subpath) =>
      !/^\.\/(?:atoms|molecules|layouts|organisms|pages)\/J[A-Z]/.test(subpath),
    );

    expect(legacyLayerNames).toEqual([]);
    expect(unprefixedComponents).toEqual([]);
  });

  it('S-FND-1: declares the CSS files as side effects so bundlers keep the stylesheet import', () => {
    const { sideEffects } = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
      sideEffects: unknown;
    };
    const globToRegExp = (glob: string): RegExp =>
      new RegExp(
        `^${glob
          .replace(/^\.\//, '')
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .split('**/')
          .map((part) => part.replace(/\*/g, '[^/]*'))
          .join('(?:.*/)?')}$`,
      );
    const isSideEffect = (file: string): boolean =>
      Array.isArray(sideEffects) && sideEffects.some((glob: string) => globToRegExp(glob).test(file));

    expect(Array.isArray(sideEffects)).toBe(true);
    expect(isSideEffect('dist/index.css')).toBe(true);
    expect(isSideEffect('dist/theme/tokens.css')).toBe(true);
    expect(isSideEffect('dist/index.js')).toBe(false);
  });

  it('keeps test-only sources out of the declaration build', () => {
    const configPath = resolve(process.cwd(), 'tsconfig.build.json');
    const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
    const { fileNames } = ts.parseJsonConfigFileContent(config, ts.sys, process.cwd());
    const testOnly = fileNames
      .map((file) => relative(process.cwd(), file).replace(/\\/g, '/'))
      .filter((file) => /^src\/(?:test|__tests__)\//.test(file));

    expect(testOnly).toEqual([]);
  });

  it('R-FND-8: exposes every 1.6.0 component and hook from the root entry and a subpath', () => {
    const indexSource = readFileSync(resolve(process.cwd(), 'src/index.ts'), 'utf8');
    const SUBPATHS_160 = [
      'molecules/JField',
      'layouts/JFieldGrid',
      'molecules/JFormSection',
      'molecules/JErrorSummary',
      'hooks/useConfirm',
    ];

    SUBPATHS_160.forEach((subpath) => {
      expect(indexSource).toContain(`export * from './${subpath}';`);
      expect(packageJson.exports[`./${subpath}`]).toEqual({
        import: `./dist/${subpath}.js`,
        require: `./dist/${subpath}.cjs`,
        types: `./dist/${subpath}.d.ts`,
      });
    });
  });

  it('R-FND-1, R-FND-5: exposes the opt-in base stylesheet next to index.css', () => {
    expect(packageJson.exports['./base.css']).toBe('./dist/base.css');
    expect(packageJson.exports['./index.css']).toBe('./dist/index.css');
  });
});
