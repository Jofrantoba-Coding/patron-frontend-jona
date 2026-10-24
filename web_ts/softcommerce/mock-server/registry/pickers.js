/**
 * Named picker configs (D2, R-LKP-7): one per desktop search dialog, read from the `Buscar*` / `FormBuscar*` / `Panel*` method bodies under
 * `view/formularios` and from their table models. A `lookup` field names one (`picker: 'buscarTrabajador'`) and the schema expands it at load into
 * the R-REG-13 attributes `search`, `columns` and `filters`, so the UI, the HTTP mock and the in-browser mock read the same declaration.
 *
 * A picker is `{ title, source, columns, filters, pickLabel, search, where?, extras?, refresh? }`:
 * - `title`: the dialog title, or the tab title where the desktop set none (`BuscarTrabajador` has neither, so it is empty).
 * - `columns`: the visible columns in the order the desktop shows them (`setNoVisibleColumn` and `moveColumn`), without the row counter `N°`.
 * - `filters`: `text` (contains; `upper`, `digits`, `max` are the desktop document rules) or `select` (exact key over the catalog `source`, optionally
 *   `dependsOn` another filter). `field` is the key the dialog sends: a field or joined display key of the source (R-MOCK-20).
 * - `search`: the text filter fields (the free-text `q` of R-MOCK-20 looks in them).
 * - `refresh`: the dialog has the `Refrescar` button. `extras`: inputs the dialog adds beside the filters (`BuscarItemConversion`).
 *
 * Several field names of the sources that arrive later (`clientes`, `vehiculos`, `items`, `parametros-prov`) are [INFERRED]: the registered entry decides them
 * and `pickers.spec.ts` checks every picker against its source once it exists.
 */

/** @returns {PickerFilter} */
const text = (/** @type {string} */ field, /** @type {string} */ label, /** @type {Record<string, any>} */ rules = {}) => ({ field, label, type: 'text', ...rules });
/** @returns {PickerFilter} */
const select = (/** @type {string} */ field, /** @type {string} */ label, /** @type {string} */ source, /** @type {Record<string, any>} */ more = {}) => ({ field, label, type: 'select', source, ...more });
const column = (/** @type {string} */ key, /** @type {string} */ header) => ({ key, header });
const digits = (/** @type {number} */ max) => ({ digits: true, max });
const upper = (/** @type {number} */ max) => ({ upper: true, max });

/** @param {Omit<Picker, 'search'>} picker @returns {Picker} */
const picker = (picker) => ({ ...picker, search: picker.filters.filter((f) => f.type === 'text').map((f) => f.field) });

/**
 * @typedef {{ field: string, label: string, type: 'text'|'select', source?: string, upper?: boolean, digits?: boolean, max?: number, dependsOn?: { field: string, filterKey: string } }} PickerFilter
 * @typedef {{ title: string, source: string, columns: { key: string, header: string }[], filters: PickerFilter[], pickLabel: string, search: string[],
 *   where?: Record<string, any>, extras?: { name: string, label: string, type: 'decimal', default: string }[], refresh?: boolean }} Picker
 * @type {Record<string, Picker>}
 */
export const PICKERS = {
  // BuscarTrabajador: Código (IntegerDocument 10), R. Social (UpperCaseNumberDocument 255), RUC/DNI (IntegerDocument 11). Columns: DNI, COD., NOMBRE, DIRECCION,
  // TELEFONO, CELULAR, AREA, EMPRESA (TrabajadorTableModel after the two `moveColumn` calls). Its other filters never applied to a trabajador and are dropped.
  buscarTrabajador: picker({
    title: '', source: 'trabajadores', pickLabel: 'Agregar', refresh: true,
    filters: [text('id_trabajador', 'Código', digits(10)), text('nombre', 'R. Social', upper(255)), text('dni', 'RUC/DNI', digits(11))],
    columns: [column('dni', 'DNI'), column('id_trabajador', 'COD.'), column('nombre', 'NOMBRE'), column('direccion', 'DIRECCION'), column('telefono', 'TELEFONO'),
      column('celular', 'CELULAR'), column('tipo_trabajador', 'AREA'), column('empresa', 'EMPRESA')],
  }),
  // PanelCargarTrabajador (Vendedor): Nombres (UpperCaseNumberDocument 255), DNI and Direccion take any text.
  panelCargarTrabajador: picker({
    title: 'Trabajador', source: 'trabajadores', pickLabel: 'Agregar',
    filters: [text('nombre', 'Nombres', upper(255)), text('dni', 'DNI'), text('direccion', 'Direccion')],
    columns: [column('id_trabajador', 'COD.'), column('nombre', 'NOMBRE'), column('direccion', 'DIRECCION'), column('dni', 'DNI'), column('telefono', 'TELEFONO'),
      column('celular', 'CELULAR'), column('punto_venta', 'PUNTO VENTA')],
  }),
  // BuscarCliente: Código (IntegerDocument 11), Desc. (UpperCaseNumberDocument 255), DNI/RUC (IntegerDocument 11), Clasificación, Direccion (any text).
  // The classification combo of the desktop lists vendedores under `--- SELECCIONE VENDEDOR ---`: a copy-paste defect, so it is over `clasif-clientes` (R-LKP-7).
  buscarCliente: picker({
    title: 'Cliente', source: 'clientes', pickLabel: 'Agregar',
    filters: [text('id_cliente', 'Código', digits(11)), text('razon_social', 'Desc.', upper(255)), text('numero_documento', 'DNI/RUC', digits(11)),
      select('id_clasificacion', 'Clasificación', 'clasif-clientes'), text('direccion', 'Direccion')],
    columns: [column('id_cliente', 'COD'), column('razon_social', 'RAZON SOCIAL'), column('numero_documento', 'RUC/DNI'), column('direccion', 'DIRECCION'),
      column('bc', 'BC'), column('ar', 'AR'), column('ex', 'EX'), column('cant_sust', 'CANT SUST')],
  }),
  // FormClienteBuscar: Codigo (IntegerDocument 10), Desc. (UpperCaseNumberDocument 100), RUC/DNI (IntegerDocument 11); `listarCliente("A")` lists active clientes.
  formClienteBuscar: picker({
    title: 'Buscar Cliente', source: 'clientes', pickLabel: 'Agregar',
    filters: [text('id_cliente', 'Codigo', digits(10)), text('razon_social', 'Desc.', upper(100)), text('numero_documento', 'RUC/DNI', digits(11))],
    columns: [column('id_cliente', 'COD'), column('razon_social', 'RAZON SOCIAL'), column('numero_documento', 'RUC/DNI'), column('direccion', 'DIRECCION'),
      column('ap', 'AP'), column('ar', 'AR'), column('ex', 'EX'), column('cant_sust', 'CANT_SUST'), column('condicion_pago', 'CONDICION PAGO'), column('numero_dias', 'NUMERO DIAS')],
  }),
  // FormBuscarVehiculo: Codigo (IntegerDocument 10), Transportista (UpperCaseNumberDocument 50), Marca, RUC/DNI (IntegerDocument 11), Constancia Inscr and Placa
  // (UpperCaseNumberDocument 30), Modelo. Marca and Modelo list the rows with estado A. `transportista` and its RUC are joined display keys (R-LKP-3).
  formBuscarVehiculo: picker({
    title: 'Buscar Vehiculo', source: 'vehiculos', pickLabel: 'Agregar', refresh: true,
    filters: [text('id_vehiculo', 'Codigo', digits(10)), text('transportista', 'Transportista', upper(50)), select('id_marca', 'Marca', 'marcas-vehiculo'),
      text('transportista_ruc', 'RUC/DNI', digits(11)), text('constancia_inscripcion', 'Constancia Inscr', upper(30)), text('placa', 'Placa', upper(30)),
      select('id_modelo', 'Modelo', 'modelos-vehiculo')],
    columns: [column('id_vehiculo', 'CODIGO'), column('transportista', 'TRANSPORTE'), column('transportista_ruc', 'DNI/RUC'), column('placa', 'PLACA'),
      column('constancia_inscripcion', 'CONSTANCIA INSCRIPCION'), column('marca', 'MARCA'), column('modelo', 'MODELO')],
  }),
  // BuscarParametroProv: Código (IntegerDocument 10), Descripción (UpperCaseNumberDocument 255). The tab is titled `Provisiones`. The desktop lists
  // `listarParametroProv("", "C", "", "S", ...)`: tipo `C` (the flag `S` is not named in the repository, [INFERRED]). The pick returns a host-chosen column.
  buscarParametroProv: picker({
    title: 'Provisiones', source: 'parametros-prov', pickLabel: 'Agregar', refresh: true, where: { tipo: 'C' },
    filters: [text('id_parametro_prov', 'Código', digits(10)), text('descripcion', 'Descripción', upper(255))],
    columns: [column('id_parametro_prov', 'CODIGO'), column('descripcion', 'DESC PARAMETRO'), column('cuenta', 'CUENTA'), column('flag_compra', 'COMPRA'),
      column('flag_venta', 'VENTA'), column('flag_tesoreria', 'TESORERIA'), column('flag_fondo_fijo', 'FONDO FIJO')],
  }),
  // BuscarItemConversion: Código and Código Alt. (IntegerDocument 6), Desc. (UpperCaseNumberDocument 255), Familia, SubFamilia (by familia), Marca. The three
  // extras are DoubleDocument inputs that open at 0.0, 0.0 and 1.0. The desktop also shows the unit, percepción and price columns, left to the Item master.
  buscarItemConversion: picker({
    title: 'Item a convertir', source: 'items', pickLabel: 'Agregar', refresh: true,
    filters: [text('id_item', 'Código', digits(6)), text('codigo_alterno', 'Código Alt.', digits(6)), text('descripcion', 'Desc.', upper(255)),
      select('id_familia', 'Familia', 'familias'), select('id_subfamilia', 'SubFamilia', 'subfamilias', { dependsOn: { field: 'id_familia', filterKey: 'id_familia' } }),
      select('id_marca', 'Marca', 'marcas')],
    columns: [column('id_item', 'COD'), column('codigo_alterno', 'COD ALT'), column('descripcion', 'DESC'), column('familia', 'FAMILIA'),
      column('subfamilia', 'SUB_FAMILIA'), column('marca', 'MARCA')],
    extras: [
      { name: 'valor_conversion', label: 'VALOR DE CONVERSION', type: 'decimal', default: '0.0' },
      { name: 'valor_paquete', label: 'VALOR DE PAQUETE', type: 'decimal', default: '0.0' },
      { name: 'valor_origen', label: 'VALOR DE ORIGEN', type: 'decimal', default: '1.0' },
    ],
  }),
};
