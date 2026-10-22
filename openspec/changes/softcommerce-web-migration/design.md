# Design: SoftCommerce Web Migration — Wave 1

## Technical Approach

A Vite + React 18 app in `web_ts/softcommerce` that consumes npm `jona-ui@1.4.0` (exact pin; bumped from 1.3.0 for the mobile-first release). It has three parts:

- Screens follow the JONA view-unit pattern from `appjona_codex_react_hooks` (`src/views/ui<caso>/`).
- Catalogs are config objects rendered by two generic JONA units: `uicrudlist` and `uicrudregister`.
- A zero-dependency mock server shares one **transport-agnostic core plus seed JSON** with the in-browser mock services. HTTP mode and mock mode then run the same rules on the same data (R-LOC-7).

## Architecture Decisions

| Decision | Choice | Rejected | Rationale |
|---|---|---|---|
| Layout | `src/{views,services,domain,session,shared/ui,catalogs}`, plus `mock-server/{core,http,data}` and `scripts/inventory` | Feature folders (`src/features`) | Matches the codex reference and JONAxMPC `views/ui<caso>` |
| Template vs. screen | Templates are JONA units parameterized by `CatalogConfig`. A complex screen (W3) wraps `useUiCrudListImpl(config)` and overrides handlers, the same way codex Impl overrides Template | One hand-written unit per catalog; inheritance-like HOCs | About 90 catalogs become config-only (S-CRUD-22) and still have a JONA override point |
| Service seam | Per-domain interfaces (`InterAuthService`, `InterShellService`, `InterLookupService`, generic `InterCatalogService<T>`) and **one** `serviceComposer` | One composer per domain | One set of `VITE_API_*` variables and one validation path. Domains are never mixed in W1 |
| Mock lazy-load | The composer returns `lazyService(load)` proxies whose methods `await import('./mock/AppServicesMock')` | Static import | Fixtures and seed stay out of the http bundle (S-AUTH-2) |
| Mock module layout | `src/services/mock/{AppServicesMock,seed}.ts` + `mock/fixtures/`, one module for all domains | Codex layout | **Intentional divergence.** Codex actually has `src/services/{InterAuthService,AuthServiceHttp,AuthServiceMock,authServiceComposer}.ts` + `src/services/fixtures/auth/`, with no `mock/` folder and one composer per service. Softcommerce needs one lazy chunk for several domains, so it groups the mocks under `mock/`. Patterns are copied, never imported |
| Single source of truth | `mock-server/core/*.js` (ESM, JSDoc, pure, receives seed) is used by `server.js` and by `AppServicesMock`. Seed is `mock-server/data/*.json`, imported by Vite and read by `fs` in Node | Separate fixture data per side; MSW | Removes drift. A parity suite runs the same scenarios against both sides |
| Scenarios | `exitoso` (seed), `vacio` (empty catalogs), `errorServidor` (every call rejects `ApiError` 500). Location: `src/services/mock/fixtures/*.fixture.ts` | Scenario per endpoint | Same typed-fixture shape as codex |
| Grid | App-local `CrudGrid` composed from `JTable`/`JTableRow`/`JTableHead` plus a `JPagination` footer. Rows support `onClick` (select) and `onDoubleClick` (details) | `JDataTable` | `JDataTable` has only `onRowClick`: no selection and no double-click. `JPagination` (`currentPage`, `totalPages`, `onPageChange`) ships in 1.3.0 (verified in `website-develtrex/node_modules/jona-ui`) and in the pinned 1.4.0 |
| List paging (R-CRUD-1) | **Client side is the source of truth in W1.** The list Impl fetches once with `list({page:1,pageSize:1000})`. Pure `applyListView(rows,{filter,sort,page,pageSize:20})` then filters, sorts and pages. A filter or sort change resets to page 1. If `pagination.total > items.length`, a "list truncated" warning shows | Server paging/filter per keystroke | W1 catalogs are small, and a single fetch keeps filter and sort consistent across pages. The API's `page`/`pageSize`/`<field>=` stay in the contract (S-MOCK-7) for later waves |
| Menu | Local `MenuTree`, a recursive tree built by pure `buildMenuTree(flat)` | `JSidebarLayout` | That layout supports only two flat levels and cannot collapse |
| Tabs | `JTabsList`/`JTabsTrigger` for headers. Panels are rendered by the shell, all mounted, with inactive ones `hidden` | `JTabsContent` | **Verified:** `JTabsContentView` returns `null` when inactive (`web_ts/uijona/src/molecules/JTabs/JTabsView.tsx:126`), so it unmounts and would lose state (S-SHELL-10/11) |
| Esc / dialog stack (R-SHELL-6) | A shell `DialogStackProvider` holds an id stack. A `window` keydown listener in the **capture** phase snapshots the top id. Every app dialog passes a guarded `onClose`/`onCancel` that acts only when its id equals that snapshot. The guard applies only to Esc; clicks are unaffected | Relying on jona-ui Esc | **Verified:** `JDialogImpl.tsx:16` and `JOptionPaneImpl.tsx:11` each add their own `document` Esc listener, so one Esc would close every open dialog. A tab never closes on Esc |
| Session | `sessionStorage` key `softcommerce.session.v1`. The step-1 result stays in memory only | `localStorage` | Session is per browser tab. A reload during step 2 returns to step 1. The period is immutable |
| Tests | Vitest only. Node environment for core, server and inventory; jsdom for UI. The mock server has its own `package.json` with no dependencies, but its tests run from the app | `node:test` for the mock server | One `npm test` per PR (success criterion) |
| Inventory | Node ESM, `readFileSync().toString('latin1')`, then a **header scanner** (see Inventory Rules) | A cross-class lazy regex; a Java parser dependency | A lazy `class…extends` match can attach a later class's `extends` to an earlier class. Scoping to the header up to `{` prevents that, with zero dependencies |

## Data Flow

    View ─► Impl(hook) ─► useServices() ─► serviceComposer
                                   ├─ http: httpClient(fetch) ─► mock-server/http ─┐
                                   └─ mock: lazy import AppServicesMock ───────────┤
                                                                     mock-server/core + data/*.json

`httpClient` injects `X-Tenant-Id` (from the session, or explicitly at login), a generated `X-Correlation-Id`, and `Authorization: Bearer`. It maps the error body to `ApiError{status,code,message,details,traceId}`. Mock mode throws the same `ApiError`.

## Mock API Contract

| Route | Notes |
|---|---|
| `GET /auth/session-options` | Public. `{items:[{id,name}]}` |
| `POST /auth/login` `{usuario,clave}` | 200 `{token,user}`. 401 `INVALID_CREDENTIALS`. 403 `USER_DISABLED` / `NO_DESKTOP_ACCESS` |
| `GET /menu` | `{items: MenuDinamico[]}` (flat). The client builds the tree |
| `GET /forms/{formId}/permissions` | 13 booleans. An unknown form returns all `false` |
| `GET /v1/{catalog}?page&pageSize&<field>=` | Envelope. `pageSize` default 20, max 1000. Inactive records are excluded. Localidad rows return display names already resolved |
| `GET/POST/PUT/DELETE /v1/{catalog}/{id}` | 201 / 200 / 204. DELETE is logical (`activo:false`). `?physical` returns 405. Validation errors return 422 with `details:[{field,message}]` |
| `GET /v1/ubigeo?parent=` | INEI codes. The parent level is derived from code length. An unknown parent returns `[]` |
| `GET /v1/empresas`, `GET /v1/puntos-venta?id_empresa=`, `GET /v1/params` | Lookups and flags. Puntos de venta are filtered by empresa (S-AUTH-10) |
| `POST /__mock/reset` | Restores the seed (R-MOCK-8) |

All non-public routes require `X-Tenant-Id` (400 `TENANT_REQUIRED`, 404 `TENANT_NOT_FOUND`). Every error's `traceId` equals the response's `X-Correlation-Id`, which is echoed from the request when present.

## Interfaces / Contracts

```ts
type ApiMode = 'mock' | 'http'; // VITE_API_MODE, VITE_API_SCENARIO, VITE_API_URL
interface InterCatalogService<T> { list(q?: ListQuery): Promise<Page<T>>; get(id: string): Promise<T>;
  create(v: Partial<T>): Promise<T>; update(id: string, v: Partial<T>): Promise<T>; remove(id: string): Promise<void>; }
type FormPermissions = Record<'add'|'modify'|'eliminate'|'nullify'|'clone'|'details'|'search'|'report'|'export'|'print'|'printFast'|'close'|'refresh', boolean>;
type CrudAction = 'add'|'modify'|'eliminate'|'clone'|'details'|'search'|'refresh'|'export';
type FieldConfig =
  | { kind: 'text'; name: string; label: string; required?: boolean; maxLength?: number; uppercase?: boolean }
  | { kind: 'select'; name: string; label: string; required?: boolean; lookup: 'empresas' }
  | { kind: 'cascade'; name: string; lookup: 'ubigeo'; levels: { name: string; label: string }[];
      ancestorsOf: (leafId: string) => string[]; required?: boolean };
interface CatalogConfig<T> { formId: string; title: string; catalog: string; idKey: keyof T & string;
  columns: { key: keyof T & string; header: string; sortable?: boolean }[]; fields: FieldConfig[];
  actions?: CrudAction[]; } // toolbar order; default excludes 'export'
```

The tab workspace is a pure reducer: `{tabs:{formId,title}[]; activeId}` with actions `open` (re-select if present), `select`, and `close` (activate the neighbor). Each tab's FormHost loads its permissions once on mount. Any failure denies all actions (fail closed).

## Template Behavior

- **Toolbar gating (R-CRUD-2).** `CrudToolbar` renders only `config.actions`. An action is enabled when `flag && (!rowDependent || selectedId) && implemented`. `export` is a proposal non-goal, so it is not implemented in W1: when configured it renders disabled with a "not available" tooltip. Shortcuts go through the same gate (S-CRUD-4).
- **Max length and uppercase (R-CRUD-6).** This mirrors the Swing `view/controles/UpperCaseNumberDocument.java` that `RegisterLocalidad` uses with 100. The app-local `UppercaseTextField` builds the next value by replacing the selection range `[selectionStart, selectionEnd)` with the inserted text, uppercased when `uppercase` is set. If `maxLength` is set and the next value is longer than it, the **whole insertion is ignored**: the previous value stays, and there is no truncation and no error. Typing and paste follow the same rule. `normalize` re-applies uppercase on submit as a defense, and `validate` still checks the length for values that arrive from the server.
- **Focus first invalid (R-CRUD-6).** `validate(config, values)` returns errors in `config.fields` order. The register Impl keeps a name→element ref map, and after a blocked submit it focuses the first error's element. For a cascade, that is the first unset level.
- **Reselect after refresh (R-CRUD-5).** The register resolves `{id}`: `create`'s returned id, or the edited id for update. The list Impl stores the selection **by id**, refreshes, then selects that id and moves to the page that contains it. After a delete the row is gone, so the selection is cleared.

## Shell Behavior

- **Unknown leaf (R-SHELL-2).** If `formRegistry[nombre]` is missing, the shell opens a `JOptionPane` info notice ("<descripcion>: not available yet"). No tab opens. The notice is registered in the dialog stack.
- **Header (R-SHELL-5).** The `ShellHeader` view shows user, empresa, punto de venta, the period as `dd/MM/yyyy – dd/MM/yyyy` (read-only), and Logout. It has no period control (S-AUTH-17).
- **Stub form.** W1b registers `demo_stub` in `formRegistry`: a minimal form with one filter input, so S-SHELL-10/11 are testable before Localidad exists. W1c-4 replaces it with `mi_localidad`.

## Inventory Rules (R-INV-1/3/4)

1. **Scanner.** Strip block and line comments, string literals and char literals. For each `(?<![.\w])class\s+(\w+)`, the header is the text up to the next `{`, with generics `<…>` removed. `extends` and `implements` are read **from that header only**. Every class feeds the base map. A row is emitted only for the file's top-level class (name = file basename).
2. **GUI filter.** The base chain must resolve transitively to a Swing root (`JFrame|JDialog|JInternalFrame|JPanel|JComponent`).
3. **Exclusions.** A class is excluded when any of these holds:
   - its name is one of the 8 base classes;
   - its path is under `shared/util/render/` and its name starts with `PnlRenderer`;
   - its path is under `view/tablemodel/` or `view/conta/tablas/`;
   - it is a combo model: path under `view/comboboxmodel/`, a name starting with `ComboModel`, or a chain/implements containing `ComboBoxModel|DefaultComboBoxModel|AbstractListModel`.
4. **Category** (first match wins):
   1. a name containing `Buscar` → search/lookup;
   2. a chain containing `AbstractRegister|JHDialog`, or a name starting with `Register` → register dialog;
   3. a chain containing `JHInternalFrame` and a name starting with `PanelTF` → list frame;
   4. a name starting with `Form|Frm`, or a chain containing `JInternalFrame|JDialog|JFrame` → process/detail form;
   5. anything else → other.
5. **Wave** (table `WAVE_RULES` in `lib.mjs`, first match wins):
   1. `PanelTFLocalidad`/`RegisterLocalidad` → W1;
   2. by package segment: `ventas|reparto` → W4, `compras|inventario|importar` → W5, `conta|tesoreria|cxc|cxp` → W6, `reportes|libros|sunat|ple` → W7;
   3. list frame, register dialog or search/lookup → W2;
   4. anything else → W3.

## File Changes (all Create, under `web_ts/softcommerce/`; estimates include tests; each slice ≤720 lines, so ≥10% margin under 800)

| PR | Files | ~Lines |
|---|---|---|
| W1a-1 scaffold + mock core | `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.env.example`, `src/main.tsx`; `mock-server/package.json`; `mock-server/core/{store,auth,catalog,ubigeo,errors}.js`; `mock-server/data/*.json`; core unit specs | 450 |
| W1a-2 mock HTTP | `mock-server/{server.js,README.md}`, `mock-server/http/app.js`, S-MOCK-* integration specs | 420 |
| W1a-3 service seam | `src/services/{ApiError,httpClient,lazyService,serviceComposer,InterAuthService,AuthServiceHttp}.ts`; `src/services/mock/{AppServicesMock,seed}.ts` + `fixtures/` | 430 |
| W1a-4 auth UI | `src/session/{sessionStore,SessionProvider,RequireSession}.ts(x)`; `src/domain/period.ts`; `src/views/{uilogin,uicontexto}/*`; `src/App.tsx` | 600 |
| W1b-1 shell domain | `src/domain/{menuTree,permissions,workspace,dialogStack}.ts`; `src/services/{InterShellService,ShellServiceHttp}.ts`; `src/shared/ui/MenuTree/*` | 450 |
| W1b-2 shell UI | `src/views/uishell/*` (header, FormHost, DialogStackProvider), `formRegistry.ts`, `src/views/uidemostub/*` | 560 |
| W1c-1 list foundations | `src/catalogs/CatalogConfig.ts`; `src/domain/crud/{filterSort,listView,toolbarGate}.ts`; `src/services/{InterCatalogService,CatalogServiceHttp}.ts`; `src/shared/ui/CrudToolbar/*` | 480 |
| W1c-2 list view | `src/shared/ui/CrudGrid/*` (with JPagination); `src/views/uicrudlist/*` | 560 |
| W1c-3 register template | `src/domain/crud/{validate,normalize}.ts`; `src/shared/ui/UppercaseTextField/*`; `src/views/uicrudregister/*`; **S-CRUD-7** test (double-click → DETAIL), moved here because DETAIL exists only from this slice | 650 |
| W1c-4 Localidad | `src/services/{InterLookupService,LookupServiceHttp}.ts`; `src/shared/ui/CascadeSelect/*`; `src/catalogs/localidad/localidad.config.ts`; registry swap; `test/parity.spec.ts` | 640 |
| W1c-5 inventory | `scripts/inventory/{lib.mjs,inventory.mjs,inventory.spec.ts}`; `inventory.csv` (generated, excluded from count) | 320 |

The old "W1c-2 register + Localidad" slice is now split into W1c-3 and W1c-4. The orchestrator's "S-CRUD-7 → W1c-2" therefore lands in **W1c-3** (the register slice).

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit (node) | Period rules, `buildMenuTree`, workspace reducer, dialog stack, permission and toolbar gating, `listView` paging, validate/normalize/filterSort, max-length insertion (type, paste over a selection, overflow ignored), composer (env errors, `vi.dynamicImportSettled`), `httpClient` headers/errors, core rules | RED first. Pure inputs and outputs |
| Integration (node) | Mock server on port 0 with real `fetch` (S-MOCK-*). Parity: `describe.each(['mock','http'])` runs S-LOC-2/7/13 at service level | Reset between tests |
| Component (jsdom) | Impl hooks with injected fake services; templates with Localidad config and a minimal second config; cascade stale response via deferred promises; Enter/Esc with nested dialogs (only the top closes); focus first invalid; reselect by id; tab re-select keeps the stub's filter | RTL + `@testing-library/user-event` (pinned) |
| Inventory | Latin-1 fixtures written to a temp dir; multi-line `extends`; two classes in one file (no cross-attribution); category and wave tables; exclusions; byte-identical reruns; missing root; unreadable file | Node |
| E2E | None in W1. Manual smoke with `npm run mock` + `npm run dev` | — |

## Threat Matrix

N/A — no routing (in the threat-matrix sense), shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. The inventory script only reads the Java tree and writes one CSV.

## Migration / Rollout

No migration required. The work ships as eleven chained PRs. Each one is revertible on its own, in reverse order.

## Open Questions

- [x] Mode naming: the spec now uses `http` (codex uses `real`). Variables are `VITE_API_*`.
- [ ] Eleven slices instead of the proposal's four, to keep every PR ≤720 lines with tests included.

## RUP alignment

Wave 1 combines SDD with RUP: Inception = explore + proposal, Elaboration = spec + design, Construction = apply + verify over the 11 chained PRs (one iteration each), Transition = archive. The RUP artifacts (use-case model, use-case specifications, robustness/collaboration/sequence diagrams, JONA frontend class view and the use case → scenario → task matrix) live in [rup/README.md](rup/README.md). They trace this design; they do not change it.
