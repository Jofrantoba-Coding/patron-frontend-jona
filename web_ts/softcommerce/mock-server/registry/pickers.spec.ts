import { describe, expect, it } from 'vitest';
import { REGISTRY } from './index.js';
import { PICKERS } from './pickers.js';
import { validateRegistry } from './schema.js';

/** The seven desktop dialogs of R-LKP-7, read from the Buscar* / FormBuscar* / Panel* method bodies and their table models. */
const NAMES = ['buscarTrabajador', 'panelCargarTrabajador', 'buscarCliente', 'formClienteBuscar', 'formBuscarVehiculo', 'buscarParametroProv', 'buscarItemConversion'];

const labels = (name: string) => PICKERS[name].filters.map((f: any) => f.label);
const headers = (name: string) => PICKERS[name].columns.map((c: any) => c.header);

describe('D2 the seven picker configs', () => {
  it('declares exactly the seven pickers, each with { title, source, columns, filters, pickLabel }', () => {
    expect(Object.keys(PICKERS)).toEqual(NAMES);
    for (const picker of Object.values(PICKERS) as any[]) {
      expect(Object.keys(picker)).toEqual(expect.arrayContaining(['title', 'source', 'columns', 'filters', 'pickLabel']));
      expect(typeof picker.title).toBe('string');
      expect(picker.columns.length).toBeGreaterThan(0);
      expect(picker.pickLabel).toBe('Agregar');
    }
  });

  it.each([
    ['buscarTrabajador', '', 'trabajadores', ['Código', 'R. Social', 'RUC/DNI'], ['DNI', 'COD.', 'NOMBRE', 'DIRECCION', 'TELEFONO', 'CELULAR', 'AREA', 'EMPRESA']],
    ['panelCargarTrabajador', 'Trabajador', 'trabajadores', ['Nombres', 'DNI', 'Direccion'], ['COD.', 'NOMBRE', 'DIRECCION', 'DNI', 'TELEFONO', 'CELULAR', 'PUNTO VENTA']],
    ['buscarCliente', 'Cliente', 'clientes', ['Código', 'Desc.', 'DNI/RUC', 'Clasificación', 'Direccion'], ['COD', 'RAZON SOCIAL', 'RUC/DNI', 'DIRECCION', 'AR', 'EX', 'CANT SUST']],
    ['formClienteBuscar', 'Buscar Cliente', 'clientes', ['Codigo', 'Desc.', 'RUC/DNI'], ['COD', 'RAZON SOCIAL', 'RUC/DNI', 'DIRECCION', 'AP', 'AR', 'EX', 'CANT_SUST', 'CONDICION PAGO', 'NUMERO DIAS']],
    ['formBuscarVehiculo', 'Buscar Vehiculo', 'vehiculos', ['Codigo', 'Transportista', 'Marca', 'RUC/DNI', 'Constancia Inscr', 'Placa', 'Modelo'], ['CODIGO', 'TRANSPORTE', 'DNI/RUC', 'PLACA', 'CONSTANCIA INSCRIPCION', 'MARCA', 'MODELO']],
    ['buscarParametroProv', 'Provisiones', 'parametros-prov', ['Código', 'Descripción'], ['CODIGO', 'DESC PARAMETRO', 'CUENTA', 'COMPRA', 'VENTA', 'TESORERIA', 'FONDO FIJO']],
    ['buscarItemConversion', 'Item a convertir', 'items', ['Código', 'Código Alt.', 'Desc.', 'Familia', 'SubFamilia', 'Marca'], ['COD', 'COD ALT', 'DESC', 'FAMILIA', 'SUB_FAMILIA', 'MARCA']],
  ])('%s keeps the desktop title, source, filter labels and column order', (name, title, source, filterLabels, columnHeaders) => {
    expect(PICKERS[name].title).toBe(title);
    expect(PICKERS[name].source).toBe(source);
    expect(labels(name)).toEqual(filterLabels);
    expect(headers(name)).toEqual(columnHeaders);
  });

  it('Refrescar exists where the desktop had it (R-LKP-5)', () => {
    expect(NAMES.filter((name) => PICKERS[name].refresh)).toEqual(['buscarTrabajador', 'formBuscarVehiculo', 'buscarParametroProv', 'buscarItemConversion']);
  });

  it('keeps the desktop input rules of each text filter (upper, digits, max length)', () => {
    const rules = (name: string) => PICKERS[name].filters.map((f: any) => [f.label, f.type, f.upper === true, f.digits === true, f.max]);
    expect(rules('buscarTrabajador')).toEqual([['Código', 'text', false, true, 10], ['R. Social', 'text', true, false, 255], ['RUC/DNI', 'text', false, true, 11]]);
    expect(rules('buscarParametroProv')).toEqual([['Código', 'text', false, true, 10], ['Descripción', 'text', true, false, 255]]);
    expect(rules('buscarItemConversion').slice(0, 3)).toEqual([['Código', 'text', false, true, 6], ['Código Alt.', 'text', false, true, 6], ['Desc.', 'text', true, false, 255]]);
  });

  it('BuscarItemConversion: SubFamilia depends on Familia and the three extras open at 0.0, 0.0 and 1.0 (R-LKP-7)', () => {
    const [, , , familia, subfamilia, marca] = PICKERS.buscarItemConversion.filters;
    expect([familia.type, subfamilia.type, marca.type]).toEqual(['select', 'select', 'select']);
    expect(subfamilia.dependsOn).toEqual({ field: familia.field, filterKey: 'id_familia' });
    expect(PICKERS.buscarItemConversion.extras!.map((e: any) => [e.label, e.type, e.default])).toEqual([
      ['VALOR DE CONVERSION', 'decimal', '0.0'], ['VALOR DE PAQUETE', 'decimal', '0.0'], ['VALOR DE ORIGEN', 'decimal', '1.0'],
    ]);
  });

  it('every text filter field is a search field of its picker', () => {
    for (const picker of Object.values(PICKERS) as any[]) {
      expect(picker.search).toEqual(picker.filters.filter((f: any) => f.type === 'text').map((f: any) => f.field));
    }
  });
});

/** Test-only entries for the expansion: the real sources arrive in later slices. */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion', { required: true })], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const trabajadores = entry('trabajadores', { idKey: 'id_trabajador', optionLabel: 'nombre', lookupFilters: { nombre: {} }, fields: [{ name: 'id_trabajador', kind: 'code', label: 'Código' }, text('nombre'), text('dni')] });
const lookup = (over: Record<string, any> = {}) => ({ name: 'id_trabajador', kind: 'lookup', label: 'Trabajador', picker: 'buscarTrabajador', ...over });
const citas = (field: Record<string, any>) => [trabajadores, entry('citas', { fields: [text('motivo'), field] })];
const resolved = (registry: ReturnType<typeof validateRegistry>) => registry.bySlug.get('citas').fields.find((f: any) => f.name === 'id_trabajador');

describe('a field naming a picker expands at load', () => {
  it('takes search, columns and filters from the picker and its source from the picker', () => {
    const field = resolved(validateRegistry(citas(lookup())));
    expect(field.search).toEqual(['id_trabajador', 'nombre', 'dni']);
    expect(field.columns).toBe(PICKERS.buscarTrabajador.columns);
    expect(field.filters).toBe(PICKERS.buscarTrabajador.filters);
    expect(field.source).toEqual({ catalog: 'trabajadores' });
    expect(field).toMatchObject({ pickLabel: 'Agregar', picker: 'buscarTrabajador' });
  });

  it('lets the field narrow the source with a static where, and keeps its own attributes', () => {
    const field = resolved(validateRegistry(citas(lookup({ source: { catalog: 'trabajadores', where: { dni: '1' } }, pickLabel: 'Elegir' }))));
    expect(field.source).toEqual({ catalog: 'trabajadores', where: { dni: '1' } });
    expect(field.pickLabel).toBe('Elegir');
  });

  it('fails at load for an unknown picker, naming the entry and the field', () => {
    expect(() => validateRegistry(citas(lookup({ picker: 'nope' })))).toThrow(/entry "citas" field "id_trabajador": unknown picker "nope"/);
  });

  it('fails when the field source is not the picker source', () => {
    expect(() => validateRegistry(citas(lookup({ source: { catalog: 'citas' } })))).toThrow(/field "id_trabajador": picker "buscarTrabajador" is over "trabajadores", not "citas"/);
  });

  it('fails when a picker search or filter field is missing from the source', () => {
    const sinDni = entry('trabajadores', { idKey: 'id_trabajador', optionLabel: 'nombre', fields: [{ name: 'id_trabajador', kind: 'code', label: 'Código' }, text('nombre')] });
    expect(() => validateRegistry([sinDni, entry('citas', { fields: [text('motivo'), lookup()] })])).toThrow(/field "id_trabajador": search names unknown field "dni" of "trabajadores"/);
  });
});

describe('a lookup with no desktop dialog declares the three inline (R-REG-13)', () => {
  const inline = (over: Record<string, any> = {}) => lookup({
    picker: undefined, source: { catalog: 'trabajadores' }, search: ['nombre'],
    columns: [{ key: 'nombre', header: 'Nombre' }], filters: [{ field: 'nombre', label: 'Nombre', type: 'text' }], ...over,
  });

  it('accepts search, columns and filters declared on the field', () => {
    expect(() => validateRegistry(citas(inline()))).not.toThrow();
  });

  it.each([['columns', /lookup needs columns/], ['filters', /lookup needs filters/]])('rejects a lookup without %s', (key, message) => {
    expect(() => validateRegistry(citas(inline({ [key]: undefined })))).toThrow(message);
  });

  it('rejects a filter over a field the source lacks, an unknown type, or a select without a source', () => {
    expect(() => validateRegistry(citas(inline({ filters: [{ field: 'nope', label: 'X', type: 'text' }] })))).toThrow(/filter names unknown field "nope" of "trabajadores"/);
    expect(() => validateRegistry(citas(inline({ filters: [{ field: 'nombre', label: 'X', type: 'date' }] })))).toThrow(/filter "nombre" has unknown type "date"/);
    expect(() => validateRegistry(citas(inline({ filters: [{ field: 'nombre', label: 'X', type: 'select' }] })))).toThrow(/filter "nombre" needs a source/);
  });

  it('a select filter must be a declared lookupFilters key of the source, so the list matches it exactly', () => {
    const select = [{ field: 'dni', label: 'X', type: 'select', source: 'trabajadores' }];
    expect(() => validateRegistry(citas(inline({ filters: select })))).toThrow(/select filter "dni" must be a declared lookupFilters key of "trabajadores"/);
  });

  it('accepts a select filter over a registered catalog and rejects one over an unknown catalog', () => {
    const select = (source: string) => inline({ filters: [{ field: 'nombre', label: 'X', type: 'select', source }] });
    expect(() => validateRegistry(citas(select('trabajadores')))).not.toThrow();
    expect(() => validateRegistry(citas(select('nope')))).toThrow(/filter "nombre" names unknown catalog "nope"/);
  });
});

/**
 * Pickers whose source arrives later are validated lazily (D2): once the source entry exists, every search, filter and column name must be one of
 * its fields or joins. `GAPS` lists what the source still lacks TODAY; the slice that adds the field must also remove it here (the test fails both ways).
 */
const GAPS: Record<string, string[]> = {
  buscarTrabajador: ['empresa'],
  panelCargarTrabajador: ['punto_venta'],
};
/** Select filters of registered sources that are not yet a declared `lookupFilters` key (the exact list match); none is left since W3-10. */
const SELECT_GAPS: Record<string, string[]> = {};
const LATER_SOURCES = ['items'];

describe('lazy consistency of every picker with its registered source', () => {
  const namesOf = (picker: any) => [...picker.search, ...picker.filters.map((f: any) => f.field), ...picker.columns.map((c: any) => c.key)];

  it('every picker source is registered or one of the sources that arrive later', () => {
    const unregistered = [...new Set(Object.values(PICKERS).map((p: any) => p.source))].filter((slug) => !REGISTRY.bySlug.has(slug));
    expect(unregistered.sort()).toEqual([...LATER_SOURCES].sort());
  });

  it.each(NAMES.filter((name) => REGISTRY.bySlug.has(PICKERS[name].source)))('%s only names fields of its source, except the documented gaps', (name) => {
    const source = REGISTRY.bySlug.get(PICKERS[name].source);
    const known = new Set([...source.fields.map((f: any) => f.name), ...(source.joins ?? []).map((j: any) => j.as), ...(source.aggregate ?? []).map((a: any) => a.as)]);
    const missing = [...new Set(namesOf(PICKERS[name]).filter((n) => !known.has(n)))].sort();
    expect(missing).toEqual(GAPS[name] ?? []);
  });

  it.each(NAMES.filter((name) => REGISTRY.bySlug.has(PICKERS[name].source)))('%s select filters are declared lookupFilters keys of the source, except the documented gaps', (name) => {
    const source = REGISTRY.bySlug.get(PICKERS[name].source);
    const undeclared = PICKERS[name].filters.filter((f: any) => f.type === 'select' && !Object.hasOwn(source.lookupFilters ?? {}, f.field)).map((f: any) => f.field).sort();
    expect(undeclared).toEqual(SELECT_GAPS[name] ?? []);
  });

  it('select filters point at registered catalogs (or sources that arrive later)', () => {
    for (const picker of Object.values(PICKERS) as any[]) {
      for (const filter of picker.filters.filter((f: any) => f.type === 'select')) {
        expect(REGISTRY.bySlug.has(filter.source) || LATER_SOURCES.includes(filter.source)).toBe(true);
      }
    }
  });
});
