# Spec: softcommerce-master-detail

NEW capability (G11). Tabbed registers with child grids, child dialogs, child uniqueness and cascade, on top of the config-driven CRUD templates. The mock defines the nested contract (softcommerce-mock-api R-MOCK-19, R-MOCK-21); the catalog registry declares children (softcommerce-catalog-registry R-REG-14).
Marker legend: **[ASSUMPTION]**, **[DEVIATION]** and **[INFERRED]** as in softcommerce-lookup-dialog.

## Requirements

### R-MD-1 Tabbed register
A register config MAY declare `tabs`: in the UI config they are the `layout` (extra tabs of parent fields after `General`; a field no tab lists stays on `General`; **Applied in W3-16a:** an entry `layout` is validated at load: a non-empty list of `{ title, fields }`, the title neither `General`, repeated nor a child tab, the fields a non-empty list of known fields of the entry, none the code and none placed twice; the Cliente declares none because its condición de pago sits on `General`, as in the desktop) and `children` (one tab per child, in declared order, titled by the child `tab`). The first tab MUST be `General` (the parent fields; **Applied in W3-18:** an entry `generalTab` renames it, the Item `Datos de Item`). Each further tab MUST hold either fields of the parent or one child grid; tab titles are the desktop titles (for example `Activación de Cliente`, `Direcciones`, `Padrones`, `Contactos`, `Cuentas`). All tabs MUST stay mounted while the dialog is open so entered data and pending child changes survive tab switches. A submit MUST validate the parent fields of every tab in the declared order; when the first failing field is on another tab the UI MUST switch to that tab and focus the field. The dirty state used by Esc (R-CRUD-8) MUST include pending child changes.

### R-MD-2 Child grid
A child grid MUST show the child rows of the selected parent with the child `columns`, a leading state column (active / deactivated icon, as the desktop `CellRendererImageEstado`), single-row selection, and a toolbar with the actions declared for it (`Agregar`, `Quitar`, and the row actions of softcommerce-row-actions). The grid MUST show active AND deactivated rows (the desktop kept deactivated rows visible as history) but never logically deleted ones. In DETAIL and DELETE mode the grid is read-only (its toolbar actions disabled); in INSERT, UPDATE and CLONE it is editable.

### R-MD-3 Child dialog
`Agregar` MUST open a modal child dialog built from the child entry's fields with the same field kinds, normalization, validation order and message style as a parent register (R-CRUD-6, R-CRUD-11). A valid confirm MUST hand ONE new row to the grid as a pending row and close the child dialog; an invalid confirm MUST keep it open with the per-field error. A child dialog MUST NOT submit, validate or close the parent. A child MAY declare `entry: 'inline'` instead of a dialog (the Transportista `Vehiculos`: the entry fields sit above the grid and `Agregar` validates them in place); the same field rules and the same pending-row result apply, and the entry fields reset after a valid add.

### R-MD-4 Pending changes and quitar
Child additions and removals MUST stay pending in the parent form until the parent is submitted; cancelling or closing the parent MUST discard them. `Quitar` MUST behave by the child's removal kind:
- A pending (unsaved) row MUST disappear from the grid.
- A persisted row of kind `deactivate` MUST turn deactivated (state icon, estado `D`) and stay in the grid; a row already deactivated MUST show its `ya esta desactivada/o` message and change nothing.
- A persisted row of kind `delete` (Vehiculos) MUST disappear and be logically deleted when the parent is saved.
With no selected row `Quitar` MUST show the grid message (`Seleccione Fila.`, `Seleccionar Fila`, `Seleccione Vehiculo` per grid, declared as the child `quitar.none`) and change nothing; the message shows even when the grid is empty (the desktop returned silently there **[DEVIATION]**). A `Quitar` is offered only for a child whose removal is not `none`. The messages are shown under the grid toolbar, not in a modal. When the desktop confirmed (`Desea Quitar Direccion?`, `Desea Quitar Contacto?`, `Desea Quitar Cuenta?`, `Desea Quitar el Vehiculo?`, `Desea Desactivar Padron?`, `Desea Desactivar Cliente Sustituto?`) the web MUST confirm with the same text.

### R-MD-5 All-or-nothing save
The register MUST restore the persisted child rows of a parent in UPDATE, DETAIL and DELETE, one request per gated-on child, in parallel with the parent record, active and deactivated rows alike; a child whose gate is closed has no tab and no request (R-REG-17). A parent submit MUST present parent and pending child changes as one operation: on success the dialog closes and the list refreshes and reselects the parent; on any failure the dialog MUST stay open with the entered data and the pending child changes kept, and nothing MUST remain persisted (neither the parent nor part of the children). The mock applies parent and children atomically through the composite write of R-MOCK-19 (`children: { <child>: [ { id?, op: 'I'|'A'|'E', ... } ] }`, changed rows only). A 409 / 422 whose `details[].field` is `<child>[<n>].<field>` MUST mark that child row (`n` is the index in the array SENT for that child; the pending or persisted row that op belongs to) and tab (a parent field error keeps the tab of the first failing parent field), switch to its tab and show the message there; the generic mapping of R-CRUD-7 applies to parent fields.

### R-MD-6 Child uniqueness
A child entry MAY declare a uniqueness rule among its ACTIVE sibling rows (not deactivated, not deleted) with a literal message. A violation MUST be reported before saving when it can be decided from the grid (pending + persisted active rows) and by the server (409 `DUPLICATE`, R-MOCK-21) with the same message. Deactivated rows MUST NOT count.

### R-MD-7 Cascade on parent delete
Logically deleting a parent (DELETE mode, R-MOCK-7) MUST logically delete all its child rows, deactivated ones included; a deleted parent's children MUST NOT be reachable (nested routes answer 404). Parents whose desktop register has no delete (Cliente, Proveedor, Trabajador, Transportista, Banco) do not support DELETE (R-MST-1), so cascade applies to Vendedor, Usuario (its series authorizations, R-MST-7) and Item (almacenes). Socio acciones has no parent record (a singleton resource, R-MOCK-26), so no cascade applies to it.

### R-MD-8 Scope and stamping
Child rows MUST inherit the parent's tenant and, for `scope=empresa` parents, the session empresa; the stamped `id_usuario` of a child write MUST come from the session like the parent (R-MOCK-13). A child MUST NOT be writable under a parent of another tenant or empresa.

### R-MD-9 CLONE
CLONE of a parent that supports it (Transportista, Banco, Usuario; Vendedor has no CLONE, R-MST-1 / R-MST-9) MUST copy the parent fields but NOT child rows and NOT the activation history: the clone gets the initial activation of a new record, created by the server (R-ANX-2; until the anexo preset of W3-7 the mechanism is the child `initial` row of R-REG-14, which the server adds on create when the body inserts none). The desktop loads the original's child rows on CLONE, which would attach the original's persisted rows to the copy; that is not ported.

### R-MD-10 Child catalog of Wave 3
The children of Wave 3 MUST be exactly: Activaciones (shared Anexo, R-ANX-1) on Banco, Trabajador, Vendedor, Transportista, Cliente, Proveedor and Chofer; Vehiculos on Transportista; Direcciones, Contactos, Cuentas, Padrones, and the param-gated Sustitutos, Crédito and Crédito Temp on Cliente; Padrones on Proveedor; Almacenes on Item; Socios and Precios on Socio acciones; Series on Usuario (the shared store of R-PRM-7). Series is a child RESOURCE with NO register tab (`tab: false`; `toCatalogConfig` lists it under `resources`, not `children`): it is reached only from the Autorizar Series panel (R-PRM-6) through the nested routes and the `activate` / `deactivate` actions. Cliente and Proveedor tabs that the desktop gates by a company parameter MUST be shown only when that parameter is true (R-MST-12).

## Scenarios

**S-MD-1 tabs and first-error tab** — Given ClienteNuevo in INSERT with the `Nacionalidad` blank and the `Direcciones` tab active, When submitting, Then the UI switches to `General`, shows the nacionalidad error and focuses it.

**S-MD-2 tabs stay mounted** — Given a Cliente with one pending direccion, When the user switches `Direcciones` -> `General` -> `Direcciones`, Then the pending row and the entered General data are unchanged.

**S-MD-3 child grid shows history** — Given a persisted Cliente with one active and one deactivated direccion, Then both rows show with their state icon; a logically deleted vehiculo of a Transportista never shows.

**S-MD-4 child dialog adds a pending row** — Given `Agregar` on `Contactos`, When a valid contacto is confirmed, Then one pending row shows, the child dialog closes and no request was sent; When the parent is cancelled, Then the row is discarded.

**S-MD-5 child dialog does not touch parent** — Given an invalid child confirm, Then the child dialog stays open with its field error and the parent dialog is unchanged.

**S-MD-6 quitar by kind** — Given a pending direccion, When `Quitar` is pressed and confirmed, Then the row disappears; Given a persisted direccion, Then it turns deactivated and stays; Given the same row again, Then `Direccion ya Esta desactivada` shows and nothing changes; Given a persisted vehiculo, Then it disappears from the grid and is deleted on save.

**S-MD-7 quitar without selection** — Given no selected row on `Cuentas`, When `Quitar` is pressed, Then `Seleccione Fila.` shows and nothing changes.

**S-MD-8 all-or-nothing** — Given a Cliente INSERT with a valid parent and a pending padron the server rejects, When submitting, Then the dialog stays open with the pending rows and the data kept, the padron error shows on its row/tab, and `GET /v1/clientes` does not contain the new parent.

**S-MD-9 child uniqueness** — Given an active almacen+proceso row on an Item, When the same almacén and proceso are added again, Then `Almacen ya se Encuentra Activado` shows and no row is added; Given the first row deactivated, Then the same pair can be added.

**S-MD-10 cascade** — Given a Vendedor with two activation rows, When it is deleted, Then both rows are logically deleted and `GET /v1/vendedores/{id}/activaciones` answers 404.

**S-MD-11 read-only modes** — Given DETAIL on a Transportista, Then the vehiculos grid and activation grid toolbars are disabled and no `Agregar` opens.

**S-MD-12 clone drops children** — Given CLONE of a Banco with three activation rows, Then the copy shows one initial activation `INICIO` and none of the original rows.

**S-MD-13 dirty state includes children** — Given only a pending child row changed, When Esc is pressed, Then the discard confirmation shows (R-CRUD-8).

**S-MD-14 param-gated tabs** — Given the company parameter `IS_CLIENTE_SUSTITUTO` false, Then the Cliente dialog has no `Sustitutos` tab; Given it true, Then the tab shows.
