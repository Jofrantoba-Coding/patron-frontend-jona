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

## Slice W2-1b (tasks 1b.1 to 1b.8 done; push/PR left to the orchestrator)

Base: `feat/softcommerce-w2-1a-iii-parity-harness` (52486d1), 58 files / 587 tests. Total 1b: 1,176 changed lines (`git diff --numstat 1a-iii...HEAD`, additions + deletions; no lockfile/seed/golden JSON involved; per-branch sums 781 + 401), over the 800 budget, so split in two consecutive branches (tip branch `feat/softcommerce-w2-1b-session-options` = chain II tip).

### Commits and chain

| Branch (chain order) | Commit | Subject | Tasks | Lines | Gate |
|---|---|---|---|---|---|
| `feat/softcommerce-w2-1b-i-session-shared-rules` (base: W2-1a-iii) | 935bd88 | feat(softcommerce): add session request context headers | 1b.1-1b.2 | 483 | |
| | 8cb00ac | feat(softcommerce-mock): add shared predicates, normalize and messages | 1b.3-1b.5 | 298 | 66 files / 662 tests, typecheck clean, build ok (433 modules); I total 781 |
| `feat/softcommerce-w2-1b-ii-validation-lookups` (base: 1b-i) | 954c368 | feat(softcommerce-mock): declare validation order | 1b.6 | 166 | |
| | 97c0985 | feat(softcommerce): add lookups options endpoint and service | 1b.7-1b.8 | 235 | 69 files / 711 tests, typecheck clean, build ok (434 modules); II total 401 |

### TDD evidence

| Task | RED | GREEN | Notes |
|---|---|---|---|
| 1b.1 | `context.spec.ts` 9 failed / 1 passed (core ctx absent, headers ignored) | 10 tests green; mock-server 163 green | W1 routes and Localidad need no headers |
| 1b.2 | 4 new specs: 9 failed / 2 passed | 130 green in src/session + src/services; full 608 | W1 `session.spec.tsx`, `httpClient.spec.ts`, `composeServices.spec.ts` untouched; new spec files added instead |
| 1b.3-1b.5 | predicates/normalize/messages specs failed to load (modules missing), 2 schema rows failed | 31 + new green; full 662 | |
| 1b.6 | `validation.order.spec.ts` 7 failed / 4 passed | 11 green; one 1a test updated (see deviations) | |
| 1b.7 | `lookups.spec.ts` + `LookupServiceHttp.options.spec.ts` 9 failed | 13 green; optionLabel schema row RED then GREEN | |
| 1b.8 | harness cases are parity of already-green behavior: MUTATION: changed exact match to `includes` in `core/lookups.js`; 3 tests failed (HTTP spec + both sources of the parity case); restored | 66 parity tests (33 cases x 2 sources) | |

### Deviations from tasks.md / design

1. Over 800: split into two branches as above (the dev branch name `feat/softcommerce-w2-1b-session-options` points at the same tip as `-ii-`).
2. W1 test files are not edited, so tasks' "extend httpClient.spec/composeServices.spec/lookupServiceContract" became new files: `httpClient.requestContext.spec.ts`, `composeServices.requestContext.spec.ts`, `sessionStore.spec.ts`, `AppServicesMock.context.spec.ts`, `LookupServiceHttp.options.spec.ts`; `options` parity lives in `test/catalogs` (the W2 harness), not in `lookupServiceContract.ts`.
3. `InterLookupService.options` is required (no W1 fake broke typecheck).
4. `messages.js` exports `fieldMessage(entry, field, code, mode)` and owns the W1 English texts too (moved out of `validators.js`); the server words INSERT/UPDATE only (POST = agregar, PUT = modificar). `label` style uses `msgLabel` as written (fallback: the label); M1/M2 use `su {label}`.
5. `catalog.generic.spec.ts` (a W2-1a test) had a row asserting four details in one 422 for a W2 entry; per D10 it is now one failing step at a time.
6. Schema now also rejects unknown `normalize` steps and an `optionLabel` that names no field (fail-fast, R-REG-4).
7. Options endpoint extras: filter keys accepted are ref fields, `dependsOn.filterKey` and the keys of any consumer `source.where` (the UI forwards the static `where`, `$session.empresa` resolved by the server); any other key is 400 `INVALID_FILTER`; `optionLabel` defaults to `descripcion`; builtin sources (`empresas`, `ubigeo`) are not served by this route.
8. Core context: `usuario` stamp is stored as a number when numeric, `id_empresa` as the header string; stamps apply on create and update; empresa-scope entries also stamp `id_empresa` without listing it; `includeEmpresa` unique and ref targets of empresa scope are session-limited.
9. `X-User-Id` is also sent after step 1 (pending login) because the user is known then; `getContext()` is unchanged.

### Deferred / not done
- `{rule}` steps still ignored by the core (no rule exists yet).
- Predicates are not yet consumed by validators (server conditional rules land in W2-9.2).
- Runtime harness (`npm run mock`) not run: no dev server allowed; HTTP boundary covered by in-process server specs.
- 1b.8 "open PR" left to the orchestrator.

## Slice W2-2 (tasks 2.1 to 2.8 done; push/PR left to the orchestrator)

Base: `feat/softcommerce-w2-1b-ii-validation-lookups` (97c0985), 69 files / 711 tests. Tip: 82 files / 965 tests; `npm run typecheck` clean; `npm run build` ok (454 modules). Total W2-2 (excluding the six seed JSON files): 1,342 changed lines, over the 800 budget, so split into three consecutive branches (the dev branch `feat/softcommerce-w2-2-ui-catalog` points at the chain III tip).

### Commits and chain

| Branch (chain order) | Commit | Subject | Tasks | Lines | Gate |
|---|---|---|---|---|---|
| `feat/softcommerce-w2-2-i-registry-ui-adapter` (base: W2-1b-ii) | d73ac2d | feat(softcommerce): add registry ui adapter, code field and mode gating | 2.1, 2.3 | 502 | 75 files / 739 tests, typecheck clean, build ok (434 modules) |
| `feat/softcommerce-w2-2-ii-validation-ucatalog` (base: I) | 08489e3 | feat(softcommerce): add declared-order validation and field-error mapping | 2.4 | 248 | |
| | 3422154 | feat(softcommerce): add UiCatalog unit and registry-derived form registry | 2.5, 2.2 | 247 | 80 files / 764 tests, typecheck clean, build ok (441 modules); II total 495 |
| `feat/softcommerce-w2-2-iii-text-catalogs` (base: II) | 870754f | feat(softcommerce-mock): list the Wave 2 reference catalogs in the menu and grant their permissions | menu/permissions rows of 2.6-2.7 | 28 | |
| | 3256f65 | feat(softcommerce): add aduanas, colores, estados-documento, laboratorios, marcas and nacionalidades catalogs | 2.6, 2.7, 2.8 | 317 | 82 files / 965 tests, typecheck clean, build ok (454 modules); III total 345 |

### TDD evidence

| Task | RED | GREEN | Notes |
|---|---|---|---|
| 2.1 | `registry.spec.ts` and `menuPermissions.spec.ts` failed to load (modules missing) | 57 green incl. W2-1a schema/compat | drift checker moved to `test/catalogs/drift.ts` (compat spec reuses it) |
| 2.3 | 14 failed / 2 passed across `toolbarGate.modes`, `normalize.registry`, `UiCrudRegister.code`, `UiCrudList.modes` | 739 full suite | new spec files because W1 specs stay untouched |
| 2.4 | 9 failed + `serverErrors.spec` failed to load | 754 full suite | focus after a server error runs in an effect once the confirm pane is gone |
| 2.5 / 2.2 | `UiCatalog.spec` and `formRegistry.registry.spec` failed to load | 764 full suite | S-REG-1 minimal entry runs on the in-browser mock AND the HTTP server |
| 2.6-2.7 | `reference.spec.ts` (85 cases x 2 sources + 10 registry/desktop guards) + `registry.ui.spec.tsx`: entries missing, per-slug rows failed with unknown catalog | 965 full suite | MUTATION: preset `descripcion` max 100 -> 99 made 6 desktop-fact rows fail naming slug.field; restored |
| menu rows | 6 failing W1 menu-pinned assertions (7 nodes) | 965 | see deviation 1 |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 2.1/2.3 | `npx vitest run src/catalogs src/domain/crud src/views/uicrudregister src/views/uicrudlist test/catalogs/menuPermissions.spec.ts` green | RTL over real `UiCrudList`/`UiCrudRegister`, in-browser mock | `src/catalogs/registry.ts`, `CatalogConfig.ts`, toolbarGate/normalize/validate edits, register View code branch |
| 2.4 | `npx vitest run src/domain/crud src/views/uicrudregister` 71 passed | RTL register dialog with a failing service | `serverErrors.ts`, `validate.ts` rules param, register Impl catch |
| 2.5/2.2 | `npx vitest run src/views/uicatalog src/views/uishell` 39 passed | `UiCatalog` over the in-browser mock and over a real HTTP server (jsdom + node fetch) | `src/views/uicatalog/*`, `formRegistry.ts` |
| 2.6-2.8 | `npx vitest run test/catalogs src/catalogs` green | Same case table against the HTTP server (loadSeed of the real data dir) and the in-browser mock | six `registry/catalogs/*.js`, `reference.js`, six `data/catalogs/*.json`, `registry/index.js` |

`npm run dev` / `npm run mock` not run (no dev server allowed).

### Deviations from tasks.md / design

1. **W1 menu-pinned assertions edited (needs orchestrator decision).** Adding the catalog nodes to `menu.json` (R-REG-1, R-REG-9, tasks 2.6-2.7) broke four W1 assertions that pin the seeded menu at exactly 7 nodes: `mock-server/core/auth.spec.ts`, `src/services/shellServiceContract.ts` (used by `ShellServiceHttp.spec` and `AppServicesMock.spec`), `src/services/mock/AppServicesMock.spec.ts`, `src/domain/crud/menuTree.spec.ts`. They now compare to the seed (`menuSeed.length`, ids, the extra leaves of node 2) so later slices need no further edit. Isolated in commit 870754f; W1 code behavior is unchanged. The plan listed only the `miTipoCambio` exception, so this was an oversight (the menu is a pinned seed). If rejected: drop 870754f and the `menu` attribute on the entries, losing R-REG-9 for W2-2.
2. W1 spec files otherwise untouched: tasks that said "extend `toolbarGate.spec.ts`, `UiCrudRegister.spec.tsx`, `validate.spec.ts`, `formRegistry.spec.ts`" became new files (`toolbarGate.modes.spec.ts`, `UiCrudRegister.code.spec.tsx`, `UiCrudRegister.serverErrors.spec.tsx`, `validate.registry.spec.ts`, `serverErrors.spec.ts`, `formRegistry.registry.spec.tsx`, `UiCrudList.modes.spec.tsx`).
3. Three W2-1a tests adjusted because real catalogs now exist: `localidades.compat.spec.ts` (only `compat` entries use the hand-written Localidad config; drift helper shared), `seed.spec.ts` (W1 keys plus one section per registry catalog), `loadSeed.spec.ts` (test slugs renamed to `cosas/divisas/jornadas`, empty registry for the W1-keys row, recursive `mkdir`); `registryContract.ts` takes an optional case table.
4. Commit plan merged/reordered: 2.1 + 2.3 in one commit (the `code` kind needs the View/validate branches to typecheck); 2.5 + 2.2 together (formRegistry needs the unit); 2.6 + 2.7 + 2.8 in one commit (the generated case table and the guard enumerate all six).
5. `codec.ts` not created: text/code need no per-kind codec yet (`normalize.ts` strips the code and applies the registry steps); it lands with W2-3 (boolean). UI and both mocks share `core/normalize.js` and `core/messages.js`.
6. `codeWidth`: no SQL in the repo, so the width is inferred. Evidence: `PanelTFLaboratorio`/`PanelTFMarca` pad the code filter to 3 and `PnlCotizacion` compares estado ids `"001"`..`"008"`. All six use 3; aduanas/colores/nacionalidades have no direct evidence (flagged for W6).
7. `id_usuario`: all six desktop DAOs pass the session user to the stored procedure on insert/update/delete, so every entry has `stamp: ['id_usuario']` (writes need `X-User-Id`).
8. R-REG-3 for refs/unique/joins: none of the six catalogs has them and the UI config has no consumer yet, so the UI/mock drift check covers kind, required, max, columns and the code field; refs/unique/joins parity between the two mocks stays covered by the W2-1 harness entries. The UI half extends with W2-5.
9. `src/catalogs/registry.ts` pulls `mock-server/registry` and `core/{messages,validators,normalize}` into the entry chunk (index 303.86 kB); they are pure and small.
10. Client validation for registry configs stops at the first failing step (D10); Localidad (no `entry`) keeps the W1 all-errors path. Server error mapping (R-CRUD-7) applies to every config, Localidad included; no W1 spec depended on the old form-level text.
11. Fixed desktop texts: `Pais` (no accent) label of laboratorios and `Descripcion` in messages are the desktop spellings; the menu leaf is "Estado del Documento" (desktop dialog title); formIds are the desktop menu names (`miAduana`, `miColor`, `miEstadoDocumento`, `miLaboratorioClinico`, `miMarca`, `miNacionalidad`).
12. Small additions: `menu` attribute validated by the schema (needs `formId`, `parent`, `label`), `referenceCatalog()` factory in `registry/catalogs/reference.js` (the six entries are one-liners), preset `descripcion`.

### Deferred
- Push and PR creation for the three branches (orchestrator).
- Confirmation of the three inferred `codeWidth` values (W6).
- S-REF-39 baseline: the six catalogs render only their declared fields (asserted by `registry.ui.spec.tsx`); the excluded-UI rows for SubFamilia/TipoCambio/UnidadMedida/Vehiculo come with those slices.

## Slice W2-3 (tasks 3.1 to 3.6 done; push/PR left to the orchestrator)

Base: `feat/softcommerce-w2-2-iii-text-catalogs` (3256f65), 82 files / 965 tests. Tip: 96 files / 1,309 tests; `npm run typecheck` clean; `npm run build` ok (478 modules). Total W2-3 (excluding `mock-server/data/**`): 1,369 changed lines, over the 800 budget, so split into two consecutive branches (the dev branch `feat/softcommerce-w2-3-boolean-options` points at the chain II tip).

### Commits and chain

| Branch (chain order) | Commit | Subject | Tasks | Lines | Gate |
|---|---|---|---|---|---|
| `feat/softcommerce-w2-3-i-boolean-estado` (base: W2-2-iii) | eddbc55 | feat(softcommerce): add boolean field and estado preset | 3.1, 3.2 | 668 | |
| | f992a66 | feat(softcommerce): add motivos-traslado and clasif-clientes catalogs | 3.4 | 130 | 92 files / 1101 tests, typecheck clean, build ok (465 modules); I total 798 |
| `feat/softcommerce-w2-3-ii-options-catalogs` (base: I) | 3b1a5ce | feat(softcommerce): add options field and option columns | 3.3 | 447 | |
| | 3fd68dc | feat(softcommerce): add clasif-inventarios, tamanos, tipos-anexo and tipos-descuento catalogs | 3.5, 3.6 | 132 | 96 files / 1309 tests, typecheck clean, build ok (478 modules); II total 579 |

Commit order differs from tasks.md ((2) options before (3) catalogs): the two boolean catalogs only need the boolean field, so they ride with branch I and keep it under 800.

### TDD evidence

| Task | RED | GREEN | Notes |
|---|---|---|---|
| 3.1/3.2 server + registry | `schema.behavior.spec.ts` 4 failed / `catalog.defaults.spec.ts` 2 failed (no default, no `estado` preset, no `readOnlyOn`/column type checks) | 8 green | `withDefaults` on create (scalar or INSERT entry of a per-mode map) |
| 3.1 BooleanField / codec / modeDefaults | specs failed to load (modules missing) | codec 6, modeDefaults 8, BooleanField 5 | |
| 3.1/3.2 UI | `listView.format` 4, `UiCrudList.format` 2, `UiCrudRegister.boolean` 6 failed | 36 files green in the focused run, then full suite | MUTATION: `type === 'bool'` -> `'boolx'` in `registry.ts` failed `registry.boolean.spec`; restored |
| 3.4 | reference.spec: 7 failed + suites failing at load (slugs missing) | 92 files green | MUTATION: estado preset `default: {}` failed 4 tests (config, UI, both mocks); restored |
| 3.3 | `OptionsField.spec` failed to load; register/schema/modeDefaults/registry rows 15 failed | 43 files / 315 tests focused, then 95 / 1128 | MUTATION: dropping `_label` columns from the list filter keys failed "the filter matches the label"; restored |
| 3.5 | suites failed to load (slugs missing) | 96 files / 1309 | MUTATIONS: abrev max 5 -> 6 failed 2 desktop-fact rows + S-MOCK-17 rows; tipo options `S` -> `X` failed 4 rows; options membership check disabled in `validators.js` failed 4 rows (clasif-inventarios Z, registryParity things); all restored |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 3.1/3.2 | `npx vitest run src/domain/crud src/shared/ui/BooleanField src/views/uicrudlist src/views/uicrudregister mock-server/registry mock-server/core` -> 36 files green | RTL over real `UiCrudRegister`/`UiCrudList`, in-browser mock | `shared/ui/BooleanField`, `domain/crud/{codec,modeDefaults}.ts`, preset `estado`, `catalog.js withDefaults`, schema checks |
| 3.3 | `npx vitest run src/shared/ui/OptionsField src/views/uicrudregister src/views/uicrudlist src/catalogs` -> green | RTL | `shared/ui/OptionsField`, schema `assertOptions`, register View branch |
| 3.4/3.5 | `npx vitest run test/catalogs src/catalogs` -> 10 files / 564 tests | Same case table against the HTTP server (real data dir) and the in-browser mock | six `registry/catalogs/*.js`, six `data/catalogs/*.json`, menu/permissions rows, `registry/index.js` |

`npm run dev` / `npm run mock` not run (no dev server allowed).

### Deviations from tasks.md / design

1. **S-MOCK-17 vs D10.** The scenario says `abrev` of 6 chars + blank `descripcion` returns details naming both fields; D10 (and the implemented core, plus the existing `D10 a W2 entry reports only the first failing step` case) stop at the first failing step. Cases follow D10: blank descripcion + long abrev -> 422 on `descripcion` only; valid descripcion + long abrev -> 422 on `abrev`. The spec text needs aligning (R-MOCK-10 still says "every failing field").
2. **Commit order / chain**: see above; two branches because the slice is 1,369 lines.
3. **codeWidth** (read at apply time): clasif-clientes and tipos-descuento load integer beans (`String.valueOf(int)`, `Integer.parseInt`) so their codes print unpadded (`codeWidth: 0`, seeds `"1"`, `"2"`); motivos-traslado, tamanos and tipos-anexo pad to 3 (`PanelTF*.focusLost` "000" + substring); clasif-inventarios has a string id with no pad evidence, so 3 is inferred (flag for W6). `referenceCatalog()` gained a `codeWidth` parameter.
4. **id_usuario**: all six DAOs pass the session user (`usuario.getId_usuario()`) on insert/update/delete, so all six store `stamp: ['id_usuario']`. `RegisterTamano` also passes `usuario.getCodempresa()` on insert; the spec lists tamanos as tenant scope, so no empresa scope was added (flag for the orchestrator/W6).
5. **estado is not `activo`**: `estado` (desktop A/D) is a separate stored boolean beside the logical-delete flag; rows with `estado: false` stay in the list (S-REF-7 case).
6. **Desktop facts and fixed texts**: required messages are M1 with `su Descripcion` (no accent, as the desktop); `abrev` of clasif-inventarios and `abreviatura` of tipos-anexo say `su Abreviatura`, tipos-descuento says `su Abrev` ([DEVIATION], the desktop says "Descripcion"), tipo of clasif-inventarios says `su Tipo de Movimiento`. Entities with fixed gender: `un Motivo Traslado`, `un Tamano`, `un Tipo Anexo` ([DEVIATION] rows: the desktop says `una Tipo Anexo` for both motivos-traslado and tipos-anexo, `una Tamano` for tamanos).
7. **formIds / menu**: `miMotivoTraslado`, `miClasifCliente`, `miClasifInventario`, `miTamano`, `miTipoDescuento` come from `MenuBarSystemDinamico.java`; `miTipoAnexo` is not in the dispatcher, so that formId is a proposal. Menu labels are the register titles (`Clasificacion Cliente`, `Tipo de Movimiento de Inventario`, ...). Ids 14-19 under Generales (2).
8. **Radio display for tipo** (`display: 'radio'`), as the desktop's Entrada/Salida radio buttons; `JRadioButton` (jona-ui 1.5.1) carries the 44px floors on its label.
9. **Existing W2-2 test edited**: `registry.spec.ts` used `boolean` as its "unsupported kind" example; it now uses `number` (W2-4). `reference.cases.ts`/`reference.spec.ts` generalized (`referenceEntries`, `valid` includes required options, update id from the seed). No W1 spec edited.
10. **Process slip**: one `git checkout -- src/views/uicrudlist/UiCrudListImpl.ts` was run to undo a throw-away mutation of an unmodified committed file; nothing uncommitted was lost, and it will not be repeated.
11. Server default for omitted fields: create applies the scalar `default` or the INSERT entry of a per-mode map (needed so a client that omits `estado` stores `true`); updates never re-apply it.
12. New schema checks: `readOnlyOn`/per-mode `default` modes, column `type` (only `bool` for now), options `display` (default `select`), unique option values, defaults inside the list, `<name>_label` columns must name an options field.

### Deferred
- Push/PRs (orchestrator). Confirmation of `miTipoAnexo`, clasif-inventarios `codeWidth`, tamanos empresa scope (W6).
- `codec.ts` covers boolean and options only; number/date/select arrive with their slices.

## Slice W2-4 (tasks 4.1 to 4.6 done; push/PR left to the orchestrator)

Base: `feat/softcommerce-w2-3-ii-options-catalogs` (3fd68dc), 96 files / 1,309 tests. Tip: 103 files / 1,554 tests; `npm run typecheck` clean; `npm run build` ok (491 modules). Total W2-4 (excluding `mock-server/data/catalogs/*.json`): 960 changed lines, over the 800 budget, so split into two consecutive branches (the dev branch `feat/softcommerce-w2-4-integer` and `-ii-` both point at the chain II tip).

### Commits and chain

| Branch (chain order) | Commit | Subject | Tasks | Lines | Gate |
|---|---|---|---|---|---|
| `feat/softcommerce-w2-4-i-integer-field` (base: W2-3-ii) | e6293db | feat(softcommerce): add integer number field and padLeft | 4.1, 4.2, 4.3 | 632 | 102 files / 1365 tests, typecheck clean, build ok (483 modules) |
| `feat/softcommerce-w2-4-ii-integer-catalogs` (base: I) | 6cdc413 | feat(softcommerce): add condiciones-pago, tipos-trabajador and marcas-vehiculo catalogs | 4.4 | 204 (+ seeds/menu/permissions) | |
| | e37bdd6 | feat(softcommerce): add turnos catalog | 4.5, 4.6 | 124 (+ seed) | 103 files / 1554 tests, typecheck clean, build ok (491 modules); II total 328 excluding seed JSON |

### TDD evidence

| Task | RED | GREEN | Notes |
|---|---|---|---|
| 4.1-4.3 | 6 new specs failed (31 tests): NumberField, normalize.padLeft, validate.integer, UiCrudRegister.integer, validators.integer (server), schema.integer | all green; full suite 102 files / 1365 | `registry.spec` "unsupported kind" example moved from `number` to `date` |
| 4.4 | reference.spec/registry.integer.ui.spec failed (slugs missing, 11 UI tests + load failures) | 103 files / 1510 | |
| 4.5 | same table rows for turnos | 103 files / 1554 | MUTATION: hora range max 12 -> 13 failed 8 tests; swapping the declared order of the blank/range steps failed 2 tests; both restored |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 4.1-4.3 | `npx vitest run src/shared/ui/NumberField src/domain/crud src/views/uicrudregister mock-server/core mock-server/registry` green | RTL over the real `UiCrudRegister` and in-browser mock; server core specs | `shared/ui/NumberField`, `codec/normalize/validate.ts`, schema `assertNumber` + `{range}` step, `validators.js` |
| 4.4/4.5 | `npx vitest run test/catalogs src/catalogs` green | same case table against HTTP server and in-browser mock | four `registry/catalogs/*.js`, four seeds, menu/permissions rows, `index.js` |

`npm run dev` / `npm run mock` not run (no dev server allowed).

### Deviations from tasks.md / design

1. **Not `JNumberInput`.** The design says the integer field sits on jona-ui `JNumberInput`, but that component is `type="number"` with a `number | null` value (a padded `05` cannot be shown) and its `max` is a numeric clamp, not a digit count. `NumberField` is built on `JTextBox` (`inputMode="numeric"`, digits-only filter, whole-edit overflow rejection like `UppercaseTextField`), with `min-h-11 sm:min-h-9`. Spec behavior (S-CRUD-25, S-CRUD-35, S-REF-12) is met.
2. **Value range attribute.** At scale 0 `max` is the digit count (R-CRUD-11, S-CRUD-25), so the value range is a new `range: {min, max}` attribute, which requires `messages.range` (load check). A new `{range: field}` validation step lets an entry check "all blanks, then ranges" (Turno, R-REF-7); without it a field checks its range with itself.
3. **Wire type.** A plain integer (`dias_pago`) is sent as a number; a padded one (`hora`, `minuto`) stays the padded string (`05`), as the desktop stores it. The server accepts both and pads.
4. **Blur normalization is generic.** `blurNormalize` pads any text or integer field with a `padLeft` step (S-CRUD-35); no current text field uses it, covered by a test-only config. `InterUiCrudRegister` gained `onFieldBlur`.
5. **codeWidth** (read at apply time): turnos `id_turno` is an int (`getInt`, `parseInt`) so 0; condiciones-pago, tipos-trabajador and marcas-vehiculo have string ids with no pad evidence in `Register*`, `Pnl*` or the DAOs, so 3 is inferred (flag for W6).
6. **id_usuario**: condiciones-pago, tipos-trabajador and marcas-vehiculo store it. **turnos does not** (`DaoTurno.mantTurno` takes no user), so `stamp: []`; `referenceCatalog` gained `stamp`, `style`, `descripcion` (override or `false`) and `validation` parameters; the generic cases skip the stamp rows when the entry has no stamp.
7. **Empresa scope audit input for 5.6b**: `RegisterMarcaVehiculo` passes `usuario.getCodempresa()` on insert/update/delete although its list passes `''`; kept `tenant` as in R-REF-5 and flagged for the audit.
8. **Messages**: Turno and the M2 catalogs follow the spec text `Para {modo}, debes ...` (the desktop has a stray space before the comma in Turno and MarcaVehiculo). condiciones-pago keeps the accents (`Descripción`, `Condición de Pago`); `abreviatura` of tipos-trabajador is labelled `Abrev`.
9. **Turno list columns** are hora, minuto, tipo and estado (the desktop joins them as `hh:mm tipo` in one TURNO column; the registry has no composed column).
10. **formIds / menu** from `MenuBarSystemDinamico.java`: `miCondicionPago`, `miTipoTrabajador`, `miMarcaVehiculo`, `miTurno`; ids 20-23 under Generales (2).
11. **Existing W2 tests edited**: `registry.spec.ts` (unsupported kind example), `registry.ui.spec.tsx` (entity text via `descripcionText`, Turno has no descripcion), `reference.cases.ts`/`reference.spec.ts`/`drift.ts` generalized. No W1 spec edited.

### Deferred
- Push/PRs (orchestrator). Confirmation of the three inferred `codeWidth` values (W6). Empresa-scope audit of marcas-vehiculo (5.6b). Decimal numbers (scale > 0) arrive in W2-7 (the UI adapter throws for them).

## Slice W2-5 (tasks 5.1 to 5.7 including 5.6b done; push/PRs left to the orchestrator)

Base: `feat/softcommerce-w2-4-ii-integer-catalogs` (e37bdd6), 103 files / 1,554 tests. Tip: 109 files / 1,901 tests; `npm test` green, `npm run typecheck` clean, `npm run build` ok (508 modules). Total W2-5 (excluding `mock-server/data/**` JSON): ~819 changed lines, over the 800 budget, so split into two consecutive branches (the dev branch `feat/softcommerce-w2-5-catalog-select` and `-ii-` both point at the chain II tip).

### Commits and chain

| Branch (chain order) | Commit | Subject | Tasks | Lines (excl. data JSON) | Gate |
|---|---|---|---|---|---|
| `feat/softcommerce-w2-5-i-catalog-select` (base: W2-4-ii) | ceb3348 | feat(softcommerce): add catalog select and joined columns | 5.1, 5.2 | 332 | |
| | d88ac78 | feat(softcommerce): add familias-sunat read-only lookup | 5.4 | 105 (+ seed) | |
| | b131b64 | feat(softcommerce): add motivos-descuento, motivos-nc and tipos-trabajador-perfil catalogs | 5.5 | 230 (+ seeds) | 109 files / 1742 tests, typecheck clean, build ok (504 modules); I total 665 (675 with menu/permissions) |
| `feat/softcommerce-w2-5-ii-empresa-scope` (base: I) | abadcf4 | feat(softcommerce): add familias and modelos-vehiculo and audit the empresa scope | 5.3, 5.6, 5.6b, 5.7 | 154 (+ seeds/menu/permissions) | 109 files / 1917 tests, typecheck clean, build ok (508 modules) |
| | 31d6961 | fix(softcommerce): stamp the empresa on tamanos and modelos-vehiculo writes without scoping their lists | scope decision | included in the II total of 154 | 109 files / 1901 tests, typecheck clean, build ok (508 modules) |

### TDD evidence

| Task | RED | GREEN | Notes |
|---|---|---|---|
| 5.1 | `CatalogSelect.spec` (6) and `UiCrudRegister.select.spec` (5) failed (module missing, `lookup[field.lookup] is not a function`); `registry.select.spec` (2) failed ("the UI does not support kind select yet") | all green; 107 files / 1571 | `codec.ts` needed no change: a select is already a plain id string both ways |
| 5.2 | none possible: the list already renders any column key | MUTATION: `filterKeys` cut to the first three columns -> "typing the joined name narrows the rows" failed; restored | a schema check "column must be a field, label or join alias" was tried and dropped: it broke 7 W2-1a test fixtures whose columns name no field |
| 5.4 | `lookups.spec` failed (Unknown catalog) | 17 tests green, full 108 files / 1589 | MUTATION: removing `readOnly` failed 9 of 17 |
| 5.5 | 6 failures (3 slugs missing, refs table, UI spec) | 109 files / 1742 | MUTATION: dropping the perfil `where {estado:true}` and pointing the motivos-descuento ref at another catalog each failed 6 tests; both restored |
| 5.3, 5.6, 5.6b | 4 failures (familias, modelos-vehiculo, SCOPE table) | 109 files / 1917 | MUTATION: tamanos back to tenant and marcas-vehiculo without the empresa stamp each failed the SCOPE audit row (1 test); both restored. The generated empresa rows follow the entry, so the audit table is what pins each decision |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 5.1-5.2 | `npx vitest run src/shared/ui/CatalogSelect src/views/uicrudregister src/views/uicrudlist src/catalogs` green | RTL over the real `UiCrudRegister` with a fake `lookup.options`; list over the real grid | `shared/ui/CatalogSelect`, select branch in `UiCrudRegisterImpl/View`, `registry.ts` select kind, `CatalogConfig` select `source` |
| 5.4 | `npx vitest run test/catalogs/lookups.spec.ts` (17) green | same table against the HTTP server and the in-browser mock | `registry/catalogs/familias-sunat.js`, its seed, `index.js` line |
| 5.5 | `npx vitest run test/catalogs src/catalogs` green | same case table against both mocks, plus the register form | three entries, seeds, menu/permissions rows, `reference.js` `joins` |
| 5.3, 5.6, 5.6b | `npx vitest run test/catalogs src/catalogs` green (977) | both mocks with `X-Empresa-Id` / `X-User-Id` | familias, modelos-vehiculo, the `scope`/`stamp` lines of colores, marcas, tamanos, marcas-vehiculo and their seeds |

`npm run dev` / `npm run mock` not run (no dev server allowed).

### Empresa-scope audit (5.6b): catalog -> DAO evidence -> scope decided

| Catalog | DAO / caller evidence | Decided |
|---|---|---|
| colores | `DAOColor.listar/insertar/modificar/eliminar` all take the empresa; `PanelTFColor` and `RegisterColor` pass `usuario.getCodempresa()` | `empresa` (moved from tenant) |
| marcas | `DAOMarca.listar/insertar` take it (`PanelTFMarca`, `RegisterMarca` pass the empresa); `modificar/eliminar` do not | `empresa` (moved; partial: update/delete are by code) |
| tamanos | `DAOTamano.insertar` takes it (`RegisterTamano` passes it); `listar` takes it but `PanelTFTamano` passes `""`; `listarGeneral(ls_IdEmpresa)` **ignores its parameter (sends null)**; `modificar/eliminar` do not | `stamp ['id_usuario','id_empresa']`, no scope (orchestrator decision after the evidence; first landed as `empresa`) |
| familias | `DAOFamilia.listar` and `mantFamilia` take the empresa (`RegisterFamilia`, `PanelTFFamilia`); the bean never sets the user | `empresa`, `stamp: []` |
| modelos-vehiculo | `DaoModeloVehiculo.mantModeloVehiculo` takes the empresa (`RegisterModeloVehiculo` sets it); `listarModeloVehiculo` sends `""` | `stamp ['id_usuario','id_empresa']`, no scope (orchestrator decision; deviates from R-REF-5 `scope=empresa`, spec to align; first landed as `empresa`) |
| marcas-vehiculo | writes `bean.setId_empresa(usuario.getCodempresa())`; `listarMarcaVehiculo("", "")` | `stamp ['id_usuario','id_empresa']`, no scope: writes record the empresa from the header, list stays tenant-wide (supported by `stampsOf`/`usesEmpresa`, no core change) |
| aduanas, estados-documento, laboratorios, nacionalidades, motivos-traslado, clasif-clientes, clasif-inventarios, tipos-anexo, tipos-descuento, condiciones-pago, tipos-trabajador, turnos, motivos-descuento, motivos-nc, tipos-trabajador-perfil | `grep -i empresa` finds nothing in their DAOs and the Register/panel calls pass none | `tenant` (unchanged) |

### Deviations from tasks.md / design

1. **Two branches** (813 lines): see the chain table. 5.3 (named S-MOCK-26/27/36 rows) and 5.6b share the table machinery of 5.6 (`reference.cases.ts` generates the empresa rows from the entry), so they ship in the final commit with familias and modelos-vehiculo instead of commit (2).
2. **No `CatalogSelect` loading logic.** The component is presentational (options in, id out); the lookup load, the static `where` forwarding and the failure behavior live in `UiCrudRegisterImpl` (`loadSelectOptions`), as the existing register already did for W1 selects. The FieldConfig `select` variant gained an optional `source: {catalog, where}` beside the W1 `lookup`; `where` values are sent as strings (`estado: true` -> `'true'`).
3. **Placeholder** `--- Seleccione ---` is the CatalogSelect default (the desktop text); the W1 JComboBox select keeps `Seleccione`.
4. **5.2 had no code change**; only the spec and a MUTATION proof (see above).
5. **familias-sunat** (read from `RegisterFamilia`, `LoadComboItem.loadComboFamiliaSunat`): the desktop combo shows only the **description** and keeps the SUNAT code as the value, so the code is the id and the description the option name (no "code - description" text). The 5 seeded codes (4-digit UNSPSC-style families) are demo data; `subfamilias-sunat` in W2-6 must relate to them by `codigo_familia_sunat`.
6. **codeWidth** (read at apply time): motivos-descuento and tipos-trabajador-perfil load int beans (0); motivos-nc (`PanelTFMotivoNC.focusLost` "000") and familias (`PanelTFFamilia.focusLost` "000") pad to 3; modelos-vehiculo has a string id with no pad evidence, 3 inferred (flag for W6).
7. **id_usuario**: motivos-nc, tipos-trabajador-perfil and modelos-vehiculo store it; **motivos-descuento does not** (`mantMotivoDescuento` takes no user, `stamp: []`) and **familias does not** (the bean never sets it).
8. **Messages**: the desktop texts of motivos-descuento (abrev says "Descripcion", tipo empty), motivos-nc (entity "una MotivoNotaCredito", tipo says "Familia"), tipos-trabajador-perfil ("una ," and "Departamento") are worded for the real entity and field ([DEVIATION] rows). motivos-nc and tipos-trabajador-perfil selects use M1 `especificar su Tipo` / `su Tipo Trabajador` (not MS, which the spec table does not ask for).
9. **formIds / menu** from `MenuBarSystemDinamico.java`: `miMotivoDescuento`, `miMotivoNotaCredito`, `miTipoTrabajadorPerfil`, `miFamilia`, `miModeloVehiculo`; ids 24-28 under Generales (2). Titles are proposals where the desktop shows none ("Motivo de Nota de Credito", "Tipo Trabajador Perfil").
10. **tipos-trabajador-perfil "active only"** means `estado` A (the desktop lists `listarTipoTrabajador("", "A")`), implemented as the static `where {estado: true}`; a logically deleted tipo is rejected too.
11. **Existing W2 tests edited** (no W1): `drift.ts` (lookup falls back to the slug as formId; select sources compared), `reference.spec.ts` (shared lookups exempt from the demo-only seed row), `reference.cases.ts`/`registry.ui.spec.tsx` generalized (ref ids, empresa context, `DESCRIPCION_NOT_FIRST`).
12. **Mixed model for marcas-vehiculo** needs no schema or core change: `stamp: ['id_usuario','id_empresa']` without `scope` already stamps the empresa and leaves the list tenant-wide. Side effect: an UPDATE re-stamps the empresa with the session one (the desktop update passes it too).

### Deferred
- Push/PRs (orchestrator). Confirmation of the modelos-vehiculo `codeWidth`, the `shared` scope of familias-sunat, R-REF-4 and R-REF-5 (tamanos and modelos-vehiculo say scope=empresa, now stamp-only) to align with the desktop, and the menu titles (W6).


## W2-6: dependent engine, cascade rebuilt (tasks 6.1-6.7) - DONE, two branches

Base `feat/softcommerce-w2-5-ii-empresa-scope` (31d6961). The slice is ~1,095 changed lines (excluding seed/data JSON), over the 800 budget, so it ships as two consecutive branches split at the task boundary 6.3/6.4.

| # | Branch | Commits | Tasks | Lines (+/-, excl. JSON) |
|---|---|---|---|---|
| I | `feat/softcommerce-w2-6-i-dependent-engine` (alias `feat/softcommerce-w2-6-dependent-engine`, same tip) | cd16388 `refactor(softcommerce): extract dependent chain engine`; d23e94f `refactor(softcommerce): rebuild cascade select on the engine` | 6.1-6.3 | 722 / 46 = 768 |
| II | `feat/softcommerce-w2-6-ii-via-subfamilias` (base I) | 11143d6 `feat(softcommerce-mock): add via filters and ubigeoChildren rule`; 74e9b90 `feat(softcommerce): add subfamilias catalog` | 6.4-6.7 | 306 / 21 = 327 (+ 6 menu/permissions JSON, + 134 seed JSON lines) |

Gate: I = 113 files / 1935 tests, typecheck, build green (baseline 109 / 1901). II = 114 files / 2044 tests, typecheck, build green.

### Decisions
- **Engine** (`src/shared/dependentChain.ts`): framework-free `createDependentChain(nodes, load, onUpdate)` + `fieldsToClear`. A node is `{name, parents:[{field,filterKey}], clearsOnChange?}`; blocked until every parent has a value; latest-token guard per node; a parent change or retry clears a failure at once. The register clears levels below a changed select with `fieldsToClear`; each `DependentSelect` is one node (parents outside it); `CascadeSelect` is N chained nodes (`filterKey` `parent`).
- **CascadeSelect** keeps every export and prop; adds an optional static `filter` (second argument of `loadChildren`, only when given). W1 `CascadeSelect.spec`, Localidad specs unchanged and green. MUTATION (stale guard removed): 7 specs fail (engine, DependentSelect, W1 S-LOC-10 x3); restored.
- **Server `via`**: `lookupFilters.<key>.via {catalog,key,as}`: the filter value is the id of a row of `catalog`; the options are the rows whose `as` equals what that row holds in `key`; none when the row is missing or holds nothing. Shared helper `viaValue` in `validators.js`, also used by the ref belongs-to check (a ref's parent matches through the target's `via`). Schema validates `via.catalog`, `via.as` and `via.key` at load.
- **`ubigeoChildren`**: `core/rules.js` `LOOKUP_RULES`; the W1 builtin source `ubigeo` declares `lookupRule`, so `GET /v1/lookups/ubigeo?parent=` answers children (departamentos without a parent, empty for unknown, 400 for another key). `/v1/ubigeo` unchanged.
- **Joins are unscoped** (`targetOf(..., scoped=false)` in `enrich`): a tenant-wide list that joins an empresa-scope catalog (subfamilias -> familias) must name the familia of another empresa; refs stay scoped.
- **Field `message` literals fill `{modo}`** (`messages.js`), needed for the desktop SubFamilia descripcion text.
- **subfamilias-sunat** (`id_subfamilia_sunat` is the idKey: idKeys must be unique across the registry, familias-sunat owns `codigo`): shared, readOnly, 11 active + 1 retired demo rows over the familias-sunat codes 5010/5011/5013/5018/5020 (retired 9999).

### subfamilias: scope decision (DAO evidence)
`DAOSubFamilia.mantSubFamilia(bean, idEmpresa, op)` receives `usuario.getCodempresa()` on every write (`RegisterSubFamilia.executeInsert/Update/Delete`); `DAOSubFamilia.listar(BeanSubFamilia)` builds `SP_SUB_FAMILIA` with `(id, idFamilia, descripcion, "A", cursor, out, "")` - no empresa (the 7th argument is `""`), and `PanelTFSubFamilia.cargarTabla` passes an empty bean. `getSubFamilia()` never sets `idUsuario` (`mantSubFamilia` sends `beanSubFamilia.getIdUsuario()`, null). Decision: `stamp ['id_empresa']`, no `scope`, no `id_usuario`: writes record the session empresa, the list stays tenant-wide (same model as marcas-vehiculo / modelos-vehiculo). **Deviates from tasks.md 6.6 / R-REF-5 `scope=empresa`** (spec to align, like the 5.6b findings). The familia combo itself is empresa-scoped (`loadComboFamilia` passes `usuario.getCodempresa()`), so the `id_familia` ref only accepts familias of the session empresa.

### Desktop facts (RegisterSubFamilia)
Order: familia, descripcion, optional Codigo Sunat. Messages (exact): `Para {modo} una SubFamilia, debes especificar su Familia.` and `Para {modo} una SubFamilia , debes especificar su Descripcion.` (stray space before the comma kept). Descripcion `UpperCaseNumberDocument(100)` -> `U <=100`. Code `"000" + id` -> codeWidth 3. SUNAT options: `loadSubFamiliaSunat` -> `listarSubFamiliaSunat(familia.getCodigoFamiliaSunat())`; nothing loaded without a code. Title "Sub-Familia", menu `miSubFamilia` (id 29). Nested "nueva familia" button excluded (S-REF-39: asserted by field list and a UI query).

### RED / GREEN / MUTATION
- 6.1 RED: `dependentChain.spec.ts` (14, module missing) -> GREEN. 6.2 RED: `UiCrudRegister.dependent.spec.tsx` 5 of 7 failed -> GREEN; `DependentSelect.spec.tsx` (9) written with the component.
- 6.3 RED: parity spec 1 of 4 failed (the `filter` prop; the other three pin W1 behavior and passed on the old Impl, true parity) -> GREEN after the rebuild; one W1 spec (`clears a lower level load error...`) exposed that a failure must clear at once on a new request: fixed in the engine, no test edited. MUTATION above.
- 6.4 RED: `core/lookups.spec.ts` 4 + schema rows 3 failed -> GREEN. 6.5 seed/405/options rows in `test/catalogs/lookups.spec.ts` (both sources). 6.6 RED: `reference.spec.ts` failed on the missing entry; GREEN with entry + seed + menu + permissions; MUTATION: neutralizing the ref belongs-to check fails 6 S-REF-8 rows (both sources); restored.

### Deviations / deferred
1. Two branches (see table). 2. subfamilias is stamp-only, not `scope=empresa` (above). 3. `transient` / `restoreFrom {field,prefixLen}` of the cascade are NOT implemented: `transient` is already the W1 behavior (levels above the leaf never travel) and `restoreFrom` has its first consumer in W2-11 (ZonaDistancia, cascade -> `id_zona`); `filter` is implemented. 4. `ubigeoHasActive` stays W2-11. 5. The server ref belongs-to rule for `dependsOn` with a plain filter key existed already (W2-8 8.2 still adds the localidad -> PV chain). 6. No existing W1 test edited. Existing W2 tests edited: `reference.cases.ts` (`refId` per empresa, subfamilias rows), `reference.spec.ts`, `lookups.spec.ts`, `schema.spec.ts`, `registry.select.ui.spec.tsx`. 7. CRLF warnings on commit are the repo's autocrlf, no content impact.


## W2-7: decimal, date, tipo de cambio (tasks 7.1-7.9) - DONE, three branches

Base `feat/softcommerce-w2-6-ii-via-subfamilias` (74e9b90). The slice is ~1,684 changed lines (excluding JSON), over the 800 budget (tests are ~60 percent of it), so it ships as three consecutive branches split at task boundaries 7.1 | 7.2-7.4 | 7.5-7.9. The worktree branch `feat/softcommerce-w2-7-decimal-date` is an alias of the tip of III (fa968a3).

| # | Branch | Commits | Tasks | Lines (+/-, excl. JSON) | Gate |
|---|---|---|---|---|---|
| I | `feat/softcommerce-w2-7-i-decimal-field` (base W2-6 II) | 6325081 `feat(softcommerce): add decimal number field` | 7.1 | 498 / 26 = 524 | 119 files / 2106 tests, typecheck, build |
| II | `feat/softcommerce-w2-7-ii-date-field` (base I) | 16367ac `feat(softcommerce): add date field with range rules` | 7.2-7.4 | 775 / 24 = 799 | 125 files / 2191 tests, typecheck, build |
| III | `feat/softcommerce-w2-7-iii-tipos-cambio` (base II; = `feat/softcommerce-w2-7-decimal-date`) | be6b759 `feat(softcommerce): add monedas lookup and tipos-cambio catalog`; fa968a3 `feat(softcommerce): add promociones catalog` | 7.5-7.9 | 352 / 9 = 361 (+ 69 seed/menu/permissions JSON lines) | 126 files / 2346 tests, typecheck, build |

Baseline 114 files / 2044 tests. Totals vs W2-6 II: `git diff --numstat` 1616 added / 50 deleted excl. JSON (1666), + 69 / 2 JSON.

### Decisions
- **Decimal (G4)**: `number` with `scale > 0`. `scale` only marks the field as a decimal: R-REF-7 says the input has no precision limit, so nothing caps the decimals (the tipos-cambio montos declare `scale: 3`, the desktop display scale). Input pattern `-?[0-9]*(\.[0-9]*)?`: an edit that no longer matches (second point, letter, minus past the start) is ignored whole. Shared `core/numbers.js` (`DECIMAL_TEXT`, `isExactDecimal`, `outOfBounds`) is used by the server validators and the client. `min` / `exclusiveMin` on the field (the montos use `exclusiveMin: 0`): a blank, zero, negative or incomplete amount is rejected with the field message (the desktop says "especificar su Monto ..." for all of them); the server code is `RANGE`. Codec: a complete decimal of at most 15 significant digits is sent as a number, anything else (`-`, `.`, `1.`, 19 digits) stays the string so the rules judge it and nothing is silently rounded. `blankToDefault` restores `default` on blur (`normalize.ts`). `dec` column renders `String(value)` as stored.
- **Date (G5)**: `src/shared/ui/DateField` (Inter/Impl/View/entry) over jona-ui `JDatePicker` (`mask dd/MM/yyyy`, placeholder `dd/MM/yyyy`, `disabled` for read-only, `min-h-11 sm:min-h-9` on the root). Form state is the masked text; the codec sends ISO. The Impl sets `aria-invalid` and forwards the ref to the inner input (JDatePicker has neither). Shared `core/dates.js` (`isIsoDate`, `displayToIso`, `isoToDisplay`, `todayIso` local day). `default: 'today'` (or an ISO date), scalar = INSERT only, a per-mode map (`{INSERT:'today', CLONE:'today'}`) overrides a cloned value; the server fills an omitted date default with its own day. `date` list column renders dd/MM/yyyy and sorts by the ISO value (formatter keeps `<key>__iso`, `sortRows` prefers it).
- **notFuture / min / afterField (D18)**: in the FieldConfig, the shared client rule and the server (`NOT_FUTURE`, `MIN_DATE`, `AFTER_FIELD`, own literals via `messages.notFuture|min|afterField`, plain fallback). Equal dates accepted; `afterField` has nothing to compare while the other date is blank or invalid. Exercised only by test-only configs (`validators.date.spec.ts`, `date.spec.ts`, `UiCrudRegister.date.spec.tsx`, `agenda` entry in `test/catalogs/cases.ts` for both sources); a registry spec asserts no W2 entry enables them.
- **G6**: `default` and `readOnlyOn` now also exist on `select` and `date`, and `number` (`hasDefault` in `modeDefaults.ts`). The composite-unique 409 already mapped to its `errorField` (W2-2 `serverErrors.ts`); W2-7 proves it end to end (tipos-cambio duplicate shows under Fecha) against the real in-browser mock.
- **monedas**: shared, readOnly, `codeWidth 5` (ids `00001` soles and `00004` dolares are `MonedaEnum` values), seed `00001 SOLES`, `00004 DOLAR AMERICANO`, `00005 EURO` (invented), `00009 LIBRA ESTERLINA` retired. Other moneda ids are not in the desktop sources.
- **Registry `referenceCatalog` helper** gained `unique`.

### tipos-cambio and promociones: scope decisions (DAO evidence)
- **tipos-cambio**: `DaoTipoCambio.mantTipoCambio` receives `beanTc.getIdEmpresa()` (session empresa) and `getIdUsuario()` on every write (`RegisterTipoCambio.getTc`). `DaoTipoCambio.listTipoCambio(fecha, idMoneda, idTipoCambio)` and `RnTipoCambio.listarTipoCambio` take no empresa (the panel sets it on the bean but it is never sent). Decision: `stamp ['id_usuario','id_empresa']`, no `scope`: writes record the session user and empresa, the list stays tenant-wide, uniqueness is keyed per empresa (`includeEmpresa`) so S-MOCK-22 holds. Deviates from tasks 7.6 / R-REF-6 `scope=empresa` (spec to align, like W2-5 and W2-6). The reference.spec SCOPE audit has `'tipos-cambio': 'stamp'`.
- **promociones**: `DaoPromocion.listar(id, estado)` and `mantPromocion(bean, op)` never see an empresa or a user, and `Promocion` carries neither: `scope tenant`, `stamp []`, `codeWidth 0` (int id).

### Desktop facts
- RegisterTipoCambio / UiRegisterTipoCambioImpl checking order: date (empty or invalid date message), moneda, duplicate, then compra, venta, comercial, especial. Messages exact: `La fecha del Tipo de Cambio que has especificado no es válida. Compruébala e inténtalo de nuevo.`; `La fecha del Tipo Cambio ya se encuentra registrado para esa moneda, por favor ingrese otra fecha o seleccione otra moneda.`; amounts `Para {modo} un Tipo de Cambio , debes especificar su Monto de Compra.` (stray space before the comma, kept like SubFamilia), `... su monto de Venta.` (lowercase m), `... su Monto Comercial.`; moneda `Para {modo} un Tipo de Cambio, debes especificar su Moneda.` (M1). The Moneda combo is always disabled and `cbo_moneda.setSelectedItem("DOLAR AMERICANO")` on INSERT; CLONE and UPDATE load the record moneda; CLONE sets `new Date()`; focusLost shows `0.0` for a blank amount; the nested "nueva moneda" button is excluded (S-REF-39 asserted by field list and a UI query). The desktop table rounds amounts to 3 decimals (CEILING); the web shows them as stored (D17).
- RegisterPromocion: only `txt_Descripcion` is checked (`Para {modo} una Promocion, debes especificar su Descripcion.`), both `JDateChooser` start `new Date()`, `chkEstado` is checked and disabled on INSERT; menu node `miPromocion`.

### RED / GREEN / MUTATION
- 7.1 RED: 33 failing specs across NumberField.decimal, decimal.spec, validators.decimal, schema.decimal and the register file -> GREEN (71 passing in those six files).
- 7.2-7.4 RED: 27 failing + the missing DateField module -> GREEN. The W2-2 registry spec that used `date` as the "no UI yet" kind now uses a kind the registry rejects at load (`range`), since every registry kind has a UI.
- 7.5-7.6 RED: lookups.spec monedas rows (14 failing) and reference.spec/UI rows failed on the missing entries; GREEN with entries + seeds. MUTATION: `unique` reduced to `['fecha']` without `includeEmpresa` fails 5 rows (S-MOCK-22 empresa 2, the moneda deviation row, the unique registry spec), restored.
- 7.7 MUTATION: `afterField` on promociones fecha_fin fails 4 specs (no-W2-entry-enables-it, the reversed-range rows in both sources, the UI row), restored.
- 7.8 RED: with `tipos-cambio` registered the two samples of `miTipoCambio` failed; GREEN after the rename to `miFormularioInexistente`.

### Deviations / deferred
1. Three branches (see table); II is 799 lines.
2. tipos-cambio is stamp-only, not `scope=empresa` (above).
3. **W1 permission grant**: `permissions.json` keeps the W1 `miTipoCambio` grant (`add/modify/eliminate/clone: false`, details/search true) because the W1 `mock-server/core/auth.spec.ts` asserts `add: false` for it; changing it would be a second W1 test edit. Consequence: in the shell the demo user sees Tipos de Cambio read-only (no Add or Clone); the register is covered by tests with all permissions. W6 (real permissions) or an approved W1 edit must widen the grant.
4. Promocion dates are not required: R-REF-7 and S-REF-20 say only the descripcion is validated and the dates carry no blank rule (the table marks them `*`); a blank date is stored empty, a malformed one is still rejected.
5. W2 tests edited: `registry.spec.ts` (unknown-kind guard), `formRegistry.registry.spec.tsx` (same `miTipoCambio` sample), `test/catalogs/{cases,lookups.spec,reference.cases,reference.spec}.ts` (additions). W1 tests: only `src/views/uishell/formRegistry.spec.ts` (the approved rename).
6. Menu: `miPromocion` (id 30, under Generales) and its 13-flag grant added; `miTipoCambio` already existed in W1 data. `tipos-cambio` code width 3 is inferred (no pad evidence), flagged for W6.
7. Monto Especial desktop message names "Monto Comercial", the moneda message names "Familia": the web port names the real field (`deviation:true` rows).
8. A `JDatePicker` has no read-only mode: a read-only date is disabled. No `onBlur` on DateField (no consumer).
9. CRLF warnings on commit are the repo's autocrlf, no content impact. Push/PRs left to the orchestrator.


## W2-8: ref parents, empresa catalogs (tasks 8.1-8.7) - DONE, three branches

Base `feat/softcommerce-w2-7-iii-tipos-cambio` (fa968a3). The slice is ~1,504 changed lines excluding seed/menu/permissions JSON (tests are ~65 percent of it), over the 800 budget, so it ships as three consecutive branches split at task boundaries 8.1-8.3 | 8.4 | 8.5-8.6 (the tasks.md fallback 8.1-8.4 / 8.5-8.6 alone would still be 1,166 lines). The worktree branch `feat/softcommerce-w2-8-ref-parents` is an alias of the tip of III (1c48860).

| # | Branch | Commits | Tasks | Lines (+/-, excl. data JSON) | Gate |
|---|---|---|---|---|---|
| I | `feat/softcommerce-w2-8-i-minlen-parents` (base W2-7 III) | cab8a5d `feat(softcommerce): add minLen rule and ref parent chains` | 8.1-8.3 | 434 / 5 = 439 | 130 files / 2406 tests, typecheck |
| II | `feat/softcommerce-w2-8-ii-empresa-punto-venta` (base I) | 2645ae6 `feat(softcommerce): add empresa and punto-venta catalogs` | 8.4 | 712 / 15 = 727 (+ 13 / 9 JSON) | 137 files / 2552 tests, typecheck |
| III | `feat/softcommerce-w2-8-iii-almacenes-zonas` (base II; = `feat/softcommerce-w2-8-ref-parents`) | 1c48860 `feat(softcommerce): add almacenes and zonas catalogs` | 8.5-8.6 | 330 / 12 = 342 (+ 22 / 2 JSON) | 138 files / 2725 tests, typecheck, build |

Baseline 126 files / 2346 tests. Total vs W2-7 III: 1,474 added / 30 deleted excl. data JSON (1,504). W1 tests: none edited. Existing W2 tests edited: `test/catalogs/cases.ts` (additions), `reference.spec.ts` (tables + two audit rows + seeds-demo-only exempts W1 sections), `reference.cases.ts` (source resolver for W1 sections / builtin sources, parent-aware refs, almacen and zona rows). The build was run on the tip of III only; I and II were checked with tests and typecheck.

### TDD Cycle Evidence

| Task | RED | GREEN | MUTATION / note |
|---|---|---|---|
| 8.1 minLen / minLenWhen | `validators.minLen.spec.ts`, `schema.minLen.spec.ts`, `validate.minLen.spec.ts`: 21 of 31 failed | `predicates.minLengthOf`, `validators.fieldDetail` MIN_LENGTH, `schema.assertMinLength`, `validate.ts`, adapter | none needed |
| 8.2 ref parent chain | 3-level test chain (regiones > ciudades > puestos > bodegas) in `cases.ts`, both sources: all 9 rows passed at once (the belongs-to rule landed in W2-1a, 8.2 only proves it over a chain) | no code | MUTATION: belongs-to check neutralised -> 6 rows fail (S-MOCK-24 x2 sources + UPDATE + chain root); restored |
| 8.3 cascade as parent | `UiCrudRegister.cascadeParent.spec.tsx` (7) + `dependentChain.spec.ts` (4): all passed at once (the engine treats the leaf like any parent) | no code | MUTATION: register `chainOf` disabled -> "the cleared zona does not travel" fails (a stale id would be saved); restored. One of my engine rows was wrong (the leaf loads once `prov` is set) and was fixed, no production change |
| 8.4 | `w1sections.spec.ts` 106 of 110 failed, `auth.w1shape` 2, `normalize.typed` 12 + UI 1, `registry.cascade.spec` 3, `schema.w1sections` 1 | entries `empresa.js` / `punto-venta.js`, W1 list projection, `typedNormalize` + `UppercaseTextField.transform`, adapter cascade, idKey exemption, seeds, menu, permissions | UI spec `registry.w1sections.ui.spec.tsx` written after the entries: MUTATION website `normalize: []` and the ubigeo->cascade mapping removed -> 10 rows fail; restored |
| 8.5-8.6 | `reference.spec.ts` failed at load once the tables named `almacenes` / `zonas` | entries, seeds, menu, permissions | MUTATION (UI + table rows written with the entries): zonas style MS -> M1 and the almacen `$session.empresa` where removed -> 10 rows fail; restored |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 8.1-8.3 | `npx vitest run mock-server/core/validators.minLen.spec.ts mock-server/registry/schema.minLen.spec.ts src/domain/crud/validate.minLen.spec.ts test/catalogs/registryParity.spec.ts src/views/uicrudregister/UiCrudRegister.cascadeParent.spec.tsx src/shared/dependentChain.spec.ts` green | the 3-level chain against the HTTP server and the in-browser mock (registryParity) | `predicates.js`, `validators.js`, `schema.js` minLen lines, `validate.ts`, `cases.ts` additions |
| 8.4 | `npx vitest run test/catalogs/w1sections.spec.ts src/catalogs mock-server/core/auth.w1shape.spec.ts` green | `w1sections.spec.ts` HTTP block: PUT `/v1/empresa/1`, POST/DELETE `/v1/punto-venta`, then the W1 routes byte-compared; the W1 golden suite (`generic.spec.ts`) over the extended seeds unchanged | `empresa.js`, `punto-venta.js`, `index.js`, W1 seed rows + `auth.js` projection, `schema.js` idKey exemption, `typedNormalize` + `transform`, adapter cascade |
| 8.5-8.6 | `npx vitest run test/catalogs/reference.spec.ts src/catalogs/registry.almacenes.ui.spec.tsx` green (1245 + 9) | the same table against the HTTP mock and the in-browser mock with `X-Empresa-Id` | `almacenes.js`, `zonas.js`, their seeds, `index.js`, menu/permissions rows |

`npm run dev` / `npm run mock` not run (no dev server allowed).

### Decisions

- **idKey `id` shared by the W1-section entries**: R-REG-4 forbade duplicate idKeys, but both `empresa` and `punto-venta` store the W1 row key `id`. The check now lets two entries with `seed: null` share an idKey (a seeded entry still may not). Spec text to align.
- **`name` instead of `nombre` / `descripcion`**: the W1 rows are `{id, name}`, so the Empresa `Nombre` and the PuntoVenta `Descripción` are stored as `name` (labels and desktop messages unchanged); the W1 and Wave 2 routes then see one value. Spec tables to align.
- **W1 lookups project and filter**: `listEmpresas` / `listPuntosVenta` return `{id,name}` / `{id,name,id_empresa}` in that key order and hide `activo:false` rows, so the extra Wave 2 fields never leak and a deleted punto de venta leaves the W1 list (golden unchanged). The seeds of both sections gained the Wave 2 fields (`direccion`, `ruc`, ..., `id_localidad`, `telefono`, `id_ubigeo`); the W1 projection hides them.
- **Registry ubigeo cascade** (not an explicit task, required by 8.4-8.6): a registry `select` over `ubigeo` is rendered as the W1 departamento > provincia > distrito cascade (`toField`); levels carry an article, and `validate` words the first unset level with the entry style (M1 `su Provincia`, MS `una Provincia`). The server only sees the leaf (`su Distrito`), so a fully blank cascade says Departamento on the client and Distrito on the server.
- **Typed-input normalization** (R-CRUD-6 "typed input, pasted input", needed by S-REF-4 / S-REF-10): `typedNormalize` applies `upper` / `lower` / `digits` of a text field on every edit before the max check (`UppercaseTextField.transform`), no trim, no pad.
- **minLen / minLenWhen shape**: `minLen: n`; `minLenWhen: [{when: {field, in}, len}]`, first match wins; both only on `text`, never above `max`; message code `MIN_LENGTH` words like a missing value unless `messages.minLen` is given.
- **8.2 / 8.3 need no production code**: the ref `parent` rule (W2-1a) and the engine (W2-6) already cover them; the slice adds the chain and cascade-parent proof and the mutation checks above.

### Scope decisions (DAO evidence)

| Catalog | Evidence | Decided |
|---|---|---|
| empresa | `DAOEmpresa.listar(idEmpresa, estado)`: `PanelTFEmpresa` calls `listarEmpresa("")` (all); `modificar(empresa, idUsuario)` passes the user and no empresa; insert returns "" and delete returns true (`RegisterEmpresa.executeInsert/executeDelete`) | `tenant`, `stamp ['id_usuario']`, modes `[UPDATE, DETAIL]` |
| punto-venta | `DAOPuntoVenta.insertar/modificar/eliminar(..., ls_Usuario, ...)` take the user and no empresa (the empresa follows the chosen localidad); `listar(id_empresa, ...)` takes the session empresa (`PanelTFPuntoVenta.cargarTabla` passes `usuario.getCodempresa()`); the empresa combo lists all (`listarEmpresa("")`) | `tenant`, `stamp ['id_usuario']`. **Deviates from the desktop list**: the web list is tenant-wide (the W1 section is shared and the form picks any empresa); no list-only empresa scope exists in the core |
| almacenes | `PanelTFAlmacen` `regla.listar("", usuario.getCodempresa(), "")`; `RegisterAlmacen.txtCodEmpresa` = `usuario.getCodempresa()` passed to `insertar/modificar` with `usuario.getId_usuario()` | `scope empresa`, `stamp ['id_usuario']` (empresa stamped by the scope) |
| zonas | `PanelTFZona` `regla.listar(0, "")`; `DAOZona.mantZona(zona, op)` sets `zona.getId_usuario()`, no empresa | `tenant`, `stamp ['id_usuario']` |

`reference.spec` SCOPE audit: `almacenes: 'empresa'`, `zonas: 'tenant'`; `W1_SCOPE` (`empresa`, `punto-venta`: `tenant`) because those two have no seed file and no generic table rows.

### Desktop facts

- **RegisterEmpresa**: order nombre, direccion, ruc (messages `... una Empresa, debes especificar su Nombre.` / `su Direccion.` (no accent) / `su RUC.` for any length != 11); `IntegerDocument(11)` ruc, `UpperCaseNumberDocument(180)` nombre/direccion/direccion_comercial, `UpperCaseDocument(80)` representante, `LowerCaseNumerDocument(255/200)` website/correo, telefono free; the cascade is optional (stores an empty value until a distrito is chosen); `flag_percepcion` `S`/`N`. Menu node `mi_principal`, title "Empresa".
- **RegisterPuntoVenta**: order empresa (message says "un Localidad" [DEVIATION]), localidad, descripcion (`UpperCaseNumberDocument(100)`), direccion (100), telefono (no document, `su Telefono.`), departamento, provincia, distrito; sends estado `A` on insert (needs `constants`, W2-9: not stored yet). Menu `mi_puntoventa`, title "Punto de Venta".
- **RegisterAlmacen**: order localidad (session empresa), punto de venta (of the localidad), descripcion, direccion, departamento, provincia, distrito, all M1 (`su Descripción.` with accent); three checkboxes (`Direccionamiento Facturación`, `Habilitar Despacho`, `Habilitar Venta`), unchecked on INSERT. Menu `mi_almacen`, title "Almacen". The id is a string with no pad evidence: codeWidth 3 inferred, flagged for W6.
- **RegisterZona**: descripcion (`... una Zona, debes especificar su Descripcion.`), then `debes Seleccionar un Departamento` / `una Provincia` / `un Almacen` (the distrito message names Almacen [DEVIATION]: web says Distrito); `chkEstado` "Activo" checked and disabled on INSERT, estado stored `A` / `D`; id is an int (codeWidth 0). Menu `miZona`, title "Zona".

### Deviations / deferred

1. Three branches (see table). 2. **punto-venta list is tenant-wide** (desktop lists the session empresa); alternatives need a list-only scope in the core. 3. **estado `A` of punto-venta is not stored**: waits for `constants` (W2-9). 4. Field names `name` for empresa/punto-venta and the idKey `id` exemption (spec text to align). 5. The seed PV rows now carry `id_localidad` so the Almacen chain (localidad > punto de venta) works on the demo data; the W1 projection hides it. 6. The `mi_principal` formId is the desktop menu node name; menu titles are proposals where the desktop shows none. 7. W2-11 ZonaDistancia will need `restoreFrom` for a cascade parent (the engine already handles the leaf as a parent). 8. CRLF warnings on commit are the repo's autocrlf, no content impact. Push/PRs left to the orchestrator.

## W2-9: conditional fields, correlativos, ubicaciones (tasks 9.1-9.7) - DONE, three branches

Base `feat/softcommerce-w2-8-iii-almacenes-zonas` (1c48860). The slice is ~1,315 changed lines excluding seed/menu/permissions JSON (tests are ~65 percent of it), over the 800 budget, so it ships as three consecutive branches split at task boundaries 9.1-9.3 | 9.4-9.5 | 9.6-9.7. The worktree branch `feat/softcommerce-w2-9-conditional` is an alias of the tip of III (8d18c56).

| # | Branch | Commits | Tasks | Lines (+/-, excl. data JSON) | Gate |
|---|---|---|---|---|---|
| I | `feat/softcommerce-w2-9-i-conditional-fields` (base W2-8 III) | b61ff5b `feat(softcommerce): add conditional fields`; 70c9be3 `feat(softcommerce-mock): add constants, derive and server-step order` | 9.1-9.3 | 550 / 21 = 571 | 143 files / 2795 tests, typecheck |
| II | `feat/softcommerce-w2-9-ii-correlativos` (base I) | 08ebcbb `feat(softcommerce): add tipos-doc-venta lookup and correlativos catalog` | 9.4-9.5 | 549 / 9 = 558 (+ 22 / 2 JSON) | 146 files / 2970 tests, typecheck |
| III | `feat/softcommerce-w2-9-iii-ubicaciones` (base II; = `feat/softcommerce-w2-9-conditional`) | 8d18c56 `feat(softcommerce): add ubicaciones catalog` | 9.6-9.7 | 189 / 3 = 192 (+ 12 / 2 JSON) | 147 files / 3048 tests, typecheck, build |

Baseline 138 files / 2725 tests. Total vs W2-8 III: 1,285 added / 30 deleted excl. JSON (1,315), + 32 / 2 JSON. W1 tests: none edited. Existing W2 tests edited: `test/catalogs/{cases,reference.cases,reference.spec,lookups.spec,w1sections.cases}.ts` (additions), `src/catalogs/registry.ui.spec.tsx` (the generic max/case loop skips a conditional text, which is not on screen until another field asks for it). Build run on the tip of III only; I and II were checked with tests and typecheck at their own tips.

### TDD Cycle Evidence

| Task | RED | GREEN | MUTATION / note |
|---|---|---|---|
| 9.1 conditional fields | `UiCrudRegister.conditional.spec.tsx` (11 of 12 failed), `validate.conditional.spec.ts` (4 of 5), `schema.conditional.spec.ts` (7 of 11): 22 failing | `conditional.ts`, `validate.ts` (`fieldState`), `normalize.ts` (hidden -> null), Impl/View/Inter, `registry.ts`, `CatalogConfig.ts`, `schema.js` (`clearsOnChange`, condition shape) | none needed |
| 9.2 server conditional + constants + derive | 20 rows of the test-only `comprobantes` entry in `cases.ts` (both sources) + `schema.constants.spec.ts` (10): 30 failing | `core/stored.js` (`blankHidden`, `derivedValues`), `catalog.js`, `validators.js` (`fieldState`), `schema.js` (`assertStored`) | rows written before the code; a CRLF-only miss in `catalog.js` left two of them failing until fixed |
| 9.2b punto-venta estado A | `w1sections.cases.ts` row (2 failing, both sources) | `constants: { estado: 'A' }` | W1 projection still hides it: W1 goldens green |
| 9.3 server-step ordering end to end | `registry.serverSteps.ui.spec.tsx` (5): all passed at once, the prefix runner (`firstServerOnlyStep`, W2-1b) already existed | no code | MUTATION: `firstServerOnlyStep` returning `steps.length` -> 2 fail (the request is blocked by the client; the duplicate row hides); restored |
| 9.4 `exists` lookup filter | `lookups.exists.spec.ts` + `schema.exists.spec.ts`: 8 failing | `validators.existsRow`, `lookups.js`, `schema.js` (field checks after resolve) | none needed |
| 9.4-9.5 real entries | `lookups.spec.ts`, `reference.cases/spec`, `registry.correlativos.ui.spec.tsx` written first: unknown catalog / entry missing | `tipos-doc-venta.js`, `correlativos.js`, seeds, menu, permissions, `referenceCatalog` (`constants`, `derive`) | MUTATION: validation order with the ticket fields before the unique key -> 4 fail (server row, UI row, order spec); restored |
| 9.6 ubicaciones | table rows + `registry.ubicaciones.ui.spec.tsx` first: entry missing (5 UI failures + the reference table at load) | `ubicaciones.js`, seed, menu, permissions | a field-order assertion failed first (the helper put the descripcion before the chain): fixed in the entry |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 9.1 | `npx vitest run src/views/uicrudregister src/domain/crud mock-server/registry src/catalogs` green (519) | RTL against the real register template with a fake service | `conditional.ts`, `validate.ts`, `normalize.ts`, Impl/View/Inter, `registry.ts` conditions, `CatalogConfig.ts`, `schema.js` clearsOnChange |
| 9.2-9.3 | `npx vitest run test/catalogs mock-server src/catalogs/registry.serverSteps.ui.spec.tsx` green | the same `comprobantes` rows against the HTTP mock and the in-browser mock; the UI spec runs the client rules in front of the real core | `core/stored.js`, `catalog.js`, `validators.js` fieldState, `schema.js` assertStored, punto-venta `constants` |
| 9.4-9.5 | `npx vitest run test/catalogs src/catalogs` green (1,861 + the UI file) | reference table, lookup table and the exists-follows-data block on both sources; real entry over the in-browser mock in RTL | `tipos-doc-venta.js`, `correlativos.js`, seeds, index/menu/permissions rows, `existsRow`, `schema.js` exists block |
| 9.6 | `npx vitest run test/catalogs/reference.spec.ts src/catalogs/registry.ubicaciones.ui.spec.tsx` green | same table on both sources + RTL | `ubicaciones.js`, its seed, index/menu/permissions rows |

`npm run dev` / `npm run mock` not run (no dev server allowed).

### Decisions

- **Conditional fields (G8)**: `visibleWhen` / `enabledWhen` / `requiredWhen` / `clearsOnChange` on every field kind but code and cascade (`ConditionalProps`, intersection in `FieldConfig`). `validate.ts` asks `fieldState` (shared predicate): a hidden or disabled field is not validated, `requiredWhen` makes a visible one required, length rules apply only while visible. `changeField` (new `domain/crud/conditional.ts`) applies one edit: the chain below, `clearsOnChange`, and every conditional field the edit just hid is emptied, with its error, so re-showing never restores a value. A disabled field is shown read-only (`isFieldReadOnly`; the text view now uses it). `isFieldVisible` is new on the register contract. `normalize()` sends `null` for a hidden field.
- **Server**: `fieldDetail` skips hidden and disabled fields; `blankHidden` stores `''` for a hidden field (create and update); `entry.constants` are written on create only (never from the body); `entry.derive` `{target, when, then, else}` is recomputed on every write; both are stored-only columns, so the schema rejects a name shared with a field, a constant or a derive target.
- **`exists` lookup filter**: `lookupFilters.<key>: {exists: {catalog, local, key?, where?}}` keeps the rows with an active (not deleted, `where` matching) row of `catalog` whose `local` holds their id and whose `key` (the filter key unless renamed) equals the value. The target catalog's session scope is honoured. A ref `parent` over an `exists` filter is NOT implemented (UsuarioCorrelativo, W2-11).
- **Prefix runner**: the client prefix up to the first server-only step already existed (`firstServerOnlyStep`, W2-1b); W2-9 only proves it end to end (9.3).
- **CLONE** is a create, so the unique check applies on CLONE without extra code (the [DEVIATION] row).

### Scope decisions (DAO evidence)

| Catalog | Evidence | Decided |
|---|---|---|
| tipos-doc-venta | `DaoTipoDocVenta.listarTipoDocVenta("", "", "", "A", "", "", "")` (RegisterCorrelativo.loadTipoDocumento) lists the estado A rows; ids are the SUNAT codes (`TipoDocVentaEnum`: `01`, `03`, `TI`, `07`, `08`, `09`, ...); `DAOCorrelativo.listar(idPuntoVenta)` (`SP_TIPO_DOC_CORRELATIVO`) lists the types with a correlativo in a punto de venta | `shared`, readOnly, codeWidth 0, `id_punto_venta` exists filter. Demo seed: 01, 03, TI, 07, 08, 09 + retired NI |
| correlativos | `RegisterCorrelativo.mantCorrelativo(bean, usuario.getId_usuario(), op)` passes the user and no empresa; `PanelTFCorrelativo.cargarTabla` -> `regla.listar("", "", "")` lists everything; `loadLocalidad(usuario.getCodempresa())`; `PanelTFCorrelativo.focusLost` pads the code filter to five (`"00000" + code`) | `tenant`, `stamp ['id_usuario']`, codeWidth 5; the localidad select carries `where id_empresa = $session.empresa`, so writes need the empresa header |
| ubicaciones | `DaoUbicacion.insertUbicacion(descripcion, idAlmacen)`, `updateUbicacion(id, descripcion, idAlmacen)`, `deleteUbicacion(id)`: no user, no empresa; `PnlUbicacion.cargarTabla` -> `listarUbicacion(0, "")`; `LoadCombo.loadLocalidad` lists every active localidad, `loadAlmacen(.., usuario)` the almacenes of the session empresa | `tenant`, `stamp []`, codeWidth 0 (int bean), the almacen select is scoped by the session empresa through the almacenes `scope empresa` |

`reference.spec` SCOPE audit: `correlativos: 'tenant'`, `ubicaciones: 'tenant'`.

### Desktop facts

- **RegisterCorrelativo**: order tipo, serie, correlativo, estado, localidad, punto de venta, then `getExisteSerieCorrelativo(pv, tipo, serie)` (duplicate: INSERT, or UPDATE when the triple changed; CLONE skips it), then `isValidTicket`. Messages: `Para {modo} un Correlativo, debes especificar su Tipo de Documento.` / `su Serie.` / `su Correlativo.` / `su Estado.` / `la Localidad.` / `su Punto de Venta.` / `su Numero de Autorizacion.` / `su Codigo de Maquina.`; duplicate `Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.` Serie `UpperCaseNumberDocument(4)` + left zero pad (`DIG_SERIE` 4), correlativo `IntegerDocument(10)` padded to ten on focusLost, ticket fields `UpperCaseNumberDocument(50)` hidden unless `TipoDocVentaEnum.TICKET` (`TI`). Constants `0000000001` / `9999999999` / `N`; `linea_impresion` 12 when "Se imprime Si", else 0 (`getLineasImpresion` returns 12 but the next line overrides it). Estado A on INSERT. Menu node `PanelTFCorrelativo`, title "Correlativo"; columns LOCALIDAD, P VENTA, T DOC, SERIE, CORRELATIVO, EST.
- **RegisterUbicacion**: localidad, punto de venta, almacen, descripcion; messages are bare literals (`Seleccione Localidad`, `Seleccione Punto de Venta`, `Seleccione Almacen`, `Ingrese Descripcion`); descripcion `UpperCaseNumberDocument(50)`; menu node `PnlUbicacion` (list title "Listado de Ubicaciones", form title "Ubicación"); columns UBICACION, ALMACEN, PUNTO VENTA, LOCALIDAD.

### Deviations / deferred

1. Three branches (see table). 2. CLONE applies the unique check (the desktop skips it): `deviation:true` row. 3. **Estado A of punto-venta is now stored** (`constants`), with a test; deferred item from W2-8 closed. 4. Spec text to align: R-REF-8/R-CRUD-13 imply a blank required ticket field blocks on the client, but the declared Correlativo order makes the client validate only up to the unique key, so the ticket fields are reported by the server (S-REF-15 last row, as the spec itself says); generic conditional blocking (S-CRUD-33) applies to a config without `entry`. R-MOCK-16 `exists` shape `{catalog, local, where}` gained an optional `key`. 5. `ref parent` over an `exists` filter and `restoreFrom` stay for W2-11. 6. The localidad of a correlativo/ubicacion is stored (id_localidad, id_punto_venta) although the desktop stores only the punto de venta / almacen: the form needs it to restore the chain. 7. Demo `imprime` values are `S` / `N`. 8. Menu ids 35 (`PanelTFCorrelativo`) and 36 (`PnlUbicacion`); the labels follow the desktop titles. 9. CRLF warnings on commit are the repo's autocrlf, no content impact. Push/PRs left to the orchestrator.

## W2-10: defaultOption, SUNAT lookups, tipos-mov-inventario, unidades-medida, vehiculos (tasks 10.1-10.7) - DONE, two branches

Base `feat/softcommerce-w2-9-iii-ubicaciones` (8d18c56). The slice is ~1,098 changed lines excluding seed/menu/permissions JSON (tests are ~60 percent of it), over the 800 budget, so it ships as two consecutive branches split at the task boundary 10.1-10.2 | 10.3-10.6 (a third split was not needed: II is 653 lines). The worktree branch `feat/softcommerce-w2-10-default-option` is an alias of the tip of II (4d0a2f1).

| # | Branch | Commits | Tasks | Lines (+/-, excl. data JSON) | Gate |
|---|---|---|---|---|---|
| I | `feat/softcommerce-w2-10-i-default-option-sunat` (base W2-9 III) | 7a12cfa `feat(softcommerce): add defaultOption for dependent selects` (281 / 12); 2870827 `feat(softcommerce-mock): add SUNAT table lookups` (150 / 4) | 10.1-10.2 | 431 / 16 = 447 (+ 27 / 0 JSON) | 150 files / 3111 tests, typecheck |
| II | `feat/softcommerce-w2-10-ii-inventory-catalogs` (base I; = `feat/softcommerce-w2-10-default-option`) | 22b9716 `feat(softcommerce): add tipos-mov-inventario and unidades-medida catalogs` (387 / 2); 4d0a2f1 `feat(softcommerce): add vehiculos catalog` (262 / 2) | 10.3-10.6 | 649 / 4 = 653 (+ 33 / 2 JSON) | 154 files / 3422 tests, typecheck, build |

Baseline 147 files / 3048 tests. Total vs W2-9 III: 1,079 added / 19 deleted excl. JSON (1,098), + 60 / 2 JSON. W1 tests: none edited. Existing W2 tests edited (additions only): `src/shared/dependentChain.spec.ts`, `src/shared/ui/DependentSelect/DependentSelect.spec.tsx`, `test/catalogs/{lookups.spec,reference.spec,reference.cases}.ts`. Build run on the tip of II only; I was checked with tests and typecheck at its own tip.

### TDD Cycle Evidence

| Task | RED | GREEN | MUTATION / note |
|---|---|---|---|
| 10.1 defaultOption | `dependentChain.spec.ts` (4 rows, S-CRUD-41), `DependentSelect.spec.tsx` (7), `UiCrudRegister.defaultOption.spec.tsx` (7), `schema.defaultOption.spec.ts` (4): 14 failing | `dependentChain.ts` (node `defaultOption`, `onDefault`), `DependentSelectImpl/Inter` (`defaultOption`, `onDefault`), register `onFieldDefault` (the pick becomes the baseline), `registry.ts`, `CatalogConfig.ts`, `schema.js` | MUTATION: baseline update removed and "keep a value the options hold" replaced by always-replace -> 3 fail (UPDATE restore x2, untouched INSERT closes without confirm); restored |
| 10.2 SUNAT lookups | 38 rows of `lookups.spec.ts` (both sources) + `lookups.optionLabel.spec.ts` | `tablas-sunat.js`, `tablas-detalle-sunat.js`, two seeds, `optionLabel` list (`schema.js`, `lookups.js`) | one seed-id fix: ids are strings in the core (`findRow` compares with `===`), the first seed used ints and the retired-row GETs failed |
| 10.3-10.5 | `reference.spec.ts` (table + structure) and the two UI specs written first: entries missing | `tipos-mov-inventario.js`, `unidades-medida.js`, seeds, menu 37-38, permissions | MUTATION: `defaultOption` removed, `default: '6'` removed, `scope: 'empresa'` -> tenant: 15 fail (UI x6, structure x3, server rows x6); restored |
| 10.6 vehiculos | `reference.spec.ts` rows, `vehiculos.refs.spec.ts` (S-MOCK-33 x2 sources), UI spec first | `vehiculos.js`, seed, menu 39, permissions | MUTATION: marca `where` removed + validation order changed + the active check of refs disabled: 57 fail; restored. Two of my own rows were wrong (the label default `su Peso(KG)`, and `digits` normalization turns `1.5` into `15`), fixed in the entry / the row |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 10.1 | `npx vitest run src/shared mock-server/registry/schema.defaultOption.spec.ts src/views/uicrudregister` green | RTL: the real register + DependentSelect over a fake lookup | `dependentChain.ts` node/onDefault, DependentSelect props, register `onFieldDefault`, `schema.js` defaultOption block, `registry.ts` / `CatalogConfig.ts` passthrough |
| 10.2 | `npx vitest run test/catalogs/lookups.spec.ts mock-server/core/lookups.optionLabel.spec.ts` green | the lookup table against the HTTP mock and the in-browser mock | `tablas-*.js`, their seeds, `index.js`, `optionLabel` list in `schema.js` / `lookups.js` |
| 10.3-10.5 | `npx vitest run test/catalogs/reference.spec.ts src/catalogs/registry.tiposMov.ui.spec.tsx src/catalogs/registry.unidades.ui.spec.tsx` green | same table on both sources + real entries over the in-browser mock in RTL | the two entries, seeds, `index.js`, menu 37-38, permissions |
| 10.6 | `npx vitest run test/catalogs/reference.spec.ts test/catalogs/vehiculos.refs.spec.ts src/catalogs/registry.vehiculos.ui.spec.tsx` green | S-MOCK-33 against both sources; real entry in RTL | `vehiculos.js`, its seed, `index.js`, menu 39, permissions |

`npm run dev` / `npm run mock` not run (no dev server allowed).

### Decisions

- **defaultOption lives in the engine, applied by the select**: `createDependentChain(nodes, load, onUpdate, onDefault?)` reports `onDefault(name, firstId | '')` after each successful load of a node with `defaultOption: 'first'` (never for a blocked, failed or superseded load). `DependentSelect` decides with the form as it is then: a value the options hold stays (UPDATE restores), a missing or stale one is replaced by the first option (as `cargarClasificacion` does in the desktop), an empty list empties a held value, a read-only select is never touched. The pick goes through a new register `onFieldDefault`, which also updates the baseline, so an untouched INSERT closes without the discard confirmation. The server does not apply it (a body without the clasificacion is a 422).
- **Registry**: `defaultOption` is only accepted on a `select` with `dependsOn`, value `first` (`schema.js`; R-REG-4).
- **Seeded default (10.3, D16)**: no resolver and no schema extension. D16 lists "positional default at runtime" as the REJECTED alternative, and R-REF-6 words the default as the id of the 6th seeded row asserted by a seed spec, exactly the `tipos-cambio` moneda precedent. `unidades-medida.id_tabla_sunat` is `default: '6'` and `reference.spec` asserts `tablas-sunat[5]` is id `6` / `UNIDAD DE MEDIDA` (and `lookups.spec` asserts the 6th row for the lookup). Spec text to align: tasks 10.3 names a `{seededRow: 6}`-style resolver.
- **optionLabel as a list**: `optionLabel: ['nombre', 'descripcion']` joins with " - " (empty parts left out); the desktop tabla combo reads `nombre - descripcion`. A single name still works.
- **Option ids are strings**: the SUNAT ints (`id_tabla_sunat`, `id_detalle_sunat`) are strings in the seeds, as every other catalog (the core compares ids with `===` on GET).
- **tipo option labels** are the bare `E` / `S` of the desktop combo (the list column therefore shows E / S, where the desktop list shows ENTRADA / SALIDA).
- **vehiculos where**: marca and modelo use `where: { estado: true }` ("active" in R-REF-6 = the estado A rows the desktop lists); a deleted (logical) row is rejected by the generic active-only ref check (S-MOCK-33), proven in `vehiculos.refs.spec.ts`.

### Scope decisions (DAO evidence)

| Catalog | Evidence | Decided |
|---|---|---|
| tablas-sunat / tablas-detalle-sunat | `DaoTablaDetalleSunat.listarTablaSunat()` takes no argument, `listarDetalleSunat(id_tabla)` one tabla; no write method exists | `shared`, readOnly, codeWidth 0, detail filtered by an exact `id_tabla_sunat` |
| tipos-mov-inventario | `DAOTipoMovInventario.listar(t)` takes no empresa; `manTipoMovInventario(beanTipoMov, op)` carries `setUsuario(usuario.getId_usuario())` and no empresa; every write sets `setEstado("A")`; ids are the `TipoMovInventarioEnum` codes `001`... | `tenant`, `stamp ['id_usuario']`, `constants {estado: 'A'}`, codeWidth 3 |
| unidades-medida | `PanelTFUnidadMedida` -> `listarGeneral(usuario.getCodempresa())`, `RegisterUnidadMedida.loadRegister` -> `listar(codigo, "", "", usuario.getCodempresa())`; `manUnidadMedida` passes the user (`setIdUsuario`) and no empresa; no pad evidence for `ID_UM` | `scope empresa` (R-REF-6 says so; the scope stamps the empresa on writes), `stamp ['id_usuario']`, codeWidth 3 inferred (flag W6) |
| vehiculos | `DaoVehiculo.listarVehiculo(id, transportista, estado)` takes no empresa, `mantVehiculo` passes `bean.getId_usuario()` and no empresa; `loadMarca` / `loadModelo` list `("", "A")`; no pad evidence for `ID_VEHICULO` | `tenant`, `stamp ['id_usuario']`, codeWidth 3 inferred (flag W6) |

`reference.spec` SCOPE audit: `tipos-mov-inventario: 'tenant'`, `unidades-medida: 'empresa'`, `vehiculos: 'tenant'`.

### Desktop facts

- **RegisterTipoMovInventario**: order tipo (combo `E`, `S`, default E), clasificacion (`loadClasificacion(tipo)`, `setSelectedIndex(0)` after every tipo change), descripcion (`UpperCaseNumberDocument(100)`), abreviatura (100), Tabla Sunat (`nombre - descripcion`, placeholder `--- Seleccione ---`), Codigo Sunat (disabled and empty until a tabla is chosen), Hab Ingreso (unchecked, stored S/N). Messages: `Para {modo} un Tipo de Movimiento de Inventario, debes especificar su Descripcion.` / `su Abreviatura.`; nothing else is validated. Menu `miTipoMovInventario`, title "Tipo de Movimiento de Inventario"; columns CODIGO, TIPO DE MOV, CLASIF MOV, CLASIF ABREV, DESCRIPCION, ABREV, HAB NI.
- **RegisterUnidadMedida**: descripcion (100), abreviatura (100), Tabla Sunat starting on the 6th seeded tabla (`setSelectedIndex(6)`) with its detail loaded and no code chosen, Codigo Sunat. Messages `Para {modo} una Unidad de Medida, debes especificar su Descripcion.` / `su Abreviatura.`. The presentation panel (Presentación / Unidad Base radios, FP, UP) is rendered but never read by `executeInsert` / `executeUpdate`. Menu `miUnidadMedida`, title "Unidad de Medida"; columns CODIGO, DESCRIPCION, ABREVIATURA.
- **RegisterVehiculo**: labels Código, Marca, Modelo, Propietario, Placa (`UpperCaseNumberDocument(30)`), Const inscripcion (30), Peso(KG) (`IntegerDocument(10)`, "0"), Activo (checked and disabled on INSERT, A / D). Messages: `Para {modo}, debes especificar su Placa.` / `su Constacia.` (sic) / `su Peso.` / `debes Seleccionar Marca.` / `debes Seleccionar Modelo.`. Menu `miVehiculo`, title "Vehiculo"; columns CODIGO, TRANSPORTE (excluded), PLACA, CONSTANCIA INSCRIPCION, MARCA, MODELO, ESTADO.

### Deviations / deferred

1. Two branches (see table). 2. **No seeded-default resolver** (see Decisions): tasks 10.3 / design wording to align. 3. `optionLabel` accepts a list (new, needed by the tabla label); spec R-REG-2 `optionLabel` text to align. 4. `defaultOption` also needs `onFieldDefault` on the register contract; spec S-CRUD-41 text could mention the baseline. 5. tipo options show `E` / `S` (desktop combo); the web list column shows `tipo_label` = E / S. 6. The UI sends the select `where` as `estado: 'true'`; the same value is a W6 contract point. 7. Demo ids of tablas / detalles are invented (SUNAT-like), only the 6th tabla id is load-bearing. 8. `peso` normalizes by `digits` like the desktop `IntegerDocument`, so a pasted `1.5` becomes `15` (same as `dias_pago`). 9. CRLF warnings on commit are the repo's autocrlf, no content impact. Push/PRs left to the orchestrator.

## W2-11: multi-parent chains, zona catalogs (tasks 11.0-11.6) - DONE, three branches

Base `feat/softcommerce-w2-10-ii-inventory-catalogs` (4d0a2f1). The slice is ~1,665 changed lines excluding seed/menu/permissions JSON (tests are ~65 percent of it), over the 800 budget, so it ships as three consecutive branches split at task boundaries 11.0-11.2 | 11.3-11.4 | 11.5. The worktree branch `feat/softcommerce-w2-11-multi-parent` is an alias of the tip of III (8d9e3ea).

| # | Branch | Commits | Tasks | Lines (+/-, excl. data JSON) | Gate |
|---|---|---|---|---|---|
| I | `feat/softcommerce-w2-11-i-cascade-lookups` (base W2-10 II) | 35f33b9 `feat(softcommerce-mock): add ubigeoHasActive rule`; c1af982 `feat(softcommerce-mock): add usuarios and trabajadores lookups`; fb4d078 `feat(softcommerce): add transient, restoreFrom and filter to the ubigeo cascade` | 11.0-11.2 | 711 / 19 = 730 (+ 8 JSON) | 162 files / 3508 tests, typecheck |
| II | `feat/softcommerce-w2-11-ii-zona-catalogs` (base I) | 5eb099b `feat(softcommerce): add usuario-correlativos catalog`; be6b16a `feat(softcommerce): add zonas-distancia catalog` | 11.3-11.4 | 681 / 15 = 696 (+ 23 / 2 JSON) | 165 files / 3739 tests, typecheck |
| III | `feat/softcommerce-w2-11-iii-trabajador-pv` (base II; = `feat/softcommerce-w2-11-multi-parent`) | 8d9e3ea `feat(softcommerce): add trabajador-punto-venta catalog` | 11.5-11.6 | 243 / 2 = 245 (+ 12 / 2 JSON) | 166 files / 3830 tests, typecheck, build |

Baseline 154 files / 3422 tests. Total vs W2-10 II: 1,632 added / 33 deleted excl. JSON (1,665), + 41 / 2 JSON. W1 tests: none edited. Existing W2 tests edited: `test/catalogs/reference.spec.ts` (the audit that "every other entry is a shared lookup" now reads "read-only lookup", so the per-tenant usuarios and trabajadores pass; tables and structure rows added) and `test/catalogs/reference.cases.ts` (additions; helpers taught the `exists` parent, a transient select and the `users` W1 file; the empresa-2 write row is skipped for an entry with no valid chain there). Build run on the tip of III only; I and II were checked with tests and typecheck at their own tips.

### TDD Cycle Evidence

| Task | RED | GREEN | MUTATION / note |
|---|---|---|---|
| 11.1 ubigeoHasActive | `lookups.ubigeoHasActive.spec.ts`: 7 of 7 failed (`has` was an unknown key) | `rules.js` `ubigeoHasActive`, `lookups.js` (`lookupRuleBy`), `sources.js`; parity table `test/catalogs/ubigeoHasActive.spec.ts` (14, green on landing) | MUTATION: the active filter of the held ubigeos removed -> 2 unit + 4 parity rows fail; restored |
| 11.2 lookups | `lookups.people.spec.ts` (34) + `schema.project.spec.ts` (4): "Unknown catalog" / no `project` | `project.js` (PROJECTIONS), `schema.js` `project` checks, `store.js` projection, `usuarios.js`, `trabajadores.js`, seed | MUTATION: the tenant filter of the projection removed -> 6 rows fail; restored. One audit in `reference.spec.ts` failed (a tenant-scope readOnly entry) and was reworded |
| 11.0 cascade | `schema.cascade.spec.ts` (9 of 10 failed), `catalog.transient.spec.ts` (4 failed); the UI specs passed at once because the three production changes were written before they ran | `schema.js` `assertCascade` + refs/parents, `validators.js` (transient skipped), `CatalogConfig`, `registry.ts`, `UiCrudRegisterImpl` (restoreFrom, filter route), `normalize.ts`, View | MUTATION (stands for the RED of the UI half): restoreFrom, the filter route and the transient payload removed -> 8 of 10 `UiCrudRegister.restoreFrom.spec.tsx` rows fail; restored |
| 11.3 usuario-correlativos | `ref.existsParent.spec.ts` (1 of 4 failed: the accepting row), `reference.spec.ts` failed at load (entry missing) | `validators.js` refDetail `exists` parent, `usuario-correlativos.js`, `referenceCatalog` `optionLabel`, correlativos `optionLabel: 'serie'`, seed, menu 40, permissions | MUTATION: the exists parent, `stamp: []` -> `['id_usuario']` and the correlativos `optionLabel` reverted together -> 45 rows fail; restored. UI spec (9) written after the entry, green at once |
| 11.4 zonas-distancia | `reference.spec.ts` failed at load (entry missing) | `zonas-distancia.js`, seed, menu 41, permissions | MUTATION: the `filter`, `exclusiveMin` removed -> 12 rows fail; with the `id_ubigeo` join removed the registry no longer loads (the `restoreFrom` guard). One UI expectation was wrong (the cascade placeholder is `Seleccione`), fixed in the spec |
| 11.5 trabajador-punto-venta | `reference.spec.ts` failed at load (entry missing) | `trabajador-punto-venta.js`, seed, menu 42, permissions | MUTATION: the `{unique:0}` step removed and `habilitar` default flipped to true -> 13 rows fail; restored |

### Work Unit Evidence

| Unit | Focused test command and result | Runtime harness | Rollback boundary |
|---|---|---|---|
| 11.1 | `npx vitest run mock-server/core/lookups.ubigeoHasActive.spec.ts test/catalogs/ubigeoHasActive.spec.ts` green (7 + 14) | the table against the HTTP mock and the in-browser mock | `rules.js` rule, `lookups.js` rule choice, `sources.js` `lookupRuleBy` |
| 11.2 | `npx vitest run test/catalogs/lookups.people.spec.ts mock-server/registry/schema.project.spec.ts` green (34 + 4) | both sources, tenants demo and botica | `project.js`, `schema.js` project block, `store.js` projection, the two entries, `trabajadores.json`, `index.js` |
| 11.0 | `npx vitest run mock-server/registry/schema.cascade.spec.ts mock-server/core/catalog.transient.spec.ts src/catalogs/registry.cascade.restore.spec.ts src/views/uicrudregister/UiCrudRegister.restoreFrom.spec.tsx` green | RTL: the real register + CascadeSelect + DependentSelect over a fake lookup | `schema.js` `assertCascade` and refs, `validators.js` transient lines, `CatalogConfig`/`registry.ts` passthrough, Impl `fromRecord`/`loadChildren`, `normalize.ts`, View `filter` |
| 11.3 | `npx vitest run test/catalogs/reference.spec.ts src/catalogs/registry.usuarioCorrelativos.ui.spec.tsx mock-server/core/ref.existsParent.spec.ts` green | table on both sources + the real entry over the in-browser mock in RTL | `usuario-correlativos.js`, seed, menu 40, `refDetail` exists parent, `optionLabel` of `reference.js`/correlativos |
| 11.4 | `npx vitest run test/catalogs/reference.spec.ts src/catalogs/registry.zonasDistancia.ui.spec.tsx` green | same | `zonas-distancia.js`, seed, menu 41, permissions |
| 11.5 | `npx vitest run test/catalogs/reference.spec.ts src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx` green | same | `trabajador-punto-venta.js`, seed, menu 42, permissions |

`npm run dev` / `npm run mock` not run (no dev server allowed).

### Decisions

- **`ubigeoHasActive`**: `lookups/ubigeo?parent=&has=zonas`. The ubigeo builtin source declares `lookupRuleBy: { has: 'ubigeoHasActive' }`, so a request carrying `has` is answered by that rule (keys `parent`, `has`); a request without it keeps `ubigeoChildren` and the W1 `/v1/ubigeo` route is untouched. `has` is a closed list (`zonas`); a blank `has` filters nothing, an unnamed catalog (`has=localidades`) answers an empty list, an unknown query key is still 400. "Active zona" is a zona that is not logically deleted: the `estado` checkbox of the screen is ignored (CALLAO PUERTO, estado off, still offers CALLAO).
- **Cascade as a parent without storing it (11.0)**: the UI cascade stays `kind: 'cascade'` (W1 specs untouched, `ancestorsOf` unchanged). A registry select over ubigeo may now declare `transient: true` (no level travels, the leaf included; the server never writes, validates or checks it as a parent), `restoreFrom: { field, prefixLen }` (the form rebuilds the levels from a ubigeo code the record carries under `field`, cut to `prefixLen` characters) and a field-level `filter: { has }` (sent with every level request through `lookups/ubigeo`). The record carries the code through a join: ZonaDistancia declares `{ as: 'id_ubigeo', ref: 'id_zona', display: 'id_ubigeo' }`, so GET (and the list) returns the ubigeo of the stored zona and it follows a zona change. The design text puts `restoreFrom` on each level of three chained selects; it is on the cascade here (spec/design wording to align).
- **Projection (`project: 'users'`)**: a registry attribute (closed `PROJECTIONS` in `registry/project.js`) for a tenant, readOnly entry with `seed: null` whose store section is derived from another seed section: `usuarios` is the auth `users.json` filtered by `tenants`, `{id_usuario (string), usuario, nombre}`, no password. No file of its own, so it follows the users seed.
- **Ref `parent` over `exists` (11.3)**: `refDetail` judges "belongs to the parent" with `existsRow` when the target declares an `exists` filter for the parent's filter key (the tipo of a punto de venta); `via` and the plain column match are unchanged.
- **Transient select on the server**: excluded from `refs`, from the default and ref steps, from `pickWritable`, and from the `parents` of the selects that depend on it (a parent the server cannot see); an explicit `validation` list may still name it, the client validates it first and the server skips it.
- **`id_usuario` of usuario-correlativos is the ASSIGNED user**, so the entry has `stamp: []`: stamping the session user would overwrite it. The desktop passes the session user only for the audit.

### Scope decisions (DAO evidence)

| Catalog | Evidence | Decided |
|---|---|---|
| usuarios | `RnUsuario.listarGeneral()` -> `DAOUsuario.listarGeneral()`: `SP_USUARIO` with every filter empty and the logical state `A`; no empresa, habilitado not filtered | `tenant`, readOnly, projected from `users.json`, all users of the tenant (the disabled one included) |
| trabajadores | `BuscarTrabajador` dialog / `RnTrabajador.listarTrabajador`; displayed by nombre | `tenant`, readOnly, minimal seeded rows (code, nombre) |
| usuario-correlativos | `PanelTFUsuarioCorrelativo.cargarTabla` -> `listarUsuarioCorrelativo("", "", "", "", usuario.getCodempresa(), ...)`; `RegisterUsuarioCorrelativo.executeInsert/Update` pass `usuario.getCodempresa()` and `usuario.getId_usuario()`; `focusLost` pads the filter with `"00000" + code` | `scope empresa`, `stamp []` (name clash, see Decisions), codeWidth 5 |
| zonas-distancia | `PanelTFZonaDistancia` -> `regla.listar(0)`; `executeInsert/Update` set `setId_usuario(usuario.getId_usuario())` and no empresa; the id is an int (`Integer.parseInt`) | `tenant`, `stamp ['id_usuario']`, codeWidth 0 |
| trabajador-punto-venta | `PanelTFTrabajadorPuntoVenta.cargarTabla` -> `listarGeneral(usuario.getCodempresa())`; `executeInsert/Update` pass the trabajador, the punto de venta, `usuario.getId_usuario()` and habilitar, no empresa; `focusLost` pads with `"00000"` | `tenant` (the list stays tenant-wide: no list-only scope in the core, as for punto-venta), `stamp ['id_usuario']`, codeWidth 5 |

`reference.spec` SCOPE audit: `usuario-correlativos: 'empresa'`, `zonas-distancia: 'tenant'`, `trabajador-punto-venta: 'tenant'`.

### Desktop facts

- **RegisterUsuarioCorrelativo**: order usuario, localidad, punto de venta, tipo de documento, serie, then `getExisteUsuarioCorrelativo(usuario, correlativo)` (INSERT, or UPDATE when the pair changed; CLONE skips it). Sentences `Para {modo} una Asignasion de Usuario - Correlativo, debes especificar el Usuario.` / `la Localidad.` / `el Punto de Venta.` / `el Tipo de documento.` / `su serie.`; duplicate `Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.` Chain: localidad (`loadLocalidad(codempresa)`) > punto de venta > tipo (`RnCorrelativo.listar(pv)`) > serie (`listar(pv, tipo, "A")`); each level clears everything below. Habilitar starts checked, stored S / N. Menu node `mi_usuariocorrelativo`, title "Correlativo de Usuario"; columns COD, LOCAL, P VENTA, USUARIO, T DOC, SERIE.
- **RegisterZonaDistancia**: departamento > provincia > distrito (`RnUbigeo.listarZona`, the ubigeos with a zona) > zona (`RnZona.listar(0, distrito)`), localidad (session empresa) > punto de venta > almacen (`RnAlmacen.listar("", "", pv)`), distancia (`DoubleDocument`), Activo (checked and disabled on INSERT). Sentences `Para {modo} una Zona, debes Seleccionar un Departamento.` / `una Provincia.` / `un Almacen.` (the distrito, wrong) / `una >ona.` (the zona, wrong) / `una Localidad.` / `un Pto Vta.` / `un Almacen.`, then `... debes especificar su Distancia.` for 0 only. Only the zona, almacen, distancia, user and estado reach `mantZonaDistancia`. Menu node `miZonaDistancia`, title "Zona Distancia".
- **RegisterTrabajadorPuntoVenta**: order trabajador (`su Nombre`), empresa, localidad, punto de venta (all three say `un Correlativo` [DEVIATION]), then `existeTrabajadorPV(trabajador, pv)` (INSERT, or UPDATE when the pair changed; CLONE skips it) with `El Trabajador ya se encuentra asignado al punto de venta especificado. Compruébala e inténtalo de nuevo`. Chain empresa (`listarEmpresa("")`) > localidad > punto de venta. Habilitar unchecked by default, stored S / N. Menu node `miTrabajadorPuntoVenta`, title "Trabajador - PuntoVenta".

### Deviations / deferred

1. Three branches (see table). 2. **Spec conflict**: R-REF-7 words the ZonaDistancia distancia text `Para {modo} una Zona, debes especificar su Distancia.` while S-REF-22, tasks 11.4 and R-REF-6 (entity `una Zona Distancia`) say `una Zona Distancia`; S-REF-22 was followed (the desktop says `una Zona`). 3. **Entity spelling**: the desktop writes "Asignasion" in every UsuarioCorrelativo sentence; the entry keeps it (R-REF-6 spells the entity "Asignación"): align the spec or switch the entity. 4. **Restore through a join**: the cascade of ZonaDistancia is restored from the `id_ubigeo` join over the zona; an inactive zona joins as '' (so its record restores no levels, and the server would reject its zona on write anyway). 5. **ZonaDistancia list has no Departamento / Provincia / Distrito columns**: the desktop table shows them, but a two-hop join (zona > ubigeo) is not supported by the registry; the zona name carries the place. Deferred. 6. **The server accepts any active zona**: the distrito is not stored, so only the form narrows the zona by distrito. 7. The localidad and punto de venta (ZonaDistancia), localidad / punto de venta / tipo (UsuarioCorrelativo) and empresa / localidad (TrabajadorPuntoVenta) are stored although the desktop keeps only the leaf: the forms need them to restore their chains. 8. CLONE applies the pair check on both keyed catalogs (`deviation:true` rows). 9. Habilitar is a boolean (desktop S / N). 10. trabajador-punto-venta list is tenant-wide (desktop lists the session empresa). 11. Menu ids 40-42 (`mi_usuariocorrelativo`, `miZonaDistancia`, `miTrabajadorPuntoVenta`); the labels follow the desktop titles. 12. Spec text to align: R-MOCK-16 `ubigeoHasActive` (`has` closed list, blank and unknown values), R-REG-2 `project`, `transient`, `restoreFrom`, `filter` shapes, D8 wording on `restoreFrom`, W6 contract points (`lookups/ubigeo?has=zonas`, the `estado: 'A'` where of the serie select). 13. CRLF warnings on commit are the repo's autocrlf, no content impact. Push/PRs left to the orchestrator.

## W2-12: docIdentidad rule, tipos-doc-iden, choferes, socios, completeness (tasks 12.1-12.7) - DONE, three branches

Base `feat/softcommerce-w2-11-iii-trabajador-pv` (8d9e3ea). The slice is ~1,586 changed lines excluding data JSON (tests ~60 percent), over the 800 budget, so it ships as three consecutive branches split at commit boundaries (12.1-12.2 | 12.3-12.5 | 12.6). The worktree branch `feat/softcommerce-w2-12-doc-identidad` is an alias of the tip of III (75be689).

| # | Branch | Commits | Tasks | Lines (+/-, excl. data JSON) | Gate |
|---|---|---|---|---|---|
| I | `feat/softcommerce-w2-12-i-doc-identidad-rule` (base W2-11 III) | 243a5e7 `feat(softcommerce): add docIdentidad named rule` | 12.1-12.2 | 762 / 29 = 791 | 169 files / 3936 tests, typecheck |
| II | `feat/softcommerce-w2-12-ii-choferes-socios` (base I) | ec1a53b `feat(softcommerce-mock): add tipos-doc-iden lookup` (27 / 1 + 28 spec); e732d27 `feat(softcommerce): add choferes and socios catalogs` | 12.3-12.5 | 636 / 5 (+ 106 / 6 JSON) | 172 files / 4182 tests, typecheck |
| III | `feat/softcommerce-w2-12-iii-completeness` (base II; = `feat/softcommerce-w2-12-doc-identidad`) | 75be689 `test(softcommerce): add wave 2 completeness specs` | 12.6-12.7 | 159 / 0 | 174 files / 4270 tests, typecheck, build |

Baseline 166 files / 3830 tests. Total vs W2-11 III: 1,552 added / 34 deleted excl. JSON (1,586), + 112 / 2 JSON. W1 tests: none edited in W2-12. Existing W2 tests edited (additions): `test/catalogs/{cases,lookups.spec,reference.spec}.ts`. Wave-level W1 edits stay the approved ones (menu-seed length comparisons in auth.spec, menuTree.spec, AppServicesMock.spec; `miTipoCambio` in formRegistry.spec). 12.6 needed NO source fixes.

### TDD Cycle Evidence

| Task | RED | GREEN | MUTATION / note |
|---|---|---|---|
| 12.1 hooks | `rules.docIdentidad.spec.ts`: 40 of 40 failed | `core/docIdentidad.js` (state/validate/effect/derive), `core/entryRules.js` (runners), `rules.js` re-export | none needed |
| 12.2 engine | `registryParity` rows of the test-only `personas` entry (34 failing, both sources), `schema.docIdentidad.spec.ts`, `UiCrudRegister.docIdentidad.spec.tsx` (13) | `predicates.js` (`fieldState` rule overlay, `maxLengthOf`), `schema.js` (`maxWhen`, rule params, `ruleState`), `validators.js` (`{rule}` step, `maxWhen`), `stored.js`/`catalog.js` (blankHidden by state, `withRuleDerived`), client `validate.ts`, `UiCrudRegisterImpl/View/Inter` (effects, live derive, alert), `CatalogConfig`, `registry.ts` | UI specs passed at once after the engine landed; MUTATION: effects/derive and the client rule step switched off -> 5 fail; restored |
| 12.3 tipos-doc-iden | `lookups.spec.ts`: 17 failing | `tipos-doc-iden.js`, seed, index | none needed |
| 12.4-12.5 | `docIdentidad.spec.ts` + cases (both sources), the two UI specs written before the entries | `choferes.js`, `socios.js`, `documento.js`, seeds, menu 43-44, permissions, `reference.js` (`modes`, `rules`) | MUTATION: `modes` removed, nacionalidad default removed, `persona` where removed -> 46 fail; restored |
| 12.6 completeness | written against the finished stack: all green at once (no fixes needed) | - | MUTATION: socios dropped from the index and a Propietario label added -> 6 fail; restored |

### Decisions

- **Rule shape**: hooks take `(values, params)`; `params` rename the fields and carry the tipo ids (`dni` `01`, `ruc` `05`, evidence `FormImportarAnexo`: 8 digits -> `01` else `05`; `RegisterSocio`: `getId_tipo_doc().equals("05")`), so the rule is pure and needs no lookup. `persona` names the stored-only flag column (Socio `flag_tipo_persona`); Chofer stores `N` through `constants`.
- **Overlay**: a field a rule touches carries a non-enumerable `ruleState(values)` (attached in `schema.js`); the shared `fieldState` merges it, so visibility/disabled/required follow the rule on the form and the server alike. `maxWhen` is declarative; a spec ties it to `state().max`.
- **Server** runs the rule's `validate` as the `{rule}` step, blanks rule-hidden fields, and recomputes razon social and persona flag on every write. Hardening beyond the desktop: a RUC starting with neither 1 nor 2 is a 422 on `numero_doc` with the alert text (the form clears it; the server must not store it). The alert effect triggers on any edit of the number, not only at length 1 and 11 (covers a paste).
- **tipos-doc-iden**: shared, readOnly, `optionLabel abreviatura`, fields `persona` (desktop FLAG, `listarTipoDocIden("", "A", "S")`) and `estado`; ids `00` SD (non-person), `01` DNI, `04` CE, `05` RUC, `06` PAS (estado off), `99` retired. Selects use `where {persona: true, estado: true}` for options and ref validation (D16).
- **Hidden sexo**: a juridical RUC hides the sexo; the generic hide-clears rule empties it, so returning to DNI shows it blank (desktop keeps the radio).

### Scope decisions (DAO evidence)

| Catalog | Evidence | Decided |
|---|---|---|
| tipos-doc-iden | `DaoTipoDocIden.listarTipoDocIden(id, estado, flag_venta)`; `RegisterChofer/Socio.loadTipoDocIden` call it with `("", "A", "S")` | `shared`, readOnly, codeWidth 2 |
| choferes | `DAOAnexo.mantChofer` passes `getIdUsuario()` and no empresa; `PanelTFChofer.cargarTabla` -> `listAnexo("7", ...)`; `focusLost` pads `"0000000000" + id`; `llenarBeanAnexo` fixes `flag_tipo_persona = "N"`; `executeDelete` returns false | `tenant`, `stamp ['id_usuario']`, codeWidth 10, constant `N`, modes INSERT/UPDATE/DETAIL/CLONE |
| socios | `DAOCliente.mantSocio` has the user line commented out (`//cs.setString(10, ...)`), `listarSocio(0, "")` takes no empresa, `Integer.parseInt` id | `tenant`, `stamp []`, codeWidth 0, estado read-only in every mode |

`reference.spec` audit: `DOC_SCOPE = { choferes: 'tenant', socios: 'tenant' }`.

### Deviations / deferred

1. Three branches. 2. 12.6 is `completeness.spec.ts` plus `registry.excluded.ui.spec.tsx` (the S-REF-39 render and the form-registry check need jsdom and a jsx tsconfig, which `test/` lacks). 3. Chofer and Socio have their own table (`docIdentidad.cases.ts`), not `ENTITIES` (the generic rows assume plain text fields). 4. Commits 3 and 4 of the plan were one commit (`choferes and socios`): the shared helper, seeds, menu, permissions and the audit serve both. 5. Spec text to align: R-REG-2 `rules.params` and `maxWhen` shape, the hooks' `(values, params)` signature (spec writes `state(values)`), the server-side RUC first-digit 422, the effect firing on every edit, tipos-doc-iden columns `persona` / `estado` (spec says "persons flag"). 6. Chofer list shows razon social, tipo, number, nacionalidad, direccion, telefono, celular (the desktop also shows sexo, email, comentario). 7. Menu ids 43-44 (`PanelTFChofer`, `PanelTFSocio`), `eliminate` false in both grants. 8. The server keeps the stored (disabled) names when a RUC-2 body carries them. 9. CRLF warnings on commit are the repo's autocrlf. Push/PRs and the tracker PR left to the orchestrator.
