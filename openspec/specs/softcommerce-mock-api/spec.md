# Spec: softcommerce-mock-api

Zero-dependency Node mock server under `web_ts/softcommerce/mock-server`, in-memory state, JSON seed.
Marker legend: **[ASSUMPTION]** = proposal working assumption, easy to revise.

## Requirements

### R-MOCK-1 Endpoint surface
The server MUST expose: `POST /auth/login`, `GET /auth/session-options`, `GET /menu`, `GET /forms/{formId}/permissions`, `GET|POST|PUT|DELETE /v1/{catalog}[/{id}]`, `GET /v1/ubigeo?parent=`, `GET /v1/empresas`, `GET /v1/puntos-venta?id_empresa=` (puntos de venta filtered by empresa), `GET /v1/params`.

### R-MOCK-2 Tenant header
Every endpoint except `GET /auth/session-options` MUST require `X-Tenant-Id`; the tenant selects the in-memory dataset (BdEmpresa).

### R-MOCK-3 List envelope
List endpoints MUST return `{ items: [...], pagination: { page, pageSize, total } }`.

### R-MOCK-4 Error shape and correlation
Every error MUST be JSON `{ code, message, details, traceId }`. Every response MUST carry `X-Correlation-Id`: echoed from the request when present, generated otherwise.

### R-MOCK-5 Seed isolation
Seed data (users, tenants, empresas, puntos de venta, ubigeo, localidades, params, menu tree, permissions) MUST live in JSON files separate from server logic. **[ASSUMPTION] The menu tree is inferred (real tree lives only in Oracle) and MUST be isolated in its own seed JSON so it can be replaced without code changes.**

### R-MOCK-6 Params seed
`GET /v1/params` MUST return the seeded `BdEmpresaParametro` flags (e.g. `IS_FACTURADOR_SUNAT`, `ISBOTICA`, `DESPACHO_AUTOMATICO`) as data only; no behavior depends on them in Wave 1.

### R-MOCK-7 Logical delete only **[ASSUMPTION]**
`DELETE /v1/localidades/{id}` MUST mark the record as inactive (logical delete). No physical-delete endpoint exists. Inactive records MUST NOT appear in default lists.

### R-MOCK-8 State reset
The server MUST allow resetting in-memory state to seed (restart or reset hook) so tests are deterministic.

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
