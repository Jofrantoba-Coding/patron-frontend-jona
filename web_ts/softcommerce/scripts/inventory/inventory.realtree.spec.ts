import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildInventory, loadOverrides, toCsv } from './lib.mjs';

/**
 * R-INV-9, R-INV-10, R-INV-11: the committed inventory and override map against the real desktop class set.
 * The committed-file checks always run; the checks that regenerate from the Java tree need the desktop
 * sources (a git submodule in a fresh clone) and run when `desktop_java/softcommerce-desktop/src` exists
 * or `SOFTCOMMERCE_DESKTOP_ROOT` points at the desktop root.
 */
const HERE = __dirname;
const MAP_FILE = path.join(HERE, 'wave-overrides.json');
const CSV_FILE = path.join(HERE, 'inventory.csv');
const DESKTOP_ROOT = process.env.SOFTCOMMERCE_DESKTOP_ROOT ?? path.resolve(HERE, '../../../../desktop_java/softcommerce-desktop');
const SRC_ROOT = path.join(DESKTOP_ROOT, 'src');
const hasTree = fs.existsSync(SRC_ROOT);

const EXPECTED: Record<string, string[]> = {
  infra: ['JHInternal', 'JHInternalDialog', 'PanelControlRegister', 'PanelRowSelection', 'ProgressBarSystem', 'RendererCheckBox', 'StateBarSystem'],
  drop: ['ImagePanel', 'ImagePreview', 'TimeSerieResumen', 'CambiarCondicionPago', 'ConexionBaseDatos', 'MainFrameTest'],
  shell: ['CambiarEmpresa', 'CambiarPeriodo', 'Main', 'UiLogin', 'UiLoginImpl'],
  W2: ['PnlMarcaVehiculo', 'PnlModeloVehiculo', 'PnlTipoTrabajador', 'PnlTurno', 'PnlUbicacion', 'PnlVehiculo'],
  W4: ['PnlLiquidacion', 'PnlLiquidacionRegistro', 'PnlCierreProdDespachar', 'PnlConsultaProdDespachar', 'PanelDiferenciaPrecio', 'FormConversion', 'FormConversionVarios', 'FormAutorizar', 'FormDVRegularEstado'],
  W5: ['PnlRepKardex', 'PnlConsultaMovimiento', 'PnlDocumentoCosteo', 'PnlMostrarTipoMovimientosFormula', 'ActualizarAlmacenes', 'PnlActualizarAlmacenes', 'JDSeleccionaAlmacen', 'FormLoteMovimiento', 'PanelFEDesactivarItemAlm'],
  W6: ['PnlCancClienteGroup', 'PnlCancProvGroup', 'FrmCambiarFechaDoc'],
  // R-INV-9 [INFERRED] names without package: the scanned Libro classes carry the Pnl prefix.
  W7: ['PnlRepLibroCaja', 'PnlRepLibroCompras', 'PnlRepLibroDiario', 'PnlRepLibroDiarioSimp', 'PnlRepLibroMayor', 'PnlRepLibroPercepcion'],
};

const WAVE3 = [
  'FormClienteDireccion', 'FormClienteContacto', 'FormClienteCuenta', 'FormClienteCredito',
  'FormDireccionProveedor', 'FormConfigPadronProveedor', 'FormPanelConfigPadronProveedor',
  'FormItemCaracteristica', 'FormItemConfig', 'FormItemConfigDscto', 'FormItemAlmacen', 'FormItemConfigCuenta', 'FormItemPercepcion',
  'FormAnexoActivacion', 'FormAnexoPadron',
  'FormMenuPerfilArbol', 'FormMenuPerfilPermiso', 'FormUA', 'FormPanelUA',
  'PanelCargarTrabajador',
  'FormAccionSocio', 'FormAccionSocioAgregar', 'FormAccionPrecioAgregar',
];

const overrides = loadOverrides(MAP_FILE);
const csvText = () => fs.readFileSync(CSV_FILE, 'utf8').replaceAll('\r\n', '\n');
const csvRows = () =>
  csvText()
    .trimEnd()
    .split('\n')
    .slice(1)
    .map((line) => {
      const [name, , , , , wave] = line.slice(1, -1).split('","');
      return { name, wave };
    });
const classesWith = (wave: string) => csvRows().filter((r) => r.wave === wave).map((r) => r.name).sort();

describe('committed override map (R-INV-9)', () => {
  it('holds exactly the 51 reassigned classes with their mapped values', () => {
    const expected = Object.fromEntries(Object.entries(EXPECTED).flatMap(([wave, names]) => names.map((n) => [n, wave])));
    expect(Object.keys(expected)).toHaveLength(51);
    expect(overrides).toEqual(expected);
  });

  it('never overrides a Wave 3 class', () => {
    for (const name of WAVE3) expect(overrides).not.toHaveProperty(name);
  });
});

describe('committed inventory.csv (R-INV-11)', () => {
  it('S-INV-17 puts the dead classes in drop, the infrastructure widgets in infra and the shell classes in shell', () => {
    expect(classesWith('drop')).toEqual([...EXPECTED.drop].sort());
    expect(classesWith('infra')).toEqual([...EXPECTED.infra].sort());
    expect(classesWith('shell')).toEqual([...EXPECTED.shell].sort());
  });

  it('S-INV-18 reassigns the delivered panels and the later waves', () => {
    expect(classesWith('W2').filter((n) => EXPECTED.W2.includes(n))).toEqual([...EXPECTED.W2].sort());
    for (const wave of ['W4', 'W5', 'W6', 'W7']) {
      const rows = csvRows().filter((r) => EXPECTED[wave].includes(r.name));
      expect(rows.map((r) => r.name).sort(), wave).toEqual([...EXPECTED[wave]].sort());
      expect(new Set(rows.map((r) => r.wave)), wave).toEqual(new Set([wave]));
    }
    expect(EXPECTED.W4).toHaveLength(9);
    expect(EXPECTED.W5).toHaveLength(9);
    expect(EXPECTED.W6).toHaveLength(3);
    expect(EXPECTED.W7).toHaveLength(6);
  });

  it('every overridden class has its mapped value in the csv', () => {
    const byName = new Map(csvRows().map((r) => [r.name, r.wave]));
    for (const [name, wave] of Object.entries(overrides)) expect(byName.get(name), name).toBe(wave);
  });

  it('S-INV-19 the W3 rows are exactly the 23 Wave 3 classes', () => {
    expect(classesWith('W3')).toEqual([...WAVE3].sort());
    expect(WAVE3).toHaveLength(23);
  });

  it('S-INV-20 keeps the header and the row order', () => {
    const lines = csvText().split('\n');
    expect(lines[0]).toBe('"class","path","package","base","category","wave"');
  });
});

describe.skipIf(!hasTree)('regenerated from the desktop tree', () => {
  let tmp = '';
  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'inventory-real-'));
  });
  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  /** Hash of every path and content under a directory, in sorted order. */
  function hashTree(dir: string): string {
    const hash = crypto.createHash('sha256');
    const walk = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const full = path.join(d, e.name);
        hash.update(full);
        if (e.isDirectory()) walk(full);
        else hash.update(fs.readFileSync(full));
      }
    };
    walk(dir);
    return hash.digest('hex');
  }

  it('S-INV-19 the regenerated W3 set is exactly the 23 classes and matches the committed csv', () => {
    const { rows } = buildInventory(SRC_ROOT, { overrides });
    expect(rows.filter((r) => r.wave === 'W3').map((r) => r.name).sort()).toEqual([...WAVE3].sort());
    expect(toCsv(rows)).toBe(csvText());
  });

  it('S-INV-20 and S-INV-21 the cli applies the committed map by default, is byte-identical twice and read-only', () => {
    const cli = path.join(HERE, 'inventory.mjs');
    const treeBefore = hashTree(SRC_ROOT);
    const mapBefore = fs.readFileSync(MAP_FILE);
    const one = path.join(tmp, 'one.csv');
    const two = path.join(tmp, 'two.csv');
    for (const out of [one, two]) {
      const run = spawnSync(process.execPath, [cli, DESKTOP_ROOT, '--out', out], { encoding: 'utf8' });
      expect(run.stderr).toBe('');
      expect(run.status).toBe(0);
    }
    expect(fs.readFileSync(one).equals(fs.readFileSync(two))).toBe(true);
    expect(fs.readFileSync(one, 'utf8')).toBe(csvText());
    expect(hashTree(SRC_ROOT)).toBe(treeBefore);
    expect(fs.readFileSync(MAP_FILE).equals(mapBefore)).toBe(true);
  });
});
