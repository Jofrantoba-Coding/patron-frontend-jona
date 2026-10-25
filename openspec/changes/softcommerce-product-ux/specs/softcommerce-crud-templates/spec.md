# Delta for softcommerce-crud-templates

This delta rebuilds the list and register templates on `jona-ui` 1.6.0:
- the list gets a visible header, count and selection, a refresh that keeps its rows, and grid keys;
- Buscar works, and the toolbar is grouped with disabled reasons;
- the register gets per-mode actions and confirm copy (owner decision), success toasts with focus restore, an accessible field layout and the lookup input group with F2.

Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-CRUD-1..19, S-CRUD-1..50). Cross-screen rules: softcommerce-ux-conventions (R-UX-*).

## ADDED Requirements

### R-CRUD-20 Per-mode register actions and confirm copy **[DEVIATION]**
The register primary button and the confirm step MUST use per-mode copy (owner decision of 2026-10-24, which replaces the desktop `Aceptar` and `¿Desea continuar con esta operación?`):

| Mode | Primary button | Confirm title | Confirm body | Confirm button |
|---|---|---|---|---|
| INSERT | `Guardar` | `Nuevo: {title}` | `¿Guardar el nuevo registro?` | `Guardar` (`info`) |
| UPDATE | `Guardar` | `Modificar: {title}` | `¿Guardar los cambios?` | `Guardar` (`info`) |
| CLONE | `Crear` | `Clonar: {title}` | `¿Crear la copia?` | `Crear` (`info`) |
| DELETE | `Eliminar` (destructive) | `Eliminar: {title}` | `Se eliminará el registro.` | `Eliminar` (`danger`) |

- `{title}` is the catalog title. The mode word is the existing register mode label (`Nuevo`, `Modificar`, `Clonar`, `Eliminar`).
- The copy MUST set the variant explicitly for every mode. It never relies on the `JOptionPane` default variant, which is `danger`.
- Every confirm except INSERT MUST show the record summary as `details` (jona-ui-feedback R-FBK-4). The summary is the values of the first two visible columns of the record joined by ` · `, with empty parts omitted (for example `0002 · CUSCO`) **[ASSUMPTION]**.
- The decline button keeps the name `No` **[ASSUMPTION]**, so it never collides with the register `Cancelar`.
- DETAIL keeps no primary button. The dialog title `{Modo}: {title}` is unchanged.
- The confirm runs through `useConfirm`, so its focus and Esc follow R-FBK-2 and R-FBK-3.

### R-CRUD-21 Accessible register layout
- Every register field MUST render through `JField` (jona-ui-forms R-FRM-1) with its existing label as its accessible name.
- Fields are laid out in a `JFieldGrid` of 2 columns from 768 px. `textarea`, `cascade`, `lookup` and the `password` pair span the full width.
- A required field MUST be exposed as required, with the visual marker.
- A field error MUST be in the control's accessible description, with `aria-invalid`, and is not a `role="alert"` of its own.
- A blocked submit (client validation, or server details mapped by R-CRUD-7) MUST show one `JErrorSummary` at the top of the register, listing the errors in config order. Selecting an entry focuses its field and switches tab when needed (R-MD-1). Focus still moves to the first invalid field (R-CRUD-6).
- The register SHOULD size itself by field count: `md` up to 6 fields, `lg` up to 14, `xl` above that or with child tabs.
- While loading, the register MUST show a form skeleton plus the status text `Cargando...`.

## MODIFIED Requirements

### R-CRUD-1 List template
Given a config, the list template MUST render:
- a page header (`JPageHeader`) whose level-1 heading is the catalog title, the count of the rows that match the filter, and the filter search box (accessible name `Filtro`, clearable);
- the toolbar (R-CRUD-2);
- a `JDataGrid` named by the catalog title, sortable and paginated, with the rows info `{first}–{last} de {total}`.

The selected row MUST be visibly highlighted and `aria-selected`. The list MUST also show these states:
- Loading: the first load shows skeleton rows plus the status text `Cargando...`. A refresh (after a save, `Actualizar`, or `Reintentar`) MUST keep the current rows with a progress indicator and MUST NOT blank the grid.
- Empty: `No hay registros.` with an `Agregar` action when `add` is permitted. With a filter active it also offers `Limpiar filtro` **[ASSUMPTION]**.
- Error: an alert with `Reintentar`. The truncation warning is unchanged.

Double-clicking a row, or Enter on it, MUST open the register in DETAIL when the catalog supports DETAIL and `details` is true. Otherwise it MUST open UPDATE when UPDATE is supported and `modify` is true, and otherwise do nothing.

Columns MUST support, besides text:
- joined display columns resolved from refs (for example `empresa`, `familia`);
- `bool` columns (Sí / No);
- `date` columns (`dd/MM/yyyy`);
- `dec` columns (as stored, no rounding);
- option columns (the option label, not the code).

The filter MUST also match joined and option labels. A missing joined value MUST render empty.

(Previously: the title only as an `aria-label`, no count, an invisible selection, `Cargando...` replacing the grid on every refresh, and double-click opening DETAIL only, so catalogs without DETAIL, such as miCliente and miProveedor, did nothing.)

### R-CRUD-2 Toolbar gating
Toolbar actions (add, modify, eliminate, clone, details, search, refresh, export where configured) MUST be enabled only when the matching permission flag is true. Row-dependent actions (modify, eliminate, clone, details) MUST additionally require a selected row.

The toolbar MUST be a `JToolbar`:
- `Agregar` primary.
- A group of `Modificar`, `Eliminar` (danger tone), `Clonar` and `Detalle`.
- `Actualizar`.
- The overflow menu `Más acciones` holding `Buscar` and `Exportar`.
- The list actions of R-ACT-1 (for example `Autorizar Series`) stay visible buttons in their own group **[ASSUMPTION]**.

An action in the overflow menu counts as shown for R-CRUD-10 and R-CRUD-16. A disabled action MUST expose its reason as its accessible description:
- `Seleccione un registro` for a row-dependent action without a selection;
- `Sin permiso` for a false flag;
- `No disponible` for an action that is not built (`Exportar`).

`Buscar` (click or Alt+B) MUST move focus to `Filtro` and select its text **[ASSUMPTION]**.

(Previously: eight equal-weight buttons, the reasons only in a native `title` on a wrapper, and `Buscar` enabled but doing nothing.)

### R-CRUD-5 Register flow
Order MUST be:
1. load lookups (including the dependent chains restored from the record);
2. init mode;
3. load record (non-INSERT);
4. validate on submit (all required fields and constraints, skipping hidden or disabled fields);
5. confirm (R-CRUD-20);
6. execute.

Then, on success:
- close;
- show a `success` toast titled `Registro creado` (INSERT, CLONE), `Registro actualizado` (UPDATE) or `Registro eliminado` (DELETE) **[ASSUMPTION]**, with the record summary of R-CRUD-20 as its message (the catalog title when the summary is empty);
- refresh the parent list without blanking it (R-CRUD-1);
- reselect the affected row;
- restore focus per R-UX-3.

No success modal is shown. A failed execute follows R-CRUD-7.

(Previously: the success was silent, the refresh blanked the grid, and focus was not restored.)

### R-CRUD-8 Keyboard **[ASSUMPTION]**
Enter submits the register form (not from a multiline field, and not when focused on a button other than submit). Esc closes the dialog without executing, asking confirmation if the form is dirty.

In the list grid (R-DAT-3):
- ↑ / ↓ / Home / End / PgUp / PgDn move the row selection, updating the row-dependent gating at once;
- Enter on the focused row opens it per R-CRUD-1.

Grid keys MUST NOT act while a dialog is open.

(Previously: register Enter / Esc only. Rows reacted only to click and double-click.)

### R-CRUD-9 Local components
These components MUST stay app-local under `src/shared/ui`, following InterUi/Impl/View, with value-first callbacks and DEFAULTS without state values:

| Component | Built on |
|---|---|
| `CrudToolbar` (permission gating) | `JToolbar` |
| `UppercaseTextField` | — |
| `NumberField` | `JTextBox` with `inputMode="numeric"`, not `JNumberInput`, which cannot show a padded `05` and whose `max` is a clamp |
| `DateField` | `JDatePicker` with label / error / ref, with no local ref workaround |
| `DependentSelect`, `CascadeSelect` | — |
| `LookupField` / `LookupDialog` (behavior) | `JInputGroup` and `JDataGrid` |
| `CrudGrid` / `ChildGrid` (adapters) | `JDataGrid`, with no table markup of their own |
| `MenuTree` (adapter) | `JTreeNav` |
| `DialogStackProvider` | — |

Everything else MUST come from `jona-ui`. `jona-ui` is pinned to npm `1.6.0` exact. The interim pin `1.5.2` is allowed only between the 1.5.2 and 1.6.0 releases.

(Previously: pinned to `1.5.1`, with local table markup and a local date-ref workaround.)

### R-CRUD-19 Lookup field
A field of kind `lookup` MUST store the id of one record of another catalog. It MUST render as one `JInputGroup` named by the field label (lookup preset, jona-ui-forms R-FRM-5) holding:
- a code box;
- a read-only description (name `{label} descripción`);
- a search button that opens the LookupDialog (softcommerce-lookup-dialog) configured by the field;
- a clear action. Both buttons keep their names.

From 640 px the parts sit in one row. In editable modes, F2 or Alt+↓ in the code box MUST open the dialog. The code box MUST carry the hint `F2 abre la búsqueda` **[ASSUMPTION]** as its description, because a miss on blur opens the dialog by itself. It MUST resolve a typed code through R-LKP-6 before opening the dialog.

In UPDATE, DELETE, DETAIL and CLONE the description MUST be restored from the record's joined display (R-REG-8), with no extra request when the join carries it. In DETAIL and DELETE the field MUST be read-only (no search, no clear, no F2).

`required` MUST block a blank field with the configured per-field error. The server MUST validate the id as a ref (exists, active, belongs to the parent, R-MOCK-12) and answer 422 on the field otherwise. A lookup MAY be the parent of a dependent select (R-CRUD-12), clearing the child when the picked record changes. The field and the dialog behavior are app-local (R-CRUD-9) on top of `jona-ui` 1.6.0.

(Previously: a grid of utility classes missing from the lib CSS, so the parts stacked on desktop; no F2; and "no `jona-ui` change is allowed and the pin stays `1.5.1`".)

## MODIFIED Scenarios

**S-CRUD-1 list states** — Given the first request pending, Then skeleton rows and the status `Cargando...` show. Given a refresh pending with rows shown, Then the rows stay and the grid is `aria-busy`. Given empty items, Then `No hay registros.`. Given failure, Then an error with `Reintentar`.

**S-CRUD-7 double-click and Enter** — Given `details=true` and DETAIL supported, When a row is double-clicked or Enter is pressed on it, Then the register opens in DETAIL. Given DETAIL not supported (miCliente) and `modify=true`, Then it opens in UPDATE. Given neither is permitted, Then nothing opens.

**S-CRUD-8 INSERT** — Given Add, When valid data is submitted with `Guardar` and the confirm `Guardar` is pressed, Then create is called once with the data, the dialog closes, the toast `Registro creado` shows, the list refreshes without blanking, and the new row is selected and focused.

**S-CRUD-9 UPDATE** — Given a selected row, When Modify, Then fields are prefilled. `Guardar` and the confirm `Guardar` call update with the id, the toast `Registro actualizado` shows, the list refreshes, and the row stays selected and focused.

**S-CRUD-10 DELETE** — Given a selected row, When Delete, Then fields are read-only, and `Eliminar` opens the `danger` confirm `Eliminar: {title}` with the record summary. Confirming calls the logical delete and shows `Registro eliminado`. `No` sends nothing.

**S-CRUD-21 pinned dependency** — Given `package.json`, Then `jona-ui` equals `"1.6.0"` with no range operator.

## ADDED Scenarios

**S-CRUD-51 page header and count** — Given Localidad with 12 rows, Then `getByRole('heading', { level: 1, name: 'Localidad' })` exists with the count `(12)`. When the filter narrows it to 3 rows, Then the count shows `(3)`.

**S-CRUD-52 visible selection** — Given a row clicked, Then exactly that row is `aria-selected="true"` inside `getByRole('grid')` and carries the selected-row classes.

**S-CRUD-53 grid keys gate the toolbar** — Given the grid focused with no selection, When ↓ is pressed, Then the first row is selected and `Modificar` becomes enabled. Enter opens it per S-CRUD-7.

**S-CRUD-54 no grid keys under a dialog** — Given the register open, When ↓ or Enter is pressed in a field, Then the list selection does not change.

**S-CRUD-55 Buscar focuses the filter** — Given `search=true`, When `Buscar` is chosen in `Más acciones` or Alt+B is pressed, Then `Filtro` has focus with its text selected. Given `search=false`, Then nothing happens (S-CRUD-4).

**S-CRUD-56 disabled reasons** — Given no selection, Then `Modificar` is disabled with the description `Seleccione un registro`. Given `eliminate=false` and a selection, Then `Eliminar` has `Sin permiso`. `Exportar` has `No disponible`.

**S-CRUD-57 toolbar structure** — Given full permissions, Then `getByRole('toolbar')` holds `Agregar`, then a separator, the row-action group, `Actualizar`, and `Más acciones` with `Buscar` and `Exportar`. Given modes `[UPDATE, DETAIL]`, Then neither group nor overflow holds an unsupported action (S-CRUD-36).

**S-CRUD-58 per-mode labels** — Given each mode, Then the primary button and the confirm copy are those of R-CRUD-20. DETAIL has no primary button.

**S-CRUD-59 confirm summary and focus** — Given UPDATE of `0002 · CUSCO`, Then the confirm `details` show `0002 · CUSCO`. Given DELETE, Then the confirm is `danger` and its cancel button `No` has initial focus.

**S-CRUD-60 refresh keeps rows** — Given 5 rows shown, When a save succeeds, Then at no moment between the confirm and the refreshed rows is the grid empty or replaced by `Cargando...`.

**S-CRUD-61 accessible fields** — Given a required `nombre` with an error, Then `getByRole('textbox', { name: 'Nombre' })` is required, `aria-invalid`, and its description holds the message. No `role="alert"` exists inside the field.

**S-CRUD-62 error summary** — Given two invalid fields, When submitting, Then one `alert` summary lists both in config order and focus is on the first invalid field. Selecting the second entry focuses the second field.

**S-CRUD-63 lookup input group** — Given a `lookup` labelled `Transportista`, Then `getByRole('group', { name: 'Transportista' })` holds the code box, `Transportista descripción`, and the search and clear buttons. Its row layout classes are in the shipped CSS (R-UX-6).

**S-CRUD-64 lookup F2** — Given an editable `lookup` with focus in the code box, When F2 or Alt+↓ is pressed, Then the LookupDialog opens once. In DETAIL, Then nothing opens.

## Test churn (assertions that change)

- **Per-mode labels (R-CRUD-20)**: about 270 occurrences of `'Aceptar'` / `'Confirmar'` in 74 spec files drive register flows across the W1–W3 suites (`UiCrudRegister*.spec`, `UiCrudList*.spec`, `UiMasterRegister*.spec`, `registry.*.ui.spec`, `test/catalogs/*` UI helpers). They move to the shared `src/test/registerDriver.ts` and the R-CRUD-20 labels, and those suites' assertions keep their meaning. The `Aceptar` of Socio Acciones (R-MST-16) and the desktop dialogs that keep their own buttons are not affected.
- **Field errors (R-CRUD-21)**: 19 spec files query `ByRole('alert')` (31 occurrences):
  - `UiCatalog.spec.tsx`, `UiCrudListStates.spec.tsx`, `UiContexto.grants.spec.tsx`, `registry.choferes.ui.spec.tsx`, `UiCrudRegister.spec.tsx`, `localidad.config.spec.tsx`, `UiCrudRegister.serverErrors.spec.tsx`, `registry.clientes.padrones.ui.spec.tsx`, `UiShell.spec.tsx`, `UiCrudRegister.select.spec.tsx`;
  - `FormHost.spec.tsx`, `UiMasterRegister.errors.spec.tsx`, `UiMasterRegister.inline.spec.tsx`, `UiCrudRegister.docIdentidad.spec.tsx`, `UiMasterRegister.spec.tsx`, `LookupDialog.spec.tsx`, `CascadeSelect.spec.tsx`, `useLookup.spec.tsx`, `DependentSelect.spec.tsx`.

  The assertions that target a **field** error read the field's accessible description or the `JErrorSummary` instead. Those that target a form-level, list, menu or permission-load error keep `role="alert"` (R-UX-1).
- **Loading text**: about 40 specs that find `Cargando` keep working, because the text stays as status text.
- **Filter**: the 7 specs that query `Filtro` are unchanged.
- **Toolbar and grid**: `CrudToolbar.spec.tsx` (the native `title` wrapper becomes a description; `Buscar` and `Exportar` move into `Más acciones`), `CrudGrid.spec.tsx` (`aria-selected` inside `role="grid"`), `localidad.config.spec.tsx` (toolbar), `UiCrudListStates.spec.tsx` and `UiCatalog.spec.tsx` (loading and empty).
- **Lookups**: `LookupField.spec.tsx`, `fill.spec.tsx` and `lookupHarness.spec.tsx` (the `title` attribute).
- Every other S-CRUD-1..50 scenario keeps its text.
