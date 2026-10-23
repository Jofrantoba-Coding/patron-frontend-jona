/**
 * Shared shape of the text-only reference catalogs (R-REF-4): the server code, `descripcion`
 * (plus optional extras), a logical-delete flag, the session user stamp and the M1 messages.
 * Each catalog stays a one-line declaration; the rules live in the registry, not here.
 * @param {{ slug: string, idKey: string, entity: string, formId: string, title: string, upper?: boolean,
 *   codeWidth?: number, fields?: any[], columns?: any[] }} def
 * @returns {import('../schema.js').CatalogDef}
 */
export function referenceCatalog({ slug, idKey, entity, formId, title, upper = true, codeWidth = 3, fields = [], columns = [] }) {
  return {
    slug,
    idKey,
    // The desktop pads its string codes to three digits ("001"); integer beans print unpadded (width 0).
    codeWidth,
    entity,
    scope: 'tenant',
    seed: slug,
    formId,
    title,
    menu: { parent: 'mnGenerales', label: title },
    stamp: ['id_usuario'],
    messages: { style: 'M1' },
    fields: [
      { name: idKey, kind: 'code', label: 'Código' },
      { name: 'descripcion', preset: 'descripcion', normalize: upper ? ['upper'] : [] },
      ...fields,
    ],
    columns: [{ key: idKey, header: 'Código' }, { key: 'descripcion', header: 'Descripción' }, ...columns],
  };
}
