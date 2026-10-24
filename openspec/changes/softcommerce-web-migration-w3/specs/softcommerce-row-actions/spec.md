# Spec: softcommerce-row-actions

NEW capability (G12). A declarative registry of custom row and grid actions (activar / desactivar / estado) with their enablement predicates and their mapping to the 13 permission flags. The mock exposes the immediate actions (softcommerce-mock-api R-MOCK-22).
Marker legend: **[ASSUMPTION]**, **[DEVIATION]** and **[INFERRED]** as in softcommerce-lookup-dialog.

## Requirements

### R-ACT-1 Action registry
An action MUST be declared as data: `id`, `label` (the desktop label: `Activar`, `Desactivar`, `Autorizar Series`), `placement` (`list-toolbar`, `register`, or a child grid toolbar), `flag` (one of the 13 permission flags, R-ACT-2), `enabledWhen` (a predicate over the mode, the selection and the record or row state, evaluated by the shared predicate evaluator of R-CRUD-13), `dialog` (an optional child-style dialog collecting the action input, R-MD-3), `kind` (`deferred` or `immediate`, R-ACT-4) and `confirm` (an optional confirmation text). The templates MUST render actions from this data only; a catalog needs no template code to add an action.

### R-ACT-2 Permission mapping
An action MUST be enabled only when its `flag` is true for the form (the form's permissions, R-CRUD-2) AND its `enabledWhen` holds. **[ASSUMPTION]** Activar, Desactivar and Autorizar Series map to `modify` (they change the record; the desktop gated them only by the register mode). A denied or not-enabled action MUST send no request and open no dialog, by click and by keyboard, as in S-CRUD-4. Unlike toolbar actions of R-CRUD-10, row actions have no Alt shortcut.

### R-ACT-3 Activation actions (state machine)
For an entity with an activation history (R-ANX-1) the two actions are:
- `Activar`: enabled only in UPDATE, and only when NO activation row is active; its dialog asks `Fecha Inicio` (default today) and `Motivo de Activacion`.
- `Desactivar`: enabled only in UPDATE, when a row is selected; its dialog asks `Fecha Fin` (default today) and `Motivo de Desactivacion`.
Both are `deferred`. The guard messages, the shared dialog and the effects are specified once in R-ANX-3..R-ANX-5. In INSERT, CLONE, DETAIL and DELETE both actions MUST be disabled (the desktop disables them in INSERT; in CLONE the copy starts with its own initial activation, R-MD-9; **[ASSUMPTION]** for DETAIL / DELETE the dialog is read-only).

### R-ACT-4 Deferred and immediate actions
A `deferred` action MUST only create or change a pending child row of the open register (R-MD-4); its effect is persisted by the parent submit, atomically (R-MD-5). An `immediate` action MUST call its action endpoint at once (R-MOCK-22), then refresh the host grid from the server and show the server message. Autorizar Series (Activar, Desactivar) MUST be `immediate` (desktop: `FormUA` / `FormPanelUA` save on `Guardar`); the Anexo activation actions and the Socio acciones actions MUST be `deferred`.

### R-ACT-5 Estado is derived
Where a master has an `estado` flag driven by an action (Trabajador, Banco, Cliente, Proveedor, Transportista, Vendedor, Chofer), the register MUST show it read-only (the `Estado` / `Activo` checkbox) and it MUST follow the action: a new active activation checks it, a deactivation unchecks it. A client or API body MUST NOT set it directly.

### R-ACT-6 Action errors
An `immediate` action whose server answer is a 409 or 422 MUST keep its dialog open with the server message and leave the grid unchanged; a 404 on a vanished row MUST refresh the grid and show the message.

## Scenarios

**S-ACT-1 registry-driven toolbar** — Given a child grid config declaring `Activar` and `Desactivar` with `flag: modify`, Then both buttons render with those labels and no catalog-specific template code exists.

**S-ACT-2 permission gates actions** — Given `modify=false` on the form, Then `Activar` and `Desactivar` are disabled and clicking sends nothing; Given `modify=true` and no selected row, Then `Desactivar` is disabled while `Activar` follows its predicate.

**S-ACT-3 non-UPDATE modes disabled** — Given INSERT, CLONE, DETAIL or DELETE, Then both activation actions are disabled.

**S-ACT-4 Activar only without an active row** — Given an UPDATE whose last activation is active, Then `Activar` is disabled; Given the last is deactivated, Then it is enabled.

**S-ACT-5 deferred action persists on submit** — Given `Activar` confirmed in UPDATE, When the parent is cancelled, Then nothing was sent and the row is discarded; When the parent is submitted, Then the activation is persisted with the parent.

**S-ACT-6 immediate action refreshes** — Given the Autorizar Series grid and `Desactivar` on an active row, Then the action endpoint is called once, the grid reloads showing the row deactivated, and the server message shows.

**S-ACT-7 estado follows the action** — Given a Trabajador whose latest activation is deactivated, Then `Estado` shows unchecked and read-only; after a pending `Activar` it shows checked.

**S-ACT-8 estado is not writable** — Given a direct `PUT` carrying `estado`, Then the stored estado is derived from the activation history and the body value is ignored.

**S-ACT-9 immediate action error** — Given `POST .../actions/...` answers 409 with a message, Then the dialog stays open showing it and the grid is unchanged.
