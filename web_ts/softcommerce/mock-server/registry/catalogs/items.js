import { referenceCatalog } from './reference.js';

/**
 * Item, the product master (`PanelTFItem` / `RegisterItem`, R-MST-14, R-MST-15, D23, D27b). Wave 3 ports the tab `Datos de Item` (`getPnlNorth`, `getPnlUm`, `getPnlOtros`) and, in W3-19, the
 * `Configuracion Almacen` tab; the other tabs are deferred (R-MST-15). The Item belongs to the session empresa (`beanItem.setIdEmpresa(usuario.getCodempresa())`, `mantItem` also passes the
 * user), so it has empresa scope and stamps both; the code is the server's, padded to six [INFERRED] from the six-digit `Codigo` filter of `BuscarItemConversion`. `PanelTFItem.controlClone`
 * is empty: the modes are INSERT, UPDATE, DELETE and DETAIL. `isRegisterValid` (1883 to 1967) checks the Codigo Alternativo, the Familia, the Marca, the Descripcion, then U. Stock, U. Compra and
 * U. Venta, each with `Para {modo} un Item, debes especificar su ...`. Choosing the U. Stock sets the other two units to it and they stay disabled (`actionPerformed`: `cboUnidadCompra`
 * and `cboUnidadVenta` follow `cboUnidadStock`; `getBeanItem` sends one unit for the three): `follows`. A change of the tipo (`cboTipo`) selects No perecible, empties the dias and sets
 * Kardex and Serv.Transporte (disabled checkboxes: P is kardex, C neither, T transporte) and hides the perecible panel unless the tipo is Producto: `follows` plus `clearsOnChange`. The
 * Afecto a IGV combo (`loadIgv`) puts the company IGV percentage in Porc. IGV for AFECTO and `0`, read-only, for the others: `default '$params.PORC_IGV'`, `enabledWhen` and `follows`. Suj.
 * Percepcion and Porc. Perc are disabled (the Percepcion tab is deferred). The six prices are shown only with IS_ITEM_RESUMEN_PRECIO (`getPrecioItem`, `Util.getNumberBigDecimal` makes a
 * blank one 0) and Composicion and Funcion only with ISBOTICA or IS_BOTICA_SIN_LOTE (`getPnlUm`). [DEVIATION] D27b said `derive` for these values; a `derive` target cannot be a field, so
 * the new `follows` attribute carries them. The uniqueness of the Codigo Alternativo is a stored-procedure rule outside the repository [ASSUMPTION], with a new message.
 */
const ALL = ['INSERT', 'UPDATE', 'DELETE', 'DETAIL', 'CLONE'];
const CODIGO_ALTERNATIVO = 'El codigo alternativo ya existe.';
const PRECIO = { param: 'IS_ITEM_RESUMEN_PRECIO' };
const BOTICA = { param: 'ISBOTICA', or: ['IS_BOTICA_SIN_LOTE'] };
const COLUMNA = (/** @type {string} */ key, /** @type {string} */ header) => ({ key, header });

/** A decimal price of `Precio Soles` / `Precio Dolares`: optional, no validation, a blank is 0. @param {string} name @param {string} label */
const precio = (name, label) => ({ name, kind: 'number', label, scale: 2, gate: PRECIO, default: '0', blankToDefault: true });
const PRECIOS = [
  precio('precio_sol_tarjeta', 'Precio Soles - Tarjeta'), precio('precio_sol_publico', 'Precio Soles - Publico'), precio('precio_sol_mayor', 'Precio Soles - Mayor'),
  precio('precio_dol_tarjeta', 'Precio Dolares - Tarjeta'), precio('precio_dol_publico', 'Precio Dolares - Publico'), precio('precio_dol_mayor', 'Precio Dolares - Mayor'),
];
/** The unit selects over the active unidades de medida of the session empresa, shown by abreviatura. U. Compra and U. Venta follow the stock. @param {string} name @param {string} label @param {boolean} [follow] */
const unidad = (name, label, follow = true) => ({
  name, kind: 'select', label, required: true, source: { catalog: 'unidades-medida' }, ...(follow ? { follows: { field: 'id_um_stock' }, readOnlyOn: ALL } : {}),
});
/** A flag the form shows read-only. @param {string} name @param {string} label @param {Record<string, unknown>} more */
const flag = (name, label, more) => ({ name, kind: 'boolean', label, default: false, readOnlyOn: ALL, ...more });

/**
 * R-MST-15 the `Configuracion Almacen` tab (`getPnlConfigItemAlmacen`, `FormItemAlmacen`, `desactivarAlmacen`). The dialog `Agregar Almacen` asks Localidad (those of the session empresa:
 * `loadLocalidad(usuario.getCodempresa())`), Pto Venta, Almacen, Proceso (`VENTA`, `DESPACHO`, no blank item) and Fecha Inicio (today). `verificarValido` checks the four selects in that order
 * (`Seleccione Localidad`, `Seleccione Punto de Venta`, `Seleccione Almacen`, `Seleccione Proceso`) and then refuses an ACTIVE row of the grid with the same almacen and proceso
 * (`Almacen ya se Encuentra Activado`). The bean carries only the almacen, the proceso and the dates (`getXmlAlmacen`): the localidad and the punto de venta are stored here as well
 * ([DEVIATION], as the ZonaDistancia chain) so the cascade can be checked by the server. `desactivarAlmacen`: an empty grid answers nothing, no selection `Seleccionar Fila`, a deactivated row
 * `Almacen Seleccionado ya esta desactivado`, the question `Desea Desactivar Almacen?`; a pending row is removed, a persisted one gets `F_FIN` today and estado `D` (`closeDate`). The table model
 * has the columns ESTADO, ID, ALMACEN, F_INICIO, F_FIN and PROCESO (the ID is hidden here). The dialog title is `Agregar Almacen`; the web titles it by the tab like every child dialog.
 * The desktop has no stock minimo, maximo or ubicacion on this tab (`FormItemAlmacen` has five controls): none is ported.
 */
const ALMACEN_DUPLICADO = 'Almacen ya se Encuentra Activado';
const almacenes = {
  tab: 'Configuracion Almacen', removal: 'deactivate', entry: 'dialog', messages: { style: 'dialog' }, closeDate: 'f_fin',
  quitar: { none: 'Seleccionar Fila', confirm: 'Desea Desactivar Almacen?', already: 'Almacen Seleccionado ya esta desactivado' },
  fields: [
    { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, message: 'Seleccione Localidad', source: { catalog: 'localidades', where: { id_empresa: '$session.empresa' } } },
    { name: 'id_punto_venta', kind: 'select', label: 'Pto Venta', required: true, message: 'Seleccione Punto de Venta', source: { catalog: 'punto-venta' }, dependsOn: [{ field: 'id_localidad', filterKey: 'id_localidad' }] },
    { name: 'id_almacen', kind: 'select', label: 'Almacen', required: true, message: 'Seleccione Almacen', source: { catalog: 'almacenes' }, dependsOn: [{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }] },
    { name: 'proceso', kind: 'options', label: 'Proceso', required: true, message: 'Seleccione Proceso', default: 'VENTA', options: [{ value: 'VENTA', label: 'VENTA' }, { value: 'DESPACHO', label: 'DESPACHO' }] },
    { name: 'f_inicio', kind: 'date', label: 'Fecha Inicio', required: true, default: 'today' },
  ],
  unique: [{ fields: ['id_almacen', 'proceso'], errorField: 'id_almacen', message: ALMACEN_DUPLICADO }],
  validation: ['id_localidad', 'id_punto_venta', 'id_almacen', 'proceso', 'f_inicio', { unique: 0 }],
  joins: [{ as: 'almacen', ref: 'id_almacen', display: 'descripcion' }],
  columns: [{ key: 'almacen', header: 'ALMACEN' }, { key: 'f_inicio', header: 'F_INICIO', type: 'date' }, { key: 'f_fin', header: 'F_FIN', type: 'date' }, { key: 'proceso', header: 'PROCESO' }],
};

export const items = referenceCatalog({
  slug: 'items', idKey: 'id_item', codeWidth: 6, entity: 'un Item', formId: 'miItem', title: 'Item', scope: 'empresa', stamp: ['id_usuario', 'id_empresa'], descripcion: false, generalTab: 'Datos de Item',
  modes: ['INSERT', 'UPDATE', 'DELETE', 'DETAIL'],
  children: { almacenes },
  fields: [
    { name: 'id_alterno', kind: 'text', label: 'Cod. Alterno', required: true, max: 30, normalize: ['upper'], msgLabel: 'su Codigo Alternativo' },
    { name: 'id_familia', kind: 'select', label: 'Familia', required: true, source: { catalog: 'familias' } },
    { name: 'id_subfamilia', kind: 'select', label: 'SubFamilia', source: { catalog: 'subfamilias' }, dependsOn: [{ field: 'id_familia', filterKey: 'id_familia' }] },
    { name: 'codigo_barras', kind: 'text', label: 'Cod. Barras', max: 30 },
    { name: 'id_marca', kind: 'select', label: 'Marca', required: true, source: { catalog: 'marcas' } },
    { name: 'id_tamano', kind: 'select', label: 'Tamaño', source: { catalog: 'tamanos' } },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 255, normalize: ['upper'], msgLabel: 'su Descripcion' },
    {
      name: 'tipo', kind: 'options', label: 'Tipo', default: 'P', clearsOnChange: ['perecible', 'dias'],
      options: [{ value: 'P', label: 'Producto' }, { value: 'C', label: 'Concepto' }, { value: 'T', label: 'Transporte' }],
    },
    { name: 'perecible', kind: 'options', label: 'Perecible', display: 'radio', default: 'N', visibleWhen: { field: 'tipo', in: ['P'] }, options: [{ value: 'S', label: 'Perecible' }, { value: 'N', label: 'No perecible' }] },
    { name: 'dias', kind: 'number', label: 'dias |', scale: 0, max: 10, default: '0', normalize: ['digits'], visibleWhen: { field: 'tipo', in: ['P'] } },
    flag('kardex', 'Kardex', { default: true, follows: { field: 'tipo', map: { P: true }, otherwise: false } }),
    flag('serv_transporte', 'Serv.Transporte', { follows: { field: 'tipo', map: { T: true }, otherwise: false } }),
    { name: 'estado', kind: 'boolean', label: 'Item Activo', default: true },
    { name: 'codigo_clase_sunat', kind: 'select', label: 'Codigo Sunat', source: { catalog: 'clases-sunat' }, dependsOn: [{ field: 'id_subfamilia', filterKey: 'id_subfamilia' }] },
    { name: 'id_color', kind: 'select', label: 'Grupo', source: { catalog: 'colores' } },
    unidad('id_um_stock', 'U. Stock', false), unidad('id_um_compra', 'U. Compra'), unidad('id_um_venta', 'U. Venta'),
    { name: 'composicion', kind: 'text', label: 'Composicion', gate: BOTICA, max: 255, normalize: ['upper'] },
    { name: 'funcion', kind: 'text', label: 'Funcion', gate: BOTICA, max: 255, normalize: ['upper'] },
    ...PRECIOS,
    flag('flag_percepcion', 'Suj. Percepción', {}),
    {
      name: 'afecto_igv', kind: 'options', label: 'Afecto a IGV', default: 'AFECTO',
      options: [{ value: 'AFECTO', label: 'AFECTO' }, { value: 'INAFECTO', label: 'INAFECTO' }, { value: 'EXONERADO', label: 'EXONERADO' }],
    },
    {
      name: 'por_igv', kind: 'number', label: 'Porc. IGV', scale: 2, default: '$params.PORC_IGV', enabledWhen: { field: 'afecto_igv', in: ['AFECTO'] },
      follows: { field: 'afecto_igv', map: { AFECTO: '$params.PORC_IGV' }, otherwise: 0 },
    },
    { name: 'por_perc', kind: 'number', label: 'Porc. Perc', scale: 2, default: '0', readOnlyOn: ALL },
    { name: 'stock_min', kind: 'number', label: 'Stock Min', scale: 2, default: '0', blankToDefault: true },
  ],
  columns: [
    COLUMNA('id_alterno', 'COD ALT'), COLUMNA('descripcion', 'DESC'), COLUMNA('um_compra', 'UM_COMPRA'), COLUMNA('um_venta', 'UM_VENTA'), COLUMNA('um_stock', 'UM_STOCK'),
    COLUMNA('familia', 'FAMILIA'), COLUMNA('subfamilia', 'SUB_FAMILIA'), COLUMNA('marca', 'MARCA'),
    ...[['precio_sol_tarjeta', 'TARJETA SOL'], ['precio_sol_publico', 'PUBLICO SOL'], ['precio_sol_mayor', 'MAYORISTA SOL'], ['precio_dol_tarjeta', 'TARJETA DOL'], ['precio_dol_publico', 'PUBLICO DOL'], ['precio_dol_mayor', 'MAYORISTA DOL']]
      .map(([key, header]) => ({ ...COLUMNA(key, header), type: 'dec', gate: PRECIO })),
    { ...COLUMNA('estado', 'ESTADO'), type: 'bool' },
  ],
  joins: [
    { as: 'familia', ref: 'id_familia', display: 'descripcion' }, { as: 'subfamilia', ref: 'id_subfamilia', display: 'descripcion' }, { as: 'marca', ref: 'id_marca', display: 'descripcion' },
    { as: 'um_stock', ref: 'id_um_stock', display: 'abreviatura' }, { as: 'um_compra', ref: 'id_um_compra', display: 'abreviatura' }, { as: 'um_venta', ref: 'id_um_venta', display: 'abreviatura' },
  ],
  // The exact keys the `BuscarItemConversion` selects send (Familia, SubFamilia, Marca).
  lookupFilters: { id_familia: {}, id_subfamilia: {}, id_marca: {} },
  unique: [{ fields: ['id_alterno'], errorField: 'id_alterno', message: CODIGO_ALTERNATIVO }],
  validation: [
    'id_alterno', 'id_familia', 'id_marca', 'descripcion', 'id_um_stock', 'id_um_compra', 'id_um_venta', 'id_subfamilia', 'id_tamano', 'id_color', 'codigo_clase_sunat', 'codigo_barras', 'tipo', 'perecible', 'dias',
    'kardex', 'serv_transporte', 'afecto_igv', 'por_igv', 'flag_percepcion', 'por_perc', 'stock_min', 'composicion', 'funcion', ...PRECIOS.map((f) => f.name), 'estado', { unique: 0 },
  ],
});
