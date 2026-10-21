# Spec: softcommerce-shell-workspace (ADDED)

## Requirements

### R-SHELL-1 Menu from API
The shell MUST render a hierarchical menu from `GET /menu` (items with `id_menu`, `id_menu_padre`, `menu_item`, `descripcion`, `nombre`; `menu_item = 'N'` means submenu). **[ASSUMPTION]** The tree is inferred seed data and must not be hardcoded in UI code.

### R-SHELL-2 Menu behavior
Submenu nodes MUST expand/collapse; leaf nodes MUST open their form. Leaves whose `nombre` has no registered form MUST show a "not available yet" notice instead of opening a tab. The menu MUST show loading and error states.

### R-SHELL-3 Per-form permissions
When a form opens, the shell MUST load `GET /forms/{formId}/permissions` returning 13 flags: add, modify, eliminate, nullify, clone, details, search, report, export, print, printFast, close, refresh. Flags MUST be exposed to the form's toolbar.

### R-SHELL-4 Tab workspace
Each form MUST occupy at most one tab. Opening an already-open form MUST select its existing tab without reloading, resetting its state or creating a duplicate. Tabs MUST be closable; closing the active tab selects a neighbor; closing the last tab shows an empty workspace.

### R-SHELL-5 Session header
The shell MUST show user, empresa, punto de venta and fixed period, plus a logout action.

### R-SHELL-6 Keyboard **[ASSUMPTION]**
Esc MUST close the topmost open dialog.

## Scenarios

**S-SHELL-1 menu renders** — Given `/menu` returns a 2-level tree, Then submenus render with their children nested by `id_menu_padre`.

**S-SHELL-2 menu from seed swap** — Given a different menu payload, Then the rendered menu equals it (no hardcoded entries).

**S-SHELL-3 submenu toggle** — Given a collapsed submenu, When clicked, Then its children show; clicked again, they hide.

**S-SHELL-4 leaf opens tab** — Given leaf `mi_localidad`, When clicked, Then a tab titled by its `descripcion` opens and is selected.

**S-SHELL-5 unknown leaf** — Given a leaf with no registered form, When clicked, Then a "not available yet" notice shows and no tab opens.

**S-SHELL-6 menu error** — Given `/menu` fails, Then an error state with retry shows and the workspace stays usable.

**S-SHELL-7 permissions loaded** — Given a form opens, Then `/forms/{formId}/permissions` is requested once and the 13 flags are available to that form.

**S-SHELL-8 permission denied action** — Given `add=false`, Then the Add action is disabled or hidden and activating it (click or shortcut) does nothing; same for each flag set false.

**S-SHELL-9 permission fetch fails** — Given the permissions request fails, Then the form shows an error and all actions stay disabled (fail closed).

**S-SHELL-10 re-select open tab** — Given Localidad is open and the user switched to another tab with a filter typed in Localidad, When clicking `mi_localidad` again, Then Localidad's tab is selected, no second tab exists, permissions are not refetched, and the filter text is preserved.

**S-SHELL-11 two forms two tabs** — Given Localidad and another form open, Then there are two tabs, switching preserves each one's state.

**S-SHELL-12 close active tab** — Given three tabs with the middle active, When closing it, Then an adjacent tab becomes active.

**S-SHELL-13 close last tab** — Given one tab, When closed, Then the empty workspace message shows.

**S-SHELL-14 reopen after close** — Given a form tab was closed, When opened again, Then a fresh tab opens with permissions reloaded.

**S-SHELL-15 header** — Given an active session, Then the header shows user, empresa, punto de venta and period.

**S-SHELL-16 Esc closes dialog** — Given an open dialog in a tab, When pressing Esc, Then only that dialog closes and the tab remains.
