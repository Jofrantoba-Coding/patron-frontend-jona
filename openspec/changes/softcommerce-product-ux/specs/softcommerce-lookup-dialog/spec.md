# Delta for softcommerce-lookup-dialog

This delta adds keyboard row navigation and visible selection in the results, and sets the footer order. The six pickers, their labels and their messages are unchanged. Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-LKP-1..8, S-LKP-1..16).

## MODIFIED Requirements

### R-LKP-4 Pick, keyboard and veto
**Pick**
- The pick action MUST be enabled only while a row is selected **[DEVIATION]**. The desktop either did nothing silently or showed inconsistent messages (`Seleccione un Elemento`, `Seleccione un registro de la tabla`).
- The results MUST be a `JDataGrid` (jona-ui-data R-DAT-2, R-DAT-3) named by the dialog title, or by `Resultados` when the title is empty **[ASSUMPTION]**. Its selected row is visibly highlighted.
- Within the current page, ↑ / ↓ / Home / End / PgUp / PgDn move the selection. Double-clicking a row, or pressing Enter on the selected row, MUST pick it.

**Filters and Esc**
- Enter inside a filter MUST move focus to the next filter. From the last filter it moves to the first result row, or to `Cancelar` when there are no rows.
- Esc MUST close the dialog.

**Footer order**
- The footer MUST hold `Cancelar` first (secondary) and the pick button last (primary), in both DOM order and visual order.
- `Refrescar`, where present (R-LKP-5), MUST sit with the results (header of the results), not in the footer, and keeps its name.
- The dialog stays a centered dialog, size `xl`.

**Veto**
- A host `veto` MAY reject a pick with a message. The dialog MUST then stay open with the message shown inline above the results, and nothing is handed over (desktop: `Cliente ya Esta Agregado`).

(Previously: the results were a focusable group that handled only Enter, with no arrow-key navigation and no visible selection. The footer order was `Refrescar`, pick, `Cancelar`.)

## ADDED Scenarios

**S-LKP-17 arrow keys** — Given BuscarTrabajador with three rows and the first selected after load (R-LKP-2), When the grid has focus and ↓ is pressed twice, Then the third row is selected. Enter hands that full row to the host once.

**S-LKP-18 from filters to rows** — Given focus in the last filter, When Enter is pressed, Then the first result row has focus inside `getByRole('grid')`. ↓ then selects the second row.

**S-LKP-19 footer order** — Given any picker, Then the footer buttons, in DOM order, are `Cancelar` then the pick label (for example `Agregar`). `Refrescar` is not in the footer.

**S-LKP-20 visible selection** — Given a row selected, Then it is the only row with `aria-selected="true"` and it carries the selected-row classes of the shipped CSS.

**S-LKP-21 keys stay within the page** — Given page 1 of 3 with the last row selected, When ↓ is pressed, Then the selection does not change and the page stays 1.

## Test churn (assertions that change)

- `LookupDialog.spec.tsx` and `lookupHarness.spec.tsx`: the results are queried as `grid` instead of `group`, the footer order changes, and `Refrescar` is found in the results header.
- S-LKP-1..16 keep their text.
