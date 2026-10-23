# Proposal: SoftCommerce Web Migration — Wave 2 (Reference Catalogs)

## Intent

Wave 1 proved the CRUD templates on one catalog (Localidad), but the generic stack only supports text fields, one `empresas` select and the ubigeo cascade, and the mock is hardcoded for Localidad. Most masters and every later transactional wave depend on reference catalogs. Wave 2 generalizes the stack and migrates 38 catalogs. Each catalog must keep the desktop business rules exactly as they are in Java, and parity is proven by tests.

## Scope

### In Scope (38 catalogs: 12 + 7 + 13 + 6)
- **T1 (12)**: Aduana, Color, ClasifCliente, ClasifInventario, CondicionPago, EstadoDocumento, Laboratorio, Marca, Nacionalidad, Tamano, TipoAnexo, TipoDescuento.
- **T2 (7 + 4 orphans)**: Familia, SubFamilia, MotivoDescuento, MotivoNC, MotivoTraslado, TipoTrabajadorPerfil, Empresa; TipoTrabajador, Turno, MarcaVehiculo, ModeloVehiculo.
- **T3 (13 + 2 orphans)**: Almacen, Zona, Correlativo, UsuarioCorrelativo, PuntoVenta, ZonaDistancia, TipoMovInventario, UnidadMedida, TipoCambio, Promocion, TrabajadorPuntoVenta, Chofer, Socio; Ubicacion, Vehiculo.
- **Generic capabilities**:
  - Mock registry refactor: declarative `refs`, `unique` and `joins`, with seeds registered automatically.
  - G1 catalog-backed select.
  - G2 dependent selects.
  - G3 boolean field.
  - G4 numeric/decimal field.
  - G5 date field, with range and not-future rules.
  - G6 composite uniqueness, with 409/422 rule errors mapped to fields.
  - G7 static options.
  - G8 conditional fields.
  - G13 formatted and joined columns.
  - G14 read-only server code.
  - G15 declarative catalog registry.
- **Read-only seeded lookups**: Moneda, TipoDocIden, TablaSunat and TablaDetalleSunat.
- **Done per catalog**: list, the five register modes, permissions, Alt+letter shortcuts, and parity between the HTTP mock and the in-browser mock.

### Out of Scope
- T4 rich masters, which move to W2b together with G10 (LookupDialog), G11 (master-detail) and G12 (row actions).
- G9 (textarea, password, inline create). No in-scope register uses `JTextArea` or `JPasswordField`, and none opens a nested register.
- Moved to the waves that own them: T5 transactional screens, the 8 orphan dialogs and the 13 document `Buscar*` pickers.
- The Moneda, TipoDocIden and SUNAT screens, which move to W6.
- Reports, printing and export.
- A real backend. Any change to `jona-ui`.

## Capabilities

### New Capabilities
- `softcommerce-catalog-registry`: a declarative registry for each catalog (fields, columns, refs, unique keys, joins, menu, permissions) that the UI and both mocks consume.
- `softcommerce-reference-catalogs`: the 38 catalogs and their Java-parity business rules.

### Modified Capabilities
- `softcommerce-crud-templates`: adds field kinds G1–G8, G13 columns, the G14 read-only code, and mapping of server errors to fields.
- `softcommerce-mock-api`: makes the CRUD generic for every `/v1/{catalog}`, adds FK/composite-unique errors (409/422 with `details`), and adds the read-only cross-wave lookups.

## Approach

Option A from the exploration: capability-first thin vertical slices. Each capability lands together with the first catalog that needs it. Inside each batch, catalogs follow dependency order: no FK first, then one FK, then chained, then partners. The mock defines the contract, as in W1. Coded ids stay as zero-padded strings, and the user id comes from the session. Views follow the JONA view-unit pattern with mobile-first `jona-ui@1.5.1`. Development follows strict TDD and uses table-driven tests for each catalog.

## Affected Areas

| Area | Impact |
|---|---|
| `web_ts/softcommerce/mock-server/core/**`, `http/loadSeed.js` | Modified (generic registry) |
| `web_ts/softcommerce/src/services/mock/**` | Modified |
| `web_ts/softcommerce/src/**/crud/**`, `formRegistry.ts` | Modified |
| `web_ts/softcommerce/src/features/catalogs/**` | New |
| Seeds, `menu.json`, `permissions.json` | Modified |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Generalizing the mock breaks Localidad and W1 tests | Med | Land the refactor first as its own PR, with dual-source parity tests and the W1 suites unchanged |
| Contract drift on coded ids or the user id | Med | Contract tests in `catalogServiceContract` |
| A catalog is in the wrong tier, or a rule is missed | Med | Re-read the Java register before each batch; split a catalog out if it grows |
| The cross-wave seeds diverge from W6 | Low | Seed them read-only and document them as the W6 contract |

## Rollback Plan

Revert the chained PRs in reverse order. Each catalog batch only adds entries to the registry. The registry-refactor PR reverts to the W1 mock.

## Dependencies

- W1 archived. `jona-ui@1.5.1`.

## Success Criteria

- [ ] All 38 catalogs meet the done bar.
- [ ] Every ported Java rule has a test.
- [ ] The W1 suites pass unchanged.
- [ ] `npm test` and `npm run typecheck` pass in each PR.

## Review Workload Forecast

~14 chained PRs, each ≤800 lines (~7–9k lines in total), in 7 groups. Groups 4–7 span 2–3 PRs each. Budget risk: High, so chaining is required.

1. Mock refactor (~600 lines).
2. G15 + G14 + T1a.
3. T1b.
4. G1 + G3 + T2.
5. G4, G5, G7 and G13, with the catalogs that need them.
6. G2, G6 and G8, with the T3 chain.
7. The remaining T3 catalogs.
