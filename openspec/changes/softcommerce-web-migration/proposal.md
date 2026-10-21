# Proposal: SoftCommerce Web Migration — Wave 1 (Foundation + Reference Slice)

## Intent

`desktop_java/softcommerce-desktop` exposes ~400 Swing GUIs tied to Oracle. The web app `web_ts/softcommerce` is still empty. Wave 1 sets up the foundation: the mock contract, the auth seam, the shell and a config-driven CRUD template, and proves them with one complete catalog (Localidad). Later waves can then migrate screens by configuration instead of hand-building each one.

## Scope

### In Scope
- **W1a**: React + Vite + vitest scaffold with `jona-ui`. Zero-dependency Node mock server. Auth seam (`InterAuthService`, `AuthServiceHttp`, `AuthServiceMock`, typed scenario fixtures, a pure composer that validates `VITE_*` and loads the mock through dynamic import). Login with tenant (BdEmpresa) and credentials, which rejects `flaghabilitado='D'` and `flagEscritorio='N'`. A second step selects empresa, punto de venta and period (valid dates, `>= INICIO_ACTIVIDADES`, `fin >= inicio`, same accounting year).
- **W1b**: Shell with a menu tree from `GET /menu` and 13 permission flags per form from `/forms/{id}/permissions`. A tab workspace keeps one tab per form, so opening a form again re-selects its tab.
- **W1c**: Config-driven list template (toolbar gated by permissions, filter, sort, double-click opens details) and register template (INSERT/UPDATE/DELETE/DETAIL/CLONE). Localidad slice with an Empresa combo, cascading Departamento→Provincia→Distrito lookups, required fields, and uppercase text up to 100 characters. A script generates `inventory.csv` of all GUI classes, reading sources as ISO-8859-1.

### Out of Scope
- W2–W7 screens (roadmap in `explore.md`): catalogs, complex masters, Ventas, Inventario, Contabilidad, Reportes/SUNAT.
- Real backend or Oracle. PL/SQL rules beyond what the slice needs. The ~40 `BdEmpresaParametro` flags are only seeded.
- Jasper, printing, SUNAT and PLE. Excel export. ANULAR mode.
- Any change to the Java app or to `jona-ui`.

## Capabilities

### New Capabilities
- `softcommerce-mock-api`: mock HTTP contract, seed data, error shape and correlation id.
- `softcommerce-auth-session`: login, tenant, empresa, punto de venta and period validation; session lifecycle.
- `softcommerce-shell-workspace`: menu tree, per-form permissions, tab workspace.
- `softcommerce-crud-templates`: list and register templates driven by config, with register modes.
- `softcommerce-localidad-catalog`: the Localidad reference slice with Ubigeo and Empresa lookups.
- `softcommerce-gui-inventory`: the GUI inventory script and its CSV.

### Modified Capabilities
- None

## Approach (key decisions)

| Fork | Choice | Tradeoff |
|---|---|---|
| Mock server | Copy the h2h zero-dependency Node pattern | Proven and has no dependencies, but more hand-written code than MSW or json-server |
| uijona gaps | App-local JONA components in `src/shared/ui`, promoted to `jona-ui` later in separate versioned PRs | Some duplication for a while, but W1 does not depend on npm publish cycles |
| uijona consumption | Pinned npm `jona-ui@1.3.0` (exact) | Reproducible and CI does not have to build `uijona`; `file:../uijona` (as in `website-develtrex`) is only for the promotion step. Note: local `web_ts/uijona` is 1.3.1 but npm's latest is 1.3.0 (verified with `npm view jona-ui versions`), so `~1.3.1` would not install |
| MDI | Tabs (`JTabs`), one per form | No floating windows |
| Multi-DB | `BdEmpresa` becomes a tenant option from `/auth/session-options`, sent as `X-Tenant-Id` | Hides ip, port and schema |

Views follow JONA feature-based layout (InterUi, Impl, View). Development follows strict TDD.

## Affected Areas

| Area | Impact |
|---|---|
| `web_ts/softcommerce/**` | New |
| `web_ts/softcommerce/mock-server/**` | New |
| `web_ts/softcommerce/scripts/inventory/**` | New |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| The menu tree is inferred (the real one lives only in Oracle) | High | Isolate it in seed JSON so it can be replaced |
| The codex seam reference is uncommitted | Med | Copy the patterns; do not import them |
| A uijona gap grows larger than expected | Med | Build the smallest local component |
| W1c goes over 800 lines | Med | Split the inventory script into its own PR |

## Rollback Plan

Everything new lives under `web_ts/softcommerce`. To roll back, revert the chained PRs in reverse order (W1c→W1b→W1a). Nothing else depends on them.

## Dependencies

- `jona-ui@1.3.0` on npm (latest published; local 1.3.1 is unpublished). Node 20 or newer.

## Success Criteria

- [ ] `npm test` and `npm run typecheck` pass in each PR.
- [ ] Login rejects disabled users, users without desktop access, and invalid periods, with a test for each rule.
- [ ] The menu renders from `/menu`. Toolbar actions follow the permission flags. Opening a form twice re-selects its existing tab.
- [ ] All five Localidad modes work against both the mock server and `AuthServiceMock`-style fixtures, and the Ubigeo cascade resets the levels below the one that changed.
- [ ] `inventory.csv` lists every GUI class and excludes base classes and renderers.

## PR Slicing (auto-chain, 800-line budget)

W1a (~700 lines) → W1b (~600) → W1c-template+Localidad (~650) → W1c-inventory (~150).

## Proposal question round (needs user review)

1. Is the first audience pilot users replacing the desktop app, or a demo? This decides how closely W1 must match the desktop behavior.
2. Can the period be changed after login without logging out?
3. Localidad delete: logical (`eliminar`), physical (`eliminarFisico`), or both? Under which permission?
4. Is keyboard parity (Enter navigation, Esc, F-keys) required in W1?
5. Is there an export of the Oracle menu and profile tables that could replace the inferred tree?

**Assumptions until answered**: demo-grade audience, period fixed per session, logical delete only, basic keyboard support, inferred menu.
