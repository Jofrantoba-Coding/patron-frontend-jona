/**
 * Tipo de Documento de Venta (`DaoTipoDocVenta.listarTipoDocVenta`, R-REF-11): the read-only list behind the Tipo de Documento select of a
 * Correlativo. The desktop lists the types with estado A (`listarTipoDocVenta("", "", "", "A", ...)`) and keeps the SUNAT code (`01` factura,
 * `03` boleta, `TI` ticket, ...) as the value, so the code is the id and the server never issues it. A punto de venta only offers the types it
 * already has an active correlativo for (`DAOCorrelativo.listar(idPuntoVenta)`, `SP_TIPO_DOC_CORRELATIVO`): the `id_punto_venta` filter is an
 * `exists` rule over the correlativos. Global data (`shared`, W6 to confirm), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const tiposDocVenta = {
  slug: 'tipos-doc-venta',
  idKey: 'id_tipo_doc',
  codeWidth: 0,
  entity: 'un Tipo de Documento',
  scope: 'shared',
  seed: 'tipos-doc-venta',
  readOnly: true,
  messages: { style: 'M1' },
  fields: [
    { name: 'id_tipo_doc', kind: 'code', label: 'Código' },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100 },
    { name: 'abreviatura', kind: 'text', label: 'Abreviatura', max: 10 },
  ],
  columns: [{ key: 'id_tipo_doc', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }, { key: 'abreviatura', header: 'Abreviatura' }],
  lookupFilters: { id_punto_venta: { exists: { catalog: 'correlativos', local: 'id_tipo_doc', where: { estado: 'A' } } } },
};
