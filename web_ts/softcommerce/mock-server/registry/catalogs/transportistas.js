import { presets, TIPO_ANEXO } from '../presets.js';
import { anexoIdentity } from './anexo-identidad.js';
import { referenceCatalog } from './reference.js';

/**
 * Transportista, the anexo master (`RegisterTransportistaNuevo` / `PanelTFTransportista`, R-MST-1, R-MST-2, R-MST-5, R-ANX-1..5). The person block of R-MST-2 (entity
 * `un Transportista`, opening on RUC and PERUANA: `newRegister`) and the activation history with its Activar and Desactivar. `mantTransportista` passes the session
 * user and no empresa (tenant scope, user stamp); the tipo anexo is `"6"` (`PanelTFTransportista.cargarTabla` lists `listAnexo("6", ...)`, the same call Banco makes with
 * `"3"` and Chofer with `"7"`); the code is padded to ten (`PanelTFTransportista.focusLost`). `executeDelete` returns false, so DELETE answers 405
 * `MODE_NOT_SUPPORTED`. The estado is derived from the last activation (R-ACT-5, the `activacion` rule owns it); the desktop hides its checkbox, the web port shows it read-only.
 * [DEVIATION] `isRegisterValid` words the tipo-document sentence `un Cliente` (it names `un Transportista`), and `loadRegister` forces `PERUANA` on UPDATE (the stored nacionalidad
 * is restored); the padron flags the desktop loads and sends without a tab are not ported (R-MST-3). The `Vehiculos` grid comes with W3-10b (R-MST-5, R-MST-6).
 */
const anexo = presets.anexo({ entity: 'Transportista', tipoAnexo: TIPO_ANEXO.transportista });
const identity = anexoIdentity('un Transportista', { tipo: '05' });

export const transportistas = referenceCatalog({
  slug: 'transportistas', idKey: 'id_transportista', codeWidth: anexo.codeWidth, entity: 'un Transportista', formId: 'miTransportista', title: 'Transportista', descripcion: false,
  fields: [...identity.fields, { name: 'estado', preset: 'estado', label: 'Estado', readOnlyOn: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] }],
  columns: [
    { key: 'descripcion', header: 'Razón Social' }, { key: 'tipo_doc', header: 'Tipo Doc' }, { key: 'numero_doc', header: 'RUC/DNI' }, { key: 'estado', header: 'Estado', type: 'bool' },
  ],
  joins: identity.joins,
  modes: ['INSERT', 'UPDATE', 'DETAIL', 'CLONE'],
  rules: [...identity.rules, ...anexo.rules],
  validation: identity.validation,
  constants: anexo.constants,
  children: anexo.children,
  actions: anexo.actions,
});
