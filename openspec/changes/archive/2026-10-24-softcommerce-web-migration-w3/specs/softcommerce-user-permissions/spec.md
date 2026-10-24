# Spec: softcommerce-user-permissions

NEW capability. The perfil permission editor (desktop `FormMenuPerfilArbol` + `FormMenuPerfilPermiso`, menu leaf `mi_SeguridadPerfil`) and the user series authorization (`FormPanelUA` + `FormUA`, "Autorizar Series", opened from the Usuario list). Scope is the existing 13 permission flags and the existing menu tree; the real W6 permission model is out of scope.
Marker legend: **[ASSUMPTION]**, **[DEVIATION]** and **[INFERRED]** as in softcommerce-lookup-dialog.

## Requirements

### R-PRM-1 Perfil screen
The system MUST provide a `Seguridad - Perfil` screen (formId `mi_SeguridadPerfil`) whose left panel lists the perfiles (the W2 `tipos-trabajador-perfil` rows: descripcion and tipo de trabajador, active only) with two filters: `Desc.` (uppercase, max 255, contains over the descripcion) and `T Trabajador` (select over the active `tipos-trabajador`, first option `--- Seleccione---` = no filter), combined with AND and applied on each change with the first row selected. It offers the buttons `Perfil` and `Permisos de Formulario`. Perfil rows are maintained by the W2 catalog; this screen only edits their permissions.

### R-PRM-2 Menu tree editor
`Perfil` MUST load, for the selected perfil, the menu tree (the app menu seed) with one checkbox per node holding the node's visibility for that perfil; the header shows the perfil descripcion. With no selected perfil row it MUST show `Seleccione Fila` (title `Perfiles`) and load nothing. Each node MUST toggle independently: there is NO parent/child propagation (desktop `EditorTree`). `Guardar` and `Permisos` MUST stay disabled until a perfil tree is loaded. `Guardar` MUST send only the nodes whose visibility changed; on success it shows `Permisos actualizados correctamente`; on failure it shows the server message and keeps the edits. **[ASSUMPTION]** the web has a single menu, so the desktop branches `Escritorio`, `Web` and `Barra` are not ported; the toolbar permissions are the 13 flags of R-PRM-3.

### R-PRM-3 Form permission dialog (per option)
`Permisos` MUST open the form permission dialog for the selected tree node. It MUST be refused, without opening, with:
- no node selected: `Seleccione Opcion`;
- the node's visibility not checked: `No tiene Permisos para acceder a Opcion`;
- the node without an associated form: `Opcion no tiene Asociado un formulario`.
Otherwise the dialog (title `Perfil {descripcion del perfil}`, header `OPCION: {DESCRIPCION DEL NODO}`) MUST list the 13 permission flags of that form (`add`, `modify`, `eliminate`, `nullify`, `clone`, `details`, `search`, `report`, `export`, `print`, `printFast`, `close`, `refresh`, shown by their toolbar button labels) as checkboxes for that perfil, and its `Guardar` MUST send only the flags that changed and show `Permisos actualizados correctamente`. **Applied in W3-13:** the node text selects the node and the checkbox toggles it (they are separate controls, as the desktop JTree); the five flags the W1 toolbar does not draw are labelled `Anular`, `Reporte`, `Imprimir`, `Impresion Rapida` and `Cerrar` **[INFERRED]**; the dialog stays open after a save (as the desktop) and shows the message inside; the node header is the uppercased menu description (`OPCION: ADUANA` for the seeded `Aduana`).

### R-PRM-4 Form permissions per perfil
`Permisos de Formulario` MUST require a selected perfil row (`Seleccione Fila`, title `Perfiles`) and then open the same dialog in perfil mode: a matrix of every form of the app by its 13 flags (no node header). Its `Guardar` MUST behave as in R-PRM-3.

### R-PRM-5 Perfil permission store (mock contract)
The mock MUST keep, per tenant and perfil, the menu visibility and the form flags edited here, and expose:
- `GET /v1/tipos-trabajador-perfil/{id}/menu` and `PUT /v1/tipos-trabajador-perfil/{id}/menu` (body: the changed nodes `{ id, visible }`);
- `GET /v1/tipos-trabajador-perfil/{id}/permisos` (all forms) and `GET /v1/tipos-trabajador-perfil/{id}/permisos/{formId}`; `PUT` of both (body: the changed `{ formId, flag, value }`).
The routes are nested under the W2 perfil catalog (R-MOCK-19); the `{id}` is its `id_tipo_perfil`.
A perfil without stored overrides MUST answer the seeded defaults (`menu.json` visibility, `permissions.json` flags), so every W1 / W2 form keeps its seeded behavior. An unknown perfil MUST answer 404 and an unknown menu node, formId or flag MUST answer 422 with a detail, all with the error shape. Writes MUST require `X-Tenant-Id`. Shapes: `GET .../menu` answers `{ items }` (each menu row plus `visible`), `GET .../permisos` answers `{ items: [{ formId, ...13 flags }] }` and `GET .../permisos/{formId}` the 13 flags; a `PUT` body is the list of changed cells (or `{ items }`) and answers the shape of its `GET`; a `PUT` is all or nothing (any unknown node, formId, flag or non-boolean value is a 422 and stores nothing). A logically deleted perfil is as good as unknown (404). The menu override hides only the unchecked node; its children are not cascaded (S-PRM-3). **Applied in W3-13:** the client is its own service, `InterPerfilGrantsService` (`menu`, `saveMenu`, `permisos`, `permiso`, `savePermisos`, `savePermiso`) with `createPerfilGrantsServiceHttp` and the in-browser mock `perfilGrants` over the same `mock-server/core/grants.js` rules, both pinned by one shared contract; it is not part of `InterCatalogService` (S-LOC-17 pins that method set). The menu `PUT` body is the bare list `[{ id, visible }]`.

### R-PRM-6 Autorizar Series
The Usuario list toolbar MUST offer `Autorizar Series`. It MUST be refused with `Seleccione un registro de la tabla` (title `Aviso`) when no usuario row is selected. Otherwise it MUST open the series panel showing `Trabajador:` (the usuario's trabajador name) and `Usuario:` (the usuario name) and a grid of that user's series authorizations with the toolbar `Activar` and `Desactivar` (R-ACT-4: `immediate`). Grid columns (desktop `TableModelAutorizaCorrelativo`, read in W3-14): `ESTADO`, `ID CORRELATIVO`, `PUNTO DE VENTA`, `TIPO DE DOCUMENTO`, `SERIE`, `FECHA INICIO`, `FECHA FIN`; the web shows the estado as `Activo` / `Desactivado`. **Applied in W3-14:** the toolbar action is `autorizar-series` (`placement: list-toolbar`, `kind: deferred`, `rule: autorizarSeries`, `flag: modify`; the desktop button is the `Anular` slot, whose grant is off); a list-toolbar action is always pressable by its flag and, with no selected row, shows the Aviso notice itself. The panel replaces nothing of the register: Series has `tab: false`. The Activar dialog closes on success (the desktop leaves it open) and a refusal stays inside it (S-ACT-9); messages of the server actions are `Serie autorizada` / `Serie desactivada` / `La serie ya esta desactivada` [INFERRED: the Oracle functions are not in the repo]; the series of the dialog come from the correlativos with estado A of the chosen punto de venta and tipo, and the tipo list is every active tipo (desktop `listarTipoDoc()`).
- `Activar` MUST open the dialog `Autorizar Series` with `Punto de Venta`, `Tipo de Documento`, `Serie`, `Id Correlativo` (read-only, filled by the chosen serie), `Fecha de Inicio` (default today) and `Guardar`. Choosing or changing the punto de venta or the tipo de documento MUST clear the serie and the id and reload the series of that pair; an empty result MUST show `No existe serie para esa combinacion`. `Guardar` MUST create the authorization (estado active, that fecha de inicio), show the server message and reload the grid.
- `Desactivar` MUST require a selected grid row (`Seleccione un registro de la tabla`, title `Aviso`), then set its fecha fin = today and estado deactivated, show the server message and reload the grid.

### R-PRM-7 One shared store with usuario-correlativos
Autorizar Series and the W2 `usuario-correlativos` catalog (UsuarioCorrelativo) MUST read and write the SAME records: there is no second table. The W2 `habilitar` flag is the authorization estado (`true` = active, `false` = deactivated); `fecha_inicio` and `fecha_fin` are server-managed fields that both screens show and neither writes directly (the W2 form keeps its fields; **[ASSUMPTION]** a row created by the W2 screen gets `fecha_inicio` = the creation date). The localidad stored by the W2 chain MUST be derived server-side from the chosen punto de venta when Autorizar Series creates a row. The W2 unique key (usuario, correlativo) and its literal message (R-REF-7) MUST apply to both screens: `Activar` over an existing ACTIVE authorization of the pair answers 409 with that message; **[ASSUMPTION]** over an existing deactivated row of the pair it re-activates that row (new `fecha_inicio`, `fecha_fin` cleared) instead of failing. The W2 logical delete MUST remove the row from the Autorizar Series grid. **Applied in W3-14:** the dates are stored-only columns owned by the named rule `fechaAutorizacion` (a W2 create stores today as `fecha_inicio`; a body never writes either date); the 409 of `activate` is `ACTION_NOT_ALLOWED` with the W2 sentence and a `DUPLICATE` detail on `id_correlativo`; whether the desktop `Activar` over a deactivated pair re-enables it could not be confirmed (`FN_MANT_AUTORIZAR_CORRE` is not in the repo), so the [ASSUMPTION] stands.

### R-PRM-8 Effect time
Edits are stored as per-perfil overrides over the seeded defaults (R-PRM-5). **[DEVIATION]** the desktop reads a form's grants when the form is opened; the web session snapshots them at login (R-AUTH-11). Permission and menu changes made here MUST apply to a user at the NEXT login of a user whose trabajador has that perfil; an already open session MUST keep its loaded grants (softcommerce-auth-session R-AUTH-11).

## Scenarios

**S-PRM-1 perfil filters** — Given perfiles `VENDEDOR` (tipo VENTAS) and `CAJERO` (tipo CAJA), When `ven` is typed in `Desc.`, Then only `VENDEDOR` shows and is selected; When `T Trabajador` = CAJA is also chosen, Then no row shows.

**S-PRM-2 load tree without selection** — Given no selected perfil row, When `Perfil` is pressed, Then `Seleccione Fila` shows (title `Perfiles`) and the tree stays empty and `Guardar` / `Permisos` stay disabled.

**S-PRM-3 independent toggles** — Given a loaded tree, When a parent node is unchecked, Then its children keep their checkboxes.

**S-PRM-4 save only changes** — Given two nodes toggled, When `Guardar` is pressed, Then `PUT /v1/tipos-trabajador-perfil/{id}/menu` carries exactly those two nodes and `Permisos actualizados correctamente` shows; Given the server rejects, Then the server message shows and the edits remain.

**S-PRM-5 Permisos guards** — Given no node selected, Then `Seleccione Opcion`; given an unchecked node, Then `No tiene Permisos para acceder a Opcion`; given a node with no form, Then `Opcion no tiene Asociado un formulario`; none opens the dialog.

**S-PRM-6 Permisos dialog** — Given a checked node of form `miAduana`, Then the dialog titled `Perfil VENDEDOR` with header `OPCION: ADUANAS` lists the 13 flags with the perfil's values; unchecking `eliminate` and `Guardar` sends `{ formId: 'miAduana', flag: 'eliminate', value: false }` only.

**S-PRM-7 Permisos de Formulario** — Given no perfil row, Then `Seleccione Fila`; given a perfil, Then the matrix lists every form with its 13 flags and saves only changed cells.

**S-PRM-8 defaults without overrides** — Given a perfil with no stored overrides, Then `GET /v1/tipos-trabajador-perfil/{id}/permisos/miAduana` returns the `permissions.json` flags and the W1 / W2 suites pass unchanged.

**S-PRM-9 contract errors** — Given `PUT /v1/tipos-trabajador-perfil/zzz/menu`, Then 404; given an unknown menu node or flag, Then 422 with a detail; given no tenant header, Then 400.

**S-PRM-10 Autorizar Series guard** — Given no selected usuario, When `Autorizar Series` is pressed, Then `Seleccione un registro de la tabla` shows (title `Aviso`) and no panel opens.

**S-PRM-11 series chain** — Given the dialog, When the punto de venta changes, Then serie and id clear and the series reload; Given a pair with no series, Then `No existe serie para esa combinacion` shows; When a serie is chosen, Then `Id Correlativo` shows its id read-only.

**S-PRM-12 Activar creates** — Given a valid pair, When `Guardar` is pressed, Then one authorization is created active with today's `fecha_inicio`, the server message shows and the grid reloads with it.

**S-PRM-13 Desactivar** — Given no selected row, Then `Seleccione un registro de la tabla`; given an active row, Then it turns deactivated with fecha fin today and the grid reloads.

**S-PRM-14 cross-UI store** — Given an authorization created through Autorizar Series, Then it appears in the W2 `usuario-correlativos` list with `habilitar` true; When it is set to `habilitar` false in the W2 screen, Then the Autorizar grid shows it deactivated; When the W2 screen logically deletes it, Then the Autorizar grid no longer shows it.

**S-PRM-15 unique key shared** — Given an active authorization of (usuario U, correlativo C), When Autorizar Series `Activar`s the same pair, Then 409 with `Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.`; Given the row deactivated, Then `Activar` re-activates it.

**S-PRM-16 next-login effect** — Given a perfil edited while a user of it has an open session, Then that session's grants are unchanged and a new login shows the edited grants (S-AUTH-26).
