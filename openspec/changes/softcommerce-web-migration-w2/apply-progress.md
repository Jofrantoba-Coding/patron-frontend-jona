# Apply progress: softcommerce-web-migration-w2

Mode: Strict TDD. Store: hybrid. Worktree `D:/Kiro Projects/patron-frontend-jona-worktrees/softcommerce-w2`, app `web_ts/softcommerce`.

## Slice W2-1a (tasks 1a.1 to 1a.9 done, 1a.10 push/PR left to the orchestrator)

Baseline before any change: 51 files / 465 tests green. After: 58 files / 587 tests green; `npm run typecheck` clean; `npm run build` ok (430 modules).

### Commits (branch `feat/softcommerce-w2-1a-registry-core`, based on tracker `feat/softcommerce-w2` = af9c2ca)

| # | Hash | Subject | Tasks | Changed lines |
|---|------|---------|-------|---------------|
| 1 | 52949ee | feat(softcommerce-mock): add catalog registry schema with load validation | 1a.2 | ~250 |
| 2 | 5538232 | feat(softcommerce-mock): auto-register seeds by scope | 1a.3 | ~205 |
| 3 | f9967cd | feat(softcommerce-mock): generic catalog crud with refs, unique and joins | 1a.4-1a.6 | 557 |
| 4 | 384104f | feat(softcommerce-mock): generic routes and registry-driven localidades | 1a.7-1a.8 | 192 |
| 5 | 52486d1 | test(softcommerce): add dual-source registry contract harness | 1a.9 | 167 |

Total 1a (excluding `golden/w1-routes.json`, 14 lines): 1,371 changed lines. Over the 800 budget, so the fallback split applies. Branch pointers created for it:

- `feat/softcommerce-w2-1a-i-registry-schema` at 5538232: commits 1-2, 455 lines (gate: 504 tests, typecheck, build green)
- `feat/softcommerce-w2-1a-ii-generic-core` at 384104f: commits 3-4, 749 lines (gate: 549 tests, typecheck, build green)
- `feat/softcommerce-w2-1a-iii-parity-harness` at 52486d1: commit 5, 167 lines (gate: 587 tests, typecheck, build green)

The documented two-way fallback (1a-i = 1a.2-1a.3, 1a-ii = 1a.4-1a.9) would still be 916 lines, hence three parts.

### TDD cycle evidence

| Task | RED (failing first) | GREEN | REFACTOR / notes |
|------|---------------------|-------|------------------|
| 1a.1 | n/a (preflight) | Baseline gate 51 files / 465 tests green; branch present | W1 goldens captured before touching `app.js` |
| 1a.2 | `schema.spec.ts` failed to load (module missing) | 31 tests green (30 reject rows + 2 accept rows) | typecheck clean |
| 1a.3 | `loadSeed.spec.ts` 4 failed / 1 passed; `seed.spec.ts` suite failed (module missing) | 5 + 3 tests green; full suite 504 | added `/// <reference types="vite/client" />` in `seed.ts` for the node tsconfig |
| 1a.4-1a.6 | `catalog.generic.spec.ts` 24 failed / 1 passed (404 row trivially green) | 25 tests green; W1 `catalog.spec`, routes, parity unchanged and green (549) | test-only expectation fixed once (prefix join keys the id, not the name) |
| 1a.7 | `generic.spec.ts` 4 failed (route slug, read-only, modes, 422 returned 404 because `createApp` ignored `registry`); golden rows already green as baseline | 9 tests green | goldens captured from the untouched W1 server |
| 1a.8 | spec written against the migrated entry (entry already needed by 1a.4 to keep W1 green) | 11 tests green. MUTATION: `max: 99` on `descripcion` in the registry only made 2 tests fail ("keeps the W1 error text", "matches the UI config") naming `localidades.descripcion`; restored | S-REG-2 drift check is a table in the spec |
| 1a.9 | `registryParity.spec.ts`: mock source 17 failed / http 19 passed (mock ignored `registry`/`seed` options) | 38 tests green (19 cases x 2 sources) | no W1 spec file edited |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|------|-------------------------------|-----------------|-------------------|
| 1a.2 | `npx vitest run mock-server/registry` -> 31 passed | N/A: pure load-time validation | `mock-server/registry/{schema,index,presets,sources}.js` + `schema.spec.ts` |
| 1a.3 | `npx vitest run mock-server/http/loadSeed src/services/mock/seed` -> 8 passed | `createApp` over a temp data dir (loadSeed.spec) | `registry/seeds.js`, `http/loadSeed.js`, `core/store.js`, `services/mock/seed.ts` |
| 1a.4-1a.8 | `npx vitest run mock-server src/services` -> 243 passed | Real HTTP server on port 0 (generic.spec, W1 routes.spec, golden) | `core/{catalog,validators,errors}.js`, `registry/catalogs/localidades.js`, `http/app.js` |
| 1a.9 | `npx vitest run test/catalogs` -> 38 passed | Real HTTP server vs in-browser mock, same case table | `test/catalogs/*`, `AppServicesMock.ts` options |

`npm run mock` and `Invoke-RestMethod` were not run: the task forbade a dev server; the HTTP boundary is covered by the in-process server specs above.

### Deviations from tasks.md / design

1. Localidad registry entry landed in commit 3, not 4, because replacing `CATALOGS` in `core/catalog.js` would break the W1 `catalog.spec` otherwise (each commit must stay green). Commit 4 keeps the compat/consistency spec and the MUTATION proof.
2. New file `mock-server/registry/seeds.js` (`collectSeeds`) shared by the Node loader and the browser seed (not in the design file list) and `registry/sources.js` (builtin `empresas` and `ubigeo` ref sources, since they are not registry catalogs).
3. Localidad uses `seed: null` (seeded by the W1 loader from `data/localidades.json`, which stays); schema allows `seed: string | null`.
4. 1a.9 harness added as new files (`test/catalogs/{cases,registryContract}.ts`, `registryParity.spec.ts`) instead of extending `AppServicesMock.spec.ts` / `catalogServiceContract.ts`, to honor "do not edit any W1 test file". `AppServicesMock.ts` gained optional `registry`/`seed` options.
5. In 1a the core emits W1-style English messages for every entry; shared messages/styles (`core/messages.js`), declared-order stop-at-first-failure, `ctx`, `normalize` and `unique.includeEmpresa` are W2-1b as planned. `{rule:...}` steps are accepted by the schema but ignored by the core until a rule exists.
6. Details of new errors carry an additive `code` (`REQUIRED`, `MAX_LENGTH`, `INVALID`, `REF_NOT_FOUND`, `DUPLICATE`).

### Remaining in W2-1a
- 1a.10: push and open PR(s) against the tracker (orchestrator).
