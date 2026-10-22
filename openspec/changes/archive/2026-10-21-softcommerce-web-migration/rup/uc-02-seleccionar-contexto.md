# CU-02 Seleccionar contexto de trabajo (empresa, punto de venta, período)

Diagrams: [robustez](diagrams/uc-02-robustez.drawio) · [colaboración](diagrams/uc-02-colaboracion.drawio) · [secuencia](diagrams/uc-02-secuencia.drawio). Model: [uc-model.md](uc-model.md). Source spec: `specs/softcommerce-auth-session/spec.md`.

## Brief description

Step 2 of login, included by CU-01. The operator picks empresa, punto de venta (filtered by empresa) and the period `fechaInicio`/`fechaFin`. The system enforces four period rules, loads the empresa parameters, creates the session and opens the shell.

## Actors

- **Primary:** Usuario (operador).
- **Secondary:** Servidor mock (API). Routes `GET /v1/empresas`, `GET /v1/puntos-venta?id_empresa=`, `GET /v1/params`, all with `X-Tenant-Id`.

## Participants (JONA)

`UiContexto` «entry» (`UiContexto.tsx`) → `useUiContextoImpl` «impl» (`UiContextoImpl.ts`) → `UiContextoView` «visual» (pure render: no hooks, no services). The entry calls `useUiContextoImpl(service)` and renders `UiContextoView` with `UICONTEXTO_DEFAULTS` plus the Impl model. `InterAuthService` (`empresas`, `puntosVenta`, `params`) is injected as the `service` prop by `App` (`<UiContexto service={services.auth} />`, services composed in `main.tsx`) and forwarded as the Impl argument; it is not read from `useServices()`. The Impl also uses the pure period rules in `src/domain/period.ts` «domain» and `SessionProvider`/`sessionStore` «session» (`useSession()`).

## Preconditions

1. CU-01 finished successfully; its result is in memory.
2. The tenant is known and is sent as `X-Tenant-Id` [S-AUTH-22].

## Postconditions

- **Success:** the session holds tenant, user, empresa, punto de venta, period and loaded params, is stored under `sessionStorage` key `softcommerce.session.v1`, and the app shows the shell (CU-03) [S-AUTH-16].
- **Failure:** no session is created and step 2 stays on screen with the error.

## Basic flow

1. The system shows step 2 with the tenant's empresas [S-AUTH-9].
2. The operator picks an empresa. The system loads that empresa's puntos de venta [S-AUTH-9].
3. The operator picks a punto de venta and enters `fechaInicio` and `fechaFin`.
4. The operator confirms.
5. The system checks the period rules BR-02-1..4. They pass (the boundary case passes: inicio equal to `INICIO_ACTIVIDADES` and fin equal to inicio [S-AUTH-15]).
6. The system loads the empresa parameters (`params()`).
7. The system creates the session and navigates to the shell [S-AUTH-16].

## Alternative and exception flows

| ID | Trigger (step) | Flow | Scenarios |
|---|---|---|---|
| A1 | Empresa changed (2) | The punto de venta options reload for the new empresa and the previous selection is cleared. | S-AUTH-10 |
| A2 | Invalid date (5) | "31/02/2026" or empty: a date-invalid error shows; no session. | S-AUTH-11 |
| A3 | Before start of activity (5) | `fechaInicio` earlier than the empresa's `INICIO_ACTIVIDADES`: error; no session. | S-AUTH-12 |
| A4 | End before start (5) | `fechaFin < fechaInicio`: error; no session. | S-AUTH-13 |
| A5 | Different accounting year (5) | Dates in different years: same-year error; no session. | S-AUTH-14 |
| A6 | Service error (1, 2, 6) | `ApiError` message shows with `traceId` in details (same rule as CU-01 A5). | S-AUTH-21 (owned by CU-01) |
| A7 | Page reload during step 2 | The in-memory step-1 result is gone; the app returns to CU-01 step 1 (design, Session decision). | — (design) |

## Business rules

Each rule is enforced on its own (R-AUTH-5):

- **BR-02-1** Both dates are valid dates.
- **BR-02-2** `fechaInicio >= INICIO_ACTIVIDADES` of the empresa.
- **BR-02-3** `fechaFin >= fechaInicio`.
- **BR-02-4** Both dates fall in the same accounting year.
- **BR-02-5** Puntos de venta are filtered by empresa (`id_empresa`).
- **BR-02-6** The period is fixed for the session. The shell offers no control to change it; changing it requires logout [S-AUTH-17].
- **BR-02-7** Params (`BdEmpresaParametro` flags) are loaded as data only; no wave-1 behavior depends on them (R-MOCK-6).

## Special requirements

- **Keyboard:** Enter submits the active login step form [ASSUMPTION R-AUTH-8].
- **Header:** after this use case the shell shows the period as `dd/MM/yyyy – dd/MM/yyyy`, read-only (CU-03, S-SHELL-15).
- **Hard rule:** `UiContexto` and `UiContextoView` never call a service; `UiContextoView` raises value-first callbacks (`onEmpresaChange(idEmpresa)`) to the Impl.

## Assumptions

- [ASSUMPTION] The period is fixed per session (R-AUTH-6, proposal question 2).
- [ASSUMPTION] Enter submits the step form (R-AUTH-8).

## Scenarios traced

S-AUTH-9, 10, 11, 12, 13, 14, 15, 16, 17 (9). Tasks: see [README.md](README.md#cu-02-seleccionar-contexto-de-trabajo-empresa-punto-de-venta-período).
