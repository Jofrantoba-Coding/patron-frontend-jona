import { presets, TIPO_ANEXO } from '../presets.js';
import { anexoIdentity } from './anexo-identidad.js';
import { referenceCatalog } from './reference.js';

/**
 * Proveedor, the anexo master (`RegisterProveedorNuevo` / `PanelTFProveedorNuevo`, R-MST-2, R-MST-13, R-ANX-1..5, R-ANX-7, R-ANX-8). The person block of R-MST-2 (entity
 * `un Proveedor`; the form opens with no tipo de documento and PERUANA: `newRegister`), the activation history with its Activar and Desactivar, and the `Padrones` tab with
 * the three read-only flags it derives (`A Percepcion`, `A Retencion`, `Buen Contribuyente`). The tabs are `General`, `Activación de Proveedor` and `Padrones`; the legacy
 * `RegisterProveedor` (address grid, `FormConfigPadronProveedor`) is not ported (R-MST-13). `mantProveedor` passes the session user and no empresa (tenant scope, user stamp)
 * and no tipo anexo: `"1"` is [INFERRED] from `FormAnexoPadron(..., 1, ...)`, which the register opens for the Proveedor; the desktop pads no code (`PanelTFProveedorNuevo.focusLost`
 * is empty), so the width 10 of every anexo master is [INFERRED] too. `executeDelete` returns false, so DELETE answers 405 `MODE_NOT_SUPPORTED`, and the panel has no clone or
 * detail handler: the modes are INSERT and UPDATE. The estado is derived from the last activation (R-ACT-5, the `activacion` rule owns it) and the flags from the active padron rows
 * (R-ANX-8, the `padron` rule owns them); the desktop disables their checkboxes, the web port shows them read-only.
 * [DEVIATION] the padron flag mapping is by padron id (the desktop set Buen Contribuyente for `01` when adding and `04` when removing, and sent any other id to A Percepcion).
 */
const anexo = presets.anexo({ entity: 'Proveedor', tipoAnexo: TIPO_ANEXO.proveedor });
const padron = presets.padron({ master: 'proveedor' });
const identity = anexoIdentity('un Proveedor');

export const proveedores = referenceCatalog({
  slug: 'proveedores', idKey: 'id_proveedor', codeWidth: anexo.codeWidth, entity: 'un Proveedor', formId: 'miProveedor', title: 'Proveedor', descripcion: false,
  fields: [...identity.fields, { name: 'estado', preset: 'estado', label: 'Estado', readOnlyOn: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] }, ...padron.fields],
  columns: [
    { key: 'flag_tipo_persona', header: 'T_PERSONA' }, { key: 'descripcion', header: 'RAZON SOCIAL' }, { key: 'ap_paterno', header: 'PATERNO' }, { key: 'ap_materno', header: 'MATERNO' }, { key: 'nombres', header: 'NOMBRES' },
    { key: 'numero_doc', header: 'RUC/DNI' }, { key: 'direccion', header: 'DIRECCION' },
  ],
  joins: identity.joins,
  modes: ['INSERT', 'UPDATE'],
  rules: [...identity.rules, ...anexo.rules, ...padron.rules],
  validation: identity.validation,
  constants: anexo.constants,
  children: { ...anexo.children, ...padron.children },
  actions: anexo.actions,
});
