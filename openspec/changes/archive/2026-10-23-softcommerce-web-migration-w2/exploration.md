# Exploration: softcommerce-web-migration-w2

Wave 2 of the SoftCommerce desktop → web migration. Engram mirror: `sdd/softcommerce-web-migration-w2/explore`.

## Summary

The 128 W2 rows of `inventory.csv` are about 46 real catalogs, and only 12 are trivial. W2 also holds operational screens and 13 document pickers that belong to later waves.

Recommendation:

- Build capabilities first, then batch catalogs.
- Scope W2 to the ~38 simple and medium catalogs: tiers T1–T3 plus the 6 orphan catalogs.
- Move the rich masters (T4) to a separate W2b.
- Move the transactional screens to the waves that own them.

## 1. Inventory grouped into catalogs

The 128 rows break down as:

- 19 lookup dialogs.
- 46 `PanelTF*` list frames.
- 63 register-class rows: 59 `Register*` plus 4 `UiRegister*`. The 4 are the MVP duals of Localidad, already done in W1, and TipoCambio.

### Pairing

45 distinct registers pair with the 46 lists. `RegisterVendedor` serves both `PanelTFVendedor` and `PanelTFVendedorNuevo`. Three pairs have mismatched names:

| List | Register |
|---|---|
| Banco | `RegisterBancoAnexo` |
| MotivoNC | `RegisterMotivoNotaCredito` |
| Transportista | `RegisterTransportistaNuevo` |

### Orphan registers (14)

Six are real catalogs whose list is a `Pnl*` frame that the inventory misassigned to W3:

- TipoTrabajador
- Turno
- Ubicacion
- Vehiculo
- MarcaVehiculo
- ModeloVehiculo

Eight are dialogs opened from other flows:

- ListaPrecios
- Lote
- LoteSalida
- LoteTransferencia
- SalidaMasivaInventario
- ConsultaKardex
- ConsultaStockHistorico
- ItemResumen

### Lookups (19)

Six are entity pickers:

- BuscarCliente
- FormClienteBuscar
- BuscarTrabajador
- FormBuscarVehiculo
- BuscarParametroProv
- BuscarItemConversion

Thirteen are document pickers, which depend on transactional documents from W3–W6:

- `BuscarNC*` (5 files)
- `BuscarOrdenCompra*Ajuste`
- `BuscarIngreso*` (3)
- BuscarSolicitudTransferencia
- BuscarOrdenRecojo
- BuscarSalidasEntradas

### Shape tiers (46 lists)

| Tier | Count | Catalogs |
|---|---|---|
| T1: flat, text only (server-generated code, description max 100) | 12 | Aduana, Color, ClasifCliente, ClasifInventario, CondicionPago, EstadoDocumento, Laboratorio, Marca, Nacionalidad, Tamano, TipoAnexo, TipoDescuento |
| T2: text plus a flat select or a boolean | 7 | Familia, SubFamilia, MotivoDescuento, MotivoNC, MotivoTraslado, TipoTrabajadorPerfil, Empresa |
| T3: chained selects, dates, decimals or composite uniqueness | 13 | Almacen, Zona, Correlativo, UsuarioCorrelativo, PuntoVenta, ZonaDistancia, TipoMovInventario, UnidadMedida, TipoCambio, Promocion, TrabajadorPuntoVenta, Chofer, Socio |
| T4: rich masters (tabs, child grids) | 10 | Usuario, Trabajador, Vendedor, VendedorNuevo, ClienteNuevo, Proveedor, ProveedorNuevo, Transportista, Banco, Item |
| T5: transactional or process screens misfiled as catalogs | 4 | CierreAperturaCaja, Ingreso, NotaSalida, ServicioTransporte |

The orphan catalogs fall into two tiers:

- T2: TipoTrabajador, Turno, MarcaVehiculo, ModeloVehiculo.
- T3: Ubicacion, Vehiculo.

The W1 estimate of "~90 simple catalogs, ~11 PRs" is stale.

### Business rules found in the desktop code

| Catalog | Rule |
|---|---|
| Correlativo | Unique per serie + tipo de documento |
| UsuarioCorrelativo | Unique per documento + serie + usuario |
| TipoCambio | Unique per fecha + moneda |
| CierreAperturaCaja | Fecha unique and not in the future |
| Socio | DNI and RUC validation |
| Trabajador | Activar and desactivar actions |
| Usuario | Password + confirmation; permission flags |
| UnidadMedida, Correlativo | Conditional fields |

Two more findings:

- No W2 register uses image or file widgets.
- Anular is a no-op for catalogs.

## 2. Gap list against the W1 generic stack

What the W1 stack supports today:

- `FieldConfig` has only these field kinds:
  - `text`.
  - `select` with `lookup: 'empresas'` (a literal type).
  - `cascade` with `lookup: 'ubigeo'` (also a literal type).
- `InterLookupService` has only `empresas()` and `ubigeoChildren()`.
- Form values are `Record<string, string>`.
- The mock validators hardcode the `id_empresa` and `id_ubigeo` checks.

| # | Gap | Needed by |
|---|---|---|
| G1 | Catalog-backed select over any `/v1/{catalog}`; a generic lookup | ~35 catalogs |
| G2 | Generalized dependent selects (the `CascadeSelect` loader is ubigeo-specific) | Correlativo, Ubicacion (3 levels), ZonaDistancia, Almacen, PuntoVenta, UsuarioCorrelativo, SUNAT table → detail |
| G3 | Boolean field (checkbox or switch) | 45 of 59 registers |
| G4 | Numeric/decimal field with precision and range | TipoCambio, UnidadMedida, ZonaDistancia, Turno, Item |
| G5 | Date field with range and not-future rules (`JDatePicker` exists) | TipoCambio, Promocion, Trabajador, TrabajadorPuntoVenta, CierreAperturaCaja |
| G6 | Composite uniqueness; server rule errors (422/409) mapped to a field | Correlativo, UsuarioCorrelativo, TipoCambio, Caja, Socio |
| G7 | Select or radio group with static options | Correlativo, UnidadMedida, TipoMovInventario, Turno |
| G8 | Conditional visibility or enablement | UnidadMedida, Correlativo |
| G9 | Textarea; password + confirm; inline create of a related catalog | Vendedor, Proveedor, Usuario, TipoCambio |
| G10 | Generic `LookupDialog` for entity pickers | 6 entity `Buscar*`, T4, later transactional forms |
| G11 | Master-detail (tabs, child grids, `/v1/{c}/{id}/{child}`) | Item (7 grids), ClienteNuevo, Proveedor, Transportista, Banco, Usuario |
| G12 | Custom row actions (activar/desactivar, nullify) | Trabajador, T5 |
| G13 | Column formatting and joined display columns (mock `enrich()` is Localidad-only) | Nearly every list with an FK |
| G14 | Read-only server-generated code on edit | All catalogs |
| G15 | Declarative catalog registry (config, formRegistry, menu, permissions) | All catalogs |

### Cross-wave reference data

| Reference data | Owning wave | Needed by |
|---|---|---|
| Moneda (`PnlMoneda`) | W6 | TipoCambio |
| TipoDocIden | W6 | Socio and others |
| SUNAT tables (`TablaSunat` / `TablaDetalleSunat`) | — | Familia, SubFamilia, UnidadMedida, TipoMovInventario |

## 3. Mock server and per-catalog cost

Adding a catalog today touches the following places. Several of them are hardcoded for Localidad.

1. `mock-server/core/catalog.js`: the `CATALOGS` registry. `enrich()` and `validate()` are Localidad-specific.
2. `mock-server/core/validators.js`: hardcodes the `id_empresa` and `id_ubigeo` checks.
3. Three more hardcoded lists:
   - `store.js` `TENANT_SECTIONS`
   - `http/loadSeed.js` `SEED_FILES`
   - `src/services/mock/seed.ts` imports
4. Seed JSON per tenant (`demo`, `botica`).
5. Registration entries:
   - `menu.json`
   - `permissions.json`
   - `formRegistry.ts`
6. Tests:
   - config spec
   - modes spec
   - `UiX.spec`
   - `catalogServiceContract`

The mock registry needs a refactor before it can scale. The new registry should declare `refs`, `unique` and `joins`, and it should register seed files automatically.

| Tier | Lines per catalog, tests included |
|---|---|
| T1 | ~55 with table-driven tests, ~130 with hand-written tests |
| T2 | ~80–160 |
| T3 | ~150–300 |
| T4 | 400–800, one to three PRs each |

## 4. Slicing options (800 lines per PR)

| Option | Approach | Pros | Cons | PRs |
|---|---|---|---|---|
| A | Capability-first, then batch catalogs | Reviewable; fits strict TDD; catalogs become cheap | Nothing user-visible in the first PRs | ~14 for T1–T3; T4 adds ~10 |
| B | By business domain | Each PR is demoable | Capability code lands inside catalog PRs; can exceed 800 lines; rework | ~18–22 |
| C | By dependency order (no FK → 1 FK → chained → partners) | Mock FK validation and seed stay consistent | Capabilities are discovered late; churn | ~16–20 |

**Recommended:** option A, using C's ordering inside the catalog batches. Each capability lands together with the first catalog that needs it.

| Slice | Capabilities | Unlocks |
|---|---|---|
| 1 | Mock registry refactor, G1, G3, G15 | T1 and part of T2 |
| 2 | G4, G5, G7, G13 | TipoCambio, Promocion, Turno |
| 3 | G2, G6, G8 | The T3 chain |

## Risks

- **Inventory heuristics:** they misassign screens, so their wave counts are not reliable for sizing.
- **New architecture:** G10 and G11 are new architecture, not configuration. Item alone is a multi-PR effort.
- **Cross-wave reference data:** Moneda, TipoDocIden and the SUNAT tables must be seeded early.
- **Contract drift:** desktop ids are zero-padded string codes. Desktop writes pass the user id, which the web contract must infer from the session.
- **Mock generalization:** it touches code covered by W1 tests (`routes.spec`, `seedSwap`, `catalog.spec`), so it needs dual-source parity tests.

## Open business questions

1. **Scope:** which catalogs are actually used, and which are dead?
2. **Duplicates:** which of each `*Nuevo` pair is live (Proveedor, Vendedor, Cliente)?
3. **Backend contract:** is it fixed, or does the mock define it?
4. **Desktop rules:** should rules be ported exactly as in Java, or reduced?
5. **Definition of done:** what does done mean for a catalog?
6. **Cross-wave reference data and document pickers:** how should they be handled?
