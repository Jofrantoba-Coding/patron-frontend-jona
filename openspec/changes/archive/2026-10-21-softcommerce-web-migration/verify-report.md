# Verify report: softcommerce-web-migration (wave 1)

Mode: Strict TDD. Verified at branch `feat/softcommerce-w1c-5-inventory`, HEAD 19961f8, worktree `softcommerce-w1`, app `web_ts/softcommerce`.

## Verdict: PASS WITH WARNINGS (0 CRITICAL, 7 WARNING, 5 SUGGESTION)

## Gate (run by verifier)
- `npm test`: exit 0, 51 files / 413 tests passed (about 10 s).
- `npm run typecheck`: exit 0 (tsc app + node configs).
- `npm run build`: exit 0, 423 modules; `AppServicesMock-*.js` 10.56 kB is a separate lazy chunk; `index-*.js` 281.51 kB.

## Scenario coverage: 106 total = 103 COVERED, 3 PARTIAL, 0 MISSING
Every ID is mapped to at least one passing test (test names or describe blocks; S-CRUD-14/15 are in `UppercaseTextField.spec.tsx` without the ID in the name; S-MOCK-7/8/9/10/12/14 at core and HTTP level).

PARTIAL:
- S-CRUD-4 and S-SHELL-8 ("click or shortcut"): click path asserted (`CrudToolbar.spec.tsx`, `toolbarGate.spec.ts` canTrigger); the shortcut path is asserted only through the Impl `onAction` handler (`useCrudToolbarImpl shortcut path`). No key is bound, so the shortcut half is vacuous (apply-progress T7.4 and T8.3 deviations).
- S-LOC-1: behavior is asserted (inactive row hidden, empresa and ubigeo names resolved, `localidad.config.spec.tsx:14-24`), but with seed numbers 5 seeded/4 shown versus spec text "3 seeded, 2 shown". Spec text is stale, not the code.

## Task state
All tasks `[x]` except T1.6 (tasks.md:71) and T3.4 (tasks.md:89): gate/commit/PR housekeeping left to the orchestrator; gates were run and recorded in apply-progress. Not a code gap.

## TDD evidence (strict-tdd.md)
Cycle tables exist for all slices (T1.1 through T11.6). Rows without an observed RED: T9.6 (apply-progress.md:228), T10.4 (:253), T10.5 (:254), T10.6 (:255) (behavior built earlier in the previous task; mutation check substituted), T2.4 and T11.6 (no test: wiring/generation). Judgement: acceptable and honestly recorded; the mutation checks prove the tests can fail. Protocol-wise it is a WARNING (tests written after the code they cover).

## Findings

### CRITICAL
None.

### WARNING
1. Spec/artifact drift on `jona-ui` version: `proposal.md:39,68` and `tasks.md:66` (T1.1 text) still say 1.3.0; spec, design, package.json, lockfile and test say 1.4.0 (package.json:15, package-lock.json:2318).
2. S-LOC-1 spec text (3 seeded/2 shown) does not match the shared seed (5/4); update spec text (specs/softcommerce-localidad-catalog/spec.md:33).
3. Keyboard shortcuts for the CRUD toolbar are not bound; S-CRUD-4/S-SHELL-8 name "shortcut" without keys. Justified deviation (no keys specified), but the spec should be amended or a follow-up opened.
4. `CascadeSelect` swallows a failed level load as an empty list, with no error UI (apply-progress.md:263). S-CRUD-20 covers select/lookup failures only, so no spec violation, but a user cannot tell a failed load from an empty level.
5. RUP uc-01 and uc-02 labels are swapped versus code (confirmed): `rup/uc-01-iniciar-sesion.md:16`, `uc-02-seleccionar-contexto.md:16` and all six `diagrams/uc-01-*.drawio` / `uc-02-*.drawio` (colaboracion, robustez, secuencia) show `UiLoginView` as «view» calling `useUiLoginImpl` and rendering «visual» `UiLogin`. In code `UiLogin.tsx` (and `UiContexto.tsx`) is the entry that calls the Impl and renders the pure `UiLoginView`/`UiContextoView`. The MD also says the Impl gets the service from `useServices()`; code receives it as a `service` prop (`UiLogin.tsx:7`), only `useSession` is a hook (`UiLoginImpl.ts:29`).
6. Slice size over budget: slice 1 1200 lines (budget 800, apply-progress.md:24), slice 3 1004 lines (apply-progress.md:72 region). Recorded as risks; process warning only.
7. T1.6/T3.4 unchecked in tasks.md (see Task state).

### SUGGESTION
1. `inventory.csv` has no W4 rows: sales screens live in `view.formularios`, so the package-segment rule never yields W4 (apply-progress.md:291). Revisit wave rules before planning W4.
2. Register dialog renders only text/select/cascade fields (apply-progress T10.3 deviation); fine for Localidad, extend (date, number, checkbox) when W2 catalogs need them.
3. `JSidebarLayout` not used (apply-progress.md:150): justified, it only accepts a flat nav and cannot host `MenuTree`. Consider an upstream uijona issue.
4. Add the scenario ID to the `UppercaseTextField` test names (S-CRUD-14/15) for traceability.
5. T10.6 manual smoke in both modes not run (no dev server); do it at PR time.

## Design conformance spot checks (all pass)
- JONA units: Inter files hold labels only in `*_DEFAULTS` (no state values, flags or field values) in every Inter*.ts; callbacks value-first (`InterUiLogin.ts:24`); Impl hooks in `*Impl.ts`.
- `*View.tsx`: no `useState/useEffect/useRef/useMemo/useReducer`, no service or session imports (rg returned nothing).
- Services injected: no non-test, non-composer import of Http/Mock services; `main.tsx` composes, `ServicesProvider`/`useServices` and `service` props inject. `testkit.tsx` imports the mock (test support only).
- Domain free of React/session/views; only `domain/crud/listView.ts:1` has a type-only import of `Pagination` from services (minor coupling, no runtime import).
- `jona-ui` pinned exactly 1.4.0 (package.json, lockfile, `test/pinned-deps.spec.ts`).

## Doc drift resolved (after verify)
- WARNING 1: `proposal.md` (decision row, Dependencies) and `tasks.md` T1.1 now state the exact `jona-ui` pin `1.4.0` (bumped from 1.3.0, commit 04f0652); `design.md` JPagination note also names 1.4.0.
- WARNING 2: S-LOC-1 in `specs/softcommerce-localidad-catalog/spec.md` now states the shared seed (5 rows, 1 inactive, 4 shown); `tasks.md` T10.3 text aligned.
- WARNING 5: `rup/uc-01-iniciar-sesion.md`, `rup/uc-02-seleccionar-contexto.md` and the six uc-01/uc-02 `.drawio` files relabeled in place: `UiLogin`/`UiContexto` «entry» calls the Impl with the `service` prop (from `App`, services composed in `main.tsx`), `UiLoginView`/`UiContextoView` «visual» is the pure render; layout untouched.
