/**
 * Moneda (`DaoMoneda.listarMoneda`, R-REF-11): the read-only list behind the Moneda select of a Tipo de Cambio. The desktop
 * shows the description (`DOLAR AMERICANO`) and keeps the 5-digit id (`MonedaEnum`: `00001` soles, `00004` dólares) as the
 * value, so the id is the option id; the server never issues it (the list is read-only). Global data (`shared`, W6 to
 * confirm), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const monedas = {
  slug: 'monedas',
  idKey: 'id_moneda',
  codeWidth: 5,
  entity: 'una Moneda',
  scope: 'shared',
  seed: 'monedas',
  readOnly: true,
  messages: { style: 'M1' },
  fields: [
    { name: 'id_moneda', kind: 'code', label: 'Código' },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100 },
    { name: 'abreviatura', kind: 'text', label: 'Abreviatura', max: 10 },
  ],
  columns: [{ key: 'id_moneda', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }, { key: 'abreviatura', header: 'Abreviatura' }],
};
