// @vitest-environment node
/**
 * La cadena de suministro, en lo que se puede comprobar sin red: versiones exactas, un lockfile
 * que npm ci pueda seguir, y la lista corta de dependencias de ejecución. La auditoría
 * de vulnerabilidades (npm audit) necesita el registro, y va en el pipeline, no aquí.
 */
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const leer = (archivo: string) => JSON.parse(readFileSync(new URL(`../${archivo}`, import.meta.url), 'utf8')) as Record<string, unknown>;

describe('las dependencias', () => {
  it('cada versión de package.json es exacta: ni ^, ni ~, ni rangos, ni latest', () => {
    const paquete = leer('package.json') as { dependencies: Record<string, string>; devDependencies: Record<string, string> };
    const versiones = Object.entries({ ...paquete.dependencies, ...paquete.devDependencies }).filter(([, version]) => !version.startsWith('file:'));

    expect(versiones.length).toBeGreaterThan(0);
    expect(versiones.filter(([, version]) => !/^\d+\.\d+\.\d+$/.test(version))).toEqual([]);
  });

  it('hay un package-lock.json que coincide con package.json en las dependencias directas', () => {
    expect(existsSync(new URL('../package-lock.json', import.meta.url))).toBe(true);
    const paquete = leer('package.json') as { dependencies: Record<string, string>; devDependencies: Record<string, string> };
    const raiz = (leer('package-lock.json') as { packages: Record<string, { dependencies: Record<string, string>; devDependencies: Record<string, string> }> }).packages[''];

    expect({ ...raiz.dependencies, ...raiz.devDependencies }).toEqual({ ...paquete.dependencies, ...paquete.devDependencies });
  });

  it('solo React, react-dom y el sistema de diseño son dependencias de ejecución; las demás son herramientas de compilación y prueba', () => {
    const paquete = leer('package.json') as { dependencies: Record<string, string> };

    expect(Object.keys(paquete.dependencies).sort()).toEqual(['@jona-libro/ds-atomico', 'react', 'react-dom']);
  });
});
