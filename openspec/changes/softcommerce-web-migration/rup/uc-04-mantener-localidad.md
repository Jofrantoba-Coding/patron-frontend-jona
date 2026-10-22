# CU-04 Mantener Localidad

Diagrams: [robustez](diagrams/uc-04-robustez.drawio) · [colaboración](diagrams/uc-04-colaboracion.drawio) · [secuencia](diagrams/uc-04-secuencia.drawio). Model: [uc-model.md](uc-model.md). Source specs: `specs/softcommerce-localidad-catalog/spec.md`, `specs/softcommerce-crud-templates/spec.md`, S-SHELL-8 from `specs/softcommerce-shell-workspace/spec.md`.

## Brief description

The operator lists the tenant's localidades and adds, modifies, logically deletes, views or clones one. Localidad is built only as a `CatalogConfig` on the generic templates `uicrudlist` and `uicrudregister`; there is no Localidad-specific template code. The use case «include»s CU-04a (Ubigeo cascade) and CU-04b (Empresa), and «extend»s CU-03 at *formulario abierto* when `formId = mi_localidad`.

## Actors

- **Primary:** Usuario (operador).
- **Secondary:** Servidor mock (API). Routes `GET|POST|PUT|DELETE /v1/localidades[/{id}]`, `GET /v1/empresas`, `GET /v1/ubigeo?parent=`, with `X-Tenant-Id`.

## Participants (JONA)

Form entry: `UiLocalidad` (`views/uilocalidad`, the registered form) reads `catalog` and `lookup` with `useServices()` (the shell route is wrapped in `ServicesProvider`), builds `catalog<Localidad>('localidades')` once, and renders `UiCrudList` with `config`, `service`, `lookup` and the tab's `permissions`. List: `UiCrudList` «entry» → `useUiCrudListImpl(config, service, permissions, handlers)` «impl» → `UiCrudListView` «visual» (pure render: `CrudToolbar`, `CrudGrid` with `JPagination`); the entry mounts the register on a toolbar action. Register: `UiCrudRegister` «entry» (props `config`, `service`, `lookup`, `mode`, `id` from `UiCrudList`) → `useUiCrudRegisterImpl(config, service, mode, id, handlers)` «impl» → `UiCrudRegisterView` «visual» (pure render: `UppercaseTextField`, `CascadeSelect`). No entry or View calls a service; only the Impls do. Pure domain in `src/domain/crud`: `applyListView`, `filterSort`, `toolbarGate`, `validate`, `normalize`. Services: `InterCatalogService<Localidad>` (`CatalogServiceHttp` | `AppServicesMock`) and `InterLookupService` (`LookupServiceHttp` | `AppServicesMock`). Config: `src/catalogs/localidad/localidad.config.ts`. Entity: `Localidad {id_localidad, id_empresa, descripcion, direccion, id_ubigeo}` plus display fields `empresa, departamento, provincia, distrito`.

## Preconditions

1. CU-03 opened the `mi_localidad` tab and its `FormHost` exposed the 13 permission flags.

## Postconditions

- **Success:** the server state reflects the operation, the dialog is closed, the list is refreshed, and the affected row is selected (cleared after a delete).
- **Failure:** nothing is sent, or the dialog stays open with the error and the entered values.

## Basic flow (INSERT)

1. The system fetches the list once with `list({page:1, pageSize:1000})` and shows descripcion, direccion, empresa, departamento, provincia and distrito, with names already resolved and inactive records hidden [S-LOC-1]. While loading, a loading state shows; empty items show an empty message; a failure shows an error with retry [S-CRUD-1].
2. The toolbar enables each action only when its flag is true and, for modify, eliminate, clone and details, when a row is selected [S-CRUD-2, S-CRUD-3].
3. The operator clicks Add (`add = true`).
4. The register opens in INSERT mode with an empty form. It loads its lookups: CU-04b (empresas) and CU-04a (departamentos).
5. The operator picks the Empresa (CU-04b), types descripcion and direccion, and picks Departamento → Provincia → Distrito (CU-04a). Text fields turn to uppercase as typed [S-CRUD-15].
6. The operator submits with the button or Enter in a single-line field [S-CRUD-18].
7. The system validates all fields in `config.fields` order (BR-04-3..6).
8. The system asks for confirmation; the operator confirms.
9. The system normalizes the values and calls `create` once with `SEDE LIMA`-style uppercase values and the distrito id as `id_ubigeo` [S-LOC-2, S-CRUD-8].
10. The dialog closes, the list refreshes, and the new row is selected (the list jumps to the page that holds it) [S-CRUD-8].

## Alternative flows: list

| ID | Trigger | Flow | Scenarios |
|---|---|---|---|
| L1 | Filter typed | Rows narrow case-insensitively over configured columns ("lim" → LIMA); clearing restores all. Filter or sort change resets to page 1. | S-CRUD-5 |
| L2 | Header clicked twice | Sortable column sorts ascending, then descending. | S-CRUD-6 |
| L3 | Action without permission | With a flag false (for example `add=false`, `eliminate=false`), the action is disabled or hidden, and click or shortcut opens no dialog and sends no request. | S-SHELL-8, S-CRUD-4 |
| L4 | Row double-clicked | With `details=true` the register opens in DETAIL; with `details=false` nothing opens. | S-CRUD-7 |

## Alternative flows: register modes

| ID | Trigger | Flow | Scenarios |
|---|---|---|---|
| M1 | Modify (UPDATE) | Fields prefilled and editable; the three Ubigeo levels are preselected with options loaded (CU-04a R1). Submit calls `update` with the id; the list shows the new value and the row stays selected. | S-CRUD-9, S-LOC-11, S-LOC-12 |
| M2 | Delete (DELETE) | Fields prefilled and read-only; a confirmation is required. Confirming calls the logical delete; the localidad leaves the default list and stays flagged inactive on the server. Cancelling sends nothing. | S-CRUD-10, S-LOC-13 |
| M3 | Delete denied | With `eliminate=false`, Delete is disabled and no request is sent. | S-LOC-14 |
| M4 | Details (DETAIL) | All fields, including Ubigeo, populated and read-only. No submit button; Enter does nothing. | S-CRUD-11, S-LOC-15 |
| M5 | Clone (CLONE) | Prefilled except the id. Submit calls `create`, not `update`; a new record with a new id and identical data is created; the original is unchanged. | S-CRUD-12, S-LOC-16 |

## Exception flows

| ID | Trigger (step) | Flow | Scenarios |
|---|---|---|---|
| E1 | Required field empty (7) | No request. A field error shows and focus moves to the first invalid field (for a cascade, the first unset level). | S-CRUD-13 |
| E2 | Empresa missing (7) | Submit blocked with a field error. | S-LOC-3 (CU-04b) |
| E3 | Distrito missing (7) | Submit blocked. | S-LOC-5 (CU-04a) |
| E4 | Text over 100 (5) | Typing a 101st character is ignored. Pasting 10 characters into 95 is ignored whole (no truncation, no error). Pasting 10 over a 5-character selection in 95 is accepted (100). A value over 100 is never sent. | S-CRUD-14, S-LOC-4 |
| E5 | Confirmation declined (8) | Nothing is sent and the form stays open. | S-CRUD-16 |
| E6 | Server error on execute (9) | For example 500 or 422: the dialog stays open, the message shows and entered values remain. | S-CRUD-17 |
| E7 | Esc in the register | Untouched form: closes with no request. Dirty form: a discard confirmation shows first. | S-CRUD-19 |
| E8 | Lookup fails on open (4) | The dialog shows an error and submit is disabled. | S-CRUD-20 |

## CU-04a Seleccionar Ubigeo en cascada («include»)

Main flow: (1) on a fresh form, Provincia and Distrito are disabled and empty; (2) choosing a Departamento enables and loads Provincias only [S-LOC-6]; (3) choosing a Provincia loads Distritos; (4) choosing a Distrito sets `id_ubigeo`.

| ID | Trigger | Flow | Scenarios |
|---|---|---|---|
| R1 | Open in UPDATE/DELETE/DETAIL/CLONE | The three levels are restored from the record's `id_ubigeo` (`ancestorsOf`), all preselected with their option lists loaded. | S-LOC-11 |
| C1 | Departamento changed | Provincia and Distrito are cleared; Provincias reload for the new Departamento; Distrito is disabled. | S-LOC-7 |
| C2 | Provincia changed | Distrito is cleared and reloads; Departamento is unchanged. | S-LOC-8 |
| C3 | Distrito changed | Departamento and Provincia stay unchanged. | S-LOC-9 |
| C4 | Departamento changed twice quickly | When the first response arrives last, Provincia options reflect only the latest Departamento (`latest-request` guard). | S-LOC-10 |
| C5 | No Distrito on submit | Submit blocked (CU-04 E3). | S-LOC-5 |

## CU-04b Seleccionar Empresa («include»)

Main flow: the register loads `empresas()` from `GET /v1/empresas` on open and shows them in a required combo. Exception: no Empresa on submit blocks it with a field error [S-LOC-3]. A failed lookup is CU-04 E8.

## Business rules

- **BR-04-1** Delete is logical only (`eliminar`) and gated by `eliminate`. No UI action or service method performs a physical delete; `?physical` returns 405 [S-LOC-17] [ASSUMPTION R-LOC-6, R-CRUD-4].
- **BR-04-2** Toolbar gating: an action is enabled when `flag && (!rowDependent || selectedId) && implemented`. `export` is not implemented in wave 1 and renders disabled with a "not available" tooltip (design).
- **BR-04-3** Required: Empresa, Descripcion, Direccion, Departamento, Provincia, Distrito (R-LOC-3).
- **BR-04-4** Descripcion and Direccion are uppercase with a 100-character maximum. An insertion that would exceed the maximum is rejected whole (reject-overflow, no truncation); `normalize` re-applies uppercase on submit and `validate` still checks length for server values (R-CRUD-6, Swing `UpperCaseNumberDocument`).
- **BR-04-5** Validation errors come back in `config.fields` order and focus goes to the first invalid field.
- **BR-04-6** The selected Distrito id is stored as `id_ubigeo`.
- **BR-04-7** The list is tenant-scoped and hides inactive records. Client side is the source of truth in wave 1: one fetch, then filter → sort → page of 20; a "list truncated" warning shows when `pagination.total > items.length` (design).
- **BR-04-8** Register flow order: lookups → mode → load record (non-INSERT) → validate → confirm → execute → close, refresh, reselect by id (R-CRUD-5).

## Special requirements

- **Keyboard:** Enter submits once from a single-line field, not from a multiline field or a non-submit button [S-CRUD-18]. Esc closes the topmost dialog through the shell dialog stack [S-CRUD-19, CU-03 A9].
- **Dual source:** the same scenarios run against the in-process mock (`VITE_API_MODE=mock`, fixtures loaded by dynamic import, no HTTP) [S-LOC-18] and against the running mock server over HTTP [S-LOC-19]. The composer validates `VITE_API_*` for the catalog service the same way as for auth and throws before any request on invalid mode or missing URL [S-LOC-20].
- **Local components:** `CrudToolbar`, `CrudGrid`, `UppercaseTextField` and `CascadeSelect` are app-local under `src/shared/ui`, follow the JONA triad, use value-first callbacks, and have DEFAULTS without state values (R-CRUD-9).
- **Hard rule:** `UiCrudList`, `UiCrudRegister`, their Views and the shared components never call a service; the entries only pass `service`/`lookup` through. `CascadeSelect` raises `onChange(name, value)` and gets its options through the register's `loadChildren(parent)`; the register Impl calls `InterLookupService`.

## Assumptions

- [ASSUMPTION] Logical delete only (R-LOC-6, R-CRUD-4, R-MOCK-7).
- [ASSUMPTION] Enter submits and Esc closes, asking to discard when dirty (R-CRUD-8).
- [ASSUMPTION] The cascade loader is owned by `useUiCrudRegisterImpl` and injected into `CascadeSelect` as callbacks; the design names the `latest-request` guard but not where the loader lives. This keeps Components ✕ API.

## Scenarios traced

CU-04: S-SHELL-8; S-CRUD-1 … S-CRUD-20; S-LOC-1, 2, 4, 12, 13, 14, 15, 16, 17, 18, 19, 20 (33). CU-04a: S-LOC-5, 6, 7, 8, 9, 10, 11 (7). CU-04b: S-LOC-3 (1). S-CRUD-21 and S-CRUD-22 are supporting requirements. Tasks: see [README.md](README.md#cu-04-mantener-localidad).
