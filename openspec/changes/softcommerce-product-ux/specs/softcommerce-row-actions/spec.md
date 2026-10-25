# Delta for softcommerce-row-actions

Two changes. A destructive `immediate` action now asks for confirmation before it calls the server **[DEVIATION]**. Action successes show as toasts. Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-ACT-1..6, S-ACT-1..9). Cross-screen rules: softcommerce-ux-conventions (R-UX-1).

## MODIFIED Requirements

### R-ACT-4 Deferred and immediate actions
A `deferred` action MUST only create or change a pending child row of the open register (R-MD-4), through the client rule it names. It may also set values of the parent form, such as the derived `estado`. Its effect is persisted by the parent submit, atomically (R-MD-5).

An `immediate` action MUST call its action endpoint at once (R-MOCK-22), then refresh the host grid from the server and show the server message as a `success` toast. The message is never shown in a modal.

An `immediate` action that deactivates or removes (Autorizar Series `Desactivar`) MUST first ask a `danger` confirm (`useConfirm`):
- title: the action label;
- description: `Se desactivará el registro seleccionado.` **[ASSUMPTION]**;
- `details`: the row summary;
- buttons: confirm with the action label, decline `No` (the decline label of every app data confirm, R-CRUD-20).

A declined confirm MUST send nothing **[DEVIATION]**: the desktop `FormPanelUA` deactivated without asking (owner decision of 2026-10-24).

Autorizar Series (`Activar`, `Desactivar`) MUST be `immediate`, as the desktop `FormUA` / `FormPanelUA` save on `Guardar`. The Anexo activation actions and the Socio acciones actions MUST be `deferred`.

(Previously: immediate actions showed the server message in a modal `Mensaje`, and `Desactivar` ran with no confirmation.)

### R-ACT-6 Action errors
An `immediate` action whose server answer is a 409 or 422 MUST:
- keep its dialog open with the server message and leave the grid unchanged;
- for an action with no dialog (`Desactivar`), show the server message as a `danger` toast (`role="alert"`) and leave the grid unchanged.

A 404 on a vanished row MUST refresh the grid and show the message (inside the open dialog, else as a `danger` toast).

(Previously: an action with no dialog had no specified error channel.)

## MODIFIED Scenarios

**S-ACT-6 immediate action refreshes** — Given the Autorizar Series grid and `Desactivar` on an active row, Then a `danger` confirm with the row summary shows first. When it is confirmed, Then the action endpoint is called once, the grid reloads showing the row deactivated, and the server message shows as a `success` toast. When it is declined, Then no request is sent.

## ADDED Scenarios

**S-ACT-10 immediate error without dialog** — Given `Desactivar` confirmed and the server answering 409 with a message, Then a `danger` toast shows that message, the grid is unchanged, and no modal opens.

**S-ACT-11 deferred actions unchanged** — Given an Anexo `Desactivar` (deferred), Then no extra confirm is added beyond the ones its spec defines, and S-ACT-5 passes unchanged.

## Test churn (assertions that change)

- The Autorizar Series specs (`src/views/uiautorizarseries/*.spec.tsx`) confirm `Desactivar` first and read the server message from the toast instead of the `Mensaje` modal.
- S-ACT-1..5 and S-ACT-7..9 keep their text.
