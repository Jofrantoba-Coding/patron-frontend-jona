# Spec: softcommerce-reference-catalogs

NEW capability. The 38 Wave 2 reference catalogs (12 T1 + 11 T2 + 15 T3), each ported from its desktop `Register*.java` (`desktop_java/softcommerce-desktop/src/com/develtrex/softcommerce/view/formularios/`) with exact rules, max lengths and required fields. The mock defines the contract. Technical names (slugs, field names) are proposed by this spec.
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise. **[DEVIATION]** = a desktop defect that the user decided to FIX in the web port (the fixed behavior is the spec). Wire conventions follow design.md: selects load from `GET /v1/lookups/{catalog}?<field>=` (R-MOCK-16), field kinds are `code`, `select`, `options`, `boolean`, `number` (scale), `date`, `text`. `codeWidth` is declared per catalog and the per-catalog widths MUST be read from the desktop at apply time (W1 Localidad stays unpadded). Where the repository holds no desktop evidence (no SQL, no pad logic in `Register*`/`Pnl*`/DAOs) the width is inferred and flagged for W6 (design Open Questions). Message gender and spelling of the desktop entities are kept as on the desktop unless a row marks them **[DEVIATION]**. Menu leaves, formIds and titles come from `MenuBarSystemDinamico.java` where it names them; otherwise they are proposals.

## Requirements

### R-REF-1 Scope and done bar
Each catalog in R-REF-4..R-REF-6 MUST be a registry entry (softcommerce-catalog-registry) and MUST satisfy: list with joined and formatted columns hiding inactive records; every mode in its `modes` (default INSERT, UPDATE, DELETE, DETAIL, CLONE); the 13 permission flags gating the toolbar; the Alt+letter shortcuts of R-CRUD-10; and identical behavior against the HTTP mock and the in-browser mock (R-REF-13). Reports, printing, export and the Moneda / TipoDocIden / SUNAT screens are out of scope.

### R-REF-2 Notation and common field rules
In the catalog tables (`bool` = kind `boolean`, `dec` = kind `number` with scale > 0, `#` = digits-only `number`/`text`): `*` required (blank after trim is an error); `U` uppercase on input; `L` lowercase on input; `#` digits only; `≤n` max length with S-CRUD-14 semantics; `Pn` left-pad with zeros to n characters on blur; `sel(x)` select over lookup `x`; `opt(a|b)` static options; `← f` options depend on parent field `f` (R-CRUD-12). Fields are listed in desktop validation order; the first failing field is reported first and focused. Text is trimmed before it is sent. Every catalog also has the server code `id_*` as a `code` field (R-CRUD-14; hidden in INSERT) and the logical-delete flag `activo` (R-MOCK-7); neither is editable.

### R-REF-3 Messages and session-derived values
Required-field messages MUST use the desktop templates, with `{modo}` = `agregar` (INSERT), `clonar` (CLONE), `modificar` (UPDATE), `eliminar` (DELETE):
- **M1** (default): `Para {modo} {entity}, debes especificar su {Campo}.`
- **M2** (no entity): `Para {modo}, debes especificar su {Campo}.`
- **MS** (select verb, where the table says so): `Para {modo} {entity}, debes Seleccionar {un|una} {Campo}.`
Any other literal message is given in the table. Copy-paste errors of the desktop (wrong entity or field name) are normalized to the real entity and field **[DEVIATION]**. The user id (`id_usuario`) and, for catalogs marked `scope=empresa`, the empresa MUST come from the authenticated session and MUST NOT be sent by the client.

The `estado` field (`bool`, label Activo), where listed: INSERT = true and read-only; CLONE = copied from the source and read-only; UPDATE = editable; DETAIL/DELETE = read-only.

### R-REF-4 T1 catalogs (12), text only
All have `descripcion`. Message style M1 unless noted.

| Slug | Entity | Fields | Notes | Desktop source |
|---|---|---|---|---|
| aduanas | un Aduana | descripcion* ≤100 | not uppercased (LimitDocument) | RegisterAduana |
| colores | un Color | descripcion* U ≤100 | | RegisterColor |
| clasif-clientes | una Clasif Cliente | descripcion* U ≤100; estado | | RegisterClasifCliente |
| clasif-inventarios | un Tipo de Movimiento de Inventario | descripcion* U ≤100; abrev* U ≤100 (Abreviatura); tipo* opt(E:Entrada\|S:Salida) (Tipo de Movimiento) | no default for tipo | RegisterClasifInventario |
| condiciones-pago | una Condición de Pago | descripcion* U ≤255 (Descripción); dias_pago* # ≤2 (Dias de Pago); tipo* opt(CR:Crédito\|CO:Contado\|OB:Operación Bancaria\|TA:Tarjeta) (Tipo de Pago) | no default for tipo; `0` is a valid dias_pago | RegisterCondicionPago |
| estados-documento | un Estado de Documento | descripcion* U ≤100 | | RegisterEstadoDocumento |
| laboratorios | un Laboratorio | descripcion* U ≤100; pais U ≤100 | pais optional | RegisterLaboratorio |
| marcas | una Marca | descripcion* U ≤100 | desktop message names "Familia" [DEVIATION] | RegisterMarca |
| nacionalidades | una Nacionalidad | descripcion* U ≤100 | | RegisterNacionalidad |
| tamanos | un Tamano | descripcion* U ≤100 | desktop says `una Tamano` [DEVIATION]; writes stamp the session empresa, list is tenant-wide (desktop writes pass the empresa; the list does not filter by it): `DAOTamano.listarGeneral` sends null to the proc | RegisterTamano |
| tipos-anexo | un Tipo Anexo | descripcion* U ≤100; abreviatura U ≤100 | abreviatura optional; desktop says `una Tipo Anexo` [DEVIATION]; formId `miTipoAnexo` is a proposal (not in the desktop dispatcher) | RegisterTipoAnexo |
| tipos-descuento | un Tipo Descuento | descripcion* U ≤100; abrev* U ≤5 (Abrev) | desktop abrev message says "Descripcion" [DEVIATION]; integer id (`codeWidth` 0) | RegisterTipoDescuento |

### R-REF-5 T2 catalogs (11), one flat select or boolean

| Slug | Entity | Fields | Notes | Desktop source |
|---|---|---|---|---|
| familias | una Familia | descripcion* U ≤100; id_familia_sunat sel(familias-sunat) (Codigo Sunat) | `scope=empresa`; sunat optional | RegisterFamilia |
| subfamilias | una SubFamilia | id_familia* sel(familias) (Familia); descripcion* U ≤100; id_subfamilia_sunat sel(subfamilias-sunat) ← id_familia (Codigo Sunat) | writes stamp the session empresa (no `id_usuario`), list is tenant-wide (desktop `DAOSubFamilia.listar` passes "" as empresa); the familia select only offers familias of the session empresa; sunat options are those of the selected familia's SUNAT code, empty when it has none; the desktop "nueva familia" button is excluded (R-REF-12) | RegisterSubFamilia |
| motivos-descuento | un Motivo Descuento | descripcion* U ≤100; abrev* U ≤5 (Abrev); id_tipo_descuento* sel(tipos-descuento) (Tipo Dscto) | desktop abrev and tipo messages are wrong or empty [DEVIATION] | RegisterMotivoDescuento |
| motivos-nc | un Motivo de Nota de Crédito | tipo* opt(P:NOTA CREDITO COMPRA\|C:NOTA CREDITO VENTA\|Y:NOTA DEBITO VENTA) (Tipo); descripcion* U ≤100 | desktop tipo message says "Familia" [DEVIATION]; tipo is checked first | RegisterMotivoNotaCredito |
| motivos-traslado | un Motivo Traslado | descripcion* U ≤100; abrev U ≤100; hab_guia bool (Hab Guia, default false) | abrev optional; desktop message says "Tipo Anexo" [DEVIATION] | RegisterMotivoTraslado |
| tipos-trabajador-perfil | un Perfil | descripcion* U ≤100; id_tipo_trabajador* sel(tipos-trabajador, active only) (Tipo Trabajador) | descripcion is checked first | RegisterTipoTrabajadorPerfil |
| empresa | una Empresa | name* U ≤180 (label Nombre, stored under the W1 key `name`); direccion* U ≤180 (Direccion); ruc* # exactly 11 (RUC); representante U ≤80; telefono; website L ≤255; direccion_comercial U ≤180; correo L ≤200; id_ubigeo cascade departamento→provincia→distrito (optional); flag_percepcion bool (Agente de Percepcion, default false) | route `/v1/empresa` (shares the storage section of the W1 empresas; W1 `/v1/empresas` stays byte-identical); modes `[UPDATE, DETAIL]` only (desktop insert and delete are no-ops; confirmed); ruc message is the "especificar su RUC" text for any length ≠ 11; telefono free text; `scope=tenant`, stamp `id_usuario`; the cascade is optional and `flag_percepcion` is stored `S`/`N` by the desktop | RegisterEmpresa |
| tipos-trabajador | un Tipo Trabajador | descripcion* U ≤100; abreviatura* U ≤5 (Abrev); estado | style M2 | RegisterTipoTrabajador |
| turnos | un Turno | hora* # ≤2 (Hora), range 0..12; minuto* # ≤2 (Minutos), range 0..59; tipo* opt(AM\|PM) default AM; estado | style M2; both padded P2 on blur; messages per R-REF-7 | RegisterTurno |
| marcas-vehiculo | una Marca Vehiculo | descripcion* U ≤100; estado | style M2; writes stamp the session empresa, list is tenant-wide (desktop writes pass the empresa; the list does not filter by it) | RegisterMarcaVehiculo |
| modelos-vehiculo | un Modelo Vehiculo | descripcion* U ≤100; estado | style M2; writes stamp the session empresa, list is tenant-wide (desktop writes pass the empresa; the list does not filter by it) | RegisterModeloVehiculo |

### R-REF-6 T3 catalogs (15), chains, dates, decimals, composite uniqueness
Chains (`←`) follow R-CRUD-12. "ubigeo cascade" means the W1 departamento→provincia→distrito cascade storing `id_ubigeo` (R-LOC-4).

| Slug | Entity | Fields (validation order) | Notes | Desktop source |
|---|---|---|---|---|
| almacenes | un Almacen | id_localidad* sel(localidades) (Localidad); id_punto_venta* sel(punto-venta) ← id_localidad (Punto de Venta); descripcion* U ≤100 (Descripción); direccion* U ≤100 (Dirección); id_ubigeo* cascade (Departamento, Provincia, Distrito); direccionamiento bool; habilita_despacho bool; habilita_venta bool | `scope=empresa`; booleans default false; localidades limited to the session empresa | RegisterAlmacen |
| zonas | una Zona | descripcion* U ≤100; id_ubigeo* cascade; estado | style MS for the cascade (`debes Seleccionar un Departamento / una Provincia / un Distrito`); desktop distrito message says "Almacen" [DEVIATION] | RegisterZona |
| correlativos | un Correlativo | id_tipo_doc* sel(tipos-doc-venta, active) (Tipo de Documento); serie* U ≤4 P4 (Serie); correlativo* # ≤10 P10 (Correlativo); estado* opt(A:Activo\|I:Inactivo) default A (Estado); id_localidad* sel(localidades) (la Localidad); id_punto_venta* sel(punto-venta) ← id_localidad (Punto de Venta); nro_autorizacion U ≤50; codigo_maquina U ≤50; imprime opt(Sí\|No) default Sí | unique (id_punto_venta, id_tipo_doc, serie); nro_autorizacion and codigo_maquina only when id_tipo_doc = `TI` (R-REF-8); hidden constants R-REF-9 | RegisterCorrelativo |
| usuario-correlativos | una Asignasion de Usuario - Correlativo (the desktop spelling "Asignasion" is kept in every sentence) | id_usuario* sel(usuarios) (el Usuario); id_localidad* sel(localidades) (la Localidad); id_punto_venta* sel(punto-venta) ← id_localidad (el Punto de Venta); id_tipo_doc* sel(tipos-doc-venta with an active correlativo in the punto de venta) ← id_punto_venta (el Tipo de documento); id_correlativo* sel(correlativos active, shown by serie) ← id_punto_venta + id_tipo_doc (su serie); habilitar bool default true | `scope=empresa`, `stamp: []` (`id_usuario` is the ASSIGNED user, so stamping the session user would overwrite it); unique (id_usuario, id_correlativo), applied on CLONE too [DEVIATION]; the serie select validates its parent punto de venta through the `exists` filter of its target; the localidad, punto de venta and tipo are stored although the desktop keeps only the leaf (the form needs them to restore the chain); message style `debes especificar {label}.` | RegisterUsuarioCorrelativo |
| punto-venta | un Punto de Venta | id_empresa* sel(empresa) (su Empresa); id_localidad* sel(localidades) ← id_empresa (su Localidad); name* U ≤100 (label Descripción, stored under the W1 key `name`); direccion* U ≤100 (Dirección); telefono* (Telefono, no max); id_ubigeo* cascade | route `/v1/punto-venta` (shares the W1 puntos-venta storage section; W1 `/v1/puntos-venta?id_empresa=` stays byte-identical); estado is stored `A` on create (entry `constants`); `scope=tenant`, stamp `id_usuario`; **[DEVIATION]** the list is tenant-wide although the desktop lists the session empresa (`DAOPuntoVenta.listar(id_empresa)`): the core has no list-only empresa scope and the form picks any empresa; desktop empresa message says "Localidad" [DEVIATION] | RegisterPuntoVenta |
| zonas-distancia | una Zona Distancia | Chain A: departamento* → provincia* → distrito* (ubigeo cascade restricted to ubigeos having at least one active zona) → id_zona* sel(zonas) ← distrito; Chain B: id_localidad* sel(localidades) → id_punto_venta* ← localidad → id_almacen* sel(almacenes) ← id_punto_venta; distancia* dec (Distancia(Km)); estado | style MS for selects (`un Pto Vta`, `un Almacen`, `una Localidad`, `una Zona`); distancia rule R-REF-7; desktop distrito/zona messages are wrong [DEVIATION]; the cascade is `transient` (never sent) and restored from the `id_ubigeo` join over the zona (`restoreFrom { field: 'id_ubigeo', prefixLen: 6 }`; an inactive zona restores no levels); the server accepts any active zona (the distrito is not stored); the list has no Departamento / Provincia / Distrito columns (a two-hop join is not supported; the zona name carries the place); the localidad and punto de venta are stored so the form can restore chain B; `scope=tenant`, stamp `id_usuario` | RegisterZonaDistancia |
| tipos-mov-inventario | un Tipo de Movimiento de Inventario | tipo* opt(E\|S) default E (Tipo); id_clasif_inventario* sel(clasif-inventarios) ← tipo (Clasificacion); descripcion* U ≤100; abrev* U ≤100 (Abreviatura); id_tabla_sunat sel(tablas-sunat); id_detalle_sunat sel(tablas-detalle-sunat) ← id_tabla_sunat (Codigo Sunat); hab_ingreso bool (Hab Ingreso, default false) | clasificacion uses `defaultOption: 'first'` after each tipo change; sunat fields optional; estado is stored `A` (entry `constants`); tipo option labels are the bare `E` / `S` of the desktop combo, so the list column shows E / S | RegisterTipoMovInventario |
| unidades-medida | una Unidad de Medida | descripcion* U ≤100; abreviatura* U ≤100 (Abreviatura); id_tabla_sunat sel(tablas-sunat) default = the id of the 6th seeded tablas-sunat row, declared as the literal `default: '6'` with no resolver (a seed spec asserts that the 6th row is id `6` / `UNIDAD DE MEDIDA`); id_detalle_sunat sel(tablas-detalle-sunat) ← id_tabla_sunat (Codigo Sunat) | list `scope=empresa`; sunat optional; presentation panel excluded (R-REF-12) | RegisterUnidadMedida |
| tipos-cambio | un Tipo de Cambio | fecha* date dd/MM/yyyy default today (Fecha); id_moneda* sel(monedas) default DOLAR AMERICANO (Moneda); monto_compra* dec > 0 (Monto de Compra); monto_venta* dec > 0 (monto de Venta); monto_comercial* dec > 0 (Monto Comercial); monto_especial* dec > 0 (Monto Especial) | writes stamp the session empresa and user, list is tenant-wide (desktop `listTipoCambio` takes no empresa); uniqueness is per empresa; unique (empresa, fecha, id_moneda); decimals default `0.0`, blank becomes `0.0` on blur; moneda select is read-only; CLONE sets fecha to today; messages per R-REF-7 | RegisterTipoCambio, UiRegisterTipoCambioImpl |
| promociones | una Promocion | descripcion* U ≤100; fecha_ini* date default today (Fecha Ini); fecha_fin* date default today (Fecha Fin); estado | validates only descripcion, as the desktop does; no date range rule (R-REF-7) | RegisterPromocion |
| trabajador-punto-venta | un Trabajador | id_trabajador* sel(trabajadores) (Nombre); id_empresa* sel(empresa) (la Empresa); id_localidad* sel(localidades) ← id_empresa (la Localidad); id_punto_venta* sel(punto-venta) ← id_localidad (su Punto de Venta); habilitar bool default false | unique (id_trabajador, id_punto_venta), applied on CLONE too [DEVIATION]; `scope=tenant`, stamp `id_usuario`; **[DEVIATION]** the list is tenant-wide although the desktop lists the session empresa (`listarGeneral(codempresa)`; no list-only scope in the core); the desktop trabajador picker is a select (R-REF-12); desktop messages say "Correlativo" [DEVIATION] | RegisterTrabajadorPuntoVenta |
| choferes | un Chofer | id_tipo_doc_iden* sel(tipos-doc-iden, active, persons) default DNI on INSERT (Tipo de Documento); numero_doc #; ap_paterno U ≤50; ap_materno U ≤50; nombres U ≤50; descripcion U ≤300 (Razón Social); nro_licencia U ≤20; direccion U ≤280; sexo opt(M\|F) default M; telefono # ≤15; celular # ≤15; id_nacionalidad* sel(nacionalidades) default PERUANA (Nacionalidad) | modes `[INSERT, UPDATE, DETAIL, CLONE]` (desktop delete returns false); conditional rules R-REF-8; activation tab excluded (R-REF-12); UPDATE restores the stored tipo doc and nacionalidad (desktop forces DNI and PERUANA) [DEVIATION] | RegisterChofer |
| socios | un Socio | id_tipo_doc_iden* sel(tipos-doc-iden, active, persons) (Tipo de Documento); numero_doc #; ap_paterno U ≤50; ap_materno U ≤50; nombres U ≤50; descripcion U ≤300 (Razón Social); estado (always read-only, true on create) | modes `[INSERT, UPDATE, DETAIL, CLONE]`; conditional rules R-REF-8; stored `flag_tipo_persona` R-REF-8; desktop messages say "Cliente" [DEVIATION] | RegisterSocio |
| ubicaciones | una Ubicación | id_localidad* sel(localidades); id_punto_venta* sel(punto-venta) ← id_localidad; id_almacen* sel(almacenes) ← id_punto_venta; descripcion* U ≤50 | literal messages `Seleccione Localidad`, `Seleccione Punto de Venta`, `Seleccione Almacen`, `Ingrese Descripcion` | RegisterUbicacion |
| vehiculos | un Vehiculo | placa* U ≤30 (Placa); constancia_inscripcion* U ≤30 (Constancia); peso* # ≤10 default 0 (Peso); id_marca* sel(marcas-vehiculo, active) (Marca); id_modelo* sel(modelos-vehiculo, active) (Modelo); estado | style M2 for text fields; select messages `Para {modo}, debes Seleccionar Marca.` / `Modelo.`; propietario excluded (R-REF-12) | RegisterVehiculo |

### R-REF-7 Numeric, date and uniqueness rules
- **Turno**: blank hora → `Para {modo}, debes especificar su Hora.`; blank minuto → `... su Minutos.`; hora > 12 → `Para {modo}, debes Insertar Hora Correcto.`; minuto > 59 → `Para {modo}, debes Insertar Minutos Correcto.`. Hora `0` is accepted. Checked in that order.
- **TipoCambio**: an empty or invalid date → `La fecha del Tipo de Cambio que has especificado no es válida. Compruébala e inténtalo de nuevo.` (checked first); moneda missing → M1 `su Moneda`; a duplicate (empresa, fecha, moneda) on INSERT/CLONE, or on UPDATE when it matches another record → `La fecha del Tipo Cambio ya se encuentra registrado para esa moneda, por favor ingrese otra fecha o seleccione otra moneda.` (field `fecha`, 409); each monto blank or ≤ 0 → M1 `su Monto de Compra` / `su monto de Venta` / `su Monto Comercial` / `su Monto Especial`, in that order. The decimal input accepts the pattern `-?[0-9]*(\.[0-9]*)?` with no precision limit. The desktop duplicate check ignores moneda although the message names it; the spec keys uniqueness on moneda **[DEVIATION]**.
- **ZonaDistancia** **[DEVIATION]**: distancia blank, 0 or negative → `Para {modo} una Zona Distancia, debes especificar su Distancia.` (distancia must be > 0; the desktop rejected only 0 and its text says `una Zona`; the built entity text is `una Zona Distancia`, as in S-REF-22).
- **Promocion**: only `descripcion` is validated, exactly as the desktop. fecha_ini and fecha_fin default to today and carry no range, blank or not-future rule. The generic date range / not-future capability (S-CRUD-28) is available but unused by any Wave 2 catalog.
- **Correlativo / UsuarioCorrelativo / TrabajadorPuntoVenta** composite keys are defined in R-REF-6; messages: Correlativo (field `serie`) `Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.`; UsuarioCorrelativo (field `id_correlativo`) `Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.`; TrabajadorPuntoVenta (field `id_trabajador`) `El Trabajador ya se encuentra asignado al punto de venta especificado. Compruébala e inténtalo de nuevo`. On UPDATE the record does not conflict with itself. The desktop skips the check on CLONE; the spec applies it **[DEVIATION]**.

### R-REF-8 Conditional rules (DNI / RUC / ticket)
Implementation shape (design D9/D10): Correlativo uses `visibleWhen` / `requiredWhen` over `id_tipo_doc in [TI]` where hidden values are sent as `null` by the UI and stored as an empty string by the server; its validation order is declared so the ticket fields are reported by the server after a passing unique check. Chofer and Socio use the single named rule `docIdentidad` (state, validate, effect, derive hooks) plus `maxWhen` / `minLenWhen` for the 8 / 11 digit lengths, `clearsOnChange` for the tipo de documento, and `compose` for the razón social.
- **Correlativo**: `nro_autorizacion` and `codigo_maquina` are visible and required only when `id_tipo_doc` = `TI` (ticket). Missing values give `Para {modo} un Correlativo, debes especificar su Numero de Autorizacion.` and `... su Codigo de Maquina.`, checked after the uniqueness rule. Because the declared order puts the unique key first, the client validates only up to it and does NOT block on a blank ticket field: the server reports it (S-REF-15 last row, S-MOCK-20). The generic client block of a blank `requiredWhen` field (R-CRUD-13, S-CRUD-33) applies to configs with no server-only step before the field. When `id_tipo_doc` is not `TI`, both are hidden and stored as an empty string.
- **Chofer and Socio**, by selected tipo de documento (abreviatura):
  - `DNI`: numero_doc max 8; fewer than 8 digits → `El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.`; ap_paterno, ap_materno and nombres required (M1 `su Apellido Paterno`, `su Apellido Materno`, `su Nombre`, entity `un Chofer` / `un Socio`); razón social is hidden and composed as `{ap_paterno} {ap_materno} {nombres}` on every keystroke of those three fields.
  - `RUC`: numero_doc max 11; fewer than 11 digits → `El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.`; first digit `1` = natural person (the three name fields are required, razón social composed and hidden); `2` = juridical person (razón social enabled and required, names disabled); any other first digit → alert `EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2` and numero_doc is cleared. The alert effect fires on ANY edit of the number (a paste included), not only at length 1 and 11. **[DEVIATION]** hardening beyond the desktop: the server answers 422 on `numero_doc` with the alert text for a RUC whose first digit is neither 1 nor 2, and keeps the stored (disabled) names when a RUC-2 body carries them.
  - Any other tipo: numero_doc max 11 with no minimum, razón social enabled and required, names disabled.
  - Changing the tipo de documento clears numero_doc, names and razón social. A blank razón social (after composition) → M1 `su Descripcion`. Chofer additionally requires nacionalidad (`Para {modo} un Chofer, debes Seleccionar una Nacionalidad.`) and shows `sexo` only for natural persons; hiding the sexo (a juridical RUC) clears it through the generic hide-clears rule, so returning to DNI shows it blank (the desktop keeps the radio). Chofer and Socio have their own case table (`docIdentidad.cases.ts`), separate from the generic text-field table. The Chofer list shows razón social, tipo, number, nacionalidad, dirección, teléfono and celular (not sexo, email, comentario).
  - Socio stores `flag_tipo_persona` = `J` when the tipo is RUC (id `05`) and the first digit is `2`, otherwise `N`. Chofer stores `N`.

### R-REF-9 Hidden constants
Correlativo MUST store `num_inicial` = `0000000001`, `num_final` = `9999999999`, `flag_cond_pago` = `N`, and `linea_impresion` = 12 when `imprime` = Sí, 0 otherwise. Hidden constants are not shown in the UI and are declared as entry `constants` (stored on create); `linea_impresion` is `derive`d from `imprime`.

### R-REF-10 Dependent select chains
Every chain in R-REF-5/6 MUST: leave the dependent select disabled and empty until its parent is chosen (in INSERT/UPDATE/CLONE only); clear and reload it when the parent changes; clear the whole sub-chain below when a higher level is cleared; restore all levels with options loaded in UPDATE, DELETE, DETAIL and CLONE; and ignore stale responses (S-LOC-10). Dependent options are requested with filter parameters on the lookup list (R-MOCK-16).

### R-REF-11 Read-only seeded lookups
The mock MUST expose these lookups as read-only (R-REG-11; writes answer 405 `METHOD_NOT_ALLOWED`). Scope per entry: `shared` (global, W6 to confirm) for monedas, tipos-doc-iden, tablas-sunat, tablas-detalle-sunat, tipos-doc-venta, familias-sunat and subfamilias-sunat; `tenant` for usuarios and trabajadores. The DNI id of tipos-doc-iden and every `codeWidth` are read from the desktop at apply time.
| Slug | Purpose | Needed seed |
|---|---|---|
| monedas | TipoCambio | includes `DOLAR AMERICANO` |
| tipos-doc-iden | Chofer, Socio | includes `DNI` (`01`) and `RUC` (`05`), with the `persona` (persons) and `estado` (active) flags, `optionLabel` `abreviatura`; selects use `where {persona: true, estado: true}` |
| tablas-sunat | TipoMovInventario, UnidadMedida | at least 6 rows; the 6th is the units table |
| tablas-detalle-sunat | same, filter `id_tabla_sunat` | detail rows per tabla |
| tipos-doc-venta | Correlativo, UsuarioCorrelativo | includes `TI`; filter `id_punto_venta` |
| usuarios | UsuarioCorrelativo | projection (`project: 'users'`) of the auth seed, per tenant |
| trabajadores | TrabajadorPuntoVenta | minimal rows |
| familias-sunat, subfamilias-sunat | Familia, SubFamilia | `subfamilias-sunat` filtered by `codigo_familia_sunat` |
All lookups above are confirmed read-only seeded lookups; they are the W6 / W2b contract and have no screens in Wave 2.

### R-REF-12 Excluded desktop behaviors
The following are NOT part of Wave 2: nested "create related" buttons (SubFamilia familia, TipoCambio moneda); the Chofer "Activación" tab with its activar / desactivar actions and history grid (G11/G12, W2b; the server records the initial activation on create); the UnidadMedida presentation panel (Presentación / Unidad Base, FP, UP: not persisted or validated by the desktop); the Vehiculo "Propietario" transportista picker (G10 and Transportista, W2b); entity-picker dialogs (the TrabajadorPuntoVenta trabajador is a select).

### R-REF-13 Table-driven tests and dual-source parity
Every rule row in R-REF-4..R-REF-9 MUST have at least one test generated from the registry entry (required, max length, normalization, range, uniqueness, conditional, chain) and the same table MUST run against the in-browser mock and the HTTP mock through the same `InterCatalogService` (R-LOC-7). Server-side rules (required, max length, ref existence, uniqueness) MUST be enforced by both mocks, not only by the UI.

## Scenarios

**S-REF-1 done bar list** — Given the demo seed for any T1 catalog (one inactive row), When its list loads, Then only active rows show with code and descripcion, the filter, sort and paging work, and Alt+A opens the register when `add=true`.

**S-REF-2 required message template** — Given INSERT on `aduanas` with a blank descripcion, When submitted, Then no request is sent and the field shows `Para agregar un Aduana, debes especificar su Descripcion.`; the same on UPDATE shows `modificar`.

**S-REF-3 max lengths table** — Given the rows `{tipos-descuento.abrev: 5, condiciones-pago.descripcion: 255, empresa.nombre: 180, ubicaciones.descripcion: 50, vehiculos.placa: 30}`, When one character beyond the max is typed, Then the insertion is ignored (S-CRUD-14), and a direct API call with a longer value answers 422 with a detail on that field.

**S-REF-4 normalization** — Given `colores.descripcion`, When `rojo` is typed, Then `ROJO` is shown; Given `aduanas.descripcion`, Then `rojo` stays as typed; Given `empresa.website` and `empresa.correo`, Then input is lowercased.

**S-REF-5 condiciones-pago fields** — Given a blank dias_pago, Then `... una Condición de Pago, debes especificar sus Dias de Pago.`; Given dias_pago `0` with a tipo, Then it is accepted; Given no tipo, Then `... su Tipo de Pago.`; Given `abc` typed in dias_pago, Then it is ignored.

**S-REF-6 clasif-inventarios tipo** — Given descripcion and abrev but no tipo, When submitted, Then `... debes especificar su Tipo de Movimiento.`; Given tipo `S`, Then the record is created with `S`.

**S-REF-7 estado semantics** — Given `zonas`, Then INSERT shows estado true and read-only; Given UPDATE, Then estado is editable and can be set to false; Given CLONE of an inactive-estado source, Then estado shows the source value read-only.

**S-REF-8 subfamilia sunat chain** — Given a familia with a SUNAT code, When it is chosen, Then `id_subfamilia_sunat` options load from that code; When the familia changes, Then the sunat value clears and reloads; Given a familia without a SUNAT code, Then the options are empty and the field stays optional.

**S-REF-9 motivos-descuento FK** — Given descripcion and abrev but no tipo de descuento, When submitted, Then the field `id_tipo_descuento` shows `... debes especificar su Tipo Dscto.`; Given an unknown tipo id sent directly, Then the mock answers 422 on `id_tipo_descuento`.

**S-REF-10 empresa RUC** — Given ruc of 10 digits, When submitted, Then `Para modificar una Empresa, debes especificar su RUC.`; Given 11 digits, Then it is accepted; Given letters typed in ruc, Then they are ignored.

**S-REF-11 empresas modes** — Given the `empresa` entry, Then the toolbar offers modify and details only, and `POST /v1/empresa` answers 405 `MODE_NOT_SUPPORTED`.

**S-REF-12 turno ranges** — Given the rows `{hora 13, minuto 30}`, `{hora 12, minuto 60}`, `{hora 0, minuto 0}`, Then they give `Insertar Hora Correcto`, `Insertar Minutos Correcto`, and accepted; Given `5` typed in hora and focus leaves, Then it shows `05`.

**S-REF-13 almacen chain and order** — Given nothing selected and all fields blank, When submitted, Then the first error is on `id_localidad`; Given a localidad is chosen, Then punto de venta options load for that localidad only; Given the cascade has departamento and provincia but no distrito, Then the error is `... debes especificar su Distrito.`.

**S-REF-14 correlativo uniqueness** — Given an existing (PV 1, `01`, `F001`), When INSERT with the same triple, Then the 409 error shows on `serie` with the literal message; When the same serie is used on PV 2 or tipo doc `03`, Then it is accepted; When UPDATE of the same record keeps the triple, Then it is accepted; When UPDATE changes it to another record's triple, Then it is rejected; When CLONE keeps the triple, Then it is rejected.

**S-REF-15 correlativo ticket** — Given tipo doc `TI`, Then nro_autorizacion and codigo_maquina appear and both are required; Given tipo doc changes to `01`, Then they hide and the stored values are empty strings; Given `TI` and only nro_autorizacion filled, Then the error is `... su Codigo de Maquina.`.

**S-REF-16 correlativo padding** — Given serie `1` and focus leaves, Then `0001`; Given correlativo `25`, Then `0000000025`; Given a fifth character typed in serie, Then it is ignored; Given the record is saved, Then num_inicial `0000000001`, num_final `9999999999`, flag_cond_pago `N` and linea_impresion 12 are stored (0 when imprime = No).

**S-REF-17 usuario-correlativo chain and key** — Given localidad changes, Then punto de venta, tipo de documento and serie clear and reload downward; Given an existing (usuario U, correlativo C), When INSERT of the same pair, Then 409 on `id_correlativo` with the literal message; When another usuario uses C, Then it is accepted.

**S-REF-18 tipo-cambio uniqueness** — Given (empresa E, 2026-01-15, dólar) exists, When INSERT with the same date and moneda, Then 409 on `fecha` with the literal message; When the date is 2026-01-16, Then it is accepted; When UPDATE keeps its own date, Then it is accepted.

**S-REF-19 tipo-cambio montos and date** — Given a fresh INSERT, Then fecha is today, moneda is `DOLAR AMERICANO` read-only and the four montos show `0.0`; Given monto_compra `0`, Then `... debes especificar su Monto de Compra.`; Given monto_especial blank and focus leaves, Then `0.0`; Given fecha `31/02/2026` or empty, Then the invalid-date message shows first; Given CLONE of a past record, Then fecha is today.

**S-REF-20 promocion validates only descripcion** — Given a blank descripcion, When submitted, Then `Para agregar una Promocion, debes especificar su Descripcion.`; Given descripcion filled, fecha_fin 2026-01-01 and fecha_ini 2026-02-01, Then it is accepted (no range rule); Given a fresh INSERT, Then both dates default to today and estado is true read-only.

**S-REF-21 trabajador-punto-venta key and chain** — Given (trabajador T, PV P) exists, When INSERT of the same pair, Then 409 on `id_trabajador` with the literal message; Given empresa changes, Then localidad and punto de venta clear and reload; Given habilitar untouched, Then it saves as false.

**S-REF-22 zonas-distancia chains** — Given departamento changes, Then provincia, distrito and zona clear and reload (only ubigeos with an active zona are offered); Given localidad changes, Then punto de venta and almacen clear and reload; Given distancia `0`, Then `Para agregar una Zona Distancia, debes especificar su Distancia.`; Given distancia `-5`, Then the same message shows (DEVIATION: must be > 0), and the server answers 422 on `distancia`.

**S-REF-23 tipos-mov-inventario chains** — Given tipo `E` by default, Then clasificaciones of tipo E load and the first is selected; When tipo changes to `S`, Then the list reloads for S and selects the first; When tabla sunat is chosen, Then detalle options load; When tabla sunat is cleared, Then detalle clears and disables.

**S-REF-24 unidades-medida default tabla** — Given a fresh INSERT, Then tabla sunat is the 6th seeded tabla and its detail options are loaded; Given the tabla changes, Then detalle clears; Given tabla and detalle are cleared, Then the record saves with no sunat code.

**S-REF-25 chofer DNI** — Given tipo DNI with numero_doc `1234567` (7 digits), When submitted, Then `El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.`; Given 8 digits with a blank ap_materno, Then `Para agregar un Chofer, debes especificar su Apellido Materno.`; Given ap_paterno `PEREZ`, ap_materno `LOPEZ`, nombres `ANA`, Then descripcion is composed as `PEREZ LOPEZ ANA`.

**S-REF-26 chofer / socio RUC** — Given tipo RUC and numero_doc `10123456789`, Then the three names are required and razón social is hidden; Given `20123456789`, Then razón social is required and the names are disabled; Given a first digit `3`, Then the alert `EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2` shows and numero_doc clears; Given 10 digits, Then the RUC-invalid message shows.

**S-REF-27 doc type change clears** — Given numero_doc and names typed under DNI, When the tipo changes to RUC, Then numero_doc, names and razón social are cleared and numero_doc max becomes 11.

**S-REF-28 socio persona flag** — Given tipo RUC with `20123456789`, Then `flag_tipo_persona` = `J`; Given RUC with `10123456789` or tipo DNI, Then `N`.

**S-REF-29 chofer / socio modes** — Given `choferes` or `socios`, Then DELETE is not offered and `DELETE` answers 405 `MODE_NOT_SUPPORTED`; Given UPDATE of a chofer with tipo RUC and nacionalidad `EXTRANJERA`, Then both are restored (not forced to DNI / PERUANA).

**S-REF-30 ubicaciones literal messages** — Given a blank form, When submitted, Then the first message is `Seleccione Localidad`, then `Seleccione Punto de Venta`, `Seleccione Almacen`, `Ingrese Descripcion` in that order as each is fixed.

**S-REF-31 vehiculos** — Given a fresh INSERT, Then peso is `0` and estado is true read-only; Given a blank placa, Then `Para agregar, debes especificar su Placa.`; Given placa and constancia but no marca, Then `Para agregar, debes Seleccionar Marca.`; Given an inactive marca sent directly, Then the mock answers 422 on `id_marca`.

**S-REF-32 puntos-venta fields** — Given empresa chosen, Then localidad options are that empresa's only; Given a blank telefono, Then `... debes especificar su Telefono.`; Given a long telefono, Then it is accepted (no max).

**S-REF-33 zonas cascade messages** — Given descripcion filled and no departamento, When submitted, Then `Para agregar una Zona, debes Seleccionar un Departamento.`; Given departamento and provincia but no distrito, Then `... debes Seleccionar un Distrito.`.

**S-REF-34 server ref and requireds** — Given a direct `POST` omitting a required field or sending a ref id that does not exist or is inactive, Then the answer is 422 with a detail naming the field, for every catalog in the tables.

**S-REF-35 lookups are read-only** — Given `monedas`, `tipos-doc-iden`, `tablas-sunat` and `tablas-detalle-sunat`, Then `GET` returns the seed (detalle filtered by `id_tabla_sunat`), and any write answers 405 `METHOD_NOT_ALLOWED`.

**S-REF-36 permissions and shortcuts** — Given a catalog with `modify=false`, When the user presses Alt+M or clicks Modify, Then nothing opens; Given a catalog form id missing from `permissions.json`, Then the consistency test fails.

**S-REF-37 dual-source parity** — Given the table-driven rule suite of any catalog, When run against the in-browser mock and the HTTP mock, Then both produce the same outcome and the same field-level messages.

**S-REF-38 W1 unchanged** — Given Localidad and its W1 suites, When the Wave 2 stack is in place, Then all W1 scenarios (S-LOC-1..20) pass unchanged.

**S-REF-39 excluded behaviors absent** — Given SubFamilia, TipoCambio, Chofer, UnidadMedida and Vehiculo, Then no nested-create button, activation tab, presentation panel or propietario picker is rendered.
