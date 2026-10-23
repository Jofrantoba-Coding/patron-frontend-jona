import { documentFields } from './documento.js';
import { referenceCatalog } from './reference.js';

/**
 * Socio (`RegisterSocio`, R-REF-6, R-REF-8, S-REF-28, S-MOCK-32). The same document block as the Chofer, with no default tipo (`newRegister` leaves the combo on
 * "--- Seleccione ---") and the sentences of the desktop copy of the Cliente form: [DEVIATION] they say `un Cliente`, the web port names the Socio. The rule
 * stores `flag_tipo_persona` (`J` for a RUC starting with 2, `N` otherwise; `llenarBeanSocio`). The estado checkbox is always disabled and checked on create, so it
 * is read-only in every mode. `mantSocio` carries the session user in the bean but the DAO never passes it (`//cs.setString(10, ...)`) and `listarSocio(0, "")`
 * takes no empresa: tenant scope, nothing stamped, an int id (`Integer.parseInt`). The modes are INSERT, UPDATE, DETAIL and CLONE: DELETE answers 405
 * `MODE_NOT_SUPPORTED`, a different code from the read-only lookups' `METHOD_NOT_ALLOWED`.
 */
export const socios = referenceCatalog({
  slug: 'socios', idKey: 'id_socio', codeWidth: 0, entity: 'un Socio', formId: 'PanelTFSocio', title: 'Socio', descripcion: false, stamp: [],
  fields: [
    ...documentFields('un Socio'),
    { name: 'estado', preset: 'estado', readOnlyOn: ['INSERT', 'CLONE', 'DETAIL', 'DELETE', 'UPDATE'] },
  ],
  columns: [
    { key: 'descripcion', header: 'Razón Social' }, { key: 'tipo_doc', header: 'Tipo Doc' }, { key: 'numero_doc', header: 'RUC/DNI' }, { key: 'estado', header: 'Estado', type: 'bool' },
  ],
  joins: [{ as: 'tipo_doc', ref: 'id_tipo_doc_iden', display: 'abreviatura' }],
  modes: ['INSERT', 'UPDATE', 'DETAIL', 'CLONE'],
  rules: [{ name: 'docIdentidad', params: { persona: 'flag_tipo_persona' } }],
  validation: ['id_tipo_doc_iden', { rule: 'docIdentidad' }, 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'estado'],
});
