import { presets, TIPO_ANEXO } from '../presets.js';
import { documentFields } from './documento.js';
import { referenceCatalog } from './reference.js';

const anexo = presets.anexo({ entity: 'Chofer', tipoAnexo: TIPO_ANEXO.chofer });

/**
 * Chofer (`RegisterChofer`, R-REF-6, R-REF-8, S-REF-25..27, S-REF-29). The tipo de documento comes first, then (named rule `docIdentidad`) the number
 * and the names, then the razon social and the nacionalidad (`isRegisterValid`); the sentences are M1 with `un Chofer`, and the two selects say
 * `debes Seleccionar un Tipo de Documento.` / `una Nacionalidad.`. `newRegister` starts on DNI and PERUANA (INSERT only), the desktop `loadRegister`
 * forces both back on every edit: [DEVIATION] UPDATE restores the stored tipo and nacionalidad. `executeDelete` returns false, so the modes are INSERT,
 * UPDATE, DETAIL and CLONE (DELETE answers 405 `MODE_NOT_SUPPORTED`). `mantChofer` passes the session user and no empresa, and `flag_tipo_persona` is
 * always `N` (the line that computed it is commented out): tenant scope, user stamp, constant. `listAnexo("7", ...)` lists every chofer; the code is padded to ten
 * (`PanelTFChofer.focusLost`: `"0000000000" + id`). The sexo is shown for a natural person only (the radios hide otherwise). The percepcion / retencion / exceptuado flags stay excluded
 * (R-REF-12). Wave 3 closes G11 / G12 (R-ANX-10): the anexo preset adds the `Activación de Chofer` tab, Activar / Desactivar and the tipo anexo `7`
 * (`PanelTFChofer.cargarTabla` lists `listAnexo("7", ...)`); the estado checkbox the desktop hides is shown read-only and derived from the last activation.
 */
export const choferes = referenceCatalog({
  slug: 'choferes', idKey: 'id_chofer', codeWidth: 10, entity: 'un Chofer', formId: 'PanelTFChofer', title: 'Chofer', descripcion: false,
  fields: [
    ...documentFields('un Chofer', { default: { INSERT: '01' } }),
    { name: 'nro_licencia', kind: 'text', label: 'N° Licencia', max: 20, normalize: ['upper'] },
    { name: 'direccion', kind: 'text', label: 'Dirección', max: 280, normalize: ['upper'] },
    { name: 'sexo', kind: 'options', label: 'Sexo', display: 'radio', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }], default: 'M' },
    { name: 'telefono', kind: 'text', label: 'Telefono Fijo', max: 15, normalize: ['digits'] },
    { name: 'celular', kind: 'text', label: 'Telefono Movil', max: 15, normalize: ['digits'] },
    {
      name: 'id_nacionalidad', kind: 'select', label: 'Nacionalidad', required: true, message: 'Para {modo} un Chofer, debes Seleccionar una Nacionalidad.',
      default: { INSERT: '001' }, source: { catalog: 'nacionalidades' },
    },
    { name: 'estado', preset: 'estado', label: 'Estado', readOnlyOn: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] },
  ],
  columns: [
    { key: 'descripcion', header: 'Razón Social' }, { key: 'tipo_doc', header: 'Tipo Doc' }, { key: 'numero_doc', header: 'RUC/DNI' },
    { key: 'nacionalidad', header: 'Nacionalidad' }, { key: 'direccion', header: 'Dirección' }, { key: 'telefono', header: 'Teléfono' }, { key: 'celular', header: 'Celular' },
  ],
  joins: [{ as: 'tipo_doc', ref: 'id_tipo_doc_iden', display: 'abreviatura' }, { as: 'nacionalidad', ref: 'id_nacionalidad', display: 'descripcion' }],
  modes: ['INSERT', 'UPDATE', 'DETAIL', 'CLONE'],
  rules: [{ name: 'docIdentidad', params: { sexo: 'sexo' } }, ...anexo.rules],
  validation: ['id_tipo_doc_iden', { rule: 'docIdentidad' }, 'numero_doc', 'ap_paterno', 'ap_materno', 'nombres', 'descripcion', 'id_nacionalidad', 'nro_licencia', 'direccion', 'sexo', 'telefono', 'celular'],
  constants: { flag_tipo_persona: 'N', ...anexo.constants },
  children: anexo.children,
  actions: anexo.actions,
});
