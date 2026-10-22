# SoftCommerce mock server

Zero-dependency Node server (ESM, Node built-ins only) that serves the SoftCommerce API contract from in-memory state loaded from `data/*.json`. Business rules live in `core/` and are shared with the in-browser mock services.

## Run

```
npm run mock                 # http://localhost:4020
PORT=4030 npm run mock       # another port
MOCK_DATA_DIR=./my-seed npm run mock   # another seed directory
```

Point the app at it with `VITE_API_MODE=http` and `VITE_API_URL=http://localhost:4020` (see `.env.example`).

## Routes

Every route except the public ones needs `X-Tenant-Id` (400 `TENANT_REQUIRED`, 404 `TENANT_NOT_FOUND`). Every response carries `X-Correlation-Id` (echoed or generated). Errors are `{ code, message, details, traceId }`.

| Route | Notes |
|---|---|
| `GET /auth/session-options` | Public. `{items:[{id,name}]}` |
| `POST /auth/login` | `{usuario,clave}`. 200 `{token,user}`, 401 `INVALID_CREDENTIALS`, 403 `USER_DISABLED` / `NO_DESKTOP_ACCESS` |
| `GET /menu` | Flat `{items}`; the client builds the tree |
| `GET /forms/{formId}/permissions` | 13 booleans; unknown form is all `false` |
| `GET /v1/{catalog}` | `{items, pagination}`; `page`, `pageSize` (default 20, max 1000), `<field>=` filters |
| `GET /v1/{catalog}/{id}` | One record (inactive ones included) |
| `POST /v1/{catalog}` | 201; validation errors are 422 with `details` |
| `PUT /v1/{catalog}/{id}` | 200 |
| `DELETE /v1/{catalog}/{id}` | 204, logical (`activo:false`); `?physical` is 405 |
| `GET /v1/ubigeo?parent=` | Children by INEI code length; unknown parent is `[]` |
| `GET /v1/empresas`, `GET /v1/puntos-venta?id_empresa=`, `GET /v1/params` | Lookups; `{items}` (params: flags object) |
| `POST /__mock/reset` | Public. Restores the seed |

Only the `localidades` catalog exists in Wave 1.

## Tenants and users (seed)

Tenants: `demo` (Comercial Demo SAC), `botica` (Botica Salud EIRL).

| User | Password | Behavior |
|---|---|---|
| `admin` | `admin123` | OK in `demo` and `botica` |
| `cajero` | `cajero123` | OK in `demo` |
| `bloqueado` | `bloq123` | 403 `USER_DISABLED` |
| `soloweb` | `web123` | 403 `NO_DESKTOP_ACCESS` |

## Scenarios

The server always serves the full seed. The app scenarios (`exitoso`, `vacio`, `errorServidor`) apply to the in-browser mock mode only (`VITE_API_SCENARIO`).

## Seed swap

Replace any file in `data/` (for example `menu.json`, an inferred tree) or point `MOCK_DATA_DIR` at a copy; no code change is needed.

## Tests

`npx vitest run mock-server` (HTTP specs start the app on port 0 and use real `fetch`).
