import { referenceCatalog } from './reference.js';

/**
 * ZonaDistancia (`RegisterZonaDistancia`, R-REF-6, R-REF-7, S-REF-22, S-MOCK-31): the distance from an almacen to a zona. Two independent chains share the form.
 * Chain A is the departamento > provincia > distrito cascade restricted to the ubigeos that hold an active zona (`RnUbigeo.listarZona`, here the
 * `ubigeoHasActive` rule behind `filter { has: 'zonas' }`), followed by the zona of the distrito; the desktop stores only the zona, so the cascade is
 * `transient` (never sent, stored or checked by the server) and the form restores it from the ubigeo of the stored zona (`restoreFrom`, read through the
 * `id_ubigeo` join). Chain B is localidad (those of the session empresa, `loadLocalidad(usuario.getCodempresa())`) > punto de venta > almacen. The checks
 * are the cascade levels, the zona, the localidad, the punto de venta and the almacen (the MS sentence: `debes Seleccionar un Pto Vta.`), then the
 * distancia. [DEVIATION] the desktop zona and distrito sentences are wrong (`una >ona`, `un Almacen` for the distrito) and its distancia check rejects only 0;
 * the web port names the real field and requires a distancia above zero (blank, 0 and negative all say `especificar su Distancia`), and the sentence names the
 * entity `una Zona Distancia` (the desktop writes `una Zona`). `mantZonaDistancia` and `listar(0)` see the session user and no empresa: tenant scope, user
 * stamp. The localidad and the punto de venta are stored although the desktop keeps only the almacen: the form needs them to restore chain B.
 * The id is an int bean, unpadded.
 */
export const zonasDistancia = referenceCatalog({
  slug: 'zonas-distancia', idKey: 'id_zona_distancia', codeWidth: 0, entity: 'una Zona Distancia', formId: 'miZonaDistancia', title: 'Zona Distancia', style: 'MS', descripcion: false,
  fields: [
    // Chain A. The cascade leaf is the Distrito; its levels above (departamento, provincia) are drawn by the UI and travel nowhere.
    {
      name: 'id_distrito', kind: 'select', label: 'Distrito', required: true, article: 'un', source: { catalog: 'ubigeo' },
      transient: true, filter: { has: 'zonas' }, restoreFrom: { field: 'id_ubigeo', prefixLen: 6 },
    },
    { name: 'id_zona', kind: 'select', label: 'Zona', required: true, article: 'una', source: { catalog: 'zonas' }, dependsOn: [{ field: 'id_distrito', filterKey: 'id_ubigeo' }] },
    // Chain B.
    { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, article: 'una', source: { catalog: 'localidades', where: { id_empresa: '$session.empresa' } } },
    { name: 'id_punto_venta', kind: 'select', label: 'Pto Vta', required: true, article: 'un', source: { catalog: 'punto-venta' }, dependsOn: [{ field: 'id_localidad', filterKey: 'id_localidad' }] },
    { name: 'id_almacen', kind: 'select', label: 'Almacen', required: true, article: 'un', source: { catalog: 'almacenes' }, dependsOn: [{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }] },
    // `DoubleDocument`: no precision limit, so `scale` only marks it as a decimal; blank, zero and negative all say "especificar su Distancia".
    { name: 'distancia', kind: 'number', label: 'Distancia(Km)', required: true, scale: 3, exclusiveMin: 0, message: 'Para {modo} una Zona Distancia, debes especificar su Distancia.' },
    { name: 'estado', preset: 'estado' },
  ],
  columns: [
    { key: 'zona', header: 'Zona' }, { key: 'localidad', header: 'Localidad' }, { key: 'punto_venta', header: 'Pto Venta' }, { key: 'almacen', header: 'Almacen' },
    { key: 'distancia', header: 'Distancia', type: 'dec' }, { key: 'estado', header: 'Estado', type: 'bool' },
  ],
  joins: [
    { as: 'zona', ref: 'id_zona', display: 'descripcion' },
    // The ubigeo code of the chosen zona: what the form restores its cascade from (a record never stores it).
    { as: 'id_ubigeo', ref: 'id_zona', display: 'id_ubigeo' },
    { as: 'localidad', ref: 'id_localidad', display: 'descripcion' },
    { as: 'punto_venta', ref: 'id_punto_venta', display: 'name' },
    { as: 'almacen', ref: 'id_almacen', display: 'descripcion' },
  ],
  validation: ['id_distrito', 'id_zona', 'id_localidad', 'id_punto_venta', 'id_almacen', 'distancia', 'estado'],
});
