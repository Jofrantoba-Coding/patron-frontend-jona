/**
 * The identity-document block of a Chofer and a Socio (R-REF-8): tipo de documento, number, the three names and the razon social. The
 * named rule `docIdentidad` (state, validate, effect, derive) decides which of them are open, hidden or required, `maxWhen` / `minLenWhen`
 * carry the 8 / 11 digit lengths (DNI `01`, RUC `05`) and `clearsOnChange` empties the dependent fields when the tipo changes. The persons the
 * select offers are the tipos with the `persona` flag and estado A, as `listarTipoDocIden("", "A", "S")` does (D16).
 */
const DNI = '01';
const RUC = '05';
const TIPO = 'id_tipo_doc_iden';
const BY_TIPO = (/** @type {string[]} */ ids) => ({ field: TIPO, in: ids });

/** @param {string} entity the entity with its article (`un Chofer`) @param {any} [tipoOverrides] */
export function documentFields(entity, tipoOverrides = {}) {
  return [
    {
      name: TIPO, kind: 'select', label: 'Tipo de Documento', required: true, message: `Para {modo} ${entity}, debes Seleccionar un Tipo de Documento.`,
      source: { catalog: 'tipos-doc-iden', where: { persona: true, estado: true } },
      clearsOnChange: ['numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion'], ...tipoOverrides,
    },
    {
      name: 'numero_doc', kind: 'text', label: 'DNI/RUC', max: 11, normalize: ['digits'],
      maxWhen: [{ when: BY_TIPO([DNI]), len: 8 }], minLenWhen: [{ when: BY_TIPO([DNI]), len: 8 }, { when: BY_TIPO([RUC]), len: 11 }],
    },
    { name: 'ap_paterno', kind: 'text', label: 'Apellido Paterno', max: 50, normalize: ['upper'] },
    { name: 'ap_materno', kind: 'text', label: 'Apellido Materno', max: 50, normalize: ['upper'] },
    { name: 'nombres', kind: 'text', label: 'Nombres', max: 50, normalize: ['upper'], msgLabel: 'su Nombre' },
    { name: 'descripcion', kind: 'text', label: 'Razón Social', max: 300, normalize: ['upper'], msgLabel: 'su Descripcion' },
  ];
}
