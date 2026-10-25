# Delta for softcommerce-user-permissions

What changes:
- `Permisos actualizados correctamente` shows as a toast, with the same text.
- Autorizar Series moves to a drawer, and its `Desactivar` gets a confirm **[DEVIATION]**.
- The Seguridad Perfil list and tree get keyboard roles.

Every desktop label and message is unchanged. Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-PRM-1..8, S-PRM-1..16). Cross-screen rules: softcommerce-ux-conventions (R-UX-*).

## ADDED Requirements

### R-PRM-9 Perfil screen keyboard and roles
- **Perfil list**: the list of R-PRM-1 MUST be a `JDataGrid` (jona-ui-data R-DAT-2, R-DAT-3) with visible, keyboard-driven row selection. The first row is still selected after each filter change.
- **Menu tree**: the tree of R-PRM-2 MUST be a `JTreeNav` checkbox variant (jona-ui-app-chrome R-CHR-4). Space or a click on the checkbox toggles one node's visibility, with no propagation. A click on the node text, or the arrow keys, selects the node for `Permisos`. Branches can be expanded and collapsed.
- **Names and screen**: the buttons `Perfil`, `Permisos de Formulario`, `Guardar` and `Permisos` keep their names. The screen renders with a `JPageHeader` titled `Seguridad - Perfil`, in two panes from 1024 px. The scroll areas of the list and the tree MUST be capped in height through the `maxHeight` props of `JDataGrid` and `JTreeNav`, with no app class (R-UX-6).
- **Dirty state**: unsaved tree toggles MUST report the tab dirty (R-SHELL-4).

## MODIFIED Requirements

### R-PRM-2 Menu tree editor
`Perfil` MUST load, for the selected perfil, the menu tree (the app menu seed) with one checkbox per node, holding the node's visibility for that perfil. The header shows the perfil descripcion. With no selected perfil row it MUST show `Seleccione Fila` (title `Perfiles`) and load nothing. Each node MUST toggle independently: there is NO parent/child propagation (desktop `EditorTree`). `Guardar` and `Permisos` MUST stay disabled until a perfil tree is loaded.

`Guardar` MUST send only the nodes whose visibility changed. On success it MUST show `Permisos actualizados correctamente` as a `success` toast (same text, no modal **[DEVIATION]**, owner decision of 2026-10-24) and clear the dirty state. On failure it shows the server message and keeps the edits. **[ASSUMPTION]** The web has a single menu, so the desktop branches `Escritorio`, `Web` and `Barra` are not ported. The toolbar permissions are the 13 flags of R-PRM-3.

(Previously: the success message was a modal `Mensaje`.)

### R-PRM-3 Form permission dialog (per option)
`Permisos` MUST open the form permission dialog for the selected tree node. It MUST be refused, without opening, with:
- no node selected: `Seleccione Opcion`;
- the node's visibility not checked: `No tiene Permisos para acceder a Opcion`;
- the node without an associated form: `Opcion no tiene Asociado un formulario`.

Otherwise the dialog MUST open with the title `Perfil {descripcion del perfil}` and the header `OPCION: {DESCRIPCION DEL NODO}`. It MUST list the 13 permission flags of that form as checkboxes for that perfil: `add`, `modify`, `eliminate`, `nullify`, `clone`, `details`, `search`, `report`, `export`, `print`, `printFast`, `close`, `refresh`, shown by their toolbar button labels. Its `Guardar` MUST send only the flags that changed and show `Permisos actualizados correctamente` as a `success` toast, while the dialog stays open (as the desktop).

**Applied in W3-13:**
- the node text selects the node and the checkbox toggles it (they are separate controls, as the desktop JTree);
- the five flags the W1 toolbar does not draw are labelled `Anular`, `Reporte`, `Imprimir`, `Impresion Rapida` and `Cerrar` **[INFERRED]**;
- the node header is the uppercased menu description (`OPCION: ADUANA` for the seeded `Aduana`).

(Previously: the success message was shown inside the dialog.)

### R-PRM-6 Autorizar Series
The Usuario list toolbar MUST offer `Autorizar Series`. It MUST be refused with `Seleccione un registro de la tabla` (title `Aviso`, modal, R-UX-1) when no usuario row is selected. Otherwise it MUST open the series panel as an end-side drawer (`JDrawer`, size `lg`, `role="dialog"` with its current title). The panel shows:
- a header row with `Trabajador:` (the usuario's trabajador name) and `Usuario:` (the usuario name), separate from the toolbar;
- a toolbar with `Activar` and `Desactivar` (R-ACT-4: `immediate`);
- a grid (`JDataGrid` with keyboard selection) of that user's series authorizations.

Grid columns (desktop `TableModelAutorizaCorrelativo`, read in W3-14): `ESTADO`, `ID CORRELATIVO`, `PUNTO DE VENTA`, `TIPO DE DOCUMENTO`, `SERIE`, `FECHA INICIO`, `FECHA FIN`. The web shows the estado as `Activo` / `Desactivado`.

**Applied in W3-14:**
- The toolbar action is `autorizar-series` (`placement: list-toolbar`, `kind: deferred`, `rule: autorizarSeries`, `flag: modify`). The desktop button is the `Anular` slot, whose grant is off. A list-toolbar action is always pressable by its flag and, with no selected row, shows the Aviso notice itself.
- The panel replaces nothing of the register: Series has `tab: false`.
- The Activar dialog closes on success (the desktop leaves it open), and a refusal stays inside it (S-ACT-9).
- Successful action messages (`Serie autorizada`, `Serie desactivada`) MUST show as `success` toasts. A refusal message such as `La serie ya esta desactivada` shows inside the open dialog, else as a `danger` toast (R-ACT-6) [INFERRED: the Oracle functions are not in the repo].
- The series of the dialog come from the correlativos with estado A of the chosen punto de venta and tipo, and the tipo list is every active tipo (desktop `listarTipoDoc()`).

The actions:
- `Activar` MUST open the dialog `Autorizar Series` with `Punto de Venta`, `Tipo de Documento`, `Serie`, `Id Correlativo` (read-only, filled by the chosen serie), `Fecha de Inicio` (default today) and `Guardar`. Choosing or changing the punto de venta or the tipo de documento MUST clear the serie and the id, and reload the series of that pair. An empty result MUST show `No existe serie para esa combinacion`. `Guardar` MUST create the authorization (estado active, that fecha de inicio), show the server message as a toast and reload the grid.
- `Desactivar` MUST require a selected grid row (`Seleccione un registro de la tabla`, title `Aviso`). It MUST then ask the `danger` confirm of R-ACT-4 **[DEVIATION]** (the desktop did not ask). On confirm it sets the row's fecha fin = today and estado deactivated, shows the server message as a toast and reloads the grid.

(Previously: a centered `lg` dialog whose toolbar mixed the context labels with the buttons, `Desactivar` ran immediately, and server messages were a modal `Mensaje`.)

## MODIFIED Scenarios

**S-PRM-4 save only changes** — Given two nodes toggled, When `Guardar` is pressed, Then `PUT /v1/tipos-trabajador-perfil/{id}/menu` carries exactly those two nodes, a `success` toast `Permisos actualizados correctamente` shows, and no modal opens. Given the server rejects, Then the server message shows and the edits remain.

**S-PRM-12 Activar creates** — Given a valid pair, When `Guardar` is pressed, Then one authorization is created active with today's `fecha_inicio`, the server message shows as a `success` toast, the dialog closes and the grid reloads with it.

**S-PRM-13 Desactivar** — Given no selected row, Then `Seleccione un registro de la tabla` (title `Aviso`). Given an active row, Then a `danger` confirm shows first. Confirming turns the row deactivated with fecha fin today, shows the toast, and reloads the grid. Declining sends nothing.

## ADDED Scenarios

**S-PRM-17 Permisos dialog toast** — Given the Permisos dialog with `eliminate` unchecked, When `Guardar` succeeds, Then a `success` toast `Permisos actualizados correctamente` shows and the dialog stays open, with no message inside it.

**S-PRM-18 perfil list keyboard** — Given perfiles `CAJERO`, `VENDEDOR` with the first selected, When the grid has focus and ↓ is pressed, Then `VENDEDOR` is selected and visibly highlighted, and `Perfil` loads its tree.

**S-PRM-19 checkbox tree** — Given a loaded tree, When Space is pressed on parent `Maestros`, Then only `Maestros` toggles (S-PRM-3) and the tab reports dirty. When the text of `Aduana` is clicked, Then `Aduana` is selected and its checkbox is unchanged.

**S-PRM-20 Autorizar Series drawer** — Given a selected usuario, When `Autorizar Series` is pressed, Then a `dialog` drawer opens, its header shows `Trabajador:` and `Usuario:` outside the `toolbar`, and the toolbar holds `Activar` and `Desactivar`.

**S-PRM-21 scroll areas capped** — Given the perfil screen, Then the list and tree scroll containers are capped through their `maxHeight` props (R-UX-6), and `max-h-80` / `max-h-96` no longer appear in the app source.

## Test churn (assertions that change)

- `perfilList.spec.tsx`: `listbox` / `option` become `grid` / `row`.
- `perfilPermisos.spec.tsx`: tree roles; the `Mensaje` modal becomes a toast.
- The Autorizar Series specs: drawer, confirm and toast.
- S-PRM-1..3, S-PRM-5..11 and S-PRM-14..16 keep their text.
