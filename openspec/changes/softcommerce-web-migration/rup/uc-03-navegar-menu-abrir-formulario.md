# CU-03 Navegar menú y abrir formulario (menú, permisos, pestañas)

Diagrams: [robustez](diagrams/uc-03-robustez.drawio) · [colaboración](diagrams/uc-03-colaboracion.drawio) · [secuencia](diagrams/uc-03-secuencia.drawio). Model: [uc-model.md](uc-model.md). Source spec: `specs/softcommerce-shell-workspace/spec.md`.

## Brief description

With an active session, the operator browses the menu tree built from `GET /menu`, opens a form in a tab, and works in several tabs. Each tab loads its 13 permission flags once. Esc closes only the topmost dialog. Extension point **formulario abierto** is where CU-04 «extend»s this use case for `mi_localidad`.

## Actors

- **Primary:** Usuario (operador).
- **Secondary:** Servidor mock (API). Routes `GET /menu` and `GET /forms/{formId}/permissions`, with `X-Tenant-Id`.

## Participants (JONA)

`UiShellView` «view» → `useUiShellImpl` «impl» → `UiShell` «visual» (`MenuTree`, `JTabsList`/`JTabsTrigger`, `ShellHeader`). Pure domain: `buildMenuTree` (`menuTree.ts`), the `workspace` reducer, `permissions.ts`, `formRegistry`. `FormHost` (one per tab) has the Impl role: it loads permissions through `InterShellService`. `DialogStackProvider` holds the dialog id stack.

## Preconditions

1. A session exists (CU-02 finished). Otherwise `RequireSession` redirects to login (CU-01 A6).

## Postconditions

- **Success:** the selected form is open in exactly one tab, selected, with its 13 permission flags available to its toolbar.
- **Failure:** no tab opens (unknown leaf) or the tab opens with every action disabled (permissions failed).

## Basic flow

1. The system loads `menu()` and builds the tree with `buildMenuTree(flat)`, nesting items by `id_menu_padre` [S-SHELL-1]. Nothing is hardcoded: another payload renders as given [S-SHELL-2].
2. The header shows user, empresa, punto de venta and the period `dd/MM/yyyy – dd/MM/yyyy` [S-SHELL-15].
3. The operator expands a submenu (`menu_item = 'N'`); clicking it again collapses it [S-SHELL-3].
4. The operator clicks a leaf whose `nombre` is registered (for example `mi_localidad`).
5. The workspace reducer runs `open {formId, title}`. A new tab titled by `descripcion` opens and is selected [S-SHELL-4].
6. The tab's `FormHost` requests `GET /forms/{formId}/permissions` once and exposes the 13 flags (add, modify, eliminate, nullify, clone, details, search, report, export, print, printFast, close, refresh) to the form [S-SHELL-7].
7. **Extension point *formulario abierto*.** The form runs. For `mi_localidad`, CU-04 continues here.

## Alternative and exception flows

| ID | Trigger (step) | Flow | Scenarios |
|---|---|---|---|
| A1 | Leaf not in `formRegistry` (4) | A `JOptionPane` "not available yet" notice opens, registered in the dialog stack. No tab opens. | S-SHELL-5 |
| A2 | `/menu` fails (1) | An error state with retry shows; the workspace stays usable. | S-SHELL-6 |
| A3 | Permissions request fails (6) | The form shows an error and every action stays disabled (fail closed). | S-SHELL-9 |
| A4 | Form already open (5) | Its tab is selected. No second tab, no permission refetch, state (for example a typed filter) preserved. | S-SHELL-10 |
| A5 | Two forms open | Two tabs; switching keeps each tab's state (inactive panels stay mounted and `hidden`). | S-SHELL-11 |
| A6 | Close the active middle tab | An adjacent tab becomes active. | S-SHELL-12 |
| A7 | Close the last tab | The empty-workspace message shows. | S-SHELL-13 |
| A8 | Reopen a closed form | A fresh tab opens and permissions are requested again. | S-SHELL-14 |
| A9 | Esc with a dialog open | Only the topmost dialog closes; the tab remains. A tab never closes on Esc. | S-SHELL-16 |
| A10 | Logout from the header | Ends the session (CU-01 A7). | S-AUTH-18 (owned by CU-01) |

## Business rules

- **BR-03-1** The menu comes only from `GET /menu`; the tree is seed data and is not hardcoded in UI code [ASSUMPTION R-SHELL-1].
- **BR-03-2** One tab per form. Opening an open form re-selects it without reloading (R-SHELL-4).
- **BR-03-3** Permissions are fail-closed: any failure means all 13 flags are `false`. An unknown form gets all `false` from the server (design, Mock API Contract).
- **BR-03-4** The period shown in the header is read-only (BR-02-6, S-AUTH-17).

## Special requirements

- **Keyboard:** Esc closes the topmost dialog only [ASSUMPTION R-SHELL-6]. The `DialogStackProvider` listens on `window` in the capture phase, snapshots the top id, and each dialog's guarded `onClose` acts only when its id equals that snapshot. Clicks are not guarded (design: jona-ui dialogs each add their own Esc listener).
- **State preservation:** tab panels are rendered by the shell and stay mounted (`JTabsContent` is not used because it unmounts inactive panels).
- **Hard rule:** `UiShell` and `MenuTree` raise value-first callbacks (`onLeafClick(nombre, descripcion)`); only Impl-role units (`useUiShellImpl`, `FormHost`) reach `InterShellService`.

## Assumptions

- [ASSUMPTION] The menu tree is inferred seed data (R-SHELL-1, R-MOCK-5).
- [ASSUMPTION] Esc closes the topmost dialog (R-SHELL-6).
- Wave 1b ships a `demo_stub` form so S-SHELL-10/11 are testable before Localidad; W1c-4 swaps it for `mi_localidad` (design, Stub form).

## Scenarios traced

S-SHELL-1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16 (15). S-SHELL-8 (toolbar action denied) is traced to CU-04. Tasks: see [README.md](README.md#cu-03-navegar-menú-y-abrir-formulario-menú-permisos-pestañas).
