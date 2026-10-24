# Design: SoftCommerce Web Migration — Wave 3 (Rich Masters)

## Technical Approach

W3 extends the W2 registry. It does not replace it. Every capability is a **declaration** in `mock-server/registry/schema.js`:

- it is enforced by the shared core (`mock-server/core/*`), which both the server and the in-browser mock use;
- it is interpreted by the generic UI (`src/catalogs/registry.ts`, `src/views/*`).

The declarations are:

- `children` (G11);
- `actions` (G12);
- the `lookup`, `password` and `textarea` kinds;
- `search`;
- `gate` (company parameters);
- named pickers;
- a closed set of named rules: `docIdentidad`, `activacion` and `padron`.

Masters are data. There are two custom screens, both listed in R-REG-19 (`mi_SeguridadPerfil` and `miAccionSocio`), plus one toolbar panel, `uiautorizarseries`. There are three custom mock resources: `socio-acciones`, the perfil grant routes and the Autorizar Series actions over a shared store. W2 D1–D19 still hold. The specs under `specs/*/spec.md` are binding. Where this design needs a spec change, it is listed under "Spec corrections".

## Resolved desktop facts (evidence)

| Fact | Resolution | Evidence (`desktop_java/softcommerce-desktop/src/com/develtrex/softcommerce/…`) |
|---|---|---|
| Perfil model | The perfil is the W2 `tipos-trabajador-perfil` table. The chain is user → trabajador → perfil, and the user row holds no perfil | `view/formularios/FormMenuPerfilArbol.java:93,218-221,298-305` (lists `BeanTipoTrabajadorPerfil` and loads `cargaMenuPerfil(id_tipo_perfil)`); `RegisterTrabajador.java:389-391` (the trabajador carries the perfil); `RegisterUsuario.java:54-58` (the usuario picks a trabajador) |
| Grants on the desktop | Read per user and per form on every form open | `Main.java:2780` (`cargaFormularioPerfil(usuario.getId_usuario(), "PanelTFGuiaRemision")`); `model/ora/repository/impl/DAOUsuario.java:669,758` |
| FormAnexoActivacion | One `fecha` (Fecha Inicio for Activar, Fecha Fin for Desactivar) and `motivo` (uppercase, 100). Title `Activar`/`Desactivar {anexo}`. `Ingrese Motivo` | `FormAnexoActivacion.java:61,70,82,89,121` |
| Activation row shape | One row: `id_activacion`, `f_inicio`, `f_fin`, `estado`, `motivo_activacion`, `motivo_desactivacion`. A deactivation **updates** the active row (op) and does not add one | `RegisterClienteNuevo.java:1060-1070` |
| FormAnexoPadron | `Agregar Padron`: one padrón combo. Messages: `Seleccione Padron`, `Padron ya se Encuentra Activado`, and the two incompatibility texts | `FormAnexoPadron.java:67,81,136,147,152,157` |
| Composite save | The desktop sends only the changed child rows, each with `OPERACION`, in one parent call | `RegisterClienteNuevo.java:1078-1097`; `FormAccionSocio.java:248-281` |
| CLONE and children | The desktop `loadRegister` loads the activation rows in every non-INSERT mode, CLONE included, and inserts with op `I`. Spec R-MD-9 overrides this: CLONE drops the children | `RegisterBancoAnexo.java:759-789,835-840` |
| ClienteNuevo addresses | **No** "at least one dirección" rule. `isRegisterValid` checks tipo doc, the names, descripcion, tipo cliente, nacionalidad and días | `RegisterClienteNuevo.java:1525-1625` |
| Socio acciones | **No parent.** Two global lists (`listarAccionPrecio()`, `listarAccionSocio()`) are saved together in one call, so no second nesting level is needed | `FormAccionSocio.java:69-72,181-183,248-281` |

## Architecture Decisions

| # | Decision | Rejected | Rationale |
|---|---|---|---|
| D1 | **Search (R-MOCK-20).** `listCatalog` takes `q` out of the query and splits it on whitespace. Every term must be contained (literal, case-insensitive) in some field of the entry's `search` list. The other keys are contains filters over fields or joined keys (R-MOCK-9) and the exact keys of R-MOCK-16; an unknown key answers 400 `INVALID_FILTER`. `q` on an entry with no `search` returns an empty list. Results are **active records only**, paged with the R-MOCK-3 envelope | `?in=`; `q` over all columns | Spec |
| D2 | **Named pickers.** `registry/pickers.js` holds the 7 configs: buscarTrabajador, panelCargarTrabajador, buscarCliente, formClienteBuscar, formBuscarVehiculo, buscarParametroProv, buscarItemConversion. Each config is `{title, source, columns, filters, pickLabel, extras?, refresh?}`. A `lookup` field names one (`picker:'buscarTrabajador'`), and at load the schema expands it into the R-REG-13 attributes (`search`, `columns`, `filters`). A host may pass `veto` and `preset`. A lookup with no desktop dialog declares `search`, `columns` and `filters` inline (R-REG-13). The Vehiculo `Propietario` over `transportistas` does this in W3-10: Código and R. Social filters, columns code, razón social and RUC. A lookup may declare `fill: {targetField: sourceKey}` together with `fillReadOnly: [...]`. PanelCargarTrabajador (W3-9) uses it to fill the six fields of R-MST-9 (`Nombres`, `Dirección`, `Numero`, `Telefono Fijo`, `Telefono Movil`, `Codigo Trab.`) and to make `Nombres`, `Dirección` and `Numero` read-only; the server stores the copied values | Picker attributes repeated on every field | One config per desktop dialog. The 4 pickers with no consumer are tested by a harness host |
| D3 | **Lookup display.** For each `lookup` the schema derives a join `{as: display, ref: name, display: target optionLabel}`. UPDATE, DETAIL, DELETE and CLONE restore the description from that join (R-CRUD-19) | A client `get(id)` | Reuses W2 joins (R-REG-8) |
| D4 | **The lookup UI.** `shared/ui/LookupField` shows a code box, a read-only description, `…` and a clear button. A typed code resolves on blur (R-LKP-6: when the target `codeWidth` is 10, a code shorter than 10 characters and **not exactly 8 characters** is left-padded to 10; a code of 8 characters is kept as typed. Then an exact active match fills the field; a miss opens the dialog). `shared/ui/LookupDialog` is `JDialog` with filter inputs, `CrudGrid` and `JPagination` (page size 10) on `dialogStack`. Behavior: a filter change goes back to page 1 and selects the first row, and stale responses are dropped (latest-token, `dependentChain`). Keyboard per R-LKP-4: Enter moves to the next filter and then to the first row; Enter or a double-click picks; the pick button is disabled with no selection. `const { open, dialog } = useLookup()` serves W4: `open(picker, {preset, veto})` resolves with `{row, extras}` (or `undefined` on cancel) and the host renders `dialog`. Editing the code of a resolved field drops the picked record until the code resolves again. The description of a lookup is register state (`lookupDisplay`), never a form value, so it is not sent | A jona-ui change | jona-ui 1.5.1 has `JDialog`, `JPagination`, `JTabs`, `JTextArea`, `JTextBox`, `JComboBox` |
| D5 | **Children (R-REG-14).** An entry declares `children: {name: ChildDef}`. At load each child expands into an internal entry with slug `parent/name`, which no single-segment route can reach. It reuses the W2 refs, unique, joins, messages and order, and inherits the parent's scope, stamp, formId and flags. Child seeds sit inside the parent seed rows and are split into the child section at snapshot. `store: {entry, key}` makes a child a **filtered view of an existing top-level section** (`vehiculos` by `id_anexo_empresa_transportista`, `usuario-correlativos` by `id_usuario`), so there is one store. **One nesting level** (Socio acciones needs none, see the facts above) | Separate `childOf` entries; grandchildren | Spec shape and desktop evidence |
| D6 | **Composite write (one shape, the spec's R-MOCK-19).** The parent `POST`/`PUT` carries `children: {<child>: [{id?, op:'I'\|'A'\|'E', ...fields}]}`, **only the changed rows**, as the desktop XML does. `core/children.js` validates the parent, then each op in child order and then list order (fail-first, W2 D10), then the named rules (`activacion`, `padron`), and only then writes, so the write is atomic. A detail is `<child>[<n>].<field>`, where `n` is the index in the **sent** array | A full-list replace (the earlier draft); writing children separately | Matches the spec and the desktop. Index semantics are explicit |
| D7 | **Nested routes (R-MOCK-19).** `GET\|POST /v1/{c}/{id}/{child}` and `GET\|PUT\|DELETE …/{child}/{cid}` exist for every child. DELETE follows `removal`: `deactivate` sets `estado:'D'`, `delete` is the logical delete. The parent is checked once (unknown, deleted, other tenant or empresa gives 404). A gated-off child answers 404 (R-REG-17). `actions` is a reserved name | Writes only for some children | Spec |
| D8 | **Uniqueness among active siblings (R-MD-6).** The child `unique` is scoped by the parent and ignores rows with `estado` `D` or logically deleted ones. It answers 409 `DUPLICATE` with the literal message. The client checks pending and persisted active rows with the same pure function (`core/unique.js`) | — | Spec |
| D9 | **Cascade (R-MD-7).** A logical parent delete logically deletes **every** child row, deactivated ones included. For a store child it marks the rows of the shared section (the series of a deleted usuario) | Per-child `onParentDelete` | Spec |
| D10 | **Master register UI.** A new JONA unit, `views/uimasterregister`, reuses `useUiCrudRegisterImpl` (file `UiCrudRegisterImpl.ts`) through a `RegisterExtension` seam: `{restore?() → Promise (the persisted child rows, run beside the record's own load), dirty?(), payload?() → {children}, firstError?(fieldName), childErrors?(errors) (the `<child>[<n>]` failures, `[]` when a save starts), embedded? (an inline entry: no dialog-stack slot, a valid submit executes without asking)}`; the register View gains an `arrange(nodes)` slot so the master lays the same keyed field nodes into tab panels. `useChildDraftsImpl` keeps one pending-op list per child; `quitar` follows the removal kind (R-MD-4). **All tabs stay mounted** (R-MD-1). jona-ui `JTabsContent` returns `null` for an inactive panel (`web_ts/uijona/src/molecules/JTabs/JTabsView.tsx:126`), so the register uses `JTabs`/`JTabsList`/`JTabsTrigger` only for the trigger list. It renders every panel itself as a `div role="tabpanel"` with `hidden` when inactive; jona-ui does not change. The active tab is lifted into the master Impl. On a failed submit the Impl first sets the tab that owns the first failing field (a field → tab map built from `layout`) and focuses the field after the panel becomes visible (an effect keyed on tab and field). W3-5a adds component tests for S-MD-1 (first-error tab plus focus) and S-MD-2 (pending rows survive tab switches). A child dialog is the unchanged `UiCrudRegister` over a `DraftCatalogService` that **only validates and returns the row**, never sending a request (S-MD-4). `entry:'inline'` renders the child fields above the grid through the same register hook (`embedded`) and a View without its dialog (`inline`); its own `Agregar` validates in place and remounts the entry so it starts from its defaults. A failed save keeps the drafts and switches to the tab named by the `<child>[<n>]` detail. UiCatalog picks this unit when `config.children` exists | Rewriting UiCrudRegister | W2 register specs stay untouched |
| D11 | **Restore and CLONE.** UPDATE, DETAIL and DELETE load the parent and every gated-on child in parallel, active and deactivated rows. **CLONE drops the children** (R-MD-9, a deviation from `RegisterBancoAnexo.java:788`); the server then creates the initial `INICIO` activation | Copying children | Spec |
| D12 | **Actions (R-ACT-1, R-REG-15).** Declared as `{id, label, placement, flag, enabledWhen, dialog?, kind:'deferred'\|'immediate', confirm?, server?}`. A `deferred` action changes a pending op through a pure client hook of the named rule. The endpoints (R-MOCK-22) are `POST /v1/{c}/{id}/actions/{a}` and `…/{child}/{cid}/actions/{a}`, plus the collection form `…/{child}/actions/{a}` (see Spec corrections). They run the same rule in one write and return the row. 409 `ACTION_NOT_ALLOWED` carries the entry's message (the server rule message, for example `Banco ya Esta Activado`); invalid input gives 422. `enabledWhen` is `{modes, selection, row, noRow}` over the shared evaluator (`actionHolds`, `resolveRowAction`), the flag defaults to `modify`, and there are no Alt shortcuts. A deferred action names a client `rule` (`domain/crud/actionRules.ts`: optional `guard`, `apply` returning `{insert, change, parent}`); an immediate one names a `server` hook (`core/actions.js` `ACTION_HOOKS`). The endpoints answer `{row, parent?, message?}`. A rule claims a field it derives with the entry-rule hook `owns` (S-ACT-8). The service lives in `InterActionService` (S-LOC-17 pins `InterCatalogService`) | Inline functions | Serializable and shared |
| D13 | **The anexo preset.** `presets.anexo({entity, tipoAnexo, padron?})` returns: the child `activaciones` (removal none; the columns of R-ANX-1); the deferred actions Activar and Desactivar with their guard messages; the rule `activacion` (one active row, `fecha_fin ≥ f_inicio`, `INICIO` on create, legacy rows treated as active, `estado` derived from the last row and ignored in bodies); and, with `padron`, the child `padrones`, the rule `padron` (same-padrón and incompatibility checks, `03` included) and the derived read-only flags (R-ANX-8). It also sets `codeWidth` 10 and the constant tipo anexo. The tipo-anexo ids of Banco and Trabajador are not in the repository. They are seed **placeholders**, declared once in `presets.js` (`TIPO_ANEXO.banco`, `TIPO_ANEXO.trabajador`) and marked `[INFERRED]`, to be replaced when W6 confirms them. It is used by Banco, Trabajador, Vendedor, Transportista, Cliente, Proveedor and Chofer (R-ANX-10: Chofer seed rows gain `INICIO`). **Applied in W3-7:** `presets.anexo({ entity, tipoAnexo })` returns the fragments `{ codeWidth, constants: { id_tipo_anexo }, rules: [activacion], actions, children: { activaciones } }` that an entry spreads (the padron pieces come with W3-15). The Banco tipo anexo is `"3"` (`PanelTFBanco.cargarTabla` lists `listAnexo("3")`), so `TIPO_ANEXO` holds only `banco` until W3-8. The rule is split in `core/activacionRule.js` (pure: `checkOps`, `applyOps`, `lastIsActive`, the entry rule that owns `estado`) and `core/activacion.js` (the child hook run through `CHILD_RULE_HOOKS`, which now also returns an after-write settle step, and the real action hooks `activarAnexo` / `desactivarAnexo`, served on the entry actions of placement `api`). The client side is `domain/crud/anexoRules.ts` (`check` before the dialog, `guard` inside it, `apply`) with the entity word in the action `params`. | Per-master copies | Built once |
| D14 | **Autorizar Series (R-PRM-6/7).** `usuarios.children.series` uses `store: {entry:'usuario-correlativos', key:'id_usuario'}` and has no tab. The W2 entry gains the server-managed `fecha_inicio`/`fecha_fin` (stored-only, `fecha_inicio` set on create) and keeps `habilitar` as the estado. The immediate actions are `activate` (collection form: it creates the row, derives `id_localidad` from the punto de venta, and re-activates a deactivated pair or answers 409 with the W2 unique message) and `deactivate` (row form). The panel `views/uiautorizarseries` opens from the Usuario list toolbar (an entry action `placement: list-toolbar`, `rule: autorizarSeries`, mapped to the panel in `views/uicatalog/listPanels.ts`; the child has `tab: false`) | A second table | One store |
| D15 | **Users master over `backing: 'users'`** (`registry/backings.js`, a closed set; it replaces `project:'users'`). Rows stay in `store.shared.users`, filtered by tenant. A create gets the next integer id and the session tenant. Every read and every error omits `clave`, `clave_hash`, `clave_confirmacion` and `tenants`. `nombre` is derived from the trabajador. The flags `flaghabilitado` A/D and `flagEscritorio`/`flagWeb`/`flagContable` S/N **default OFF** (R-MST-7). A duplicate `usuario` gives 409. A logical delete makes login answer 401 | A copied section | Single source |
| D16 | **Password (R-CRUD-17, R-MOCK-23).** Kind `password` (`max` required, `confirm` defaults to true). The wire carries `clave` and `clave_confirmacion`. The server checks presence on create, max 20 and equality (422 on `clave_confirmacion`), and a blank value keeps the stored one. It stores only `clave_hash`, a sync pure-JS SHA-256 (`core/password.js`), salted with `id_usuario`. Seed plaintext is hashed at snapshot, so `users.json` is unchanged and login has one compare path. The UI never prefills it, offers show/hide, and does not render it on DETAIL or DELETE | WebCrypto (async) | — |
| D17 | **Grants (R-PRM-5, R-AUTH-11).** A tenant section `perfil-overrides` holds `{id_tipo_perfil, kind:'menu'\|'form', key, flag?, value}`. The effective grants are the seed defaults (`menu.json`, `permissions.json`, both unchanged) overlaid with the overrides of the perfil reached through user → `id_trabajador` → `id_tipo_perfil`. With no user, no trabajador or no overrides, the defaults apply (W1 is byte-identical). `getMenu`/`getPermissions(store, x, ctx?)` resolve through `X-User-Id`. The perfil routes are **custom routes**, the third custom resource next to `socio-acciones`. They live in `core/grants.js` and are wired in `http/app.js` and `AppServicesMock`, ahead of the generic routes: `GET\|PUT /v1/tipos-trabajador-perfil/{id}/menu`, `GET\|PUT …/permisos` and `GET\|PUT …/permisos/{formId}`. They require `X-Tenant-Id` (400 without it). An unknown perfil gives 404. An unknown menu node, formId or flag gives 422 with a detail. `menu` and `permisos` join `actions` as reserved child names (R-REG-20). **Snapshot at login:** step 2 fetches the menu and `GET /forms/permissions` (a batch map) into the session, and `ShellService.permissions(formId)` reads the snapshot, so edits apply at the next login | Per-open fetch (the desktop's way; it breaks S-AUTH-26) | User decision |
| D18 | **Seguridad Perfil screen** (`views/uiseguridadperfil`, formId `mi_SeguridadPerfil`). It has a perfil list with filters, a menu tree of per-node checkboxes with **no propagation** (built with `domain/menuTree`), a per-node 13-flag dialog with its guards, and the perfil × form matrix. A JONA unit per panel. `PUT` sends only the changed cells; mobile uses `JAccordion` rows | A generic editor | A custom screen per R-REG-19 |
| D19 | **Textarea** is a kind (R-REG-13). The core treats it as `text` (max, normalize); the UI renders `JTextArea` (4 rows), and Enter does not submit | `display` on text | Spec |
| D20 | **Promoted lookups.** `usuarios` and `trabajadores` keep their slug, `idKey`, `optionLabel` and W2 row keys. `trabajadores.nombre` is derived. UsuarioCorrelativo keeps its select. TrabajadorPuntoVenta's `id_trabajador` becomes a lookup (R-LKP-8). The W2 parity suites run before the swap in the same PR | — | Spec |
| D21 | **Stubs (R-MOCK-25).** `cuentas-contables` (no W3 consumer), `parametros-prov`, `clases-sunat` and `padrones` are read-only lookups. The Cliente `Cuentas` child uses `tablas-detalle-sunat` `where {id_tabla_sunat:'3'}` | — | Spec R-MST-11 |
| D22 | **Inventory (R-INV-7..11).** `scripts/inventory/wave-overrides.json` maps 51 classes to `W1`..`W7`, `shell`, `infra` or `drop`, and `waveFor` checks it first. A stale class, a duplicate key or a bad value exits non-zero. The CSV is regenerated from `desktop_java/softcommerce-desktop` | An `.mjs` map; patching the CSV | Spec |
| D23 | **Item MVP.** Tabs `Datos de Item` (with the fields gated by `ISBOTICA`/`IS_BOTICA_SIN_LOTE` and the six prices gated by `IS_ITEM_RESUMEN_PRECIO`) and `Configuracion Almacen` (child `almacenes`, removal `deactivate`, unique active (almacén, proceso)). No unidades or precios child grids | Unit/price grids | R-MST-14/15 |
| D24 | **UI placement.** Generic units go in `src/views/*` and `src/shared/ui/*`. Custom screens are view units registered by hand in `formRegistry`: `uiseguridadperfil`, `uisocioacciones`, `uiautorizarseries`. No `src/features/masters` | Proposal wording | Masters are data |
| D25 | **Company gates (R-REG-17, R-MOCK-24).** `params.json` gains the W3 keys. Any boolean params key, W1 keys included (`ISBOTICA`), may be a `gate.param`. `PORC_IGV` is a number: it is a value source (`$params.PORC_IGV`), never a gate, and the schema rejects it as `gate.param`. `gate: {param, in?}` on a field, tab, child or action is resolved from the session params by the UI and from the tenant params by the server: a gated-off field is ignored in the body, and a gated-off child gives 404 | — | Spec |
| D26 | **Socio acciones (R-MOCK-26).** A custom resource, `GET\|PUT /v1/socio-acciones` with `{precios, socios}` op lists. The core (`core/socioAcciones.js`) validates the two op lists against a working copy and commits them together, so nothing persists on any failure. A new price is applied to every active socio. **Applied in W3-20 [DEVIATION]:** it does NOT reuse `core/children.js` (that module needs registry child entries under a real parent; two flat lists with their own five rules are smaller and clearer as a self-contained core). The seed `data/catalogs/socio-acciones.json` (`{ tenant: { precios, socios } }`) is merged by the app builders (`withSocioAccionesSeed`), not by `loadSeed` / the browser `seed`, because the W1/W2 suites pin those loaders' key sets | A second nesting level; parent socios | Desktop has no parent |
| D27 | **Derived values**, declared with the W2 primitives plus one new one. **(a)** `aggregate: {as, child, op:'count'\|'sum', field?, where?}` on the parent. The server computes it in `enrich` for list and get. The UI recomputes it from the drafts (pure `core/aggregate.js`). It is never sent. Uses: `CANT_SUST` = count of active `sustitutos`; `credito` / `credito_temp` = sum of `monto` over the `creditos` rows of each kind (W3-17). *Applied in W3-17:* `as` may name a `number` field (the Credito totals), the server computes in `enrich`, `pickWritable` skips the names, and the register overrides the value of such a field from its drafts; the Cliente keeps two credit children (`creditos`, `creditos_temp`) instead of one child with a `where` on a flag. **(b)** Item read-only fields (W3-18). `kardex` / `serv_transporte` come from `tipo` through W2 `derive` (stored) plus `readOnlyOn` all modes. U. Compra / U. Venta follow U. Stock through `derive` plus `enabledWhen` false. `perecible` and `dias` reset on a tipo change through `clearsOnChange` plus defaults. `por_igv` takes `default: '$params.PORC_IGV'` (a new params value token for defaults) with `enabledWhen {afecto_igv in [AFECTO]}`, and a `derive` sets `0` otherwise. No new named rule is needed. *Applied in W3-18 [DEVIATION]:* a `derive` target cannot be a field (the W2 rule), so these values use a new field attribute `follows: { field, map?, otherwise? }` (R-REG-17): U. Compra and U. Venta copy U. Stock, `kardex` and `serv_transporte` map the tipo, `por_igv` maps AFECTO to `$params.PORC_IGV` and anything else to `0`. The server applies it to a locked follower (read-only in INSERT and UPDATE, or disabled) before validating (`withFollowed`), the register on every edit of the source (`changeField`, with the tokens resolved against the session params by `withParamTokens`); `clearsOnChange` now also restores the default of an options field. `generalTab` names the first tab `Datos de Item`; `gate.or` opens the botica fields for ISBOTICA or IS_BOTICA_SIN_LOTE | Per-master hooks | Keeps behavior declarative and shared |

## Data Flow

```
LookupField ─resolve/open─► LookupDialog ─list(filters,q,page)─► /v1/{slug} ─► core search
UiMasterRegister ─► useUiCrudRegisterImpl + useChildDraftsImpl ─► DraftCatalogService (no I/O)
     └─ submit ─► POST|PUT /v1/{c} {…, children:{c:[{op…}]}} ─► core/children (validate all → rules → write)
Immediate action ─► POST …/actions/{a} ─► core/actions (rule) ─► refresh grid
Login ─► auth.login(users backing, hash) ─► GET /menu + /forms/permissions (X-User-Id) ─► session snapshot
```

## File Changes (under `web_ts/softcommerce/`)

| File | Action |
|---|---|
| `mock-server/registry/{schema,index,presets,project}.js`, `registry/{backings,pickers}.js` | Modify / Create |
| `mock-server/registry/catalogs/{bancos,vendedores,transportistas,clientes,proveedores,items,cuentas-contables,parametros-prov,clases-sunat,padrones}.js` | Create |
| `mock-server/registry/catalogs/{trabajadores,usuarios,choferes,vehiculos,trabajador-punto-venta,usuario-correlativos}.js` | Modify |
| `mock-server/core/{catalog,validators,store,auth,lookups,rules,entryRules}.js` | Modify |
| `mock-server/core/{children,actions,unique,password,search,grants,socioAcciones,aggregate}.js` | Create |
| `mock-server/http/app.js`, `src/services/mock/AppServicesMock.ts` | Modify |
| `mock-server/data/{params,menu,permissions}.json`, `data/catalogs/*.json` | Modify / Create (`users.json` unchanged) |
| `src/services/{InterCatalogService,CatalogServiceHttp,InterShellService,ShellServiceHttp}.ts`, `src/session/*` | Modify |
| `src/catalogs/{CatalogConfig,registry}.ts`, `src/domain/crud/{codec,validate,toolbarGate}.ts` | Modify |
| `src/views/{uimasterregister,uiseguridadperfil,uisocioacciones,uiautorizarseries}/*` | Create |
| `src/views/{uicatalog,uicrudregister,uishell/formRegistry.ts}` | Modify (seam, custom screens) |
| `src/shared/ui/{LookupField,LookupDialog,ChildGrid,PasswordField,TextAreaField}/*`, `src/shared/DraftCatalogService.ts` | Create |
| `src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx` | Modify (select → lookup driver; see Spec corrections) |
| `scripts/inventory/{wave-overrides.json,lib.mjs,inventory.mjs,inventory.csv,inventory.spec.ts}` | Create / Modify |

## Testing Strategy (strict TDD, RED first)

| Layer | What | Approach |
|---|---|---|
| Registry | New keys, load failures (R-REG-20), consistency over children and custom screens | Pure specs |
| Core | Search terms; composite ops, atomicity and index details; removal kinds; active-sibling unique; cascade; gates; `activacion`/`padron`; backing; hash; grants overlay; socio-acciones | Test-only entries, then `describe.each` over the masters |
| Parity | Every case on both `mock` and `http` (R-MOCK-18) | `catalogServiceContract` plus nested routes and actions |
| Security | No `clave*` or `password` key in any response or error | Walks every route on both transports |
| Component | LookupDialog (keyboard, stale, paging, veto, preset), typed code; tabs mounted, first-error tab, quitar, inline entry, dirty; perfil tree; harness host for the 4 consumer-less pickers | RTL with fake services |
| Cross-UI | Series ↔ UsuarioCorrelativo; Vehiculos ↔ W2 vehiculos; created user logs in; perfil edit at next login | One store |
| Inventory | Overrides, aborts, the exact W3 set | Fixture tree plus the real tree |

## Slice Plan (≤800 changed lines; split at task boundaries if a slice grows, as in W2)

| PR | Content | ~Lines |
|---|---|---|
| W3-0 | Inventory override map | 350 |
| W3-1 | G10 mock: `search`/`q`, joined-key filters, `lookup` kind plus derived join, `pickers.js`, the 4 stubs | 650 |
| W3-2 | G10 UI: LookupField (typed code), LookupDialog, `useLookup`, harness host | 780 |
| W3-3 | BuscarTrabajador → TrabajadorPuntoVenta (parity first) | 400 |
| W3-4a | G11 mock: `children` expansion, seeds, nested routes, composite ops | 780 |
| W3-4b | G11 mock: removal kinds, unique among active, cascade, `store` children, gates plus params keys | 600 |
| W3-5a | G11 UI: UiMasterRegister, tabs mounted, ChildGrid, DraftCatalogService, dirty | 790 |
| W3-5b | G11 UI: quitar kinds, inline entry, first-error tab, `<child>[n]` mapping, restore and CLONE | 700 |
| W3-6 | G12 actions: registry, endpoints, deferred/immediate, `ACTION_NOT_ALLOWED` | 620 |
| W3-7 | Anexo preset plus `activacion`, then **Banco** (pilot) | 780 |
| W3-8 | Chofer activation tab; **Trabajador** promotion | 760 |
| W3-9 | Textarea; **Vendedor** with PanelCargarTrabajador | 680 |
| W3-10 | **Transportista**, Vehiculos shared store (inline), propietario lookup, FormBuscarVehiculo harness | 780 |
| W3-11 | **Usuario**: backing, password, hash, flags, login, no-leak. **Pre-marked split:** 11a = `password` kind plus PasswordField plus `core/password.js`; 11b = Usuario backing plus login plus the no-leak contract | 780 |
| W3-12 | Grants overlay, perfil routes, `/forms/permissions`, login snapshot | 600 |
| W3-13 | Seguridad Perfil screen | 780 |
| W3-14 | Autorizar Series plus the cross-UI spec | 700 |
| W3-15 | `padron` rule plus **Proveedor** | 760 |
| W3-16 | **Cliente** (a): General, condición de pago, direcciones, contactos, cuentas. **Pre-marked split:** 16a = identity block, condición de pago and gates; 16b = the direcciones, contactos and cuentas child grids | 790 |
| W3-17 | Cliente (b): sustitutos (veto), crédito/temp, padrones, BuscarCliente harness | 780 |
| W3-18 | **Item** (a): Datos de Item, clases-sunat, gated prices, BuscarItemConversion harness | 780 |
| W3-19 | Item (b): almacenes, BuscarParametroProv harness | 600 |
| W3-20 | Socio acciones | 650 |

Total: about 15,900 lines in 23 PRs (feature-branch chain), or 25 with the pre-marked splits.

The other slices at 780–790 lines (W3-2, 4a, 5a, 7, 10, 13, 17, 18) are **flagged**: split at a task boundary if a RED/GREEN pair pushes them over 800. W3-10 also carries the inline propietario lookup config (D2). W3-9 carries `fill`. W3-17 and W3-18 carry D27.

## Threat Matrix

N/A. There is no shell, subprocess, VCS/PR automation, executable-file classification or process-integration boundary. The mock HTTP routes are not routing in the threat-matrix sense.

## Migration / Rollout

No data migration is needed. `users.json`, `menu.json` and `permissions.json` keep their shape. `params.json` gains keys, and the seeds gain `INICIO` activations. Rollback means reverting in reverse order. Reverting W3-8 or W3-11 restores the W2 lookups.

## Spec corrections (needed; specs not edited here, except the two applied in `specs/softcommerce-master-detail/spec.md`: R-MD-9 no longer lists Vendedor under CLONE, and R-MD-7 no longer lists Socio acciones as a cascading parent)

1. **R-MOCK-22 / R-MOCK-1**: add the collection-level form `POST /v1/{slug}/{id}/{child}/actions/{action}` (an action that targets no existing row: Autorizar Series `activate`).
2. **R-AUTH-11 / R-MOCK-1**: add `GET /forms/permissions`, which returns `{[formId]: flags}` resolved by `X-User-Id`. The login takes its grant snapshot from it. The per-form route stays.
3. **R-REG-14**: add the child attribute `store: {entry, key}` (a child that is a filtered view of a top-level entry's section: Vehiculos, Series). Seeds of such children stay in the owning entry, not inside the parent seed rows.
4. **R-MD-10**: `Series` on Usuario is a child resource with **no register tab**; it is reached through the Autorizar Series panel (R-PRM-6).
5. **R-MST-17 / S-LKP-16 / R-MST-18**: the TrabajadorPuntoVenta switch to a lookup keeps the S-REF-21 **semantics** but must amend the field driver of `src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx` (lines 44–105 drive a select). The text "passes its W2 suite unchanged" should read "with only the field-interaction helpers amended".
6. **R-MOCK-19**: state that `<n>` in `<child>[<n>].<field>` is the index in the **sent** op array.

## Open Questions

- [ ] The tipo-anexo ids of Banco and Trabajador are not in the repository. They are seed placeholders (`TIPO_ANEXO.banco` / `.trabajador`, D13; R-ANX-9) until W6 confirms them.
- [x] The Socio acciones `Desactivar` handler of the socio was read in W3-20: `FormAccionSocio.actionPerformed` has an EMPTY branch for `btnDesactivarSocio` (line 351-352), and `setValueSearch` has no branch for it. The web button does nothing as well (R-MST-16 aligned).
