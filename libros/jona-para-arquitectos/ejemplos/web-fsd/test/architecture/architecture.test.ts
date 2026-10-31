// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { checkArchitecture, sourceFiles, type RuleId } from './rules';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));
const fixture = (name: string) => fileURLToPath(new URL(`../fixtures/${name}/src`, import.meta.url));

describe('Arquitectura: FSD entre unidades, JONA dentro de cada unidad', () => {
  it('analiza el código de src/ (la prueba no pasa por no encontrar archivos)', () => {
    const files = sourceFiles(SRC);

    expect(files).toContain('features/auth-login/index.ts');
    expect(files).toContain('features/auth-login/model/UiLoginImpl.ts');
    expect(files).toContain('shared/ui/jbutton/JButtonView.tsx');
  });

  it('src/ cumple las cinco reglas', () => {
    expect(checkArchitecture(SRC)).toEqual([]);
  });
});

/** Cada árbol de test/fixtures contiene exactamente una violación: [árbol, regla que la detecta, archivo]. */
const CASES: Array<[string, RuleId, string]> = [
  ['layer-goes-up', 1, 'entities/session/model/types.ts'],
  ['sibling-slices', 2, 'features/auth-logout/ui/UiLogout.tsx'],
  ['deep-import', 3, 'pages/login/ui/LoginPage.tsx'],
  ['wide-public-api', 3, 'features/auth-login/index.ts'],
  ['model-imports-api', 4, 'features/auth-login/model/UiLoginImpl.ts'],
  ['ui-imports-api', 4, 'features/auth-login/ui/UiLogin.tsx'],
  ['api-imports-ui', 4, 'features/auth-login/api/createAuthServiceHttp.ts'],
  ['view-imports-impl', 4, 'features/auth-login/ui/UiLoginView.tsx'],
  ['adapter-outside-app', 4, 'pages/login/ui/LoginPage.tsx'],
  ['contract-with-function', 5, 'features/auth-login/model/InterUiLogin.ts'],
  ['defaults-with-function', 5, 'shared/ui/jbutton/InterJButton.ts'],
];

describe('Cada regla detecta lo que dice detectar (una regla que nunca falla no prueba nada)', () => {
  it('toda regla tiene al menos un árbol con una violación', () => {
    expect(new Set(CASES.map(([, rule]) => rule))).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it.each(CASES)('%s: la regla %i señala %s', (name, rule, file) => {
    const violations = checkArchitecture(fixture(name));

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ rule, file });
    expect(violations[0].message).not.toBe('');
  });
});
