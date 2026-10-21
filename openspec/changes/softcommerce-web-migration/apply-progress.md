# Apply Progress: softcommerce-web-migration

## Slice 1 (W1a-1) - branch `feat/softcommerce-w1a-1-scaffold-mock-core`

Mode: Strict TDD. Status: T1.0-T1.5 done (T1.6 gate/commit/PR left to the orchestrator). Gate (from `web_ts/softcommerce`): `npm test` 6 files / 51 tests passed; `npm run typecheck` exit 0 (also proven to fail on a seeded type error in both `src/` and `mock-server/core/*.js`); `npm run build` OK (29 modules).

### TDD Cycle Evidence
| Task | Test file | Layer | Safety net | RED observed | GREEN | Triangulate | Refactor |
|------|-----------|-------|------------|--------------|-------|-------------|----------|
| T1.1 | `test/pinned-deps.spec.ts` | Unit (node) | N/A (new) | 2/2 failed with `jona-ui` as `^1.3.0` and ranged deps | 2/2 pass after exact pins | 2 cases (jona-ui; all deps exact) | none |
| T1.2 | `mock-server/core/{store,errors}.spec.ts` | Unit | N/A (new) | suites failed: `./errors.js` / `./store.js` not found | 10/10 | reset (create, edit, delete), tenant isolation, seed immutability, unknown tenant | JSDoc types |
| T1.3 | `mock-server/core/catalog.spec.ts` | Unit | N/A (new) | suite failed: `./catalog.js` not found | 17/17 | paging, defaults/clamp, invalid paging, inactive, display names, filter, tenant isolation, CRUD, 422 | validators extracted to `validators.js`, 27/27 still green |
| T1.4 | `mock-server/core/ubigeo.spec.ts` | Unit | N/A (new) | suite failed: `./ubigeo.js` not found | 6/6 | 3 levels, unknown, malformed, distrito | simplified level derivation, still green |
| T1.5 | `mock-server/core/auth.spec.ts` | Unit | N/A (new) | suite failed: `./auth.js` not found | 16/16 | 401/403 x2, tenant membership, 13 flags, unknown form, partial seed, lookups | none |

### Work Unit Evidence
| Evidence | Value |
|---|---|
| Focused test command | `npx vitest run mock-server/core test/pinned-deps.spec.ts`: 6 files, 51 tests passed |
| Runtime harness | `npm run build` (empty app builds, 29 modules). Mock HTTP harness N/A: no server until slice 2 |
| Rollback boundary | `web_ts/softcommerce/**` only |

### Files (lines; package-lock.json 3221 excluded)
Total excluding lockfile: 1200 lines (exceeds the 800 budget; see risks).

## Slice 2 (W1a-2) - branch `feat/softcommerce-w1a-2-mock-http`

Mode: Strict TDD. Status: T2.1-T2.4 done (gate, commits and PR left to the orchestrator). Gate (from `web_ts/softcommerce`): `npm test` 9 files / 74 tests passed (23 new); `npm run typecheck` exit 0; `npm run build` exit 0. Runtime harness: `PORT=4021 node mock-server/server.js`; `GET /auth/session-options` returned 200 with a generated `X-Correlation-Id` and CORS headers; `GET /v1/localidades?pageSize=2` with `X-Tenant-Id: demo` returned 2 enriched items plus pagination; `GET /menu` without tenant returned 400 `TENANT_REQUIRED`. Process stopped afterwards.

### TDD Cycle Evidence
| Task | Test file | Layer | Safety net | RED observed | GREEN | Triangulate | Refactor |
|------|-----------|-------|------------|--------------|-------|-------------|----------|
| T2.1 | `mock-server/http/app.spec.ts` (+ `test-server.ts` helper) | Integration (real fetch, port 0) | 51 slice-1 tests green | suite failed: `./app.js` not found | 11/11 | echoed vs generated id, traceId follows echoed id, 400 vs 404 tenant, public route, login 401/403, unknown route, malformed JSON, CORS preflight | small route table (data array) |
| T2.2 | `mock-server/http/routes.spec.ts` | Integration | app.spec green | 9/9 failed (routes missing, 404) | 9/9 | 201/200/204, 422 details, `?physical` 405 and `/fisico` 404, ubigeo 3 levels + unknown, empresas/puntos-venta filter, params, reset 204 | none (lookups ordered before generic catalog routes) |
| T2.3 | `mock-server/http/seedSwap.spec.ts` | Integration | 20 http tests green | 2/2 failed: `createApp` without seed (`tenants` of undefined) | 3/3 | replaced menu served, other seed files intact, missing seed file names the path | `loadSeed.js` extracted |
| T2.4 | none (entry wiring; covered by runtime harness) | Runtime | n/a | n/a | harness above | n/a | n/a |

### Deviations
- `createApp({seed|dataDir})` returns `{server, store}` unstarted (tests listen on port 0). `POST /__mock/reset` is public (no tenant). Added CORS headers and `OPTIONS` 204 so the browser app can call the server in slice 3+. `MOCK_DATA_DIR` env is an extra override. The npm script `mock` already existed from slice 1.

### Files (lines)
`mock-server/http/app.js` 115, `loadSeed.js` 35, `test-server.ts` 49, `app.spec.ts` 100, `routes.spec.ts` 83, `seedSwap.spec.ts` 37, `mock-server/server.js` 10, `mock-server/README.md` 57. Total 486 (budget 800, forecast 420).

## Slice 3 (W1a-3) - branch `feat/softcommerce-w1a-3-service-seam`

Mode: Strict TDD. Status: T3.1-T3.3 done (T3.4 commits and PR left to the orchestrator). Gate (from `web_ts/softcommerce`): `npm test` 15 files / 133 tests passed (59 new); `npm run typecheck` exit 0; `npm run build` exit 0. Chunk check (temporary `main.tsx` import of `composeServices`, reverted): `dist/assets/AppServicesMock-*.js` 6.83 kB is a separate lazy chunk holding seed, fixtures and core (`COMERCIAL DEMO`, `mock-token`, `admin123` found only there); `dist/assets/index-*.js` 146.93 kB contains none of them. The committed build has no importer yet, so its entry is 142.62 kB with no mock chunk until slice 4 wires the composer.

### TDD Cycle Evidence
| Task | Test file | Layer | Safety net | RED observed | GREEN | Triangulate | Refactor |
|------|-----------|-------|------------|--------------|-------|-------------|----------|
| T3.1 | `src/services/httpClient.spec.ts` | Unit (fake fetch) | 74/74 slice 1-2 tests green | suite failed: `./ApiError` not found | 11/11 | session vs other tenant, explicit tenant override, public call without tenant, correlation id, JSON body, query skipping undefined, 204, error body mapped, non-JSON body fallback, network failure | none |
| T3.2 | `lazyService.spec.ts`, `serviceComposer.spec.ts` | Unit | T3.1 green | both suites failed: modules not found | 16/16 | defaults, empty values, 3 scenarios, trailing slash, bad mode/scenario (also in http mode), empty/missing/`not-a-url`, mock not required, load once, retry after failure, not thenable | env parser kept pure (`parseApiEnv`) |
| T3.3 | `AuthServiceHttp.spec.ts`, `mock/AppServicesMock.spec.ts`, `composeServices.spec.ts` (+ shared `authServiceContract.ts`) | Integration (live mock server on port 0, real fetch) + unit | T3.2 green | AuthServiceHttp and AppServicesMock suites failed on missing modules; 4/4 composeServices cases failed (no `composeServices` export) | 32/32 | one contract (7 cases, 10 with table rows) run against BOTH implementations (parity); vacio and errorServidor scenarios; S-AUTH-1 with `vi.dynamicImportSettled` + fake timers, S-AUTH-2 mock module never evaluated | one shared mock instance across domains (cache in `composeServices`) |

Scenario coverage: S-AUTH-22 (httpClient.spec, AuthServiceHttp.spec), S-AUTH-1/2 (composeServices.spec), S-AUTH-3/4 (serviceComposer.spec, composeServices.spec).

### Work Unit Evidence
| Evidence | Value |
|---|---|
| Focused test command | `npx vitest run src/services`: 6 files, 59 tests passed |
| Runtime harness | Contract tests hit the live mock server on port 0. Build chunk check above |
| Rollback boundary | `src/services/**` plus `allowJs` in `tsconfig.app.json` |

### Deviations
- `tsconfig.app.json` gained `"allowJs": true` so `src/` can import `mock-server/core/*.js` (JSDoc-typed, checked by the node config).
- `composeService<T>(config, {createHttp, loadMock})` is a generic selector tested with fake loaders (T3.2); `composeServices(env, {fetchFn, getSession})` wires the auth domain and the real dynamic import (T3.3). This keeps commit 2 green on its own.
- `InterAuthService` unwraps `{items}` and takes `tenantId` explicitly only for `login`; every other call reads the tenant and token from an injected `getSession`.
- Mock mode mirrors the HTTP tenant gate (400 `TENANT_REQUIRED`, 404 `TENANT_NOT_FOUND`) and maps core `MockError` to the same `ApiError`.
- No singleton service export and no `main.tsx` change: the UI wiring is slice 4.

### Files (lines)
`ApiError.ts` 54, `httpClient.ts` 85, `lazyService.ts` 25, `serviceComposer.ts` 90, `InterAuthService.ts` 53, `AuthServiceHttp.ts` 18, `mock/AppServicesMock.ts` 90, `mock/seed.ts` 18, `mock/fixtures/{types 6, exitoso 4, vacio 17, errorServidor 8}`, specs: `httpClient` 133, `lazyService` 58, `serviceComposer` 89, `composeServices` 73, `authServiceContract.ts` 97, `AuthServiceHttp` 39, `AppServicesMock` 47; `tsconfig.app.json` +1. Total 1004 lines (budget 800, forecast 430; over the 720 guard, see the split proposal in the hand-back).

## Slice 4 (W1a-4) - branch `feat/softcommerce-w1a-4-auth-ui`

Mode: Strict TDD. Status: T4.1-T4.5 done (commits and PR left to the orchestrator). Gate (from `web_ts/softcommerce`): `npm test` 20 files / 177 tests passed (44 new); `npm run typecheck` exit 0; `npm run build` exit 0 (342 modules; `dist/assets/AppServicesMock-*.js` 6.83 kB stays a separate lazy chunk and is the only file containing `admin123`/`COMERCIAL DEMO`/`mock-token`; entry `index-*.js` 227.73 kB). Runtime harness (http mode via inline env `VITE_API_MODE=http VITE_API_URL=http://localhost:4020`, no `.env.local` written): `PORT=4020 node mock-server/server.js` answered `GET /auth/session-options` 200, `POST /auth/login` (demo, admin) returned `{token,user}`, `GET /v1/empresas` returned the demo empresas; `vite --port 5199` served the index and `/src/main.tsx`, `/src/App.tsx`, `/src/views/uilogin/UiLogin.tsx`, `/src/views/uicontexto/UiContexto.tsx` with 200. Both processes stopped. No browser was available, so the end-to-end click path is covered by `App.spec.tsx` (real store + mock auth service) instead.

### TDD Cycle Evidence
| Task | Test file | Layer | Safety net | RED observed | GREEN | Triangulate | Refactor |
|------|-----------|-------|------------|--------------|-------|-------------|----------|
| T4.1 | `src/domain/period.spec.ts` | Unit (node) | 133/133 slice 1-3 tests green | suite failed: `./period` not found | 10/10 | each rule alone (valid/invalid + boundary), S-AUTH-11 (impossible, empty, either field), 12, 13, 14, 15, ordinary range | rules are independent exported functions; `validatePeriod` returns the first violation |
| T4.2 | `src/session/session.spec.tsx` | Unit + component (jsdom) | T4.1 green | suite failed: `./sessionStore`, `./SessionProvider`, `./RequireSession` not found; after GREEN one test still failed (RTL auto-cleanup off, duplicate buttons) | 9/9 after adding `test/setup.ts` cleanup | persist + restore, pending memory-only, context precedence, corrupt JSON, clear, subscribe/unsubscribe, S-AUTH-19 redirect, protected render, S-AUTH-18 logout | none |
| T4.3 | `src/views/uilogin/UiLogin.spec.tsx` | Component (jsdom, user-event, fake service) | T4.2 green | suite failed: `./UiLogin` not found | 10/10 | tenants load, S-AUTH-5 (one empty field; all empty), success to step 2 with memory-only result, S-AUTH-6/7/8 table, S-AUTH-20 Enter once, S-AUTH-21 message + traceId, tenants load failure | value-first callbacks; `validateLoginForm` and `toFailure` kept pure and exported |
| T4.4 | `src/views/uicontexto/UiContexto.spec.tsx` | Component (jsdom, user-event, fake service) | T4.3 green | suite failed: `./UiContexto` not found | 12/12 | S-AUTH-9, S-AUTH-10 (clear + reload), required selections, S-AUTH-11 x2, 12, 13, 14, 15, 16 (full session shape + sessionStorage), params failure with traceId, A7 redirect | none |
| T4.5 | `src/App.spec.tsx` | Integration (real store + real mock auth service, `delayMs: 0`) | T4.4 green | suite failed: `./App` not found | 3/3 | guard redirect, full login -> context -> placeholder, disabled account stays on step 1 | `main.tsx` wires store, `composeServices(import.meta.env, {getSession: store.getContext})`, `BrowserRouter`; config errors render as an alert |

Scenario coverage: S-AUTH-11..15 (period.spec + UiContexto.spec), S-AUTH-18/19 (session.spec), S-AUTH-5..8, 20, 21 (UiLogin.spec), S-AUTH-9, 10, 16 (UiContexto.spec).

### Work Unit Evidence
| Evidence | Value |
|---|---|
| Focused test command | `npx vitest run src/domain/period src/session src/views/uilogin src/views/uicontexto src/App`: 5 files, 44 tests passed |
| Runtime harness | See above (http mode, mock on 4020, dev on 5199) |
| Rollback boundary | `src/{session,domain/period*,views/uilogin,views/uicontexto}`, `src/App*`, `src/main.tsx`, `test/setup.ts`, `vite.config.ts` (+1 line), `react-router-dom` in `package.json` |

### Deviations
- **New pinned dependency** `react-router-dom@6.30.6` (exact, same major as codex). Needed for the redirecting guard (S-AUTH-19) and the `/login` -> `/contexto` -> `/` flow. `package-lock.json` +43/-1.
- **View is pure, entry wires the hook.** The RUP diagrams draw `UiLoginView` -> `useUiLoginImpl` -> `UiLogin`; apply follows `jona.md` and the user convention instead: `UiLoginView.tsx` is a pure render, `UiLogin.tsx` is the public entry that calls `useUiLoginImpl(service)` and renders the View. Same for `UiContexto`. Diagram labels for these two nodes should be swapped (View and visual roles).
- **No `useServices()`.** `App` receives `services` and `store` as props and passes `services.auth` to `UiLogin`/`UiContexto`; the Impl hooks receive the service injected and read the session via `useSession()`.
- **Params are loaded on confirm, before the period rules.** The CU-02 flow lists rules then params, but BR-02-2 needs `INICIO_ACTIVIDADES`, which only `params()` provides, so `params()` runs first. Params failure shows the server message and traceId, no session.
- **Step-1 result in the store, memory only.** `sessionStore` holds `pending` (never written to storage) so `getContext()` returns the pending tenant/token for the step-2 requests; `setSession` clears it.
- `test/setup.ts` (+ `setupFiles` in `vite.config.ts`) registers Testing Library `cleanup` because Vitest globals are off.
- `toFailure` (error to message/traceId) lives in `UiLoginImpl.ts` and is reused by `UiContextoImpl.ts`; extract to a shared module if a third view needs it.
- `ShellPlaceholder` (user name only, no logout button) stands in until W1b-2 (T6.5).
- Router future flags set on `BrowserRouter` in `main.tsx`; tests use bare `MemoryRouter` and print the v6 future-flag warnings.

### Files (lines; package-lock.json +43/-1 excluded)
`domain/period.ts` 45, `period.spec.ts` 64; `session/{sessionStore 72, SessionProvider 34, RequireSession 9, session.spec 124}`; `views/uilogin/{InterUiLogin 35, UiLoginImpl 109, UiLoginView 75, UiLogin 10, index 2, UiLogin.spec 143}`; `views/uicontexto/{InterUiContexto 38, UiContextoImpl 131, UiContextoView 72, UiContexto 10, index 2, UiContexto.spec 164}`; `App.tsx` 27, `App.spec.tsx` 61, `test/setup.ts` 5; `main.tsx` +21/-6, `vite.config.ts` +1, `package.json` +2/-1. Total about 1263 changed lines (budget 800, forecast 600; over the 720 guard). Suggested split at a task boundary: 4a = T4.1+T4.2+T4.3 (about 731 lines incl. `package.json`/`vite.config.ts`/`test/setup.ts`), 4b = T4.4+T4.5 (about 532 lines).


## Slice 5 (W1b-1) - branch `feat/softcommerce-w1b-1-shell-domain`

Mode: Strict TDD. Status: T5.1-T5.5 done (commits and PR left to the orchestrator). Gate (from `web_ts/softcommerce`): `npm test` 26 files / 227 tests passed (50 new); `npm run typecheck` exit 0; `npm run build` exit 0 (`AppServicesMock-*.js` 7.23 kB stays the lazy mock chunk; entry `index-*.js` 230.03 kB). No `mock-server` change: `GET /menu` and `GET /forms/{id}/permissions` already existed with core and http specs.

### TDD Cycle Evidence
| Task | Test file | Layer | Safety net | RED observed | GREEN | Triangulate | Refactor |
|------|-----------|-------|------------|--------------|-------|-------------|----------|
| T5.1 | `src/domain/menuTree.spec.ts` | Unit (node) | N/A (new) | suite failed: `./menuTree` not found | 5/5 | S-SHELL-1 two levels, deeper nesting with child before parent, S-SHELL-2 other payload + empty, real seed file, orphan becomes root | none |
| T5.2 | `src/shared/ui/MenuTree/MenuTree.spec.tsx` | Component (jsdom, user-event) | T5.1 green | suite failed: `./MenuTree` not found | 5/5 | S-SHELL-3 toggle open/close with `aria-expanded`, independent nested toggles, leaf callback at any depth, `N` without children is a submenu, other payload | none |
| T5.3 | `src/domain/workspace.spec.ts` | Unit (node) | T5.2 green | suite failed: `./workspace` not found | 12/12 | open new/first/re-select, select known/unknown, S-SHELL-12 middle, last, first, inactive close, close last gives empty, unknown close, S-SHELL-14 reopen | none |
| T5.4 | `src/domain/permissions.spec.ts`, `dialogStack.spec.ts` | Unit (node) | T5.3 green | both suites failed: modules not found | 13/13 | 13 flags order, full parse, strict `=== true` and extras dropped, 5 non-object payloads fail closed; push/pop/top/remove, immutability, duplicate push | none |
| T5.5 | `src/services/ShellServiceHttp.spec.ts`, `mock/AppServicesMock.spec.ts`, `composeServices.spec.ts` | Integration (live mock server) + unit | 59/59 services tests green | 8 failures + `ShellServiceHttp` not found | 74/74 services | shared `shellServiceContract` runs on http and mock (menu, permissions, unknown form, 400/404), wire (url, headers, encoding, malformed payload), vacio keeps shell data, errorServidor 500, composer both modes | `tenantGate` reused in the mock; block bodies |

### Deviations
- **`MenuItem`/`MenuNode` live in `domain/menuTree.ts`** and `InterShellService` imports them (domain stays free of service imports).
- **MenuTree props take the flat payload** (`items`, `onLeafSelect`); the Impl builds the tree with `buildMenuTree` and holds `expandedIds`. The View renders `JButton variant="ghost"` with `min-h-11 sm:min-h-9` floors and inline indent; submenus are `li[role=treeitem][aria-expanded]` (JButton exposes no aria props).
- **Orphans surface as roots**, `pushDialog` ignores a duplicate id, `select`/`close` of an unknown id return the same state: the spec was silent; each is covered by a test.
- **Neighbor rule on close**: the tab that takes the closed slot (next), else the previous.
- **`ShellServiceHttp` parses permissions through `parsePermissions`**, so a malformed payload fails closed even over http. `encodeURIComponent` on the form id.
- Shared test support `services/shellServiceContract.ts` follows `authServiceContract.ts`. No jest-dom in the project, so assertions use plain DOM (`getAttribute`).

### Files (lines)
`domain/{menuTree 31, menuTree.spec 59, workspace 42, workspace.spec 93, permissions 21, permissions.spec 36, dialogStack 22, dialogStack.spec 38}`; `shared/ui/MenuTree/{InterMenuTree 17, MenuTreeImpl 25, MenuTreeView 34, MenuTree 9, index 3, MenuTree.spec 75}`; `services/{InterShellService 13, ShellServiceHttp 13, ShellServiceHttp.spec 39, shellServiceContract 68}`; modified `serviceComposer.ts` +7, `mock/AppServicesMock.ts` +25/-2, `mock/AppServicesMock.spec.ts` +27, `composeServices.spec.ts` +18. Total about 717 changed lines (budget 800, forecast 450).
