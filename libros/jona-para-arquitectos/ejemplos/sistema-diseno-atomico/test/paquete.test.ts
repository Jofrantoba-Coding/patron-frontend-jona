// @vitest-environment node
/**
 * El paquete como lo ve un consumidor: Node lo carga por su nombre desde dist/, y una ruta
 * interna no publicada falla. Requiere `npm run build` (el ejecutor de ejemplos lo corre antes).
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

/** Ejecuta un módulo ES en Node desde la raíz del paquete: el nombre del paquete se resuelve a sí mismo. */
function enNode(codigo: string) {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', codigo], { cwd: RAIZ, encoding: 'utf8' });
  return { ok: r.status === 0, salida: r.stdout.trim(), error: r.stderr };
}

describe('el paquete compilado, cargado como lo haría un consumidor', () => {
  it('dist/ existe (si falla: npm run build)', () => {
    expect(existsSync(new URL('../dist/index.js', import.meta.url))).toBe(true);
  });

  it('Node carga @jona-libro/ds-atomico por su nombre y ve la superficie pública', () => {
    const r = enNode("const ds = await import('@jona-libro/ds-atomico'); console.log(Object.keys(ds).sort().join(','));");

    expect(r.error).toBe('');
    expect(r.salida.split(',')).toEqual([
      'JBUTTON_DEFAULTS', 'JButton', 'JCONFIRMDIALOG_DEFAULTS', 'JConfirmDialog', 'JFIELD_DEFAULTS', 'JField',
      'JHEADING_DEFAULTS', 'JHeading', 'JIMAGE_DEFAULTS', 'JINPUT_DEFAULTS', 'JImage', 'JInput', 'JLINK_DEFAULTS', 'JLink',
      'JPAGELAYOUT_DEFAULTS', 'JPageLayout', 'JSEARCHBOX_DEFAULTS', 'JSearchBox',
      'JTABLE_DEFAULTS', 'JTEXT_DEFAULTS', 'JTable', 'JText',
    ]);
  });

  it('una ruta interna no publicada no se puede importar (N4 a nivel de paquete)', () => {
    const r = enNode("await import('@jona-libro/ds-atomico/dist/organismos/jtable/JTableView.js');");

    expect(r.ok).toBe(false);
    expect(r.error).toContain('ERR_PACKAGE_PATH_NOT_EXPORTED');
  });
});
