import { referenceCatalog } from './reference.js';

/**
 * UsuarioCorrelativo (`RegisterUsuarioCorrelativo`, R-REF-6, S-REF-17, S-CRUD-40): which serie of which correlativo a user may issue. The form is
 * usuario, localidad, punto de venta, tipo de documento and serie, checked in that order with the `label` sentence
 * (`Para {modo} una Asignasion de Usuario - Correlativo, debes especificar el Usuario.`; the desktop spells "Asignasion" and keeps its articles:
 * el Usuario, la Localidad, el Punto de Venta, el Tipo de documento, su serie), then the (usuario, correlativo) pair. The chain is the multi-parent one:
 * the localidades are those of the session empresa (`loadLocalidad(usuario.getCodempresa())`), the puntos de venta follow the localidad, the tipos follow
 * the punto de venta (`RnCorrelativo.listar(pv)`, an `exists` lookup over the correlativos) and the serie follows the punto de venta AND the tipo
 * (`listar(pv, tipo, "A")`: the correlativos with estado A, shown by serie). `PanelTFUsuarioCorrelativo.cargarTabla` lists with `usuario.getCodempresa()` and
 * `insertar` / `modificar` pass it with the session user, so the list and every write belong to the empresa; the id pads to five (`"00000" + code`).
 * The field named `id_usuario` is the ASSIGNED user (the Usuario combo), so the session user passed for the audit is not stamped over it (no `stamp`).
 * Habilitar starts checked (`setSelected(true)`) and is stored S / N by the desktop, a boolean here. The localidad, punto de venta and tipo are stored
 * although the desktop only keeps the correlativo: the form needs them to restore its chain. [DEVIATION] the desktop skips the pair check on CLONE; the
 * generic create applies it, and the duplicate message is reported on `id_correlativo` (the desktop focuses the serie combo).
 * The same rows are the series of a usuario in Autorizar Series (W3-14, R-PRM-7): `habilitar` is the authorization estado, and `fecha_inicio` (the creation day
 * [ASSUMPTION] when this screen creates the row) and `fecha_fin` are kept by the rule `fechaAutorizacion`.
 */
export const usuarioCorrelativos = referenceCatalog({
  slug: 'usuario-correlativos', idKey: 'id_usuario_correlativo', codeWidth: 5, entity: 'una Asignasion de Usuario - Correlativo', formId: 'mi_usuariocorrelativo',
  title: 'Correlativo de Usuario', style: 'label', scope: 'empresa', stamp: [], descripcion: false,
  fields: [
    { name: 'id_usuario', kind: 'select', label: 'Usuario', required: true, msgLabel: 'el Usuario', source: { catalog: 'usuarios' } },
    { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, msgLabel: 'la Localidad', source: { catalog: 'localidades', where: { id_empresa: '$session.empresa' } } },
    { name: 'id_punto_venta', kind: 'select', label: 'P Venta', required: true, msgLabel: 'el Punto de Venta', source: { catalog: 'punto-venta' }, dependsOn: [{ field: 'id_localidad', filterKey: 'id_localidad' }] },
    { name: 'id_tipo_doc', kind: 'select', label: 'T Documento', required: true, msgLabel: 'el Tipo de documento', source: { catalog: 'tipos-doc-venta' }, dependsOn: [{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }] },
    {
      name: 'id_correlativo', kind: 'select', label: 'Serie', required: true, msgLabel: 'su serie', source: { catalog: 'correlativos', where: { estado: 'A' } },
      dependsOn: [{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }, { field: 'id_tipo_doc', filterKey: 'id_tipo_doc' }],
    },
    { name: 'habilitar', kind: 'boolean', label: 'Habilitar', default: true },
  ],
  columns: [
    { key: 'localidad', header: 'Local' }, { key: 'punto_venta', header: 'P Venta' }, { key: 'usuario', header: 'Usuario' },
    { key: 'tipo_documento', header: 'T Doc' }, { key: 'serie', header: 'Serie' },
  ],
  joins: [
    { as: 'localidad', ref: 'id_localidad', display: 'descripcion' },
    { as: 'punto_venta', ref: 'id_punto_venta', display: 'name' },
    { as: 'usuario', ref: 'id_usuario', display: 'nombre' },
    { as: 'tipo_documento', ref: 'id_tipo_doc', display: 'descripcion' },
    { as: 'serie', ref: 'id_correlativo', display: 'serie' },
  ],
  unique: [{
    fields: ['id_usuario', 'id_correlativo'], errorField: 'id_correlativo',
    message: 'Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.',
  }],
  validation: ['id_usuario', 'id_localidad', 'id_punto_venta', 'id_tipo_doc', 'id_correlativo', { unique: 0 }, 'habilitar'],
  // `fecha_inicio` / `fecha_fin` are stored-only and server-managed (the rule owns them): the W2 form neither shows nor writes them (R-PRM-7).
  rules: [{ name: 'fechaAutorizacion' }],
});
