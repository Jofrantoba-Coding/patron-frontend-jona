# CU-01 Iniciar sesión (tenant + credenciales)

Diagrams: [robustez](diagrams/uc-01-robustez.drawio) · [colaboración](diagrams/uc-01-colaboracion.drawio) · [secuencia](diagrams/uc-01-secuencia.drawio). Model: [uc-model.md](uc-model.md). Source spec: `specs/softcommerce-auth-session/spec.md`.

## Brief description

The operator picks a tenant (BdEmpresa), enters user and password, and the system authenticates them. Disabled users and users without desktop access are rejected. On success the system keeps the step-1 result in memory and continues with CU-02 («include»).

## Actors

- **Primary:** Usuario (operador).
- **Secondary:** Servidor mock (API). Routes `GET /auth/session-options` (public) and `POST /auth/login`.

## Participants (JONA)

`UiLogin` «entry» (`UiLogin.tsx`) → `useUiLoginImpl` «impl» (`UiLoginImpl.ts`) → `UiLoginView` «visual» (pure render: no hooks, no services). The entry calls `useUiLoginImpl(service)` and renders `UiLoginView` with `UILOGIN_DEFAULTS` plus the Impl model. `InterAuthService` is injected, not looked up: `main.tsx` builds the services once with `composeServices()` (`serviceComposer`), passes them to `App`, and the `/login` route renders `<UiLogin service={services.auth} />`; the entry forwards that `service` prop as the Impl argument. It resolves to `AuthServiceHttp` (http) or `AppServicesMock` (mock, lazy `import()`). The only context hooks in the Impl are `useSession()` and `useNavigate()`.

## Preconditions

1. The composer was built from valid `VITE_API_MODE`, `VITE_API_SCENARIO` and `VITE_API_URL` (E1).
2. No active session, or the operator was redirected here (A6) or logged out (A7).

## Postconditions

- **Success:** `{token, user}` and the selected tenant are held in memory only (not in `sessionStorage`). Step 2 (CU-02) is shown. No session exists yet.
- **Failure:** no session exists, step 2 is not reached, and step 1 stays on screen with the reason.

## Basic flow

1. The operator opens the app. The system shows step 1 and loads tenants with `sessionOptions()` (`GET /auth/session-options`, no tenant header).
2. The operator picks a tenant and enters user and password.
3. The operator submits with the button or with Enter in a field [S-AUTH-20].
4. The system checks that tenant, user and password are present.
5. The system calls `login({usuario, clave})` and sends the selected tenant as `X-Tenant-Id`.
6. The server accepts the credentials (user enabled, desktop access granted) and returns `{token, user}`.
7. The system keeps the result in memory and continues with CU-02 [S-AUTH-9 is CU-02's first step].

## Alternative and exception flows

| ID | Trigger (step) | Flow | Scenarios |
|---|---|---|---|
| A1 | Empty field (4) | No service call. A field-level message shows for each empty field. Back to step 2. | S-AUTH-5 |
| A2 | User disabled (6) | Server returns 403 `USER_DISABLED` (`flaghabilitado='D'`). A "user disabled" message shows. No session; step 2 is not reached. | S-AUTH-6 |
| A3 | No desktop access (6) | Server returns 403 `NO_DESKTOP_ACCESS` (`flagEscritorio='N'`). A "no desktop access" message, different from A2, shows. No session. | S-AUTH-7 |
| A4 | Wrong password (6) | Server returns 401 `INVALID_CREDENTIALS`. A generic invalid-credentials message shows. No session. | S-AUTH-8 |
| A5 | Server error (5–6) | The service rejects with `ApiError` (for example 500). The server `message` shows and `traceId` is available in the error details. | S-AUTH-21 |
| A6 | Visit to the shell without session | `RequireSession` redirects to login step 1. | S-AUTH-19 |
| A7 | Logout from the shell header | The session is cleared and step 1 shows. | S-AUTH-18 |
| E1 | Invalid configuration (app start) | The composer throws a configuration error: an unknown `VITE_API_MODE` names `VITE_API_MODE` [S-AUTH-3]; `http` with an empty or invalid `VITE_API_URL` fails [S-AUTH-4]. No request is made. | S-AUTH-3, S-AUTH-4 |

## Business rules

- **BR-01-1** Tenant, user and password are required (R-AUTH-3).
- **BR-01-2** `flaghabilitado = 'D'` rejects the login; `flagEscritorio = 'N'` rejects the login. Each has its own message (R-AUTH-4).
- **BR-01-3** Wrong credentials get a generic message that does not reveal which field failed (R-AUTH-4).
- **BR-01-4** The tenant travels as `X-Tenant-Id` on the login request and on every later request [S-AUTH-22].
- **BR-01-5** The step-1 result lives in memory only. A reload during step 2 returns to step 1 (design, Session decision).

## Special requirements

- **Keyboard:** Enter in a step-1 field submits the form exactly once [S-AUTH-20].
- **Service seam:** `VITE_API_MODE=mock` returns the mock implementation of `InterAuthService`, loaded lazily by dynamic import [S-AUTH-1]. `http` with a valid URL returns `AuthServiceHttp` and does not load the mock module [S-AUTH-2]. Seam patterns are copied from `appjona_codex_react_hooks`, never imported.
- **Supportability:** every request carries `X-Correlation-Id`, and every error keeps `traceId` (S-AUTH-21; mock side S-MOCK-1/2/3).
- **Hard rule:** `UiLogin` and `UiLoginView` never call a service or the mock server (Components ✕ API).

## Assumptions

- [ASSUMPTION] Enter submits the active login step (R-AUTH-8, proposal: basic keyboard support).
- [ASSUMPTION] Demo-grade audience; behavior matches the desktop rules listed above, not every desktop detail (proposal).

## Scenarios traced

S-AUTH-1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22 (13). Tasks: see [README.md](README.md#cu-01-iniciar-sesión-tenant--credenciales).
