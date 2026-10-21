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
