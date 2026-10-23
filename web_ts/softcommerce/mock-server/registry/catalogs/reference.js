/**
 * Shared shape of the text-only reference catalogs (R-REF-4): the server code, `descripcion`
 * (plus optional extras), a logical-delete flag, the session user stamp and the M1 messages.
 * Each catalog stays a one-line declaration; the rules live in the registry, not here.
 * @param {{ slug: string, idKey: string, entity: string, formId: string, title: string, upper?: boolean,
 *   codeWidth?: number, style?: 'M1'|'M2'|'MS', scope?: 'tenant'|'empresa', stamp?: string[], descripcion?: any|false, fields?: any[], columns?: any[], joins?: any[], unique?: any[], validation?: any[],
 *   constants?: Record<string, string|number|boolean>, derive?: any[] }} def
 * @returns {import('../schema.js').CatalogDef}
 */
export function referenceCatalog({
  slug, idKey, entity, formId, title, upper = true, codeWidth = 3, style = 'M1', scope = 'tenant', stamp = ['id_usuario'], descripcion = {}, fields = [], columns = [], joins, unique, validation, constants, derive,
}) {
  return {
    slug,
    idKey,
    // The desktop pads its string codes to three digits ("001"); integer beans print unpadded (width 0).
    codeWidth,
    entity,
    // `empresa` limits list, get and writes to the session empresa; a write stamps it.
    scope,
    seed: slug,
    formId,
    title,
    menu: { parent: 'mnGenerales', label: title },
    stamp,
    messages: { style },
    fields: [
      { name: idKey, kind: 'code', label: 'Código' },
      // `descripcion: false` is a catalog with no description (the Turno is its hora:minuto); an object overrides the preset.
      ...(descripcion === false ? [] : [{ name: 'descripcion', preset: 'descripcion', normalize: upper ? ['upper'] : [], ...descripcion }]),
      ...fields,
    ],
    columns: [{ key: idKey, header: 'Código' }, ...(descripcion === false ? [] : [{ key: 'descripcion', header: 'Descripción' }]), ...columns],
    ...(joins ? { joins } : {}),
    ...(unique ? { unique } : {}),
    ...(validation ? { validation } : {}),
    ...(constants ? { constants } : {}),
    ...(derive ? { derive } : {}),
  };
}
