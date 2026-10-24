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
 * is restored); the padron flags the desktop loads and sends without a tab are not ported (R-MST-3).
 * The `Vehiculo` tab (`getPanelVehiculo`) is the W2 vehiculos section seen through the propietario (R-MST-6, S-REG-30): the entry sits above the grid (`entry: 'inline'`) with
 * the five fields of `agregarVehiculo` in its order and its sentences (`Ingrese Constancia`, `Ingrese Placa`, `Ingrese Peso`, `Seleccione Marca`, `Seleccione Modelo`),
 * `quitarVehiculo` marks a persisted row `E` (`removal: 'delete'`), and the grid shows CODIGO, PLACA, CONSTANCIA INSCRIPCION, MARCA and MODELO (the other `VehiculoTableModel`
 * columns are hidden). `loadRegister` lists `listarVehiculo("", idTransportista, "A")`.
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
  children: {
    ...anexo.children,
    vehiculos: {
      tab: 'Vehiculo', entry: 'inline', removal: 'delete', store: { entry: 'vehiculos', key: 'id_anexo_empresa_transportista' },
      quitar: { none: 'Seleccione Vehiculo', confirm: 'Desea Quitar el Vehiculo?' },
      columns: [
        { key: 'id_vehiculo', header: 'CODIGO' }, { key: 'placa', header: 'PLACA' }, { key: 'constancia_inscripcion', header: 'CONSTANCIA INSCRIPCION' },
        { key: 'marca', header: 'MARCA' }, { key: 'modelo', header: 'MODELO' },
      ],
      entryFields: [
        { name: 'constancia_inscripcion', message: 'Ingrese Constancia' }, { name: 'placa', message: 'Ingrese Placa' }, { name: 'peso', message: 'Ingrese Peso' },
        { name: 'id_marca', message: 'Seleccione Marca' }, { name: 'id_modelo', message: 'Seleccione Modelo' },
      ],
    },
  },
  actions: anexo.actions,
});
