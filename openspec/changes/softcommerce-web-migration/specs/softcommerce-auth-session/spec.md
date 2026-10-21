# Spec: softcommerce-auth-session (ADDED)

Marker legend: **[ASSUMPTION]** = proposal working assumption.

## Requirements

### R-AUTH-1 Service seam
The app MUST define `InterAuthService` with two implementations: `AuthServiceHttp` and a mock implementation backed by typed scenario fixtures, which the composer loads lazily. A pure composer MUST select one from `VITE_API_*` env values (`VITE_API_MODE`, `VITE_API_SCENARIO`, `VITE_API_URL`), validate them, and load the mock through dynamic import only when mock mode is selected. Patterns are copied from `appjona_codex_react_hooks`, never imported.

### R-AUTH-2 Composer validation
The composer MUST fail with an explicit configuration error when mode is invalid, or when mode is `http` and the base URL is missing/not a valid URL.

### R-AUTH-3 Step 1: tenant + credentials
Login MUST require a tenant (from `/auth/session-options`, sent as `X-Tenant-Id`), a user and a password. Empty fields MUST block submission with field-level messages.

### R-AUTH-4 Account rejection
Login MUST reject `flaghabilitado = 'D'` (disabled user) and `flagEscritorio = 'N'` (no desktop access), each with a distinct message and no session created. Wrong credentials MUST be rejected with a generic message.

### R-AUTH-5 Step 2: context selection
After valid credentials the user MUST select empresa, punto de venta (filtered by empresa) and period `fechaInicio`/`fechaFin`. Period rules, each independently enforced:
1. both dates are valid dates;
2. `fechaInicio >= INICIO_ACTIVIDADES` of the empresa;
3. `fechaFin >= fechaInicio`;
4. both dates fall in the same accounting year.

### R-AUTH-6 Period fixed per session **[ASSUMPTION]**
The period MUST NOT be changeable after login without logging out.

### R-AUTH-7 Session lifecycle
A successful step 2 MUST create a session holding user, tenant, empresa, punto de venta, period and loaded params, and navigate to the shell. Logout MUST clear the session and return to step 1. An unauthenticated visit to the shell MUST redirect to login.

### R-AUTH-8 Keyboard **[ASSUMPTION]**
Enter MUST submit the active login step form.

### R-AUTH-9 Error surfacing
Service errors MUST show the server `message` and keep `traceId` available (e.g. in details) for support.

## Scenarios

**S-AUTH-1 composer picks mock** — Given `VITE_API_MODE=mock`, When composed, Then the mock implementation of `InterAuthService` is returned and its module was loaded lazily by the composer via dynamic import.

**S-AUTH-2 composer picks http** — Given mode `http` and a valid base URL, Then `AuthServiceHttp` is returned and the mock module is not loaded.

**S-AUTH-3 composer invalid mode** — Given an unknown `VITE_API_MODE` value, When composed, Then it throws a configuration error naming `VITE_API_MODE`.

**S-AUTH-4 composer http without URL** — Given mode `http` and empty base URL (or `not-a-url`), Then it throws a configuration error.

**S-AUTH-5 empty fields** — Given empty user, When submitting step 1, Then no service call occurs and the field error shows.

**S-AUTH-6 disabled user** — Given a user with `flaghabilitado='D'` and correct password, When logging in, Then an "user disabled" message shows, no session exists, step 2 is not reached.

**S-AUTH-7 no desktop access** — Given `flagEscritorio='N'` and correct password, Then a "no desktop access" message (different from S-AUTH-6) shows and no session exists.

**S-AUTH-8 bad credentials** — Given a wrong password, Then a generic invalid-credentials message shows and no session exists.

**S-AUTH-9 valid login to step 2** — Given an enabled desktop user, When credentials are accepted, Then step 2 shows tenant-scoped empresas and the user's puntos de venta.

**S-AUTH-10 punto de venta filtered** — Given the user changes empresa, Then the punto de venta options reload for that empresa and the previous selection is cleared.

**S-AUTH-11 period: invalid date** — Given `fechaInicio` "31/02/2026" or empty, When confirming, Then a date-invalid error shows and no session is created.

**S-AUTH-12 period: before INICIO_ACTIVIDADES** — Given empresa INICIO_ACTIVIDADES 2020-01-01 and `fechaInicio` 2019-12-31, Then a before-start-of-activity error shows.

**S-AUTH-13 period: fin before inicio** — Given inicio 2026-06-01 and fin 2026-05-31, Then an end-before-start error shows.

**S-AUTH-14 period: different accounting year** — Given inicio 2025-12-01 and fin 2026-01-31, Then a same-year error shows.

**S-AUTH-15 period: boundary valid** — Given inicio equal to INICIO_ACTIVIDADES and fin equal to inicio (same day), Then validation passes.

**S-AUTH-16 successful session** — Given valid selections, When confirming, Then the session holds tenant, user, empresa, punto de venta, period, params and the app navigates to the shell.

**S-AUTH-17 period immutable** — Given an active session, Then the shell exposes no control to change the period; changing it requires logout.

**S-AUTH-18 logout** — Given an active session, When logging out, Then the session is cleared and login step 1 shows.

**S-AUTH-19 guard** — Given no session, When visiting the shell route, Then the user is redirected to login.

**S-AUTH-20 Enter submits** — Given focus in the password field, When pressing Enter, Then step 1 submits once.

**S-AUTH-21 server error** — Given the service returns 500 with `traceId`, Then the server message shows and the `traceId` is available in the error details.

**S-AUTH-22 tenant header** — Given tenant "T1" selected, When any post-login request is made, Then it carries `X-Tenant-Id: T1`.
