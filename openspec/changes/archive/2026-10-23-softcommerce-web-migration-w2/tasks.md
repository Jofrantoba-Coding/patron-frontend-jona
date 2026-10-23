# Tasks: SoftCommerce Web Migration, Wave 2 (Reference Catalogs)

All paths are relative to `web_ts/softcommerce/` unless stated. Strict TDD: every task is RED (failing spec naming the spec scenario) -> GREEN (minimum code) -> REFACTOR (tests stay green). Where no genuine RED is possible (seed-only or config-only rows), the task says `MUTATION`: break the rule in the registry entry and prove the table-driven test fails, then restore. Tests ship in the same commit as the code they prove (work-unit commits, Conventional Commits, no AI attribution).

Conventions used by every task:
- **Table-driven**: per-catalog tests are generated from the registry (`describe.each(REGISTRY)`) plus per-entry rows in `test/catalogs/<slug>.cases.ts` (`deviation:true` rows for [DEVIATION] items). Every case runs against the in-browser mock AND the HTTP mock through `catalogServiceContract` (R-MOCK-18, R-REF-13, S-REF-37).
- **Desktop facts are read at apply time**, never guessed: per-catalog `codeWidth`, which entries store `id_usuario`, exact messages, defaults. Each catalog task names the `Register*.java` file to read, under `desktop_java/softcommerce-desktop/src/com/develtrex/softcommerce/view/formularios/`.
- **Catalog task template** (CT): read the named `Register*.java`; RED = rows in `test/catalogs/<slug>.cases.ts` (required, max, normalize, exact message, mode, ref, unique as listed in R-REF) failing because the entry is missing; GREEN = `mock-server/registry/catalogs/<slug>.js` + `registry/index.js` line + `mock-server/data/catalogs/<seed>.json` + `data/menu.json` node + `data/permissions.json` grant (13 flags) + `src/views/uishell/formRegistry.ts` is derived (no edit). Also asserts S-REF-1 (list hides inactive), S-REF-34 (server requireds/refs 422), S-REF-36 (permissions/shortcuts) through the shared tables.
- **W1 stays green**: all W1 suites green in every slice. W1 spec files were not extended: "extend X.spec" tasks below became NEW spec files (for example `*.requestContext.spec.ts`, `toolbarGate.modes.spec.ts`, `registryParity.spec.ts`). Only two documented W1 test edits exist: the `miTipoCambio` sample in `src/views/uishell/formRegistry.spec.ts` (task 7.8) and the four menu-pinned assertions (`mock-server/core/auth.spec.ts`, `src/services/shellServiceContract.ts`, `src/services/mock/AppServicesMock.spec.ts`, `src/domain/crud/menuTree.spec.ts`) that now compare to the menu seed (landed in W2-2 commit 870754f; see S-CRUD-39).
- **Delivery as built**: every slice exceeded 800 changed lines (tests are 60 to 65 percent) and shipped as 2 or 3 consecutive branches; the table below lists the planned slice branches (aliases of the last part's tip). Branch names, commit lists and line counts as built are in `apply-progress.md`.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~9,220 total across 13 slices (additions + deletions, seed JSON counted, `package-lock.json` excluded); 650 to 760 each |
| 400-line budget risk | High (total); every slice exceeds 400 but stays at or under the 800 budget |
| Chained PRs recommended | Yes |
| Suggested split | W2-1a -> W2-1b -> W2-2 -> W2-3 -> W2-4 -> W2-5 -> W2-6 -> W2-7 -> W2-8 -> W2-9 -> W2-10 -> W2-11 -> W2-12 |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

Reason for "No": auto-chain with feature-branch-chain already selected, and no slice forecast exceeds 800 (largest: W2-11 at 760). Fallback splits if a slice trends above 800 during apply (split BEFORE opening the PR, renumber later children, retarget bases):
- **W2-1a** -> W2-1a-i (schema, load validation, presets, auto-seed, scope sections; tasks 1a.2-1a.3) and W2-1a-ii (generic CRUD, refs/unique/joins, modes/readOnly, Localidad compat, parity harness; tasks 1a.4-1a.9).
- **W2-8** -> W2-8a (ref-parent server rule, `minLenWhen`, cascade-as-parent, empresa, punto-venta; 8.1-8.4) and W2-8b (almacenes, zonas; 8.5-8.6).
- **W2-11** -> move `trabajador-punto-venta` (task 11.5) to W2-12 (design fallback).

### Chain topology

Tracker: `feat/softcommerce-w2` (draft, no-merge PR to `main`, merged last). Child PR #1 targets the tracker; each later child targets the immediately previous child branch. Each child PR body carries a dependency diagram with the current PR marked with the pin emoji, plus start, end, prior dependencies, follow-up and out-of-scope items. A child diff that shows previous-PR changes means the base is wrong: retarget or rebase.

| # | Slice | Branch | PR base | PR title | ~Lines |
|---|-------|--------|---------|----------|--------|
| 1 | W2-1a | `feat/softcommerce-w2-1a-registry-core` | `feat/softcommerce-w2` | `feat(softcommerce): add catalog registry and generic mock core` | 720 |
| 2 | W2-1b | `feat/softcommerce-w2-1b-session-options` | W2-1a branch | `feat(softcommerce): add session context, options endpoint and shared rules` | 650 |
| 3 | W2-2 | `feat/softcommerce-w2-2-ui-catalog` | W2-1b branch | `feat(softcommerce): add registry-driven UiCatalog and first text catalogs` | 720 |
| 4 | W2-3 | `feat/softcommerce-w2-3-boolean-options` | W2-2 branch | `feat(softcommerce): add boolean and options fields with estado preset` | 700 |
| 5 | W2-4 | `feat/softcommerce-w2-4-integer` | W2-3 branch | `feat(softcommerce): add integer fields and padLeft` | 650 |
| 6 | W2-5 | `feat/softcommerce-w2-5-catalog-select` | W2-4 branch | `feat(softcommerce): add catalog select and empresa scope` | 720 |
| 7 | W2-6 | `feat/softcommerce-w2-6-dependent-engine` | W2-5 branch | `feat(softcommerce): add dependent select engine` | 700 |
| 8 | W2-7 | `feat/softcommerce-w2-7-decimal-date` | W2-6 branch | `feat(softcommerce): add decimal and date fields` | 720 |
| 9 | W2-8 | `feat/softcommerce-w2-8-ref-parents` | W2-7 branch | `feat(softcommerce): add ref parent chains and empresa catalogs` | 740 |
| 10 | W2-9 | `feat/softcommerce-w2-9-conditional` | W2-8 branch | `feat(softcommerce): add conditional fields and correlativos` | 720 |
| 11 | W2-10 | `feat/softcommerce-w2-10-default-option` | W2-9 branch | `feat(softcommerce): add default option and SUNAT lookups` | 700 |
| 12 | W2-11 | `feat/softcommerce-w2-11-multi-parent` | W2-10 branch | `feat(softcommerce): add multi-parent chains and zona catalogs` | 760 |
| 13 | W2-12 | `feat/softcommerce-w2-12-doc-identidad` | W2-11 branch | `feat(softcommerce): add docIdentidad rule, choferes and socios` | 720 |

### Per-slice gate (every slice, before opening the PR)

From `web_ts/softcommerce`: `npm test`, `npm run typecheck` (real check: `tsc -p tsconfig.app.json --noEmit && tsc -p tsconfig.node.json --noEmit`), `npm run build`. Record the exact result of each in the PR body. Also record: changed-line count (`git diff --shortstat <base>...HEAD`, excluding `package-lock.json`); it MUST be <= 800, otherwise apply the fallback split above. Each slice is revertible alone, in reverse order.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Registry, generic core, Localidad compat | W2-1a | `npx vitest run mock-server/registry mock-server/core mock-server/http src/services` | `npm run mock`; `Invoke-RestMethod http://localhost:<port>/v1/localidades -Headers @{'X-Tenant-Id'='demo'}` | `mock-server/registry`, core/http/seed edits |
| 2 | Session ctx, options endpoint, shared messages/normalize/predicates | W2-1b | `npx vitest run mock-server/core src/services src/session` | `npm run mock`; `GET /v1/lookups/punto-venta?id_localidad=1` | `core/{context,lookups,messages,normalize,predicates}.js`, `sessionStore`, `httpClient` |
| 3 | UiCatalog + first six text catalogs | W2-2 | `npx vitest run src/catalogs src/views test/catalogs` | `npm run mock` + `npm run dev`; open Aduanas, add a row | `src/catalogs/registry.ts`, `views/uicatalog`, six `registry/catalogs/*` |
| 4 | Boolean/options fields, estado | W2-3 | `npx vitest run src/shared/ui/BooleanField src/shared/ui/OptionsField test/catalogs` | dev: Clasif Inventarios add, tipo select | two field dirs + six entries |
| 5 | Integer fields | W2-4 | `npx vitest run src/shared/ui/NumberField src/domain/crud test/catalogs` | dev: Turnos `5` -> `05` on blur | NumberField (scale 0), four entries |
| 6 | Catalog select, empresa scope | W2-5 | `npx vitest run src/shared/ui/CatalogSelect test/catalogs` | dev: Familias with two empresas | CatalogSelect, five entries, familias-sunat |
| 7 | Dependent engine, cascade rebuilt | W2-6 | `npx vitest run src/shared src/views/uilocalidad test/catalogs` | dev: Localidad cascade and Subfamilias, both `VITE_API_MODE` values | `dependentChain.ts`, DependentSelect, CascadeSelectImpl |
| 8 | Decimal and date fields | W2-7 | `npx vitest run src/shared/ui/DateField src/shared/ui/NumberField test/catalogs` | dev: Tipos de Cambio add, clone | DateField, decimal path, two entries |
| 9 | Ref parents, empresa catalogs | W2-8 | `npx vitest run mock-server src/views test/catalogs` | dev: Almacenes chain; `GET /v1/empresas` byte-compare with W1 | four entries, ref-parent rule |
| 10 | Conditional fields, correlativos | W2-9 | `npx vitest run src/domain/crud src/views/uicrudregister test/catalogs` | dev: Correlativos `TI` toggle | conditional engine, two entries, tipos-doc-venta |
| 11 | Default option, SUNAT lookups | W2-10 | `npx vitest run src/shared test/catalogs` | dev: Tipos Mov Inventario tipo E/S | three entries, tablas-sunat lookups |
| 12 | Multi-parent, ubigeoHasActive | W2-11 | `npx vitest run mock-server src/shared test/catalogs` | dev: Zonas Distancia two chains | three entries, usuarios/trabajadores lookups |
| 13 | docIdentidad, choferes, socios | W2-12 | `npx vitest run mock-server/core/rules src/views test/catalogs` | dev: Chofer DNI -> RUC switch | `rules.js` docIdentidad, two entries, tipos-doc-iden |

---

## Slice W2-1a: registry schema, generic core, Localidad compat (branch `feat/softcommerce-w2-1a-registry-core`, base: `feat/softcommerce-w2`)

Catalogs: **localidades** (migrated). Capabilities: registry schema and load validation, auto-seed, generic CRUD, refs/unique/joins/labels, `codeWidth`, modes/`readOnly` 405, Localidad compat, dual-source harness. Specs: R-REG-1,2,3(server side),4,5,6,7,8,10(server),11,12; R-MOCK-1,5,7,9,10(basic),11,12,14,15(mechanism),17,18; S-REG-3,4,5,6,7,8,9,10,11,13(server),14,15,16,18,19; S-MOCK-16,25(core),28(core),32(core),33(core),34,35(harness),37(core); S-CRUD-21,39(W1 guard); S-REF-38. Forecast ~720 lines. Fallback split noted above.

- [x] 1a.1 Preflight. `git status`; `git branch feat/softcommerce-w2 main` then `git switch -c feat/softcommerce-w2-1a-registry-core feat/softcommerce-w2`. `openspec/changes/softcommerce-web-migration-w2/` is untracked: do NOT commit it unless the user asks. Never stash/reset/clean. Stage explicit pathspecs only; `git diff --cached --name-only` must list only softcommerce paths. Push tracker, open it as draft no-merge PR to `main`. Baseline: run the full W1 gate green first (S-CRUD-21 guard: `test/pinned-deps.spec.ts` already asserts `jona-ui` 1.5.1, no edit).
- [x] 1a.2 Registry schema + load validation. RED: `mock-server/registry/schema.spec.ts` table rows: S-REG-3 duplicate slug/idKey/formId, S-REG-4 unknown `source`, S-REG-5 cyclic `dependsOn`, S-REG-16 unknown named rule / `{unique:3}` step, unknown field in `dependsOn|visibleWhen|enabledWhen|requiredWhen|afterField|unique|joins`, bad `scope`, kind missing attribute (`select` without `source`, `options` without values, `number` without `scale`), unknown ref. GREEN: `mock-server/registry/{schema,index,presets}.js` (JSDoc `CatalogDef`, fail-fast `validateRegistry`, closed rule-name set stub: `docIdentidad`, `ubigeoChildren`, `ubigeoHasActive`). Files: those + `schema.spec.ts`.
- [x] 1a.3 Auto-seed + scope sections. RED: `mock-server/http/loadSeed.spec.ts` and `src/services/mock/seed.spec.ts`: S-REG-6 (demo rows, `botica` gets `[]`), S-REG-7 (malformed JSON fails at load naming the file), S-REG-18 (shared vs tenant vs empresa sections), W1 `tinySeed`/`readSeed` unchanged. GREEN: `mock-server/http/loadSeed.js` (iterate `entry.seed`), `src/services/mock/seed.ts` (`import.meta.glob('../../../mock-server/data/catalogs/*.json')`), `mock-server/core/store.js` sections derived from `scope`. Files: those + specs.
- [x] 1a.4 Generic CRUD core. RED: `mock-server/core/catalog.generic.spec.ts` using a test-only entry (no real catalog yet): list/get/create/update/delete (R-MOCK-9), contains filter on listed fields, body `id_*`/`activo`/`id_usuario` ignored, S-MOCK-25 (`codeWidth` 4, max `0007` -> `0008`; `codeWidth` 0 unpadded), S-REG-9 (unique excludes self), S-REG-10 (deleted frees key), R-MOCK-7 logical delete for every entry. GREEN: `core/catalog.js` generalized, `core/validators.js` (required, max, kind basics, trim). Files: those + spec. Desktop facts: none here (Localidad stays unpadded).
- [x] 1a.5 Refs, unique, joins, option labels. RED: same spec file family, test-only entries: S-REG-8 (unknown/inactive ref -> 422 on field), `refs` exists/`activeOnly`/static `where`/`parent` belongs-to, `unique` 409 `DUPLICATE` on `errorField` (R-REG-7, `includeEmpresa`), S-REG-11/S-MOCK-28 joins incl. inactive target -> `''`, S-MOCK-37 `<name>_label`, S-MOCK-33 (delete not blocked by refs; later write referencing it 422), `prefixLen` join. GREEN: `core/catalog.js`, `core/validators.js`.
- [x] 1a.6 Modes + readOnly. RED: S-REG-13 server half (`modes:[UPDATE,DETAIL]` -> POST 405 `MODE_NOT_SUPPORTED`), S-REG-14 / S-MOCK-32 core (`readOnly` write -> 405 `METHOD_NOT_ALLOWED`, data unchanged, codes differ), R-REG-10, R-MOCK-17. GREEN: `core/catalog.js`, `core/errors.js` (new codes), `http/app.js` mapping 405 with error shape.
- [x] 1a.7 Generic HTTP routes + W1 routes. RED: `mock-server/http/generic.spec.ts`: S-MOCK-16 (`/v1/nope` 404 error shape), route slug != storage `section`, S-MOCK-34 (`GET /v1/empresas`, `GET /v1/puntos-venta?id_empresa=1` byte-identical to a W1 golden captured BEFORE changing `app.js`), R-MOCK-1 surface. GREEN: `http/app.js` generic `/v1/{slug}[/{id}]` driven by registry; W1 special routes kept. Capture goldens first (RED baseline), then refactor.
- [x] 1a.8 Localidad compat entry. RED: `mock-server/registry/localidades.compat.spec.ts` (S-REG-19: consistency spec exempts only `direccion` as `serverOptional`; W1 messages style `w1`; `validation: ['id_empresa','descripcion','id_ubigeo','direccion']`), plus ALL existing W1 suites unchanged (S-REG-15, S-REF-38, S-MOCK-1..14). GREEN: `mock-server/registry/catalogs/localidades.js` replacing the hand-written localidades rules in `core/catalog.js`; consistency spec compares registry vs HTTP mock vs in-browser mock vs existing `src/catalogs/localidad/localidad.config.ts` (R-REG-3 server half; the UI adapter lands in W2-2). MUTATION: change `max` in the registry only; the consistency spec must fail naming catalog and field (S-REG-2 seed).
- [x] 1a.9 In-browser mock + dual-source harness. RED: `src/services/mock/AppServicesMock.spec.ts` and `src/services/catalogServiceContract.ts` extended: iterate registry cases from `test/catalogs/cases.ts` (shared table loader) against `mock` and `http` (S-MOCK-35 harness, R-MOCK-18, R-REF-13), including the 405/409/422 outcomes of 1a.4-1a.6. GREEN: `src/services/mock/AppServicesMock.ts` uses the same `mock-server/core` + registry; `test/catalogs/cases.ts` loader. Files: those.
- [x] 1a.10 Gate (see per-slice gate), record line count, push, open PR against the tracker. (PRs #26-#28; every later slice likewise pushed and opened by the orchestrator, #29-#58.)

Commits: (1) `feat(softcommerce-mock): add catalog registry schema with load validation` 1a.2; (2) `feat(softcommerce-mock): auto-register seeds by scope` 1a.3; (3) `feat(softcommerce-mock): generic catalog crud with refs, unique and joins` 1a.4-1a.6; (4) `feat(softcommerce-mock): generic routes and registry-driven localidades` 1a.7-1a.8; (5) `test(softcommerce): add dual-source registry contract harness` 1a.9.

## Slice W2-1b: session context, options endpoint, shared rules (branch `feat/softcommerce-w2-1b-session-options`, base: W2-1a)

Catalogs: none new (Localidad parity). Specs: R-MOCK-10(order),13,16(core); R-REG-2(normalize/messages attrs),7(empresa key); R-CRUD-6(shared messages); S-REG-17,18(empresa),19; S-MOCK-26(core),27(core),30(core),35,36(core); R-REF-3(styles). Forecast ~650 lines.

- [x] 1b.1 Session context in the core. RED: `mock-server/core/context.spec.ts` with a test-only `scope:'empresa'` + `stamp:['id_usuario','id_empresa']` entry: S-MOCK-26 core (headers win over body), S-MOCK-27 core (list/get/write limited to session empresa), S-MOCK-36 (`X-Empresa-Id: 999` -> 400 `INVALID_SESSION_CONTEXT`; missing -> 400 `MISSING_SESSION_CONTEXT`; W1 routes and Localidad need no headers). GREEN: `core/context.js`, `core/catalog.js` optional trailing `ctx`, `http/app.js` reads `X-User-Id`/`X-Empresa-Id`. Desktop fact (read now, used by entries later): note in the PR which entries store `id_usuario` is read per catalog in later slices.
- [x] 1b.2 UI request context. RED: `src/session/sessionStore.spec.ts` (`getRequestContext()` returns user/empresa when known; `getContext()` byte-identical to today), `src/services/httpClient.spec.ts` (headers sent only when known; W1 header tests unchanged), `src/services/composeServices.spec.ts`. GREEN: `src/session/sessionStore.ts`, `src/services/httpClient.ts`, `src/services/serviceComposer.ts`, `src/main.tsx`, `src/services/mock/AppServicesMock.ts` (passes `ctx`).
- [x] 1b.3 Predicates. RED: `mock-server/core/predicates.spec.ts` table: `{field,in}` evaluator for `visibleWhen|enabledWhen|requiredWhen`, missing field, null vs `''`. GREEN: `core/predicates.js` (pure, imported by UI and both mocks; confirm `allowJs` import from `src/`).
- [x] 1b.4 Normalize. RED: `core/normalize.spec.ts`: `upper|lower|digits|padLeft:n` list order, empty stays empty, S-MOCK-18 core (`"  rojo "` -> trimmed then `ROJO`). GREEN: `core/normalize.js`; server write path applies trim + normalize before validate/store.
- [x] 1b.5 Messages. RED: `core/messages.spec.ts` table: M1, M2, MS (`un|una`), `label` style (`debes especificar {msgLabel}.`), `w1` style identical to current Localidad text, `{modo}` agregar/clonar/modificar/eliminar, `msgLabel` default `su {label}`, field `message` literal, `messages.range|minLen|date`; S-REF-2 text for `aduanas`-like entry. GREEN: `core/messages.js` (used by server validators; UI consumption in W2-2).
- [x] 1b.6 Declared validation order. RED: `core/validation.order.spec.ts`: S-REG-17 (`['a',{unique:0},'b']`: server returns unique before `b`), default order (fields, refs, unique), W2 entries stop at first failing step (one detail; 409 for unique, 422 otherwise), Localidad `compat` keeps all-errors 422 (W1 `catalog.spec` unchanged). GREEN: `core/validators.js`, `core/catalog.js` step runner; client-prefix helper `firstServerOnlyStep(entry)` exported for W2-2.
- [x] 1b.7 Options endpoint. RED: `mock-server/http/lookups.spec.ts`: S-MOCK-30 core (exact match: `?id_localidad=1` never returns localidad 10; active only; `{items:[{id,name}]}` via `optionLabel`; unknown value -> 200 empty; generic list substring unchanged; `source.where` honored; `$session.empresa`), route registered BEFORE generic; accepted keys = ref fields + `dependsOn.filterKey`; `src/services/lookupServiceContract.ts` gains `options(slug, filters?)` (D6; `empresas()`/`ubigeoChildren()` unchanged). GREEN: `core/lookups.js`, `http/app.js`, `src/services/{InterLookupService,LookupServiceHttp}.ts`, `src/services/mock/AppServicesMock.ts`.
- [x] 1b.8 Parity + gate: extend 1a.9 harness with 1b cases; run the per-slice gate; open PR against W2-1a branch.

Commits: (1) `feat(softcommerce): add session request context headers` 1b.1-1b.2; (2) `feat(softcommerce-mock): add shared predicates, normalize and messages` 1b.3-1b.5; (3) `feat(softcommerce-mock): declare validation order` 1b.6; (4) `feat(softcommerce): add lookups options endpoint and service` 1b.7-1b.8.

## Slice W2-2: UiCatalog, G15 UI, first text catalogs (branch `feat/softcommerce-w2-2-ui-catalog`, base: W2-1b)

Catalogs: **aduanas**, colores, estados-documento, laboratorios, marcas, nacionalidades. Specs: R-REG-1,3(UI),9,10(UI); R-CRUD-1(text),6,7,9,11(text,code),14,16; R-REF-1,2,3,4,13; S-REG-1,2,12,13(UI); S-CRUD-17,34,36,38; S-MOCK-15,18; S-REF-1,2,3(aduanas/colores rows),4,34,36,37. Forecast ~720 lines.

- [x] 2.1 UI adapter + consistency. RED: `src/catalogs/registry.spec.ts`: S-REG-2 (UI `max` differs from mock rule -> fails naming catalog+field), R-REG-3 for fields, required, max, refs, unique, joins across UI config / HTTP mock / in-browser mock; S-REG-12 (`formId` missing in `permissions.json`, menu node missing) via `test/catalogs/menuPermissions.spec.ts`. GREEN: `src/catalogs/registry.ts` (`toCatalogConfig`), `src/catalogs/CatalogConfig.ts` extended (field kinds typed, `modes`), `src/domain/crud/codec.ts` (text, code).
- [x] 2.2 formRegistry from registry. RED: `src/views/uishell/formRegistry.spec.ts` (W1 assertions unchanged, `miTipoCambio` still unregistered here) + new rows: every registry `formId` resolves to a `UiCatalog`; S-REG-1 (test-only minimal entry works against both sources with no other code change). GREEN: `src/views/uishell/formRegistry.ts` derives from registry; Localidad keeps `UiLocalidad`.
- [x] 2.3 Code field + modes in toolbar. RED: `src/views/uicrudregister/UiCrudRegister.spec.tsx` additions: S-CRUD-34 (INSERT hides code, CLONE clears+hides, UPDATE shows read-only, create payload has no id, no keyboard/paste edit); `src/domain/crud/toolbarGate.spec.ts`: S-CRUD-36 / S-REG-13 UI (modes `[UPDATE,DETAIL]` -> no add/eliminate/clone rendered, Alt+A inert, double-click opens DETAIL). GREEN: `src/domain/crud/toolbarGate.ts` (modes filter BEFORE permission gating), `src/views/uicrudregister/*`, `src/views/uicrudlist/*`, `src/shared/ui/CrudToolbar/*`.
- [x] 2.4 Client validation and server-error mapping. RED: `src/domain/crud/validate.spec.ts` (declared order, prefix up to first server-only step, messages from `core/messages.js`, S-REF-2 `agregar|modificar`, S-REF-3 max rows ignored on type), `src/domain/crud/serverErrors.spec.ts` (S-CRUD-17 409 detail under `serie`, S-CRUD-38 two fields, first focused, edit clears only its own, unknown field -> form-level). Localidad keeps all-errors (W1 specs unchanged). GREEN: `src/domain/crud/{validate,normalize,serverErrors}.ts`, `UiCrudRegisterImpl.ts`.
- [x] 2.5 UiCatalog unit. RED: `src/views/uicatalog/UiCatalog.spec.tsx` (list + register for a registry entry, loading/empty/error states unchanged, label-only DEFAULTS, value-first callbacks, `min-h-11 sm:min-h-9`). GREEN: `src/views/uicatalog/{UiCatalog,InterUiCatalog,UiCatalogImpl,UiCatalogView,index}.ts(x)` composed over `UiCrudList`/`UiCrudRegister`.
- [x] 2.6 CT batch: aduanas, colores, estados-documento. Read `RegisterAduana.java`, `RegisterColor.java`, `RegisterEstadoDocumento.java` for `codeWidth`, whether `id_usuario` is stored, exact messages. Cases: R-REF-4 rows (aduanas not uppercased; others `U` <=100), S-REF-4, S-MOCK-15 (colores list/get inactive), S-MOCK-18 (`"  rojo "` -> `ROJO`). Seeds `aduanas.json`, `colores.json`, `estados-documento.json` (demo only; `botica` empty).
- [x] 2.7 CT batch: laboratorios, marcas, nacionalidades. Read `RegisterLaboratorio.java` (pais optional), `RegisterMarca.java` ([DEVIATION]: entity is Marca not Familia; `deviation:true` row), `RegisterNacionalidad.java` (seed includes `PERUANA`, `EXTRANJERA` for W2-12). Cases per R-REF-4.
- [x] 2.8 S-REF-37 parity run + S-REF-39 baseline (no excluded UI) + gate; open PR against W2-1b branch.

Commits: (1) `feat(softcommerce): add registry ui adapter and consistency specs` 2.1-2.2; (2) `feat(softcommerce): add code field, mode gating and field-error mapping` 2.3-2.4; (3) `feat(softcommerce): add UiCatalog unit` 2.5; (4) `feat(softcommerce): add aduanas, colores and estados-documento catalogs` 2.6; (5) `feat(softcommerce): add laboratorios, marcas and nacionalidades catalogs` 2.7-2.8.

## Slice W2-3: boolean, options, estado preset (branch `feat/softcommerce-w2-3-boolean-options`, base: W2-2)

Catalogs: **motivos-traslado** (boolean), **clasif-clientes** (estado), **clasif-inventarios** (options), tamanos, tipos-anexo, tipos-descuento. Specs: R-CRUD-1(bool, option cols),11(boolean,options),15(estado, readOnlyOn, per-mode default); R-MOCK-10(options membership),14(labels); R-REF-3(estado),4,5(rows reused later); S-CRUD-24,30,37(bool, option); S-MOCK-17,37; S-REF-6,7. Forecast ~700 lines.

- [x] 3.1 BooleanField + codec. RED: `src/shared/ui/BooleanField/BooleanField.spec.tsx` S-CRUD-24 (default true + `readOnlyOn:[INSERT]`: INSERT checked not editable, UPDATE editable, payload boolean); `bool` column `Sí/No` (R-CRUD-1). GREEN: `src/shared/ui/BooleanField/{InterBooleanField,BooleanFieldImpl,BooleanFieldView,index}`, `codec.ts` boolean.
- [x] 3.2 estado preset, readOnlyOn, per-mode default. RED: `src/domain/crud/modeDefaults.spec.ts` + S-REF-7 (INSERT true read-only; UPDATE editable; CLONE copies source value read-only; DETAIL/DELETE read-only; per-mode default overrides cloned value). GREEN: `mock-server/registry/presets.js` (`estado`), `src/domain/crud/*`, `UiCrudRegisterImpl.ts`.
- [x] 3.3 OptionsField + option columns. RED: `src/shared/ui/OptionsField/OptionsField.spec.tsx` S-CRUD-30 (`A:Activo|I:Inactivo`, default A, payload `A`, column shows `Activo`), `UiCrudList.spec.tsx` option column uses `<name>_label` (S-CRUD-37 option part, filter matches label), server membership 422 (R-MOCK-10). GREEN: `OptionsField/*` (select or radio), `src/views/uicrudlist/*`, `core/validators.js` options membership.
- [x] 3.4 CT: motivos-traslado, clasif-clientes. Read `RegisterMotivoTraslado.java` (hab_guia default false; abrev optional; [DEVIATION] message names "Tipo Anexo"), `RegisterClasifCliente.java` (estado). Cases R-REF-5/4 rows, S-REF-7.
- [x] 3.5 CT: clasif-inventarios, tamanos, tipos-anexo, tipos-descuento. Read `RegisterClasifInventario.java` (tipo `E|S`, no default), `RegisterTamano.java`, `RegisterTipoAnexo.java` (abreviatura optional), `RegisterTipoDescuento.java` (abrev <=5; [DEVIATION] message). Cases: S-MOCK-17 (blank descripcion + `abrev` 6 chars -> one 422 on `descripcion`; valid descripcion + same abrev -> 422 on `abrev`, D10 stop at first step), S-MOCK-37 (`tipo` `E` -> `tipo_label` `Entrada` on list and get), S-REF-6.
- [x] 3.6 Parity + gate; open PR against W2-2 branch.

Commits: (1) `feat(softcommerce): add boolean field and estado preset` 3.1-3.2; (2) `feat(softcommerce): add options field and option columns` 3.3; (3) `feat(softcommerce): add motivos-traslado and clasif-clientes catalogs` 3.4; (4) `feat(softcommerce): add inventory classification, tamanos, anexo and descuento catalogs` 3.5-3.6.

## Slice W2-4: integer fields (branch `feat/softcommerce-w2-4-integer`, base: W2-3)

Catalogs: **condiciones-pago**, turnos, tipos-trabajador, marcas-vehiculo. Specs: R-CRUD-11(number scale 0),15(padLeft); R-MOCK-10(kinds, ranges); R-REF-5,6(rows),7(Turno); S-CRUD-25(integer),35; S-MOCK-19(turnos); S-REF-5,12. Forecast ~650 lines.

- [x] 4.1 NumberField scale 0. RED: `src/shared/ui/NumberField/NumberField.spec.tsx` S-CRUD-25 integer half (`max 2`: `123` -> `12`; letters ignored), paste. GREEN: `NumberField/*`, `codec.ts` number, `normalize.ts` digits.
- [x] 4.2 padLeft on blur. RED: `normalize.spec.ts` S-CRUD-35 (`padLeft:4`+`upper`: `f1` -> `00F1`, empty stays empty; hora `5` -> `05`). GREEN: `src/domain/crud/normalize.ts` blur hook, `UiCrudRegisterImpl.ts` onBlur.
- [x] 4.3 Integer ranges (client + server). RED: S-MOCK-19 turnos (`hora 13` -> 422 on `hora`), `core/validators.spec.ts` range rows `0..12`, `0..59`, `0` accepted. GREEN: `core/validators.js`, `src/domain/crud/validate.ts`.
- [x] 4.4 CT: condiciones-pago, tipos-trabajador, marcas-vehiculo. Read `RegisterCondicionPago.java` (dias_pago `0` valid, tipo no default, descripcion <=255), `RegisterTipoTrabajador.java` (style M2, abreviatura <=5, estado), `RegisterMarcaVehiculo.java` (M2, estado). Cases: S-REF-5 (blank dias_pago `... sus Dias de Pago.`, `0` accepted, no tipo `... su Tipo de Pago.`, `abc` ignored).
- [x] 4.5 CT: turnos. Read `RegisterTurno.java` (messages, AM default, both P2, M2). Cases: S-REF-12 rows `{13,30}`, `{12,60}`, `{0,0}` and exact texts of R-REF-7 Turno in checked order; S-MOCK-19.
- [x] 4.6 Parity + gate; open PR against W2-3 branch. (Gate done; push/PRs left to the orchestrator; slice split into two branches, see apply-progress.)

Commits: (1) `feat(softcommerce): add integer number field and padLeft` 4.1-4.3; (2) `feat(softcommerce): add condiciones-pago, tipos-trabajador and marcas-vehiculo catalogs` 4.4; (3) `feat(softcommerce): add turnos catalog` 4.5-4.6.

## Slice W2-5: catalog select, empresa scope (branch `feat/softcommerce-w2-5-catalog-select`, base: W2-4)

Catalogs: **motivos-descuento**, motivos-nc, tipos-trabajador-perfil, **familias** (scope), modelos-vehiculo; lookup familias-sunat. Specs: R-CRUD-1(joined),11(select),7; R-MOCK-12,13,14,15(familias-sunat); R-REG-6,8; R-REF-5,11; S-CRUD-29,37(joined); S-MOCK-26,27,28,36; S-REF-9,34; S-REG-8,18. Forecast ~720 lines.

- [x] 5.1 CatalogSelect field. RED: `src/shared/ui/CatalogSelect/CatalogSelect.spec.tsx` S-CRUD-29 (options from `lookups`, payload id, placeholder `--- Seleccione ---`, lookup failure -> S-CRUD-20 behavior, static `where` forwarded). GREEN: `CatalogSelect/*` (Inter/Impl/View/index), `codec.ts` select, `UiCrudRegisterImpl.ts` lookup load.
- [x] 5.2 Joined columns + filter. RED: `UiCrudList.spec.tsx` S-CRUD-37 joined part (join name rendered, missing -> empty, filter by joined name). GREEN: `listView.ts`, `filterSort.ts`, `CrudGrid` (joined key from registry `joins`).
- [x] 5.3 Empresa-scope behavior in UI. RED: S-MOCK-27 named (`familias` rows of empresa 1 and 2, list with `X-Empresa-Id: 1`), S-MOCK-36 named (`GET /v1/familias` with `999` -> 400 `INVALID_SESSION_CONTEXT`), S-MOCK-26 named (`POST /v1/modelos-vehiculo` stamps empresa 1 and user 5 despite body 9; missing headers -> 400). GREEN: wiring in `AppServicesMock.ts`/`http/app.js` only if the 1b tests expose gaps.
- [x] 5.4 Lookup familias-sunat (shared, readOnly). Read `RegisterFamilia.java` for how the SUNAT code list is presented (code + description) and `codeWidth`. RED: `S-REG-14` row (POST -> 405 `METHOD_NOT_ALLOWED`), seed spec (shared scope: demo and botica same rows, S-REG-18). GREEN: `registry/catalogs/familias-sunat.js`, `data/catalogs/familias-sunat.json`. No menu node.
- [x] 5.5 CT: motivos-descuento, motivos-nc, tipos-trabajador-perfil. Read `RegisterMotivoDescuento.java` ([DEVIATION]: abrev and tipo messages), `RegisterMotivoNotaCredito.java` (tipo first, [DEVIATION] message), `RegisterTipoTrabajadorPerfil.java` (descripcion first, active-only tipos-trabajador ref). Cases: S-REF-9 (missing tipo -> `... debes especificar su Tipo Dscto.` on `id_tipo_descuento`; unknown id -> 422), S-MOCK-28 (join `tipo_descuento`; deactivated tipo -> `''`).
- [x] 5.6 CT: familias, modelos-vehiculo. Read `RegisterFamilia.java` (`id_usuario`?, optional sunat select), `RegisterModeloVehiculo.java` (M2, estado, empresa scope). Seeds with two empresas for S-MOCK-27.
- [x] 5.6b Empresa-scope audit (outcome: colores, marcas, familias `scope: 'empresa'`; tamanos, modelos-vehiculo, marcas-vehiculo stamp-only `['id_usuario','id_empresa']` with a tenant-wide list; see the audit table in apply-progress). Original wording: move `tamanos` (landed in W2-3 as tenant scope) to `scope: 'empresa'` (desktop `DAOTamano.listarGeneral(ls_IdEmpresa)` / `RegisterTamano` insert pass `codempresa`). Then audit every catalog already landed (W2-2, W2-3) and the ones in this slice: read each `DAO<X>.java` under `model/ora/repository/impl/` and set `scope: 'empresa'` wherever the list or writes take the empresa. Known mixed case from W2-4: `RegisterMarcaVehiculo` passes the empresa on insert/update/delete but its list passes '' — decide (stamp empresa on writes, list across the tenant) and record it as a finding. RED: reference.cases rows (list limited to the session empresa; write stamps it) per moved catalog. GREEN: registry entries + seeds with two empresas.
- [x] 5.7 Parity + gate; open PR against W2-4 branch. (Gate done; push/PRs left to the orchestrator; slice split into two branches, see apply-progress.)

Commits: (1) `feat(softcommerce): add catalog select and joined columns` 5.1-5.2; (2) `feat(softcommerce): cover empresa scope and add familias-sunat lookup` 5.3-5.4; (3) `feat(softcommerce): add motivos and perfil catalogs` 5.5; (4) `feat(softcommerce): add familias and modelos-vehiculo catalogs` 5.6-5.7.

## Slice W2-6: dependent engine, cascade rebuilt (branch `feat/softcommerce-w2-6-dependent-engine`, base: W2-5)

Catalogs: **subfamilias**; lookups subfamilias-sunat. Specs: R-CRUD-12 (single and multi-parent engine), R-CRUD-5; R-MOCK-16(`via`, `ubigeoChildren`); R-REF-5(subfamilias),10; S-CRUD-31,32,40(engine); S-REF-8,39(subfamilia); S-MOCK-23,30(via); S-REG-16 (lookup rule names). Forecast ~700 lines.

- [x] 6.1 Pure engine. RED: `src/shared/dependentChain.spec.ts`: S-CRUD-31 (A->B->C reset and reload), S-CRUD-32 (restore all levels; stale latest-token guard), S-CRUD-40 (multi-parent: disabled until all parents set, either change clears and reloads with both `filterKey`s, stale ignored), `clearsOnChange` for non-select fields. GREEN: `src/shared/dependentChain.ts` extracted from `CascadeSelectImpl.ts`.
- [x] 6.2 DependentSelect + register wiring. RED: `src/shared/ui/DependentSelect/DependentSelect.spec.tsx` (disabled and empty until parents; UPDATE/DELETE/DETAIL/CLONE restore with options loaded; INSERT/UPDATE/CLONE only enable). GREEN: `DependentSelect/*`, `UiCrudRegisterImpl.ts` load-lookups step (R-CRUD-5 order).
- [x] 6.3 CascadeSelect on the engine. RED: parity spec `src/shared/ui/CascadeSelect/CascadeSelect.parity.spec.tsx` (same props and behavior as W1; optional static `filter`; as built, `transient` and `restoreFrom` are NOT part of 6.3: levels above the leaf never traveled in W1, and `restoreFrom` landed in 11.0 with its first consumer) while W1 `localidad.*.spec.tsx`, `UiLocalidad.spec.tsx` stay unchanged and green (S-LOC-10). GREEN: `CascadeSelectImpl.ts` rebuilt on `dependentChain.ts` (same exports). MUTATION: remove the stale-token guard; parity spec must fail.
- [x] 6.4 Server: `via` filters and `ubigeoChildren`. RED: `mock-server/core/lookups.spec.ts`: `via` resolved server-side (S-MOCK-30 via case: subfamilias-sunat options by the familia's SUNAT code, empty when none), `lookups/ubigeo?parent=` via rule `ubigeoChildren`, S-REG-16 for an unknown `lookupFilters` rule name. GREEN: `core/rules.js` (`ubigeoChildren`), `core/lookups.js`.
- [x] 6.5 Lookup subfamilias-sunat (shared, readOnly). Read `RegisterSubFamilia.java` for the SUNAT code relation (`codigo_familia_sunat`). RED: seed + 405 rows. GREEN: `registry/catalogs/subfamilias-sunat.js` with `lookupFilters` + `data/catalogs/subfamilias-sunat.json`.
- [x] 6.6 CT: subfamilias (built stamp-only `['id_empresa']`, no `id_usuario`, list tenant-wide: `DAOSubFamilia.listar` passes no empresa). Read `RegisterSubFamilia.java` (`id_usuario`?, familia required, sunat optional, `scope=empresa` as planned, nested "nueva familia" button excluded -> S-REF-39 row). Cases: S-REF-8, S-MOCK-23 (unknown/inactive `id_familia` -> 422), R-REF-5 row.
- [x] 6.7 Parity + gate; open PR against W2-5 branch. (Gate done; push/PRs left to the orchestrator; slice split into two branches, see apply-progress.)

Commits: (1) `refactor(softcommerce): extract dependent chain engine` 6.1-6.2; (2) `refactor(softcommerce): rebuild cascade select on the engine` 6.3; (3) `feat(softcommerce-mock): add via filters and ubigeoChildren rule` 6.4-6.5; (4) `feat(softcommerce): add subfamilias catalog` 6.6-6.7.

## Slice W2-7: decimal, date, tipo de cambio (branch `feat/softcommerce-w2-7-decimal-date`, base: W2-6)

Catalogs: **tipos-cambio**, promociones; lookup monedas. Specs: R-CRUD-1(date, dec cols),11(number scale>0, date),15(per-mode default, blankToDefault); R-MOCK-10(date, ranges),11 (per-empresa); R-REF-6(rows),7(TipoCambio, Promocion),11(monedas); S-CRUD-25(decimal),26,27,28,37(date,dec),39; S-MOCK-19,22,29,38(monedas); S-REF-18,19,20,35(monedas). Forecast ~720 lines.

- [x] 7.1 Decimal NumberField. RED: `NumberField.spec.tsx` S-CRUD-25 decimal half (pattern `-?[0-9]*(\.[0-9]*)?`, `1.5.2`/`abc` ignored, `-3` accepted by input, rejected by `min`/`exclusiveMin` on submit), S-CRUD-26 (`default 0.0` + `blankToDefault` on blur), `dec` column rendered as stored (no rounding). GREEN: `NumberField/*`, `codec.ts` dec, `listView.ts`.
- [x] 7.2 DateField. RED: `src/shared/ui/DateField/DateField.spec.tsx` S-CRUD-27 (default today, mask `dd/MM/yyyy`, `31/02/2026` blocks, `15/01/2026` -> ISO `2026-01-15`), `date` column `dd/MM/yyyy`; server `2026-02-31` -> 422 on `fecha` (S-MOCK-19). GREEN: `DateField/*`, `codec.ts` date, `core/validators.js` date.
- [x] 7.3 notFuture / afterField (test-only). RED: S-CRUD-28 with a test-only config (`notFuture`, `afterField: fecha_ini`; equal dates accepted; error on `fecha_fin`) client + shared rule + server. GREEN: `validate.ts`, `core/validators.js`. No W2 entry enables them (assert in registry spec).
- [x] 7.4 G6 field mapping: read-only select + per-mode default. RED: CLONE sets `fecha` to today (per-mode default overrides cloned value, R-CRUD-15), select read-only (`moneda`). GREEN: `src/domain/crud/modeDefaults.ts`, CatalogSelect `readOnlyOn`.
- [x] 7.5 Lookup monedas (shared, readOnly). Read `RegisterTipoCambio.java` and `UiRegisterTipoCambioImpl.java` for the default `DOLAR AMERICANO` lookup and `codeWidth`. RED: S-MOCK-29 (`POST /v1/monedas` -> 405 `METHOD_NOT_ALLOWED`), S-MOCK-38 (both tenants same rows), S-REF-35. GREEN: `registry/catalogs/monedas.js`, `data/catalogs/monedas.json`.
- [x] 7.6 CT: tipos-cambio (built stamp-only `['id_usuario','id_empresa']`, list tenant-wide, unique per empresa via `includeEmpresa`). Read `RegisterTipoCambio.java` (checking order, `id_usuario`?, `scope=empresa` as planned, messages R-REF-7). Cases: S-MOCK-22 (dup under empresa 1 -> 409 on `fecha`; empresa 2 -> 201), S-REF-18, S-REF-19 (fecha today, moneda default read-only, montos `0.0`, `monto=0` -> `... su Monto de Compra.`, invalid date message first, CLONE today), S-MOCK-19 (`monto_venta` 0/-1), `deviation:true` row (uniqueness keyed on moneda); S-REF-39 (no nested moneda button).
- [x] 7.7 CT: promociones. Read `RegisterPromocion.java`. Cases: S-REF-20 (only descripcion validated; `fecha_fin < fecha_ini` accepted; both dates default today; estado true read-only).
- [x] 7.8 W1 exception: rename the `miTipoCambio` sample in `src/views/uishell/formRegistry.spec.ts` to an unregistered name (RED: spec fails once `tipos-cambio` registers; GREEN: rename). Nothing else in W1 tests changes (S-CRUD-39).
- [x] 7.9 Parity + gate; open PR against W2-6 branch. (Gate done; push/PRs left to the orchestrator; slice split into three branches, see apply-progress.)

Commits: (1) `feat(softcommerce): add decimal number field` 7.1; (2) `feat(softcommerce): add date field with range rules` 7.2-7.4; (3) `feat(softcommerce): add monedas lookup and tipos-cambio catalog` 7.5-7.6, 7.8; (4) `feat(softcommerce): add promociones catalog` 7.7, 7.9.

## Slice W2-8: ref parents, empresa catalogs (branch `feat/softcommerce-w2-8-ref-parents`, base: W2-7)

Catalogs: **empresa** (modes), punto-venta, almacenes, zonas. Specs: R-REG-4(minLen),10,12(routes); R-CRUD-12(cascade as parent),16; R-MOCK-1,12(parent),13(`$session`),16,17; R-REF-3(MS),5(empresa),6(punto-venta, almacenes, zonas),10; S-REF-4(empresa),7(zonas),10,11,13,32,33; S-MOCK-24,30(punto-venta),32(empresa),34; S-REG-15(after writes). Forecast ~740 lines. Fallback split noted above.

- [x] 8.1 `minLen` / `minLenWhen` capability. RED: `validate.spec.ts` + `core/validators.spec.ts`: plain exact length (`ruc` = `minLen 11` + `max 11`), `minLenWhen` via predicate with a test-only config. GREEN: `core/validators.js`, `src/domain/crud/validate.ts`, `core/predicates.js` reuse.
- [x] 8.2 Ref `parent` belongs-to + options filters. RED: S-MOCK-24 (`POST /v1/almacenes` with `id_punto_venta` of another localidad -> 422 on `id_punto_venta`), S-MOCK-30 named (`lookups/punto-venta?id_localidad=2`; `1` vs `10`), parent chain through empresa -> localidad -> punto-venta. GREEN: `core/catalog.js`, `core/lookups.js`.
- [x] 8.3 Cascade as an optional parent. RED: `dependentChain.spec.ts` (a cascade may be parent of a select; optional cascade does not block; UPDATE restores), `src/shared/ui/DependentSelect/*` spec. GREEN: `dependentChain.ts`, `CascadeSelectImpl.ts`.
- [x] 8.4 CT: empresa, punto-venta (W1 storage sections). Read `RegisterEmpresa.java` (`ruc` message for any length != 11, modes `[UPDATE,DETAIL]`, website/correo lowercase, `id_usuario`?, telefono free text) and `RegisterPuntoVenta.java` ([DEVIATION] empresa message names "Localidad"; telefono no max; estado `A` on create). Routes `/v1/empresa`, `/v1/punto-venta` with `section` = W1 sections (as built: `seed: null` entries may share idKey `id`, Nombre / Descripción stored as `name`, punto-venta list tenant-wide, estado `A` stored through `constants` in W2-9). Cases: S-REF-10 (10 digits -> `Para modificar una Empresa, debes especificar su RUC.`), S-REF-4 (lowercase), S-REF-11 / S-MOCK-32 (POST /v1/empresa -> 405 `MODE_NOT_SUPPORTED`), S-REF-32, S-REG-15 + S-MOCK-34 (record written via `/v1/punto-venta` appears byte-shaped in `GET /v1/puntos-venta?id_empresa=1`; `/v1/empresas` golden unchanged).
- [x] 8.5 CT: almacenes. Read `RegisterAlmacen.java` (field order, cascade MS messages, booleans default false, `id_usuario`?). `where` uses `$session.empresa` for localidades. Cases: S-REF-13 (blank form -> first error `id_localidad`; localidad chosen -> PV options of that localidad only; departamento+provincia without distrito -> `... debes especificar su Distrito.`), S-MOCK-24.
- [x] 8.6 CT: zonas. Read `RegisterZona.java` ([DEVIATION] distrito message names "Almacen"; MS style for cascade; estado preset). Cases: S-REF-33, S-REF-7 (`zonas` estado), seed zonas for W2-11.
- [x] 8.7 Parity + gate; open PR against W2-7 branch. (Gate done; push/PRs left to the orchestrator; slice split into three branches, see apply-progress.)

Commits: (1) `feat(softcommerce): add minLen rule and ref parent chains` 8.1-8.3; (2) `feat(softcommerce): add empresa and punto-venta catalogs` 8.4; (3) `feat(softcommerce): add almacenes and zonas catalogs` 8.5-8.7.

## Slice W2-9: conditional fields, correlativos (branch `feat/softcommerce-w2-9-conditional`, base: W2-8)

Catalogs: **correlativos**, ubicaciones; lookup tipos-doc-venta. Specs: R-CRUD-5,6,13; R-MOCK-10(conditional),11,16(`exists`); R-REG-2(constants, derive, validation steps); R-REF-6(correlativos, ubicaciones),7,8(Correlativo),9; S-CRUD-33; S-MOCK-20,21,30(tipos-doc-venta); S-REF-14,15,16,30; S-REG-17(client prefix). Forecast ~720 lines.

- [x] 9.1 Conditional fields in the register template. RED: `UiCrudRegister.spec.tsx` S-CRUD-33 (X `visibleWhen`/`requiredWhen` tipo `TI`: blank blocks; tipo change hides, clears error, payload `null`; re-show does not restore value), hidden/disabled not validated (R-CRUD-5), `enabledWhen`, `clearsOnChange`. GREEN: `validate.ts`, `codec.ts` (hidden -> `null`), `UiCrudRegisterImpl.ts`/`View.tsx`.
- [x] 9.2 Server conditional + constants/derive. RED: S-MOCK-20 (`TI` + empty `nro_autorizacion` -> 422; `01` + typed value -> stored `''`), R-REF-9 / S-REF-16 stored (`num_inicial` `0000000001`, `num_final` `9999999999`, `flag_cond_pago` `N`, `linea_impresion` 12 when `imprime`=Sí else 0). GREEN: `core/validators.js`, `core/catalog.js` (`constants`, `derive {target,when,then,else}`).
- [x] 9.3 Server-step ordering end-to-end (as built the prefix runner `firstServerOnlyStep` already existed from 1b.6, so the specs passed at once; MUTATION proof recorded; the blank `TI` ticket field is reported by the server, not blocked by the client). RED: S-REG-17 UI half (client validates only up to the first server-only step), S-REF-15 last row (`TI` + only `nro_autorizacion` -> error on `codigo_maquina` returned by the server AFTER a passing unique). GREEN: `validate.ts` prefix runner, `serverErrors.ts`.
- [x] 9.4 Lookup tipos-doc-venta (shared, readOnly, `exists`). Read `RegisterCorrelativo.java` for the document-type list (must include `TI`, `01`, `03`) and `codeWidth`. RED: S-MOCK-30 (`lookups/tipos-doc-venta?id_punto_venta=1` -> only types with an active correlativo in PV 1), 405 and shared rows. GREEN: `registry/catalogs/tipos-doc-venta.js` (`lookupFilters.id_punto_venta: {exists:{catalog:'correlativos', local:'id_tipo_doc', where}}`), seed.
- [x] 9.5 CT: correlativos. Read `RegisterCorrelativo.java` (`id_usuario`?, `codeWidth`, field order, P4/P10, messages). Cases: S-MOCK-21 (dup triple -> 409 on `serie`; PUT same triple -> 200; deleted -> POST ok), S-REF-14 (PV 2 / tipo `03` accepted; UPDATE to other's triple rejected; CLONE same triple rejected = [DEVIATION] row), S-REF-15, S-REF-16 (`1`->`0001`, `25`->`0000000025`, 5th char ignored).
- [x] 9.6 CT: ubicaciones. Read `RegisterUbicacion.java` (literal messages). Cases: S-REF-30 order `Seleccione Localidad`, `Seleccione Punto de Venta`, `Seleccione Almacen`, `Ingrese Descripcion`; chain localidad -> PV -> almacen.
- [x] 9.7 Parity + gate; open PR against W2-8 branch. (Gate done; push/PRs left to the orchestrator; slice split into three branches, see apply-progress.)

Commits: (1) `feat(softcommerce): add conditional fields` 9.1; (2) `feat(softcommerce-mock): add constants, derive and server-step order` 9.2-9.3; (3) `feat(softcommerce): add tipos-doc-venta lookup and correlativos catalog` 9.4-9.5; (4) `feat(softcommerce): add ubicaciones catalog` 9.6-9.7.

## Slice W2-10: defaultOption, SUNAT lookups (branch `feat/softcommerce-w2-10-default-option`, base: W2-9)

Catalogs: **tipos-mov-inventario**, unidades-medida, vehiculos; lookups tablas-sunat, tablas-detalle-sunat. Specs: R-CRUD-11(`defaultOption`); R-REF-5/6(rows),11(SUNAT lookups),12(UnidadMedida, Vehiculo); R-MOCK-15; S-CRUD-41; S-MOCK-29,33; S-REF-23,24,31,35,39(unidad, vehiculo); S-REG-14. Forecast ~700 lines.

- [x] 10.1 `defaultOption: 'first'`. RED: `dependentChain.spec.ts` S-CRUD-41 (first option selected after each load/parent change; empty options -> empty value). GREEN: `dependentChain.ts`, `DependentSelect`.
- [x] 10.2 Lookups tablas-sunat, tablas-detalle-sunat. Read `RegisterUnidadMedida.java` and `RegisterTipoMovInventario.java` for the SUNAT table/detail source. RED: seed spec (at least 6 tablas; the 6th is the units table; asserts its id), S-MOCK-29 (`?id_tabla_sunat=6` returns only that tabla's detail rows; `POST /v1/monedas`-like 405), S-REF-35, S-REG-14. GREEN: two registry entries + `data/catalogs/tablas-sunat.json`, `tablas-detalle-sunat.json`.
- [x] 10.3 Seeded default (D16). RED: `unidades-medida` default = id of the 6th seeded tabla (spec asserts), S-REF-24 (default loads detail options; tabla change clears detalle; both cleared saves without sunat code). GREEN (as built): `registry/catalogs/unidades-medida.js` with `default: '6'` and NO resolver or schema extension (D16 rejects a positional default at runtime); `reference.spec` asserts that `tablas-sunat[5]` is id `6` / `UNIDAD DE MEDIDA` and `lookups.spec` asserts the 6th row.
- [x] 10.4 CT: tipos-mov-inventario. Read `RegisterTipoMovInventario.java` (tipo default E, estado `A` on create, sunat optional, hab_ingreso). Cases: S-REF-23 (clasificaciones of tipo E load, first selected; tipo -> S reloads; tabla cleared -> detalle clears and disables).
- [x] 10.5 CT: unidades-medida. Read `RegisterUnidadMedida.java` (`scope=empresa` list, `codeWidth`, presentation panel excluded). Cases: S-REF-24, S-REF-39 (no presentation panel).
- [x] 10.6 CT: vehiculos. Read `RegisterVehiculo.java` (style M2, select messages `Para {modo}, debes Seleccionar Marca.`, peso default `0`, propietario excluded). Cases: S-REF-31, S-MOCK-33 (delete active `marcas-vehiculo` referenced by a vehiculo -> list excludes, GET resolves inactive, new write 422), S-REF-39.
- [x] 10.7 Parity + gate; open PR against W2-9 branch. (Gate done; push/PRs left to the orchestrator; slice split into two branches, see apply-progress.)

Commits: (1) `feat(softcommerce): add defaultOption for dependent selects` 10.1; (2) `feat(softcommerce-mock): add SUNAT table lookups` 10.2; (3) `feat(softcommerce): add tipos-mov-inventario and unidades-medida catalogs` 10.3-10.5; (4) `feat(softcommerce): add vehiculos catalog` 10.6-10.7.

## Slice W2-11: multi-parent chains, zona catalogs (branch `feat/softcommerce-w2-11-multi-parent`, base: W2-10)

Catalogs: **usuario-correlativos**, **zonas-distancia**, trabajador-punto-venta; lookups usuarios, trabajadores. Specs: R-CRUD-12(multi-parent, cascade parent); R-MOCK-15(usuarios, trabajadores),16(`ubigeoHasActive`); R-REF-6(rows),7(ZonaDistancia, keys),10,11; S-CRUD-40(in use); S-MOCK-31,38; S-REF-17,21,22; S-REG-18. Forecast ~760 lines. Fallback: move 11.5 to W2-12.

- [x] 11.0 Cascade `transient`, `restoreFrom {field, prefixLen}` and field `filter {has}`, declared on the cascade select itself (R-CRUD-12, D8; deferred from W2-6; the record carries the code through a join such as `id_ubigeo` over the zona): ZonaDistancia restores its ubigeo cascade from the stored leaf on UPDATE/CLONE/DETAIL. RED first in the CascadeSelect/dependentChain specs; W1 cascade specs stay unchanged.
- [x] 11.1 Rule `ubigeoHasActive`. RED: S-MOCK-31 (`lookups/ubigeo?parent=&has=zonas` returns only departamentos with an active zona; children levels likewise), unknown rule param handling. GREEN: `core/rules.js`, `core/lookups.js`, ubigeo `filter {has:'zonas'}` accepted by the cascade.
- [x] 11.2 Lookups usuarios, trabajadores. Read `RegisterUsuarioCorrelativo.java` and `RegisterTrabajadorPuntoVenta.java` for the displayed names. RED: S-MOCK-38 (usuarios per-tenant: each tenant sees only its own; `monedas` shared already), 405 rows, `usuarios` seeded from the auth `users.json` (single source, no copy). GREEN: two registry entries; `data/catalogs/trabajadores.json`; `usuarios` projection from users seed (`project`).
- [x] 11.3 CT: usuario-correlativos. Read `RegisterUsuarioCorrelativo.java` (`id_usuario` stored?, `label` message style, shown by serie). Cases: S-CRUD-40 in use (tipo_doc `← id_punto_venta`; id_correlativo `← id_punto_venta + id_tipo_doc`), S-REF-17 (localidad change clears PV, tipo doc, serie downward; dup pair -> 409 on `id_correlativo` with literal message; other usuario accepted), joins show serie.
- [x] 11.4 CT: zonas-distancia. Read `RegisterZonaDistancia.java` (two chains, MS messages with `una Zona`, `un Pto Vta`, distancia rule). Cases: S-REF-22 (departamento change clears provincia/distrito/zona and offers only ubigeos with an active zona; localidad change clears PV and almacen; distancia `0` and `-5` -> `Para agregar una Zona Distancia, debes especificar su Distancia.`; server 422 on `distancia`), `deviation:true` rows.
- [x] 11.5 CT: trabajador-punto-venta. Read `RegisterTrabajadorPuntoVenta.java` ([DEVIATION] messages say "Correlativo"; habilitar default false). Cases: S-REF-21 (dup pair -> 409 on `id_trabajador`; empresa change clears localidad + PV; habilitar untouched saves false), CLONE applies uniqueness ([DEVIATION]).
- [x] 11.6 Parity + gate; open PR against W2-10 branch. (Gate done; push/PRs left to the orchestrator; slice split into three branches, see apply-progress.)

Commits: (1) `feat(softcommerce-mock): add ubigeoHasActive rule` 11.1; (2) `feat(softcommerce-mock): add usuarios and trabajadores lookups` 11.2; (3) `feat(softcommerce): add transient, restoreFrom and filter to the ubigeo cascade` 11.0; (4) `feat(softcommerce): add usuario-correlativos catalog` 11.3; (5) `feat(softcommerce): add zonas-distancia catalog` 11.4; (6) `feat(softcommerce): add trabajador-punto-venta catalog` 11.5-11.6.

## Slice W2-12: docIdentidad rule, choferes, socios (branch `feat/softcommerce-w2-12-doc-identidad`, base: W2-11)

Catalogs: **choferes**, socios; lookup tipos-doc-iden. Specs: R-REG-2(`docIdentidad`, `maxWhen`, `minLenWhen`, `compose`); R-MOCK-10(named rules); R-REF-6(choferes, socios),8(Chofer, Socio),11(tipos-doc-iden),12,13; S-REF-25,26,27,28,29,36,37,39; S-MOCK-32(socios),35,38(shared); S-REG-14,16. Forecast ~720 lines.

- [x] 12.1 Named rule `docIdentidad`: pure hooks. RED: `mock-server/core/rules.docIdentidad.spec.ts` table: `state()` per tipo (DNI max 8, RUC max 11, other max 11 no min; razón social hidden/enabled; names disabled), `validate()` (DNI < 8 -> `El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.`; RUC < 11 -> RUC text; missing names M1 `su Apellido Paterno|su Apellido Materno|su Nombre`), `effect()` (RUC first digit 3 -> alert `EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2` and numero_doc cleared, on any edit of the number; `1` natural, `2` juridical; the server also answers 422 on `numero_doc` for another first digit), all hooks taking `(values, params)` with `params` from `rules: [{name, params}]`, `derive()` (`{ap_paterno} {ap_materno} {nombres}`, `flag_tipo_persona`). GREEN: `core/rules.js`.
- [x] 12.2 Engine wiring of the hooks. RED: `UiCrudRegister.spec.tsx` S-REF-27 (tipo change clears numero_doc, names, razón social; max becomes 11), live composition on each keystroke, alert shown (S-REF-26), server runs the same rule (parity row), `maxWhen`/`minLenWhen` first real use. GREEN: `validate.ts`, `UiCrudRegisterImpl.ts`, `core/validators.js`, `core/catalog.js`.
- [x] 12.3 Lookup tipos-doc-iden (shared, readOnly, `where:{persona:true}`, `activo`). Read `RegisterChofer.java` and `RegisterSocio.java` for the DNI id, the RUC id (`05`), and the persons/active flags; record both ids in the seed spec. RED: seed spec asserts DNI and RUC ids and flags; S-REF-35; 405; `source.where` applies to options AND ref validation (D16): a non-person tipo id sent directly -> 422 on `id_tipo_doc_iden`. GREEN: `registry/catalogs/tipos-doc-iden.js`, `data/catalogs/tipos-doc-iden.json`.
- [x] 12.4 CT: choferes. Read `RegisterChofer.java` (defaults DNI/PERUANA only on INSERT, `[DEVIATION]` UPDATE restores stored values, delete returns false, `id_usuario`?, activation tab excluded, sexo shown only for natural persons, `codeWidth`). Cases: S-REF-25 (7 digits -> DNI message; blank ap_materno -> `Para agregar un Chofer, debes especificar su Apellido Materno.`; composed `PEREZ LOPEZ ANA`), S-REF-26, S-REF-27, S-REF-29 (modes `[INSERT,UPDATE,DETAIL,CLONE]`; DELETE -> 405 `MODE_NOT_SUPPORTED`; UPDATE of tipo RUC + `EXTRANJERA` restores both), nacionalidad required `Para {modo} un Chofer, debes Seleccionar una Nacionalidad.`
- [x] 12.5 CT: socios. Read `RegisterSocio.java` ([DEVIATION] messages say "Cliente"; estado always read-only true on create; `flag_tipo_persona`). Cases: S-REF-28 (RUC `20123456789` -> `J`; RUC `10123456789` or DNI -> `N`; Chofer stores `N`), S-MOCK-32 (`DELETE /v1/socios/{id}` -> 405 `MODE_NOT_SUPPORTED`, socio stays active; code differs from `METHOD_NOT_ALLOWED`).
- [x] 12.6 Final cross-cutting (as built split in two spec files: `test/catalogs/completeness.spec.ts` for the registry, menu, permissions and case-coverage checks, and `src/catalogs/registry.excluded.ui.spec.tsx` for S-REF-39 and the form-registry check, which need jsdom and a jsx tsconfig that `test/` lacks; no source fixes were needed). RED: `test/catalogs/completeness.spec.ts`: registry has 38 catalogs (12 T1 + 11 T2 + 15 T3) each with a menu node and 13 permission flags (S-REF-36, S-REG-12), every R-REF row has a case (R-REF-13), `miTipoCambio` exception only, S-REF-39 (no nested-create button, activation tab, presentation panel or propietario picker rendered for SubFamilia, TipoCambio, Chofer, UnidadMedida, Vehiculo), S-REF-37 parity across all slugs, S-REF-38 W1 suites. GREEN: fixes only (no new features).
- [x] 12.7 Parity + gate. (Gate done; push, PRs and marking the tracker PR ready are left to the orchestrator; slice split into three branches, see apply-progress.)

Commits: (1) `feat(softcommerce): add docIdentidad named rule` 12.1-12.2; (2) `feat(softcommerce-mock): add tipos-doc-iden lookup` 12.3; (3) `feat(softcommerce): add choferes catalog` 12.4; (4) `feat(softcommerce): add socios catalog and completeness specs` 12.5-12.7.

---

## Coverage table

Cell = slice where each id is first proved with the named catalog; "core" = proved earlier on test-only entries.

| Spec ids | Slice / task |
|---|---|
| R-REG-1, R-REG-2 | W2-1a 1a.2 (attributes), W2-1b 1b.3-1b.5, W2-2 2.1 |
| R-REG-3 / S-REG-2 | W2-1a 1a.8 (server), W2-2 2.1 (UI) |
| R-REG-4 / S-REG-3,4,5,16 | W2-1a 1a.2; lookup-rule names W2-6 6.4 |
| R-REG-5 / S-REG-6,7,18 | W2-1a 1a.3 |
| R-REG-6 / S-REG-8 | W2-1a 1a.5; named W2-5 5.5 |
| R-REG-7 / S-REG-9,10 | W2-1a 1a.4-1a.5; named W2-9 9.5, W2-7 7.6 |
| R-REG-8 / S-REG-11 | W2-1a 1a.5; named W2-5 5.5 |
| R-REG-9 / S-REG-12 | W2-2 2.1 |
| R-REG-10 / S-REG-13 | W2-1a 1a.6 (server), W2-2 2.3 (UI), W2-8 8.4 |
| R-REG-11 / S-REG-14 | W2-1a 1a.6; named W2-5 5.4, W2-7 7.5, W2-10 10.2 |
| R-REG-12 / S-REG-15,19 | W2-1a 1a.7-1a.8; re-checked W2-8 8.4 |
| S-REG-1 | W2-2 2.2 |
| S-REG-17 | W2-1b 1b.6 (server), W2-9 9.3 (client prefix) |
| R-MOCK-1, S-MOCK-34 | W2-1a 1a.7; W2-8 8.4 |
| R-MOCK-5, R-MOCK-7 | W2-1a 1a.3-1a.4; S-MOCK-33 named W2-10 10.6 |
| R-MOCK-9 / S-MOCK-15,16 | W2-1a 1a.4, 1a.7; S-MOCK-15 named W2-2 2.6 |
| R-MOCK-10 / S-MOCK-17,18,19,20 | W2-1a 1a.4 (basic), W2-1b 1b.4, 1b.6; named: S-MOCK-17 W2-3 3.5, S-MOCK-18 W2-2 2.6, S-MOCK-19 W2-4 4.3 + W2-7 7.2/7.6, S-MOCK-20 W2-9 9.2 |
| R-MOCK-11 / S-MOCK-21,22 | W2-1a 1a.5; named W2-9 9.5, W2-7 7.6 |
| R-MOCK-12 / S-MOCK-23,24 | W2-1a 1a.5; S-MOCK-23 W2-6 6.6; S-MOCK-24 W2-8 8.2/8.5 |
| R-MOCK-13 / S-MOCK-25,26,27,36 | codeWidth W2-1a 1a.4; session W2-1b 1b.1; named W2-5 5.3 |
| R-MOCK-14 / S-MOCK-28,37 | W2-1a 1a.5; S-MOCK-28 W2-5 5.5; S-MOCK-37 W2-3 3.5 |
| R-MOCK-15 / S-MOCK-29,38 | W2-1a 1a.6; monedas W2-7 7.5; tablas W2-10 10.2; usuarios W2-11 11.2 |
| R-MOCK-16 / S-MOCK-30,31 | W2-1b 1b.7; via/ubigeoChildren W2-6 6.4; punto-venta W2-8 8.2; tipos-doc-venta W2-9 9.4; S-MOCK-31 W2-11 11.1 |
| R-MOCK-17 / S-MOCK-32 | W2-1a 1a.6; empresa W2-8 8.4; socios W2-12 12.5 |
| R-MOCK-18 / S-MOCK-35 | W2-1a 1a.9; extended every slice |
| R-CRUD-1 / S-CRUD-37 | text W2-2 2.5; bool/option W2-3 3.1/3.3; joined W2-5 5.2; date/dec W2-7 7.1/7.2 |
| R-CRUD-5 | W2-6 6.2, W2-9 9.1 |
| R-CRUD-6 / S-CRUD-17(order) | W2-1b 1b.5-1b.6, W2-2 2.4 |
| R-CRUD-7 / S-CRUD-17, S-CRUD-38 | W2-2 2.4 |
| R-CRUD-9 / S-CRUD-21 | guard in W2-1a 1a.1; components per slice 3.1, 3.3, 4.1, 5.1, 6.2, 7.2 |
| R-CRUD-11 / S-CRUD-24 | boolean W2-3 3.1; options S-CRUD-30 W2-3 3.3; number S-CRUD-25 W2-4 4.1 + W2-7 7.1; date S-CRUD-27 W2-7 7.2; select S-CRUD-29 W2-5 5.1; S-CRUD-28 W2-7 7.3; S-CRUD-26 W2-7 7.1; S-CRUD-41 W2-10 10.1 |
| R-CRUD-12 / S-CRUD-31,32,40 | W2-6 6.1-6.3; multi-parent in use W2-11 11.3; cascade parent W2-8 8.3 |
| R-CRUD-13 / S-CRUD-33 | W2-9 9.1 |
| R-CRUD-14 / S-CRUD-34 | W2-2 2.3 |
| R-CRUD-15 / S-CRUD-35 | estado W2-3 3.2; padLeft W2-4 4.2; per-mode default W2-7 7.4 |
| R-CRUD-16 / S-CRUD-36 | W2-2 2.3 |
| S-CRUD-39 | every slice gate; only exception W2-7 7.8 |
| R-REF-1,2,3 | CT template in every catalog task; styles W2-1b 1b.5 |
| R-REF-4 (12 T1) | W2-2 2.6-2.7, W2-3 3.4-3.5, W2-4 4.4 (condiciones-pago) |
| R-REF-5 (11 T2) | familias, modelos-vehiculo W2-5 5.6; subfamilias W2-6 6.6; motivos-descuento, motivos-nc, tipos-trabajador-perfil W2-5 5.5; motivos-traslado W2-3 3.4; empresa W2-8 8.4; tipos-trabajador, marcas-vehiculo, turnos W2-4 4.4-4.5 |
| R-REF-6 (15 T3) | almacenes W2-8 8.5; zonas W2-8 8.6; correlativos W2-9 9.5; ubicaciones W2-9 9.6; punto-venta W2-8 8.4; tipos-mov-inventario, unidades-medida, vehiculos W2-10; tipos-cambio, promociones W2-7; usuario-correlativos, zonas-distancia, trabajador-punto-venta W2-11; choferes, socios W2-12 |
| R-REF-7 | Turno W2-4 4.5; TipoCambio, Promocion W2-7 7.6-7.7; ZonaDistancia, keys W2-11 11.3-11.5 (Correlativo key W2-9 9.5) |
| R-REF-8 | Correlativo W2-9 9.2/9.5; Chofer, Socio W2-12 12.1-12.5 |
| R-REF-9 | W2-9 9.2 |
| R-REF-10 | W2-6 6.2; every chain catalog W2-8, W2-9, W2-11 |
| R-REF-11 | monedas W2-7 7.5; tablas W2-10 10.2; familias-sunat W2-5 5.4; subfamilias-sunat W2-6 6.5; tipos-doc-venta W2-9 9.4; usuarios, trabajadores W2-11 11.2; tipos-doc-iden W2-12 12.3 |
| R-REF-12 / S-REF-39 | rows in 6.6, 7.6, 10.5, 10.6, 12.4; final 12.6 |
| R-REF-13 / S-REF-37 | harness W2-1a 1a.9; every slice parity task; final 12.6 |
| S-REF-1,2,3,4 | W2-2 2.6-2.7; S-REF-3 rows spread (tipos-descuento 3.5, condiciones-pago 4.4, empresa 8.4, ubicaciones 9.6, vehiculos 10.6) |
| S-REF-5 | W2-4 4.4 |
| S-REF-6 | W2-3 3.5 |
| S-REF-7 | W2-3 3.2, W2-8 8.6 |
| S-REF-8 | W2-6 6.6 |
| S-REF-9 | W2-5 5.5 |
| S-REF-10, 11, 32 | W2-8 8.4 |
| S-REF-12 | W2-4 4.5 |
| S-REF-13 | W2-8 8.5 |
| S-REF-14, 15, 16 | W2-9 9.5 |
| S-REF-17 | W2-11 11.3 |
| S-REF-18, 19 | W2-7 7.6 |
| S-REF-20 | W2-7 7.7 |
| S-REF-21 | W2-11 11.5 |
| S-REF-22 | W2-11 11.4 |
| S-REF-23 | W2-10 10.4 |
| S-REF-24 | W2-10 10.3, 10.5 |
| S-REF-25, 26, 27 | W2-12 12.1, 12.2, 12.4 |
| S-REF-28, 29 | W2-12 12.4-12.5 |
| S-REF-30 | W2-9 9.6 |
| S-REF-31 | W2-10 10.6 |
| S-REF-33 | W2-8 8.6 |
| S-REF-34 | CT template every catalog |
| S-REF-35 | W2-7 7.5, W2-10 10.2, W2-12 12.3 |
| S-REF-36 | CT template; final 12.6 |
| S-REF-38 | W2-1a 1a.8; every slice gate |
