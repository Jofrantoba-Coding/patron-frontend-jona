import { presets, TIPO_ANEXO } from '../presets.js';
import { anexoIdentity } from './anexo-identidad.js';
import { referenceCatalog } from './reference.js';

/**
 * Banco, the anexo master (`RegisterBancoAnexo` / `PanelTFBanco`, R-MST-1..3, R-ANX-1..5). The pilot of the shared anexo preset: the person block of R-MST-2
 * (entity `un Banco`, opening on RUC and PERUANA: `newRegister`) and the activation history with its Activar and Desactivar. `mantBanco` passes the session
 * user and no empresa (tenant scope, user stamp) and the tipo anexo `"3"` (`PanelTFBanco.cargarTabla` lists `listAnexo("3", ...)`); the code is padded to ten
 * (`PanelTFBanco.focusLost`). `executeDelete` returns false, so DELETE answers 405 `MODE_NOT_SUPPORTED`. The estado is derived from the last activation
 * (R-ACT-5, the `activacion` rule owns it); the desktop hides its checkbox, the web port shows it read-only.
 * [DEVIATION] the tipo-document sentence names `un Banco` (the desktop said `un Cliente`); UPDATE restores the stored nacionalidad and tipo (the desktop
 * forced `PERUANA`); the padron flags the desktop loaded and sent without a tab are not ported (R-MST-3).
 */
const anexo = presets.anexo({ entity: 'Banco', tipoAnexo: TIPO_ANEXO.banco });
const identity = anexoIdentity('un Banco', { tipo: '05' });

export const bancos = referenceCatalog({
  slug: 'bancos', idKey: 'id_banco', codeWidth: anexo.codeWidth, entity: 'un Banco', formId: 'miBancoAnexo', title: 'Banco', descripcion: false,
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
