# Tasks: SoftCommerce Web Migration, Wave 1

All paths are relative to `web_ts/softcommerce/` unless stated. Strict TDD: every behavior task is RED (failing spec) -> GREEN (minimum code) -> REFACTOR (tests stay green). Tests ship in the same commit as the code they prove.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~5,560 total across 11 slices; 320 to 650 each (max 650, under the 720 guard). `package-lock.json` (generated) excluded from counts |
| 400-line budget risk | High (total); every slice is over 400 but under the 800 budget |
| Chained PRs recommended | Yes |
| Suggested split | W1a-1 -> W1a-2 -> W1a-3 -> W1a-4 -> W1b-1 -> W1b-2 -> W1c-1 -> W1c-2 -> W1c-3 -> W1c-4 -> W1c-5 |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

Reason for "No": strategy is auto-chain with a chosen chain, and no slice exceeds 720 lines. Tightest slices: W1c-3 (650), W1c-4 (640), W1a-4 (600). If a slice trends above 720 during apply, split it before opening the PR. Two stop-and-ask conditions exist in T1.0 (working-tree blockers) and one in T1.1 (lockfile size).

### Chain topology

Tracker: `feat/softcommerce-w1` (draft, no-merge PR to `main`, merged last). Slice 1 PR targets the tracker. Each later slice PR targets the previous slice branch. Each child PR body carries a dependency diagram with the current PR marked with the pin emoji, plus start, end, prior dependencies, follow-up and out-of-scope items.

| # | Slice | Branch | PR base | PR title | ~Lines |
|---|-------|--------|---------|----------|--------|
| 1 | W1a-1 | `feat/softcommerce-w1a-1-scaffold-mock-core` | `feat/softcommerce-w1` | `feat(softcommerce): scaffold app and mock core` | 450 |
| 2 | W1a-2 | `feat/softcommerce-w1a-2-mock-http` | slice 1 branch | `feat(softcommerce): add mock HTTP server` | 420 |
| 3 | W1a-3 | `feat/softcommerce-w1a-3-service-seam` | slice 2 branch | `feat(softcommerce): add service seam and composer` | 430 |
| 4 | W1a-4 | `feat/softcommerce-w1a-4-auth-ui` | slice 3 branch | `feat(softcommerce): add login and context selection` | 600 |
| 5 | W1b-1 | `feat/softcommerce-w1b-1-shell-domain` | slice 4 branch | `feat(softcommerce): add menu tree, workspace and permissions domain` | 450 |
| 6 | W1b-2 | `feat/softcommerce-w1b-2-shell-ui` | slice 5 branch | `feat(softcommerce): add shell with tab workspace` | 560 |
| 7 | W1c-1 | `feat/softcommerce-w1c-1-list-foundations` | slice 6 branch | `feat(softcommerce): add catalog config, list rules and toolbar` | 480 |
| 8 | W1c-2 | `feat/softcommerce-w1c-2-list-view` | slice 7 branch | `feat(softcommerce): add crud list view` | 560 |
| 9 | W1c-3 | `feat/softcommerce-w1c-3-register-template` | slice 8 branch | `feat(softcommerce): add crud register template` | 650 |
| 10 | W1c-4 | `feat/softcommerce-w1c-4-localidad` | slice 9 branch | `feat(softcommerce): add Localidad catalog slice` | 640 |
| 11 | W1c-5 | `feat/softcommerce-w1c-5-inventory` | slice 10 branch | `feat(softcommerce): add GUI inventory script` | 320 |

### Per-slice gate (every slice, before opening the PR)

Run from `web_ts/softcommerce`: `npm test`, `npm run typecheck`, `npm run build` (from slice 1 on). `npm run typecheck` MUST be the real check: `tsc -p tsconfig.app.json --noEmit && tsc -p tsconfig.node.json --noEmit`. The root `tsconfig.json` uses `files: []` + `references` only (a bare `tsc --noEmit` there is a no-op, as seen in codex). T1.1 proves the script fails on a seeded type error. `tsconfig.node.json` also covers `mock-server/**/*.js` (`allowJs`, `checkJs`) and `scripts/**/*.mjs`. Record the exact result of each command in the PR body. Each slice is revertible alone, in reverse order.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | App scaffold, pinned deps, pure mock core | PR 1 | `npx vitest run mock-server/core test/pinned-deps.spec.ts` | `npm run build` (empty app builds) | `softcommerce/` root files + `mock-server/{core,data,package.json}` |
| 2 | Mock HTTP surface | PR 2 | `npx vitest run mock-server/http` | `npm run mock`; `Invoke-RestMethod http://localhost:<port>/auth/session-options` | `mock-server/{server.js,README.md,http}` |
| 3 | Service seam, composer, auth mock | PR 3 | `npx vitest run src/services` | N/A: no UI yet; contract tests hit the live mock server on port 0 | `src/services/**` |
| 4 | Login, context, session | PR 4 | `npx vitest run src/domain/period src/session src/views/uilogin src/views/uicontexto` | `npm run mock` + `npm run dev`; log in end to end in browser | `src/{session,domain/period*,views/uilogin,views/uicontexto}`, `App.tsx` |
| 5 | Menu tree, workspace, permissions, shell service | PR 5 | `npx vitest run src/domain src/shared/ui/MenuTree src/services` | N/A: no shell UI yet; pure domain + component tests | `src/domain/{menuTree,permissions,workspace,dialogStack}*`, `MenuTree`, shell service |
| 6 | Shell UI with tabs and demo stub | PR 6 | `npx vitest run src/views/uishell src/views/uidemostub` | `npm run mock` + `npm run dev`; open stub twice, Esc | `src/views/{uishell,uidemostub}` |
| 7 | CatalogConfig, list rules, toolbar, catalog service | PR 7 | `npx vitest run src/domain/crud src/shared/ui/CrudToolbar src/services` | N/A: no list view yet | `src/catalogs/CatalogConfig.ts`, `src/domain/crud`, `CrudToolbar` |
| 8 | CRUD list view | PR 8 | `npx vitest run src/shared/ui/CrudGrid src/views/uicrudlist` | `npm run dev` with a throwaway config (not committed) | `CrudGrid`, `src/views/uicrudlist` |
| 9 | CRUD register template | PR 9 | `npx vitest run src/views/uicrudregister src/shared/ui/UppercaseTextField src/domain/crud` | `npm run dev` with the minimal second config in test only | `uicrudregister`, `UppercaseTextField`, `validate/normalize` |
| 10 | Localidad slice + parity | PR 10 | `npx vitest run src/catalogs test/parity.spec.ts` | `npm run mock` + `npm run dev`: all 5 modes in browser, both `VITE_API_MODE` values | `src/catalogs/localidad`, `CascadeSelect`, lookup service, parity spec |
| 11 | GUI inventory script | PR 11 | `npx vitest run scripts/inventory` | `npm run inventory` against `desktop_java/softcommerce-desktop`; run twice and compare hashes (`Get-FileHash`) | `scripts/inventory/**`, `inventory.csv`, npm script |

---

## Slice 1: W1a-1 scaffold + mock core (branch `feat/softcommerce-w1a-1-scaffold-mock-core`)

- [x] T1.0 Preflight. Run `git status` and `git diff --cached --name-only`. The tree holds unrelated uncommitted and STAGED user changes (h2h console, appjona_codex_react_hooks, `.atl`, `.codegraph`, `openspec/`). Never stash, reset, clean, or checkout over them. Create the tracker without touching the tree: `git branch feat/softcommerce-w1 main`, then `git switch -c feat/softcommerce-w1a-1-scaffold-mock-core feat/softcommerce-w1`. If the switch refuses because of the working tree, STOP and ask the user. Stage ONLY this slice's paths by explicit pathspec and commit with `git commit -- <paths>`; before each commit require `git diff --cached --name-only` to list only softcommerce paths. If any unrelated path is staged, STOP and ask. Push the tracker, open it as a draft no-merge PR to `main`. Do NOT commit `openspec/changes/softcommerce-web-migration/` unless the user asks.
- [x] T1.1 Scaffold. RED: `test/pinned-deps.spec.ts` (S-CRUD-21: `jona-ui === "1.3.0"`, no range operator). GREEN: `package.json` (React 18, Vite, Vitest, jsdom, RTL, pinned `@testing-library/user-event`, scripts `dev|build|test|typecheck|mock`), `vite.config.ts`, `tsconfig.json` (references only), `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `.env.example` (`VITE_API_MODE|SCENARIO|URL`), `src/main.tsx`. Verify `typecheck` fails when a type error is seeded, then remove it. REFACTOR: none. Flag: lockfile is generated; if it pushes the PR over budget, ask for a lockfile-only exclusion.
- [x] T1.2 Core store, errors, seed. RED: `mock-server/core/store.spec.ts` (S-MOCK-14 reset restores seed, plus per-tenant dataset isolation). GREEN: `mock-server/package.json` (no deps), `core/{errors,store}.js`, `data/*.json` (users, tenants, empresas, puntos-venta, ubigeo, localidades, params, menu, permissions). REFACTOR: JSDoc types.
- [x] T1.3 Catalog rules. RED: `core/catalog.spec.ts` (S-MOCK-7 envelope/paging, S-MOCK-10 logical delete, S-MOCK-12 validation 422 with `details`; plus inactive excluded, display names resolved, `pageSize` default 20 / max 1000). GREEN: `core/catalog.js`. REFACTOR: extract validators.
- [x] T1.4 Ubigeo. RED: `core/ubigeo.spec.ts` (S-MOCK-8 children by level from code length, S-MOCK-9 unknown parent returns `[]`). GREEN: `core/ubigeo.js`. REFACTOR: none.
- [x] T1.5 Auth/lookup rules (supporting, no new S-*). RED: `core/auth.spec.ts` (login 200/401/403 `USER_DISABLED`/`NO_DESKTOP_ACCESS`, session-options, menu flat list, permissions 13 flags with unknown form all false, puntos-venta filtered by `id_empresa`, params). GREEN: `core/auth.js`. REFACTOR: none.
- [ ] T1.6 Gate (`npm test`, `npm run typecheck`, `npm run build`), commit plan below, push, open PR against `feat/softcommerce-w1`.

Commits: (1) `chore(softcommerce): scaffold vite app with pinned jona-ui` T1.1; (2) `feat(softcommerce-mock): add store, errors and seed with reset` T1.2; (3) `feat(softcommerce-mock): add catalog and ubigeo rules` T1.3+T1.4; (4) `feat(softcommerce-mock): add auth, menu and lookup rules` T1.5.

## Slice 2: W1a-2 mock HTTP (branch `feat/softcommerce-w1a-2-mock-http`, base: slice 1)

- [x] T2.1 Router, tenant, correlation, errors. RED: `mock-server/http/app.spec.ts`, server on port 0 with real `fetch`, reset between tests (S-MOCK-1, S-MOCK-2, S-MOCK-3, S-MOCK-4, S-MOCK-5, S-MOCK-6). GREEN: `http/app.js` (routes per design table, `X-Tenant-Id` gate with 400 `TENANT_REQUIRED` / 404 `TENANT_NOT_FOUND`, `X-Correlation-Id` echo or generate, `traceId` equals correlation id). REFACTOR: small route table.
- [x] T2.2 Catalog routes and physical delete rejection. RED: S-MOCK-11 (`?physical` and `/fisico` return 404/405 with error shape); supporting: 201/200/204 statuses, `/v1/ubigeo`, `/v1/empresas`, `/v1/puntos-venta?id_empresa=`, `/v1/params`, `POST /__mock/reset` HTTP smoke. GREEN: routes in `http/app.js`. REFACTOR: none.
- [x] T2.3 Seed swap. RED: S-MOCK-13 (start the app with a temp data dir holding another valid `menu.json`; `GET /menu` serves it, no code change). GREEN: `data` dir injectable into the app factory. REFACTOR: none.
- [x] T2.4 `mock-server/server.js` (reads JSON via `fs`, env `PORT`), `README.md` (routes, tenants, scenarios), npm script `mock`. Gate, PR.

Commits: (1) `feat(softcommerce-mock): add http app with tenant and correlation` T2.1+T2.3; (2) `feat(softcommerce-mock): add catalog and lookup routes` T2.2; (3) `feat(softcommerce-mock): add server entry and readme` T2.4.

## Slice 3: W1a-3 service seam (branch `feat/softcommerce-w1a-3-service-seam`, base: slice 2)

- [x] T3.1 ApiError + httpClient. RED: `src/services/httpClient.spec.ts` (S-AUTH-22 `X-Tenant-Id` on post-login requests; supporting: `Authorization`, generated `X-Correlation-Id`, error body mapped to `ApiError{status,code,message,details,traceId}`). GREEN: `ApiError.ts`, `httpClient.ts`. REFACTOR: none.
- [x] T3.2 lazyService + serviceComposer. RED: `serviceComposer.spec.ts` (S-AUTH-1 mock mode loads via dynamic import using `vi.dynamicImportSettled`, S-AUTH-2 http mode does not load the mock, S-AUTH-3 invalid mode names `VITE_API_MODE`, S-AUTH-4 empty or `not-a-url` base URL). GREEN: `lazyService.ts`, `serviceComposer.ts`. REFACTOR: pure env parser.
- [x] T3.3 Auth service and mock. RED: `AuthServiceHttp.spec.ts` (contract against live mock server on port 0), `mock/AppServicesMock.spec.ts` (scenarios `exitoso|vacio|errorServidor` reject `ApiError` 500). GREEN: `InterAuthService.ts` (login, sessionOptions, empresas, puntosVenta, params), `AuthServiceHttp.ts`, `mock/{AppServicesMock,seed}.ts` importing `mock-server/core`, `mock/fixtures/*.fixture.ts`. REFACTOR: none.
- [ ] T3.4 Gate, PR.

Commits: (1) `feat(softcommerce): add ApiError and http client` T3.1; (2) `feat(softcommerce): add service composer with lazy mock` T3.2; (3) `feat(softcommerce): add auth service http and mock` T3.3.

## Slice 4: W1a-4 auth UI (branch `feat/softcommerce-w1a-4-auth-ui`, base: slice 3)

- [x] T4.1 Period rules. RED: `src/domain/period.spec.ts` (S-AUTH-11 invalid date, S-AUTH-12 before INICIO_ACTIVIDADES, S-AUTH-13 fin before inicio, S-AUTH-14 different accounting year, S-AUTH-15 boundary valid). GREEN: `domain/period.ts`. REFACTOR: per-rule independent functions.
- [x] T4.2 Session. RED: `src/session/session.spec.tsx` (S-AUTH-18 logout clears and login step 1 shows, S-AUTH-19 guard redirects; supporting: `sessionStorage` key `softcommerce.session.v1`, step-1 result memory-only). GREEN: `sessionStore.ts`, `SessionProvider.tsx`, `RequireSession.tsx`. REFACTOR: none.
- [x] T4.3 Login step 1 (JONA view unit). RED: `views/uilogin/UiLogin.spec.tsx` with injected fake service (S-AUTH-5 empty fields, S-AUTH-6 disabled user, S-AUTH-7 no desktop access, S-AUTH-8 bad credentials, S-AUTH-20 Enter submits once, S-AUTH-21 server message + `traceId` in details). GREEN: `InterUiLogin.ts` (DEFAULTS without state values), `UiLoginImpl.ts`, `UiLoginView.tsx`, `UiLogin.tsx`, `index.ts`. REFACTOR: value-first callbacks.
- [x] T4.4 Context step 2. RED: `views/uicontexto/UiContexto.spec.tsx` (S-AUTH-9 tenant-scoped empresas and puntos de venta, S-AUTH-10 punto de venta reloads and clears on empresa change, S-AUTH-16 session holds tenant/user/empresa/punto/period/params and navigates). GREEN: `views/uicontexto/*` same five files. REFACTOR: none.
- [x] T4.5 `src/App.tsx` routing (login, context, protected placeholder for the shell). Gate, PR.

Commits: (1) `feat(softcommerce): add period validation rules` T4.1; (2) `feat(softcommerce): add session store and guard` T4.2; (3) `feat(softcommerce): add login step with account rejection` T4.3; (4) `feat(softcommerce): add context selection and routing` T4.4+T4.5.

## Slice 5: W1b-1 shell domain (branch `feat/softcommerce-w1b-1-shell-domain`, base: slice 4)

- [ ] T5.1 Menu tree. RED: `domain/menuTree.spec.ts` (S-SHELL-1 2-level nesting by `id_menu_padre`, S-SHELL-2 a different payload renders equal, nothing hardcoded). GREEN: `domain/menuTree.ts` (`buildMenuTree`). REFACTOR: none.
- [ ] T5.2 MenuTree component. RED: `shared/ui/MenuTree/MenuTree.spec.tsx` (S-SHELL-3 submenu toggle; supporting: leaf click callback, `menu_item='N'` is a submenu). GREEN: `MenuTree/{InterMenuTree,MenuTreeImpl,MenuTreeView,MenuTree,index}`. REFACTOR: none.
- [ ] T5.3 Workspace reducer. RED: `domain/workspace.spec.ts` (S-SHELL-12 closing the middle active tab activates a neighbor; supporting: `open` re-selects when present with no duplicate, `select`, close last gives empty). GREEN: `domain/workspace.ts`. REFACTOR: none.
- [ ] T5.4 Permissions and dialog stack (supporting). RED: `domain/permissions.spec.ts` (13 flags parsed, failure yields all false), `domain/dialogStack.spec.ts` (push, pop, top, remove by id). GREEN: `permissions.ts`, `dialogStack.ts`. REFACTOR: none.
- [ ] T5.5 Shell service. RED: `ShellServiceHttp.spec.ts` (live server: menu, permissions) and mock parity in `AppServicesMock.spec.ts`. GREEN: `InterShellService.ts`, `ShellServiceHttp.ts`, extend `mock/AppServicesMock.ts` and composer. Gate, PR.

Commits: (1) `feat(softcommerce): add menu tree builder and component` T5.1+T5.2; (2) `feat(softcommerce): add tab workspace reducer` T5.3; (3) `feat(softcommerce): add permissions, dialog stack and shell service` T5.4+T5.5.

## Slice 6: W1b-2 shell UI (branch `feat/softcommerce-w1b-2-shell-ui`, base: slice 5)

- [ ] T6.1 Esc dialog stack. RED: `views/uishell/DialogStack.spec.tsx` with nested dialogs (S-SHELL-16 only the topmost closes, tab remains; supporting: clicks unaffected, capture-phase `window` listener snapshot). GREEN: `DialogStackProvider.tsx` with guarded `onClose`. REFACTOR: none.
- [ ] T6.2 FormHost permissions. RED: `views/uishell/FormHost.spec.tsx` (S-SHELL-7 requested once, 13 flags exposed; S-SHELL-9 fetch failure shows error and denies all). GREEN: `FormHost.tsx`. REFACTOR: none.
- [ ] T6.3 Shell tabs and registry. RED: `views/uishell/UiShell.spec.tsx` + `uidemostub/UiDemoStub.spec.tsx` (S-SHELL-4 leaf opens titled tab, S-SHELL-10 re-select keeps stub filter and does not refetch, S-SHELL-11 two forms keep own state, S-SHELL-13 empty workspace message, S-SHELL-14 reopen reloads permissions). GREEN: `uishell/*` (JTabsList/JTabsTrigger, panels all mounted and `hidden` when inactive), `formRegistry.ts` with `demo_stub`, `uidemostub/*`. REFACTOR: none.
- [ ] T6.4 Menu states and unknown leaf. RED: (S-SHELL-5 unknown leaf shows a "not available yet" `JOptionPane` notice registered in the stack, no tab; S-SHELL-6 menu error with retry, workspace usable). GREEN: shell menu wiring. REFACTOR: none.
- [ ] T6.5 Header and logout. RED: `ShellHeader.spec.tsx` (S-SHELL-15 user, empresa, punto, `dd/MM/yyyy – dd/MM/yyyy`; S-AUTH-17 no period control). GREEN: `ShellHeader` view unit, wire into `App.tsx` replacing the placeholder. Gate, PR.

Commits: (1) `feat(softcommerce): add guarded Esc dialog stack` T6.1; (2) `feat(softcommerce): add form host with fail-closed permissions` T6.2; (3) `feat(softcommerce): add shell tab workspace with demo stub` T6.3+T6.4; (4) `feat(softcommerce): add session header and logout` T6.5.

## Slice 7: W1c-1 list foundations (branch `feat/softcommerce-w1c-1-list-foundations`, base: slice 6)

- [ ] T7.1 Catalog contract and composer. RED: `services/serviceComposer.spec.ts` additions (S-LOC-20 invalid mode or missing URL throws before any request for the catalog service); supporting: `CatalogServiceHttp` contract against live server, mock catalog service in `AppServicesMock`. GREEN: `catalogs/CatalogConfig.ts`, `services/{InterCatalogService,CatalogServiceHttp}.ts`, composer + mock extension. REFACTOR: none.
- [ ] T7.2 Filter and sort. RED: `domain/crud/filterSort.spec.ts` (S-CRUD-5 "lim" shows LIMA, clearing restores; S-CRUD-6 asc then desc). GREEN: `filterSort.ts`. REFACTOR: none.
- [ ] T7.3 List view model (supporting). RED: `domain/crud/listView.spec.ts` (`applyListView` filter -> sort -> page of 20; filter or sort change resets to page 1; truncation flag when `pagination.total > items.length`). GREEN: `listView.ts`. REFACTOR: none.
- [ ] T7.4 Toolbar gate and component. RED: `toolbarGate.spec.ts` + `shared/ui/CrudToolbar/CrudToolbar.spec.tsx` (S-CRUD-2 flags, S-CRUD-3 row-dependent, S-CRUD-4 click or shortcut denied sends nothing, S-SHELL-8 table-driven over each flag false; supporting: `export` renders disabled with "not available" tooltip). GREEN: `toolbarGate.ts`, `CrudToolbar/*`. REFACTOR: none. Gate, PR.

Commits: (1) `feat(softcommerce): add catalog service and config contract` T7.1; (2) `feat(softcommerce): add list filter, sort and paging rules` T7.2+T7.3; (3) `feat(softcommerce): add permission-gated crud toolbar` T7.4.

## Slice 8: W1c-2 list view (branch `feat/softcommerce-w1c-2-list-view`, base: slice 7)

- [ ] T8.1 CrudGrid. RED: `shared/ui/CrudGrid/CrudGrid.spec.tsx` (supporting: row `onClick` selects, `onDoubleClick` fires, header click toggles sort, `JPagination` footer pages). GREEN: `CrudGrid/*` over JTable/JTableRow/JTableHead + JPagination. REFACTOR: none.
- [ ] T8.2 List Impl. RED: `views/uicrudlist/UiCrudList.spec.tsx` hook tests with fake service (supporting: single `list({page:1,pageSize:1000})` fetch, selection stored by id and re-selected after refresh with page jump, cleared after delete, truncation warning). GREEN: `InterUiCrudList.ts`, `UiCrudListImpl.ts` (`useUiCrudListImpl(config)`). REFACTOR: none.
- [ ] T8.3 List view states. RED: (S-CRUD-1 loading, empty message, error with retry). GREEN: `UiCrudListView.tsx`, `UiCrudList.tsx`, `index.ts`. Gate, PR.

Commits: (1) `feat(softcommerce): add crud grid with pagination` T8.1; (2) `feat(softcommerce): add crud list view with load states` T8.2+T8.3.

## Slice 9: W1c-3 register template (branch `feat/softcommerce-w1c-3-register-template`, base: slice 8)

- [ ] T9.1 Validate and normalize. RED: `domain/crud/validate.spec.ts` (supporting: errors in `config.fields` order, required, `maxLength` for server values, cascade first unset level; `normalize` uppercases). GREEN: `validate.ts`, `normalize.ts`. REFACTOR: none.
- [ ] T9.2 UppercaseTextField. RED: `UppercaseTextField.spec.tsx` (S-CRUD-14 overflow ignored for typing and paste, paste over a selection accepted at 100, no truncation; S-CRUD-15 "lima" becomes "LIMA"). GREEN: `shared/ui/UppercaseTextField/*` (replace `[selectionStart,selectionEnd)`, ignore whole insertion if longer than `maxLength`). REFACTOR: none.
- [ ] T9.3 Register flow and modes. RED: `views/uicrudregister/UiCrudRegister.spec.tsx` with fake service (S-CRUD-8 INSERT create once, closes, refreshes, selects new row; S-CRUD-9 UPDATE prefilled, update with id; S-CRUD-10 DELETE read-only with confirmation, cancel sends nothing; S-CRUD-12 CLONE no id, create, original unchanged; S-CRUD-16 declined confirmation; S-CRUD-17 500 keeps dialog and values). GREEN: `uicrudregister/*` (lookups -> mode -> load -> validate -> confirm -> execute -> close/refresh/reselect). REFACTOR: none.
- [ ] T9.4 Focus first invalid. RED: (S-CRUD-13 required missing: no request, field error, focus on first invalid by name->ref map). GREEN: ref map in `UiCrudRegisterImpl`. REFACTOR: none.
- [ ] T9.5 Keyboard and DETAIL. RED: (S-CRUD-11 DETAIL read-only, no submit, Enter nothing; S-CRUD-18 Enter submits once from single-line field only; S-CRUD-19 Esc closes untouched with no request, dirty asks discard confirmation). GREEN: key handling through the dialog stack. REFACTOR: none.
- [ ] T9.6 Lookup failure. RED: (S-CRUD-20 lookup rejects on open: error shown, submit disabled). GREEN: lookup error state. REFACTOR: none.
- [ ] T9.7 List-to-register wiring and config-only. RED: `views/uicrudlist/UiCrudListRegister.spec.tsx` (S-CRUD-7 double-click opens DETAIL when `details=true`, nothing when false; S-CRUD-22 a second minimal config renders list and register with no new template code). GREEN: wiring in `UiCrudList`. Gate, PR.

Commits: (1) `feat(softcommerce): add validate and normalize rules` T9.1; (2) `feat(softcommerce): add uppercase text field with insertion limit` T9.2; (3) `feat(softcommerce): add register template modes and flow` T9.3+T9.4+T9.6; (4) `feat(softcommerce): add register keyboard handling and list wiring` T9.5+T9.7.

## Slice 10: W1c-4 Localidad (branch `feat/softcommerce-w1c-4-localidad`, base: slice 9)

- [ ] T10.1 Lookup service. RED: `LookupServiceHttp.spec.ts` (live server: empresas, ubigeo children) + mock parity. GREEN: `services/{InterLookupService,LookupServiceHttp}.ts`, mock extension. REFACTOR: none.
- [ ] T10.2 CascadeSelect. RED: `shared/ui/CascadeSelect/CascadeSelect.spec.tsx` (S-LOC-6 initial disabled, S-LOC-7 departamento change resets below, S-LOC-8 provincia change resets distrito only, S-LOC-9 distrito change keeps above, S-LOC-10 stale response ignored via deferred promises, using a `latest-request` guard). GREEN: `CascadeSelect/*`. REFACTOR: none.
- [ ] T10.3 Localidad config. RED: `catalogs/localidad/localidad.config.spec.tsx` (S-LOC-1 list columns, 2 of 3 rows, names resolved; S-LOC-3 empresa required; S-LOC-4 descripcion 100 limit, paste ignored, never sends >100; S-LOC-5 distrito required). GREEN: `localidad.config.ts` (`mi_localidad`, Empresa select, descripcion/direccion uppercase max 100, cascade with `ancestorsOf`), registry swap replacing `demo_stub`. REFACTOR: none.
- [ ] T10.4 Localidad modes. RED: (S-LOC-2 INSERT with uppercase values and distrito id as `id_ubigeo`, S-LOC-11 UPDATE restores all three levels with options, S-LOC-12 UPDATE new direccion in list, S-LOC-13 DELETE logical leaves list, S-LOC-14 DELETE denied, S-LOC-15 DETAIL read-only populated, S-LOC-16 CLONE new id identical data). GREEN: wiring fixes only; config changes only, no catalog-specific template code. REFACTOR: none.
- [ ] T10.5 No physical delete. RED: (S-LOC-17 `CatalogServiceHttp` and mock expose no physical-delete method; toolbar offers none). GREEN: none expected. REFACTOR: none.
- [ ] T10.6 Dual-source parity. RED: `test/parity.spec.ts`, `describe.each(['mock','http'])` at service level (S-LOC-18 mock mode, no network, S-LOC-19 http against running server; both run the S-LOC-2/7/13 equivalents). GREEN: fix drift in shared core only. Gate, manual smoke in both modes, PR.

Commits: (1) `feat(softcommerce): add lookup service` T10.1; (2) `feat(softcommerce): add cascade select with stale guard` T10.2; (3) `feat(softcommerce): add Localidad catalog config` T10.3+T10.5; (4) `feat(softcommerce): complete Localidad modes and dual-source parity` T10.4+T10.6.

## Slice 11: W1c-5 inventory (branch `feat/softcommerce-w1c-5-inventory`, base: slice 10)

- [ ] T11.1 Scanner. RED: `scripts/inventory/inventory.spec.ts` with Latin-1 fixtures in a temp dir (S-INV-1 `RegisterLocalidad extends JHDialog` is a register dialog, S-INV-2 multi-line extends; supporting: two classes in one file with no cross-attribution). GREEN: `lib.mjs` header scanner (strip comments/strings, header up to `{`). REFACTOR: none.
- [ ] T11.2 Exclusions. RED: (S-INV-3 eight base classes, S-INV-4 `PnlRenderer*` under `shared/util/render/`, S-INV-5 `view/tablemodel` and `view/conta/tablas`, S-INV-6 combo models). GREEN: exclusion rules. REFACTOR: none.
- [ ] T11.3 Category and wave. RED: (S-INV-8 `BuscarCliente` and `FormBuscarItem` search/lookup, `FormVentas` process/detail form; supporting: `WAVE_RULES` order). GREEN: category and `WAVE_RULES` in `lib.mjs`. REFACTOR: none.
- [ ] T11.4 Encoding and determinism. RED: (S-INV-7 "Descripción" intact as UTF-8, S-INV-9 two runs byte-identical). GREEN: `readFileSync().toString('latin1')`, sorted rows, stable quoting. REFACTOR: none.
- [ ] T11.5 CLI failure handling. RED: (S-INV-10 missing root non-zero exit naming the path, S-INV-11 unreadable file reported on stderr and skipped, S-INV-12 Java tree unmodified, checked by hash before/after). GREEN: `inventory.mjs`, npm script `inventory`. REFACTOR: none.
- [ ] T11.6 Generate `inventory.csv` from `desktop_java/softcommerce-desktop` (generated, excluded from the line count). Gate, PR. Then mark the tracker PR ready.

Commits: (1) `feat(softcommerce-inventory): add class scanner and exclusions` T11.1+T11.2; (2) `feat(softcommerce-inventory): add category, wave and csv output` T11.3+T11.4; (3) `feat(softcommerce-inventory): add cli failure handling and generated csv` T11.5+T11.6.

---

## Scenario coverage (106 scenarios, each in exactly one task; no unmapped scenarios)

| Scenarios | Task |
|-----------|------|
| S-MOCK-14 | T1.2 |
| S-MOCK-7, S-MOCK-10, S-MOCK-12 | T1.3 |
| S-MOCK-8, S-MOCK-9 | T1.4 |
| S-MOCK-1, 2, 3, 4, 5, 6 | T2.1 |
| S-MOCK-11 | T2.2 |
| S-MOCK-13 | T2.3 |
| S-CRUD-21 | T1.1 |
| S-AUTH-22 | T3.1 |
| S-AUTH-1, 2, 3, 4 | T3.2 |
| S-AUTH-11, 12, 13, 14, 15 | T4.1 |
| S-AUTH-18, 19 | T4.2 |
| S-AUTH-5, 6, 7, 8, 20, 21 | T4.3 |
| S-AUTH-9, 10, 16 | T4.4 |
| S-AUTH-17 | T6.5 |
| S-SHELL-1, 2 | T5.1 |
| S-SHELL-3 | T5.2 |
| S-SHELL-12 | T5.3 |
| S-SHELL-16 | T6.1 |
| S-SHELL-7, 9 | T6.2 |
| S-SHELL-4, 10, 11, 13, 14 | T6.3 |
| S-SHELL-5, 6 | T6.4 |
| S-SHELL-15 | T6.5 |
| S-SHELL-8 | T7.4 |
| S-LOC-20 | T7.1 |
| S-CRUD-5, 6 | T7.2 |
| S-CRUD-2, 3, 4 | T7.4 |
| S-CRUD-1 | T8.3 |
| S-CRUD-14, 15 | T9.2 |
| S-CRUD-8, 9, 10, 12, 16, 17 | T9.3 |
| S-CRUD-13 | T9.4 |
| S-CRUD-11, 18, 19 | T9.5 |
| S-CRUD-20 | T9.6 |
| S-CRUD-7, 22 | T9.7 |
| S-LOC-6, 7, 8, 9, 10 | T10.2 |
| S-LOC-1, 3, 4, 5 | T10.3 |
| S-LOC-2, 11, 12, 13, 14, 15, 16 | T10.4 |
| S-LOC-17 | T10.5 |
| S-LOC-18, 19 | T10.6 |
| S-INV-1, 2 | T11.1 |
| S-INV-3, 4, 5, 6 | T11.2 |
| S-INV-8 | T11.3 |
| S-INV-7, 9 | T11.4 |
| S-INV-10, 11, 12 | T11.5 |

Count check: MOCK 14 (1+3+... T1.2:1, T1.3:3, T1.4:2, T2.1:6, T2.2:1, T2.3:1), AUTH 22, SHELL 16, CRUD 22, LOC 20, INV 12 = 106.

Notes: S-LOC-2/7/13 are owned by component tests (T10.4, T10.2) and re-run at service level in T10.6 as supporting checks. S-CRUD-7 lives in T9.7 because DETAIL exists only from slice 9. This file exceeds the usual 530-word tasks budget by design: the orchestrator required per-task RED/GREEN detail, 11 slices and full coverage mapping.

## RUP traceability

Each slice above is one RUP Construction iteration. The use case → scenario → task matrix and the per-iteration use-case plan are in [rup/README.md](rup/README.md). No task changes.
