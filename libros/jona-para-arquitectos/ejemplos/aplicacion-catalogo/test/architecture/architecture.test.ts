// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { checkArchitecture, sourceFiles, type RuleId } from './rules';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));
const fixture = (name: string) => fileURLToPath(new URL(`../fixtures/${name}/src`, import.meta.url));

describe('Arquitectura: FSD entre unidades, Clean/Hexagonal en el modelo, JONA dentro de cada unidad', () => {
  it('analiza el código de src/ (la prueba no pasa por no encontrar archivos)', () => {
    const files = sourceFiles(SRC);

    expect(files).toContain('entities/producto/model/Producto.ts');
    expect(files).toContain('features/producto-guardar/model/guardarProducto.ts');
    expect(files).toContain('widgets/catalogo/ui/UiCatalogo.tsx');
    expect(files).toHaveLength(36);
  });

  it('src/ cumple las siete reglas', () => {
    expect(checkArchitecture(SRC)).toEqual([]);
  });
});

/**
 * Cada árbol de test/fixtures contiene exactamente una violación: [árbol, regla que la detecta, archivo].
 * Las reglas 1 a 5 ya tienen sus árboles en ejemplos/web-fsd; aquí, la 2 y la 4 aplicadas a este
 * catálogo y las dos reglas nuevas.
 */
const CASES: Array<[string, RuleId, string]> = [
  ['funcionalidades-hermanas', 2, 'features/producto-listar/ui/UiListaProductos.tsx'],
  ['caso-de-uso-elige-adaptador', 4, 'features/producto-guardar/model/guardarProducto.ts'],
  ['dominio-con-react', 6, 'entities/producto/model/Producto.ts'],
  ['caso-de-uso-con-http', 6, 'features/producto-guardar/model/guardarProducto.ts'],
  ['modelo-dibuja', 7, 'features/producto-guardar/model/UiFormularioProductoImpl.ts'],
  ['ds-por-ruta-interna', 7, 'features/producto-listar/ui/UiListaProductosView.tsx'],
];

describe('Cada regla detecta lo que dice detectar', () => {
  it.each(CASES)('%s: la regla %i señala %s', (name, rule, file) => {
    const violations = checkArchitecture(fixture(name));

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ rule, file });
    expect(violations[0].message).not.toBe('');
  });
});
