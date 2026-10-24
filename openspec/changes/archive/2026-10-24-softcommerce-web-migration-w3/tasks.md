# Tasks: SoftCommerce Web Migration, Wave 3 (Rich Masters)

All paths are relative to `web_ts/softcommerce/` unless stated. Strict TDD: every task is RED (failing spec naming the spec scenario) -> GREEN (minimum code) -> REFACTOR (tests stay green). Where no genuine RED is possible (seed-only, config-only or data rows), the task says `MUTATION`: break the rule in the registry entry and prove the table-driven test fails, then restore. Tests ship in the same commit as the code they prove (work-unit commits, Conventional Commits, no AI attribution).

Conventions used by every task:
- **Table-driven and dual-source**: per-master tests are generated from the registry (`describe.each`) plus rows in `test/catalogs/<slug>.cases.ts` (`deviation:true` rows for [DEVIATION] items). Every case runs against the in-browser mock AND the HTTP mock through `catalogServiceContract` (R-MOCK-18, S-MOCK-35, S-MST-37). Child and composite cases add the nested routes and actions to that contract.
- **Desktop facts are read at apply time, from the METHOD BODIES**, never guessed and never taken from field names: scope, stamp (`id_usuario`, `id_empresa`), `codeWidth`, exact messages and their order, defaults, enabling rules. Each task names the Java file to read under `desktop_java/softcommerce-desktop/src/com/develtrex/softcommerce/` (`view/formularios/` unless stated; locate unnamed ones with `fd`). Record each fact in the PR body.
- **Master task template (MT)**: read the named Register file; RED = rows in `test/catalogs/<slug>.cases.ts` (required, max, normalize, messages and their order, mode, ref, unique, per-mode defaults) failing because the entry is missing; GREEN = `mock-server/registry/catalogs/<slug>.js` + `registry/index.js` line + seed JSON + `data/menu.json` node + `data/permissions.json` grant (13 flags). `formRegistry` is derived from the registry (no edit). MT also asserts R-REG-19 consistency (menu node, formId, 13 flags) through the shared consistency spec.
- **W1 and W2 suites stay green and unchanged in every slice** (S-REG-29, S-CRUD-50). The ONE documented exception is the field-interaction helpers of `src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx` (lines 44 to 105 drive a select; they become a lookup driver, R-MST-18, S-LKP-16, D20), done in W3-3 only. Assertions keep their meaning. W1/W2 spec files are not otherwise edited; new capabilities get NEW spec files.
- **Test budget lesson (W2)**: tests were 60 to 65 percent of every slice. The 800-line budget is realistic only with the pre-marked splits, and each slice below names a fallback split point at a task boundary. Check `git diff --shortstat <base>...HEAD` (excluding `package-lock.json` and seed/data/golden JSON) after each GREEN pair and split BEFORE opening the PR, never after.
- **Apply does not push**: apply commits locally per the commit plan. Push, PR creation and retargeting are done by the orchestrator.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~15,900 total across 25 slices (23 design PRs, with W3-11 and W3-16 pre-split), additions + deletions, seed/data/golden JSON and `package-lock.json` excluded; 350 to 790 each |
| 800-line budget risk | High (total); no slice is forecast above 790, nine are flagged near the limit |
| Chained PRs recommended | Yes |
| Suggested split | W3-0 -> W3-1 -> W3-2 -> W3-3 -> W3-4a -> W3-4b -> W3-5a -> W3-5b -> W3-6 -> W3-7 -> W3-8 -> W3-9 -> W3-10 -> W3-11a -> W3-11b -> W3-12 -> W3-13 -> W3-14 -> W3-15 -> W3-16a -> W3-16b -> W3-17 -> W3-18 -> W3-19 -> W3-20 |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |
| Review budget | 800 changed lines per PR |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
800-line budget risk: High

Reason for "No": auto-chain with feature-branch-chain is already selected, the design pre-marks the splits of W3-11 and W3-16, and every slice has a named fallback split below. Flagged slices (780 to 790 forecast: W3-2, 4a, 5a, 7, 10, 13, 17, 18, and W3-16 before its split) get the fallback applied the moment a RED/GREEN pair would cross 800.

Fallback splits (split BEFORE opening the PR; renumber the later children and retarget their bases):

| Slice | Fallback split (at a task boundary) |
|-------|--------------------------------------|
| W3-0 | 0-i = lib + tests (0.2 to 0.4 minus the map); 0-ii = `wave-overrides.json` is excluded data, so the real fallback is moving 0.3 (real-tree dispositions) to its own PR |
| W3-1 | 1-i = 1.1 search; 1-ii = 1.2 to 1.4 (lookup kind, pickers, stubs) |
| W3-2 | 2a = 2.1 LookupDialog; 2b = 2.2 to 2.4 (LookupField, useLookup, harness) |
| W3-3 | none needed (400); if the W2-helper amendment grows, move 3.3 to W3-4a |
| W3-4a | 4a-i = 4a.1 to 4a.3 (expansion, seeds, nested routes); 4a-ii = 4a.4 to 4a.5 (composite ops) |
| W3-4b | 4b-i = 4b.1 to 4b.3; 4b-ii = 4b.4 to 4b.5 (store children, gates) |
| W3-5a | 5a-i = 5a.1 and 5a.3 (drafts, ChildGrid); 5a-ii = 5a.2 and 5a.4 (tabs, seam) |
| W3-5b | 5b-i = 5b.1 and 5b.2; 5b-ii = 5b.3 to 5b.5 |
| W3-6 | 6-i = 6.1 to 6.2 (registry, endpoints); 6-ii = 6.3 to 6.5 (UI) |
| W3-7 | 7a = 7.2 to 7.3 (preset, rule); 7b = 7.4 to 7.5 (dialogs, Banco) |
| W3-8 | 8a = 8.1 (Chofer); 8b = 8.2 to 8.3 (Trabajador) |
| W3-9 | 9a = 9.1 to 9.2 (textarea, fill); 9b = 9.3 (Vendedor) |
| W3-10 | 10a = 10.1 (Transportista); 10b = 10.2 to 10.4 (Vehiculos, propietario, harness) |
| W3-11 | **Pre-marked**: 11a = tasks 11a.* (`password` kind, PasswordField, `core/password.js`); 11b = tasks 11b.* (Usuario backing, login, no-leak) |
| W3-12 | 12a = 12.1 (core grants, routes); 12b = 12.2 to 12.3 (batch route, login snapshot) |
| W3-13 | 13a = 13.1 to 13.2 (list, tree); 13b = 13.3 to 13.5 (dialog, matrix, mobile) |
| W3-14 | 14a = 14.1 to 14.2 (store, actions); 14b = 14.3 to 14.4 (panel, cross-UI) |
| W3-15 | 15a = 15.1 (padron rule); 15b = 15.2 to 15.3 (UI, Proveedor) |
| W3-16 | **Pre-marked**: 16a = tasks 16a.* (identity block, condición de pago, gates); 16b = tasks 16b.* (direcciones, contactos, cuentas grids) |
| W3-17 | 17a = 17.1 and 17.4 (sustitutos, BuscarCliente harness); 17b = 17.2 to 17.3 (crédito, padrones) |
| W3-18 | 18a = 18.1 to 18.2 (Datos de Item, derived fields); 18b = 18.3 to 18.4 (gated prices, harness) |
| W3-19 | none needed (600); fold into W3-18 only if W3-18 shrinks |
| W3-20 | 20a = 20.1 (core); 20b = 20.2 to 20.6 (screen, closeout) |

### Chain topology

Tracker: `feat/softcommerce-w3` (draft, no-merge PR to `main`, merged last). Child PR #1 targets the tracker; each later child targets the immediately previous child branch. Each child PR body carries a dependency diagram with the current PR marked with the pin emoji, plus start, end, prior dependencies, follow-up and out-of-scope items. A child diff that shows previous-PR changes means the base is wrong: retarget or rebase. The untracked `openspec/changes/softcommerce-web-migration-w3/` folder is NOT committed unless the user asks.

| # | Slice | Branch | PR base | PR title | ~Lines |
|---|-------|--------|---------|----------|--------|
| 1 | W3-0 | `feat/softcommerce-w3-0-inventory-overrides` | `feat/softcommerce-w3` | `feat(inventory): add wave override map for the desktop class inventory` | 350 |
| 2 | W3-1 | `feat/softcommerce-w3-1-search-lookup-core` | W3-0 branch | `feat(softcommerce-mock): add q search, lookup kind, pickers and stubs` | 650 |
| 3 | W3-2 | `feat/softcommerce-w3-2-lookup-ui` | W3-1 branch | `feat(softcommerce): add LookupField and LookupDialog` | 780 |
| 4 | W3-3 | `feat/softcommerce-w3-3-trabajador-lookup` | W3-2 branch | `feat(softcommerce): use BuscarTrabajador lookup in TrabajadorPuntoVenta` | 400 |
| 5 | W3-4a | `feat/softcommerce-w3-4a-children-core` | W3-3 branch | `feat(softcommerce-mock): add child entries, nested routes and composite write` | 780 |
| 6 | W3-4b | `feat/softcommerce-w3-4b-children-rules` | W3-4a branch | `feat(softcommerce-mock): add removal kinds, child unique, cascade, store children and gates` | 600 |
| 7 | W3-5a | `feat/softcommerce-w3-5a-master-register` | W3-4b branch | `feat(softcommerce): add UiMasterRegister with mounted tabs and ChildGrid` | 790 |
| 8 | W3-5b | `feat/softcommerce-w3-5b-master-flows` | W3-5a branch | `feat(softcommerce): add quitar kinds, inline entry, restore and clone for masters` | 700 |
| 9 | W3-6 | `feat/softcommerce-w3-6-row-actions` | W3-5b branch | `feat(softcommerce): add declarative row actions` | 620 |
| 10 | W3-7 | `feat/softcommerce-w3-7-anexo-banco` | W3-6 branch | `feat(softcommerce): add anexo preset, activacion rule and Banco` | 780 |
| 11 | W3-8 | `feat/softcommerce-w3-8-chofer-trabajador` | W3-7 branch | `feat(softcommerce): add chofer activation and Trabajador master` | 760 |
| 12 | W3-9 | `feat/softcommerce-w3-9-textarea-vendedor` | W3-8 branch | `feat(softcommerce): add textarea kind and Vendedor master` | 680 |
| 13 | W3-10 | `feat/softcommerce-w3-10-transportista` | W3-9 branch | `feat(softcommerce): add Transportista, shared vehiculos and propietario lookup` | 780 |
| 14 | W3-11a | `feat/softcommerce-w3-11a-password-kind` | W3-10 branch | `feat(softcommerce): add password kind and PasswordField` | 390 |
| 15 | W3-11b | `feat/softcommerce-w3-11b-usuario` | W3-11a branch | `feat(softcommerce): add Usuario master over the users store` | 390 |
| 16 | W3-12 | `feat/softcommerce-w3-12-grants` | W3-11b branch | `feat(softcommerce): add perfil grants overlay and login snapshot` | 600 |
| 17 | W3-13 | `feat/softcommerce-w3-13-seguridad-perfil` | W3-12 branch | `feat(softcommerce): add Seguridad Perfil screen` | 780 |
| 18 | W3-14 | `feat/softcommerce-w3-14-autorizar-series` | W3-13 branch | `feat(softcommerce): add Autorizar Series panel` | 700 |
| 19 | W3-15 | `feat/softcommerce-w3-15-padron-proveedor` | W3-14 branch | `feat(softcommerce): add padron rule and Proveedor master` | 760 |
| 20 | W3-16a | `feat/softcommerce-w3-16a-cliente-identity` | W3-15 branch | `feat(softcommerce): add Cliente identity block and condicion de pago` | 400 |
| 21 | W3-16b | `feat/softcommerce-w3-16b-cliente-grids` | W3-16a branch | `feat(softcommerce): add Cliente direcciones, contactos and cuentas` | 390 |
| 22 | W3-17 | `feat/softcommerce-w3-17-cliente-b` | W3-16b branch | `feat(softcommerce): add Cliente sustitutos, credito and padrones` | 780 |
| 23 | W3-18 | `feat/softcommerce-w3-18-item-a` | W3-17 branch | `feat(softcommerce): add Item master datos and derived fields` | 780 |
| 24 | W3-19 | `feat/softcommerce-w3-19-item-b` | W3-18 branch | `feat(softcommerce): add Item almacenes` | 600 |
| 25 | W3-20 | `feat/softcommerce-w3-20-socio-acciones` | W3-19 branch | `feat(softcommerce): add Socio acciones screen and wave 3 closeout` | 650 |

Total forecast: ~15,900 changed lines, 25 PRs.

### Per-slice gate (every slice, before the orchestrator opens the PR)

From `web_ts/softcommerce`: `npm test`, `npm run typecheck` (real check: `tsc -p tsconfig.app.json --noEmit && tsc -p tsconfig.node.json --noEmit`), `npm run build`. Record the exact result of each in the PR body, plus the changed-line count (`git diff --shortstat <base>...HEAD`, excluding `package-lock.json` and seed/data/golden JSON); it MUST be <= 800, otherwise apply the slice's fallback split. W3-0 also runs the inventory script from the repo root. Each slice is revertible alone, in reverse order. Reverting W3-8 or W3-11b restores the W2 lookups.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Inventory override map | W3-0 | `npx vitest run scripts/inventory` | `node scripts/inventory/inventory.mjs` twice, byte-compare CSV | `scripts/inventory/*` |
| 2 | q search, lookup kind, pickers, stubs | W3-1 | `npx vitest run mock-server src/services` | `npm run mock`; `GET /v1/trabajadores?q=perez juan` | `core/search.js`, `registry/pickers.js`, four stub entries |
| 3 | Lookup UI | W3-2 | `npx vitest run src/shared/ui/LookupField src/shared/ui/LookupDialog` | dev: harness host, open each picker | two shared/ui dirs, `useLookup` |
| 4 | TrabajadorPuntoVenta lookup | W3-3 | `npx vitest run src/catalogs test/catalogs` | dev: TrabajadorPuntoVenta, type a code | `trabajador-punto-venta.js`, amended W2 UI spec helpers |
| 5 | Children core | W3-4a/4b | `npx vitest run mock-server src/services` | `npm run mock`; nested `GET` and a composite `POST` | `core/children.js`, `core/unique.js`, nested routes |
| 6 | Master register | W3-5a/5b | `npx vitest run src/views/uimasterregister src/shared` | dev: test entry with two tabs, switch tabs | `views/uimasterregister`, `ChildGrid`, `DraftCatalogService` |
| 7 | Row actions | W3-6 | `npx vitest run mock-server src/views test/catalogs` | `POST /v1/{c}/{id}/actions/{a}` | `core/actions.js`, action rendering |
| 8 | Anexo + Banco | W3-7 | `npx vitest run mock-server/core src/views test/catalogs` | dev: Banco INSERT shows `INICIO`; Desactivar | `presets.anexo`, `activacion` rule, `bancos.js` |
| 9 | Chofer tab, Trabajador | W3-8 | `npx vitest run test/catalogs src/catalogs` | dev: Chofer Desactivar; create Trabajador | `choferes.js`, `trabajadores.js` |
| 10 | Textarea, Vendedor | W3-9 | `npx vitest run src/shared/ui/TextAreaField test/catalogs` | dev: Vendedor Buscar trabajador | `TextAreaField`, `vendedores.js` |
| 11 | Transportista, Vehiculos | W3-10 | `npx vitest run test/catalogs src/views` | dev: add a vehiculo, see it in W2 Vehiculos | `transportistas.js`, `vehiculos.js` |
| 12 | Password, Usuario | W3-11a/11b | `npx vitest run mock-server/core src/shared/ui/PasswordField test/catalogs` | dev: create a user and log in | `core/password.js`, `backings.js`, `usuarios.js` |
| 13 | Grants | W3-12 | `npx vitest run mock-server src/session src/services` | dev: edit a perfil, log in again | `core/grants.js`, `perfil-overrides`, session snapshot |
| 14 | Seguridad Perfil | W3-13 | `npx vitest run src/views/uiseguridadperfil` | dev: open the screen, toggle a node | `views/uiseguridadperfil` |
| 15 | Autorizar Series | W3-14 | `npx vitest run src/views/uiautorizarseries test/cross` | dev: Usuario toolbar Autorizar Series | `views/uiautorizarseries`, series child |
| 16 | Padron + Proveedor | W3-15 | `npx vitest run mock-server/core test/catalogs` | dev: add padrón `01` over active `03` | `padron` rule, `proveedores.js` |
| 17 | Cliente | W3-16a/16b/17 | `npx vitest run test/catalogs src/views` | dev: Cliente with gated tabs | `clientes.js`, `aggregate.js` |
| 18 | Item | W3-18/19 | `npx vitest run test/catalogs src/views` | dev: Item with params on and off | `items.js` |
| 19 | Socio acciones | W3-20 | `npx vitest run mock-server src/views/uisocioacciones` | dev: activate a price | `core/socioAcciones.js`, `views/uisocioacciones` |

---

## Slice W3-0: inventory override map (branch `feat/softcommerce-w3-0-inventory-overrides`, base: `feat/softcommerce-w3`)

Capabilities: `wave-overrides.json`, `waveFor` override-first, abort on stale or invalid map, CSV regenerated. Specs: R-INV-7,8,9,10,11; S-INV-13,14,15,16,17,18,19,20,21. Forecast ~350 lines. Fallback in the table above.

- [x] 0.1 Preflight. `git status`; `git branch feat/softcommerce-w3 main` then `git switch -c feat/softcommerce-w3-0-inventory-overrides feat/softcommerce-w3`. Do NOT commit the untracked change folder. Never stash/reset/clean; stage explicit pathspecs; `git diff --cached --name-only` lists only the intended paths. Baseline: the full W1 + W2 gate green first (and the existing `scripts/inventory` specs).
- [x] 0.2 Override-first resolution and abort rules. RED: `scripts/inventory/inventory.spec.ts` new cases on a fixture tree: S-INV-13 (`CambiarEmpresa: shell` beats the heuristic `W3`; a `ventas` class mapped `W6` is `W6`), S-INV-14 (non-overridden unchanged, existing S-INV-8 wave tests untouched), S-INV-15 (`NoSuchClass` exits non-zero naming it, no CSV written), S-INV-16 (duplicate key; `W9`; `done` exit non-zero naming key and value). GREEN: `scripts/inventory/lib.mjs` (`waveFor` checks the map first; map validation), `scripts/inventory/inventory.mjs` (loads `wave-overrides.json`, aborts before writing).
- [x] 0.3 Real-tree dispositions. RED: a spec over the real `desktop_java/softcommerce-desktop` tree: S-INV-17 (`drop` set, `infra` set, five `shell`), S-INV-18 (6 delivered catalog panels `W2`, 9 sales/delivery `W4`, 9 purchasing/inventory `W5`, 3 contabilidad `W6`, 6 libro `W7`), S-INV-19 (rows with wave `W3` are exactly the 23 classes of R-INV-10, none overridden). GREEN: `scripts/inventory/wave-overrides.json` (51 classes, values `W1`..`W7`, `shell`, `infra`, `drop`), regenerated `scripts/inventory/inventory.csv`. Read R-INV-9/10 for the exact class lists; confirm each class name with `fd` before adding it.
- [x] 0.4 Determinism and read-only. RED: S-INV-20 (two runs byte-identical, header `class, path, package, base, category, wave`, rows sorted), S-INV-21 (Java tree unmodified, map file not rewritten). GREEN: only if 0.2 or 0.3 broke ordering. MUTATION: delete one map entry; the S-INV-19/18 count spec must fail, then restore.
- [x] 0.5 Gate (see per-slice gate), record the line count. Push and PR are done by the orchestrator.

Commits: (1) `feat(inventory): add wave override resolution and map validation` 0.2; (2) `feat(inventory): add the wave override map and regenerate the csv` 0.3-0.5.

## Slice W3-1: search, lookup kind, pickers, stubs (branch `feat/softcommerce-w3-1-search-lookup-core`, base: W3-0)

Capabilities: `q` search, joined-key filters, `lookup` kind with derived display join, `pickers.js`, the four read-only stubs. Specs: R-MOCK-20,25; R-REG-13(lookup),16,20(lookup,search); R-CRUD-19(server); S-MOCK-45,46,53; S-REG-23; S-CRUD-49(server write half); S-LKP-15(server). Forecast ~650 lines. Fallback in the table above.

- [x] 1.1 Search core. RED: `mock-server/core/search.spec.ts` with a test-only entry: S-MOCK-45 (`q=perez juan` matches `JUAN PEREZ LOPEZ` only; blank `q` returns all active; `%` and `.*` match literally and return nothing; inactive never returns; `q` on an entry with no `search` returns an empty list), S-MOCK-46 (`marca=toy` over a joined display key with `page=2&pageSize=10` over 25 rows; `placa=ab&q=lima` combines with AND; unknown key 400 `INVALID_FILTER`). GREEN: `mock-server/core/search.js`, `core/catalog.js` (`q` out of the query, whitespace split, contains per term), `registry/schema.js` (`search` attribute, R-REG-16).
- [x] 1.2 `lookup` kind and derived join. RED: `mock-server/registry/schema.lookup.spec.ts` (S-REG-23: source not registered, missing `search`; `kind:'lookup'` validated as a ref like `select`, R-REG-6), `mock-server/core/lookupDisplay.spec.ts` (S-CRUD-49 server half: a stored lookup restores the description from the derived join on get/list; a write of an inactive or unknown id answers 422 on the field). GREEN: `registry/schema.js` (kind, derived join `{as: display, ref: name, display: target optionLabel}`, D3), `core/validators.js`, `core/lookups.js`. Read `softcommerce-crud-templates` R-CRUD-19 for the exact wire shape.
- [x] 1.3 `pickers.js`. RED: `mock-server/registry/pickers.spec.ts`: the seven configs exist (buscarTrabajador, panelCargarTrabajador, buscarCliente, formClienteBuscar, formBuscarVehiculo, buscarParametroProv, buscarItemConversion) with `{title, source, columns, filters, pickLabel, extras?, refresh?}`; a field naming `picker:` expands to `search`, `columns`, `filters` at load; an unknown picker fails at load naming the field; a lookup with no desktop dialog declares the three inline. GREEN: `mock-server/registry/pickers.js`, `registry/schema.js`. Read the matching desktop dialogs (`FormBuscarTrabajador`, `PanelCargarTrabajador`, `FormClienteBuscar`, `FormBuscarVehiculo`, BuscarItemConversion, BuscarParametroProv) METHOD BODIES at apply time for titles, filter labels and column order. Pickers whose source entry arrives later (clientes, vehiculos, items) are registered with their source name and validated lazily by the consistency spec once the entry exists (note it in the PR).
- [x] 1.4 The four stubs. RED: cases for `cuentas-contables`, `parametros-prov`, `clases-sunat`, `padrones` (S-MOCK-53: GET list and by id return the seed; `clases-sunat?codigo_subfamilia_sunat=` filters exactly; POST answers 405 `METHOD_NOT_ALLOWED`). GREEN (MT without a Register file; shapes are [INFERRED] in R-MOCK-25): four entries in `registry/catalogs/`, seeds in `data/catalogs/`, `registry/index.js`. MUTATION: drop `readOnly` on one; the 405 case must fail.
- [x] 1.5 Parity and gate. Run 1.1 to 1.4 cases against `mock` and `http` (S-MOCK-35); W1/W2 suites unchanged; per-slice gate.

Commits: (1) `feat(softcommerce-mock): add q search over declared search fields` 1.1; (2) `feat(softcommerce-mock): add lookup kind with derived display join` 1.2; (3) `feat(softcommerce-mock): add named picker configs` 1.3; (4) `feat(softcommerce-mock): add read-only stubs for W6 data` 1.4-1.5.

## Slice W3-2: LookupField, LookupDialog, useLookup (branch `feat/softcommerce-w3-2-lookup-ui`, base: W3-1)

Capabilities: lookup dialog UI, typed code, `useLookup`, harness host. Specs: R-LKP-1..7; R-CRUD-18(lookup UI); S-LKP-1..15; S-CRUD-47,48,49(UI). Forecast ~780 lines (flagged). Fallback in the table above.

- [x] 2.1 LookupDialog. RED: `src/shared/ui/LookupDialog/LookupDialog.spec.tsx` with fake services: S-LKP-1 (three rows load, none picked, pick hands the full row and closes), S-LKP-2 (Esc, `Cancelar`, close box leave the host value and run no callback), S-LKP-3 (filter, first row selected, clearing restores), S-LKP-5 (stale response ignored, latest token), S-LKP-6 (25 rows, page size 10, page 3 shows 5, a filter change goes to page 1), S-LKP-7 (pick disabled without selection), S-LKP-8 (double-click and Enter pick once; Enter moves filter to filter then first row, R-LKP-4), S-LKP-12 (loading, empty, error with retry, Refrescar clears filters), S-LKP-15 (inactive never listed). GREEN: `src/shared/ui/LookupDialog/{InterLookupDialog,LookupDialogImpl,LookupDialogView,index}` over jona-ui `JDialog`, `CrudGrid`, `JPagination` on `dialogStack`, `dependentChain` latest-token. Callbacks value-first, DEFAULTS without state values, mobile classes as in W2.
- [x] 2.2 LookupField and typed code. RED: `src/shared/ui/LookupField/LookupField.spec.tsx`: S-LKP-10 (`42` + blur resolves `0000000042`, no dialog; `99` opens the dialog; inactive `0000000043` opens the dialog; an 8-character code is kept as typed, shorter than 10 and not 8 is left-padded when target `codeWidth` is 10, R-LKP-6), S-LKP-11 (Backspace-clear clears the description too), S-CRUD-47 (search button opens, pick shows code + read-only description, payload carries the id, cancel leaves the field), S-CRUD-48 (required blank blocks submit with the configured message; clearing clears a dependent select), S-CRUD-49 UI half (UPDATE restores from the joined display, DETAIL/DELETE show without search and clear, CLONE copies). GREEN: `src/shared/ui/LookupField/*`, `src/domain/crud/codec.ts` (lookup kind), `src/catalogs/registry.ts` (adapter for `lookup` plus picker attributes), `src/catalogs/CatalogConfig.ts`.
- [x] 2.3 `useLookup`, filters, veto, preset. RED: S-LKP-4 (Familia + Marca combine; SubFamilia disabled and empty until a Familia is chosen and cleared on Familia change), S-LKP-9 (host `veto` keeps the dialog open, shows `Cliente ya Esta Agregado`, host unchanged), S-LKP-13 (BuscarItemConversion inputs open at `0.0`, `0.0`, `1.0`; clearing origen shows `1.0`, clearing conversion shows `0.0`), S-LKP-14 (preset RUC filter shown, only that transportista's vehiculos load). GREEN: `src/shared/ui/LookupDialog` (extras, refresh), `useLookup().open(picker, {preset, veto})`, `src/services/InterCatalogService.ts` and `CatalogServiceHttp.ts` (list with `q`, filters, `page`), `AppServicesMock.ts`. Read the BuscarItemConversion and FormBuscarVehiculo method bodies for defaults and RUC preset behavior.
- [x] 2.4 Harness host. RED: a test-only harness component that opens each of the seven pickers and asserts title, filter labels and column order against `pickers.js` (the four consumer-less pickers are proven here). GREEN: `src/shared/ui/LookupDialog/lookupHarness.tsx` (test support, not shipped in the app bundle).
- [x] 2.5 Gate (see per-slice gate); W1/W2 suites unchanged.

Commits: (1) `feat(softcommerce): add LookupDialog with paging, keyboard and stale guard` 2.1; (2) `feat(softcommerce): add LookupField with typed code resolution` 2.2; (3) `feat(softcommerce): add useLookup with veto and preset and a picker harness` 2.3-2.5.

## Slice W3-3: BuscarTrabajador in TrabajadorPuntoVenta (branch `feat/softcommerce-w3-3-trabajador-lookup`, base: W3-2)

Capabilities: first real consumer of the lookup; the documented W2-test exception. Specs: R-LKP-8; R-MST-17,18(helper exception); S-LKP-1(consumer),16; S-REF-42; S-REF-21,17(unchanged meaning); S-MST-36(parity baseline). Forecast ~400 lines.

- [x] 3.1 Parity first. Run the W2 `usuario-correlativos` and `trabajador-punto-venta` suites on the current branch as the green baseline and record them in the PR (D20). RED: add `test/catalogs/trabajadorPuntoVenta.lookup.spec.ts` with the S-REF-21 and S-REF-17 assertions expressed through the lookup driver; it fails because the field is still a select.
- [x] 3.2 Swap to a lookup. GREEN: `mock-server/registry/catalogs/trabajador-punto-venta.js` (`id_trabajador` becomes `kind:'lookup'`, `picker:'buscarTrabajador'`, message kept: `Para agregar un Trabajador, debes especificar su Nombre.`), `mock-server/registry/catalogs/trabajadores.js` (declares `search`, `columns`, `filters` through the picker; stays read-only, slug, `idKey`, `optionLabel` and row keys unchanged, D20). S-REF-42: blank shows the W2 message; duplicate (trabajador, punto de venta) still 409 on `id_trabajador` with the W2 literal; S-LKP-1 consumer: the dialog lists only active trabajadores.
- [x] 3.3 Amend the W2 UI spec helpers (the ONE documented W2-test exception). Edit only the field-interaction helpers at `src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx` lines 44 to 105 (select driver -> lookup driver: type code + blur, or open dialog and pick). Every assertion and expected message stays byte-identical (S-LKP-16, S-MST-36). The PR body lists the changed helper lines and states that no assertion changed. `usuario-correlativos` keeps its select, its suite is untouched.
- [x] 3.4 Gate. `GET /v1/lookups/trabajadores` still returns `{ items: [{ id, name }] }` of active rows (S-LKP-16). Per-slice gate.

Commits: (1) `test(softcommerce): add lookup parity baseline for trabajador-punto-venta` 3.1; (2) `feat(softcommerce): use BuscarTrabajador lookup in trabajador-punto-venta` 3.2-3.4.

## Slice W3-4a: children core (branch `feat/softcommerce-w3-4a-children-core`, base: W3-3)

Capabilities: `children` expansion, seeds, nested routes, composite ops. Specs: R-REG-14,20(child rules); R-MOCK-19; S-REG-20,21,22; S-MOCK-39,40,42,57. Forecast ~780 lines (flagged). Fallback in the table above.

- [x] 4a.1 Child expansion and load validation. RED: `mock-server/registry/schema.children.spec.ts`: S-REG-22 (child `unique` naming a missing field, a child named `actions`, two children with the same name; also `refs`, `joins`, `columns`, `validation` naming unknown fields; bad `removal`/`entry`; collision with `id`, `estado`, `op`), D5 (each child expands to an internal entry with slug `parent/name` unreachable by single-segment routes; inherits scope, stamp, formId, flags). GREEN: `mock-server/registry/schema.js`, `registry/index.js`.
- [x] 4a.2 Child seeds and sections. RED: `mock-server/http/loadSeed.children.spec.ts`, `src/services/mock/seed.children.spec.ts`: child seeds inside parent seed rows are split into the child section at snapshot; the nested list equals those rows. GREEN: `mock-server/http/loadSeed.js`, `src/services/mock/seed.ts`, `core/store.js`.
- [x] 4a.3 Nested routes. RED: `mock-server/http/children.spec.ts` with a test-only parent and children: S-MOCK-39 (list includes the deactivated, excludes the logically deleted, get resolves a deactivated one), S-MOCK-40 (nested POST 201 and listed; unknown parent, unknown child name, deleted parent, other-tenant parent, other-empresa parent -> 404 with the error shape; `actions` reserved). GREEN: `mock-server/http/app.js`, `core/children.js` (read side), `AppServicesMock.ts`, `src/services/CatalogServiceHttp.ts` (`listChild`, `createChild`, ...).
- [x] 4a.4 Composite write. RED: `mock-server/core/children.composite.spec.ts`: S-MOCK-42 (valid parent + second child invalid -> 422 `direcciones[1].direccion`, parent absent, no child exists; all valid -> 201 and every child persists), S-MOCK-57 (`<n>` is the index in the SENT op array: with one prior stored row and two sent ops, the failing second sent op is `[1]`), ops `I`/`A`/`E` on changed rows only, fail-first order (parent, then child order, then list order), then named rules hook (empty), then write (D6). CLONE sends no child ops (R-MOCK-19). GREEN: `core/children.js` (validate all, then write atomically), `core/catalog.js` (body `children`).
- [x] 4a.5 Dual-source parity. RED: add the 4a cases to the `catalogServiceContract` loader for `mock` and `http` (S-MOCK-35). GREEN: any divergence in `AppServicesMock.ts`. S-REG-21 child consistency spec: UI config vs HTTP mock vs in-browser mock for a test child (fails naming parent, child, field; MUTATION: change a child `max` in one source).
- [x] 4a.6 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce-mock): add child entry expansion with load validation` 4a.1-4a.2; (2) `feat(softcommerce-mock): add nested child routes` 4a.3; (3) `feat(softcommerce-mock): add atomic composite write with indexed details` 4a.4-4a.6.

## Slice W3-4b: removal kinds, unique, cascade, store children, gates (branch `feat/softcommerce-w3-4b-children-rules`, base: W3-4a)

Specs: R-MOCK-19,21,24(params keys); R-REG-14(store),17,20(gate); R-MD-4,6,7; S-MOCK-41,43,44,52; S-REG-24(gate),25,30; S-MD-9(server),10(server). Forecast ~600 lines. Fallback in the table above.

- [x] 4b.1 Removal kinds. RED: `mock-server/core/children.removal.spec.ts`: S-MOCK-41 (`deactivate` keeps the row listed with `estado` `D`; `delete` removes it from the list; a deactivated row is reactivated only by an action, never by body `estado`, R-MOCK-21). GREEN: `core/children.js`, `http/app.js`.
- [x] 4b.2 Unique among active siblings. RED: `mock-server/core/unique.spec.ts` (pure `core/unique.js`) and `children.unique.spec.ts`: S-MOCK-43 (active pair -> 409 `DUPLICATE` with `Almacen ya se Encuentra Activado`; deactivated first row -> 201; PUT keeping its own values -> 200), S-MD-9 server half, composite field `<child>[<n>].<field>`. GREEN: `core/unique.js` (shared by the client), `core/children.js`.
- [x] 4b.3 Cascade. RED: S-MOCK-44 and S-MD-10 server half (logical parent delete deletes every child row, deactivated included; nested routes then 404; delete is not blocked by children). GREEN: `core/children.js` cascade.
- [x] 4b.4 `store` children. RED: S-REG-30 (no seed of its own; nested list equals the owning entry's rows filtered by the key; a write via either route is visible in the other; cascade marks the shared section rows; seeds stay with the owner). GREEN: `core/children.js` (store-backed view), `registry/schema.js` (`store: {entry, key}`), `core/store.js`.
- [x] 4b.5 Gates and params keys. RED: S-REG-24 gate half (`gate.param` not a params key throws; `PORC_IGV` rejected as `gate.param`, D25), S-REG-25 server half (gated-off child: nested POST 404, body value ignored; gate on: works), S-MOCK-52 (`GET /v1/params` for `demo` and `botica` with the R-MOCK-24 keys and seeded values; W1 keys unchanged). GREEN: `mock-server/data/params.json`, `core/catalog.js` (tenant params gate), `registry/schema.js`, `core/predicates.js` (`$params.X` value token, D27b).
- [x] 4b.6 Parity and gate. Cases on `mock` and `http`; per-slice gate.

Commits: (1) `feat(softcommerce-mock): add child removal kinds and active-sibling unique` 4b.1-4b.2; (2) `feat(softcommerce-mock): add cascade and store-backed children` 4b.3-4b.4; (3) `feat(softcommerce-mock): add company param gates and wave 3 params keys` 4b.5-4b.6.

## Slice W3-5a: UiMasterRegister, tabs mounted, ChildGrid (branch `feat/softcommerce-w3-5a-master-register`, base: W3-4b)

Specs: R-MD-1,2,3,5,8; R-REG-3(child UI); S-MD-1,2,3,4,5,11,13. Forecast ~790 lines (flagged). Fallback in the table above.

- [x] 5a.1 DraftCatalogService and child drafts. RED: `src/shared/DraftCatalogService.spec.ts` and `src/views/uimasterregister/useChildDraftsImpl.spec.ts`: S-MD-4 (confirm a valid contacto adds one pending row, closes the child dialog, sends NO request; cancelling the parent discards it), S-MD-5 (invalid child confirm keeps the child dialog open with its field error, parent unchanged). GREEN: `src/shared/DraftCatalogService.ts` (validates and returns the row only), `src/views/uimasterregister/useChildDraftsImpl.ts` (pending-op list per child), uses `core/unique.js` for pending plus persisted active rows.
- [x] 5a.2 UiMasterRegister with all tabs mounted. RED: `src/views/uimasterregister/UiMasterRegister.spec.tsx`: S-MD-2 (a pending direccion and entered General data survive `Direcciones` -> `General` -> `Direcciones`), S-MD-1 (blank `Nacionalidad` while `Direcciones` is active: submit switches to `General`, shows the error and focuses the field after the panel is visible; field-to-tab map from `layout`). GREEN: `src/views/uimasterregister/{UiMasterRegister,InterUiMasterRegister,UiMasterRegisterImpl,UiMasterRegisterView,index}.ts(x)`: jona-ui `JTabs`/`JTabsList`/`JTabsTrigger` only for triggers, each panel a `div role="tabpanel"` with `hidden` when inactive (D10; `JTabsContent` returns `null` for inactive panels, `web_ts/uijona/src/molecules/JTabs/JTabsView.tsx:126`); active tab lifted into the Impl; focus via an effect keyed on tab and field.
- [x] 5a.3 ChildGrid. RED: `src/shared/ui/ChildGrid/ChildGrid.spec.tsx`: S-MD-3 (a persisted Cliente's active and deactivated direcciones both show with their state icon; a logically deleted vehiculo never shows), toolbar from the child config. GREEN: `src/shared/ui/ChildGrid/*` over `CrudGrid`.
- [x] 5a.4 Register seam, dirty, read-only modes. RED: S-MD-13 (only a pending child row changed, Esc shows the discard confirmation, R-CRUD-8), S-MD-11 (DETAIL: child toolbars disabled, no `Agregar` opens). GREEN: `src/views/uicrudregister/useUiCrudRegisterImpl.ts` (`RegisterExtension` seam `{load, dirty, payload, firstError}`), `src/views/uicatalog` (picks `UiMasterRegister` when `config.children` exists), `src/catalogs/{CatalogConfig,registry}.ts` (children in config). W2 register specs stay untouched and green.
- [x] 5a.5 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add draft catalog service and child drafts` 5a.1; (2) `feat(softcommerce): add UiMasterRegister with mounted tabs and first-error tab` 5a.2; (3) `feat(softcommerce): add ChildGrid and the register extension seam` 5a.3-5a.5.

## Slice W3-5b: quitar kinds, inline entry, restore, CLONE (branch `feat/softcommerce-w3-5b-master-flows`, base: W3-5a)

Specs: R-MD-3,4,5,9,10; S-MD-6,7,8,12,14; S-REG-25(UI). Forecast ~700 lines. Fallback in the table above.

- [x] 5b.1 Quitar by kind. RED: S-MD-6 (pending row disappears; persisted `deactivate` row turns deactivated and stays; the same row again shows `Direccion ya Esta desactivada` and changes nothing; persisted `delete` row disappears and is sent as op `E` on save), S-MD-7 (`Seleccione Fila.` with no selection). GREEN: `useChildDraftsImpl.ts`, `ChildGrid`.
- [x] 5b.2 Inline entry. RED: component test with a test child `entry:'inline'`: the child fields render above the grid, Agregar validates them with the child messages and resets the entry (for example peso `0`). GREEN: `src/views/uimasterregister/*`, `ChildGrid`.
- [x] 5b.3 Detail mapping and all-or-nothing. RED: S-MD-8 (server rejects a pending padron: dialog stays open with pending rows and parent data kept, error shown on the row, switch to the tab named by the `<child>[<n>]` detail, parent absent from `GET`). GREEN: `src/domain/crud/serverErrors.ts` (child detail -> child and sent-index -> pending row), `UiMasterRegisterImpl.ts`.
- [x] 5b.4 Restore and CLONE. RED: S-MD-12 (CLONE of a Banco with three activation rows shows one initial `INICIO` and none of the originals; the server creates the initial activation), D11 (UPDATE/DETAIL/DELETE load parent and every gated-on child in parallel, active and deactivated). GREEN: `UiMasterRegisterImpl.ts` load, `core/children.js` (initial `INICIO` hook from the preset, stubbed with a test preset until W3-7). Read `RegisterBancoAnexo.java` lines 759 to 840 for the loadRegister modes; R-MD-9 overrides line 788 (CLONE drops children).
- [x] 5b.5 Param-gated tabs. RED: S-MD-14 (`IS_CLIENTE_SUSTITUTO` false -> no `Sustitutos` tab; true -> tab shows), S-REG-25 UI half (gated tab absent, not hidden, not validated). GREEN: `src/catalogs/registry.ts`, session params in `UiMasterRegisterImpl.ts`.
- [x] 5b.6 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add quitar kinds and inline child entry` 5b.1-5b.2; (2) `feat(softcommerce): map composite errors to child tabs and rows` 5b.3; (3) `feat(softcommerce): add master restore, clone and param-gated tabs` 5b.4-5b.6.

## Slice W3-6: row actions (branch `feat/softcommerce-w3-6-row-actions`, base: W3-5b)

Specs: R-ACT-1..6; R-REG-15,20(action flag); R-MOCK-22; S-ACT-1,2,3,4,5,6,7,8,9; S-REG-26; S-CRUD-4(unchanged). Forecast ~620 lines. Fallback in the table above.

- [x] 6.1 Action declaration and load validation. RED: `mock-server/registry/schema.actions.spec.ts`: S-REG-26 (`flag:'foo'` throws; `flag:'modify'` accepted and the button gated by the parent's `modify`), `enabledWhen` naming unknown fields throws, `immediate` without a server action throws, `actions` reserved name. GREEN: `registry/schema.js` (`{id, label, placement, flag, enabledWhen, dialog?, kind, confirm?, server?}`), flag defaults to `modify`, no Alt shortcuts.
- [x] 6.2 Endpoints. RED: `mock-server/core/actions.spec.ts` with a test rule: S-MOCK-47 form (200 with the updated row and derived parent state), unknown action 404, S-MOCK-48 form (409 `ACTION_NOT_ALLOWED` with the entry's message, data unchanged), S-MOCK-49 form (422 `fecha_fin`), the three route forms (row, nested row, collection form `POST /v1/{c}/{id}/{child}/actions/{a}`, R-MOCK-22). GREEN: `mock-server/core/actions.js`, `http/app.js`, `AppServicesMock.ts`, `CatalogServiceHttp.ts`. Real S-MOCK-47..49 assertions land with the anexo rule in W3-7; here the test-only rule proves the endpoint shapes.
- [x] 6.3 Deferred actions and gating in the UI. RED: S-ACT-1 (registry-driven toolbar, no catalog-specific code), S-ACT-2 (`modify=false` disables both and sends nothing; no selected row disables `Desactivar`), S-ACT-3 (non-UPDATE modes disable), S-ACT-4 (predicate), S-ACT-5 (deferred persists with the parent submit; cancelling discards), S-ACT-7 (derived `estado` read-only, follows a pending `Activar`). GREEN: `src/domain/crud/toolbarGate.ts`, `src/shared/ui/ChildGrid/*`, `src/views/uimasterregister/*` (pure client hook of a named rule).
- [x] 6.4 Immediate actions. RED: S-ACT-6 (action endpoint called once, grid reloads showing the row deactivated, server message shown), S-ACT-9 (409 keeps the dialog open with the message, grid unchanged). GREEN: `src/views/uimasterregister/*`, `CatalogServiceHttp.ts` `runAction`.
- [x] 6.5 Estado not writable. RED: S-ACT-8 (a direct `PUT` carrying `estado`: stored estado is derived, body value ignored; test rule). GREEN: `core/entryRules.js`.
- [x] 6.6 Parity and gate (see per-slice gate).

Commits: (1) `feat(softcommerce-mock): add row action declaration and endpoints` 6.1-6.2; (2) `feat(softcommerce): add deferred and immediate row actions` 6.3-6.6.

## Slice W3-7: anexo preset, activacion rule, Banco (branch `feat/softcommerce-w3-7-anexo-banco`, base: W3-6)

Capabilities: `presets.anexo`, `activacion` rule, Activar/Desactivar dialogs, Banco pilot. Specs: R-ANX-1,2,3,4,5,9; R-MST-1(banco),2,3,4(banco); R-REG-21(`docIdentidad` entity, `activacion`); S-ANX-1..7,14,16(code width); S-MST-3,4,1(banco); S-MD-12(Banco); S-MOCK-47,48,49(real). Forecast ~780 lines (flagged). Fallback in the table above.

- [x] 7.1 Read desktop facts (no code). Read `FormAnexoActivacion.java` lines 61 to 121 (one `fecha`: Fecha Inicio for Activar, Fecha Fin for Desactivar; `motivo` uppercase 100; titles `Activar`/`Desactivar {anexo}`; `Ingrese Motivo`) and `RegisterBancoAnexo.java` method bodies (`isRegisterValid`, `loadRegister`, save, scope/stamp, `codeWidth`, `Banco ya Esta Activado` style messages). Record them in the PR body; the `TIPO_ANEXO.banco` id is a seed placeholder marked `[INFERRED]` (D13, R-ANX-9).
- [x] 7.2 Preset and pure rule. RED: `mock-server/core/rules.activacion.spec.ts` (pure): `activacion` rule table: one active row, `fecha_fin >= f_inicio`, `INICIO` on create, legacy rows treated as active, `estado` derived from the last row; S-ANX-6 rule half (2026-03-09 rejected with `Fecha es menor a fecha inicial`, 2026-03-10 accepted). GREEN: `mock-server/registry/presets.js` (`presets.anexo({entity, tipoAnexo, padron?})`: child `activaciones` removal none with the R-ANX-1 columns, deferred Activar/Desactivar with guard messages, rule, `codeWidth` 10, `TIPO_ANEXO.banco` placeholder), `core/rules.js`.
- [x] 7.3 Server rule and the real action endpoints. RED: S-ANX-7 (a body adding a second active row -> 409 `Banco ya Esta Activado`, data unchanged), S-ANX-14 (`PUT` with `estado` false and no deactivation keeps estado active), S-MOCK-47/48/49 with the real rule, S-ANX-1 server half (`GET` of a new banco lists exactly the `INICIO` activation), `INICIO` on create and CLONE. GREEN: `core/entryRules.js`, `core/actions.js` (rule binding), `core/children.js`.
- [x] 7.4 Activar and Desactivar UI. RED: `src/views/uimasterregister/anexoActions.spec.tsx`: S-ANX-2 (active last row: `Trabajador ya Esta Activado`, no dialog; just-deactivated: `Trabajador recien lo acaba de Desactivar`), S-ANX-3 (`Activar Cliente` dialog, `Fecha Inicio` today, blank motivo `Ingrese Motivo`, `reingreso` -> pending row `REINGRESO`, `Estado` checked), S-ANX-4 (`Seleccione un Registro`, `Registro ya esta Desactivado`, `Cliente recien lo acaba de Activar`), S-ANX-5 (Desactivar with `CIERRE`: deactivated, fecha fin today, `Estado` unchecked; cancelling persists nothing), S-ANX-6 UI half. GREEN: `src/shared/ui/ActivationDialog/*` (or the dialog inside the action config), `src/views/uimasterregister/*`.
- [x] 7.5 Banco master (MT). Read `RegisterBancoAnexo.java` (see 7.1). RED: `test/catalogs/bancos.cases.ts`: S-ANX-1 (INSERT shows one `INICIO` row, today, active icon, `Activar`/`Desactivar` disabled, `Estado` checked), S-MST-3 (`Para agregar un Banco, debes Seleccionar un Tipo de Documento.`), S-MST-4 (stored `EXTRANJERA`/`CE` restored on UPDATE), S-MST-1 (banco modes as declared), S-MD-12 (CLONE of a Banco with three activations shows one `INICIO`), S-ANX-16 code width 10. GREEN: `registry/catalogs/bancos.js`, seed `data/catalogs/bancos.json` (with `INICIO` activations), `registry/index.js`, `data/menu.json`, `data/permissions.json`, `docIdentidad` params with `entity`. MUTATION: remove the `activacion` rule from the preset; S-ANX-7 must fail.
- [x] 7.6 Parity and gate (see per-slice gate); W2 `docIdentidad` suites unchanged.

Commits: (1) `feat(softcommerce-mock): add anexo preset and activacion rule` 7.1-7.3; (2) `feat(softcommerce): add Activar and Desactivar dialogs` 7.4; (3) `feat(softcommerce): add Banco master` 7.5-7.6.

## Slice W3-8: Chofer activation tab, Trabajador (branch `feat/softcommerce-w3-8-chofer-trabajador`, base: W3-7)

Specs: R-ANX-10; R-MST-1(trabajador),4,5,6,17; R-REF-11(modified),12; R-REG-18; S-REF-40,43(trabajadores half); S-ANX-15; S-MST-6,7,8,9,36; S-REG-28(trabajadores); S-LKP-16. Forecast ~760 lines. Fallback in the table above.

- [x] 8.1 Chofer activation tab. Read `RegisterChofer.java` method bodies (W2 entry stays; only the tab is added). RED: `test/catalogs/choferes.activacion.spec.ts`: S-REF-40 (UPDATE of a seeded chofer shows `Activación de Chofer` with the seeded `INICIO`; `Desactivar` with a motivo marks it deactivated and unchecks `Estado`; no DELETE in the toolbar; `DELETE` answers 405 `MODE_NOT_SUPPORTED`), S-ANX-15 (`Activar`/`Desactivar` follow R-ANX-3/4; W2 Chofer scenarios S-REF-25..29 pass UNCHANGED). GREEN: `registry/catalogs/choferes.js` (anexo preset child only), `data/catalogs/choferes.json` (seed rows gain `INICIO`, R-ANX-10).
- [x] 8.2 Trabajador master (MT). Read `RegisterTrabajador.java` method bodies (lines near 389 to 391 for the perfil, `isRegisterValid`, defaults, stamp, `codeWidth`). RED: `test/catalogs/trabajadores.cases.ts`: S-MST-6 (empty INSERT: `Seleccione Tipo Trabajador`, `Seleccione Trabajador Perfil`, `Ingrese Apellido Paterno`, `Ingrese Apellido Materno`, `Ingrese Nombres`, `Ingrese Dni`, then the invalid-date message, each as the previous is fixed), S-MST-7 (no tipo: perfil disabled and empty; a tipo loads only its perfiles over `tipos-trabajador-perfil`; changing the tipo clears the perfil), S-MST-9 (sexo `M`, fecha nac today, activation grid `INICIO`), S-ANX-2..5 for Trabajador wording. GREEN: `registry/catalogs/trabajadores.js` (writable, anexo preset, `TIPO_ANEXO.trabajador` placeholder `[INFERRED]`), seed rows gain the master fields and `INICIO`.
- [x] 8.3 Promotion and parity. RED: S-MST-8 (`nombre` is `ANA PEREZ LOPEZ`; `GET /v1/lookups/trabajadores` lists `{ id, name }` with it), S-REF-43 trabajadores half (POST creates 201 instead of 405; lookup keeps `{ items: [{ id, name }] }` of ACTIVE records), S-REG-28, S-MST-36, S-LKP-16 (W2 `usuario-correlativos` and `trabajador-punto-venta` suites pass with the same assertions; helpers amended only in W3-3). Run those W2 suites BEFORE the swap in the same PR (D20). GREEN: derived `nombre`, `register` of `trabajadores` in `index.js`, `data/menu.json` leaf `miTrabajador`.
- [x] 8.4 Parity and gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add chofer activation tab` 8.1; (2) `feat(softcommerce): add Trabajador master with perfil chain` 8.2-8.4.

## Slice W3-9: textarea, Vendedor (branch `feat/softcommerce-w3-9-textarea-vendedor`, base: W3-8)

Specs: R-REG-13(textarea, fill); R-CRUD-11(textarea); R-MST-1(vendedor),9; R-ANX-10; S-CRUD-46; S-MST-18,19; S-ANX-8; S-MOCK-44(vendedor); S-MD-10; S-LKP-7(PanelCargarTrabajador); S-ANX-1(vendedor). Forecast ~680 lines. Fallback in the table above.

- [x] 9.1 Textarea kind. RED: `src/shared/ui/TextAreaField/TextAreaField.spec.tsx`: S-CRUD-46 (Enter inserts a line break and does not submit; 501st character typed or pasted is ignored, S-CRUD-14; payload trimmed; `upper` uppercases typed and pasted text); core treats it as `text`. GREEN: `src/shared/ui/TextAreaField/*` (jona-ui `JTextArea`, 4 rows), `registry/schema.js`, `codec.ts`.
- [x] 9.2 Lookup `fill` and `fillReadOnly`. RED: `src/shared/ui/LookupField/fill.spec.tsx` and `mock-server/core/fill.spec.ts`: picking fills the six declared fields; `fillReadOnly` makes `Nombres`, `Dirección`, `Numero` read-only; server stores the copied values; in UPDATE the picker is disabled. GREEN: `registry/schema.js`, `LookupField`, `core/lookups.js`.
- [x] 9.3 Vendedor master (MT). Read `RegisterVendedor.java` and `PanelCargarTrabajador.java` method bodies (the Buscar button, `Debe elegir un trabajdor`, defaults, stamp, `codeWidth`). RED: `test/catalogs/vendedores.cases.ts`: S-MST-18 (`Buscar` + pick fills `Nombres`, `Dirección`, `Numero`, `Telefono Fijo`, `Telefono Movil`, `Codigo Trab.`; `Nombres` read-only; UPDATE picker disabled; no trabajador -> `Debe elegir un trabajdor`), S-LKP-7 (pick disabled without selection; the desktop exception does not occur), S-MST-19 (`Contado` checked, `Credito` unchecked, DNI, `PERUANA`; tipo combo lists every active persona tipo; stored tipo is the selected one; comentario stored), S-ANX-8 (dialogs `Activar Vendedor`/`Desactivar Vendedor`, blank motivo `Ingrese Motivo`), S-MOCK-44 / S-MD-10 (delete cascades the activations, nested route 404), R-MD-9 (Vendedor has no CLONE). GREEN: `registry/catalogs/vendedores.js`, seed, menu, permissions.
- [x] 9.4 Parity and gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add textarea kind` 9.1; (2) `feat(softcommerce): add lookup fill and the Vendedor master` 9.2-9.4.

## Slice W3-10: Transportista, shared Vehiculos, propietario (branch `feat/softcommerce-w3-10-transportista`, base: W3-9)

Specs: R-MST-1(transportista),2,3,10; R-REG-14(store); R-LKP-8(propietario inline); S-MST-1,2,3,10,11,12; S-ANX-16; S-REF-39,41; S-MD-3(vehiculo),6(vehiculo),11; S-REG-30; S-LKP-14(consumer). Forecast ~780 lines (flagged). Fallback in the table above.

- [x] 10.1 Transportista master (MT). Read `RegisterTransportista.java` method bodies (person block, `docIdentidad` wording, defaults, stamp, `codeWidth`). RED: `test/catalogs/transportistas.cases.ts`: S-MST-2 (INSERT: tipo `RUC`, nacionalidad `PERUANA`, sexo `M`; `20123456789` requires razón social and disables the names; `10123456789` requires the three names and composes the razón social; `30123456789` shows `EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2` and clears), S-MST-3 (`Para agregar un Transportista, debes Seleccionar un Tipo de Documento.`), S-MST-1 (add, modify, clone, details, no delete), S-ANX-16 (code 10-character zero-padded, tipo anexo `6`), anexo preset. GREEN: `registry/catalogs/transportistas.js`, seed with `INICIO`, menu, permissions.
- [x] 10.2 Vehiculos shared-store child. Read `RegisterVehiculo.java` (W2) and the Transportista vehicle entry method body. RED: S-MST-10 (blank -> `Ingrese Constancia`, then `Ingrese Placa`, `Ingrese Peso`, `Seleccione Marca`, `Seleccione Modelo`; a valid add shows one pending row and resets the entry, peso `0`), S-MST-11 (created in T's grid appears in the W2 `vehiculos` list with propietario T; created in W2 with propietario T appears in T's grid; no propietario appears in no grid), S-MD-3 (deleted vehiculo never shows), S-MD-6 vehiculo (persisted vehiculo disappears and is deleted on save), S-MD-11 (DETAIL disables both toolbars), S-REG-30. GREEN: `transportistas.js` child `vehiculos` `entry:'inline'`, `removal:'delete'`, `store:{entry:'vehiculos', key:'id_anexo_empresa_transportista'}`.
- [x] 10.3 Propietario lookup on W2 Vehiculo. RED: S-MST-12 (`Propietario` optional; `42` resolves `0000000042` when active; inactive or non-transportista id -> 422 on the field), S-REF-41 (save without propietario succeeds; with transportista T the list shows `Propietario` T and the vehiculo appears in T's grid), S-REF-39 (excluded UI still absent). GREEN: `registry/catalogs/vehiculos.js` (inline lookup config over `transportistas`: Código and R. Social filters, columns code, razón social, RUC; W2 vehiculos suites stay green), seed rows gain `id_anexo_empresa_transportista` where meaningful.
- [x] 10.4 FormBuscarVehiculo harness. RED: S-LKP-14 (preset RUC `20123456789` shows in the `RUC/DNI` filter and only that transportista's vehiculos load). GREEN: harness registration of `formBuscarVehiculo` over `vehiculos` (no production consumer until W4).
- [x] 10.5 Parity and gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add Transportista master` 10.1; (2) `feat(softcommerce): add shared vehiculos child and propietario lookup` 10.2-10.5.

## Slice W3-11a: password kind (branch `feat/softcommerce-w3-11a-password-kind`, base: W3-10; pre-marked split of W3-11)

Specs: R-CRUD-17; R-REG-13(password),20(password); R-MOCK-23(rules); S-CRUD-42,43,44,45; S-REG-24(password half); S-MOCK-51(core). Forecast ~390 lines. Fallback: none needed.

- [x] 11a.1 `password` kind and `core/password.js`. RED: `mock-server/core/password.spec.ts` (pure sync SHA-256 salted with `id_usuario`; known vectors; no plaintext in the stored shape), `mock-server/core/validators.password.spec.ts` with a test-only entry: presence on create (422 `clave`), max 20 (422 `clave`), equality (422 `clave_confirmacion`), blank keeps the stored value on update, `confirm` defaults to true, S-REG-24 password half (`password` without `max` throws at load). GREEN: `core/password.js`, `core/validators.js`, `registry/schema.js`. Seed plaintext is hashed at snapshot (D16); `users.json` is NOT edited.
- [x] 11a.2 PasswordField. RED: `src/shared/ui/PasswordField/PasswordField.spec.tsx`: S-CRUD-42 (masked; show control reveals and keeps the value; 21st character ignored; 10-character paste over 10 selected characters of a 20-character value accepted, a 15-character one ignored whole, S-CRUD-14), S-CRUD-43 (`abc`/`abd` blocks submit with no request, the confirmation shows the configured error and is focused; equal values send both strings; direct API mismatch 422 on `<name>_confirmacion`), S-CRUD-44 (UPDATE both inputs empty, a blank pair sends neither key; DETAIL/DELETE not rendered; CLONE empty and required), S-CRUD-45 (a 422 message and details never contain the value). GREEN: `src/shared/ui/PasswordField/*`, `codec.ts`, `UiCrudRegisterImpl.ts`.
- [x] 11a.3 Gate (see per-slice gate); S-MOCK-51 stays pending until 11b (note in the PR).

Commits: (1) `feat(softcommerce-mock): add password kind with salted sha-256 hash` 11a.1; (2) `feat(softcommerce): add PasswordField with confirmation` 11a.2-11a.3.

## Slice W3-11b: Usuario master (branch `feat/softcommerce-w3-11b-usuario`, base: W3-11a; pre-marked split of W3-11)

Specs: R-MST-1(usuario),7,8; R-REG-18; R-AUTH-10,12,13; R-MOCK-15(modified),23; S-MST-13..17; S-MOCK-38,50,51,55; S-AUTH-23,24,25,27,28,29; S-REF-43(usuarios); S-REG-28; S-MST-36. Forecast ~390 lines.

- [x] 11b.1 Users backing. Read `RegisterUsuario.java` method bodies (lines 54 to 58, `isRegisterValid`, flags, stamp). RED: `mock-server/core/backings.spec.ts`: rows stay in `store.shared.users` filtered by tenant, create gets the next integer id and the session tenant, every read and error omits `clave`, `clave_hash`, `clave_confirmacion`, `tenants`; `nombre` derived from the trabajador (S-MOCK-55 `id_trabajador` unknown or inactive -> 422; duplicate `usuario` -> 409 on `usuario`; valid -> 201 and the lookup lists `{ id, name }` with the derived nombre). GREEN: `mock-server/registry/backings.js` (closed set, replaces `project:'users'`), `core/store.js`, `core/catalog.js`, `registry/schema.js`.
- [x] 11b.2 Usuario master (MT). RED: `test/catalogs/usuarios.cases.ts`: S-MST-13 (empty INSERT: `Para agregar un usuario, debes especificar un Trajador.`, `... su nombre.`, `... su clave.`; `modificar` on UPDATE), S-MST-14 (`Escritorio`, `Web`, `Contable`, `Habilitado` unchecked on INSERT; `flaghabilitado` `A` when ticked, `D` otherwise; `flagEscritorio`/`flagWeb`/`flagContable` `S`/`N`), S-MST-15 (password rules through the PasswordField), S-MST-16 (second usuario with the same name -> 409 on `usuario` with `El nombre de usuario ya existe.`), S-MOCK-51 real, S-MOCK-38 (`usuarios` per tenant, writable, no password key). GREEN: `registry/catalogs/usuarios.js` (backing `users`, `trabajador` lookup `buscarTrabajador`), menu leaf `mi_usuario`, permissions. No `Nuevo Trabajador` button (S-REF-39).
- [x] 11b.3 Login over the hash. RED: S-AUTH-23 (created user logs in with `secreto1`; wrong password -> generic invalid-credentials; defaults both unticked -> R-AUTH-4 "user disabled"), S-AUTH-25 (unticking `Habilitado` -> next login shows "user disabled", no session; `Habilitado` on and `Escritorio` off -> "no desktop access"; an open session keeps working), S-AUTH-27 (`admin` and `cajero` unchanged), S-AUTH-28 (logically deleted user -> invalid credentials, absent from the list), S-AUTH-29 (old password rejected, new accepted). GREEN: `core/auth.js` (one compare path over `clave_hash`), `AppServicesMock.ts`.
- [x] 11b.4 No-leak contract. RED: S-MOCK-50 and S-MST-17 and S-AUTH-24: a security spec walks every `usuarios` route plus `/v1/lookups/usuarios` and `/auth/login` on both transports and every 4xx body (including a 422 for `clave`); no `clave`, `clave_confirmacion` or `password` key anywhere; no session object or storage entry holds it; the login field is empty after submit. GREEN: sanitizers in `core/catalog.js`, `core/errors.js`.
- [x] 11b.5 Promotion parity. RED: S-REF-43 usuarios half (POST 201 instead of 405; lookups keep `{ items: [{ id, name }] }` of ACTIVE records), S-REG-28, S-MST-36 (W2 `usuario-correlativos` and `trabajador-punto-venta` suites pass with the same assertions), S-MOCK-35 parity. Run the W2 parity suites BEFORE the swap in the same PR. GREEN: `registry/index.js`, W2 amended R-MOCK-15/R-REF-11 assertions per S-REG-29.
- [x] 11b.6 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce-mock): add users backing replacing the users projection` 11b.1; (2) `feat(softcommerce): add Usuario master` 11b.2; (3) `feat(softcommerce-mock): log in over the hashed password with no leak` 11b.3-11b.6.

## Slice W3-12: grants overlay, perfil routes, login snapshot (branch `feat/softcommerce-w3-12-grants`, base: W3-11b)

Specs: R-PRM-5,8; R-AUTH-11,12; R-MOCK-1(modified); S-PRM-8,9,16; S-MOCK-58; S-AUTH-26,27,30,31,16. Forecast ~600 lines. Fallback in the table above.

- [x] 12.1 Overlay and perfil routes. Read `FormMenuPerfilArbol.java` lines 93 and 218 to 221 and 298 to 305 (menu load per perfil) and `DAOUsuario.java` lines 669 and 758 (per-user, per-form read), `Main.java` line 2780. RED: `mock-server/core/grants.spec.ts`: effective grants are the seed defaults (`menu.json`, `permissions.json`, unchanged) overlaid with `perfil-overrides` (`{id_tipo_perfil, kind:'menu'|'form', key, flag?, value}`) of the perfil reached through user -> `id_trabajador` -> `id_tipo_perfil`; no user, no trabajador or no overrides gives the defaults and W1 is byte-identical; S-PRM-8 (`GET .../permisos/miAduana` returns the `permissions.json` flags); S-PRM-9 (unknown perfil 404, unknown menu node or flag 422 with a detail, no tenant header 400); `GET|PUT /v1/tipos-trabajador-perfil/{id}/menu`, `.../permisos`, `.../permisos/{formId}`; `menu` and `permisos` reserved child names (R-REG-20). GREEN: `mock-server/core/grants.js`, `core/store.js` (`perfil-overrides` tenant section), `http/app.js`, `AppServicesMock.ts` (ahead of the generic routes), `registry/schema.js` (reserved names).
- [x] 12.2 Resolution by `X-User-Id` and batch route. RED: S-AUTH-30 (`GET /forms/miAduana/permissions` with `X-User-Id` of a user of perfil P returns P's flags; without the header the seeded defaults; W1 requests without the header unchanged), S-MOCK-58 (`GET /forms/permissions` returns `{[formId]: flags}` for that user's perfil; without the header the defaults), S-AUTH-27. GREEN: `core/auth.js` (`getMenu`/`getPermissions(store, x, ctx?)`), `http/app.js`.
- [x] 12.3 Login snapshot. RED: `src/session/grantSnapshot.spec.ts` and `src/services/shellServiceContract.snapshot.ts`: S-AUTH-16 (session holds tenant, user, empresa, punto de venta, period, params and grants; for a seeded user the defaults), S-AUTH-26 and S-PRM-16 (an open session keeps `Aduanas` and Delete on Colores after the perfil is edited; a new login omits `Aduanas` and disables Delete), S-AUTH-31 (a form never opened in the session still uses the snapshot). GREEN: `src/services/{InterShellService,ShellServiceHttp}.ts` (`ShellService.permissions(formId)` reads the snapshot), `src/session/*`, `src/services/mock/AppServicesMock.ts`. The four W2 menu-pinned assertions and `formRegistry.spec.ts` stay unchanged.
- [x] 12.4 Gate (see per-slice gate); W1/W2 byte-identical for seeded users (S-AUTH-27).

Commits: (1) `feat(softcommerce-mock): add perfil grants overlay and permission routes` 12.1-12.2; (2) `feat(softcommerce): take a grants snapshot at login` 12.3-12.4.

## Slice W3-13: Seguridad Perfil screen (branch `feat/softcommerce-w3-13-seguridad-perfil`, base: W3-12)

Specs: R-PRM-1,2,3,4,5,8; R-REG-19(custom screens); S-PRM-1..7; S-REG-27. Forecast ~780 lines (flagged). Fallback in the table above.

- [x] 13.1 Perfil list and filters. Read `FormMenuPerfilArbol.java` method bodies (filters, `Seleccione Fila`, titles). RED: `src/views/uiseguridadperfil/perfilList.spec.tsx`: S-PRM-1 (`ven` in `Desc.` leaves `VENDEDOR` and selects it; `T Trabajador` = CAJA as well leaves none), S-PRM-2 (`Perfil` with no selection shows `Seleccione Fila` titled `Perfiles`, tree stays empty, `Guardar`/`Permisos` disabled). GREEN: `src/views/uiseguridadperfil/{UiSeguridadPerfil,InterUiSeguridadPerfil,UiSeguridadPerfilImpl,UiSeguridadPerfilView,index}.ts(x)` (a JONA unit per panel), registered by hand in `src/views/uishell/formRegistry.ts` as `mi_SeguridadPerfil` (D24).
- [x] 13.2 Menu tree, no propagation. RED: S-PRM-3 (unchecking a parent keeps its children checked), S-PRM-4 (two toggled nodes -> `PUT .../menu` carries exactly those two; `Permisos actualizados correctamente`; a server rejection shows its message and keeps the edits). GREEN: tree built with `domain/menuTree`, `src/services/CatalogServiceHttp.ts` (perfil menu client), mock wiring.
- [x] 13.3 Per-node Permisos dialog. RED: S-PRM-5 (`Seleccione Opcion`; unchecked node `No tiene Permisos para acceder a Opcion`; node with no form `Opcion no tiene Asociado un formulario`; none opens the dialog), S-PRM-6 (dialog `Perfil VENDEDOR`, header `OPCION: ADUANAS`, 13 flags with the perfil's values; unchecking `eliminate` and `Guardar` sends `{ formId: 'miAduana', flag: 'eliminate', value: false }` only). GREEN: the dialog in the same unit, `PUT .../permisos/{formId}`.
- [x] 13.4 Perfil x form matrix. RED: S-PRM-7 (no perfil row -> `Seleccione Fila`; a perfil lists every form with its 13 flags and saves only changed cells). GREEN: matrix panel, `PUT .../permisos` with changed cells.
- [x] 13.5 Mobile and registration. RED: a mobile layout test (`JAccordion` rows, `min-h-11 sm:min-h-9`), S-REG-27 (`mi_SeguridadPerfil` missing in `permissions.json` fails the consistency test naming the `formId`; custom-screen list in the consistency spec). GREEN: `data/menu.json` node, `data/permissions.json` grant, the custom-screen list, mobile accordion.
- [x] 13.6 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add Seguridad Perfil list and menu tree` 13.1-13.2; (2) `feat(softcommerce): add Seguridad Perfil permissions dialog and matrix` 13.3-13.4; (3) `feat(softcommerce): register Seguridad Perfil with mobile layout` 13.5-13.6.

## Slice W3-14: Autorizar Series (branch `feat/softcommerce-w3-14-autorizar-series`, base: W3-13)

Specs: R-PRM-6,7; R-REG-14(store); R-MD-10; R-MOCK-22(collection form); S-PRM-10..15; S-MOCK-56; S-ACT-6,9; S-REG-30(series). Forecast ~700 lines. Fallback in the table above.

- [x] 14.1 Store changes and Series child. Read the Autorizar Series panel (`uiautorizarseries` desktop panel; locate with `fd`) method bodies. RED: `mock-server/registry/usuarioCorrelativos.series.spec.ts`: `usuarios.children.series` uses `store: {entry:'usuario-correlativos', key:'id_usuario'}` with no register tab (R-MD-10 as corrected); the W2 entry gains stored-only server-managed `fecha_inicio`/`fecha_fin` and keeps `habilitar` as the estado; W2 `usuario-correlativos` suites unchanged. GREEN: `registry/catalogs/usuario-correlativos.js`, `registry/catalogs/usuarios.js`, seed rows.
- [x] 14.2 `activate` and `deactivate`. RED: S-MOCK-56 (collection form creates the row, derives `id_localidad` from the punto de venta; a duplicate active pair -> 409 `ACTION_NOT_ALLOWED`/`DUPLICATE` with the W2 literal), S-PRM-12 (one active authorization with today's `fecha_inicio`, server message), S-PRM-13 (deactivate: row turns deactivated with fecha fin today), S-PRM-15 (the exact W2 unique message; a deactivated pair re-activates). GREEN: `core/actions.js`, `registry/catalogs/usuarios.js` (immediate actions, `kind:'immediate'`).
- [x] 14.3 The panel. RED: `src/views/uiautorizarseries/UiAutorizarSeries.spec.tsx`: S-PRM-10 (no selected usuario: `Seleccione un registro de la tabla`, title `Aviso`, no panel), S-PRM-11 (punto de venta change clears serie and id and reloads; `No existe serie para esa combinacion`; `Id Correlativo` read-only), S-PRM-12/13 UI, S-ACT-6 (action called once, grid reloads, message shown), S-ACT-9 (409 keeps the dialog open, grid unchanged). GREEN: `src/views/uiautorizarseries/*` (toolbar panel of the Usuario list, D14), `src/views/uicatalog` toolbar hook.
- [x] 14.4 Cross-UI spec. RED: `test/cross/seriesCorrelativo.spec.tsx`: S-PRM-14 (authorization created in Autorizar Series appears in the W2 `usuario-correlativos` list with `habilitar` true; set `habilitar` false in W2 and the Autorizar grid shows it deactivated; logical delete in W2 removes it from the Autorizar grid). GREEN: only if the shared store diverges.
- [x] 14.5 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce-mock): add series child over usuario-correlativos` 14.1-14.2; (2) `feat(softcommerce): add Autorizar Series panel` 14.3-14.5.

## Slice W3-15: padron rule, Proveedor (branch `feat/softcommerce-w3-15-padron-proveedor`, base: W3-14)

Specs: R-ANX-6,7,8,9; R-MST-1(proveedor),2,3,13; R-REG-21(`padron`); S-ANX-9..13; S-MST-1,3,5,26. Forecast ~760 lines. Fallback in the table above.

- [x] 15.1 `padron` rule. Read `FormAnexoPadron.java` lines 67 to 157 (`Seleccione Padron`, `Padron ya se Encuentra Activado`, the two incompatibility texts). RED: `mock-server/core/rules.padron.spec.ts` (pure, plus server): S-ANX-9 (`02` active, add `02` -> `Padron ya se Encuentra Activado`; add `01` -> `Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion`; only `03` active and `01` added -> same message (the `03` case the desktop missed); `01` active and `02` added -> `Configuracion incompatible, Desactive Exceptuado`), S-ANX-13 (a deactivated `02` re-activated adds a new active row, old row stays as history), the check runs before any write. GREEN: `core/rules.js`, `core/children.js` (named rule hook), `registry/presets.js` (`padron` option, derived read-only flags R-ANX-8).
- [x] 15.2 Padrones child behavior. RED: S-ANX-10 (offer for Proveedor `02`, `03`, `04`; for Cliente `01`, `02`, `03`), S-ANX-11 (Desactivar in `Desea Desactivar Padron?`: row deactivated, fecha fin today, matching master flag unchecks; `Padron Seleccionado ya esta desactivado`; no selection `Seleccionar Fila`), S-ANX-12 (`04` -> `Buen Contribuyente` checked and `AG. Percepcion` not; deactivating unchecks). GREEN: `src/views/uimasterregister/*` (padron action hooks), `registry/presets.js`.
- [x] 15.3 Proveedor master (MT). Read `RegisterProveedor.java` method bodies. RED: `test/catalogs/proveedores.cases.ts`: S-MST-26 (tabs `General`, `Activación de Proveedor`, `Padrones`; no address grid, no padrón-config dialog; modes INSERT and UPDATE), S-MST-5 (RUC `20...` -> `flag_tipo_persona` `J`; `10...` or DNI -> `N`), S-MST-3 (`un Proveedor`), S-MST-1. GREEN: `registry/catalogs/proveedores.js`, seed, menu, permissions.
- [x] 15.4 Parity and gate (see per-slice gate).

Commits: (1) `feat(softcommerce-mock): add padron rule with incompatibility checks` 15.1; (2) `feat(softcommerce): add padron actions and the Proveedor master` 15.2-15.4.

Applied as (over 800 lines, split at the 15.2/15.3 boundary): W3-15-i `feat/softcommerce-w3-15-i-padron-rule` = `feat(softcommerce-mock): add padron rule with incompatibility checks` (15.1) + `feat(softcommerce): add padron Activar and Desactivar actions` (15.2); W3-15-ii `feat/softcommerce-w3-15-ii-proveedor` = `feat(softcommerce): add Proveedor master with Padrones tab` (15.3, 15.4). `feat/softcommerce-w3-15-padron-proveedor` aliases the tip of ii.

## Slice W3-16a: Cliente identity, condición de pago, gates (branch `feat/softcommerce-w3-16a-cliente-identity`, base: W3-15; pre-marked split of W3-16)

Specs: R-MST-1(clientes),2,3,10; R-REG-17; S-MST-1,3,20,21; S-MD-14(IS_CLIENTE_CONDICION_PAGO); S-REG-25(field gate). Forecast ~400 lines.

- [x] 16a.1 Cliente identity block (MT). Read `RegisterClienteNuevo.java` method bodies at apply time: `isRegisterValid` lines 1525 to 1625 (tipo doc, names, descripcion, tipo cliente, nacionalidad, días; no "at least one dirección" rule), `loadRegister`, save lines 1078 to 1097, stamp and `codeWidth`. RED: `test/catalogs/clientes.cases.ts`: S-MST-20 (DNI cliente with 8 digits, all names, no tipo cliente -> `Para agregar un Cliente, debes Seleccionar un Tipo de Cliente.`; `OTROS` as tipo de documento skips that step), S-MST-3 (`un Cliente` with its own entity), S-MST-1 (add and modify only; `DELETE /v1/clientes/{id}` 405 `MODE_NOT_SUPPORTED`), anexo preset with `padron` pending until W3-17. GREEN: `registry/catalogs/clientes.js` (General tab, anexo preset, `docIdentidad` entity `Cliente`, stub `Tipo de Cliente` over `clasif-clientes`), seed, menu, permissions.
- [x] 16a.2 Condición de pago and gates. RED: S-MST-20 third clause (`IS_CLIENTE_CONDICION_PAGO` true and blank días -> `Ingrese numero de Dias`), S-MST-21 (condición `CREDITO` enables `Numero de dias` and shows `0`; `CONTADO` disables and shows `0`), S-MD-14 / S-REG-25 field gate (param false -> the fields are absent, not validated, a body value ignored by the server). GREEN: `clientes.js` (`gate` on the field group, `enabledWhen`, `clearsOnChange`/derive defaults).
- [x] 16a.3 Parity and gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add Cliente identity block` 16a.1; (2) `feat(softcommerce): add Cliente condicion de pago with param gate` 16a.2-16a.3.

Applied as: one branch, 700 lines over W3-15 (a6b7740 and 4a41353); the field gate, the column gate and the `layout` validation landed in commit 2.

## Slice W3-16b: Cliente direcciones, contactos, cuentas (branch `feat/softcommerce-w3-16b-cliente-grids`, base: W3-16a; pre-marked split of W3-16)

Specs: R-MST-11,12; R-REG-21(`ubigeoChildren`,`ubigeoHasActive`); S-MST-22,23; S-MD-3,6,7; S-MOCK-39,40,41,42 (real Cliente). Forecast ~390 lines.

- [x] 16b.1 Direcciones child. Read the Direccion dialog method body in `RegisterClienteNuevo.java` (or its dialog class; locate with `fd`). RED: `test/catalogs/clientes.direcciones.cases.ts`: S-MST-22 (messages in order `Debes Seleccionar un Departamento.`, `... una Provincia.`, `... un Distrito.` (not `un Almacen`), `Debes Seleccionar una Zona.` only with `IS_DIRECCION_CLIENTE` false, then `Debes Ingresar Direccion.`; param true makes the zona optional), S-MD-6 (persisted direccion `deactivate`; `Direccion ya Esta desactivada`), S-MOCK-39/41/42 on the real Cliente. GREEN: `clientes.js` child `direcciones` (dialog entry, `removal:'deactivate'`, `ubigeoChildren` + `ubigeoHasActive` reused, zona gate).
- [x] 16b.2 Contactos and cuentas. Read the Contacto and Cuenta dialog bodies. RED: S-MST-23 (blank contacto: `Ingrese Apellido Paterno`, `Ingrese Apellido Materno`, `Ingrese Nombres`; blank cuenta: `Seleccione Banco`, then with banco `OTROS` the nombre is editable and `Ingrese Nombre de Banco`, then `Ingrese Numero de Cuenta`; another banco makes the nombre the banco name, read-only), S-MD-7 (`Seleccione Fila.` on `Cuentas`), `Cuentas` child sources `tablas-detalle-sunat` `where {id_tabla_sunat:'3'}` (R-MST-11, D21). GREEN: `clientes.js` children `contactos`, `cuentas`.
- [x] 16b.3 Cross-checks. RED: S-MD-3 (Cliente with active and deactivated direcciones both show), S-MD-2 on the real Cliente (pending rows survive tab switches), S-MD-1 on the real Cliente (blank `Nacionalidad` from the `Direcciones` tab goes to `General`).
- [x] 16b.4 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add Cliente direcciones child` 16b.1; (2) `feat(softcommerce): add Cliente contactos and cuentas children` 16b.2-16b.4.

Applied as: one branch, 651 lines over 16a. The commits were cut engine / master instead (the three mechanisms the dialogs need are shared by the three children): (1) `feat(softcommerce): add dialog message style, byParam overrides and fillLabel for child dialogs` (31a45f1); (2) `feat(softcommerce): add Cliente direcciones, contactos and cuentas children` (91c2d8d).

## Slice W3-17: Cliente sustitutos, crédito, padrones (branch `feat/softcommerce-w3-17-cliente-b`, base: W3-16b)

Specs: R-MST-10,12,13; R-LKP-5(veto); D27(a); S-MST-24,25; S-LKP-9; S-ANX-9,10,11(Cliente); S-MD-14; S-REG-25. Forecast ~780 lines (flagged). Fallback in the table above.

- [x] 17.1 Sustitutos with veto. RED: `test/catalogs/clientes.sustitutos.cases.ts` + UI spec: S-MST-24 (`IS_CLIENTE_SUSTITUTO` true shows the tab; `Agregar` opens FormClienteBuscar; same cliente twice -> `Cliente ya Esta Agregado`; `Activar` on an active row `Sustituto ya esta activado`; the sustituto's cliente deactivated `Cliente esta desactivado`; `Desactivar` on a deactivated row `Sustituto ya esta desactivado`; no selection `Seleccionar un Elemento.`), S-LKP-9 (veto keeps the dialog open), `aggregate CANT_SUST` = count of active `sustitutos` (server in `enrich`, UI recompute, never sent). GREEN: `clientes.js` child `sustitutos` with `gate`, actions, `registry/pickers.js` (`formClienteBuscar` now over `clientes`), `mock-server/core/aggregate.js` (`aggregate: {as, child, op, field?, where?}`).
- [x] 17.2 Crédito and temporal crédito. RED: S-MST-25 (`IS_CLIENTE_CREDITO` true; a credit with `AMPLIACION` and `1500` makes `Credito` the previous sum plus `1500`; blank motivo `Ingrese Motivo`; blank monto `Ingrese Monto`; temporal credit with fin before inicio `Fecha es menor a fecha inicial` and its fin stored as entered, not the inicio), `aggregate` sum of `monto` per kind into `credito` and `credito_temp` (pure `core/aggregate.js` shared with the UI). GREEN: `clientes.js` child `creditos`, `core/aggregate.js`. Read the credit dialog bodies of `RegisterClienteNuevo.java`.
- [x] 17.3 Padrones on Cliente. RED: S-ANX-9 (with Cliente: `Padron ya se Encuentra Activado`, both incompatibility messages, the `03` case), S-ANX-10 (offer `01`, `02`, `03`), S-ANX-11 (Cliente flag unchecks on deactivate), S-MD-8 (server rejection of a pending padron keeps pending rows and switches to the `Padrones` tab). GREEN: `clientes.js` anexo preset `padron` option and child `padrones`.
- [x] 17.4 BuscarCliente harness. RED: harness for `buscarCliente` and `formClienteBuscar` (S-LKP-1 shape over `clientes`: three rows, none picked, pick hands the row). GREEN: harness registration.
- [x] 17.5 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add Cliente sustitutos with aggregate and veto` 17.1; (2) `feat(softcommerce): add Cliente credito and credito temporal with totals` 17.2; (3) `feat(softcommerce): add Cliente padrones with flags and the refused-row detail` 17.3; (4) `test(softcommerce): add BuscarCliente and FormClienteBuscar harness over clientes` 17.4-17.5. Applied as two branches: `-i-sustitutos` (17.1) and `-ii-credito-padrones` (17.2 to 17.4); `feat/softcommerce-w3-17-cliente-b` aliases the tip of ii.

## Slice W3-18: Item datos (branch `feat/softcommerce-w3-18-item-a`, base: W3-17)

Specs: R-MST-1(items),14,15; R-REG-17; R-MOCK-24(`PORC_IGV`); D23,D27(b); S-MST-1,27,28,29,31; S-LKP-4,13(consumer). Forecast ~780 lines (flagged). Fallback in the table above.

- [x] 18.1 Item Datos and chains. Read `RegisterItem.java` method bodies (messages and their order, `isRegisterValid`, enabling of U. Compra/U. Venta, tipo handling, stamp, `codeWidth`). RED: `test/catalogs/items.cases.ts`: S-MST-27 (empty INSERT: `Para agregar un Item, debes especificar su Codigo Alternativo.`, `... su Familia.`, `... su Marca.`, `... su Descripcion.`, `... su U. Stock.`; `U. Compra`/`U. Venta` follow when only they are blank in a direct API call), S-MST-29 (subfamilia options load for the familia and clear on change; the clase SUNAT options follow the subfamilia SUNAT code over `clases-sunat` and are empty without one), S-MST-1 (clone not shown for items). GREEN: `registry/catalogs/items.js` (tab `Datos de Item`, gates `ISBOTICA`/`IS_BOTICA_SIN_LOTE` on their fields), seed, menu, permissions.
- [x] 18.2 Derived read-only fields (D27b). RED: S-MST-28 (U. Stock chosen -> U. Compra and U. Venta follow and are read-only; tipo `Transporte` -> `Serv.Transporte` on, `Kardex` off, perecible panel hidden; tipo `Producto` -> `Kardex` on; changing the tipo resets perecible to `No perecible` and dias `0`). GREEN: `items.js` (`derive` stored + `readOnlyOn` all modes, `clearsOnChange` + defaults).
- [x] 18.3 Tax and gated prices. RED: S-MST-29 tax clause (`INAFECTO` -> `Porc. IGV` `0` read-only; `AFECTO` -> the company IGV percentage, editable; `por_igv` `default: '$params.PORC_IGV'` with `enabledWhen {afecto_igv in [AFECTO]}`, a `derive` sets `0` otherwise), S-MST-31 (`IS_ITEM_RESUMEN_PRECIO` false: no price fields, none stored; true: six prices, a blank saves `0`). GREEN: `items.js`, `core/predicates.js` (`$params` default token already added in 4b.5), `data/params.json` untouched.
- [x] 18.4 BuscarItemConversion harness. RED: S-LKP-4 and S-LKP-13 over `items` (Familia/Marca/SubFamilia chain; conversion inputs `0.0`, `0.0`, `1.0`). GREEN: harness registration of `buscarItemConversion`.
- [x] 18.5 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add Item master datos and chains` 18.1; (2) `feat(softcommerce): add Item derived fields and gated prices` 18.2-18.3; (3) `test(softcommerce): add BuscarItemConversion harness` 18.4-18.5. Applied as two branches: `-i-item-datos` (18.1 to 18.3 server side: the Item entry, `follows`, the `or` gate, the clase SUNAT chain, seeds, menu and grant) and the tip `feat/softcommerce-w3-18-item-a` (the UI half of 18.2 and 18.3: the `Datos de Item` tab, `follows` on the form, tokens, plus the 18.4 harness).

## Slice W3-19: Item almacenes (branch `feat/softcommerce-w3-19-item-b`, base: W3-18)

Specs: R-MST-14,15; S-MST-30,32; S-MD-9; S-MOCK-43; S-LKP-1(buscarParametroProv harness). Forecast ~600 lines. Fallback: none needed.

- [x] 19.1 Almacenes child. Read the Item almacén dialog body in `RegisterItem.java`. RED: `test/catalogs/items.almacenes.cases.ts`: S-MST-30 (messages in order `Seleccione Localidad`, `Seleccione Punto de Venta`, `Seleccione Almacen`, `Seleccione Proceso`; a duplicate active (almacén, proceso) -> `Almacen ya se Encuentra Activado`; localidades are those of the session empresa), S-MD-9 (the same pair after the first is deactivated is accepted), S-MOCK-43 on the real Item. GREEN: `items.js` child `almacenes` (tab `Configuracion Almacen`, `removal:'deactivate'`, unique active (almacén, proceso), dependent chain localidad -> punto de venta -> almacén).
- [x] 19.2 Deferred tabs absent and harness. RED: S-MST-32 (none of the deferred tabs of R-MST-15 is rendered; no unidades or precios grids), harness for `buscarParametroProv` over `parametros-prov` (S-LKP-1 shape). GREEN: harness registration.
- [x] 19.3 Gate (see per-slice gate).

Commits: (1) `feat(softcommerce): add Item almacenes child` 19.1; (2) `test(softcommerce): add BuscarParametroProv harness and deferred-tab guard` 19.2-19.3.

## Slice W3-20: Socio acciones and Wave 3 closeout (branch `feat/softcommerce-w3-20-socio-acciones`, base: W3-19)

Specs: R-MST-16; R-MOCK-26; R-REG-19(`miAccionSocio`); R-MD-7(corrected); S-MST-33,34,35; S-MOCK-54; S-REG-27; closeout S-MOCK-35, S-MST-37, S-REG-29, S-CRUD-50, S-REF-39. Forecast ~650 lines. Fallback in the table above.

- [x] 20.1 Socio acciones core. Read `FormAccionSocio.java` lines 69 to 72, 181 to 183 and 248 to 281 (two global lists saved together; `Desactivar` handler of the socio is outside the read set, mirrored from Precio and marked [ASSUMPTION]). RED: `mock-server/core/socioAcciones.spec.ts`: S-MOCK-54 (an active price and a second activation -> 409 `No se Puede Agregar mas de un Precio`, nothing changes; no active price in the final state -> 422 `Ingrese Precio`; valid body -> 200 with `message`, the new price applied to every active socio, all rows persisted atomically), a socio active at most once (409 `Socio ya esta activado`), `cantidad` required (422 `Ingrese Cantidad`), `fecha_fin` after `fecha_inicio` (422 `Fecha es menor a fecha inicial`). GREEN: `mock-server/core/socioAcciones.js` reusing `core/children.js` over a virtual singleton parent, `http/app.js`, `AppServicesMock.ts`, seeds `data/catalogs/socio-acciones.json`.
- [x] 20.2 Precio side of the screen. RED: `src/views/uisocioacciones/UiSocioAcciones.spec.tsx`: S-MST-33 (active price, `Activar` -> `No se Puede Agregar mas de un Precio`; none active and `Activar Precio` with a blank precio -> `Ingrese Precio`; a valid price applied to every active socio row; `Desactivar` with a fecha fin not after the inicio -> `Fecha es menor a fecha inicial`, nothing changes). GREEN: `src/views/uisocioacciones/*`, registered by hand in `formRegistry.ts` as `miAccionSocio` (D24).
- [x] 20.3 Socio side and save. RED: S-MST-34 (`Activar Socio` with blank cantidad `Ingrese Cantidad`; no selected socio `Seleccione un registro de la tabla`; socio already active `Socio ya esta activado`; a new row takes the current price), S-MST-35 (no active price and `Aceptar` -> `Ingrese Precio` and nothing sent; a price and socios -> one atomic save, server message shown, dialog closes; `Cancelar` persists nothing). GREEN: same unit, `PUT /v1/socio-acciones` with changed op lists only.
- [x] 20.4 Registration and consistency. RED: S-REG-27 (`miAccionSocio` missing in `permissions.json` fails naming the `formId`; a master with a `menu` node missing in `menu.json` fails). GREEN: `data/menu.json`, `data/permissions.json`, the custom-screen list.
- [x] 20.5 Wave 3 closeout specs. RED/GREEN as needed: a final table-driven pass over every master on `mock` and `http` (S-MOCK-35, S-MST-37), S-REG-29 (W1 and W2 suites pass unchanged except the documented R-MOCK-15/R-REF-11 amendments and the W3-3 field-helper exception), S-CRUD-50, S-REF-39 (no excluded UI), the security spec (no `clave*` anywhere), cross-UI specs (S-PRM-14, vehiculos, created user logs in, perfil edit at next login).
- [x] 20.6 Gate (see per-slice gate) plus the full W3 gate: `npm test`, `npm run typecheck`, `npm run build`, and the inventory script run (`W3` bucket exactly the 23 classes, S-INV-19).

Commits: (1) `feat(softcommerce-mock): add atomic socio-acciones resource` 20.1; (2) `feat(softcommerce): add Socio acciones screen` 20.2-20.4; (3) `test(softcommerce): add wave 3 closeout and cross-ui specs` 20.5-20.6.

---

## Coverage

| Spec area | Scenarios | Slices |
|-----------|-----------|--------|
| Inventory | S-INV-13..21 | W3-0 |
| Mock search, stubs, params | S-MOCK-45,46,52,53 | W3-1, W3-4b |
| Lookup dialog | S-LKP-1..16 | W3-2, W3-3, W3-9, W3-10, W3-17, W3-18, W3-19 |
| Lookup in CRUD templates | S-CRUD-47,48,49 | W3-1 (server), W3-2 (UI) |
| Password and textarea | S-CRUD-42..46, S-MOCK-51 | W3-9 (textarea), W3-11a, W3-11b |
| Registry (child, gate, lookup, action, custom) | S-REG-20..30 | W3-1, W3-4a, W3-4b, W3-5b, W3-6, W3-8, W3-11a, W3-13, W3-20 |
| Mock nested, composite, actions | S-MOCK-39..44,47..49,54,56,57,58 | W3-4a, W3-4b, W3-6, W3-7, W3-12, W3-14, W3-20 |
| Mock users and no-leak | S-MOCK-38,50,55 | W3-11b |
| Master-detail | S-MD-1..14 | W3-5a, W3-5b, W3-7, W3-10, W3-16b, W3-19 |
| Row actions | S-ACT-1..9 | W3-6, W3-7, W3-14 |
| Anexo | S-ANX-1..16 | W3-7, W3-8, W3-10, W3-15, W3-17 |
| Masters | S-MST-1..37 | W3-7 to W3-20 (see slice headers) |
| User permissions | S-PRM-1..16 | W3-12, W3-13, W3-14 |
| Auth session | S-AUTH-16,23..31 | W3-11b, W3-12 |
| Reference catalogs | S-REF-39..43 | W3-8, W3-10, W3-3, W3-11b |
| Compatibility | S-REG-29, S-CRUD-50, S-MST-36, S-LKP-16 | every slice (guard), W3-3 (helper exception), W3-8, W3-11b |

Totals: 25 slices, 121 tasks (W3-0: 5, W3-1: 5, W3-2: 5, W3-3: 4, W3-4a: 6, W3-4b: 6, W3-5a: 5, W3-5b: 6, W3-6: 6, W3-7: 6, W3-8: 4, W3-9: 4, W3-10: 5, W3-11a: 3, W3-11b: 6, W3-12: 4, W3-13: 6, W3-14: 5, W3-15: 4, W3-16a: 3, W3-16b: 4, W3-17: 5, W3-18: 5, W3-19: 3, W3-20: 6).
