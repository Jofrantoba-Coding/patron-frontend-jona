# Delta for softcommerce-shell-workspace

This delta gives the shell its product chrome: `JAppShell` with a topbar, an ARIA tree menu with a filter and Recientes, workspace tabs with dirty guards, and the extended keyboard map. Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**. Numbering continues the promoted spec (R-SHELL-1..6, S-SHELL-1..16). Cross-screen rules: softcommerce-ux-conventions (R-UX-*).

## MODIFIED Requirements

### R-SHELL-2 Menu behavior
The menu MUST be an ARIA tree (`JTreeNav`, jona-ui-app-chrome R-CHR-2), named `Menú principal`, with its keyboard. Submenu nodes MUST expand and collapse, and leaf nodes MUST open their form.
- **Filter**: a search box above the tree MUST filter the leaves by `descripcion` (R-CHR-3). Its name is `Buscar opción` **[ASSUMPTION]**.
- **Recientes**: a `Recientes` group above the tree MUST list the last 5 forms opened in this session, most recent first. It lists only forms that are registered and visible in the menu, and is kept in `sessionStorage` per user. Activating an entry opens the form like its leaf.
- **Active leaf**: the leaf of the active tab MUST be marked current.
- **Unregistered leaves**: a leaf whose `nombre` has no registered form MUST show the badge `Próximamente` and be `aria-disabled`. Activating it MUST open no tab and MUST show an `info` toast with the leaf `descripcion` as title and the text `Esta opción aún no está disponible.` **[DEVIATION]** (the W1 notice was a modal; owner decision of 2026-10-24).
- **States**: the menu MUST show a loading state (`Cargando...` as status text) and an error state with `Reintentar`.

(Previously: a nested list of buttons with no ARIA tree keyboard, no filter, no Recientes, no active marker, and a modal notice for unregistered leaves.)

### R-SHELL-4 Tab workspace
Each form MUST occupy at most one tab. Opening an already-open form MUST select its existing tab without reloading, resetting its state or creating a duplicate. Tabs use `JWorkspaceTabs` (R-CHR-5), so the close button `Cerrar pestaña {title}` sits outside the `tablist`. Closing the active tab selects a neighbor, and closing the last tab shows the empty workspace. Focus follows R-UX-3.

Dirty guard:
- **Reporting**: each form MUST report whether it holds unsaved changes. These are an open register whose form differs from its baseline, pending child rows (R-MD-1), unsaved Seguridad Perfil toggles and pending Socio Acciones rows. A dirty tab shows the dirty marker.
- **Closing a tab**: closing a clean tab (by button, middle-click or Alt+W) MUST close it at once. Closing a dirty tab MUST first ask a `danger` confirm with the text `{title} tiene cambios sin guardar. ¿Cerrar y descartar?` and the buttons `Seguir editando` and `Descartar y cerrar`. Only `Descartar y cerrar` closes it.
- **Logout**: logout with no dirty tab MUST proceed at once. With one or more dirty tabs it MUST ask a `danger` confirm listing their titles, with the buttons `Seguir editando` and `Descartar y salir` **[ASSUMPTION]**.
- **Browser unload**: unload MUST be guarded (`beforeunload` prevented) only while some tab is dirty.

(Previously: closing a tab or logging out never checked for unsaved changes, and the close button sat inside the `tablist`.)

### R-SHELL-5 Session header
The shell MUST render inside `JAppShell` (R-CHR-1). Its topbar is the `banner` landmark and holds:
- the product name `SoftCommerce`;
- a context chip (R-CHR-7) with empresa, punto de venta and the fixed period as `dd/MM/yyyy–dd/MM/yyyy`, whose description also names the database (tenant);
- a user menu named by the user name, holding a header (name and user), `Base de datos: {tenant}`, the `Tema` group (R-UX-5) and `Cerrar sesión` (danger tone, R-SHELL-4 guard).

The period MUST have no edit control (R-AUTH-6). The sidebar is inline from 1024 px, collapsible to a rail, and a drawer below 1024 px, and the `Abrir menú` button is hidden from 1024 px. The empty workspace MUST be an empty state with the text `Abra una opción del menú para comenzar.` and up to 6 Recientes shortcuts.

(Previously: a `<header>` holding a key/value list of user, empresa, punto de venta and period, plus a visible `Cerrar sesión` button, with no product name and no user menu.)

### R-SHELL-6 Keyboard **[ASSUMPTION]**
Esc MUST close the topmost open dialog. The shell MUST also handle these keys of the R-UX-4 map, obeying its collision rules:
- Ctrl+K, and `/` outside editable fields, move focus to the menu filter (opening the drawer below 1024 px).
- Alt+1 … Alt+9 select the n-th workspace tab, and do nothing when it does not exist.
- Alt+W requests closing the active tab through the R-SHELL-4 guard.
- Shift+? outside editable fields opens the shortcut sheet `Atajos de teclado` (R-CHR-8). It lists the R-CRUD-10 toolbar shortcuts, the grid keys and these shell keys.

(Previously: Esc only.)

## MODIFIED Scenarios

**S-SHELL-5 unknown leaf** — Given a leaf with no registered form, Then it shows the badge `Próximamente` and is `aria-disabled`. When it is activated, Then an `info` toast titled by its `descripcion` shows `Esta opción aún no está disponible.`, no tab opens, and no modal opens.

**S-SHELL-15 header** — Given an active session, Then the `banner` shows `SoftCommerce`, the context chip shows empresa, punto de venta and the period, and the user menu button is named by the user. `Cerrar sesión` is a `menuitem` inside that menu, not a topbar button.

## ADDED Scenarios

**S-SHELL-17 tree keyboard** — Given the menu tree with `Maestros` collapsed and focused, When → expands it, ↓ moves to `Generales`, → expands it, ↓ moves to its first leaf and Enter is pressed, Then that leaf's tab opens and is selected (R-CHR-2 keys).

**S-SHELL-18 menu filter** — Given 49 leaves under `Generales`, When `cli` is typed in `Buscar opción`, Then `Cliente` shows with its ancestors expanded and `Marca` is hidden. Clearing the filter restores the tree.

**S-SHELL-19 Recientes** — Given `Colores`, `Marcas` and `Colores` opened in that order, Then `Recientes` lists `Colores`, `Marcas`. After logout and a login as another user, Then `Recientes` is empty.

**S-SHELL-20 active leaf** — Given tabs `Colores` and `Marcas` with `Marcas` active, Then the `Marcas` treeitem has `aria-current="page"` and `Colores` does not.

**S-SHELL-21 dirty tab close** — Given `Colores` with an open dirty register, When `Cerrar pestaña Colores` is clicked, Then the confirm `Colores tiene cambios sin guardar. ¿Cerrar y descartar?` shows. `Seguir editando` keeps the tab and the register, and `Descartar y cerrar` closes the tab.

**S-SHELL-22 clean tab close** — Given a clean tab, When it is closed by button, middle-click or Alt+W, Then it closes with no confirm (S-SHELL-12, S-SHELL-13 unchanged).

**S-SHELL-23 logout guard** — Given tabs `Colores` (dirty) and `Marcas` (clean), When `Cerrar sesión` is chosen, Then a confirm lists `Colores` only. `Seguir editando` keeps the session, and `Descartar y salir` logs out. With no dirty tab, logout runs at once (S-AUTH-18).

**S-SHELL-24 unload guard** — Given a dirty tab, When `beforeunload` fires, Then the event is prevented. Given no dirty tab, Then it is not prevented.

**S-SHELL-25 dirty marker** — Given an edit made in the Seguridad Perfil tree and not saved, Then that tab has the description `Cambios sin guardar`. After `Guardar` succeeds, Then the marker is gone.

**S-SHELL-26 topbar layout** — Given the shell at 1024 px or more (CSS contract), Then `Abrir menú` is hidden and the rail toggle is offered. Below 1024 px, `Abrir menú` opens the menu drawer.

**S-SHELL-27 empty workspace** — Given no open tab and two Recientes, Then `Abra una opción del menú para comenzar.` shows with two shortcut buttons, and activating one opens its form.

**S-SHELL-28 shell keys** — Given tabs A, B, C with A active and focus outside editable fields, When Alt+3 is pressed, Then C is selected. Alt+9 changes nothing. Alt+W requests closing C. Ctrl+K focuses `Buscar opción`. Shift+? opens `Atajos de teclado`.

**S-SHELL-29 period not editable** — Given the topbar, Then the context chip has no button or input, and no control in the shell changes the period (S-AUTH-17).

## Test churn (assertions that change)

- `src/views/uishell/ShellHeader.spec.tsx:63` (exactly one button `['Cerrar sesión']`) and `:71`: the logout becomes a `menuitem` inside the user menu.
- `src/App.spec.tsx:54-56,65`: banner text and logout via the menu. `:57`: `button 'Maestros'` becomes `treeitem 'Maestros'`.
- `src/shared/ui/MenuTree/MenuTree.spec.tsx`: tree roles.
- `src/views/uishell/UiShell.spec.tsx`: the unknown-leaf notice becomes a toast, and the close-button assertions at `:93,103,113` keep the name `Cerrar pestaña {title}`, which now sits outside the `tablist`.
- `src/domain/workspace.spec.ts`: unchanged. The reducer stays pure: the shell Impl asks the dirty guard, then dispatches the existing `close`.
- S-SHELL-1..4, S-SHELL-6..14 and S-SHELL-16 keep their text.
