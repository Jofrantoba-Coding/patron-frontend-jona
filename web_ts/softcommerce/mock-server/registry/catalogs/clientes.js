import { presets, TIPO_ANEXO } from '../presets.js';
import { anexoIdentity } from './anexo-identidad.js';
import { referenceCatalog } from './reference.js';

/**
 * Cliente, the anexo master (`RegisterClienteNuevo` / `PanelTFClienteNuevo`, R-MST-1, R-MST-2, R-MST-10, R-ANX-1..5). The person block of R-MST-2 (entity `un Cliente`; the
 * form opens with no tipo de documento and PERUANA: `newRegister`) plus the `Tipo Cliente` select and the activation history with its Activar and Desactivar. `isRegisterValid`
 * checks the tipo de documento, the DNI / RUC steps, the razon social, then the tipo de cliente (skipped when the tipo de documento is `OTROS`), then the nacionalidad.
 * `mantCliente` passes the session user and no empresa (tenant scope, user stamp: `cs.setString(23, idUsuario)`); the tipo anexo `"2"` and the code width 10 are [INFERRED]
 * as the Proveedor's (`PanelTFClienteNuevo` pads nothing and `mantCliente` passes no tipo anexo; `FormAnexoPadron(..., 2, ...)` is the only evidence). `executeDelete`
 * returns false and the panel has no clone or detail handler: the modes are INSERT and UPDATE. The estado is derived from the last activation (R-ACT-5, the `activacion` rule
 * owns it); the desktop disables its checkbox, the web port shows it read-only. [DEVIATION] the desktop selects the first tipo de cliente when it loads the combo
 * (`setSelectedIndex(1)`), the web register opens on `--- Seleccione ---` so the sentence stays reachable (R-MST-10). The padron flags, the sustitutos, the credit tabs and
 * the padrones come with W3-17; the direcciones, contactos and cuentas with W3-16b.
 */
const anexo = presets.anexo({ entity: 'Cliente', tipoAnexo: TIPO_ANEXO.cliente });
const identity = anexoIdentity('un Cliente');

// `isRegisterValid` skips the tipo de cliente when the selected tipo de documento is `OTROS`. No seeded tipo is OTROS [INFERRED], so the condition lists the ids the tipo
// select offers (persona and estado: DNI, CE, RUC); the id of OTROS arrives with the W6 catalog and stays out of this list.
const TIPOS_CON_CLASIF = ['01', '04', '05'];
const tipoCliente = {
  name: 'id_clasif_cliente', kind: 'select', label: 'Tipo Cliente', requiredWhen: { field: 'id_tipo_doc_iden', in: TIPOS_CON_CLASIF },
  message: 'Para {modo} un Cliente, debes Seleccionar un Tipo de Cliente.', source: { catalog: 'clasif-clientes', where: { estado: true } },
};
// The desktop General tab shows the tipo de cliente before the nacionalidad.
const fields = identity.fields.flatMap((f) => (f.name === 'id_nacionalidad' ? [tipoCliente, f] : [f]));
const validation = identity.validation.flatMap((step) => (step === 'id_nacionalidad' ? ['id_clasif_cliente', step] : [step]));

export const clientes = referenceCatalog({
  slug: 'clientes', idKey: 'id_cliente', codeWidth: anexo.codeWidth, entity: 'un Cliente', formId: 'miCliente', title: 'Cliente', descripcion: false,
  fields: [...fields, { name: 'estado', preset: 'estado', label: 'Estado', readOnlyOn: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] }],
  columns: [
    { key: 'flag_tipo_persona', header: 'T_PERSONA' }, { key: 'descripcion', header: 'RAZON SOCIAL' }, { key: 'ap_paterno', header: 'PATERNO' }, { key: 'ap_materno', header: 'MATERNO' }, { key: 'nombres', header: 'NOMBRES' },
    { key: 'numero_doc', header: 'RUC/DNI' }, { key: 'direccion', header: 'DIRECCION' },
  ],
  joins: identity.joins,
  // The BuscarCliente picker filters by the tipo de cliente, an exact key.
  lookupFilters: { id_clasif_cliente: {} },
  modes: ['INSERT', 'UPDATE'],
  rules: [...identity.rules, ...anexo.rules],
  validation,
  constants: anexo.constants,
  children: anexo.children,
  actions: anexo.actions,
});
