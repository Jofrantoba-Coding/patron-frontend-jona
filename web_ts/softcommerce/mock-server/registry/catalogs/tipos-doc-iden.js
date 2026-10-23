/**
 * Tipo de Documento de Identidad (`DaoTipoDocIden.listarTipoDocIden(id, estado, flag)`, R-REF-11): the read-only list behind the Tipo de Documento
 * select of a Chofer and a Socio, which call it with `("", "A", "S")`: estado A and the flag `S` (persons, the `persona` column here). The combo shows the
 * abreviatura (`DNI`, `RUC`) and the id is the code the desktop compares: `01` is the DNI (`FormImportarAnexo`: an 8-digit number is `01`) and `05` the RUC
 * (`RegisterSocio`: `getId_tipo_doc().equals("05")`). `persona` and `estado` are the flags the selects filter on through their static `where`, which
 * applies to the options and to ref validation alike (D16). Global data (`shared`, W6 to confirm), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const tiposDocIden = {
  slug: 'tipos-doc-iden',
  idKey: 'id_tipo_doc_iden',
  codeWidth: 2,
  entity: 'un Tipo de Documento',
  scope: 'shared',
  seed: 'tipos-doc-iden',
  readOnly: true,
  optionLabel: 'abreviatura',
  messages: { style: 'M1' },
  fields: [
    { name: 'id_tipo_doc_iden', kind: 'code', label: 'Código' },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100 },
    { name: 'abreviatura', kind: 'text', label: 'Abreviatura', max: 10 },
    { name: 'persona', kind: 'boolean', label: 'Persona' },
    { name: 'estado', kind: 'boolean', label: 'Activo' },
  ],
  columns: [{ key: 'id_tipo_doc_iden', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }, { key: 'abreviatura', header: 'Abreviatura' }],
};
