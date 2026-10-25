# Spec: jona-ui-data

The data-display pieces of `jona-ui`: the `JTableRow` selected state (shipped in 1.5.2), the selectable keyboard grid `JDataGrid`, the action bar `JToolbar` (groups are declared per item, so there is no `JToolbarGroup`), and the `JPagination` rows info.
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise. Requirements R-DAT-1..7, scenarios S-DAT-1..22.

## Requirements

### R-DAT-1 JTableRow selected
`JTableRow` MUST accept `selected`. When it is true the row MUST set `aria-selected="true"` and `data-state="selected"`, and MUST be painted with a 3 px `primary` start border and a selection background:
- in 1.5.2, `primary-50`, because there are no semantic tokens yet;
- from 1.6.0, the `selection` token.

That style MUST be visibly different from the hover style (in both theme modes from 1.6.0). Every class involved MUST be in the built CSS. Without the prop, the row MUST render as in 1.5.1.

### R-DAT-2 JDataGrid roles and selection
`JDataGrid` MUST render `role="grid"` with an accessible name. Header cells are `columnheader` and data cells are `gridcell`. Only the selected row has `aria-selected="true"`, and it is styled as in R-DAT-1. A sortable header MUST expose `aria-sort` and toggle through `onSortChange(key, direction)`, where `direction` is the next direction (`asc` or `desc`). An optional `maxHeight` caps the scroll area through a CSS variable. Selection is controlled: the grid reports `onSelect(key)` and shows the `selectedKey` it receives. Click selects a row. Double-click calls `onOpen(key)`.

### R-DAT-3 JDataGrid keyboard
The grid MUST be one tab stop with a roving focus: the focused row is the selected row, or the first row when none is selected. Selection follows focus.

| Key | Effect |
|---|---|
| ↓ / ↑ | next / previous row |
| Home / End | first / last row of the page |
| PgDn / PgUp | 10 rows forward / back **[ASSUMPTION]**, stopping at the page bounds |
| Enter | `onOpen(key)` of the focused row |

At a bound a key changes nothing. The grid MUST prevent the browser default only for the keys it handles. A key pressed inside an interactive element in a cell MUST NOT be taken by the grid.

### R-DAT-4 JDataGrid states and slots
- `loading="initial"` MUST show skeleton rows plus a visually hidden `role="status"` text (default `Cargando...`).
- `loading="refresh"` MUST keep the current rows, set `aria-busy="true"` on the grid and show a progress indicator.
- An empty row list MUST render the `empty` slot.
- A `rowState(row)` callback returns `{ badge?, error?, muted? }`:
  - `badge` (`{ label, variant }`, typed by the `JBadge` variants) MAY add a badge to the row, exposed as its description;
  - `error` MUST render the message next to its row, link it through the row's `aria-describedby`, and mark the row invalid (`aria-invalid="true"`);
  - `muted` dims the row.

### R-DAT-5 JToolbar
`JToolbar` MUST render `role="toolbar"` with an accessible name and items declared as data: `id`, `label`, optional `icon`, `tone` (`primary`, `default` or `danger`), `disabled`, `disabledReason`, `shortcut`, `group` and `overflow`. Activating an item calls `onAction(id)`.
- Groups MUST be separated by `role="separator"`.
- ← / → MUST move focus between enabled items, and Home / End jump to the first / last.
- A disabled item MUST be a natively disabled button (its accessible name is unchanged, and Testing Library `toBeDisabled()` holds) **[ASSUMPTION]**. Activating it does nothing. Its `disabledReason` MUST be its accessible description and its tooltip.
- An item with `shortcut` MUST set `aria-keyshortcuts` and the tooltip `{label} ({shortcut})`. The toolbar does not listen to keys; the host does.

### R-DAT-6 JToolbar overflow
Items with `overflow: true` MUST be listed in one menu button (default name `Más acciones` **[ASSUMPTION]**, `aria-haspopup="menu"`, `aria-expanded`). Its items are `menuitem`s with the same labels, disabled state and reasons, and selecting one calls `onAction(id)`. With no overflow items, no menu button is rendered.

### R-DAT-7 JPagination rows info
`JPagination` MUST accept `totalRows`, `pageSize` and `showRowsInfo`. With `showRowsInfo` it MUST show `{first}–{last} de {total}` (en dash), for example `1–20 de 134`, `121–134 de 134`, and `0 de 0` when there are no rows **[ASSUMPTION]**. Without the props the output MUST equal 1.5.1.

## Scenarios

**S-DAT-1 selected row** — Given `<JTableRow selected>`, Then it has `aria-selected="true"`, `data-state="selected"` and the selection classes (present in the built CSS). Given no `selected`, Then it renders as in 1.5.1.

**S-DAT-2 selection is visible** — Given the built CSS, Then the selected-row rule and the row hover rule use different background tokens, and the selected rule adds the start border, in light and in dark (CSS-parse test).

**S-DAT-3 grid roles** — Given `JDataGrid` named `Cliente` with 3 rows, Then `getByRole('grid', { name: 'Cliente' })` has 3 data rows. Given `selectedKey` 2, Then exactly that row has `aria-selected="true"`.

**S-DAT-4 sort header** — Given a sortable column `Nombre`, When its header is activated, Then `onSortChange('nombre', 'asc')` is called, and the header shows `aria-sort` per the current sort.

**S-DAT-5 click and double-click** — Given a row with key 7, When clicked, Then `onSelect(7)` is called. When double-clicked, Then `onOpen(7)` is called once.

**S-DAT-6 one tab stop** — Given a grid with no selection, When Tab enters it, Then the first row has focus. Tab again leaves the grid.

**S-DAT-7 arrows** — Given row 1 focused and selected, When ↓ is pressed twice, Then `onSelect` received 2, then 3, and row 3 has focus. When ↑ is pressed, Then `onSelect(2)` is called.

**S-DAT-8 Home, End, paging keys** — Given 25 rows on the page with row 1 focused, When End is pressed, Then row 25 is selected. Home selects row 1, PgDn selects row 11, and PgUp from row 5 selects row 1.

**S-DAT-9 Enter opens** — Given row 4 focused, When Enter is pressed, Then `onOpen(4)` is called once.

**S-DAT-10 bounds** — Given the last row focused, When ↓ is pressed, Then `onSelect` is not called.

**S-DAT-11 cell controls keep their keys** — Given a cell with a text box that has focus, When ↓ or Enter is pressed, Then the grid calls neither `onSelect` nor `onOpen`.

**S-DAT-12 initial loading** — Given `loading="initial"`, Then skeleton rows show and a `status` with text `Cargando...` exists.

**S-DAT-13 refresh keeps rows** — Given 5 rows shown, When `loading` becomes `refresh`, Then the 5 rows are still rendered, the grid has `aria-busy="true"`, and a progress indicator shows.

**S-DAT-14 empty slot** — Given no rows and `empty={<p>No hay registros.</p>}`, Then `No hay registros.` shows.

**S-DAT-15 row error** — Given `rowState` that returns `{ error: 'Padron duplicado' }` for row 2, Then row 2 has `aria-invalid="true"` and its accessible description contains `Padron duplicado`.

**S-DAT-16 toolbar roles and groups** — Given `JToolbar` named `Acciones` with items in two groups, Then `getByRole('toolbar', { name: 'Acciones' })` holds one `separator` between the groups.

**S-DAT-17 toolbar arrows** — Given focus on the first item, When → is pressed, Then the next enabled item has focus (a disabled one is skipped). End focuses the last enabled item.

**S-DAT-18 disabled reason** — Given item `Modificar` disabled with reason `Seleccione un registro`, Then the button is disabled, its name is `Modificar` and its accessible description is `Seleccione un registro`. Clicking it does not call `onAction`.

**S-DAT-19 shortcut exposure** — Given item `Agregar` with shortcut `Alt+A`, Then it has `aria-keyshortcuts="Alt+A"` and the tooltip `Agregar (Alt+A)`.

**S-DAT-20 overflow menu** — Given items `Buscar` and `Exportar` with `overflow: true`, Then they are not toolbar buttons. When `Más acciones` is opened, Then two `menuitem`s show. Selecting `Buscar` calls `onAction('search')`.

**S-DAT-21 no overflow button** — Given no overflow items, Then no `Más acciones` button exists.

**S-DAT-22 rows info** — Given `totalRows=134` and `pageSize=20`, Then page 1 shows `1–20 de 134` and page 7 shows `121–134 de 134`. Given 0 rows, Then `0 de 0`. Without `showRowsInfo`, Then the 1.5.1 output.
