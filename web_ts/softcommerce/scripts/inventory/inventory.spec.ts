import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildInventory, categorize, parseOverrides, scanClasses, toCsv, WAVE_RULES, waveFor, writeInventory } from './lib.mjs';
import { main } from './inventory.mjs';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';

let tmp = '';

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'inventory-'));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

/** Writes Latin-1 fixtures under `<tmp>/src` and returns that source root. */
function writeTree(files: Record<string, string>): string {
  const src = path.join(tmp, 'src');
  for (const [rel, content] of Object.entries(files)) {
    const file = path.join(src, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(content, 'latin1'));
  }
  return src;
}

const PKG = 'package com.x.view.catalogos;\n';

describe('scanClasses (header scanner)', () => {
  it('reads extends and implements from the header only', () => {
    const src = 'public class A<T extends Foo> extends B implements C, D<E> { }';
    expect(scanClasses(src)).toEqual([{ name: 'A', extends: 'B', implements: ['C', 'D'] }]);
  });

  it('does not attribute a later class extends to an earlier class', () => {
    const src = 'class First { }\nclass Second extends JHDialog { }';
    expect(scanClasses(src)).toEqual([
      { name: 'First', extends: null, implements: [] },
      { name: 'Second', extends: 'JHDialog', implements: [] },
    ]);
  });

  it('ignores class words inside comments, strings and char literals', () => {
    const src = '// class Ghost extends X {\n/* class Ghost2 extends X { */\nclass Real { String s = "class Ghost3 extends X {"; char c = \'{\'; }';
    expect(scanClasses(src).map((c) => c.name)).toEqual(['Real']);
  });
});

describe('buildInventory scanner rows', () => {
  it('S-INV-1 lists RegisterLocalidad extends JHDialog', () => {
    const src = writeTree({
      'com/x/view/catalogos/RegisterLocalidad.java': `${PKG}public class RegisterLocalidad extends JHDialog { }`,
    });
    const { rows } = buildInventory(src);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: 'RegisterLocalidad',
      path: 'com/x/view/catalogos/RegisterLocalidad.java',
      pkg: 'com.x.view.catalogos',
      base: 'JHDialog',
    });
  });

  it('S-INV-2 detects extends on the following line', () => {
    const src = writeTree({
      'com/x/view/catalogos/PanelTFX.java': `${PKG}public class PanelTFX\n    extends JHInternalFrame {\n}`,
    });
    const { rows } = buildInventory(src);
    expect(rows.map((r) => [r.name, r.base])).toEqual([['PanelTFX', 'JHInternalFrame']]);
  });

  it('emits only the file top-level class, without cross-attribution', () => {
    const src = writeTree({
      'com/x/view/catalogos/Outer.java': `${PKG}class Helper { }\npublic class Outer extends JDialog { class Inner extends JPanel { } }`,
    });
    const { rows } = buildInventory(src);
    expect(rows.map((r) => [r.name, r.base])).toEqual([['Outer', 'JDialog']]);
  });

  it('skips classes whose chain never reaches a Swing root', () => {
    const src = writeTree({
      'com/x/model/RnFoo.java': 'package com.x.model;\npublic class RnFoo extends BaseRn { }',
      'com/x/model/BaseRn.java': 'package com.x.model;\npublic class BaseRn { }',
      'com/x/view/FormA.java': 'package com.x.view;\npublic class FormA extends Mid { }',
      'com/x/view/Mid.java': 'package com.x.view;\npublic class Mid extends JPanel { }',
    });
    const { rows } = buildInventory(src);
    expect(rows.map((r) => r.name)).toEqual(['FormA', 'Mid']);
  });
});

describe('exclusions', () => {
  const names = (files: Record<string, string>) => buildInventory(writeTree(files)).rows.map((r) => r.name);
  const gui = (pkg: string, cls: string, base = 'JPanel') => `package ${pkg};\npublic class ${cls} extends ${base} { }`;

  it('S-INV-3 excludes the eight base classes but keeps their subclasses', () => {
    const bases = ['CDialog', 'JHDialog', 'JHInternalFrame', 'AbstractRegister', 'PanelControlView', 'ControlView', 'FrmPanel', 'CTable'];
    const files: Record<string, string> = { 'com/x/view/FormKept.java': gui('com.x.view', 'FormKept', 'JHDialog') };
    for (const b of bases) files[`com/x/shared/${b}.java`] = gui('com.x.shared', b);
    expect(names(files)).toEqual(['FormKept']);
  });

  it('S-INV-4 excludes PnlRenderer* under shared/util/render only', () => {
    expect(
      names({
        'com/x/shared/util/render/PnlRendererFoo.java': gui('com.x.shared.util.render', 'PnlRendererFoo'),
        'com/x/shared/util/render/OtherPanel.java': gui('com.x.shared.util.render', 'OtherPanel'),
        'com/x/view/PnlRendererBar.java': gui('com.x.view', 'PnlRendererBar'),
      }),
    ).toEqual(['OtherPanel', 'PnlRendererBar']);
  });

  it('S-INV-5 excludes view/tablemodel and view/conta/tablas', () => {
    expect(
      names({
        'com/x/view/tablemodel/TmFoo.java': gui('com.x.view.tablemodel', 'TmFoo'),
        'com/x/view/conta/tablas/TbFoo.java': gui('com.x.view.conta.tablas', 'TbFoo'),
        'com/x/view/conta/FormConta.java': gui('com.x.view.conta', 'FormConta'),
      }),
    ).toEqual(['FormConta']);
  });

  it('S-INV-6 excludes combo models by path, by name and by chain', () => {
    expect(
      names({
        'com/x/view/comboboxmodel/CbmA.java': gui('com.x.view.comboboxmodel', 'CbmA'),
        'com/x/view/ComboModelB.java': gui('com.x.view', 'ComboModelB'),
        'com/x/view/CbmC.java': gui('com.x.view', 'CbmC', 'MidModel'),
        'com/x/view/MidModel.java': 'package com.x.view;\npublic class MidModel extends JPanel implements AbstractListModel { }',
        'com/x/view/CbmD.java': 'package com.x.view;\npublic class CbmD extends JPanel implements ComboBoxModel { }',
        'com/x/view/FormE.java': gui('com.x.view', 'FormE'),
      }),
    ).toEqual(['FormE']);
  });
});

describe('category and wave', () => {
  it('S-INV-1 categorizes RegisterLocalidad as a register dialog and wave W1', () => {
    const src = writeTree({
      'com/x/view/catalogos/RegisterLocalidad.java': `${PKG}public class RegisterLocalidad extends JHDialog { }`,
    });
    expect(buildInventory(src).rows[0]).toMatchObject({ category: 'register dialog', wave: 'W1' });
  });

  it('S-INV-8 maps Buscar*, FormBuscar* and Form* names', () => {
    const files: Record<string, string> = {};
    for (const n of ['BuscarCliente', 'FormBuscarItem', 'FormVentas']) {
      files[`com/x/view/${n}.java`] = `package com.x.view;
public class ${n} extends JInternalFrame { }`;
    }
    const byName = Object.fromEntries(buildInventory(writeTree(files)).rows.map((r) => [r.name, r.category]));
    expect(byName).toEqual({
      BuscarCliente: 'search/lookup',
      FormBuscarItem: 'search/lookup',
      FormVentas: 'process/detail form',
    });
  });

  it('applies the category rules in order', () => {
    expect(categorize('PanelTFLocalidad', ['JHInternalFrame', 'JInternalFrame'])).toBe('list frame');
    expect(categorize('Algo', ['AbstractRegister', 'JDialog'])).toBe('register dialog');
    expect(categorize('RegisterX', ['JPanel'])).toBe('register dialog');
    expect(categorize('PanelTFBuscarX', ['JHInternalFrame'])).toBe('search/lookup');
    expect(categorize('FrmAlgo', ['JPanel'])).toBe('process/detail form');
    expect(categorize('Reporte', ['JInternalFrame'])).toBe('process/detail form');
    expect(categorize('PnlAlgo', ['JPanel'])).toBe('other');
  });

  it('first matching WAVE_RULES entry wins', () => {
    expect(WAVE_RULES.length).toBeGreaterThan(2);
    const wave = (name: string, pkg: string, category: string) => waveFor({ name, pkg, category });
    expect(wave('RegisterLocalidad', 'com.x.view.ventas', 'register dialog')).toBe('W1');
    expect(wave('RegisterPedido', 'com.x.view.ventas', 'register dialog')).toBe('W4');
    expect(wave('FormStock', 'com.x.view.inventario', 'process/detail form')).toBe('W5');
    expect(wave('FormAsiento', 'com.x.view.conta', 'process/detail form')).toBe('W6');
    expect(wave('FormPle', 'com.x.view.sunat', 'process/detail form')).toBe('W7');
    expect(wave('PanelTFMarca', 'com.x.view.catalogos', 'list frame')).toBe('W2');
    expect(wave('FormOtro', 'com.x.view.catalogos', 'process/detail form')).toBe('W3');
  });

  it.each([
    ['PnlPedido', 'other'],
    ['RegisterBoleta', 'register dialog'],
    ['PanelTFNotaCredito', 'list frame'],
    ['PnlCotizacionBuscar', 'search/lookup'],
    ['FormVentasProgramada', 'process/detail form'],
    ['FacturarServicioTransporte', 'process/detail form'],
    ['RegisterGuiaRemision', 'register dialog'],
    ['PnlReparto', 'other'],
  ])('sales transaction %s in a generic package is W4', (name, category) => {
    expect(waveFor({ name, pkg: 'com.x.view.formularios', category })).toBe('W4');
  });

  it.each([
    ['PanelTFPuntoVenta', 'com.x.view.formularios', 'list frame', 'W2'],
    ['RegisterTipoDocVenta', 'com.x.view.formularios', 'register dialog', 'W2'],
    ['RegisterMotivoNotaCredito', 'com.x.view.formularios', 'register dialog', 'W2'],
    ['PanelTFVendedor', 'com.x.view.formularios', 'list frame', 'W2'],
    ['FrmRetencionVenta', 'com.x.view.conta.formularios', 'process/detail form', 'W6'],
    ['RegisterFacturaCompraDirecta', 'com.x.view.compras.formularios', 'register dialog', 'W5'],
    ['RptVenta', 'com.x.reportfiles.reportes', 'process/detail form', 'W7'],
  ])('%s keeps its catalog or package wave', (name, pkg, category, expected) => {
    expect(waveFor({ name, pkg, category })).toBe(expected);
  });
});

describe('encoding and determinism', () => {
  const frame = (name: string, extra = '') => `package com.x.view;\n// ${extra}\npublic class ${name} extends JInternalFrame { }`;

  it('S-INV-7 keeps accented names intact: Latin-1 in, UTF-8 out', () => {
    const src = writeTree({ 'com/x/view/FormDescripción.java': frame('FormDescripción', 'Descripción') });
    const out = path.join(tmp, 'out.csv');
    writeInventory(src, out);
    const bytes = fs.readFileSync(out);
    expect(bytes.includes(Buffer.from('FormDescripción', 'utf8'))).toBe(true);
    expect(bytes.includes(Buffer.from([0xf3]))).toBe(false);
    expect(fs.readFileSync(out, 'utf8').split('\n')[1]).toContain('"FormDescripción","com/x/view/FormDescripción.java"');
  });

  it('S-INV-9 two runs over the same tree are byte-identical and path sorted', () => {
    const src = writeTree({
      'com/x/view/FormZeta.java': frame('FormZeta'),
      'com/x/view/FormAlfa.java': frame('FormAlfa'),
      'com/a/view/FormMedio.java': frame('FormMedio').replace('com.x', 'com.a'),
    });
    const first = path.join(tmp, 'one.csv');
    const second = path.join(tmp, 'two.csv');
    writeInventory(src, first);
    writeInventory(src, second);
    const bytes = fs.readFileSync(first);
    expect(bytes.equals(fs.readFileSync(second))).toBe(true);
    const names = bytes.toString('utf8').trimEnd().split('\n').slice(1).map((l) => l.split(',')[0]);
    expect(names).toEqual(['"FormMedio"', '"FormAlfa"', '"FormZeta"']);
  });

  it('quotes every field, doubles quotes and ends each line with LF', () => {
    const csv = toCsv([{ name: 'A', path: 'p,1.java', pkg: 'say "hi"', base: '', category: 'other', wave: 'W3' }]);
    expect(csv).toBe('"class","path","package","base","category","wave"\n"A","p,1.java","say ""hi""","","other","W3"\n');
  });
});

describe('wave overrides', () => {
  const cli = path.join(__dirname, 'inventory.mjs');
  const form = (pkg: string, name: string, base = 'JDialog') => `package ${pkg};\npublic class ${name} extends ${base} { }`;
  const mapFile = (text: string) => {
    const file = path.join(tmp, 'wave-overrides.json');
    fs.writeFileSync(file, text);
    return file;
  };
  const run = (...args: string[]) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });

  it('S-INV-13 an override beats the heuristic wave and the package rule', () => {
    const src = writeTree({
      'com/x/view/catalogos/CambiarEmpresa.java': form('com.x.view.catalogos', 'CambiarEmpresa'),
      'com/x/view/ventas/FormCaja.java': form('com.x.view.ventas', 'FormCaja'),
    });
    const heuristic = Object.fromEntries(buildInventory(src).rows.map((r) => [r.name, r.wave]));
    expect(heuristic).toEqual({ CambiarEmpresa: 'W3', FormCaja: 'W4' });
    const overridden = buildInventory(src, { overrides: { CambiarEmpresa: 'shell', FormCaja: 'W6' } });
    expect(Object.fromEntries(overridden.rows.map((r) => [r.name, r.wave]))).toEqual({ CambiarEmpresa: 'shell', FormCaja: 'W6' });
  });

  it('S-INV-13 waveFor checks the map before the heuristic rules', () => {
    expect(waveFor({ name: 'FormX', pkg: 'com.x.view.ventas', category: 'process/detail form' }, { FormX: 'W6' })).toBe('W6');
    expect(waveFor({ name: 'FormX', pkg: 'com.x.view.catalogos', category: 'process/detail form' }, { FormX: 'drop' })).toBe('drop');
  });

  it('S-INV-14 a class with no override keeps the heuristic wave', () => {
    const files = {
      'com/x/view/catalogos/FormOtro.java': form('com.x.view.catalogos', 'FormOtro'),
      'com/x/view/ventas/FormCaja.java': form('com.x.view.ventas', 'FormCaja'),
    };
    const src = writeTree(files);
    const heuristic = buildInventory(src).rows;
    const withMap = buildInventory(src, { overrides: { FormCaja: 'W6' } }).rows;
    expect(withMap.find((r) => r.name === 'FormOtro')).toEqual(heuristic.find((r) => r.name === 'FormOtro'));
    expect(waveFor({ name: 'FormOtro', pkg: 'com.x.view.catalogos', category: 'process/detail form' }, { FormCaja: 'W6' })).toBe('W3');
    expect(waveFor({ name: 'toString', pkg: 'com.x.view.catalogos', category: 'other' }, {})).toBe('W3');
  });

  it('R-INV-11 adding an unmapped class changes only its own row', () => {
    const base = { 'com/x/view/catalogos/CambiarEmpresa.java': form('com.x.view.catalogos', 'CambiarEmpresa') };
    const overrides = { CambiarEmpresa: 'shell' };
    const before = buildInventory(writeTree(base), { overrides }).rows;
    const after = buildInventory(
      writeTree({ ...base, 'com/x/view/catalogos/FormNueva.java': form('com.x.view.catalogos', 'FormNueva') }),
      { overrides },
    ).rows;
    expect(after.filter((r) => r.name !== 'FormNueva')).toEqual(before);
    expect(after.find((r) => r.name === 'FormNueva')?.wave).toBe('W3');
  });

  it('S-INV-15 an override naming a class the scan did not find aborts and writes no csv', () => {
    writeTree({ 'com/x/view/FormOk.java': form('com.x.view', 'FormOk') });
    const out = path.join(tmp, 'o.csv');
    const result = run(tmp, '--out', out, '--overrides', mapFile('{"NoSuchClass":"W2","FormOk":"W2"}'));
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('NoSuchClass');
    expect(result.stderr).not.toContain('FormOk');
    expect(fs.existsSync(out)).toBe(false);
  });

  it('S-INV-15 buildInventory throws naming every stale key', () => {
    const src = writeTree({ 'com/x/view/FormOk.java': form('com.x.view', 'FormOk') });
    expect(() => buildInventory(src, { overrides: { Ghost: 'W2', Phantom: 'drop' } })).toThrow(/Ghost[^]*Phantom/);
  });

  it.each([
    ['a duplicate key', '{"FormOk":"W2","FormOk":"W3"}', ['FormOk']],
    ['the value W9', '{"FormOk":"W9"}', ['FormOk', 'W9']],
    ['the value done', '{"FormOk":"done"}', ['FormOk', 'done']],
    ['a non-string value', '{"FormOk":3}', ['FormOk']],
    ['a non-object map', '["FormOk"]', ['object']],
    ['malformed json', '{"FormOk":', ['JSON']],
  ])('S-INV-16 %s exits non-zero naming the offender and writes no csv', (_label, text, needles) => {
    writeTree({ 'com/x/view/FormOk.java': form('com.x.view', 'FormOk') });
    const out = path.join(tmp, 'o.csv');
    const result = run(tmp, '--out', out, '--overrides', mapFile(text));
    expect(result.status).not.toBe(0);
    for (const needle of needles) expect(result.stderr).toContain(needle);
    expect(fs.existsSync(out)).toBe(false);
  });

  it('S-INV-16 parseOverrides reports every offender at once and accepts the allowed values', () => {
    const allowed = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'shell', 'infra', 'drop'];
    const ok = Object.fromEntries(allowed.map((v, i) => [`Class${i}`, v]));
    expect(parseOverrides(JSON.stringify(ok))).toEqual(ok);
    expect(() => parseOverrides('{"A":"W9","B":"done"}')).toThrow(/"A".*W9[^]*"B".*done/);
    expect(() => parseOverrides('{"A":"W2","A":"W3"}')).toThrow(/duplicate[^]*"A"/);
  });

  it('S-INV-20 two runs with the map are byte-identical; S-INV-21 the map file is not rewritten', () => {
    writeTree({ 'com/x/view/FormOk.java': form('com.x.view', 'FormOk'), 'com/x/view/CambiarEmpresa.java': form('com.x.view', 'CambiarEmpresa') });
    const map = mapFile('{"CambiarEmpresa":"shell"}');
    const mapBefore = fs.readFileSync(map);
    const one = path.join(tmp, 'one.csv');
    const two = path.join(tmp, 'two.csv');
    expect(run(tmp, '--out', one, '--overrides', map).status).toBe(0);
    expect(run(tmp, '--out', two, '--overrides', map).status).toBe(0);
    expect(fs.readFileSync(one).equals(fs.readFileSync(two))).toBe(true);
    expect(fs.readFileSync(one, 'utf8')).toContain('"CambiarEmpresa"');
    expect(fs.readFileSync(one, 'utf8').split('\n')[0]).toBe('"class","path","package","base","category","wave"');
    expect(fs.readFileSync(map).equals(mapBefore)).toBe(true);
  });
});

describe('cli', () => {
  const cli = path.join(__dirname, 'inventory.mjs');
  const FORM = 'package com.x.view;\npublic class FormOk extends JInternalFrame { }';
  /** The committed map names real classes; fixture trees run with an empty one. */
  const emptyMap = () => {
    const file = path.join(tmp, 'empty-overrides.json');
    fs.writeFileSync(file, '{}');
    return file;
  };

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

  it('S-INV-10 aborts with a non-zero exit naming the missing path', () => {
    const missing = path.join(tmp, 'nope');
    const run = spawnSync(process.execPath, [cli, missing, '--out', path.join(tmp, 'o.csv')], { encoding: 'utf8' });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain(missing);
    expect(fs.existsSync(path.join(tmp, 'o.csv'))).toBe(false);
  });

  it('exits non-zero with usage when the root argument is missing', () => {
    const run = spawnSync(process.execPath, [cli], { encoding: 'utf8' });
    expect(run.status).toBe(2);
    expect(run.stderr).toContain('usage');
  });

  it('S-INV-11 reports an unreadable file on stderr, skips it and writes the rest', () => {
    writeTree({ 'com/x/view/FormOk.java': FORM, 'com/x/view/FormBad.java': FORM.replace('FormOk', 'FormBad') });
    const out = path.join(tmp, 'o.csv');
    const errors: string[] = [];
    const code = main([tmp, '--out', out, '--overrides', emptyMap()], {
      stderr: (m: string) => errors.push(m),
      readFile: (file: string) => {
        if (file.endsWith('FormBad.java')) throw new Error('EACCES: denied');
        return fs.readFileSync(file);
      },
    });
    expect(code).toBe(0);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('FormBad.java');
    expect(errors[0]).toContain('EACCES');
    const lines = fs.readFileSync(out, 'utf8').trimEnd().split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain('"FormOk"');
  });

  it('accepts the root alone (default output) and --out before the root', () => {
    writeTree({ 'com/x/view/FormOk.java': FORM });
    const fallback = path.join(tmp, 'default.csv');
    expect(main([tmp, '--overrides', emptyMap()], { defaultOut: fallback })).toBe(0);
    const explicit = path.join(tmp, 'explicit.csv');
    expect(main(['--out', explicit, tmp, '--overrides', emptyMap()], { defaultOut: fallback })).toBe(0);
    expect(fs.readFileSync(fallback, 'utf8')).toContain('"FormOk"');
    expect(fs.readFileSync(explicit, 'utf8')).toBe(fs.readFileSync(fallback, 'utf8'));
  });

  it('S-INV-12 leaves the Java tree untouched (hash before and after)', () => {
    writeTree({ 'com/x/view/FormOk.java': FORM });
    const java = path.join(tmp, 'src');
    const before = hashTree(java);
    const out = path.join(tmp, 'o.csv');
    const run = spawnSync(process.execPath, [cli, tmp, '--out', out, '--overrides', emptyMap()], { encoding: 'utf8' });
    expect(run.status).toBe(0);
    expect(fs.readFileSync(out, 'utf8')).toContain('"FormOk"');
    expect(hashTree(java)).toBe(before);
  });
});
