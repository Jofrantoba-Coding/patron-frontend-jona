/**
 * Shared shape of the text-only reference catalogs (R-REF-4): the server code, `descripcion`
 * (plus optional extras), a logical-delete flag, the session user stamp and the M1 messages.
 * Each catalog stays a one-line declaration; the rules live in the registry, not here.
 * @param {{ slug: string, idKey: string, entity: string, formId: string, title: string, upper?: boolean,
 *   codeWidth?: number, style?: 'M1'|'M2'|'MS'|'label', scope?: 'tenant'|'empresa', stamp?: string[], descripcion?: any|false, fields?: any[], columns?: any[], joins?: any[], unique?: any[], validation?: any[], lookupFilters?: Record<string, any>,
 *   constants?: Record<string, string|number|boolean>, derive?: any[], optionLabel?: string|string[], modes?: string[], rules?: any[], children?: Record<string, any>, actions?: any[], aggregate?: any[], generalTab?: string }} def
 * @returns {import('../schema.js').CatalogDef}
 */
export function referenceCatalog({
  slug, idKey, entity, formId, title, upper = true, codeWidth = 3, style = 'M1', scope = 'tenant', stamp = ['id_usuario'], descripcion = {}, fields = [], columns = [], joins, unique, validation, lookupFilters, constants, derive, optionLabel, modes, rules, children, actions, aggregate, generalTab,
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
    ...(lookupFilters ? { lookupFilters } : {}),
    ...(validation ? { validation } : {}),
    ...(constants ? { constants } : {}),
    ...(derive ? { derive } : {}),
    // Writes outside `modes` answer 405 `MODE_NOT_SUPPORTED`; `rules` name the entry rules (`docIdentidad`).
    ...(modes ? { modes } : {}),
    ...(rules ? { rules } : {}),
    // A master: its child grids (the anexo activation history) and its actions (R-REG-14, R-REG-15).
    ...(children ? { children } : {}),
    ...(actions ? { actions } : {}),
    // The counts and sums over the children the server adds to every answer (D27a).
    ...(aggregate ? { aggregate } : {}),
    // The title of the base register tab when it is not `General` (the Item `Datos de Item`, R-MD-1).
    ...(generalTab ? { generalTab } : {}),
    // The name a select shows for a row when it is not the `descripcion` (a correlativo is shown by its serie).
    ...(optionLabel ? { optionLabel } : {}),
  };
}
