# Design: SoftCommerce Web Migration — Wave 2 (Reference Catalogs)

## Technical Approach

One declarative **catalog registry** (plain ESM/JSDoc in `mock-server/registry/`) is the only place where catalog rules are written. Three consumers derive from it:

- the mock core: generic `/v1/{slug}`, refs, unique keys, joins, option labels, modes and session values;
- the in-browser mock;
- the UI adapter, which builds `CatalogConfig` and `formRegistry`.

Rules are shared code, not duplicated:

- `mock-server/core/{predicates,messages,normalize,rules}.js` are pure modules imported by both the UI and both mocks, so the client and the server produce the same messages and decisions.
- What the declarations cannot express goes into a closed set of **named pure rules**, referenced by name from the registry.

Localidad moves onto the registry first, with an explicit W1 compatibility block. The slices are capability-first, and no catalog lands before the capabilities it needs.

## Architecture Decisions

| # | Decision | Rejected | Rationale |
|---|---|---|---|
| D1 | Registry at `mock-server/registry/catalogs/<slug>.js`, listed in `registry/index.js`, validated at load (R-REG-4) | Under `src/`; `src/features/catalogs` | The Node server can import it. `allowJs` already lets `src/` import `mock-server/*.js` |
| D2 | `menu.json` / `permissions.json` stay seed data. A consistency spec checks them against the registry `menu` / `formId` (R-REG-9) | Generating the menu at runtime | Keeps R-MOCK-5 and `seedSwap.spec` |
| D3 | Seeds are registered automatically from `entry.seed`: `data/catalogs/<seed>.json` via `loadSeed` (fs) and `import.meta.glob` (browser). Store sections are derived from `scope`: `tenant` and `empresa` are stored per tenant, `shared` is global. A missing tenant gets `[]`. Malformed JSON fails at load | Hand-kept lists | R-REG-5. W1 `tinySeed`/`readSeed` keep working |
| D4 | Generic core: `refs` (exists, `activeOnly`, `parent` belongs-to, static `where`), `unique` `{fields, includeEmpresa?, errorField, message}` → 409 `DUPLICATE`, `joins` `{as, ref, display, prefixLen?}`, `<name>_label` for every `options` field (R-MOCK-14), `codeWidth`, `readOnly` (writes → 405 `METHOD_NOT_ALLOWED`), `modes` (writes outside them → 405 `MODE_NOT_SUPPORTED`), `section` (route ≠ storage) | Per-catalog JS hooks for everything | T1/T2 stay data-only. Hooks are limited to D9 |
| D5 | Options endpoint `GET /v1/lookups/{slug}?<key>=`: exact match, active rows only, `{items:[{id,name}]}` from `optionLabel`. Accepted keys: every ref field and every `dependsOn.filterKey`. Derived filters are declared on the target entry, `lookupFilters: {key: Filter}` (see Contracts) | Substring list filters | R-MOCK-16 |
| D6 | `InterLookupService.options(slug, filters?)` is added. `empresas()` / `ubigeoChildren()` stay unchanged | Replacing them | W1 contract |
| D7 | Form state stays `Record<string,string>`. A per-kind codec (`domain/crud/codec.ts`) maps it to the typed wire at the boundary. Hidden fields: **the UI sends `null`; the server stores `''`** (R-MOCK-10 accepts both) | A typed `FormValue` union | W1 signatures stay. One rule for hidden fields (R-CRUD-13, R-REF-8, S-MOCK-20) |
| D8 | **Dependent engine** (`shared/dependentChain.ts`, extracted from `CascadeSelectImpl` with its latest-token guard). `dependsOn` is a list of parents. Each `{field, filterKey}` sends the parent value as `filterKey`, and indirection is resolved server-side via `lookupFilters`. The ubigeo `cascade` stays `kind: 'cascade'` in the UI and is N chained engine nodes (filter key `parent`; each `DependentSelect` is one node). A registry `select` over `ubigeo` renders as that cascade and may declare, **on the cascade itself (not per level)**, `transient` (no level travels, the leaf included), `restoreFrom: {field, prefixLen}` (the levels are rebuilt from a ubigeo code the record carries, a field or a join `as`) and `filter: {has}` (sent with every level request). `CascadeSelect` is rebuilt on the engine with the same exports and props plus an optional static `filter` | A second cascade implementation | R-CRUD-12: one mechanism covers multiple parents (UsuarioCorrelativo), indirect keys (SubFamilia), and cascade → `id_zona` (ZonaDistancia) |
| D9 | **Behavior beyond declarations** has two layers, both in shared core code. **(a) Declarative primitives:** `visibleWhen`/`enabledWhen`/`requiredWhen`, `maxWhen`/`minLenWhen` (lengths chosen by a predicate), `clearsOnChange` (fields cleared when this one changes), `compose` (target = join of fields), `constants` (stored on create), and `derive` `{target, when, then, else}`. **(b) A closed set of named rules** in `mock-server/core/rules.js`, referenced by name and params. The registry fails at load on an unknown name. Each rule exports up to four pure hooks: `state(values, params) → {hidden, disabled, required, max}`, `validate(values, params, ctx) → detail[]`, `effect(values, changed, params) → {patch, alert?}`, `derive(values, params) → patch`; `params` (declared as `rules: [{name, params}]`) rename the fields the rule reads and carry its constants (`docIdentidad`: `tipo`, `numero`, `paterno`, `materno`, `nombres`, `razon`, `sexo`, tipo ids `dni` `01` / `ruc` `05`, and `persona`, a stored-only flag column). A field a rule touches carries a non-enumerable `ruleState(values)` overlay that the shared `fieldState` merges, so visibility, disabled and required follow the rule on the form and the server alike; `maxWhen` / `minLenWhen` are declarative lists `[{when: {field, in}, len}]` (first match wins, `len` never above `max`) tied to the rule's `state().max` by a spec. `constants` and `derive` targets are stored-only columns: the schema rejects a name shared with a field, a constant, a derive target or a rule `persona`. W2 defines only `docIdentidad` (Chofer, Socio) and the lookup filters `ubigeoChildren` and `ubigeoHasActive` | Inline functions in entries; a pure declarative mini-language | Inline functions are not serializable, so they can't be consistency-checked or shared. A mini-language for the RUC first-digit branching would be bigger than the one rule. Named rules keep one implementation for the UI and both mocks, and keep the hook surface bounded |
| D10 | **Validation order is declared per entry.** `validation` lists steps: field names, `{unique:i}`, `{rule:name}`, `{ref:field}`. The default is the order of `fields`, then refs, then unique. The **client validates the prefix up to the first server-only step** (unique and ref; a named rule such as `docIdentidad` is shared code and runs on the client too) and leaves the rest to the server. For W2 entries, like the desktop, validation **stops at the first failing step**: a response carries exactly one failure, so its status is that step's (409 `DUPLICATE` for unique, 422 `VALIDATION_ERROR` otherwise). Localidad's `compat` block keeps the W1 behaviour (all field errors in one 422), and the UI mapping always supports several `details`. "Config order" in the specs means this declared order. The UI focuses the failing field. Hidden fields: the UI sends `null`, the server stores `''` (also for rule-hidden fields). The client prefix stops at the first server-only step, so Correlativo ticket fields are checked after the unique key and reported by the server; the generic client block of a blank `requiredWhen` field applies only to configs with no server-only step before it | W1's `required ∪ maxLength` sort for all entries | Desktop order (R-REF-2/7/8). It resolves the Correlativo inversion: the TI fields come after the unique check, so they are only reported by the server, after a passing unique |
| D11 | **Localidad W1 block** `compat: {messages:'w1', serverOptional:['direccion']}` and `validation: ['id_empresa','descripcion','id_ubigeo','direccion']`. The consistency spec exempts only `serverOptional` | Re-validating Localidad with the new rules | The W1 `catalog.spec` asserts exact `details` field lists, and the W1 server never required `direccion` |
| D12 | **Messages** live in shared `core/messages.js`. Entry-level `entity` plus `messages.style`: `M1` \| `M2` \| `MS` \| `label` (`debes especificar {msgLabel}.`) \| `w1`. Per field: `msgLabel` (default `su {label}`, for example `sus Dias de Pago`), `article` (MS `un\|una`), `message` (a literal), and `messages` per rule (`range`, `minLen`, `date`). `{modo}` is agregar/clonar/modificar/eliminar | Messages in templates | R-REF-3, R-CRUD-6. Both mocks and the UI emit identical text (S-REF-37) |
| D13 | **Session context.** `X-User-Id` / `X-Empresa-Id` are sent when known: a new `sessionStore.getRequestContext()` is passed to `composeServices`, while `getContext()` stays byte-identical. The core takes an optional trailing `ctx`. `stamp` fields come from `ctx`, and body values are ignored. `scope:'empresa'` limits list, get and write to `ctx.empresaId`. `where` can reference `$session.empresa` (Almacen localidades). Stamp-only entries (`stamp` with `id_empresa`, no `scope`) record the session empresa on writes and list tenant-wide; the core has **no list-only empresa scope**, so `punto-venta` and `trabajador-punto-venta` list tenant-wide although the desktop lists by empresa (documented deviation). A required header that is missing gives 400 `MISSING_SESSION_CONTEXT`. **An `X-Empresa-Id` that is not an empresa of the tenant gives 400 `INVALID_SESSION_CONTEXT`.** W1 routes and Localidad never require the headers | Body ids; mandatory headers | R-MOCK-13. W1 contract and header tests unchanged |
| D14 | **Modes.** `modes` (default all five) filters `config.actions` **before** permission gating, so unsupported actions are not rendered and their shortcuts and double-click are inert. Permission still enables or disables what remains. The core answers 405 `MODE_NOT_SUPPORTED` | Disabling them | R-CRUD-16, S-CRUD-36, R-REG-10 |
| D15 | **Field behavior:** `normalize: ('upper'\|'lower'\|'digits'\|'padLeft:n')[]` (on input; `padLeft` on blur for non-empty values; also on the server), `default` (a value or a per-mode map; `'today'`; a per-mode default overrides the cloned value, as in TipoCambio CLONE → today), `blankToDefault`, `readOnlyOn: Mode[]`. The `estado` preset (`registry/presets.js`) is `default:{INSERT:true}` with `readOnlyOn:[INSERT, CLONE, DETAIL, DELETE]`, so CLONE copies the source value. Socio uses all modes | Hard-coded estado | R-CRUD-15, R-REF-3 |
| D16 | **Options behavior:** `defaultOption: 'first'` selects the first option after each load or parent change (TipoMovInventario clasificacion). The default tabla is the **id of the 6th seeded tablas-sunat row**, declared as the literal `default: '6'` (no resolver, no schema extension) and asserted by a seed spec on the 6th row. `optionLabel` may be a list joined with " - ". The register's `onFieldDefault` makes the picked default the form baseline. **`source.where` (static filters) applies to both the options query and ref validation.** It covers the tipos-doc-iden `persons` filter (`where:{persona:true}`) and `active` | Positional default at runtime | S-REF-23/24. Refs are derived from the field `source`, so the UI and the server agree |
| D17 | **Columns:** text, joined (`as` key), `bool` (Sí/No), `date` (dd/MM/yyyy), `dec` (rendered **as stored**, no rounding), option (`<name>_label` key from the server). The filter covers every rendered column | Fixed `decimal:n` | R-CRUD-1, S-CRUD-37 |
| D18 | Date kind keeps **`notFuture`, `min`, `afterField`** in the FieldConfig, the shared rule and the server. They are tested with a test-only config (S-CRUD-28). No W2 entry enables them, and Promocion has no date rules | Dropping `afterField` | R-REG-2/4, R-CRUD-11, R-MOCK-10 |
| D19 | JONA unit `views/uicatalog/UiCatalog` per entry, plus field renderers `shared/ui/<Field>/{Inter*,*Impl,*View,index}`: label-only DEFAULTS, value-first callbacks, `min-h-11 sm:min-h-9`. `NumberField` sits on jona-ui `JTextBox` (`inputMode="numeric"`), **not** `JNumberInput` (type number, `number \| null` value, `max` is a clamp: it cannot show a padded `05`); `DateField` sits on `JDatePicker` (no read-only mode, so read-only is disabled) | One unit per catalog | Same pattern as `UiLocalidad` |

## Interfaces / Contracts

```js
/** @typedef {{ slug, section?, scope:'tenant'|'shared'|'empresa', idKey, codeWidth, entity, formId?, title?,
 *   menu?:{parent,label}, seed, readOnly?, optionLabel?, project?, modes?, stamp?:('id_usuario'|'id_empresa')[],
 *   messages:{style:'M1'|'M2'|'MS'|'label'|'w1'}, fields:FieldDef[], columns, refs?, joins?,
 *   unique?:{fields, includeEmpresa?, errorField, message}[], validation?:Step[], constants?, derive?,
 *   rules?:{name, params?}[], lookupFilters?:Record<string, Filter>, compat? }} CatalogDef
 * optionLabel: string | string[] (list joined with " - "); project: 'users' (closed set, needs seed null + readOnly + tenant)
 * Filter = {via:{catalog,key,as}} | {exists:{catalog, local, key?, where?}} | {rule:'ubigeoChildren'|'ubigeoHasActive', params}
 * (`has` of ubigeoHasActive: closed list ['zonas']; blank = plain children; unknown catalog = empty list) */
```

```ts
type Cond = { field: string; in: string[] };
// text: also minLen?, maxWhen/minLenWhen = {when: Cond, len}[]; number: scale 0 uses range?: {min, max} (+ messages.range), scale > 0 uses min?/exclusiveMin?;
// select over ubigeo (cascade): transient?, restoreFrom?: {field, prefixLen}, filter?: {has}
type Base = { name; label; required?; msgLabel?; article?; message?; default?; blankToDefault?; readOnlyOn?: Mode[];
  normalize?: string[]; visibleWhen?: Cond; enabledWhen?: Cond; requiredWhen?: Cond; clearsOnChange?: string[] };
type FieldConfig = /* W1 text|select(lookup)|cascade kept */ | (Base & { kind: 'code' }) | (Base & { kind: 'text'; max?; maxWhen?; minLenWhen?; compose? })
  | (Base & { kind: 'select'; source: { catalog; where? }; dependsOn?: { field; filterKey }[]; defaultOption?: 'first'; transient?; restoreFrom? })
  | (Base & { kind: 'options'; display: 'select' | 'radio'; options: { value; label }[] }) | (Base & { kind: 'boolean'; display? })
  | (Base & { kind: 'number'; scale: number; max?; min?; exclusiveMin? }) | (Base & { kind: 'date'; notFuture?; min?; afterField? });
```

Error codes:

| Status | Code | When |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Field-level failure; `details[{field, code, message}]` |
| 409 | `DUPLICATE` | Unique-key violation |
| 405 | `MODE_NOT_SUPPORTED` | Write for a mode outside `modes` |
| 405 | `METHOD_NOT_ALLOWED` | Write to a read-only lookup |
| 400 | `MISSING_SESSION_CONTEXT` | A required context header is missing |
| 400 | `INVALID_SESSION_CONTEXT` | `X-Empresa-Id` is not an empresa of the tenant |

Routes:

- `/v1/empresa` and `/v1/punto-venta` are the CRUD routes over the W1 sections.
- `/v1/empresas` and `/v1/puntos-venta` stay byte-identical.

## Data Flow

```
    registry/*.js ─► core (rules/refs/unique/joins/labels/ctx) ─► http/app.js ─┐
          │   └──── shared core/{predicates,messages,normalize,rules}.js ◄─────┤─► AppServicesMock
          └─► src/catalogs/registry.ts ─► CatalogConfig + formRegistry ─► UiCatalog
    data/catalogs/*.json ─► loadSeed | import.meta.glob ─► createStore
```

## File Changes (under `web_ts/softcommerce/`)

| File | Action |
|---|---|
| `mock-server/registry/{index,schema,presets}.js`, `registry/catalogs/*.js` | Create |
| `mock-server/core/{catalog,validators,store}.js` | Modify |
| `mock-server/core/{predicates,messages,normalize,rules,lookups,context}.js` | Create |
| `mock-server/core/{docIdentidad,entryRules,stored,numbers,dates}.js`, `registry/{sources,seeds,project}.js` (added at apply: rule hooks and runners, stored-only columns, shared decimal/date helpers, builtin ref sources, seed collection, seed projections) | Create |
| `mock-server/http/{app,loadSeed}.js`, `src/services/mock/{seed,AppServicesMock}.ts` | Modify |
| `mock-server/data/catalogs/*.json`, `data/{menu,permissions}.json` | Create / Modify |
| `src/catalogs/{CatalogConfig,registry}.ts`, `src/domain/crud/{validate,normalize,codec,serverErrors,toolbarGate}.ts` | Modify / Create |
| `src/services/{InterLookupService,LookupServiceHttp,httpClient}.ts`, `src/session/sessionStore.ts`, `src/main.tsx` | Modify |
| `src/views/{uicatalog/*,uicrudregister/*,uicrudlist/*,uishell/formRegistry.ts}` | Create / Modify |
| `src/shared/{dependentChain.ts,ui/{BooleanField,NumberField,DateField,OptionsField,DependentSelect}/*}`, `src/shared/ui/CascadeSelect/CascadeSelectImpl.ts` | Create / Modify |
| `src/views/uishell/formRegistry.spec.ts` | Modify in W2-7 only (the approved `miTipoCambio` exception) |

## Testing Strategy (strict TDD, RED first)

| Layer | What | Approach |
|---|---|---|
| Registry | Load-time validation (R-REG-4) and consistency (R-REG-3, R-REG-9) | Pure specs |
| Core | CRUD, refs, unique, joins and labels, codeWidth, modes/readOnly 405, ctx 400s, normalize, declared order, named rules | `describe.each(REGISTRY)` + per-entry rule rows (`test/catalogs/<slug>.cases.ts`, `deviation:true` rows) |
| Parity | Every case against `mock` and `http`, with the same code, status and details (R-MOCK-18) | `catalogServiceContract` × registry |
| Shared rules | `predicates`, `messages`, `docIdentidad` hooks | Pure tables, run once and imported by both sides |
| Component | Field kinds, dependent engine (multi-parent, stale, restore, cascade parity), conditional fields, 409/422 mapping, G14, modes not rendered, `afterField`/`notFuture` test-only config | RTL with fake services |
| W1 | All suites unchanged, except the approved `miTipoCambio` change | Gate in every PR |

## Slice Plan (≤800 changed lines; seed JSON counted, lockfile excluded)

| PR | Capabilities | Catalogs (first proof in bold) | ~Lines |
|---|---|---|---|
| W2-1a | Registry schema and load validation, auto-seed, generic CRUD, refs/unique/joins/labels, codeWidth, modes/readOnly 405, Localidad compat | **localidades** | 720 |
| W2-1b | Session ctx (headers, stamp, empresa scope, 400s), options endpoint (exact, `where`, `$session`), shared messages/normalize/predicates, declared validation order | (core only; Localidad parity) | 650 |
| W2-2 | G15 UI, UiCatalog, G14, modes rendering, client messages/normalize/order | **aduanas**, colores, estados-documento, laboratorios, marcas, nacionalidades | 720 |
| W2-3 | G3 + estado preset/readOnlyOn/per-mode default; G7 + option columns | **motivos-traslado** (G3), **clasif-clientes** (estado), **clasif-inventarios** (G7), tamanos, tipos-anexo, tipos-descuento | 700 |
| W2-4 | G4 integer (scale 0, range, digits, padLeft) | **condiciones-pago**, turnos, tipos-trabajador, marcas-vehiculo | 650 |
| W2-5 | G1 catalog select, empresa-scope UI; lookup familias-sunat | **motivos-descuento**, motivos-nc, tipos-trabajador-perfil, **familias** (scope), modelos-vehiculo | 720 |
| W2-6 | G2 dependent engine (multi-parent, `via`, stale, restore) + cascade rebuilt on the engine; lookup subfamilias-sunat | **subfamilias** | 700 |
| W2-7 | G4 decimal, G5 date (+ `afterField`/`notFuture` test-only), G6 field mapping, G13 date/dec columns; lookup monedas; `miTipoCambio` spec change | **tipos-cambio**, promociones | 720 |
| W2-8 | Ref `parent` chains in the UI, `minLenWhen`, cascade as an optional parent | **empresa** (modes), punto-venta, almacenes, zonas | 740 |
| W2-9 | G8 conditional, constants/derive, server-step ordering; lookup tipos-doc-venta (`exists`) | **correlativos**, ubicaciones | 720 |
| W2-10 | `defaultOption`, seeded default; lookups tablas-sunat and tablas-detalle-sunat | **tipos-mov-inventario**, unidades-medida, vehiculos | 700 |
| W2-11 | Multi-parent and `ubigeoHasActive` in use; lookups usuarios and trabajadores | **usuario-correlativos**, **zonas-distancia**, trabajador-punto-venta | 760 |
| W2-12 | Named rule `docIdentidad` (state/validate/effect/derive); lookup tipos-doc-iden (`where` persons) | **choferes**, socios | 720 |

Actual delivery: every slice exceeded the 800-line budget once tests were counted (tests are 60 to 65 percent of each), so each shipped as 2 or 3 consecutive branches split at task or commit boundaries (see `apply-progress.md`; the slice branch name is an alias of the tip of the last part). Two further scope findings changed the plan: `subfamilias`, `tipos-cambio`, `tamanos`, `modelos-vehiculo`, `marcas-vehiculo` are stamp-only (not `scope=empresa`), and `empresa`/`punto-venta` list tenant-wide.

Assignment check: 12 + 11 + 15 = 38 catalogs, each assigned once. Every ref and lookup target lands in the same PR (earlier in the list) or in an earlier PR. All slices are ≤760 lines. If W2-11 grows, move trabajador-punto-venta to W2-12.

## Threat Matrix

N/A: there is no routing (in the threat-matrix sense), shell, subprocess, VCS/PR automation, executable-file classification or process-integration boundary.

## Migration / Rollout

No data migration is needed. W2-1a moves Localidad onto the registry behind unchanged W1 suites. Rollback means reverting PRs in reverse order. Batch PRs add only entries, seeds and menu rows.

## Open Questions

- [x] `miTipoCambio` exception (now W2-7), Empresa/PuntoVenta routes, session context, `id_usuario` always stamped (which entries store it is read at apply), modes, deviations, extra lookups.
- [ ] PRODUCT: the W1 permission seed keeps `miTipoCambio` read-only (`add/modify/eliminate/clone: false`) because the W1 `auth.spec` asserts it; the demo user sees Tipos de Cambio without Add or Clone. W6 (real permissions) or an approved W1 test edit must widen it.
- [ ] PRODUCT: inferred `codeWidth` with no desktop evidence (to confirm in W6): almacenes 3, tipos-cambio 3, unidades-medida 3, vehiculos 3, plus aduanas, colores, nacionalidades, clasif-inventarios, condiciones-pago, tipos-trabajador, marcas-vehiculo and modelos-vehiculo at 3. usuario-correlativos and trabajador-punto-venta use 5 from the `focusLost` pad of their panels (`"00000" + code`) with no SQL to confirm the column width; the user-listed set to re-confirm is almacenes, tipos-cambio, unidades-medida, vehiculos, usuario-correlativos, trabajador-punto-venta.
- [ ] PRODUCT: demo ids and rows are invented (SUNAT tablas and detalles, familias-sunat codes, monedas other than `00001` / `00004`, tipos-doc-venta demo rows, trabajadores); only the 6th tabla id `6` and the DNI `01` / RUC `05` / TI ids are load-bearing.
- [ ] PRODUCT: W6 contract points: the UI sends the select `where` as strings (`estado: 'true'`), `lookups/ubigeo?parent=&has=zonas`, the `estado: 'A'` where of the correlativo serie select, the `X-User-Id` / `X-Empresa-Id` headers, 400 `INVALID_FILTER`, a stamp-only empresa model, and the `shared` scope of familias-sunat.
- [ ] PRODUCT: menu titles and formIds that are proposals (`miTipoAnexo`, "Motivo de Nota de Credito", "Tipo Trabajador Perfil"); tamanos empresa scope (`RegisterTamano` passes the empresa on insert only) and marcas-vehiculo/modelos-vehiculo/subfamilias/tipos-cambio stamp-only decisions.
- [ ] W6 must confirm the `shared` scope of Moneda, TipoDocIden, the SUNAT tables, tipos-doc-venta, familias-sunat and subfamilias-sunat.
- [ ] Plain exact lengths (Empresa `ruc` = 11) use `minLen` + `max` on the field; `minLenWhen` is only for the conditional case.
- [ ] The tipos-doc-iden DNI id and every `codeWidth` are read from the desktop at apply time.
