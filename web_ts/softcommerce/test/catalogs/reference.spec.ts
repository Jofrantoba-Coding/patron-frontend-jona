import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadSeed } from '../../mock-server/http/loadSeed.js';
import { useTestServer } from '../../mock-server/http/test-server';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { toCatalogConfig } from '../../src/catalogs/registry';
import { createCatalogServiceHttp } from '../../src/services/CatalogServiceHttp';
import { createLookupServiceHttp } from '../../src/services/LookupServiceHttp';
import { createHttpClient } from '../../src/services/httpClient';
import { createAppServicesMock } from '../../src/services/mock/AppServicesMock';
import { describeRegistryContract } from './registryContract';
import { ENTITIES, REFERENCE_CASES, referenceEntries } from './reference.cases';

const session = () => ({ tenantId: 'demo' });

/** R-REF-4 as read from the `Register*.java` documents: `[max, uppercased]` per slug.field. */
const DESKTOP: Record<string, [number, boolean]> = {
  'aduanas.descripcion': [100, false],
  'colores.descripcion': [100, true],
  'estados-documento.descripcion': [100, true],
  'laboratorios.descripcion': [100, true],
  'laboratorios.pais': [100, true],
  'marcas.descripcion': [100, true],
  'nacionalidades.descripcion': [100, true],
  'motivos-traslado.descripcion': [100, true],
  'motivos-traslado.abrev': [100, true],
  'clasif-clientes.descripcion': [100, true],
  'clasif-inventarios.descripcion': [100, true],
  'clasif-inventarios.abrev': [100, true],
  'tamanos.descripcion': [100, true],
  'tipos-anexo.descripcion': [100, true],
  'tipos-anexo.abreviatura': [100, true],
  'tipos-descuento.descripcion': [100, true],
  'tipos-descuento.abrev': [5, true],
  'condiciones-pago.descripcion': [255, true],
  'tipos-trabajador.descripcion': [100, true],
  'tipos-trabajador.abreviatura': [5, true],
  'marcas-vehiculo.descripcion': [100, true],
  'motivos-descuento.descripcion': [100, true],
  'motivos-descuento.abrev': [5, true],
  'motivos-nc.descripcion': [100, true],
  'tipos-trabajador-perfil.descripcion': [100, true],
  'familias.descripcion': [100, true],
  'modelos-vehiculo.descripcion': [100, true],
  'subfamilias.descripcion': [100, true],
  'promociones.descripcion': [100, true],
  'almacenes.descripcion': [100, true],
  'almacenes.direccion': [100, true],
  'zonas.descripcion': [100, true],
  // RegisterCorrelativo: formatJTextFieldSerie (UpperCaseNumberDocument(4)), UpperCaseNumberDocument(50) for the ticket fields.
  'correlativos.serie': [4, true],
  'correlativos.nro_autorizacion': [50, true],
  'correlativos.codigo_maquina': [50, true],
  // RegisterUbicacion: UpperCaseNumberDocument(50).
  'ubicaciones.descripcion': [50, true],
  // RegisterTipoMovInventario and RegisterUnidadMedida: UpperCaseNumberDocument(100) on every text.
  'tipos-mov-inventario.descripcion': [100, true],
  'tipos-mov-inventario.abrev': [100, true],
  'unidades-medida.descripcion': [100, true],
  'unidades-medida.abreviatura': [100, true],
  // RegisterVehiculo: UpperCaseNumberDocument(30) on the placa and the constancia.
  'vehiculos.placa': [30, true],
  'vehiculos.constancia_inscripcion': [30, true],
};

/** Integer fields as read from the desktop (IntegerDocument digits, focusLost pad, isRegisterValid range): `[digits, padLeft, range]`. */
const INTEGERS: Record<string, [number, boolean, { min?: number; max?: number } | undefined]> = {
  'condiciones-pago.dias_pago': [2, false, undefined],
  'turnos.hora': [2, true, { min: 0, max: 12 }],
  'turnos.minuto': [2, true, { min: 0, max: 59 }],
  // IntegerDocument(10), focusLost pads to ten digits.
  'correlativos.correlativo': [10, true, undefined],
  // IntegerDocument(10): digits only, no pad, any value.
  'vehiculos.peso': [10, false, undefined],
};

/** Code width per slug: string ids pad to three digits (PanelTF focusLost "000"; clasif-inventarios is inferred), integer beans print unpadded. */
const CODE_WIDTH: Record<string, number> = {
  'motivos-traslado': 3, 'clasif-clientes': 0, 'clasif-inventarios': 3, tamanos: 3, 'tipos-anexo': 3, 'tipos-descuento': 0,
  // String ids with no pad evidence in the desktop are inferred as 3 (flagged for W6); the Turno id is an int.
  'condiciones-pago': 3, 'tipos-trabajador': 3, 'marcas-vehiculo': 3, turnos: 0,
  // The motivo de descuento and perfil ids are int beans; the motivo de nota de credito pads to three (PanelTFMotivoNC focusLost "000").
  'motivos-descuento': 0, 'motivos-nc': 3, 'tipos-trabajador-perfil': 0,
  // PanelTFFamilia pads to three; the modelo id has no pad evidence (inferred, flagged for W6).
  familias: 3, 'modelos-vehiculo': 3,
  // PanelTFSubFamilia pads the code to three ("000" + id).
  subfamilias: 3,
  // The tipo de cambio id is a string with no pad evidence (inferred 3, flagged for W6); the promocion id is an int.
  'tipos-cambio': 3, promociones: 0,
  // The almacen id is a string with no pad evidence (inferred 3, flagged for W6); the zona id is an int bean.
  almacenes: 3, zonas: 0,
  // PanelTFCorrelativo.focusLost pads the code filter to five digits ("00000" + code).
  correlativos: 5,
  // The ubicacion id is an int bean (Util.getNumberInteger).
  ubicaciones: 0,
  // The tipo de movimiento ids are the three-digit TipoMovInventarioEnum codes; the unidad id is a string with no pad evidence (inferred 3, flagged for W6).
  'tipos-mov-inventario': 3, 'unidades-medida': 3,
  // The vehiculo id is a string with no pad evidence (inferred 3, flagged for W6).
  vehiculos: 3,
  // PanelTFUsuarioCorrelativo.focusLost pads the code filter to five digits ("00000" + code).
  'usuario-correlativos': 5,
  // The zona distancia id is an int bean (Integer.parseInt(txt_Codigo)).
  'zonas-distancia': 0,
  // PanelTFTrabajadorPuntoVenta.focusLost pads the code filter to five digits ("00000" + code).
  'trabajador-punto-venta': 5,
};

/** Refs as read from the desktop combos (R-REG-6): the source catalog and its static where (the perfil lists tipos with estado A). */
const REFS: Record<string, [string, Record<string, unknown>]> = {
  'motivos-descuento.id_tipo_descuento': ['tipos-descuento', {}],
  'tipos-trabajador-perfil.id_tipo_trabajador': ['tipos-trabajador', { estado: true }],
  'familias.id_familia_sunat': ['familias-sunat', {}],
  'subfamilias.id_familia': ['familias', {}],
  'subfamilias.id_subfamilia_sunat': ['subfamilias-sunat', {}],
  'tipos-cambio.id_moneda': ['monedas', {}],
  // RegisterAlmacen.loadLocalidad(usuario.getCodempresa()): only the session empresa's localidades.
  'almacenes.id_localidad': ['localidades', { id_empresa: '$session.empresa' }],
  'almacenes.id_punto_venta': ['punto-venta', {}],
  'almacenes.id_ubigeo': ['ubigeo', {}],
  'zonas.id_ubigeo': ['ubigeo', {}],
  // RegisterCorrelativo.loadTipoDocumento lists the tipos with estado A; loadLocalidad passes the session empresa; the punto de venta follows the localidad.
  'correlativos.id_tipo_doc': ['tipos-doc-venta', {}],
  'correlativos.id_localidad': ['localidades', { id_empresa: '$session.empresa' }],
  'correlativos.id_punto_venta': ['punto-venta', {}],
  // LoadCombo.loadLocalidad lists every active localidad, loadPuntoVenta those of the localidad, loadAlmacen those of the punto de venta in the session empresa.
  'ubicaciones.id_localidad': ['localidades', {}],
  'ubicaciones.id_punto_venta': ['punto-venta', {}],
  'ubicaciones.id_almacen': ['almacenes', {}],
  // loadClasificacion lists the clasificaciones of the chosen tipo; the SUNAT combos list every tabla and the detail of the chosen one.
  'tipos-mov-inventario.id_clasif_inventario': ['clasif-inventarios', {}],
  'tipos-mov-inventario.id_tabla_sunat': ['tablas-sunat', {}],
  'tipos-mov-inventario.id_detalle_sunat': ['tablas-detalle-sunat', {}],
  'unidades-medida.id_tabla_sunat': ['tablas-sunat', {}],
  'unidades-medida.id_detalle_sunat': ['tablas-detalle-sunat', {}],
  // loadMarca / loadModelo list the rows with estado A.
  'vehiculos.id_marca': ['marcas-vehiculo', { estado: true }],
  'vehiculos.id_modelo': ['modelos-vehiculo', { estado: true }],
  // RegisterUsuarioCorrelativo: listarGeneral() users, the localidades of the session empresa, the puntos de venta of the localidad, the tipos of the
  // punto de venta (SP_TIPO_DOC_CORRELATIVO) and the correlativos of the punto de venta and tipo with estado A (listar(pv, tipo, "A")).
  'usuario-correlativos.id_usuario': ['usuarios', {}],
  'usuario-correlativos.id_localidad': ['localidades', { id_empresa: '$session.empresa' }],
  'usuario-correlativos.id_punto_venta': ['punto-venta', {}],
  'usuario-correlativos.id_tipo_doc': ['tipos-doc-venta', {}],
  'usuario-correlativos.id_correlativo': ['correlativos', { estado: 'A' }],
  // RegisterZonaDistancia: the zonas of the distrito, the localidades of the session empresa, the puntos de venta of the localidad, the almacenes of the punto de venta.
  'zonas-distancia.id_zona': ['zonas', {}],
  'zonas-distancia.id_localidad': ['localidades', { id_empresa: '$session.empresa' }],
  'zonas-distancia.id_punto_venta': ['punto-venta', {}],
  'zonas-distancia.id_almacen': ['almacenes', {}],
  // RegisterTrabajadorPuntoVenta: the trabajador picker (a select here), every empresa, the localidades of the empresa, the puntos de venta of the localidad.
  'trabajador-punto-venta.id_trabajador': ['trabajadores', {}],
  'trabajador-punto-venta.id_empresa': ['empresa', {}],
  'trabajador-punto-venta.id_localidad': ['localidades', {}],
  'trabajador-punto-venta.id_punto_venta': ['punto-venta', {}],
};

/**
 * Empresa-scope audit (5.6b), read from each `DAO<X>.java`: `empresa` when the list and the writes take the session empresa
 * (colores, marcas, familias), `stamp` when only the writes do (tamanos, marcas-vehiculo, modelos-vehiculo: their desktop list
 * passes '' or null), `tenant` when the DAO never sees an empresa.
 */
const SCOPE: Record<string, 'empresa' | 'stamp' | 'tenant'> = {
  aduanas: 'tenant', colores: 'empresa', 'estados-documento': 'tenant', laboratorios: 'tenant', marcas: 'empresa', nacionalidades: 'tenant',
  'motivos-traslado': 'tenant', 'clasif-clientes': 'tenant', 'clasif-inventarios': 'tenant', tamanos: 'stamp', 'tipos-anexo': 'tenant',
  'tipos-descuento': 'tenant', 'condiciones-pago': 'tenant', 'tipos-trabajador': 'tenant', 'marcas-vehiculo': 'stamp', turnos: 'tenant',
  'motivos-descuento': 'tenant', 'motivos-nc': 'tenant', 'tipos-trabajador-perfil': 'tenant', familias: 'empresa', 'modelos-vehiculo': 'stamp',
  // DAOSubFamilia.mantSubFamilia passes the empresa on every write; listar passes '' for it, so the list stays tenant-wide.
  subfamilias: 'stamp',
  // DaoTipoCambio.listTipoCambio takes (id, fecha, moneda) and no empresa; mantTipoCambio passes empresa and user on every write. The Promocion bean carries neither.
  'tipos-cambio': 'stamp', promociones: 'tenant',
  // DAOAlmacen.listar takes the session empresa (PanelTFAlmacen) and insertar/modificar pass it (RegisterAlmacen.txtCodEmpresa) with the user;
  // DAOZona.listar(0, "") and mantZona(zona, op) see only the user (zona.getId_usuario).
  almacenes: 'empresa', zonas: 'tenant',
  // DAOCorrelativo.listar(id, pv, tipo, estado) takes no empresa and mantCorrelativo passes only the user.
  correlativos: 'tenant',
  // DaoUbicacion.listarUbicacion(0, "") and insert/update/delete take no empresa and no user.
  ubicaciones: 'tenant',
  // DAOTipoMovInventario.listar(t) takes no empresa and manTipoMovInventario only the user; DAOUnidadMedida.listar/listarGeneral take the session
  // empresa (PanelTFUnidadMedida, RegisterUnidadMedida.loadRegister) and manUnidadMedida the user.
  'tipos-mov-inventario': 'tenant', 'unidades-medida': 'empresa',
  // DaoVehiculo.listarVehiculo(id, transportista, estado) takes no empresa and mantVehiculo passes only the user (bean.setId_usuario).
  vehiculos: 'tenant',
  // PanelTFUsuarioCorrelativo.cargarTabla lists with usuario.getCodempresa() and insertar / modificar pass it with the session user.
  'usuario-correlativos': 'empresa',
  // DAOZonaDistancia: rn_ZonaDistancia.listar(0) and mantZonaDistancia(bean, op) see the user (bean.setId_usuario) and no empresa.
  'zonas-distancia': 'tenant',
  // DAOTrabajadorPuntoVenta.insertar / modificar pass the trabajador, the punto de venta, the user and habilitar: no empresa (the list takes the session one).
  'trabajador-punto-venta': 'tenant',
};
/**
 * The entries over the W1 sections (empresa, punto-venta; no seed file, so no generic table rows): `DAOEmpresa.listar("")` passes no empresa
 * and `modificar` only the user; `DAOPuntoVenta.insertar/modificar/eliminar` pass the user and no empresa, and the web list stays tenant-wide.
 */
const W1_SCOPE: Record<string, 'empresa' | 'stamp' | 'tenant'> = { empresa: 'tenant', 'punto-venta': 'tenant' };

describe('W2 reference catalogs are registered', () => {
  it.each(Object.entries({ ...SCOPE, ...W1_SCOPE }))('5.6b %s keeps its audited empresa scope', (slug, scope) => {
    const entry = REGISTRY.bySlug.get(slug);
    const decided = entry.scope === 'empresa' ? 'empresa' : (entry.stamp ?? []).includes('id_empresa') ? 'stamp' : 'tenant';
    expect(decided).toBe(scope);
  });

  it('5.6b the audit covers every reference catalog', () => {
    expect(Object.keys(SCOPE).sort()).toEqual(Object.keys(ENTITIES).sort());
    // Every other entry is Localidad (compat), a read-only lookup (shared, or the per-tenant usuarios and trabajadores) or one of the two W1-section entries.
    expect(REGISTRY.entries.filter((e: any) => !e.readOnly && !e.compat && !(e.slug in SCOPE)).map((e: any) => e.slug).sort()).toEqual(Object.keys(W1_SCOPE).sort());
  });

  it.each(Object.entries(REFS))('R-REG-6 %s refs its desktop source', (path, [catalog, where]) => {
    const [slug, name] = path.split('.');
    const ref = REGISTRY.bySlug.get(slug).refs.find((r: any) => r.field === name);
    expect([ref.catalog, ref.where, ref.activeOnly]).toEqual([catalog, where, true]);
  });

  it.each(Object.entries(DESKTOP))('R-REF-4 %s keeps the desktop max and case rule', (path, [max, upper]) => {
    const [slug, name] = path.split('.');
    const field = REGISTRY.bySlug.get(slug).fields.find((f: any) => f.name === name);
    expect([field.max, field.normalize.includes('upper')]).toEqual([max, upper]);
  });

  it.each(Object.entries(INTEGERS))('R-CRUD-11 %s keeps the desktop digits, padding and range', (path, [digits, padded, range]) => {
    const [slug, name] = path.split('.');
    const field = REGISTRY.bySlug.get(slug).fields.find((f: any) => f.name === name);
    expect([field.kind, field.scale, field.max, field.normalize.some((s: string) => s.startsWith('padLeft:')), field.range]).toEqual(['number', 0, digits, padded, range]);
  });

  it.each(Object.entries(CODE_WIDTH))('%s keeps the desktop code width %i', (slug, width) => {
    expect(REGISTRY.bySlug.get(slug).codeWidth).toBe(width);
  });

  it('registers the reference catalogs, each with seed rows and one inactive row', () => {
    expect(referenceEntries().map((e: any) => e.slug).sort()).toEqual(Object.keys(ENTITIES).sort());
    expect(REFERENCE_CASES.length).toBeGreaterThan(40);
  });

  it('R-CRUD-12 / S-REF-39 subfamilias: the SUNAT select depends on the familia and no nested-create field exists', () => {
    const fields = toCatalogConfig(REGISTRY.bySlug.get('subfamilias')).fields;
    expect(fields.map((f: any) => `${f.kind}:${f.name}`)).toEqual(['code:id_sub_familia', 'select:id_familia', 'text:descripcion', 'select:id_subfamilia_sunat']);
    expect(fields.map((f: any) => f.dependsOn)).toEqual([undefined, undefined, undefined, [{ field: 'id_familia', filterKey: 'id_familia' }]]);
  });

  it('S-REF-19 tipos-cambio starts on DOLAR AMERICANO: the default moneda id is that seeded row, and the select is read-only in every mode', () => {
    const entry = REGISTRY.bySlug.get('tipos-cambio');
    const moneda = entry.fields.find((f: any) => f.name === 'id_moneda');
    const seeded = loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url))).monedas.find((r: any) => r.id_moneda === moneda.default);
    expect([seeded.descripcion, moneda.readOnlyOn]).toEqual(['DOLAR AMERICANO', ['INSERT', 'UPDATE', 'CLONE', 'DETAIL', 'DELETE']]);
  });

  it('R-REF-7 tipos-cambio keys uniqueness on (empresa, fecha, moneda) and reports it on fecha', () => {
    expect(REGISTRY.bySlug.get('tipos-cambio').unique).toMatchObject([{ fields: ['fecha', 'id_moneda'], includeEmpresa: true, errorField: 'fecha' }]);
  });

  it('R-REF-8 / S-REG-17 correlativos declares the desktop order: the unique key sits before the ticket fields', () => {
    const entry = REGISTRY.bySlug.get('correlativos');
    expect(entry.validation).toEqual(['id_tipo_doc', 'serie', 'correlativo', 'estado', 'id_localidad', 'id_punto_venta', { unique: 0 }, 'nro_autorizacion', 'codigo_maquina']);
    expect(entry.unique).toMatchObject([{ fields: ['id_punto_venta', 'id_tipo_doc', 'serie'], errorField: 'serie', message: 'Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.' }]);
  });

  it('S-REF-30 ubicaciones words its messages as literals, checks the chain in order and stamps nothing', () => {
    const entry = REGISTRY.bySlug.get('ubicaciones');
    expect(entry.validation).toEqual(['id_localidad', 'id_punto_venta', 'id_almacen', 'descripcion']);
    expect(entry.fields.filter((f: any) => f.message).map((f: any) => [f.name, f.message])).toEqual([
      ['id_localidad', 'Seleccione Localidad'], ['id_punto_venta', 'Seleccione Punto de Venta'], ['id_almacen', 'Seleccione Almacen'], ['descripcion', 'Ingrese Descripcion'],
    ]);
    expect(entry.stamp).toEqual([]);
    expect(entry.fields.find((f: any) => f.name === 'id_almacen').dependsOn).toEqual([{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }]);
  });

  it('S-REF-23 tipos-mov-inventario: tipo E by default, the clasificacion follows it and selects its first, the SUNAT detalle follows its tabla', () => {
    const entry = REGISTRY.bySlug.get('tipos-mov-inventario');
    const field = (name: string) => entry.fields.find((f: any) => f.name === name);
    expect(entry.fields.map((f: any) => f.name)).toEqual(['id_tipo_mov', 'tipo', 'id_clasif_inventario', 'descripcion', 'abrev', 'id_tabla_sunat', 'id_detalle_sunat', 'hab_ingreso']);
    expect([field('tipo').default, field('tipo').options.map((o: any) => o.value)]).toEqual(['E', ['E', 'S']]);
    expect([field('id_clasif_inventario').dependsOn, field('id_clasif_inventario').defaultOption]).toEqual([[{ field: 'tipo', filterKey: 'tipo' }], 'first']);
    expect([field('id_tabla_sunat').defaultOption, field('id_tabla_sunat').required, field('id_detalle_sunat').dependsOn, field('id_detalle_sunat').required]).toEqual([undefined, undefined, [{ field: 'id_tabla_sunat', filterKey: 'id_tabla_sunat' }], undefined]);
    expect([field('hab_ingreso').kind, field('hab_ingreso').default]).toEqual(['boolean', false]);
    expect([entry.constants, entry.stamp, entry.validation.slice(0, 2)]).toEqual([{ estado: 'A' }, ['id_usuario'], ['descripcion', 'abrev']]);
  });

  it('S-REF-24 unidades-medida starts on the 6th seeded tabla: the default id is that seeded row, and nothing else is a default', () => {
    const entry = REGISTRY.bySlug.get('unidades-medida');
    const tabla = entry.fields.find((f: any) => f.name === 'id_tabla_sunat');
    const tablas = loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url)))['tablas-sunat'];
    expect([tabla.default, tablas[5].id_tabla_sunat, tablas[5].descripcion]).toEqual(['6', '6', 'UNIDAD DE MEDIDA']);
    expect(entry.fields.find((f: any) => f.name === 'id_detalle_sunat').default).toBeUndefined();
  });

  it('S-REF-39 unidades-medida has no presentation panel: no Presentación, Unidad Base, FP or UP field', () => {
    const fields = toCatalogConfig(REGISTRY.bySlug.get('unidades-medida')).fields;
    expect(fields.map((f: any) => `${f.kind}:${f.name}`)).toEqual(['code:id_um', 'text:descripcion', 'text:abreviatura', 'select:id_tabla_sunat', 'select:id_detalle_sunat']);
    expect(fields.map((f: any) => f.label)).toEqual(['Código', 'Descripción', 'Abreviatura', 'Tabla Sunat', 'Codigo Sunat']);
  });

  it('S-REF-31 vehiculos checks placa, constancia, peso, marca and modelo in the desktop order with the M2 select texts', () => {
    const entry = REGISTRY.bySlug.get('vehiculos');
    const field = (name: string) => entry.fields.find((f: any) => f.name === name);
    expect(entry.messages.style).toBe('M2');
    expect(entry.validation).toEqual(['placa', 'constancia_inscripcion', 'peso', 'id_marca', 'id_modelo', 'estado']);
    expect([field('id_marca').message, field('id_modelo').message]).toEqual(['Para {modo}, debes Seleccionar Marca.', 'Para {modo}, debes Seleccionar Modelo.']);
    expect([field('constancia_inscripcion').msgLabel, field('peso').default, field('peso').blankToDefault]).toEqual(['su Constacia', '0', undefined]);
    expect([entry.stamp, entry.scope, field('estado').default]).toEqual([['id_usuario'], 'tenant', { INSERT: true }]);
  });

  it('S-REF-39 vehiculos has no propietario picker: the form is marca, modelo, placa, constancia, peso and estado', () => {
    const fields = toCatalogConfig(REGISTRY.bySlug.get('vehiculos')).fields;
    expect(fields.map((f: any) => `${f.kind}:${f.name}`)).toEqual(['code:id_vehiculo', 'select:id_marca', 'select:id_modelo', 'text:placa', 'text:constancia_inscripcion', 'number:peso', 'boolean:estado']);
    expect(fields.map((f: any) => f.label)).toEqual(['Código', 'Marca', 'Modelo', 'Placa', 'Const inscripcion', 'Peso(KG)', 'Activo']);
  });

  it('S-REF-17 / S-CRUD-40 usuario-correlativos keeps the desktop order, the label style and the multi-parent chain', () => {
    const entry = REGISTRY.bySlug.get('usuario-correlativos');
    const field = (name: string) => entry.fields.find((f: any) => f.name === name);
    expect(entry.messages.style).toBe('label');
    expect(entry.validation).toEqual(['id_usuario', 'id_localidad', 'id_punto_venta', 'id_tipo_doc', 'id_correlativo', { unique: 0 }, 'habilitar']);
    expect(entry.fields.filter((f: any) => f.msgLabel).map((f: any) => [f.name, f.msgLabel])).toEqual([
      ['id_usuario', 'el Usuario'], ['id_localidad', 'la Localidad'], ['id_punto_venta', 'el Punto de Venta'], ['id_tipo_doc', 'el Tipo de documento'], ['id_correlativo', 'su serie'],
    ]);
    expect(field('id_punto_venta').dependsOn).toEqual([{ field: 'id_localidad', filterKey: 'id_localidad' }]);
    expect(field('id_tipo_doc').dependsOn).toEqual([{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }]);
    expect(field('id_correlativo').dependsOn).toEqual([{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }, { field: 'id_tipo_doc', filterKey: 'id_tipo_doc' }]);
    expect(entry.unique).toMatchObject([{ fields: ['id_usuario', 'id_correlativo'], errorField: 'id_correlativo', message: 'Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.' }]);
    // The field named id_usuario is the assigned user, so the session user is not stamped over it.
    expect([entry.stamp, entry.scope, field('habilitar').default]).toEqual([[], 'empresa', true]);
  });

  it('S-REF-22 zonas-distancia has two independent chains, the cascade one transient and filtered to the zonas, and the desktop order', () => {
    const entry = REGISTRY.bySlug.get('zonas-distancia');
    const field = (name: string) => entry.fields.find((f: any) => f.name === name);
    expect(entry.fields.map((f: any) => f.name)).toEqual(['id_zona_distancia', 'id_distrito', 'id_zona', 'id_localidad', 'id_punto_venta', 'id_almacen', 'distancia', 'estado']);
    expect(entry.validation).toEqual(['id_distrito', 'id_zona', 'id_localidad', 'id_punto_venta', 'id_almacen', 'distancia', 'estado']);
    expect(entry.messages.style).toBe('MS');
    expect([field('id_distrito').transient, field('id_distrito').filter, field('id_distrito').restoreFrom]).toEqual([true, { has: 'zonas' }, { field: 'id_ubigeo', prefixLen: 6 }]);
    expect(entry.joins.find((j: any) => j.as === 'id_ubigeo')).toEqual({ as: 'id_ubigeo', ref: 'id_zona', display: 'id_ubigeo' });
    expect(field('id_zona').dependsOn).toEqual([{ field: 'id_distrito', filterKey: 'id_ubigeo' }]);
    expect(field('id_punto_venta').dependsOn).toEqual([{ field: 'id_localidad', filterKey: 'id_localidad' }]);
    expect(field('id_almacen').dependsOn).toEqual([{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }]);
    expect(entry.fields.filter((f: any) => f.article).map((f: any) => [f.name, f.article, f.label])).toEqual([
      ['id_distrito', 'un', 'Distrito'], ['id_zona', 'una', 'Zona'], ['id_localidad', 'una', 'Localidad'], ['id_punto_venta', 'un', 'Pto Vta'], ['id_almacen', 'un', 'Almacen'],
    ]);
    // The server only sees the zona: the transient distrito is no ref and the zona has no parent it can check.
    expect(entry.refs.map((r: any) => r.field)).toEqual(['id_zona', 'id_localidad', 'id_punto_venta', 'id_almacen']);
    expect(entry.refs[0].parents).toEqual([]);
  });

  it('S-REF-21 trabajador-punto-venta keeps the desktop order, the label style, the empresa chain and the pair key', () => {
    const entry = REGISTRY.bySlug.get('trabajador-punto-venta');
    const field = (name: string) => entry.fields.find((f: any) => f.name === name);
    expect(entry.fields.map((f: any) => f.name)).toEqual(['id_trabajador_punto_venta', 'id_trabajador', 'id_empresa', 'id_localidad', 'id_punto_venta', 'habilitar']);
    expect(entry.validation).toEqual(['id_trabajador', 'id_empresa', 'id_localidad', 'id_punto_venta', { unique: 0 }, 'habilitar']);
    expect(entry.messages.style).toBe('label');
    expect(entry.fields.filter((f: any) => f.msgLabel).map((f: any) => [f.name, f.msgLabel])).toEqual([
      ['id_trabajador', 'su Nombre'], ['id_empresa', 'la Empresa'], ['id_localidad', 'la Localidad'], ['id_punto_venta', 'su Punto de Venta'],
    ]);
    expect(field('id_localidad').dependsOn).toEqual([{ field: 'id_empresa', filterKey: 'id_empresa' }]);
    expect(field('id_punto_venta').dependsOn).toEqual([{ field: 'id_localidad', filterKey: 'id_localidad' }]);
    expect(entry.unique).toMatchObject([{ fields: ['id_trabajador', 'id_punto_venta'], errorField: 'id_trabajador', message: 'El Trabajador ya se encuentra asignado al punto de venta especificado. Compruébala e inténtalo de nuevo' }]);
    expect([entry.stamp, entry.scope, field('habilitar').default]).toEqual([['id_usuario'], 'tenant', false]);
  });

  it('S-REF-22 the distancia is a decimal above zero with the Zona Distancia sentence for blank, zero and negative', () => {
    const f = REGISTRY.bySlug.get('zonas-distancia').fields.find((x: any) => x.name === 'distancia');
    expect([f.kind, f.required, f.exclusiveMin, f.message, f.label]).toEqual(['number', true, 0, 'Para {modo} una Zona Distancia, debes especificar su Distancia.', 'Distancia(Km)']);
  });

  it('S-REF-17 the correlativos lookup shows each serie, so the Serie select reads F001', () => {
    expect(REGISTRY.bySlug.get('correlativos').optionLabel).toBe('serie');
  });

  it('R-REF-8 the ticket fields are visible and required only for the tipo TI', () => {
    const fields = REGISTRY.bySlug.get('correlativos').fields.filter((f: any) => ['nro_autorizacion', 'codigo_maquina'].includes(f.name));
    expect(fields.map((f: any) => [f.visibleWhen, f.requiredWhen, f.required])).toEqual([
      [{ field: 'id_tipo_doc', in: ['TI'] }, { field: 'id_tipo_doc', in: ['TI'] }, undefined],
      [{ field: 'id_tipo_doc', in: ['TI'] }, { field: 'id_tipo_doc', in: ['TI'] }, undefined],
    ]);
  });

  it('R-REF-9 the hidden constants and the derived linea_impresion are declared on the entry', () => {
    const entry = REGISTRY.bySlug.get('correlativos');
    expect(entry.constants).toEqual({ num_inicial: '0000000001', num_final: '9999999999', flag_cond_pago: 'N' });
    expect(entry.derive).toEqual([{ target: 'linea_impresion', when: { field: 'imprime', in: ['S'] }, then: 12, else: 0 }]);
  });

  it('S-REG-6 every one of them seeds demo only: botica starts empty', () => {
    const seed = loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url)));
    // A shared lookup is one global list (S-REG-18, lookups.spec.ts), not a section keyed by tenant.
    // The W1-section entries (`seed: null`) keep the W1 seed, which also feeds the botica tenant.
    for (const entry of REGISTRY.entries.filter((e: any) => !e.compat && e.scope !== 'shared' && e.seed !== null)) expect(Object.keys(seed[entry.section]), entry.slug).toEqual(['demo']);
  });
});

// S-REF-37 / R-MOCK-18: the same table against the in-browser mock and the HTTP mock.
describeRegistryContract(
  'in-browser mock',
  (slug, ctx) => {
    const mock = createAppServicesMock('exitoso', { getSession: session, getRequestContext: () => ctx, delayMs: 0 });
    return { catalog: mock.catalog(slug), lookup: mock.lookup };
  },
  REFERENCE_CASES,
);

const server = useTestServer({ seed: loadSeed(fileURLToPath(new URL('../../mock-server/data', import.meta.url))) });
describeRegistryContract(
  'http mock server',
  (slug, ctx) => {
    const client = createHttpClient({ baseUrl: server.url(), getSession: session, getRequestContext: () => ctx });
    return { catalog: createCatalogServiceHttp(client, slug), lookup: createLookupServiceHttp(client) };
  },
  REFERENCE_CASES,
);
