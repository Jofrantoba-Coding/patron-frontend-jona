# Delta for softcommerce-auth-session

Wave 3 connects the login to the Usuario master and the perfil permission editor: users and permissions edited in W3 drive who can log in and what a session may do, and a password never leaves the server. Marker legend: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-AUTH-1..9, S-AUTH-1..22).

## ADDED Requirements

### R-AUTH-10 Login reads the Usuario store
`POST /auth/login` MUST authenticate against the SAME user records that the `usuarios` master reads and writes (softcommerce-masters R-MST-7; there is one store, no copy). A user created in the Usuario master MUST be able to log in at the next attempt with its `usuario` and `clave` in every tenant listed in its record (the session tenant of its creation); an edit of `usuario`, `clave` or the flags MUST apply from the next attempt; a logically deleted user MUST be rejected with the generic invalid-credentials message of R-AUTH-4. The seeded users of W1 (`admin`, `cajero`, `bloqueado`, `soloweb`) MUST keep working unchanged.

### R-AUTH-11 Perfil-driven grants, applied at the next login
The session MUST hold, from step 2 (R-AUTH-7), the user's grants: the menu visibility and the 13 permission flags per form of the perfil of the user's trabajador (user -> `id_trabajador` -> `id_tipo_perfil`, softcommerce-user-permissions R-PRM-5). A user whose record has no trabajador or whose perfil has no stored overrides (every W1 / W2 seeded user) MUST receive the seeded defaults (`menu.json`, `permissions.json`), so the W1 / W2 behavior is byte-identical. The grants an open session observes (menu tree, toolbar gating, permission-denied behavior) MUST NOT change until logout: edits made in the perfil editor MUST apply only to the next login (user decision of 2026-10-23). `GET /menu`, `GET /forms/{formId}/permissions` and the batch `GET /forms/permissions` (all forms of the user's perfil in one answer) MUST resolve for the user named by the `X-User-Id` header when present and for the defaults when it is absent (W1 requests are unchanged). The login MUST snapshot the menu and the batch permissions into the session, so S-AUTH-26 holds even for forms never opened before a perfil edit. **[DEVIATION]** the desktop reads a form's permissions each time the form is opened; the web snapshots them at login. The snapshot is `Session.grants` (optional, stored with the session): step 2 takes it with the step-1 user header, and the shell service answers from it (a form it does not hold is denied); a session stored without it asks the server.

### R-AUTH-12 A password never leaves the server
The web app MUST never display, store (local / session storage, URL, session object), log or send back a password other than in the login request and the Usuario write request; the login form field MUST be cleared after submit. No auth response, session object, error `message`, `details` or `traceId` payload MAY contain a password (softcommerce-mock-api R-MOCK-23). The `usuarios` lookup and list rows MUST NOT carry it.

### R-AUTH-13 Flags edited in the master
A user whose `Habilitado` is off in the master MUST be rejected at the next login with the R-AUTH-4 "user disabled" message and a user whose `Escritorio` is off with the R-AUTH-4 "no desktop access" message, no session created; a master write MUST NOT terminate an already open session of that user **[ASSUMPTION]**. The stored values follow the existing convention of the seed: `flaghabilitado` `A` enabled / `D` disabled, `flagEscritorio` `S` / `N` (the desktop uses `H` for enabled; **[INFERRED]** the mock keeps its `A`).

## MODIFIED Requirements

### R-AUTH-7 Session lifecycle
A successful step 2 MUST create a session holding user, tenant, empresa, punto de venta, period, loaded params and the user's grants (R-AUTH-11), and navigate to the shell. Logout MUST clear the session and return to step 1. An unauthenticated visit to the shell MUST redirect to login.
(Previously: the session held user, tenant, empresa, punto de venta, period and loaded params, with no grants.)

## MODIFIED Scenarios

**S-AUTH-16 successful session** — Given valid selections, When confirming, Then the session holds tenant, user, empresa, punto de venta, period, params and grants (for a seeded user, the defaults) and the app navigates to the shell.

## ADDED Scenarios

**S-AUTH-23 created user logs in** — Given a user created in the Usuario master with `Habilitado` and `Escritorio` ticked and password `secreto1`, When logging in with its `usuario` and `secreto1`, Then step 2 is reached; with a wrong password the generic invalid-credentials message shows; a user created with the defaults (both unticked) is rejected with the R-AUTH-4 "user disabled" message.

**S-AUTH-24 password never leaves** — Given the login and every Usuario master call, Then no response body, error `message`, `details`, session object or storage entry contains the password; the login field is empty after submit (*Applied in W3-11b:* the password field is emptied when the form is submitted, whatever the answer, and the user name stays).

**S-AUTH-25 flags edited in the master** — Given an enabled user, When an administrator unticks `Habilitado` in the master, Then the next login shows the "user disabled" message and creates no session; When `Habilitado` is ticked and `Escritorio` unticked, Then the "no desktop access" message shows; an already open session of that user keeps working.

**S-AUTH-26 perfil edits apply at the next login** — Given a user of perfil P with an open session whose menu shows `Aduanas`, When an administrator unchecks `Aduanas` for P and unchecks `eliminate` on `miColor`, Then the open session still shows `Aduanas` and still enables Delete on Colores; after logout and a new login the menu omits `Aduanas` and Delete is disabled on Colores.

**S-AUTH-27 defaults for seeded users** — Given `admin` or `cajero` (no trabajador), When logging in, Then the menu and every form's permissions equal the seeded defaults and the W1 / W2 suites pass unchanged.

**S-AUTH-28 deleted user** — Given a user logically deleted in the master, When it logs in with its former credentials, Then the generic invalid-credentials message shows and no session is created; the user no longer appears in the `usuarios` list.

**S-AUTH-29 edited credentials** — Given a user whose `usuario` and password were edited in the master, When logging in with the old password, Then it is rejected; with the new, it succeeds.

**S-AUTH-31 snapshot covers unopened forms** — Given a user logged in who never opened `miColor`, When an administrator unchecks `eliminate` on `miColor` for the user's perfil, Then opening Colores in that session still enables Delete; after a new login it is disabled.

**S-AUTH-30 grants resolve by X-User-Id** — Given `GET /forms/miAduana/permissions` with `X-User-Id` of a user of perfil P and with no `X-User-Id`, Then the first returns P's flags and the second the seeded defaults; the W1 requests without the header are unchanged.
