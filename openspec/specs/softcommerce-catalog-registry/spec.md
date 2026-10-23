# Spec: softcommerce-catalog-registry

One declarative registry entry describes a catalog; the CRUD templates, the HTTP mock and the in-browser mock all consume the same entry. Adding a catalog never needs new template, route or service code.
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise.

## Requirements

### R-REG-1 Single declarative entry
Each catalog MUST be fully described by one registry entry plus its seed JSON, `menu.json` node and `permissions.json` grant. The registry MUST be the only place where field rules, refs, unique keys, joins, modes and defaults are written; the UI config, `formRegistry`, and both mocks MUST derive from it.

### R-REG-2 Entry contents
An entry MUST declare: `slug` (path `/v1/{slug}`), `idKey`, `codeWidth` (zero-padded width of the server code, 0 = unpadded; the only code-width declaration), `entity` (label with article, used in messages), `scope` (`tenant`, `empresa` or `shared`), `seed`, `fields`, `columns`, and `messages.style` (`M1`, `M2`, `MS`, `label` or `w1`). It MAY declare `formId`, `title`, `menu` (`{ parent, label }`), `section` (storage section when the route slug differs), `optionLabel` (display for the options endpoint: one field name, or a list of field names joined with " - ", empty parts left out; default `descripcion`), `project` (a closed set of seed projections for a tenant, readOnly, `seed: null` entry, for example `users` for `usuarios`), `readOnly`, `modes`, `stamp` (session-filled fields, `id_usuario` and/or `id_empresa`), `refs`, `joins`, `unique` (`{ fields, includeEmpresa?, errorField, message }`), `validation` (declared step order), `constants`, `derive`, `rules` (named rules), `lookupFilters` and `compat`. A field MUST declare `name`, `kind` (`code`, `text`, `number`, `boolean`, `date`, `select`, `options`) and `label`, and as needed: `required`, `max`, `minLen` (plain minimum length), `maxWhen` / `minLenWhen` (lengths chosen by a predicate: `[{ when: { field, in }, len }]`, the first match decides, `len` never above `max`; both only on `text`), `compose` (target = join of fields), `normalize` (a list of `upper`, `lower`, `digits`, `padLeft:n`), `default` (a value, `today`, or a per-mode map; a per-mode default overrides a cloned value), `blankToDefault`, `readOnlyOn` (modes), `options` (static, with `display`), `source` (`{ catalog, where? }`), `dependsOn` (a list of `{ field, filterKey }` parents), `defaultOption: 'first'`, `transient`, `restoreFrom: { field, prefixLen }` and `filter: { has }` (only on a `select` over `ubigeo`, which the UI renders as the W1 departamento > provincia > distrito cascade; `restoreFrom` is declared once on that select, `field` names a field or a join `as` that carries the stored ubigeo code, cut to `prefixLen` characters; `transient` keeps the select out of the server: never stored, validated or checked as a parent; `filter` is sent with every level request), `clearsOnChange` (fields cleared when this one changes), `scale`, a value range (`range: { min, max }` for an integer, where `max` is the digit count and `messages.range` is then required; `min` / `exclusiveMin` for a decimal, where `scale` only marks it as decimal and caps nothing), `visibleWhen`, `enabledWhen`, `requiredWhen` (each `{ field, in: [...] }`, evaluated by one shared predicate evaluator on client and server), `notFuture`, `afterField`, and message attributes `msgLabel`, `article`, `message`, `messages`. `rules` is a list of `{ name, params? }`: `params` rename the fields the rule reads and carry its constants (for `docIdentidad`: `tipo`, `numero`, `paterno`, `materno`, `nombres`, `razon`, `sexo`, the tipo ids `dni` and `ruc`, and `persona`, the name of a stored-only flag column); rule hooks take `(values, params)`. `constants` and `derive` target stored-only columns: a `constants` key, a `derive` target or a rule `persona` column MUST NOT share a name with a field, with each other or with another stored-only column, and a body value for them is never read. Behavior that declarations cannot express MUST use a closed set of named pure rules; Wave 2 defines only `docIdentidad` (Chofer, Socio) and the lookup filters `ubigeoChildren` and `ubigeoHasActive`. Derived lookup filters are declared on the target entry as `lookupFilters` (`via`, `exists` or `rule`).

### R-REG-3 Consistency across consumers
A consistency test MUST prove that, for every entry, the UI config, the HTTP mock and the in-browser mock expose the same fields, required flags, max lengths, refs, unique keys and joins. Drift in any consumer MUST fail the test.

### R-REG-4 Registry validation at load
The registry MUST fail fast at load (before any request) when: two entries share a `slug` or `formId`, or an `idKey` (the single exemption: entries over a W1 storage section, `seed: null`, such as `empresa` and `punto-venta`, keep the W1 row key `id` and MAY share it; a seeded entry MAY NOT); a `source` or ref points to an unknown or missing catalog; a `dependsOn`, `visibleWhen`, `enabledWhen`, `requiredWhen`, `afterField`, `unique` or `joins` clause names an unknown field; a dependent chain is cyclic; a named rule or `validation` step names an unknown rule, field, unique index or ref; a `scope` is not one of `tenant`, `empresa`, `shared`; or a field kind lacks a required attribute (for example `select` without `source`, `options` without values, `number` without `scale`).

### R-REG-5 Automatic seed registration
Seed JSON files declared by `entry.seed` (`data/catalogs/<seed>.json`) MUST be registered automatically in both sources; no hardcoded seed or tenant-section lists may remain. Store sections are derived from `scope`: `tenant` and `empresa` entries are stored per tenant, `shared` entries once globally. A tenant without a seed for a per-tenant catalog MUST get an empty dataset; a malformed seed MUST fail at load.

### R-REG-6 Refs
Refs MUST be derived from the field `source` (`catalog` plus static `where`, for example `active` or `persona:true`) and the `dependsOn` parents: exists, `activeOnly` (default true), belongs-to-parent, and `where` apply to ref validation exactly as they apply to the options query. The mock MUST validate every ref on create and update; the UI MUST build the select from the same declaration.

### R-REG-7 Composite unique keys
`unique` MUST declare `{ fields, includeEmpresa?, errorField, message }` (the session empresa is part of the key only with `includeEmpresa`). A violation MUST be reported as a 409 `DUPLICATE` rule error mapped to that field (R-MOCK-11). The record being updated MUST NOT conflict with itself. Logically deleted records MUST NOT count. **[ASSUMPTION] logically deleted records are ignored by uniqueness.**

### R-REG-8 Joins
`joins` MUST declare display columns resolved from refs (`{ as, ref, display, prefixLen? }`). Every `options` field additionally yields a `<name>_label` key on list and get (R-MOCK-14). Both sources MUST return the same joined keys on list and get. A join over a missing or inactive target MUST yield an empty string, never an error.

### R-REG-9 Menu and permissions consistency
Every entry with a `menu` node MUST appear in `menu.json` with its `formId`, and `permissions.json` MUST grant the 13 permission flags for that `formId`. A consistency test MUST fail when the registry, `menu.json` and `permissions.json` disagree.

### R-REG-10 Supported modes
An entry MAY restrict `modes` to a subset of INSERT, UPDATE, DELETE, DETAIL, CLONE (default all five). `modes` MUST filter the toolbar actions before permission gating (unsupported actions are not rendered; shortcuts and double-click are inert), and the mock MUST reject a write outside `modes` with 405 `MODE_NOT_SUPPORTED` and the error shape. This code is distinct from `METHOD_NOT_ALLOWED` (R-REG-11).

### R-REG-11 Read-only lookups
An entry flagged `readOnly` MUST expose only `GET` list and `GET` by id. Any write route MUST answer 405 `METHOD_NOT_ALLOWED` with the error shape (distinct from `MODE_NOT_SUPPORTED`, which applies to writes outside a writable entry's `modes`). Such entries MUST NOT appear in the menu.

### R-REG-12 Localidad migrates without behavior change
The W1 Localidad catalog MUST be re-expressed as a registry entry with identical external behavior, carrying a `compat` block (`messages: 'w1'`, `serverOptional: ['direccion']`) and `validation: ['id_empresa','descripcion','id_ubigeo','direccion']`; the consistency test MUST exempt only `serverOptional`; all W1 suites MUST pass unchanged. The legacy W1 routes `GET /v1/empresas` and `GET /v1/puntos-venta?id_empresa=` MUST stay byte-identical to W1. The Wave 2 Empresa and PuntoVenta entries use the route slugs `empresa` and `punto-venta` with a `section` equal to the existing W1 storage section, so both route families see the same data. Because the W1 rows are `{ id, name }`, the Empresa `Nombre` and the PuntoVenta `Descripción` are stored under `name` (labels and messages unchanged), and the W1 routes project `{ id, name }` / `{ id, name, id_empresa }` in that key order and hide `activo: false` rows, so the extra Wave 2 fields never leak into W1 bodies.

## Scenarios

**S-REG-1 one entry drives all consumers** — Given a new minimal entry (one required text field) plus seed, menu and permissions, When the app starts, Then the list and register work against both sources with no other code change.

**S-REG-2 consistency test** — Given an entry whose `max` differs between the UI config and the mock rule, When the consistency test runs, Then it fails naming the catalog and the field.

**S-REG-3 duplicate slug** — Given two entries with the same `slug`, When the registry loads, Then it throws a configuration error before any request.

**S-REG-4 unknown lookup** — Given a `select` field whose `source` is not a registered catalog, When the registry loads, Then it throws a configuration error naming the field.

**S-REG-5 cyclic chain** — Given field A with `dependsOn` B and field B with `dependsOn` A, When the registry loads, Then it throws a configuration error.

**S-REG-6 auto seed** — Given an entry with seed file `aduanas.json` for `demo` only, When the `botica` tenant lists it, Then it returns an empty list and no error; the `demo` tenant returns the seeded rows.

**S-REG-7 malformed seed** — Given a seed file that is not valid JSON, When the mock loads, Then it fails at load naming the file.

**S-REG-8 ref validation** — Given a required ref `id_familia` pointing to `familias`, When a record is created with an unknown id, Then the mock answers 422 with a detail on `id_familia`.

**S-REG-9 unique key excludes self** — Given a record with a unique key, When it is updated without changing the key, Then no conflict is reported.

**S-REG-10 deleted record frees the key** — Given a logically deleted record with key K, When a new record with key K is created, Then it succeeds.

**S-REG-11 joins parity** — Given a catalog with a join, When it is listed from the HTTP mock and from the in-browser mock, Then both return the same joined key and value; an inactive target yields an empty string.

**S-REG-12 menu and permissions consistency** — Given an entry whose `formId` is missing in `permissions.json`, When the consistency test runs, Then it fails naming the `formId`.

**S-REG-13 unsupported mode** — Given an entry with `modes` = `[UPDATE, DETAIL]`, Then the toolbar offers no add, eliminate or clone, and `POST` answers 405 `MODE_NOT_SUPPORTED`.

**S-REG-14 read-only lookup** — Given a `readOnly` entry, When `POST`, `PUT` or `DELETE` is called, Then the answer is 405 `METHOD_NOT_ALLOWED` with the error shape and the data is unchanged (not `MODE_NOT_SUPPORTED`).

**S-REG-15 Localidad unchanged** — Given the W1 Localidad suites, When they run against the registry-driven stack, Then they pass unchanged, and `GET /v1/empresas` and `GET /v1/puntos-venta?id_empresa=1` still answer byte-identically to W1, including after records are written through `/v1/empresa` and `/v1/punto-venta`.

**S-REG-16 unknown named rule or step** — Given an entry that lists `rules: [{ name: "nope" }]` or a `validation` step `{ unique: 3 }` with only one unique key, When the registry loads, Then it throws a configuration error naming the entry.

**S-REG-17 declared validation order** — Given an entry whose `validation` lists `['a', { unique: 0 }, 'b']`, When a write violates `b` and the unique key, Then the server returns `details` with the unique error before `b`, and the client validates only `a` before submitting.

**S-REG-18 scope drives storage** — Given a `shared` seed and a `tenant` seed, When two tenants list them, Then both see the same `shared` rows and each sees only its own `tenant` rows; an `empresa` entry is stored per tenant and limited to the session empresa.

**S-REG-19 Localidad compat** — Given the Localidad `compat` block, When the consistency test runs, Then it exempts only `direccion` as server-optional and Localidad error messages stay in the W1 style.
