import { documentFields } from './documento.js';

/**
 * The person block every anexo master shares (R-MST-2): Banco and Transportista (open on RUC), Cliente and Proveedor (open on no tipo). It is the
 * `docIdentidad` document fields of a Chofer plus the address, sexo, phones, nacionalidad and e-mail of `RegisterBancoAnexo`, with the real entity in every
 * sentence: [DEVIATION] the desktop Banco and Transportista said `un Cliente` for the tipo de documento. `validation` is the order of `isRegisterValid`: the tipo,
 * the rule (number and names), the razon social and the nacionalidad; the remaining fields have no check beyond their length.
 * @param {string} entity the entity with its article (`un Banco`)
 * @param {{ tipo?: string }} [options] `tipo` is the id the tipo de documento starts on (INSERT only): `05` is RUC; none leaves it unselected
 */
export function anexoIdentity(entity, { tipo } = {}) {
  return {
    fields: [
      ...documentFields(entity, tipo === undefined ? {} : { default: { INSERT: tipo } }),
      { name: 'direccion', kind: 'text', label: 'Dirección', max: 280, normalize: ['upper'] },
      { name: 'sexo', kind: 'options', label: 'Sexo', display: 'radio', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }], default: 'M' },
      { name: 'telefono', kind: 'text', label: 'Telefono Fijo', max: 15, normalize: ['digits'] },
      { name: 'celular', kind: 'text', label: 'Telefono Movil', max: 15, normalize: ['digits'] },
      {
        name: 'id_nacionalidad', kind: 'select', label: 'Nacionalidad', required: true, message: `Para {modo} ${entity}, debes Seleccionar una Nacionalidad.`,
        default: { INSERT: '001' }, source: { catalog: 'nacionalidades' },
      },
      // The desktop e-mail has no document (no length, no case); the web port lowercases it and caps it at 100 [ASSUMPTION].
      { name: 'email', kind: 'text', label: 'E-Mail', max: 100, normalize: ['lower'] },
    ],
    // The persona flag (`J` for a RUC starting with 2, `N` otherwise) is stored by the rule, as `llenarBeanAnexo` does.
    rules: [{ name: 'docIdentidad', params: { sexo: 'sexo', persona: 'flag_tipo_persona' } }],
    validation: ['id_tipo_doc_iden', { rule: 'docIdentidad' }, 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'id_nacionalidad', 'direccion', 'sexo', 'telefono', 'celular', 'email'],
    joins: [{ as: 'tipo_doc', ref: 'id_tipo_doc_iden', display: 'abreviatura' }, { as: 'nacionalidad', ref: 'id_nacionalidad', display: 'descripcion' }],
  };
}
