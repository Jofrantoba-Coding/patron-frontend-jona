# Delta for softcommerce-mock-api

Makes the catalog CRUD generic for every `/v1/{catalog}` of the registry, adds server-side field, FK and composite-unique rules with field-level errors, and adds the read-only cross-wave lookups. Existing ids are kept; new ones continue at R-MOCK-9 and S-MOCK-15.
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise.

## ADDED Requirements

### R-MOCK-9 Generic catalog CRUD
For every registry entry that is not `readOnly`, the server MUST expose `GET /v1/{slug}` (list), `GET /v1/{slug}/{id}`, `POST`, `PUT /{id}` and `DELETE /{id}`, driven only by the entry (the route slug MAY differ from the storage `section`, for example `/v1/empresa` over the W1 empresas data). List MUST support paging (R-MOCK-3) and case-insensitive contains filters on any listed field; exact-match filtering for selects is the lookups route (R-MOCK-16). An unknown slug MUST answer 404 with the error shape. On create and update only the entry's writable fields are read; the code, `activo`, `id_usuario` and the session empresa in the body MUST be ignored.

### R-MOCK-10 Field validation
The server MUST validate every write against the entry: required (blank after trim), max length, kind (`number` with `scale` (0 = integer, digits only), `boolean`, `date` valid ISO date, `options` membership), ranges (`min`, `max`), `notFuture`, `afterField`, and conditional rules (`requiredWhen`, `visibleWhen`, `enabledWhen` as `{ field, in: [...] }`, evaluated by the shared predicate evaluator; a hidden field arrives as `null` from the UI or as an empty string, and is stored as an empty string), `maxWhen` / `minLenWhen`, and the named rules declared by the entry (for example `docIdentidad`). Strings MUST be trimmed and normalized (`upper`, `lower`, `digits`, `padLeft:n`, as a list) before they are validated and stored. Validation runs in the entry's declared `validation` order (default: field order, then refs, then unique), so the UI focuses the first failure. For Wave 2 entries it STOPS AT THE FIRST FAILING STEP (design D10): a failure answers 422 `VALIDATION_ERROR` (409 for a unique step) with `details: [{ field, code, message }]` holding that one failure, using the configured messages; only `compat` entries (Localidad) keep the W1 all-errors 422. `code` is additive (clients read `field` and `message`). `constants` are written on create only and `derive` targets are recomputed on every write; neither is ever read from the body. A named rule's `validate` hook runs as the `{rule}` step; the `docIdentidad` rule additionally answers 422 on `numero_doc` for a RUC whose first digit is neither 1 nor 2 (the alert text), because the server must not store it.

### R-MOCK-11 Composite uniqueness
A write that violates a `unique` key of the entry MUST answer 409 `DUPLICATE` with `details: [{ field, code, message }]` naming the field declared by the key. An update MUST NOT conflict with itself; logically deleted records MUST NOT count. **[ASSUMPTION] logically deleted records are ignored by uniqueness.**

### R-MOCK-12 Referential integrity
A write MUST validate every ref: the target MUST exist in the tenant, MUST be active when `activeOnly`, and MUST belong to its parent when the ref declares one (a punto de venta of the chosen localidad, a localidad of the chosen empresa, and so on). "Belongs to the parent" is judged by the parent's filter on the target: a plain column match, the target's `via` filter, or its `exists` filter (the tipo of a punto de venta). A violation MUST answer 422 `VALIDATION_ERROR` with a detail on the ref field. A logical delete MUST NOT be blocked by references from other records.

### R-MOCK-13 Server-generated code and session values
On create the server MUST generate the next code as a string zero-padded to the entry's `codeWidth` (`codeWidth` is declared per catalog; the per-catalog widths MUST be read from the desktop at apply time; W1 Localidad has none and keeps its unpadded ids), unique within the tenant and catalog. Fields listed in the entry's `stamp` (`id_usuario`, `id_empresa`) and the empresa for entries with `scope=empresa` MUST come from the session context (`X-User-Id`, `X-Empresa-Id` request headers), never from the body. A request that needs them and lacks a header MUST answer 400 `MISSING_SESSION_CONTEXT`. An `X-Empresa-Id` that is not an empresa of the tenant MUST answer 400 `INVALID_SESSION_CONTEXT`. List, get and write of `scope=empresa` entries MUST be limited to the session empresa; a static `where` MAY reference `$session.empresa` (for example the Almacen localidades). W1 routes and Localidad MUST NOT require the headers. **[DEVIATION]** An entry may be stamp-only: `stamp` with `id_empresa` but no `scope` records the session empresa on writes and leaves the list tenant-wide (tamanos, marcas-vehiculo, modelos-vehiculo, subfamilias, tipos-cambio). The core has no list-only empresa scope, so `punto-venta` and `trabajador-punto-venta`, whose desktop list is limited to the session empresa, list tenant-wide. Writes to entries that declare `id_usuario` need `X-User-Id`; the assigned-user field of `usuario-correlativos` is not a stamp.

### R-MOCK-14 Joined display fields
List and get MUST add the joined display keys declared by the entry (for example `empresa`, `familia`, `tipo_descuento`, `departamento`, `distrito`) and, for every `options` field `<name>`, the key `<name>_label` holding the option label (for example `tipo` and `tipo_label`); a join over a missing or inactive target MUST be an empty string.

### R-MOCK-15 Read-only lookups
The server MUST expose as read-only (GET list and GET by id only; any write answers 405 `METHOD_NOT_ALLOWED` with the error shape, distinct from `MODE_NOT_SUPPORTED`): `monedas`, `tipos-doc-iden`, `tablas-sunat`, `tablas-detalle-sunat`, plus the lookups `tipos-doc-venta`, `usuarios`, `trabajadores`, `familias-sunat` and `subfamilias-sunat` required by in-scope registers (confirmed; softcommerce-reference-catalogs R-REF-11). Each lookup declares its own `scope`: `shared` (one global dataset for all tenants) for `monedas`, `tipos-doc-iden`, `tablas-sunat`, `tablas-detalle-sunat`, `tipos-doc-venta`, `familias-sunat` and `subfamilias-sunat` (W6 to confirm); `tenant` (per-tenant dataset) for `trabajadores` and `usuarios`; `usuarios` is a projection (`project: 'users'`) of the auth `users.json` filtered by tenant (`{ id_usuario, usuario, nombre }`, no password, disabled users included), so it has no seed file of its own. Seeds MUST be isolated in JSON (R-MOCK-5) and registered from `entry.seed`.

### R-MOCK-16 Options endpoint for selects
The server MUST expose `GET /v1/lookups/{slug}?<key>=` (routed before the generic routes) returning `{ items: [{ id, name }] }`, where `name` comes from the entry's `optionLabel` (a field, or a list joined with " - "; default `descripcion`), and honoring the field `source.where` static filters. The accepted filter keys are the ref fields, every `dependsOn[].filterKey`, and the keys of any consumer `source.where` (the UI forwards the static `where` as strings, for example `estado=true`; `$session.empresa` is resolved by the server); any other key answers 400 `INVALID_FILTER`. The builtin sources `empresas` and `ubigeo` are not registry catalogs and only `ubigeo` is served by this route (below). Every ref field and every `dependsOn[].filterKey` declared in the registry MUST be accepted as an EXACT-match query parameter (for example `?id_localidad=`, `?id_punto_venta=&id_tipo_doc=`, `?id_tabla_sunat=`, `?tipo=`); exact match means `"1"` never matches `"10"`. Only active records are returned. Derived keys are declared on the target entry as `lookupFilters` (`via`, `exists` or a named rule). `lookups/tipos-doc-venta?id_punto_venta=` (an `exists` filter `{ catalog, local, key?, where? }`; `key` is optional and defaults to the filter key) MUST return only document types with an active (not deleted, `where` matching) row of `catalog` whose `local` holds their id and whose `key` equals the value, honoring the target catalog's session scope; `lookups/ubigeo?parent=` (rule `ubigeoChildren`) returns the children of the parent (departamentos without a parent, empty for an unknown parent, 400 for another key) and, with `has=zonas` (rule `ubigeoHasActive`), only ubigeos containing at least one active zona (not logically deleted; the `estado` flag is ignored). `has` is a closed list (`zonas`): a blank `has` filters nothing (plain children), an unnamed catalog (`has=localidades`) answers an empty list, an unknown query key is still 400. `/v1/ubigeo` is unchanged; a key resolved through `via` (for example the SubFamilia sunat options by the familia's SUNAT code) is resolved server-side. Unknown filter values MUST yield an empty `items` list, not an error. The generic list route keeps substring filters (R-MOCK-9).

### R-MOCK-17 Unsupported mode
A write for a mode outside the entry's `modes` (for example `POST /v1/empresa`, `DELETE /v1/choferes/{id}`) MUST answer 405 `MODE_NOT_SUPPORTED` with the error shape and leave the data unchanged. A write to a `readOnly` lookup is a different case and answers 405 `METHOD_NOT_ALLOWED` (R-MOCK-15).

### R-MOCK-18 Dual-source parity
The in-browser mock MUST implement the same registry rules as the HTTP server (R-MOCK-9..17), returning errors with the same `code`, status category and `details`. A contract suite (`catalogServiceContract`) MUST run every case against both sources through the same `InterCatalogService`.

## MODIFIED Requirements

### R-MOCK-1 Endpoint surface
The server MUST expose: `POST /auth/login`, `GET /auth/session-options`, `GET /menu`, `GET /forms/{formId}/permissions`, `GET|POST|PUT|DELETE /v1/{catalog}[/{id}]` for every registry catalog (R-MOCK-9; read-only lookups per R-MOCK-15), `GET /v1/lookups/{catalog}?<field>=` (R-MOCK-16), `GET /v1/ubigeo?parent=`, `GET /v1/params`. The W1 routes `GET /v1/empresas` and `GET /v1/puntos-venta?id_empresa=` (puntos de venta filtered by empresa) MUST stay byte-identical to W1 (same status, headers-independent body and item shape); the Wave 2 Empresa and PuntoVenta CRUD lives at `/v1/empresa` and `/v1/punto-venta` over the same storage section, so a record written there appears in the W1 routes with the W1 item shape.
(Previously: `/v1/{catalog}` was only exercised by `localidades`, and `empresas` / `puntos-venta` were special routes.)

### R-MOCK-5 Seed isolation
Seed data (users, tenants, empresas, puntos de venta, ubigeo, params, menu tree, permissions) and the seed of every registry catalog MUST live in JSON files separate from server logic. Seeds of registry entries MUST be registered automatically (no hardcoded seed lists). **[ASSUMPTION] The menu tree is inferred (real tree lives only in Oracle) and MUST be isolated in its own seed JSON so it can be replaced without code changes.**
(Previously: listed `localidades` explicitly and seed lists were hardcoded.)

### R-MOCK-7 Logical delete only **[ASSUMPTION]**
`DELETE /v1/{catalog}/{id}` MUST mark the record as inactive (logical delete) for every catalog that supports the mode. No physical-delete endpoint exists. Inactive records MUST NOT appear in default lists, MUST NOT be accepted as ref targets for new writes, and MUST NOT count for uniqueness.
(Previously: only `DELETE /v1/localidades/{id}`.)

## ADDED Scenarios

**S-MOCK-15 generic list and get** — Given the demo seed of `colores`, When `GET /v1/colores?page=1&pageSize=10` is called, Then the envelope of R-MOCK-3 is returned with only active rows; When `GET /v1/colores/{id}` is called for an inactive row, Then it resolves flagged inactive.

**S-MOCK-16 unknown slug** — Given `GET /v1/nope`, Then the answer is 404 with the error shape.

**S-MOCK-17 required and max length** — Given `POST /v1/tipos-descuento` with `abrev` of 6 characters and a blank `descripcion`, Then the answer is 422 `VALIDATION_ERROR` naming only `descripcion` (validation stops at the first failing step, design D10); Given a valid `descripcion` and the same `abrev`, Then 422 naming `abrev`.

**S-MOCK-18 normalization and trim** — Given `POST /v1/colores` with `descripcion` `"  rojo "`, Then the stored and returned value is `ROJO`.

**S-MOCK-19 kinds and ranges** — Given `POST /v1/turnos` with hora `13`, Then 422 with a detail on `hora`; Given `POST /v1/tipos-cambio` with `monto_venta` `0` or `-1`, Then 422 on `monto_venta`; Given `fecha` `2026-02-31`, Then 422 on `fecha`; Given an `options` value outside its list, Then 422.

**S-MOCK-20 conditional rule** — Given `POST /v1/correlativos` with `id_tipo_doc` `TI` and empty `nro_autorizacion`, Then 422 on `nro_autorizacion`; Given `id_tipo_doc` `01` with a typed `nro_autorizacion`, Then the stored value is an empty string.

**S-MOCK-21 composite unique** — Given an existing correlativo (PV 1, `01`, `F001`), When `POST` repeats the triple, Then 409 `DUPLICATE` with a detail on `serie`; When `PUT` of the same record keeps the triple, Then 200; When the existing record was logically deleted, Then the `POST` succeeds.

**S-MOCK-22 unique per empresa** — Given a tipos-cambio row (empresa 1, 2026-01-15, dólar), When the same date and moneda is posted under empresa 1, Then 409 on `fecha`; When posted under empresa 2, Then 201.

**S-MOCK-23 ref exists and active** — Given `POST /v1/subfamilias` with an unknown or inactive `id_familia`, Then 422 with a detail on `id_familia`.

**S-MOCK-24 ref belongs to parent** — Given `POST /v1/almacenes` whose `id_punto_venta` belongs to a different localidad than `id_localidad`, Then 422 with a detail on `id_punto_venta`.

**S-MOCK-25 generated code** — Given a catalog with `codeWidth` 4 and max code `0007`, When a record is created, Then its code is `0008`; Given the body contains an `id_*` or `activo`, Then both are ignored.

**S-MOCK-26 session values** — Given `POST /v1/modelos-vehiculo` with `X-Empresa-Id: 1` and `X-User-Id: 5`, Then the record stores empresa `1` and user `5` even when the body says `9`; Given the headers are missing, Then 400 `MISSING_SESSION_CONTEXT`.

**S-MOCK-27 empresa scope** — Given rows of empresa 1 and 2 in `familias`, When listed with `X-Empresa-Id: 1`, Then only empresa 1 rows return.

**S-MOCK-28 joins** — Given a `motivos-descuento` row, When listed, Then the item carries `tipo_descuento` with the description; Given the tipo was deactivated, Then `tipo_descuento` is an empty string and no error.

**S-MOCK-29 read-only lookups** — Given `GET /v1/tablas-detalle-sunat?id_tabla_sunat=6`, Then only detail rows of that tabla return; Given `POST /v1/monedas`, Then 405 `METHOD_NOT_ALLOWED` with the error shape.

**S-MOCK-30 options endpoint** — Given `GET /v1/lookups/punto-venta?id_localidad=2`, Then `{items:[{id,name}]}` holds only puntos de venta of localidad 2; Given localidades 1 and 10, Then `?id_localidad=1` never returns those of 10; Given `GET /v1/lookups/tipos-doc-venta?id_punto_venta=1`, Then only types with an active correlativo in PV 1 return; Given `?id_localidad=zzz`, Then `items` is empty with status 200; Given the generic list `GET /v1/punto-venta?descripcion=1`, Then substring matching still applies.

**S-MOCK-31 ubigeo with zonas** — Given `GET /v1/lookups/ubigeo?parent=&has=zonas`, Then only departamentos containing an active zona return; Given a blank `has`, Then the plain children return; Given `has=localidades`, Then `items` is empty with status 200; Given a zona with `estado` off but not deleted, Then its ubigeo is still offered.

**S-MOCK-32 unsupported mode** — Given `POST /v1/empresa`, Then 405 `MODE_NOT_SUPPORTED`; Given `DELETE /v1/socios/{id}`, Then 405 `MODE_NOT_SUPPORTED` and the socio stays active; the code differs from the `METHOD_NOT_ALLOWED` of S-MOCK-29.

**S-MOCK-33 logical delete generalized** — Given an active `marcas-vehiculo` row referenced by a `vehiculos` row, When `DELETE /v1/marcas-vehiculo/{id}`, Then 200/204, the default list excludes it, `GET /{id}` still resolves it flagged inactive, and a new write referencing it answers 422.

**S-MOCK-34 W1 routes** — Given the W1 suites, When they run, Then `GET /v1/empresas` and `GET /v1/puntos-venta?id_empresa=1` return byte-identical bodies to W1 (also after a record is created through `/v1/empresa` or `/v1/punto-venta`, which then appears with the W1 item shape); S-MOCK-1..14 pass unchanged.

**S-MOCK-35 dual-source contract** — Given the contract suite, When each of S-MOCK-15..33 and S-MOCK-36..38 runs against the in-browser mock and the HTTP server, Then both return the same `code`, status category and `details`.

**S-MOCK-36 invalid session empresa** — Given `X-Empresa-Id: 999`, which is not an empresa of the tenant, When `GET /v1/familias` (scope empresa) or `POST /v1/modelos-vehiculo` is called, Then the answer is 400 `INVALID_SESSION_CONTEXT` with the error shape; Given the header is absent, Then 400 `MISSING_SESSION_CONTEXT`; Given the W1 route `GET /v1/empresas` or Localidad with no headers, Then no context is required.

**S-MOCK-37 option labels** — Given `GET /v1/clasif-inventarios` with a row whose `tipo` is `E`, Then the item carries `tipo` `E` and `tipo_label` `Entrada`; `GET /{id}` returns the same keys.

**S-MOCK-38 shared and tenant lookup scope** — Given tenants `demo` and `botica`, When `GET /v1/monedas` is called for each, Then both return the same rows; When `GET /v1/usuarios` is called for each, Then each returns only its own tenant's rows.
