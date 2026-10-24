# Spec: softcommerce-auth-session

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
A successful step 2 MUST create a session holding user, tenant, empresa, punto de venta, period, loaded params and the user's grants (R-AUTH-11), and navigate to the shell. Logout MUST clear the session and return to step 1. An unauthenticated visit to the shell MUST redirect to login.

### R-AUTH-8 Keyboard **[ASSUMPTION]**
Enter MUST submit the active login step form.

### R-AUTH-9 Error surfacing
Service errors MUST show the server `message` and keep `traceId` available (e.g. in details) for support.

### R-AUTH-10 Login reads the Usuario store
`POST /auth/login` MUST authenticate against the SAME user records that the `usuarios` master reads and writes (softcommerce-masters R-MST-7; there is one store, no copy). A user created in the Usuario master MUST be able to log in at the next attempt with its `usuario` and `clave` in every tenant listed in its record (the session tenant of its creation); an edit of `usuario`, `clave` or the flags MUST apply from the next attempt; a logically deleted user MUST be rejected with the generic invalid-credentials message of R-AUTH-4. The seeded users of W1 (`admin`, `cajero`, `bloqueado`, `soloweb`) MUST keep working unchanged.

### R-AUTH-11 Perfil-driven grants, applied at the next login
The session MUST hold, from step 2 (R-AUTH-7), the user's grants: the menu visibility and the 13 permission flags per form of the perfil of the user's trabajador (user -> `id_trabajador` -> `id_tipo_perfil`, softcommerce-user-permissions R-PRM-5). A user whose record has no trabajador or whose perfil has no stored overrides (every W1 / W2 seeded user) MUST receive the seeded defaults (`menu.json`, `permissions.json`), so the W1 / W2 behavior is byte-identical. The grants an open session observes (menu tree, toolbar gating, permission-denied behavior) MUST NOT change until logout: edits made in the perfil editor MUST apply only to the next login (user decision of 2026-10-23). `GET /menu`, `GET /forms/{formId}/permissions` and the batch `GET /forms/permissions` (all forms of the user's perfil in one answer) MUST resolve for the user named by the `X-User-Id` header when present and for the defaults when it is absent (W1 requests are unchanged). The login MUST snapshot the menu and the batch permissions into the session, so S-AUTH-26 holds even for forms never opened before a perfil edit. **[DEVIATION]** the desktop reads a form's permissions each time the form is opened; the web snapshots them at login. The snapshot is `Session.grants` (optional, stored with the session): step 2 takes it with the step-1 user header, and the shell service answers from it (a form it does not hold is denied); a session stored without it asks the server.

### R-AUTH-12 A password never leaves the server
The web app MUST never display, store (local / session storage, URL, session object), log or send back a password other than in the login request and the Usuario write request; the login form field MUST be cleared after submit. No auth response, session object, error `message`, `details` or `traceId` payload MAY contain a password (softcommerce-mock-api R-MOCK-23). The `usuarios` lookup and list rows MUST NOT carry it.

### R-AUTH-13 Flags edited in the master
A user whose `Habilitado` is off in the master MUST be rejected at the next login with the R-AUTH-4 "user disabled" message and a user whose `Escritorio` is off with the R-AUTH-4 "no desktop access" message, no session created; a master write MUST NOT terminate an already open session of that user **[ASSUMPTION]**. The stored values follow the existing convention of the seed: `flaghabilitado` `A` enabled / `D` disabled, `flagEscritorio` `S` / `N` (the desktop uses `H` for enabled; **[INFERRED]** the mock keeps its `A`).

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

**S-AUTH-16 successful session** — Given valid selections, When confirming, Then the session holds tenant, user, empresa, punto de venta, period, params and grants (for a seeded user, the defaults) and the app navigates to the shell.

**S-AUTH-17 period immutable** — Given an active session, Then the shell exposes no control to change the period; changing it requires logout.

**S-AUTH-18 logout** — Given an active session, When logging out, Then the session is cleared and login step 1 shows.

**S-AUTH-19 guard** — Given no session, When visiting the shell route, Then the user is redirected to login.

**S-AUTH-20 Enter submits** — Given focus in the password field, When pressing Enter, Then step 1 submits once.

**S-AUTH-21 server error** — Given the service returns 500 with `traceId`, Then the server message shows and the `traceId` is available in the error details.

**S-AUTH-22 tenant header** — Given tenant "T1" selected, When any post-login request is made, Then it carries `X-Tenant-Id: T1`.

**S-AUTH-23 created user logs in** — Given a user created in the Usuario master with `Habilitado` and `Escritorio` ticked and password `secreto1`, When logging in with its `usuario` and `secreto1`, Then step 2 is reached; with a wrong password the generic invalid-credentials message shows; a user created with the defaults (both unticked) is rejected with the R-AUTH-4 "user disabled" message.

**S-AUTH-24 password never leaves** — Given the login and every Usuario master call, Then no response body, error `message`, `details`, session object or storage entry contains the password; the login field is empty after submit (*Applied in W3-11b:* the password field is emptied when the form is submitted, whatever the answer, and the user name stays).

**S-AUTH-25 flags edited in the master** — Given an enabled user, When an administrator unticks `Habilitado` in the master, Then the next login shows the "user disabled" message and creates no session; When `Habilitado` is ticked and `Escritorio` unticked, Then the "no desktop access" message shows; an already open session of that user keeps working.

**S-AUTH-26 perfil edits apply at the next login** — Given a user of perfil P with an open session whose menu shows `Aduanas`, When an administrator unchecks `Aduanas` for P and unchecks `eliminate` on `miColor`, Then the open session still shows `Aduanas` and still enables Delete on Colores; after logout and a new login the menu omits `Aduanas` and Delete is disabled on Colores.

**S-AUTH-27 defaults for seeded users** — Given `admin` or `cajero` (no trabajador), When logging in, Then the menu and every form's permissions equal the seeded defaults and the W1 / W2 suites pass unchanged.

**S-AUTH-28 deleted user** — Given a user logically deleted in the master, When it logs in with its former credentials, Then the generic invalid-credentials message shows and no session is created; the user no longer appears in the `usuarios` list.

**S-AUTH-29 edited credentials** — Given a user whose `usuario` and password were edited in the master, When logging in with the old password, Then it is rejected; with the new, it succeeds.

**S-AUTH-30 grants resolve by X-User-Id** — Given `GET /forms/miAduana/permissions` with `X-User-Id` of a user of perfil P and with no `X-User-Id`, Then the first returns P's flags and the second the seeded defaults; the W1 requests without the header are unchanged.

**S-AUTH-31 snapshot covers unopened forms** — Given a user logged in who never opened `miColor`, When an administrator unchecks `eliminate` on `miColor` for the user's perfil, Then opening Colores in that session still enables Delete; after a new login it is disabled.
