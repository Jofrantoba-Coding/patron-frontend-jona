import { referenceCatalog } from './reference.js';

/**
 * TrabajadorPuntoVenta (`RegisterTrabajadorPuntoVenta`, R-REF-6, S-REF-21): which punto de venta a worker is assigned to. The checks are the trabajador, the
 * empresa, the localidad and the punto de venta, then the (trabajador, punto de venta) pair, with the `label` sentence (`Para {modo} un Trabajador, debes
 * especificar su Nombre.`, `la Empresa`, `la Localidad`, `su Punto de Venta`). [DEVIATION] the desktop words the empresa, localidad and punto de venta
 * messages with "un Correlativo" (a copy of the correlativo form); the web port names the Trabajador, and the desktop skips the pair check on CLONE, the
 * generic create applies it. The trabajador is picked in the `BuscarTrabajador` dialog on the desktop, a plain select here (R-REF-12). The chain is empresa
 * (`listarEmpresa("")`, every one) > localidad (`listar("", empresa, ...)`) > punto de venta (`listar("", "", localidad, ...)`). `insertar` / `modificar` pass the
 * trabajador, the punto de venta, the session user and habilitar, and no empresa (the empresa follows the chosen punto de venta), while
 * `PanelTFTrabajadorPuntoVenta.cargarTabla` lists the session empresa; the web list stays tenant-wide (no list-only scope exists in the core, as for
 * punto-venta), so only the user is stamped. The empresa and the localidad are stored although the desktop keeps only the punto de venta: the form needs
 * them to restore its chain. Habilitar starts unchecked and is stored S / N by the desktop, a boolean here. The id pads to five (`"00000" + code`).
 */
export const trabajadorPuntoVenta = referenceCatalog({
  slug: 'trabajador-punto-venta', idKey: 'id_trabajador_punto_venta', codeWidth: 5, entity: 'un Trabajador', formId: 'miTrabajadorPuntoVenta',
  title: 'Trabajador - PuntoVenta', style: 'label', descripcion: false,
  fields: [
    { name: 'id_trabajador', kind: 'select', label: 'Trabajador', required: true, msgLabel: 'su Nombre', source: { catalog: 'trabajadores' } },
    { name: 'id_empresa', kind: 'select', label: 'Empresa', required: true, msgLabel: 'la Empresa', source: { catalog: 'empresa' } },
    { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, msgLabel: 'la Localidad', source: { catalog: 'localidades' }, dependsOn: [{ field: 'id_empresa', filterKey: 'id_empresa' }] },
    { name: 'id_punto_venta', kind: 'select', label: 'Punto de Venta', required: true, msgLabel: 'su Punto de Venta', source: { catalog: 'punto-venta' }, dependsOn: [{ field: 'id_localidad', filterKey: 'id_localidad' }] },
    { name: 'habilitar', kind: 'boolean', label: 'Habilitar', default: false },
  ],
  columns: [
    { key: 'localidad', header: 'Local' }, { key: 'punto_venta', header: 'P Venta' }, { key: 'trabajador', header: 'Nombre' },
    { key: 'empresa', header: 'Empresa' }, { key: 'habilitar', header: 'Habilitado', type: 'bool' },
  ],
  joins: [
    { as: 'trabajador', ref: 'id_trabajador', display: 'nombre' },
    { as: 'empresa', ref: 'id_empresa', display: 'name' },
    { as: 'localidad', ref: 'id_localidad', display: 'descripcion' },
    { as: 'punto_venta', ref: 'id_punto_venta', display: 'name' },
  ],
  unique: [{
    fields: ['id_trabajador', 'id_punto_venta'], errorField: 'id_trabajador',
    message: 'El Trabajador ya se encuentra asignado al punto de venta especificado. Compruébala e inténtalo de nuevo',
  }],
  validation: ['id_trabajador', 'id_empresa', 'id_localidad', 'id_punto_venta', { unique: 0 }, 'habilitar'],
});
