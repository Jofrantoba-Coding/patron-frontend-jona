# Exploration: softcommerce-web-migration-w3

Wave 3 of the SoftCommerce desktop → web migration. Engram mirror: `sdd/softcommerce-web-migration-w3/explore`.

## Summary

The inventory rule "W3 = everything else" produces 74 rows, but they are not 74 screens. After grouping, 51 rows are not W3 work:

- Swing infrastructure widgets.
- The shell.
- Screens already delivered in W2.
- Screens misassigned that belong to W4–W7.

The 23 real W3 rows break down as:

- 20 child dialogs of the rich masters that W2 deferred to "W2b" (Cliente, Proveedor, Item, Usuario, Vendedor and the shared Anexo).
- 3 Socio-acciones dialogs.

There is no standalone process form in W3. So the real W3 is W2b plus its children.

**Recommendation:** absorb W2b into W3.

## 1. What the 74 W3 rows are

Evidence used:

- instantiation sites (`new X(`) across the desktop;
- the `Main.java` menu wiring;
- line counts;
- the W2 registry contents.

| Group | Count | Verdict |
|---|---|---|
| Swing infrastructure widgets (`view/controles`): ImagePanel, ImagePreview, JHInternal, JHInternalDialog, PanelControlRegister, PanelRowSelection, ProgressBarSystem, RendererCheckBox, StateBarSystem, TimeSerieResumen | 10 | Not ported as screens; the CRUD templates, CrudGrid and the shell cover them. ImagePanel, ImagePreview and TimeSerieResumen are referenced only by their own files (dead code). |
| Shell and session: CambiarEmpresa, CambiarPeriodo, Main, UiLogin, UiLoginImpl | 5 | Already built on the web (uicontexto, uilogin, uishell, domain/period). Only parity needs checking. |
| Not applicable or dead: ConexionBaseDatos (a DB connection dialog, meaningless on the web), MainFrameTest (test harness), CambiarCondicionPago (never instantiated) | 3 | Drop. |
| W2 orphan catalogs already delivered: PnlMarcaVehiculo, PnlModeloVehiculo, PnlTipoTrabajador, PnlTurno, PnlUbicacion, PnlVehiculo | 6 | Misassigned because their base is JHInternalFrame; the registry already has them. |
| Misassigned to W4 (sales/delivery): PnlLiquidacion and PnlLiquidacionRegistro (list and dialog), PnlCierreProdDespachar, PnlConsultaProdDespachar, PanelDiferenciaPrecio, FormConversion and FormConversionVarios, FormAutorizar, FormDVRegularEstado | 9 | Move to W4. FormConversion is also used by W5, from RegisterIngreso. |
| Misassigned to W5 (purchasing/inventory): PnlRepKardex, PnlConsultaMovimiento, PnlDocumentoCosteo, PnlMostrarTipoMovimientosFormula, ActualizarAlmacenes, PnlActualizarAlmacenes, JDSeleccionaAlmacen, FormLoteMovimiento, PanelFEDesactivarItemAlm | 9 | Move to W5. Kardex could go to W7. |
| Misassigned to W6: PnlCancClienteGroup, PnlCancProvGroup, FrmCambiarFechaDoc | 3 | Move to W6. |
| Misassigned to W7: PnlRepLibroCaja, LibroCompras, LibroDiario, LibroDiarioSimp, LibroMayor, LibroPercepcion | 6 | Move to W7. |
| Child dialogs of the rich masters | 20 | W3. |
| Socio acciones: FormAccionSocio, FormAccionSocioAgregar, FormAccionPrecioAgregar | 3 | W3 candidate (its own master-detail screen). |
| **Total** | **74** | |

### The 20 child dialogs

| Parent | Dialogs | Count |
|---|---|---|
| Cliente | FormClienteDireccion, FormClienteContacto, FormClienteCuenta, FormClienteCredito | 4 |
| Proveedor | FormDireccionProveedor, FormConfigPadronProveedor, FormPanelConfigPadronProveedor | 3 |
| Item (12 tabs) | FormItemCaracteristica, FormItemConfig, FormItemConfigDscto, FormItemAlmacen, FormItemConfigCuenta, FormItemPercepcion | 6 |
| Shared Anexo | FormAnexoActivacion, FormAnexoPadron | 2 |
| Usuario / perfil | FormMenuPerfilArbol and FormMenuPerfilPermiso (permission tree per perfil); FormUA and FormPanelUA ("Autorizar Series", which overlaps W2 usuario-correlativos) | 4 |
| Vendedor | PanelCargarTrabajador | 1 |

The shared Anexo is used by Cliente, Proveedor, Transportista, Chofer, Trabajador and Banco.

### By shape

| Shape | Rows |
|---|---|
| Master-detail | 23 |
| Utility, config or infrastructure | 18 |
| Misassigned | 27 |
| Already done | 6 |
| Simple process forms | 0 |
| Dashboards | 0 |

Four rows are dead code: ImagePanel, ImagePreview, TimeSerieResumen and CambiarCondicionPago. They are counted inside the groups above.

### Distinct real screens

- **10 T4 parent masters:** Usuario, Trabajador, Vendedor, VendedorNuevo, ClienteNuevo, Proveedor, ProveedorNuevo, Transportista, Banco and Item.
- **20 child dialogs** of those masters.
- **Socio acciones:** one list and two dialogs.
- **6 entity pickers.**

## 2. Should W3 absorb W2b? Yes

- **W3 has no parents of its own.** The inventory's W3 bucket is almost entirely the children of the W2b masters. Splitting them off would leave W3 with dialogs but no master screens.
- **Later waves depend on these masters.** W4 (sales) and W5 (purchasing) need the Cliente, Proveedor, Item and Trabajador/Vendedor masters and the LookupDialog (G10), so they must land before W4.
- **The reference data already exists from W2:** tipos-doc-iden, ubigeo, clasif-clientes, condiciones-pago, monedas, familias/subfamilias, marcas, colores, tamanos, laboratorios, unidades-medida, almacenes, clasif-inventarios and tipos-anexo.
  - The exception is cuentas contables (needed by FormClienteCuenta and FormItemConfigCuenta), which is W6 data. Stub it as a read-only lookup.

### Recommended W3 scope

- **Capabilities:** G10, G11 and G12, plus the shared Anexo grid.
- **Masters:**
  - Banco, Trabajador and Transportista.
  - Vendedor, with PanelCargarTrabajador.
  - Usuario, with perfil permissions and Autorizar Series.
  - Cliente, Proveedor and Item.
- **The 6 pickers:** BuscarCliente, FormClienteBuscar, BuscarTrabajador, FormBuscarVehiculo, BuscarParametroProv, BuscarItemConversion.
- **Socio acciones:** optional, last.

### Defer

- **T5 screens to W4/W5:** CierreAperturaCaja, Ingreso, NotaSalida and ServicioTransporte. They are transactional or consult screens.
- **The 8 orphan dialogs to W4/W5:** ListaPrecios, the Lote dialogs, SalidaMasivaInventario, ConsultaKardex, ConsultaStockHistorico and ItemResumen.
- **Item, optionally:** the Item master can become its own sub-wave if W3 should be smaller.

### Inventory fix

Reassign the 51 non-W3 rows with an override map, so the W4–W7 counts become trustworthy.

## 3. Capability gaps against the current stack

### What the current stack (main) already has

- **`FieldConfig` kinds:** code, text, boolean, options, number, date, select over a source, and the ubigeo cascade.
- **Selects and fields:** dependent selects (G2), conditional field props (G8), the docIdentidad rule and the registry-driven mock.
- **Read-only lookups to replace:** W2 has `trabajadores` (a minimal seed) and `usuarios` (projected from the auth `users.json`). The full masters must replace or extend both.
- **Already built:** login, the empresa/periodo context and the shell.

### Gaps

| Gap | Needed by | Notes |
|---|---|---|
| G10 LookupDialog (search and pick, filters, paging) | The 6 pickers; Cliente/Proveedor/Item/Trabajador picks in W4/W5; PanelCargarTrabajador; Vendedor | New component plus a mock `?q=` search contract. |
| G11 master-detail: tabs, child grids, nested CRUD on `/v1/{c}/{id}/{child}` with child dialogs | Cliente (direcciones, contactos, cuentas, crédito), Proveedor, Transportista, Banco, Item (6+ grids, 12 tabs), Usuario (series), Socio acciones | New architecture and the biggest risk. The mock needs nested resources, child uniqueness and cascade delete. |
| G12 custom row actions (activar/desactivar, estado) | Trabajador, Anexo activation, FormPanelUA activar/desactivar | A toolbar/row-action registry plus permission mapping. |
| Shared Anexo child grid (tipo anexo, valor, activación, padrón) | 6 masters | Build once and reuse; high leverage. |
| Password plus confirmation field | Usuario | New field kind; the server never returns the value. |
| Textarea | Vendedor, Proveedor, Item observaciones | Small field kind. |
| Permission tree editor (checkbox tree per perfil and form, with the add/modify/eliminate/... flags) | FormMenuPerfilArbol, FormMenuPerfilPermiso | Reuse MenuTree, plus a new editable permission matrix. |
| Inline create and dependent selects inside children | Cliente dirección (the ubigeo cascade exists), Item (familia → subfamilia) | Mostly a composition of G2 and the cascade. |
| Image/file upload | None | ImagePanel and ImagePreview are dead code, and no W2/W3 screen uses files. Drop. |
| Proveedor padrón config (SUNAT padrón flags) | FormConfigPadronProveedor, FormAnexoPadron | A simple form, but its semantics need product input. |
| Cuentas contables lookup | FormClienteCuenta, FormItemConfigCuenta | W6 data; stub it as read-only. |

## 4. Slicing options (800 lines per PR, strict TDD)

### Desktop sizes

| Screen | Lines |
|---|---|
| RegisterItem | 2,706 |
| ClienteNuevo | 2,068 |
| Proveedor | 1,785 |
| Transportista | 1,453 |
| Vendedor | 1,272 |
| ProveedorNuevo | 1,261 |
| Banco | 1,135 |
| Usuario | 1,105 |
| Trabajador | 890 |
| Each child dialog | 120–370 |

### Options

| Option | Approach | Pros | Cons |
|---|---|---|---|
| **A (recommended)** | Capability-first: G10, G11, G12 and the Anexo grid, each landing with its first consumer; then the masters in dependency order | Reviewable; fits TDD; the masters become cheap; W4/W5 are unblocked early | Few user-visible results in the first PRs |
| B | By master (Cliente end to end, then Proveedor, …) | Demoable | Capability code hidden inside master PRs; over 800 lines; rework |
| C | Pickers and lookups first, then the masters | Unblocks the W4 forms earliest | G11 is discovered late |

### Recommended sequence

Line forecasts are rough and include tests.

| # | Step | Lines | PRs |
|---|---|---|---|
| 1 | G10 LookupDialog, mock search and a first consumer (BuscarTrabajador / TrabajadorPuntoVenta) | ~500–700 | 1, maybe 2 |
| 2 | G11 mock nested resources and schema (~450), then UI tabs and child grid (~650) | ~1,100 | 2 |
| 3 | G12 row actions, the shared Anexo grid, and Banco as the G11 pilot | ~700–900 | 2 |
| 4 | Trabajador (G12), then Vendedor with PanelCargarTrabajador | ~600 + ~600 | 2 |
| 5 | Transportista, with the Chofer anexos | ~500 | 1 |
| 6 | Usuario: password and confirmation, perfil permission tree, Autorizar Series | ~1,000–1,300 | 2 |
| 7 | Cliente (4 child dialogs and padrón), plus the BuscarCliente / FormClienteBuscar pickers (~300) | ~1,400–1,800 | 2–3 |
| 8 | Proveedor (dirección, padrón config), plus the BuscarParametroProv picker (~200) | ~1,000–1,300 | 2 |
| 9 | Item (6 child dialogs, 12 tabs), plus BuscarItemConversion | ~1,800–2,400 | 3 |
| 10 | The remaining picker FormBuscarVehiculo (~200), then Socio acciones (~400–500) | ~600–700 | 1–2 |

The total is about 9,000–10,000 lines in 15–18 PRs.

Each master also follows the W2 per-catalog checklist, which adds about 100–200 lines:

- `catalog.js`;
- seeds, `menu.json` and `permissions.json`;
- `formRegistry`;
- the four spec types.

## Risks

- **Inventory heuristics mislabel rows:** 51 of the 74 rows are not W3. Fix them before sizing W4–W7, whose counts are just as suspect.
- **G11 is new architecture:** a nested contract, child validation and dirty state across tabs. Item alone is 3 or more PRs. Budget a design spike.
- **Replacing the W2 lookups:** the read-only `trabajadores` and `usuarios` lookups become real masters.
  - That touches their W2 consumers (TrabajadorPuntoVenta, UsuarioCorrelativo) and those tests, so it needs parity tests.
  - `usuarios` is projected from `users.json`, and the password must never leave it.
- **The backend contract is still undefined:** the mock defines it. The nested routes and the `X-User-Id` stamping must be decided once.
- **Unresolved data shared with W6:** cuentas contables (W6) and the shared scopes of Moneda/TipoDocIden are open, so the stubs may drift.
- **Two UIs for one rule:** FormUA/FormPanelUA duplicate the semantics of the W2 usuario-correlativos catalog.
- **Duplicate desktop screens:** Proveedor/ProveedorNuevo, Vendedor/VendedorNuevo and Cliente/ClienteNuevo may double the work if both are live.
- **Permissions:** the W2 miTipoCambio read-only exception and the real W6 permissions remain open. The Usuario/perfil permission editor in W3 may force the W6 decision earlier.

## Open business questions

1. **Scope:** is W3 the capabilities plus all T4 masters, the 6 pickers and Socio acciones, with T5 and the orphan dialogs deferred to W4/W5? Or should Item become its own wave?
2. **Duplicates:** which screen of each pair is live: Proveedor or ProveedorNuevo, Vendedor or VendedorNuevo, Cliente or ClienteNuevo?
3. **Live child dialogs:** which of these are still used: FormClienteCredito, FormClienteCuenta, FormItemPercepcion, FormItemConfigDscto, FormConfigPadronProveedor, and Socio acciones?
4. **Item:** port all 12 tabs and 6 child grids, or an MVP first (identity, classification, units, prices, almacenes)?
5. **Usuario:** port the perfil permission tree and Autorizar Series in W3, or leave them to the W6 permissions work?
6. **Padrón (SUNAT) and Anexo activation:** keep the rules exactly as in Java, or reduce them?
7. **Backend contract:** is it fixed, or does the mock define the nested `/v1/{c}/{id}/{child}` routes?
8. **Cuentas contables for the Cliente/Item config:** stub them read-only now, or defer those tabs to W6?
9. **Inventory cleanup:** may the 51 reassigned rows (shell, infrastructure, dead code, W4–W7) be dropped or moved without porting? That includes ImagePanel, which is dead, and means no image/file upload.

## Decisions (user, 2026-10-23)

| Question | Decision |
|---|---|
| Scope | Capabilities (G10, G11, G12, shared Anexo grid, password and confirmation, textarea) plus the masters Banco, Trabajador, Vendedor, Transportista, Usuario, Cliente, Proveedor and Item, the 6 pickers and Socio acciones. |
| Duplicates | Port only the "Nuevo" screens: ClienteNuevo and VendedorNuevo (the only ones `Main.java` wires) and ProveedorNuevo (`Main.java` wires both Proveedor screens; the old one is dropped). |
| Item | MVP first: identity, classification, units, prices and almacenes. The other tabs and child grids are deferred. |
| Usuario | The perfil permission tree editor and Autorizar Series are in W3. |

Defaults carried over from W2 (not asked again):

- The mock defines the contract, including the nested `/v1/{c}/{id}/{child}` routes.
- Business rules are ported as in Java.
- Desktop bugs are fixed and marked `[DEVIATION]`.
- Cuentas contables is a read-only stub lookup, since it is W6 data.
- T5 and the 8 orphan dialogs are deferred to W4/W5.
- The 51 non-W3 inventory rows are reassigned or dropped.
- No image or file upload.
