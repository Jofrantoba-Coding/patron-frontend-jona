# Spec: softcommerce-ux-conventions

Cross-screen UX rules of `web_ts/softcommerce` on top of `jona-ui` 1.6.0: the feedback taxonomy, focus management, the app keyboard map and its collision rules, the theme choice, stable accessible names, and the CSS contract ("no class outside the shipped CSS"). The per-screen behavior lives in the softcommerce-* deltas of this change, which cite these rules.
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise. **[DEVIATION]** = intended break from desktop or W1–W3 behavior (owner decision of 2026-10-24). Requirements R-UX-1..9, scenarios S-UX-1..24.

## Requirements

### R-UX-1 Feedback taxonomy
Each situation MUST use exactly this channel:

| Situation | Channel |
|---|---|
| Success of a save, delete or action | `success` toast; never a modal **[DEVIATION]** |
| Field validation | message under the field, plus one error summary on a blocked submit (jona-ui-forms R-FRM-1, R-FRM-4) |
| Server error inside a dialog or drawer | form-level `JAlert` (`role="alert"`) at the top of it, with the trace id in a disclosure (R-AUTH-9) |
| Server error of an action with no dialog | `danger` toast (`role="alert"`, stays until dismissed) with the server message |
| Refusal text mandated by the desktop (for example `Seleccione un registro de la tabla`, title `Aviso`; `Seleccione Fila`, title `Perfiles`; title `Mensaje`) | the modal notice of its spec, unchanged |
| Destructive decision | `danger` confirm (jona-ui-feedback R-FBK-1) with the record summary |
| Unavailable feature | menu badge `Próximamente` plus an `info` toast (R-SHELL-2) |

### R-UX-2 Providers and placement
The app root MUST mount exactly one `ToastProvider` (position `top-right`, label `Notificaciones`) and one `ConfirmProvider`. Both sit inside the router and around every route, including `/login` and `/contexto`.
- Both are composed by the app `DialogStackProvider`, which is mounted at the root.
- A `DialogStackProvider` nested under another one MUST be a passthrough, so the shell mount and the test kits create no second provider.
- The confirm MUST take part in the app Esc stack: its pane renders through `renderPane` as `GuardedOptionPane` (jona-ui-feedback R-FBK-3), so Esc closes the topmost layer only.

### R-UX-3 Focus management
- Login step 1: on mount, focus MUST go to the first empty field.
- Step 2: on mount, focus MUST go to `Empresa`.
- Opening a workspace tab (new or reselected from the menu): focus MUST move to the page heading of its panel.
- Closing a tab: focus MUST move to the newly active tab. With no tab left, it moves to the empty-workspace heading.
- Register (and any data-entry dialog or drawer) open: focus MUST go to the first editable field. In DETAIL it goes to the close button.
- Register close after a successful execute: focus MUST go to the reselected grid row. When the row is gone (DELETE), it goes to the row now at that position, else to the grid.
- Any dialog, drawer, confirm or menu closed without a result: focus MUST return to its invoker.

### R-UX-4 Keyboard map and collisions
This MUST be the single app key map:

| Keys | Action | Defined in |
|---|---|---|
| Alt+A M E N Z B R X I F S | toolbar actions | R-CRUD-10 (unchanged) |
| Enter / Esc | submit / close the topmost layer | R-CRUD-8, R-SHELL-6 |
| ↑ ↓ Home End PgUp PgDn, Enter | move the row selection / open the row | R-CRUD-8, jona-ui-data R-DAT-3 |
| Ctrl+K, and `/` outside editable fields | focus the menu filter | R-SHELL-6 |
| Alt+1 … Alt+9 | select workspace tab n | R-SHELL-6 |
| Alt+W | request closing the active tab | R-SHELL-6 |
| F2, Alt+↓ in a lookup code box | open the picker | R-CRUD-19 |
| Shift+? outside editable fields | open the shortcut sheet | R-SHELL-6 |

App shortcuts MUST:
- match the physical key (`KeyW`, `Digit1`, `Slash`);
- never use Ctrl+Alt combinations (Windows reports AltGr that way);
- prevent the browser default only when they are handled;
- not fire while a modal dialog, drawer or confirm is open, except Esc and the keys that layer handles itself.

A new shortcut MUST NOT reuse a key of this table.

### R-UX-5 Theme choice
The user menu MUST offer a `Tema` radio group: `Sistema`, `Claro`, `Oscuro` **[ASSUMPTION]** (labels). The values are `system`, `light` and `dark`. The default is `Sistema`, which follows `prefers-color-scheme`. The choice MUST be persisted per browser in `localStorage` (not per user and not in the session) and restored on the next load, including on `/login`.
- An inline init script, injected into `index.html` from the lib's `themeInitScript()`, MUST apply the stored mode before first paint.
- The root reports the choice in `data-theme-mode` and the resolved mode in `data-theme` (jona-ui-foundations R-FND-4).
- Every screen MUST render with the semantic tokens of the resolved mode. The app imports `jona-ui/base.css` (R-FND-5).

### R-UX-6 CSS contract
Every class token in the non-test app source (`className` values and class constants of `src/**/*.tsx`) MUST exist in the shipped `jona-ui` CSS. A vitest contract test MUST fail and list each missing token. In addition, the non-test app source MUST NOT contain:
- color literals (`#hex`, `rgb(`, `hsl(`);
- inline `style` props, except entries of an explicit allowlist in the contract test, each justified by a computed runtime value.

The interim stopgap `src/styles/app.css` MUST be deleted by the end of the change. Its `appStyles.spec.ts` evolves into the contract test (`src/styles/cssContract.spec.ts`). Before the deletion, the contract test MAY count the stopgap classes as present. Height caps, grid columns and density come from `jona-ui` props (for example `maxHeight`, `JInputGroup preset`), never from app classes.

### R-UX-7 Stable accessible names
Restyling MUST NOT rename these names and roles:

| Kind | Kept |
|---|---|
| Names | `Filtro`, `Cerrar pestaña {title}`, `Cerrar sesión`, `Reintentar`, `Refrescar` |
| Texts | `No hay registros.`, `Cargando...` (as `role="status"` text), `Abra una opción del menú para comenzar.` |
| Roles | the `tabpanel` named by its form title, `role="toolbar"`, `role="banner"` |
| Dialogs | the names of existing dialogs |

The only renames are the ones this change's deltas name:
- the register action and confirm labels (R-CRUD-20);
- the period fields, from the placeholders `Fecha inicio` / `Fecha fin` to the labels `Desde` / `Hasta` (R-AUTH-5);
- menu nodes, from `button` to `treeitem` (R-SHELL-2).

### R-UX-8 Desktop texts unchanged
Every desktop-mandated label, title and message in the softcommerce-* specs MUST render verbatim, with the same spelling. Restyling MUST NOT change it.

### R-UX-9 Product identity
The app MUST be named `SoftCommerce` in the topbar and the auth layout. It MUST use the `jona-ui` palette with no custom brand palette and no logo.

## Scenarios

**S-UX-1 success is a toast** — Given a successful INSERT, UPDATE, DELETE, Seguridad Perfil save, Socio Acciones save or Autorizar Series action, Then a `success` toast shows and no `alertdialog` or notice modal opens.

**S-UX-2 refusal stays modal** — Given `Autorizar Series` pressed with no row, Then the modal `Aviso` with `Seleccione un registro de la tabla` shows and no toast shows.

**S-UX-3 background error toast** — Given an immediate `Desactivar` that answers 409, Then a `danger` toast (`role="alert"`) with the server message shows.

**S-UX-4 one provider each** — Given the app rendered at `/login` and at `/`, Then one toast container and one confirm provider exist, and a confirm opened over a register closes alone with one Esc.

**S-UX-5 login focus** — Given `/login` with no tenant chosen, Then `Base de datos` has focus. Given the tenant preselected, Then `Usuario` has focus.

**S-UX-6 contexto focus** — Given step 2 mounted, Then `Empresa` has focus.

**S-UX-7 tab open focus** — Given leaf `Colores` activated, When its tab opens, Then the heading `Colores` of its panel has focus. Reselecting it from the menu does the same.

**S-UX-8 tab close focus** — Given tabs A and B with B active, When B is closed, Then tab A has focus. When A is closed too, Then the empty-workspace heading has focus.

**S-UX-9 register focus** — Given Add, Then the first editable field has focus. Given DETAIL, Then the close button has focus.

**S-UX-10 focus after save** — Given UPDATE of row `0002` saved, When the dialog closes, Then row `0002` of the grid has focus and is selected.

**S-UX-11 focus after delete** — Given DELETE of the second of three rows, When it completes, Then the row now second has focus.

**S-UX-12 focus after cancel** — Given the register opened from the `Modificar` button, When it is cancelled, Then `Modificar` has focus.

**S-UX-13 no shortcut in a dialog** — Given a register open, When Alt+W, Alt+2 or Ctrl+K is pressed, Then no tab closes or changes, and the filter does not take focus.

**S-UX-14 slash inside a field** — Given focus in `Filtro`, When `/` is typed, Then it is inserted as text and the menu filter does not take focus.

**S-UX-15 no Ctrl+Alt** — Given Ctrl+Alt+W or Ctrl+Alt+1, Then nothing fires and the default is not prevented.

**S-UX-16 unique keys** — Given the key-map data, Then no key combination appears twice and none uses Ctrl+Alt.

**S-UX-17 theme default** — Given no stored theme and the OS in dark mode, Then the root reports `dark` and `Sistema` is checked in `Tema`.

**S-UX-18 theme persisted** — Given `Claro` chosen, When the app reloads at `/login`, Then the root reports `light`. When another user logs in on the same browser, Then `Claro` still applies.

**S-UX-19 CSS contract** — Given the app source and the shipped CSS, When the contract test runs, Then it reports 0 missing classes. Given a class `foo-bar` added in a view, Then it fails and names `foo-bar`.

**S-UX-20 no literals** — Given the non-test app source, Then no color literal exists, and every inline `style` is on the allowlist.

**S-UX-21 stopgap deleted** — Given the final tree, Then `src/styles/app.css` and `appStyles.spec.ts` do not exist (the latter evolved into `cssContract.spec.ts`), and S-UX-19 passes.

**S-UX-22 stable names** — Given the shell with a list tab open, Then `Filtro`, `Cerrar pestaña {title}`, the `banner`, the `toolbar` and the `tabpanel` named by the title are found by the same queries as in W3.

**S-UX-23 desktop text verbatim** — Given the W3 message suites (`R-MST-*`, `R-PRM-*`, `R-MD-4`), When run after the restyle, Then every message assertion passes unchanged.

**S-UX-24 product name** — Given `/login` and the shell, Then `SoftCommerce` is visible in the auth card and in the `banner`.
