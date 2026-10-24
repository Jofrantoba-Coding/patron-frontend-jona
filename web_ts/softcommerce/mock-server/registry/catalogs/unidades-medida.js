import { referenceCatalog } from './reference.js';

/**
 * Unidad de Medida (`RegisterUnidadMedida`, R-REF-6, S-REF-24). The Tabla Sunat combo starts on the 6th seeded tabla (`cboTablaSunat.setSelectedIndex(6)`
 * over the placeholder) and loads its detail; the Codigo Sunat combo follows the tabla and starts on its placeholder. The default is the id of that
 * row, asserted by a seed spec (D16: no positional lookup at runtime). Both are optional (`getSelectedIndex() > 0 ? ... : 0`). The list is the session
 * empresa's (`listar("", "", "", usuario.getCodempresa())`, `listarGeneral(usuario.getCodempresa())`), so the entry has empresa scope; `manUnidadMedida`
 * passes the user. `isRegisterValid` checks the descripcion and then the abreviatura. The presentation panel (Presentación / Unidad Base, FP, UP) is
 * not persisted or validated by the desktop and is excluded (R-REF-12, S-REF-39). The id is a string with no pad evidence: three digits inferred,
 * flagged for W6.
 */
export const unidadesMedida = referenceCatalog({
  slug: 'unidades-medida', idKey: 'id_um', entity: 'una Unidad de Medida', formId: 'miUnidadMedida', title: 'Unidad de Medida', scope: 'empresa', optionLabel: 'abreviatura',
  fields: [
    { name: 'abreviatura', kind: 'text', label: 'Abreviatura', required: true, max: 100, normalize: ['upper'] },
    { name: 'id_tabla_sunat', kind: 'select', label: 'Tabla Sunat', source: { catalog: 'tablas-sunat' }, default: '6' },
    { name: 'id_detalle_sunat', kind: 'select', label: 'Codigo Sunat', source: { catalog: 'tablas-detalle-sunat' }, dependsOn: [{ field: 'id_tabla_sunat', filterKey: 'id_tabla_sunat' }] },
  ],
  columns: [{ key: 'abreviatura', header: 'Abreviatura' }],
});
