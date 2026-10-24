import { presets, TIPO_ANEXO } from '../presets.js';
import { referenceCatalog } from './reference.js';

const anexo = presets.anexo({ entity: 'Trabajador', tipoAnexo: TIPO_ANEXO.trabajador });
const DATE_MESSAGE = 'La fecha que has especificado no es válida. Compruébala e inténtalo de nuevo.';
/** A required text field with its desktop literal message (`isRegisterValid` shows a plain sentence, no M1 template). @param {string} name @param {string} label @param {string} message @param {Record<string, unknown>} extra */
const required = (name, label, message, extra) => ({ name, kind: 'text', label, required: true, message, ...extra });

/**
 * Trabajador, the first anexo-activation master with a perfil chain (`RegisterTrabajador`, `PanelTFTrabajador`, R-MST-4, S-MST-6..9). It replaces the W2 read-only
 * lookup behind the BuscarTrabajador picker without changing its contract (R-MST-17): the slug, the `id_trabajador` key, the `nombre` label, the tenant scope, the
 * `{ id, name }` options of the ACTIVE records and the seed rows stay, so UsuarioCorrelativo and TrabajadorPuntoVenta keep their W2 suites.
 * `isRegisterValid` checks, in this order and with plain sentences: the tipo (`Seleccione Tipo Trabajador`), the perfil (`Seleccione Trabajador Perfil`), the
 * apellidos and the nombres, the dni (`Ingrese Dni`, `IntegerDocument(10)`: digits, no 8-digit minimum) and the date (the generic invalid-date text). The perfil combo
 * lists the perfiles of the chosen tipo (`listarTipoTrabajadorPerfil(0, idTipo)`; the tipo combo is `listarTipoTrabajador("", "A")`) and is disabled and empty with no
 * tipo. `getBeanTrabajador` composes `nombre = paterno + " " + materno + " " + nombres` (the rule `nombreCompuesto`): [DEVIATION] from the order the spec
 * assumed from the W2 seed (`JUAN PEREZ LOPEZ`). `newRegister` opens on sexo M (the first radio), today and the `INICIO` activation; `chkEstado` is hidden, the
 * web port shows it read-only (R-ACT-5). `mantTrabajador` passes the session user AND empresa (stamp both), no tipo anexo (the placeholder `'9'` is
 * `[INFERRED]`, R-ANX-9), and `PanelTFTrabajador.focusLost` pads the code to five (`"00000" + id`): [DEVIATION] the web port keeps the three digits of the W2 seed codes (`001`), so a typed code still resolves in the BuscarTrabajador lookup. `executeDelete`
 * returns false: no DELETE. The list passes no empresa (tenant-wide), as the lookup always did.
 */
export const trabajadores = referenceCatalog({
  slug: 'trabajadores', idKey: 'id_trabajador', codeWidth: 3, entity: 'un Trabajador', formId: 'miTrabajador', title: 'Trabajador', descripcion: false,
  stamp: ['id_usuario', 'id_empresa'],
  optionLabel: 'nombre',
  fields: [
    {
      name: 'id_tipo_trabajador', kind: 'select', label: 'Tipo Trabajador', required: true, message: 'Seleccione Tipo Trabajador', source: { catalog: 'tipos-trabajador', where: { estado: true } },
    },
    {
      name: 'id_tipo_perfil', kind: 'select', label: 'Trabajador Perfil', required: true, message: 'Seleccione Trabajador Perfil', source: { catalog: 'tipos-trabajador-perfil' },
      dependsOn: [{ field: 'id_tipo_trabajador', filterKey: 'id_tipo_trabajador' }],
    },
    required('ap_paterno', 'Ap Paterno', 'Ingrese Apellido Paterno', { max: 50, normalize: ['upper'] }),
    required('ap_materno', 'Ap Materno', 'Ingrese Apellido Materno', { max: 50, normalize: ['upper'] }),
    required('nombres', 'Nombres', 'Ingrese Nombres', { max: 50, normalize: ['upper'] }),
    // The composed display name: hidden from the register and owned by the rule `nombreCompuesto` (a body never writes it).
    { name: 'nombre', kind: 'text', label: 'Nombre', max: 150 },
    { name: 'direccion', kind: 'text', label: 'Direccion', max: 300 },
    { name: 'email', kind: 'text', label: 'Email', max: 50 },
    { name: 'sexo', kind: 'options', label: 'Sexo', display: 'radio', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }], default: 'M' },
    { name: 'fecha_nac', kind: 'date', label: 'Fecha Nac', required: true, default: { INSERT: 'today' }, message: DATE_MESSAGE, messages: { date: DATE_MESSAGE } },
    required('dni', 'Dni', 'Ingrese Dni', { max: 10, normalize: ['digits'] }),
    { name: 'telefono', kind: 'text', label: 'Telf Fijo', max: 10, normalize: ['digits'] },
    { name: 'celular', kind: 'text', label: 'Telf Movil', max: 10, normalize: ['digits'] },
    { name: 'estado', preset: 'estado', label: 'Estado', readOnlyOn: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'] },
  ],
  columns: [
    { key: 'nombre', header: 'Nombre' }, { key: 'dni', header: 'DNI' }, { key: 'direccion', header: 'Dirección' }, { key: 'tipo_trabajador', header: 'Tipo Trabajador' },
    { key: 'estado', header: 'Estado', type: 'bool' },
  ],
  joins: [{ as: 'tipo_trabajador', ref: 'id_tipo_trabajador', display: 'descripcion' }, { as: 'perfil', ref: 'id_tipo_perfil', display: 'descripcion' }],
  modes: ['INSERT', 'UPDATE', 'DETAIL'],
  rules: [{ name: 'nombreCompuesto' }, ...anexo.rules],
  validation: ['id_tipo_trabajador', 'id_tipo_perfil', 'ap_paterno', 'ap_materno', 'nombres', 'dni', 'fecha_nac', 'direccion', 'email', 'sexo', 'telefono', 'celular'],
  constants: anexo.constants,
  children: anexo.children,
  actions: anexo.actions,
});
