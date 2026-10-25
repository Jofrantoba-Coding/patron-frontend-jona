# Delta for softcommerce-masters

Socio acciones now renders inline in its workspace tab instead of in a modal (owner decision of 2026-10-24). Its save message shows as a toast. The inert socio `Desactivar` is disabled and shows its reason. The other masters take the generic UX of softcommerce-crud-templates and softcommerce-master-detail with no rule or message change. Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-MST-1..18, S-MST-1..37).

## MODIFIED Requirements

### R-MST-16 Socio acciones
`socio-acciones` (formId `miAccionSocio`) MUST be one screen (no list) rendered **inline in its workspace tab** **[DEVIATION]**, with no modal and no launcher button (owner decision of 2026-10-24).
- **Layout**: a `JPageHeader` titled `Acciones de Socio` **[ASSUMPTION]**, the inline tabs `Socios` and `Precio` (`JTabs keepMounted`), the `Activar` / `Desactivar` actions of each tab, and the buttons `Aceptar` and `Cancelar` at the end of the screen. These are the desktop labels, not the per-mode labels of R-CRUD-20. The dialogs `Activar Socio`, `Activar Precio` and `Desactivar Precio` stay dialogs (with `useGuardedClose`). The confirm `Desea Desactivar Precio?` is a `danger` confirm with the decline `No`.
- **Actions**: the actions are `deferred` (R-ACT-4): nothing is persisted before `Aceptar`.
- **Order**: it MUST be last in the Wave 3 order.
- **Lifecycle**: the screen loads on mount. Pending rows report the tab dirty (R-SHELL-4). `Aceptar` saves (below), shows the server message as a `success` toast, and reloads the screen from the server, clearing the pending rows. `Cancelar` discards the pending rows and reloads the screen. It asks the R-SHELL-4 discard confirm first when there are pending rows **[ASSUMPTION]**.
- **Tables**: both are the desktop ones (`AccionSocioTableModel`, `AccionPrecioTableModel`), shown as `JDataGrid`s with keyboard selection:
  - Socios: `ESTADO, ID, NUM_DOC, SOCIO, CANTIDAD, PRECIO, F_INICIO, F_FIN`;
  - Precio: `ESTADO, ID, PRECIO, F_INICIO, F_FIN`.
  The estado cell is the text `Activo` / `Inactivo` [INFERRED]; the desktop draws an icon.
- **`Activar Socio` dialog** (`FormAccionSocioAgregar`): filters `Código`, `DNI/RUC`, `R. Social` (contains, all together), `Cantidad` (decimal), `Fecha Inicio` (default today), and the buttons `Agregar`, `Refrescar`, `Cancelar`. `Agregar` checks, in this order: a blank cantidad (`Ingrese Cantidad`), a selected socio that is already active (`Socio ya esta activado`), then the selection (`Seleccione un registro de la tabla`).
- **Socio `Desactivar`**: it does nothing on the desktop (the handler is empty, `FormAccionSocio.java:351-352`, and the `Desactivar Socio` mode of the dialog is never opened). The web MUST render it disabled **[DEVIATION]**, with the accessible description and tooltip `No disponible` **[ASSUMPTION: the reason text is pending owner confirmation]**.
- **Messages**: refusals keep the modal notice with the title `Mensaje` (the Swing default), except the Precio notices (title `Precio`).
- **Row ids**: a newly saved row id is assigned by the server. A row added on screen shows an empty ID until `Aceptar`.

Tabs:
- **Precio**: a grid of price rows (estado, fecha inicio, fecha fin, precio **[INFERRED]**).
  - `Activar` is refused with `No se Puede Agregar mas de un Precio` when a price is active. Its dialog `Activar Precio` asks `Precio`* (decimal, `Ingrese Precio`) and `Fecha Inicio` (default today).
  - A new price MUST be applied to every ACTIVE socio row of the `Socios` tab.
  - `Desactivar` requires a selected row (`Seleccionar Fila`, title `Precio`) and refuses a deactivated one (`Precio Seleccionado ya esta desactivado`). It then confirms `Desea Desactivar Precio?` as a `danger` confirm and opens `Desactivar Precio`, which asks only `Fecha Fin` (default today) **[DEVIATION]** (the desktop also demands `Precio` there).
  - **[DEVIATION]** A fecha fin that is not after the price's fecha inicio is refused with `Fecha es menor a fecha inicial` (the desktop showed it without blocking).
- **Socios**: a grid of socio rows (estado, socio, fecha inicio, fecha fin, precio, cantidad **[INFERRED]**).
  - `Activar` opens the dialog `Activar Socio` over the active `socios`, with the filters `Código` (digits, max 10), `DNI/RUC` (digits, max 11) and `R. Social` (U, max 100) (R-LKP-2), `Cantidad`* (decimal, `Ingrese Cantidad`), `Fecha Inicio` (default today) and the buttons `Aceptar` / `Refrescar` / `Cancelar`.
  - A confirm without a selected socio shows `Seleccione un registro de la tabla`. A socio already active shows `Socio ya esta activado`.
  - A new socio row takes the current active price (`0` with none).
  - The socio deactivation is not reachable (above).
- **`Aceptar`**: it MUST refuse with `Ingrese Precio` when there is no active price. Otherwise it saves precios and socios as one operation and shows the server message as a toast. The server MUST answer the same checks (422).

(Previously: the screen opened a modal on mount, and after `Aceptar` or `Cancelar` the closed screen kept one button `Acciones de Socio` that reopened it. The server message was a modal. The socio `Desactivar` was an enabled button that did nothing, and the Precio confirm used the `info` variant.)

## MODIFIED Scenarios

**S-MST-35 Socio acciones save** — Given no active price, When `Aceptar` is pressed, Then `Ingrese Precio` shows and nothing is sent. Given a price and socios, Then one atomic save runs, the server message shows as a `success` toast, the screen reloads with the saved rows (their ids assigned), and the tab is no longer dirty. `Cancelar` persists nothing and restores the last saved rows.

## ADDED Scenarios

**S-MST-38 inline framing** — Given the leaf `miAccionSocio` opened, Then its `tabpanel` directly holds the `Socios` and `Precio` tabs, `Aceptar` and `Cancelar`. No `dialog` named `Acciones de Socio` opens, and no launcher button exists.

**S-MST-39 inert Desactivar explained** — Given the `Socios` tab with a row selected, Then the socio `Desactivar` is disabled with the description `No disponible`, and activating it does nothing.

**S-MST-40 pending rows guard the tab** — Given a pending socio row, When the tab is closed, Then the R-SHELL-4 confirm shows (S-SHELL-21).

## Test churn (assertions that change)

- `UiSocioAcciones.spec.tsx:29,221,236` (`queryTitled('Acciones de Socio')` as a dialog, and the reopen button) query the inline screen instead.
- The save-message assertions read the toast.
- Every other S-MST scenario and R-MST-18 exception keeps its text. The masters' registers follow the softcommerce-crud-templates churn list (R-CRUD-20 labels).
