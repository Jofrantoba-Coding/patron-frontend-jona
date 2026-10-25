# Delta for softcommerce-auth-session

This delta covers the product UX of the two login steps: the labelled dd/MM/yyyy period with a default, routing with an open session, and the fix for the contexto bounce (PR #107, absorbed). It also adds the auth frame. Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-AUTH-1..13, S-AUTH-1..31). Cross-screen rules: softcommerce-ux-conventions.

## ADDED Requirements

### R-AUTH-14 Auth frame
Both steps MUST render inside `JAuthLayout` (jona-ui-app-chrome R-CHR-9) with the product name `SoftCommerce`.
- A two-step indicator uses the existing step titles `Iniciar sesión` and `Contexto de trabajo` and marks the current step. Each step's title is its heading.
- Step 2 MUST show a line naming the logged user and the tenant (`Conectado como {nombre} en {base de datos}` **[ASSUMPTION]** wording), plus a `Cambiar usuario` action (R-AUTH-7).
- When loading the tenant options fails, step 1 MUST show the error with `Reintentar`, which reloads them. The `Base de datos` select stays disabled until the options load.
- While the puntos de venta load, step 2 MUST show a loading state on `Punto de venta`.
- Initial focus follows R-UX-3. The existing names (`Base de datos`, `Usuario`, `Contraseña`, `Empresa`, `Punto de venta`, `Ingresar`, `Confirmar`) MUST be kept.

## MODIFIED Requirements

### R-AUTH-5 Step 2: context selection
After valid credentials the user MUST select empresa, punto de venta (filtered by empresa) and the period `fechaInicio`/`fechaFin`.
- The period MUST be a group named `Período` holding two date fields labelled `Desde` (`fechaInicio`) and `Hasta` (`fechaFin`). Each is masked `dd/MM/yyyy` and reports ISO `yyyy-MM-dd` (jona-ui-forms R-FRM-6).
- On entering step 2 the period MUST be prefilled: `Desde` = 01/01 of the current year, `Hasta` = today, both in the local date (owner decision of 2026-10-24).
- When `Confirmar` loads the empresa params while `Desde` is still the untouched default, `Desde` MUST be clamped to max(01/01 of the current year, `INICIO_ACTIVIDADES`) before the period rules run **[ASSUMPTION]**. A `Desde` typed by the user is never clamped.
- A period error MUST be shown once, linked to the `Período` group (R-FRM-3), and the fields keep their values.

Period rules, each independently enforced (unchanged):
1. both dates are valid dates;
2. `fechaInicio >= INICIO_ACTIVIDADES` of the empresa;
3. `fechaFin >= fechaInicio`;
4. both dates fall in the same accounting year.

(Previously: two unlabelled date pickers with only the placeholders `Fecha inicio` / `Fecha fin`, the lib default ISO mask, no default period, and the period error as a loose alert linked to no field.)

### R-AUTH-7 Session lifecycle
A successful step 2 MUST create a session holding user, tenant, empresa, punto de venta, period, loaded params and the user's grants (R-AUTH-11), and navigate to the shell. It MUST land on the shell without rendering `/login` in between, under the production router configuration (the `v7_startTransition` and `v7_relativeSplatPath` future flags).
- An unauthenticated visit to the shell MUST redirect to login.
- A visit to `/login` or `/contexto` with an open session MUST redirect to `/` (replace).
- `/contexto` with neither a pending login nor a session MUST redirect to `/login`.
- `Cambiar usuario` on step 2 MUST clear the pending login and return to step 1.
- Logout (the user menu, softcommerce-shell-workspace R-SHELL-5, behind the dirty guard of R-SHELL-4) MUST clear the session and return to step 1.

(Previously: `/login` and `/contexto` ignored an open session, step 2 had no way back to step 1, and confirming step 2 could bounce to `/login` because the step-2 guard fired before the navigation committed.)

## ADDED Scenarios

**S-AUTH-32 labelled period** — Given step 2, Then `getByRole('group', { name: 'Período' })` holds `getByLabelText('Desde')` and `getByLabelText('Hasta')`. When `15/01/2026` is typed in `Desde`, Then `fechaInicio` is `2026-01-15`.

**S-AUTH-33 default period** — Given today is 2026-10-24 (fake clock), When step 2 opens, Then `Desde` shows `01/01/2026` and `Hasta` shows `24/10/2026`. Confirming with an empresa whose INICIO_ACTIVIDADES is before 2026-01-01 passes the period rules. With INICIO_ACTIVIDADES 2026-03-01 and `Desde` untouched, `Desde` becomes `01/03/2026` and the confirm passes. With `Desde` typed as `01/01/2026`, the S-AUTH-12 error shows.

**S-AUTH-34 period error linked** — Given `Hasta` before `Desde`, When confirming, Then the end-before-start message is in the accessible description of the `Período` group, it shows once, and both fields keep their values.

**S-AUTH-35 login with a session** — Given an open session, When `/login` is visited, Then the shell renders at `/`, and history back does not return to the login form.

**S-AUTH-36 contexto with a session** — Given an open session, When `/contexto` is visited, Then the shell renders at `/`.

**S-AUTH-37 no bounce** — Given valid step-2 selections, When `Confirmar` is pressed in a router with the production future flags, Then the shell renders and the login form never rendered after the click.

**S-AUTH-38 cambiar usuario** — Given step 2 after a valid login, When `Cambiar usuario` is activated, Then step 1 shows with empty `Usuario` and `Contraseña`, and visiting `/contexto` redirects to `/login`.

**S-AUTH-39 contexto without pending** — Given no pending login and no session, When `/contexto` is visited (for example after a reload), Then `/login` renders.

**S-AUTH-40 auth frame** — Given `/login`, Then `SoftCommerce` is visible, the step indicator marks `Iniciar sesión` as current, and `getByRole('heading', { name: 'Iniciar sesión' })` exists. On step 2, Then `Contexto de trabajo` is current, and the `Conectado como` line names the user and the tenant.

**S-AUTH-41 tenant retry** — Given `/auth/session-options` fails, Then an error with `Reintentar` shows and `Base de datos` is disabled. When `Reintentar` succeeds, Then the options load and the error is gone.

**S-AUTH-42 puntos de venta loading** — Given the puntos de venta request is pending, Then `Punto de venta` shows a loading state and is disabled.

## Test churn (assertions that change, S-CRUD-39 style)

- `src/views/uicontexto/UiContexto.spec.tsx:56-57`, `UiContexto.grants.spec.tsx` and `src/App.spec.tsx:45-46` query the dates by the placeholders `Fecha inicio` / `Fecha fin`. They change to the labels `Desde` / `Hasta`, and tests that relied on blank dates clear the default first. Assertions of S-AUTH-11..16 are unchanged.
- `src/App.spec.tsx:10-18` renders with the production future flags (S-AUTH-37).
- S-AUTH-18 (logout) keeps its meaning, and its tests open the user menu first (softcommerce-shell-workspace S-SHELL-15).
