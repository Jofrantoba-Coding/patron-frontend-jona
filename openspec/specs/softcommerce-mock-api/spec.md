# Spec: softcommerce-mock-api

Zero-dependency Node mock server under `web_ts/softcommerce/mock-server`, in-memory state, JSON seed.
Marker legend: **[ASSUMPTION]** = proposal working assumption, easy to revise.

## Requirements

### R-MOCK-1 Endpoint surface
The server MUST expose: `POST /auth/login`, `GET /auth/session-options`, `GET /menu`, `GET /forms/{formId}/permissions`, `GET|POST|PUT|DELETE /v1/{catalog}[/{id}]` for every registry catalog (R-MOCK-9; read-only lookups per R-MOCK-15), `GET|POST|PUT|DELETE /v1/{catalog}/{id}/{child}[/{childId}]` for every declared child (R-MOCK-19), `POST /v1/{catalog}/{id}/actions/{action}`, `POST /v1/{catalog}/{id}/{child}/actions/{action}` and `POST /v1/{catalog}/{id}/{child}/{childId}/actions/{action}` (R-MOCK-22), the batch `GET /forms/permissions` resolved by `X-User-Id` (softcommerce-auth-session R-AUTH-11), the perfil permission routes of softcommerce-user-permissions R-PRM-5, `GET|PUT /v1/socio-acciones` (R-MOCK-26), `GET /v1/lookups/{catalog}?<field>=` (R-MOCK-16), `GET /v1/ubigeo?parent=`, `GET /v1/params`. The W1 routes `GET /v1/empresas` and `GET /v1/puntos-venta?id_empresa=` (puntos de venta filtered by empresa) MUST stay byte-identical to W1 (same status, headers-independent body and item shape); the Wave 2 Empresa and PuntoVenta CRUD lives at `/v1/empresa` and `/v1/punto-venta` over the same storage section, so a record written there appears in the W1 routes with the W1 item shape.

### R-MOCK-2 Tenant header
Every endpoint except `GET /auth/session-options` MUST require `X-Tenant-Id`; the tenant selects the in-memory dataset (BdEmpresa).

### R-MOCK-3 List envelope
List endpoints MUST return `{ items: [...], pagination: { page, pageSize, total } }`.

### R-MOCK-4 Error shape and correlation
Every error MUST be JSON `{ code, message, details, traceId }`. Every response MUST carry `X-Correlation-Id`: echoed from the request when present, generated otherwise.

### R-MOCK-5 Seed isolation
Seed data (users, tenants, empresas, puntos de venta, ubigeo, params, menu tree, permissions) and the seed of every registry catalog MUST live in JSON files separate from server logic. Seeds of registry entries MUST be registered automatically (no hardcoded seed lists). **[ASSUMPTION] The menu tree is inferred (real tree lives only in Oracle) and MUST be isolated in its own seed JSON so it can be replaced without code changes.**

### R-MOCK-6 Params seed
`GET /v1/params` MUST return the seeded `BdEmpresaParametro` flags (the Wave 1 keys `IS_FACTURADOR_SUNAT`, `ISBOTICA`, `DESPACHO_AUTOMATICO` and the Wave 3 keys of R-MOCK-24). The Wave 1 keys remain data only; the Wave 3 keys gate tabs and fields of the masters (R-MST-10..R-MST-15) through the session params.

### R-MOCK-7 Logical delete only **[ASSUMPTION]**
`DELETE /v1/{catalog}/{id}` MUST mark the record as inactive (logical delete) for every catalog that supports the mode. No physical-delete endpoint exists. Inactive records MUST NOT appear in default lists, MUST NOT be accepted as ref targets for new writes, and MUST NOT count for uniqueness.

### R-MOCK-8 State reset
The server MUST allow resetting in-memory state to seed (restart or reset hook) so tests are deterministic.

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
The server MUST expose as read-only (GET list and GET by id only; any write answers 405 `METHOD_NOT_ALLOWED` with the error shape, distinct from `MODE_NOT_SUPPORTED`): `monedas`, `tipos-doc-iden`, `tablas-sunat`, `tablas-detalle-sunat`, plus the lookups `tipos-doc-venta`, `familias-sunat` and `subfamilias-sunat` required by in-scope registers (confirmed; softcommerce-reference-catalogs R-REF-11), and the Wave 3 stubs of R-MOCK-25. Each lookup declares its own `scope`: `shared` (one global dataset for all tenants) for `monedas`, `tipos-doc-iden`, `tablas-sunat`, `tablas-detalle-sunat`, `tipos-doc-venta`, `familias-sunat` and `subfamilias-sunat` (W6 to confirm); `tenant` (per-tenant dataset) for the tenant stubs. `usuarios` and `trabajadores` are NOT read-only lookups any more: they are writable masters (softcommerce-masters R-MST-4, R-MST-7) whose `GET /v1/lookups/{slug}` contract and row keys stay as in W2; the `usuarios` master reads and writes the SAME `users.json` store the login uses (softcommerce-auth-session R-AUTH-10), filtered by tenant and never exposing the password (R-MOCK-23). Seeds MUST be isolated in JSON (R-MOCK-5) and registered from `entry.seed`.

### R-MOCK-16 Options endpoint for selects
The server MUST expose `GET /v1/lookups/{slug}?<key>=` (routed before the generic routes) returning `{ items: [{ id, name }] }`, where `name` comes from the entry's `optionLabel` (a field, or a list joined with " - "; default `descripcion`), and honoring the field `source.where` static filters. The accepted filter keys are the ref fields, every `dependsOn[].filterKey`, and the keys of any consumer `source.where` (the UI forwards the static `where` as strings, for example `estado=true`; `$session.empresa` is resolved by the server); any other key answers 400 `INVALID_FILTER`. The builtin sources `empresas` and `ubigeo` are not registry catalogs and only `ubigeo` is served by this route (below). Every ref field and every `dependsOn[].filterKey` declared in the registry MUST be accepted as an EXACT-match query parameter (for example `?id_localidad=`, `?id_punto_venta=&id_tipo_doc=`, `?id_tabla_sunat=`, `?tipo=`); exact match means `"1"` never matches `"10"`. Only active records are returned. Derived keys are declared on the target entry as `lookupFilters` (`via`, `exists` or a named rule). `lookups/tipos-doc-venta?id_punto_venta=` (an `exists` filter `{ catalog, local, key?, where? }`; `key` is optional and defaults to the filter key) MUST return only document types with an active (not deleted, `where` matching) row of `catalog` whose `local` holds their id and whose `key` equals the value, honoring the target catalog's session scope; `lookups/ubigeo?parent=` (rule `ubigeoChildren`) returns the children of the parent (departamentos without a parent, empty for an unknown parent, 400 for another key) and, with `has=zonas` (rule `ubigeoHasActive`), only ubigeos containing at least one active zona (not logically deleted; the `estado` flag is ignored). `has` is a closed list (`zonas`): a blank `has` filters nothing (plain children), an unnamed catalog (`has=localidades`) answers an empty list, an unknown query key is still 400. `/v1/ubigeo` is unchanged; a key resolved through `via` (for example the SubFamilia sunat options by the familia's SUNAT code) is resolved server-side. Unknown filter values MUST yield an empty `items` list, not an error. The generic list route keeps substring filters (R-MOCK-9).

### R-MOCK-17 Unsupported mode
A write for a mode outside the entry's `modes` (for example `POST /v1/empresa`, `DELETE /v1/choferes/{id}`) MUST answer 405 `MODE_NOT_SUPPORTED` with the error shape and leave the data unchanged. A write to a `readOnly` lookup is a different case and answers 405 `METHOD_NOT_ALLOWED` (R-MOCK-15).

### R-MOCK-18 Dual-source parity
The in-browser mock MUST implement the same registry rules as the HTTP server (R-MOCK-9..17 and R-MOCK-19..26), returning errors with the same `code`, status category and `details`. A contract suite (`catalogServiceContract`) MUST run every case against both sources through the same `InterCatalogService`.

### R-MOCK-19 Nested resources and composite write
For every registry entry that declares children (softcommerce-catalog-registry R-REG-14) the server MUST expose, under the parent, `GET|POST /v1/{slug}/{id}/{child}` and `GET|PUT|DELETE /v1/{slug}/{id}/{child}/{childId}`, driven only by the child entry. A child list MUST use the R-MOCK-3 envelope, MUST include active AND deactivated rows (the grid shows history) and MUST NOT include logically deleted rows; the generic filters of R-MOCK-9 apply to child fields. Child DELETE MUST follow the child's removal kind: `deactivate` sets the child `estado` to `D` and keeps the row (default list shows it), `delete` is the logical delete of R-MOCK-7. A nested route under an unknown, deleted, other-tenant or (for `scope=empresa` parents) other-empresa parent, or an unknown child name, MUST answer 404 with the error shape. Child writes MUST be validated like parent writes (R-MOCK-10..12) and stamped like the parent (R-MOCK-13, R-MD-8). The parent `POST` / `PUT` body MAY also carry `children: { <child>: [ { id?, op: 'I'|'A'|'E', ...fields } ] }` (`op` `I` insert, `A` update / deactivate, `E` delete; CHANGED rows only): the server MUST then apply the parent and every child change ATOMICALLY (all or nothing, nothing persisted on any failure) and answer errors with `details[].field` as `<child>[<n>].<field>` for a child failure, where `<n>` is the index of the op in the SENT array for that child. On CLONE the client sends no child ops and the server creates the initial `INICIO` activation of the new record (R-MD-9, R-ANX-2). The nested routes serve reads and independent child writes; the composite body serves the register submit of softcommerce-master-detail R-MD-5. Composite details (W3-4a): validation is fail-first (the parent, then the children in DECLARED order, then the ops in SENT order, then the named child rules), an unknown child name answers 422 on `children.<name>`, a bad `op` on `<child>[<n>].op`, and an `A`/`E` op naming a row that is not an active row of that parent on `<child>[<n>].id` (code `NOT_FOUND`); an `A` op deactivates (`estado: 'D'`) only a child whose removal is `deactivate` and never reactivates. A child row has the key `id` and carries its parent's id in the parent's `idKey`.

### R-MOCK-20 Search
The list route `GET /v1/{slug}` MUST accept `q`: case-insensitive free text, split on whitespace, where EVERY term must be contained in at least one of the entry's declared search fields (the picker display fields, for example `id_trabajador`, `nombre`, `dni`); a blank `q` filters nothing. `q` MUST combine (AND) with the per-field contains filters of R-MOCK-9, which MAY also name a joined display key of the entry (for example `transportista`, `clasificacion`, `marca`), and with the exact-match keys of R-MOCK-16 on this route too, where exact means the keys the entry declares in `lookupFilters` (for example `codigo_subfamilia_sunat`); every other list filter, ref fields included, stays a case-insensitive substring match as in Wave 2 (R-MOCK-9). A picker `select` filter MUST therefore be a declared `lookupFilters` key of its source (checked at load). Search results MUST be active records only, paged (R-MOCK-3, `page`, `pageSize`), and an unknown filter key keeps answering 400 `INVALID_FILTER` while `q` on an entry with no declared search fields answers an empty list, never an error. Values with regex or SQL metacharacters MUST be matched literally.

### R-MOCK-21 Child uniqueness and cascade
A child entry MAY declare a `unique` rule among its ACTIVE sibling rows (R-MD-6). A violation MUST answer 409 `DUPLICATE` with `details: [{ field, code, message }]` using the child's literal message (field `<child>[<n>].<field>` inside a composite write, the child field on a nested route); an update MUST NOT conflict with itself and deactivated or deleted siblings MUST NOT count. A logical delete of a parent (R-MOCK-7) MUST logically delete all its children and their nested routes MUST then answer 404; a logical delete MUST NOT be blocked by children. A child with `deactivate` removal MUST be reactivated only through an action (R-MOCK-22), never through a body `estado`. **Applied in W3-7:** an `A` op deactivates (`estado: D`) a child whose removal kind is `deactivate` or `none` (the activation history closes its rows; it has no DELETE); `delete` children ignore a body `estado`. A reactivation by an op is never accepted.

### R-MOCK-22 Row-action endpoint
The server MUST expose, for every action registered on an entry (softcommerce-row-actions R-ACT-1), `POST /v1/{slug}/{id}/actions/{action}` (and the nested form `.../{child}/{childId}/actions/{action}` where the action targets an existing child row, and `POST /v1/{slug}/{id}/{child}/actions/{action}` where the action targets no existing child row and creates one, for example Autorizar Series `activate`) with the action input as body. It MUST answer 200 with `{ row, parent?, message? }`: `row` is the updated row (the entry row for the entry form; for the child forms the child row, absent only when the server action targets no row), `parent` is the parent state (child forms; for example the derived `estado`) and `message` is the rule's own text. It MUST answer 404 for an unknown or `deferred` action, an unknown parent, child or row (a gated-off child included), 501 `NOT_IMPLEMENTED` for a declared action whose server action is not implemented, a 422 `body` detail for a body that is not an object, 409 `ACTION_NOT_ALLOWED` (message from the entry) when the row state does not allow it (for example `Activar` while an activation is active, R-ANX-5), and 422 `VALIDATION_ERROR` with `details` for invalid input (for example `fecha_fin` before `fecha_inicio`, R-ANX-4). The state derivation of R-ACT-5 MUST be applied in the same write. The Autorizar Series actions (`activate`, `deactivate`) MUST be served here over the shared `usuario-correlativos` store (R-PRM-7).

### R-MOCK-23 Password never leaves the server
`clave` (and `clave_confirmacion`) MUST be accepted on writes of `usuarios` only and MUST NEVER appear in any response: not in list, get, lookup, the login answer, a 4xx / 5xx body, `details`, or a log line. A write MUST validate length (max 20), confirmation equality (422 on `clave_confirmacion`) and, on create, presence (422 on `clave`); on update a missing or blank `clave` MUST keep the stored value. A contract test MUST assert the absence of both keys on every route of `usuarios` and of `/auth/login` against both sources.

### R-MOCK-24 Company parameter keys
The `GET /v1/params` payload MUST carry, per tenant, the flags that gate Wave 3 behavior: `IS_CLIENTE_SUSTITUTO`, `IS_CLIENTE_CREDITO`, `IS_CLIENTE_CONDICION_PAGO`, `IS_DIRECCION_CLIENTE`, `IS_ITEM_RESUMEN_PRECIO`, `IS_BOTICA_SIN_LOTE` and `PORC_IGV` (the company IGV percentage, **[INFERRED]** key name; the desktop reads `LoadDataGenerica.getPorcIgv`), next to the Wave 1 keys. **[ASSUMPTION]** Seeds: `demo` has `IS_CLIENTE_SUSTITUTO` true, `IS_CLIENTE_CREDITO` true, `IS_CLIENTE_CONDICION_PAGO` true, `IS_DIRECCION_CLIENTE` true, `IS_ITEM_RESUMEN_PRECIO` true, `IS_BOTICA_SIN_LOTE` false, `PORC_IGV` 18; `botica` has the desktop defaults (`IS_CLIENTE_SUSTITUTO` false, `IS_CLIENTE_CREDITO` false, `IS_CLIENTE_CONDICION_PAGO` false, `IS_DIRECCION_CLIENTE` true, `IS_ITEM_RESUMEN_PRECIO` false, `IS_BOTICA_SIN_LOTE` false, `PORC_IGV` 18). Behavior now depends on these flags in Wave 3 (R-MST-10..R-MST-15); the Wave 1 keys keep their meaning.

### R-MOCK-25 Read-only stubs of W6 data
**Applied in W3-18:** `clases-sunat` gains the exact-by-subfamilia filter key `id_subfamilia` (a `via` over the SUNAT code `id_subfamilia_sunat` of `subfamilias`) beside `codigo_subfamilia_sunat`, and two seeded classes for the code `501015`.
The server MUST expose as read-only lookups (R-MOCK-15 semantics: GET list and by id; any write answers 405 `METHOD_NOT_ALLOWED`), seeded from JSON and documented as the W6 contract (the real data and the final scopes belong to W6): `cuentas-contables` (tenant scope; `{ id_cuenta, cuenta, descripcion }`; kept as the read-only stub of the proposal although the Cliente `Cuenta` is a bank account, R-MST-11, so no W3 screen consumes it), `parametros-prov` (tenant scope; `{ id_parametro_prov, descripcion, id_cuenta, cuenta, tipo, flag_compra, flag_venta, flag_tesoreria, flag_fondo_fijo }`, the `BeanParametroProv` fields, for the BuscarParametroProv picker), `clases-sunat` (shared; `{ id_clase_sunat, descripcion, codigo_subfamilia_sunat }`, filter key `codigo_subfamilia_sunat`, for the Item `Codigo Sunat`) and `padrones` (shared; `{ id_padron, descripcion }` with `01` EXCEPTUADO, `02` AG. RETENCION, `03` AG. PERCEPCION, `04` BUEN CONTRIBUYENTE, R-ANX-7). The shapes of the first three are **[INFERRED]**.

### R-MOCK-26 Socio acciones resource
The server MUST expose `GET /v1/socio-acciones` returning `{ precios: [...], socios: [...] }` (all rows, active and deactivated) and `PUT /v1/socio-acciones` with the body `{ precios: [ { id?, op, ... } ], socios: [ { id?, op, ... } ] }` applied ATOMICALLY (nothing persisted on any failure). It MUST enforce: a price active at most once (`No se Puede Agregar mas de un Precio`), the save requiring an active price (422 `Ingrese Precio`), a socio active at most once (409 `Socio ya esta activado`), a socio `cantidad` present (422 `Ingrese Cantidad`) and a price `fecha_fin` after its `fecha_inicio` (422 `Fecha es menor a fecha inicial`), and MUST apply a newly activated price to every active socio row in the same write. **[ASSUMPTION]** The answer message is the text the desktop showed from the procedure result and is carried as `message`; the mock answers `Acciones guardadas correctamente` [INFERRED]. **Applied in W3-20:** an op is `I` (insert an ACTIVE row: price `{ precio, fecha_inicio }`, socio `{ id_socio, cantidad, fecha_inicio }`) or `A` (update a stored row: `{ id, estado: 'D', fecha_fin }` deactivates it with a `fecha_fin` after its `fecha_inicio`); a new socio takes the current active price; the check order is the price ops, then the final active price (`Ingrese Precio`), then the socio ops. The answer is `{ message, precios, socios }`; `GET` joins `numero_doc` and `socio` (the name) to each socio row. A refusal of a duplicate is 409 `ACTION_NOT_ALLOWED` with the sentence as `message`; the 422 rules answer `VALIDATION_ERROR` with the sentence in `details[0].message`.

## Scenarios

**S-MOCK-1 correlation echoed** — Given a request with `X-Correlation-Id: abc`, When any endpoint responds, Then the response header `X-Correlation-Id` equals `abc`.

**S-MOCK-2 correlation generated** — Given no `X-Correlation-Id`, When any endpoint responds, Then the response contains a non-empty generated `X-Correlation-Id`.

**S-MOCK-3 error shape** — Given `GET /v1/localidades/does-not-exist`, When the server responds, Then status is 404 and the body has `code`, `message`, `details`, `traceId`, with `traceId` equal to the response correlation id.

**S-MOCK-4 missing tenant** — Given `GET /menu` without `X-Tenant-Id`, When called, Then status is 400 with an error-shape body whose `code` identifies the missing tenant.

**S-MOCK-5 unknown tenant** — Given `X-Tenant-Id: nope`, When any tenant-scoped endpoint is called, Then status is 404 or 400 with the error shape and no data leaks.

**S-MOCK-6 session options public** — Given no tenant header, When `GET /auth/session-options`, Then status 200 and the body lists tenants (id, name).

**S-MOCK-7 list envelope** — Given 25 seeded localidades and `page=2&pageSize=10`, When listing, Then `items.length` is 10 and `pagination` is `{page:2,pageSize:10,total:25}`.

**S-MOCK-8 ubigeo children** — Given `GET /v1/ubigeo?parent=` empty, Then departamentos are returned; Given a departamento id as `parent`, Then only its provincias; Given a provincia id, only its distritos.

**S-MOCK-9 ubigeo bad parent** — Given an unknown `parent`, When called, Then the response is an empty `items` list (not an error).

**S-MOCK-10 logical delete** — Given an active localidad, When `DELETE /v1/localidades/{id}`, Then status 200/204, a subsequent default list excludes it, and `GET /v1/localidades/{id}` still resolves it flagged inactive.

**S-MOCK-11 no physical delete** — Given any catalog path, When a physical-delete route (e.g. `DELETE .../{id}?physical=true` or `/fisico`) is called, Then the server responds 404/405 with the error shape.

**S-MOCK-12 validation error** — Given `POST /v1/localidades` with missing `descripcion`, When called, Then status 422/400 with error shape and `details` naming the field.

**S-MOCK-13 seed isolation** — Given the repo, When the menu seed JSON is replaced with another valid tree, Then `GET /menu` serves it without any change to server code.

**S-MOCK-14 reset** — Given a created localidad, When state is reset, Then lists equal the seed.

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

**S-MOCK-35 dual-source contract** — Given the contract suite, When each of S-MOCK-15..33, S-MOCK-36..38 and S-MOCK-39..58 runs against the in-browser mock and the HTTP server, Then both return the same `code`, status category and `details`.

**S-MOCK-36 invalid session empresa** — Given `X-Empresa-Id: 999`, which is not an empresa of the tenant, When `GET /v1/familias` (scope empresa) or `POST /v1/modelos-vehiculo` is called, Then the answer is 400 `INVALID_SESSION_CONTEXT` with the error shape; Given the header is absent, Then 400 `MISSING_SESSION_CONTEXT`; Given the W1 route `GET /v1/empresas` or Localidad with no headers, Then no context is required.

**S-MOCK-37 option labels** — Given `GET /v1/clasif-inventarios` with a row whose `tipo` is `E`, Then the item carries `tipo` `E` and `tipo_label` `Entrada`; `GET /{id}` returns the same keys.

**S-MOCK-38 shared and tenant lookup scope** — Given tenants `demo` and `botica`, When `GET /v1/monedas` is called for each, Then both return the same rows; When `GET /v1/usuarios` is called for each, Then each returns only its own tenant's rows (now a writable master, without any password key, R-MOCK-23).

**S-MOCK-39 nested list** — Given a Cliente with two direcciones (one deactivated) and one logically deleted, When `GET /v1/clientes/{id}/direcciones` is called, Then the envelope lists the two and not the deleted; `GET .../direcciones/{childId}` resolves a deactivated one.

**S-MOCK-40 nested create and 404** — Given `POST /v1/clientes/{id}/contactos` with valid data, Then 201 with the child and it appears in the list; Given an unknown parent id, an unknown child name, or a deleted parent, Then 404 with the error shape; a parent of another tenant answers 404.

**S-MOCK-41 child removal kinds** — Given `DELETE .../direcciones/{childId}` (kind `deactivate`), Then the row stays listed with `estado` `D`; Given `DELETE /v1/transportistas/{id}/vehiculos/{childId}` (kind `delete`), Then it disappears from the list.

**S-MOCK-42 composite atomic write** — Given `POST /v1/clientes` with a valid parent and two children of which the second is invalid, Then the answer is 422 with `details[].field` `direcciones[1].direccion`, and `GET /v1/clientes` does not contain the parent and no child exists; with all valid, Then 201 and every child persists.

**S-MOCK-43 child unique** — Given an active item almacén row (almacén A, proceso VENTA), When the same pair is posted, Then 409 `DUPLICATE` with `Almacen ya se Encuentra Activado`; When the existing row is deactivated, Then 201; a PUT keeping its own values answers 200.

**S-MOCK-44 cascade** — Given a Vendedor with activations, When it is deleted, Then 200/204, `GET /v1/vendedores/{id}/activaciones` answers 404 and the rows are logically deleted.

**S-MOCK-45 q search** — Given trabajadores `JUAN PEREZ LOPEZ` and `MARIA GARCIA RAMOS`, When `GET /v1/trabajadores?q=perez juan` is called, Then only the first returns; `?q=` blank returns all active; `?q=%` or `?q=.*` returns nothing (literal); inactive records never return.

**S-MOCK-46 search by joined key and paging** — Given 25 active vehiculos, When `GET /v1/vehiculos?marca=toy&page=2&pageSize=10` is called, Then the envelope is paged and only vehiculos whose joined marca contains `toy` return; `?placa=ab&q=lima` combines both with AND; an unknown key answers 400 `INVALID_FILTER`.

**S-MOCK-47 action endpoint** — Given a Trabajador whose last activation is deactivated, When `POST /v1/trabajadores/{id}/actions/activar` with `{ fecha_inicio, motivo }` is called, Then 200, a new active activation exists and the derived `estado` is `A`.

**S-MOCK-48 action not allowed** — Given a Banco whose last activation is active, When `activar` is posted, Then 409 `ACTION_NOT_ALLOWED` with `Banco ya Esta Activado` and the data is unchanged; an unknown action answers 404.

**S-MOCK-49 action validation** — Given an active activation starting 2026-03-10, When `desactivar` is posted with `fecha_fin` 2026-03-09, Then 422 with a detail on `fecha_fin` (`Fecha es menor a fecha inicial`).

**S-MOCK-50 password never leaves** — Given `POST /v1/usuarios` with `clave`, Then no response of `POST`, `GET list`, `GET {id}`, `PUT`, `/v1/lookups/usuarios`, `/auth/login` or any 4xx body (including a 422 for `clave`) contains `clave`, `clave_confirmacion` or `password`.

**S-MOCK-51 usuario password rules** — Given `POST /v1/usuarios` without `clave`, Then 422 on `clave`; with 21 characters, Then 422 on `clave`; with a different `clave_confirmacion`, Then 422 on `clave_confirmacion`; Given `PUT` with no `clave`, Then the stored password is kept and the user can still log in with it.

**S-MOCK-52 params keys** — Given `GET /v1/params` for `demo` and `botica`, Then each carries the keys of R-MOCK-24 with the seeded values and the Wave 1 keys are unchanged.

**S-MOCK-53 stubs read-only** — Given `GET /v1/cuentas-contables`, `/v1/parametros-prov`, `/v1/clases-sunat?codigo_subfamilia_sunat=...` and `/v1/padrones`, Then they return the seed; Given `POST` on any, Then 405 `METHOD_NOT_ALLOWED`.

**S-MOCK-54 socio-acciones composite** — Given an active price, When `PUT /v1/socio-acciones` activates a second price, Then 409 `No se Puede Agregar mas de un Precio` and nothing changes; Given no active price in the final state, Then 422 `Ingrese Precio`; Given a valid body, Then 200 with `message`, the new price applied to every active socio and all rows persisted atomically.

**S-MOCK-55 usuarios master writes** — Given `POST /v1/usuarios` with `id_trabajador` of an unknown or inactive trabajador, Then 422 on `id_trabajador`; Given a duplicate `usuario` in the tenant, Then 409 on `usuario`; Given a valid body, Then 201 and `GET /v1/lookups/usuarios` lists `{ id, name }` with the derived nombre.

**S-MOCK-56 action that creates a child** — Given `POST /v1/usuarios/{id}/series/actions/activate` with a valid pair, Then 200 with the new authorization row; a duplicate active pair answers 409 `ACTION_NOT_ALLOWED`/`DUPLICATE` with the W2 literal message.

**S-MOCK-57 composite index** — Given a composite body whose second sent `direcciones` op is invalid, Then `details[].field` is `direcciones[1].direccion` (index in the sent array, not in the stored list).

**S-MOCK-58 batch permissions** — Given `GET /forms/permissions` with `X-User-Id`, Then it returns the flags of every form for that user's perfil (defaults without overrides); without the header, the seeded defaults.
