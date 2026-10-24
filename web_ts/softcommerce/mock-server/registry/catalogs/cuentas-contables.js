/**
 * Cuenta contable: a read-only stub of W6 data (R-MOCK-25, D21). No W3 screen consumes it (the Cliente `Cuenta` is a bank account over `tablas-detalle-sunat`,
 * R-MST-11); it stays as the lookup of the proposal. The shape `{ id_cuenta, cuenta, descripcion }` is [INFERRED]: the real data, the final scope and the
 * `codeWidth` belong to W6. Per tenant, no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const cuentasContables = {
  slug: 'cuentas-contables',
  idKey: 'id_cuenta',
  codeWidth: 0,
  entity: 'una Cuenta Contable',
  scope: 'tenant',
  seed: 'cuentas-contables',
  readOnly: true,
  optionLabel: 'descripcion',
  search: ['id_cuenta', 'cuenta', 'descripcion'],
  messages: { style: 'M1' },
  fields: [
    { name: 'id_cuenta', kind: 'code', label: 'Código' },
    { name: 'cuenta', kind: 'text', label: 'Cuenta', required: true, max: 20 },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 255 },
  ],
  columns: [{ key: 'id_cuenta', header: 'Código' }, { key: 'cuenta', header: 'Cuenta' }, { key: 'descripcion', header: 'Descripción' }],
};
