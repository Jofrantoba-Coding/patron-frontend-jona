# Delta for softcommerce-master-detail

This delta changes how master-detail registers look and respond: tabs show error indicators, child grids get the keyboard grid, the child entry opens in a drawer, child-row errors show inline, and the desktop confirms use the `danger` variant. Every desktop message keeps its text. Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-MD-1..10, S-MD-1..14). Cross-screen rules: softcommerce-ux-conventions (R-UX-*).

## MODIFIED Requirements

### R-MD-1 Tabbed register
A register config MAY declare `tabs`:
- In the UI config, `tabs` is the `layout`: extra tabs of parent fields after `General`. A field that no tab lists stays on `General`. **Applied in W3-16a:** an entry `layout` is validated at load. It must be a non-empty list of `{ title, fields }`, the title neither `General`, nor repeated, nor a child tab, and the fields a non-empty list of known fields of the entry, none the code and none placed twice. The Cliente declares none, because its condición de pago sits on `General`, as in the desktop.
- `tabs` also holds `children`: one tab per child, in declared order, titled by the child `tab`.

Tab rules:
- The first tab MUST be `General`, holding the parent fields. **Applied in W3-18:** an entry `generalTab` renames it; the Item uses `Datos de Item`.
- Each further tab MUST hold either fields of the parent or one child grid. Tab titles are the desktop titles (for example `Activación de Cliente`, `Direcciones`, `Padrones`, `Contactos`, `Cuentas`).
- All tabs MUST stay mounted while the dialog is open (`JTabs keepMounted`, jona-ui-app-chrome R-CHR-5), so entered data and pending child changes survive tab switches.

Validation and dirty state:
- A submit MUST validate the parent fields of every tab in the declared order. When the first failing field is on another tab, the UI MUST switch to that tab and focus the field.
- A tab that holds at least one field error or child-row error MUST show an error indicator, exposed as the tab's accessible description `Con errores` **[ASSUMPTION]**. Its name is unchanged. The indicator clears when the tab has no error left.
- The dirty state used by Esc (R-CRUD-8) and by the shell dirty guard (R-SHELL-4) MUST include pending child changes.

(Previously: no tab error indicator, mounting kept by a local workaround, and the dirty state used only by Esc.)

### R-MD-2 Child grid
A child grid MUST show the child rows of the selected parent:
- the child `columns`, with a leading state column (active / deactivated icon, as the desktop `CellRendererImageEstado`);
- single-row selection, as a `JDataGrid` (jona-ui-data R-DAT-2, R-DAT-3) with the visible selected row and the ↑ / ↓ / Home / End / PgUp / PgDn keys;
- a toolbar with the actions declared for it (`Agregar`, `Quitar`, and the row actions of softcommerce-row-actions).

Enter on a child row MUST NOT submit the parent register. The grid MUST show active AND deactivated rows (the desktop kept deactivated rows visible as history), but never logically deleted ones. In DETAIL and DELETE mode the grid is read-only (its toolbar actions disabled). In INSERT, UPDATE and CLONE it is editable.

(Previously: mouse-only selection with no visible highlight.)

### R-MD-3 Child dialog
`Agregar` MUST open the child entry as a modal end-side drawer (`JDrawer`, size `lg`) on top of the parent register. It has `role="dialog"` and keeps the child dialog title as its name. It is built from the child entry's fields, with the same field kinds, normalization, validation order and message style as a parent register (R-CRUD-6, R-CRUD-11, R-CRUD-21).
- A valid confirm MUST hand ONE new row to the grid as a pending row and close the drawer. An invalid confirm MUST keep it open with the per-field error.
- Esc MUST close only the drawer, and focus returns to `Agregar` (R-UX-3). The drawer's close goes through the app Esc stack (`useGuardedClose`).
- A child drawer MUST NOT submit, validate or close the parent.
- A child MAY declare `entry: 'inline'` instead of a drawer (the Transportista `Vehiculos`: the entry fields sit above the grid, and `Agregar` validates them in place). The same field rules and the same pending-row result apply, and the entry fields reset after a valid add.

(Previously: a second centered modal dialog over the master.)

### R-MD-4 Pending changes and quitar
Child additions and removals MUST stay pending in the parent form until the parent is submitted. Cancelling or closing the parent MUST discard them. `Quitar` MUST behave by the child's removal kind:
- A pending (unsaved) row MUST disappear from the grid.
- A persisted row of kind `deactivate` MUST turn deactivated (state icon, estado `D`) and stay in the grid. A row already deactivated MUST show its `ya esta desactivada/o` message and change nothing.
- A persisted row of kind `delete` (Vehiculos) MUST disappear, and is logically deleted when the parent is saved.

With no selected row, `Quitar` MUST show the grid message and change nothing. The message is declared as the child `quitar.none`: `Seleccione Fila.`, `Seleccionar Fila` or `Seleccione Vehiculo`, per grid. It shows even when the grid is empty (the desktop returned silently there **[DEVIATION]**). A `Quitar` is offered only for a child whose removal is not `none`. The messages are shown under the grid toolbar, not in a modal.

Where the desktop confirmed, the web MUST confirm with the same text: `Desea Quitar Direccion?`, `Desea Quitar Contacto?`, `Desea Quitar Cuenta?`, `Desea Quitar el Vehiculo?`, `Desea Desactivar Padron?`, `Desea Desactivar Cliente Sustituto?`. Each of these, and every row-action confirm that removes or deactivates, MUST be a `danger` confirm (`useConfirm`, jona-ui-feedback R-FBK-1) whose `details` show the row summary (its first two visible columns **[ASSUMPTION]**). The confirm button keeps its W3 label, and the decline button is `No`, which never collides with the register `Cancelar`.

(Previously: the same confirm texts in the `info` variant, with no row summary.)

### R-MD-5 All-or-nothing save
The register MUST restore the persisted child rows of a parent in UPDATE, DETAIL and DELETE: one request per gated-on child, in parallel with the parent record, active and deactivated rows alike. A child whose gate is closed has no tab and no request (R-REG-17).

A parent submit MUST present the parent and the pending child changes as one operation:
- On success the dialog closes, the success toast of R-CRUD-5 shows, and the list refreshes and reselects the parent.
- On any failure the dialog MUST stay open with the entered data and the pending child changes kept, and nothing MUST remain persisted (neither the parent nor part of the children).

The mock applies parent and children atomically through the composite write of R-MOCK-19 (`children: { <child>: [ { id?, op: 'I'|'A'|'E', ... } ] }`, changed rows only).

A 409 / 422 whose `details[].field` is `<child>[<n>].<field>` MUST mark that child row. `n` is the index in the array SENT for that child, which identifies the pending or persisted row that op belongs to. The UI MUST then switch to its tab (a parent field error keeps the tab of the first failing parent field). The message MUST show on the row itself (jona-ui-data R-DAT-4 `rowState(row).error`: next to the row, in its accessible description, row `aria-invalid`), and its tab shows the R-MD-1 indicator. The generic mapping of R-CRUD-7 applies to parent fields.

(Previously: row errors rendered as a list of alerts above the grid, as `"{firstColumn}: msg"`, with no tab indicator.)

## MODIFIED Scenarios

**S-MD-8 all-or-nothing** — Given a Cliente INSERT with a valid parent and a pending padron that the server rejects, When submitting, Then:
- the dialog stays open with the pending rows and the data kept;
- the `Padrones` tab is selected and described `Con errores`;
- the padron row is `aria-invalid` with the server message in its description;
- no alert list is shown above the grid;
- `GET /v1/clientes` does not contain the new parent.

## ADDED Scenarios

**S-MD-15 tab error indicator** — Given ClienteNuevo with a blank `Nacionalidad`, When submitting from `Direcciones`, Then `General` is selected (S-MD-1), and `getByRole('tab', { name: 'General' })` has the description `Con errores`. After the field is fixed and a new submit passes validation, Then the description is gone.

**S-MD-16 child drawer** — Given `Agregar` on `Contactos`, Then a `dialog` named by the child title opens as a drawer while the parent `dialog` stays open. Esc closes only the drawer, and `Agregar` has focus.

**S-MD-17 danger confirms** — Given a persisted direccion selected, When `Quitar` is pressed, Then a `danger` `alertdialog` with the text `Desea Quitar Direccion?` and the row summary shows, and its cancel button has focus.

**S-MD-18 child grid keys** — Given `Direcciones` with three rows and the grid focused, When ↓ is pressed twice, Then the third row is selected and visibly highlighted. Enter does not submit the parent.

**S-MD-19 inline entry unchanged** — Given the Transportista `Vehiculos` inline entry, Then it stays inline (no drawer), and S-MST-10 passes unchanged.

## Test churn (assertions that change)

- `UiMasterRegister*.spec.tsx` (9 files), `ChildGrid.spec.tsx`, `ChildGrid.actions.spec.tsx`, `registry.clientes.*.ui.spec.tsx` and `registry.{bancos,proveedores,trabajadores,transportistas,vendedores,items.almacenes}.ui.spec.tsx`:
  - row errors are read from the row description, not from an alert list;
  - the child entry is still found as `role="dialog"` by its title;
  - the confirm variant changes;
  - the register labels follow R-CRUD-20.
- Every desktop message assertion keeps its text.
- S-MD-1..7 and S-MD-9..14 keep their text.
