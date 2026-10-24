# Proposal: SoftCommerce Web Migration — Wave 3 (Rich Masters)

## Intent

W4 (sales) and W5 (purchasing) cannot start without the Cliente, Proveedor, Item and Trabajador/Vendedor masters or an entity picker. W2 deferred these as "W2b", and the inventory's 74 W3 rows hide only 23 real ones, all children of those masters. W3 absorbs W2b: it builds the missing generic capabilities and ports the T4 masters with Java-parity rules.

## Scope

### In Scope
- **Capabilities**:
  - G10 LookupDialog, with a mock `?q=` search.
  - G11 master-detail: tabs, child grids and nested `/v1/{c}/{id}/{child}` CRUD.
  - G12 row actions (activar/desactivar, estado).
  - The shared Anexo grid.
  - Password + confirmation and textarea field kinds.
- **Masters, "Nuevo" screens only**:
  - Banco, Trabajador, VendedorNuevo (+ PanelCargarTrabajador) and Transportista.
  - Usuario, with the perfil permission tree and Autorizar Series.
  - ClienteNuevo (4 child dialogs + padrón) and ProveedorNuevo (dirección + padrón config).
  - Item MVP: identity, classification, units, prices and almacenes.
- **Pickers (6)**: BuscarCliente, FormClienteBuscar, BuscarTrabajador, FormBuscarVehiculo, BuscarParametroProv, BuscarItemConversion. Socio acciones comes last.
- **W2b leftovers**: the Chofer activation tab and the Vehiculo propietario picker.
- **Read-only stubs**: a cuentas-contables lookup (W6 data).
- **Inventory**: an override map reassigns the 51 non-W3 rows.

### Out of Scope
- The legacy Proveedor, Cliente and Vendedor screens.
- The remaining Item tabs and child grids.
- T5 screens and the 8 orphan dialogs (W4/W5).
- The real cuentas contables and the W6 permissions model.
- Image/file upload.
- A real backend. Any change to `jona-ui`.

## Capabilities

### New Capabilities
- `softcommerce-lookup-dialog`: G10 search/pick, its filters and paging, and the mock search contract.
- `softcommerce-master-detail`: G11 tabs, child grids, nested CRUD, child uniqueness and cascade delete.
- `softcommerce-row-actions`: the G12 action registry and its permission mapping.
- `softcommerce-anexo`: the shared Anexo grid, its activation and padrón.
- `softcommerce-masters`: the 8 masters, the pickers, Socio acciones and their Java rules.
- `softcommerce-user-permissions`: the perfil permission tree and Autorizar Series.

### Modified Capabilities
- `softcommerce-crud-templates`: the password and textarea kinds, and the lookup field.
- `softcommerce-mock-api`: nested routes, `?q=` search, cascade and row-action endpoints.
- `softcommerce-catalog-registry`: child/master entries, and promotes lookups to writable masters.
- `softcommerce-reference-catalogs`: R-REF-11 `usuarios`/`trabajadores` become masters; R-REF-12 exclusions are closed.
- `softcommerce-auth-session`: users and permissions edited in W3 drive login and grants; a password never leaves the server.
- `softcommerce-gui-inventory`: the wave override map.

## Approach

Exploration Option A, capability-first. Each capability lands with its first consumer, in this order:

1. G10 + BuscarTrabajador.
2. G11 mock, then G11 UI.
3. G12 + Anexo + Banco (the pilot).
4. Trabajador, then Vendedor.
5. Transportista.
6. Usuario.
7. Cliente.
8. Proveedor.
9. Item MVP.
10. Vehiculo picker + Socio acciones.

The W2 defaults still hold:
- The mock defines the contract.
- Rules are ported exactly as in Java; desktop bugs are fixed and marked `[DEVIATION]`.
- Development follows strict TDD.

The `usuarios`/`trabajadores` lookups keep their slug, row shape and filters. The masters are supersets of them, so W2 consumers stay unchanged.

## Affected Areas

| Area | Impact |
|---|---|
| `web_ts/softcommerce/mock-server/**`, `src/services/mock/**` | Modified (nested routes, search) |
| `web_ts/softcommerce/src/**/crud/**`, `formRegistry.ts` | Modified |
| `web_ts/softcommerce/src/features/masters/**`, `lookup/**` | New |
| Seeds, `users.json`, `menu.json`, `permissions.json` | Modified |
| Inventory script | Modified |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| G11 is new architecture (dirty state across tabs) | High | A design spike, with the mock landed before the UI |
| Replacing the lookups breaks UsuarioCorrelativo/TrabajadorPuntoVenta | Med | Parity tests before the swap |
| A password leaks through the `usuarios` projection | Med | A contract test that no response carries `password` |
| Autorizar Series duplicates `usuario-correlativos` | Med | One shared store and a cross-UI test |
| The permission editor forces W6 decisions | Med | Scope it to the existing 13 flags |
| The cuentas stub drifts from W6 | Low | Document it as the W6 contract |

## Rollback Plan

Revert the chained PRs in reverse order. The lookup-replacement PR reverts to the W2 read-only lookups.

## Dependencies

- W2 archived; `jona-ui@1.5.1`.

## Success Criteria

- [ ] Every master, picker and child passes the W2 done bar and has its Java rules tested.
- [ ] The W1/W2 suites pass unchanged.
- [ ] `npm test` and `typecheck` pass in each PR.

## Proposal question round (answered 2026-10-23)

| Question | User decision |
|---|---|
| Can users created in Usuario log in, and do perfil edits apply at the next login? | Yes, fully connected. The mock login reads the same users and permissions that Usuario edits, and a password never leaves the server. |
| Do Autorizar Series and the W2 UsuarioCorrelativo edit the same data? | Yes, one shared store behind two screens. |
| Do the W2 deferrals (Chofer activation tab, Vehiculo propietario picker) close in W3? | Yes, both are in W3. They reuse the Anexo grid and the picker dialog. |
| Do the padrón (SUNAT) and Anexo activation rules port exactly? | Yes, as in Java, and desktop bugs are fixed as `[DEVIATION]`. This is the W2 default. |
