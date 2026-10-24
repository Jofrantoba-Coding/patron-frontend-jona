# Spec: softcommerce-anexo

NEW capability. The shared Anexo child grids of the desktop `FormAnexoActivacion` and `FormAnexoPadron`: the activation history (every anexo master) and the padrón grid (Cliente and Proveedor). Built once on G11 / G12 and reused by Banco, Trabajador, Vendedor, Transportista, Cliente, Proveedor and, closing the W2b leftover, Chofer.
Marker legend: **[ASSUMPTION]**, **[DEVIATION]** and **[INFERRED]** as in softcommerce-lookup-dialog. `{Entidad}` is the host entity word the desktop passes to the dialog: `Banco`, `Trabajador`, `Vendedor`, `Transportista`, `Cliente`, `Proveedor`, `Chofer`.

## Requirements

### R-ANX-1 Activation grid
Each anexo master register MUST have an activation tab titled `Activación de {Entidad}` (`Activación de Cliente`, `Activación de Proveedor`, `Activación de Chofer`, `Activación de Banco`, `Activación de Transportista`; **[INFERRED]** `Activación de Trabajador` and `Activación de Vendedor`, whose tab titles the desktop builds elsewhere) holding the shared child grid with the columns `ESTADO` (state icon), `MOTIVO_ACTIVACION`, `FECHA_ACTIVACION`, `MOTIVO_DESACTIVACION`, `FECHA_DESACTIVACION` (dates `dd/MM/yyyy`) and the toolbar actions `Activar` and `Desactivar` (R-ACT-3). The id and the operation of a row are not shown. **Applied in W3-7:** the stored columns are `f_inicio`, `f_fin`, `motivo_activacion`, `motivo_desactivacion` (the desktop XML names) and the grid has no Agregar and no Quitar, only `Activar` and `Desactivar`; in INSERT and CLONE the grid shows the `INICIO` row display-only (the register sends nothing for it and the server creates it, R-ANX-2).

### R-ANX-2 Initial activation
Creating an anexo master MUST create its first activation: motivo `INICIO`, fecha de inicio = today, estado active. The grid MUST show that row in INSERT with `Activar` / `Desactivar` disabled, and the master `Estado` MUST show checked. The server MUST record the row on create whether or not the client sent it (W2 contract for Chofer: "the server records the initial activation on create").

### R-ANX-3 Activar
`Activar` (UPDATE only) MUST be refused with a message, without opening the dialog, when: **Applied in W3-7:** the refusal shows as the grid notice before any dialog opens; the dialog is the shared child register in INSERT mode, titled `Nuevo: Activar {Entidad}`, and its confirm button is the register `Aceptar` (then the register confirmation), not a button named `Activar`.
- the last activation row is active: `{Entidad} ya Esta Activado`;
- the last activation row has a pending change (it was just deactivated in this open register): `{Entidad} recien lo acaba de Desactivar`.
Otherwise it MUST open the activation dialog `Activar {Entidad}` with `Fecha Inicio` (default today) and `Motivo de Activacion` (uppercase, max 100) and the button `Activar`. A blank motivo (after trim) MUST keep the dialog open with `Ingrese Motivo`. A valid confirm MUST add ONE pending row (estado active, that fecha de inicio and motivo) and the master `Estado` MUST show checked.

### R-ANX-4 Desactivar
`Desactivar` (UPDATE only) MUST be refused with a message, without opening the dialog, when:
- no row is selected: `Seleccione un Registro` (with no rows at all, nothing happens);
- the selected row is already deactivated: `Registro ya esta Desactivado`;
- the selected row has a pending change (it was just activated): `{Entidad} recien lo acaba de Activar`.
Otherwise it MUST open the dialog `Desactivar {Entidad}` with `Fecha Fin` (default today), `Motivo de Desactivacion` (uppercase, max 100) and the button `Desactivar`; a blank motivo keeps it open with `Ingrese Motivo`. A valid confirm MUST mark the selected row deactivated with that fecha fin and motivo, and the master `Estado` MUST show unchecked. **[DEVIATION]** a fecha fin before the row's fecha de inicio MUST be refused with the desktop text `Fecha es menor a fecha inicial` (the desktop only showed that text for precios and did not block); the same day is accepted **[ASSUMPTION]**. The server MUST enforce the same rule with a 422 on `fecha_fin`.

### R-ANX-5 One active row and the master state
At most ONE activation row MAY be active per master; the master `estado` is the state of the LAST row. The server MUST reject a write that leaves two active rows (409, message `{Entidad} ya Esta Activado`) and MUST derive the master estado from the last row (R-ACT-5). A master with no activation row (legacy seed) MUST be treated as active and get an `INICIO` row at its first write **[ASSUMPTION]**.

### R-ANX-6 Vendedor and Trabajador variants unified
The desktop Vendedor register uses its own activation dialogs (`Debe llenar el motivo de desactivación`, `Debe llenar el motivo de activacion`, deactivating always the LAST row and closing the dialog on error) and Trabajador / Banco / Transportista / Cliente / Proveedor / Chofer use the shared ones. **[DEVIATION]** All seven MUST use the shared behavior of R-ANX-3 and R-ANX-4.

### R-ANX-7 Padrón grid
The Cliente and Proveedor registers MUST have a `Padrones` tab with the grid columns `ESTADO` (icon), `PADRON`, `F_INICIO`, `F_FIN` and the actions `Activar` and `Desactivar` (placement and labels of the desktop; `Activar` opens `Agregar Padron`).
- The padrón list is a shared read-only lookup `padrones` **[INFERRED]** with `01` EXCEPTUADO, `02` AG. RETENCION, `03` AG. PERCEPCION, `04` BUEN CONTRIBUYENTE (ids from the checkbox mapping of `RegisterClienteNuevo` / `RegisterProveedorNuevo`; the descriptions come from the database and are inferred). Cliente offers `01`, `02`, `03`; Proveedor offers `02`, `03`, `04` (the desktop removes the 4th entry for tipo 2 and the 1st for tipo 1).
- `Activar` opens `Agregar Padron` with `Padron` (select, required: `Seleccione Padron`), `Fecha Inicio` (default today) and the button `Activar`. It MUST be refused with `Padron ya se Encuentra Activado` when the same padrón is already active, and then with `Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion` when activating `01` while `02` or `03` is active, or `Configuracion incompatible, Desactive Exceptuado` when activating `02` / `03` while `01` is active. **[DEVIATION]** the desktop compared `02` twice and never `03` (`getIdPadron().equals("02") || ... equals("02")`); `03` is checked too.
- `Desactivar` MUST require a selected row (`Seleccionar Fila`, title `Padrones`), refuse an already deactivated one (`Padron Seleccionado ya esta desactivado`), confirm `Desea Desactivar Padron?`, and on OK set estado deactivated and fecha fin = today.
- A pending new padrón row MUST be sent as an insert and a deactivation as an update; nothing is persisted before the master submit (R-MD-4). **Applied in W3-15:** the `padron` rule is both an entry rule (it owns the master flags, so a body never writes them) and a child rule hook (`CHILD_RULE_HOOKS.padron`): a body that activates a padrón already active, or `01` over `02` / `03` (or `02` / `03` over `01`), is refused with the 409 `ACTION_NOT_ALLOWED` carrying the desktop sentence, before any write, replaying the ops in sent order; after the write a closed row without fecha fin gets today and the flags are derived from the active rows. A padrón the master does not offer is a 422 on `padrones[n].id_padron`, a blank one `Seleccione Padron`. The offer is filtered by the `padrones` columns `para_proveedor` / `para_cliente` (the select `where`; the seed gains both booleans), so Proveedor offers `02`, `03`, `04` and Cliente `01`, `02`, `03` (the index-based `padrones.remove(0)` / `remove(3)` of the desktop). In the web both buttons are enabled in INSERT and UPDATE (the desktop only disables the activation ones), the dialog confirms with `Aceptar` then the register confirmation (D-W3-7-6), `Activar` runs the incompatibility check inside the dialog (it needs the padrón chosen there) and `Desactivar` asks `Desea Desactivar Padron?` (its title is the action label `Desactivar`, not `Padrones`). [DEVIATION] `Desactivar` on a row nobody has saved yet removes it from the grid instead of keeping a closed pending row (nothing to persist; the desktop sent it as an insert with estado `D`), and unchecks the flag.
- Reactivating a padrón after its deactivation MUST add a new row (history is kept); the desktop computed a date comparison for it and ignored the result.

### R-ANX-8 Padrón flags
The master padrón flags (Cliente: `Exceptuado` (01), `AG. Retencion` (02), `AG. Percepcion` (03); Proveedor: `AG. Retencion` (02), `AG. Percepcion` (03), `Buen Contribuyente` (04)) MUST be read-only checkboxes derived from the active padrón rows and MUST follow each activation and deactivation. **[DEVIATION]** the desktop `RegisterProveedorNuevo` maps `01` to Buen Contribuyente when adding but `04` when removing and sends any other id to AG. Percepcion when adding; the flag is derived by padrón id (`04` -> Buen Contribuyente, `02`, `03` as above). **Applied in W3-15:** the Proveedor checkbox labels are the desktop's (`A Percepcion`, `A Retencion`, `Buen Contribuyente`; the `AG. ...` wording is the padrón description of the catalog), the fields are `flag_percepcion`, `flag_retencion`, `flag_buen_contrib` (booleans, read-only in every mode) and Cliente's `flag_exceptuado` joins them with W3-16.
**Applied in W3-17 (Cliente):** the Cliente takes the same preset (`presets.padron({ master: 'cliente' })`): the flags are shown in the desktop checkbox order `A Percepcion`, `A Retencion`, `Exceptuado` (03, 02, 01) and `Buen Contribuyente` is not a Cliente flag. The 409 `ACTION_NOT_ALLOWED` of the `padron` hook now also carries ONE detail naming the refused row, `padrones[n].id_padron` (`n` the index in the sent array), so the register shows the sentence on that pending row, goes to the `Padrones` tab and keeps its data (S-MD-8); the 409 `message` is unchanged. S-MD-8 on the Cliente is exercised on UPDATE with a stale grid (another session activated `01` after the register loaded): on INSERT the client guard and the server rule are the same pure function, so they cannot disagree; the INSERT half (nothing is stored when the body is refused) is asserted at the service level.

### R-ANX-9 Anexo ids and tipos anexo
An anexo master code MUST be a string zero-padded to 10 characters **[INFERRED]** (the desktop pads typed ids with `"0000000000" + id` to 10 in `buscarVendedor` / `buscarTransportista`). Each master carries its tipo anexo from `tipos-anexo`: Proveedor `1`, Cliente `2`, Transportista `6`, Vendedor `8` (**[INFERRED]** from `txt_Id_TipoAnexo.setText("1" | "8")`, `FormBuscarAnexo(..., "6")` and `FormAnexoPadron(..., 1 | 2, ...)`); the ids of Banco and Trabajador are not in the repository **[INFERRED]** and are stored as seed data. The tipo anexo is a hidden constant, never read from the body. **Applied in W3-7:** the Banco tipo anexo is `3` (not inferred): `PanelTFBanco.cargarTabla` lists `regla.listAnexo("3", ...)` (and `PanelTFChofer` "7", `PanelTFTransportista` "6"); the Trabajador id remains a placeholder: **W3-8** uses `9` (`TIPO_ANEXO.trabajador`, **[INFERRED]**: `mantTrabajador` passes none and `8` is the Vendedor), and Chofer is `7`.

### R-ANX-10 Chofer activation closes the W2b leftover
The `choferes` register (W2) MUST gain the `Activación de Chofer` tab and the Activar / Desactivar actions on the shared grid, with its `modes` unchanged (`[INSERT, UPDATE, DETAIL, CLONE]`). The existing `choferes` seed rows MUST get one `INICIO` activation each, so the W2 suites pass unchanged (S-REF-25..S-REF-29) and S-REF-39 is modified (softcommerce-reference-catalogs).

## Scenarios

**S-ANX-1 initial activation** — Given INSERT of a Banco, Then the activation grid shows one row `INICIO` with today's date and an active icon, `Activar` / `Desactivar` are disabled and `Estado` is checked; after the create, `GET` of the new banco lists exactly that activation.

**S-ANX-2 Activar guards** — Given an UPDATE whose last row is active, When `Activar` is pressed, Then `Trabajador ya Esta Activado` shows and no dialog opens; Given the last row was just deactivated in this register, Then `Trabajador recien lo acaba de Desactivar` shows.

**S-ANX-3 Activar dialog** — Given an UPDATE whose last row is deactivated, When `Activar` opens `Activar Cliente`, Then `Fecha Inicio` is today; When the motivo is blank and `Activar` pressed, Then `Ingrese Motivo` shows and the dialog stays; When motivo `reingreso` is confirmed, Then one pending row shows with motivo `REINGRESO` and `Estado` is checked.

**S-ANX-4 Desactivar guards** — Given no selected row, Then `Seleccione un Registro`; given a deactivated selected row, Then `Registro ya esta Desactivado`; given a row just activated in this register, Then `Cliente recien lo acaba de Activar`.

**S-ANX-5 Desactivar effect** — Given the active row selected, When `Desactivar Proveedor` is confirmed with motivo `CIERRE`, Then the row shows deactivated with fecha fin today and `Estado` is unchecked; cancelling the register persists nothing.

**S-ANX-6 fecha fin rule** — Given an active row starting 2026-03-10, When a fecha fin 2026-03-09 is confirmed, Then `Fecha es menor a fecha inicial` shows and the row is unchanged; 2026-03-10 is accepted; a direct API write with the earlier date answers 422 on `fecha_fin`.

**S-ANX-7 one active row (server)** — Given a master whose last row is active, When a body adds a second active row, Then the answer is 409 with `Banco ya Esta Activado` and the data is unchanged.

**S-ANX-8 Vendedor uses the shared dialogs** — Given the Vendedor register, Then its dialogs read `Activar Vendedor` / `Desactivar Vendedor` and a blank motivo shows `Ingrese Motivo`, not `Debe llenar el motivo de desactivación`.

**S-ANX-9 padrón activation rules** — Given Cliente with padrón `02` active, When `02` is added again, Then `Padron ya se Encuentra Activado`; When `01` is added, Then `Configuracion incompatible, Desactive AG. Percepcion y/o AG. Retencion`; Given only `03` active and `01` added, Then the same message (the `03` case the desktop missed); Given `01` active and `02` added, Then `Configuracion incompatible, Desactive Exceptuado`.

**S-ANX-10 padrón offer by master** — Given Cliente, Then the padrón select offers `01`, `02`, `03`; Given Proveedor, Then `02`, `03`, `04`.

**S-ANX-11 padrón deactivate** — Given a selected active padrón, When `Desactivar` is confirmed in `Desea Desactivar Padron?`, Then the row shows deactivated with fecha fin today and the matching master flag unchecks; a deactivated row shows `Padron Seleccionado ya esta desactivado`; no selection shows `Seleccionar Fila`.

**S-ANX-12 Proveedor flags by id** — Given Proveedor, When padrón `04` is activated, Then `Buen Contribuyente` is checked and `AG. Percepcion` is not; when `04` is deactivated, Then `Buen Contribuyente` unchecks.

**S-ANX-13 padrón reactivation** — Given a deactivated `02` row, When `02` is activated again, Then a new active row is added and the old row stays as history.

**S-ANX-14 estado is derived** — Given a direct `PUT` of a Cliente with `estado` false and no deactivation, Then the stored estado stays active.

**S-ANX-15 Chofer tab** — Given the Chofer register in UPDATE, Then the `Activación de Chofer` tab shows the seeded `INICIO` row, `Activar` / `Desactivar` follow R-ANX-3 / R-ANX-4, and the W2 Chofer scenarios S-REF-25..S-REF-29 pass unchanged.

**S-ANX-16 anexo ids** — Given a created Transportista, Then its code is a 10-character zero-padded string and its tipo anexo is `6`.
