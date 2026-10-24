# Spec: softcommerce-lookup-dialog

NEW capability (G10). A reusable, config-driven search-and-pick dialog that replaces the Swing `Buscar*` / `FormBuscar*` pickers, plus the six desktop pickers expressed as configs of it. The mock defines the search contract (softcommerce-mock-api R-MOCK-20).
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise. **[DEVIATION]** = a desktop defect that is FIXED in the web port (the fixed behavior is the spec). **[INFERRED]** = a fact the repository does not hold (stored procedures, runtime data); the spec states the chosen behavior.

## Requirements

### R-LKP-1 Dialog contract
The system MUST provide one modal lookup dialog driven by a config: `title`, source `slug`, `columns`, `filters`, the `pick` button label and an optional host `veto`. It MUST list only active records of the source, let the user narrow them with the filters, and let the user pick exactly one row. The result handed to the host MUST be the full row (not only its id). Cancel (the Cancelar button, Esc, or closing the dialog) MUST hand nothing to the host and MUST NOT change the host form.

### R-LKP-2 Filters
A filter MUST be one of: `text` (case-insensitive contains, with the desktop input rules: `upper` where the desktop uppercases, digits only and a max length where the desktop restricts), or `select` (exact match on the selected id, first option `--- Seleccione ---` = no filter). Filters MUST combine with AND; a blank filter MUST filter nothing. A `select` filter MAY depend on another (SubFamilia by Familia, R-CRUD-12). Every filter change MUST refresh the results from the first page and MUST select the first result row (desktop behavior), and a response for a superseded filter state MUST be ignored.

### R-LKP-3 Server-side search and paging
Search MUST be server-side through the mock search contract (R-MOCK-20): the dialog sends each text filter as the contains parameter of its field (a joined display key where the filter is over a joined name, such as `Transportista` or `Marca`) and each select filter as an exact key, and renders the R-MOCK-3 envelope; a picker with a single free-text box MAY send it as `q`. Results MUST be paged with page controls; **[ASSUMPTION]** the dialog page size is 10. A filter change resets the page to 1. The desktop loaded the whole table and filtered in memory; the paging is the web adaptation.

### R-LKP-4 Pick, keyboard and veto
The pick action MUST be enabled only while a row is selected **[DEVIATION]** (the desktop either did nothing silently or showed inconsistent messages: `Seleccione un Elemento`, `Seleccione un registro de la tabla`). Double-clicking a row and pressing Enter on the selected row MUST pick it. Enter inside a filter MUST move focus to the next filter and, from the last one, to the first result row (or to Cancelar when there are no rows). Esc MUST close the dialog. A host `veto` MAY reject a pick with a message; the dialog MUST then stay open with the message shown and nothing handed over (desktop: `Cliente ya Esta Agregado`).

### R-LKP-5 States and refresh
The dialog MUST show loading, empty and error states (error with retry). The Refrescar action (where the desktop had it: BuscarTrabajador, BuscarParametroProv, BuscarItemConversion, FormBuscarVehiculo, FormAnexo/Socio pickers) MUST clear all filters and reload the first page. A host MAY preset a filter when opening (FormBuscarVehiculo `setRucFiltro`: the transportista RUC) and the preset MUST be shown in its filter and applied to the first load.

### R-LKP-6 Typed-code resolution
A `lookup` field (softcommerce-crud-templates R-CRUD-19) that receives a typed code MUST resolve it before opening the dialog: a code shorter than 10 characters and different from 8 characters is left-padded with zeros to 10 (the desktop `buscarVendedor` / `buscarTransportista` rule for anexo ids; **[INFERRED]** the pad width equals the anexo `codeWidth`, 10, and applies only to lookups over anexo-like masters), then looked up among ACTIVE records; a hit fills the field and its description and the dialog does not open; a miss opens the dialog. Clearing the code (Delete / Backspace) MUST clear its description.

### R-LKP-7 The six pickers
Each picker MUST be a config of R-LKP-1..R-LKP-6; labels are the desktop labels. Filters are `contains` unless noted.

| Picker (desktop class) | Title | Source | Filters (desktop label: input) | Notes |
|---|---|---|---|---|
| BuscarTrabajador | (none; tab title empty) | `trabajadores` | `Código`; `R. Social` over nombre; `RUC/DNI` over dni | **[DEVIATION]** the desktop dialog is a copy of the despacho search and also carries `N° Documento`, `Fecha Inicio`, `Fecha Fin` and `Estado` filters that never applied to a trabajador; they are dropped. Consumers: Usuario trabajador, TrabajadorPuntoVenta trabajador. Pick label `Agregar` |
| PanelCargarTrabajador | `Trabajador` | `trabajadores` | `Nombres` (U, ≤255) over nombre; `DNI` over dni; `Direccion` over direccion | Vendedor only (R-MST-9). Pick `Agregar`, `Cancelar`. **[DEVIATION]** the desktop threw when `Agregar` was pressed with no selection; the pick is disabled without a selection |
| BuscarCliente | (tab `Cliente`) | `clientes` | `Código`; `Desc.` (razón social); `DNI/RUC`; `Clasificación` select over `clasif-clientes`; `Direccion` | Active clientes. The classification option `--- SELECCIONE VENDEDOR ---` of the desktop is a copy-paste defect **[DEVIATION]**: it reads `--- Seleccione ---`. No W3 consumer (W4 sales) |
| FormClienteBuscar | `Buscar Cliente` | `clientes` | `Codigo`; `Desc.`; `RUC/DNI` | Active clientes only. Consumer: Cliente sustitutos (R-MST-12); the host veto rejects a cliente already in the grid with `Cliente ya Esta Agregado`; also rejects the cliente being edited **[ASSUMPTION]** |
| FormBuscarVehiculo | `Buscar Vehiculo` | `vehiculos` | `Codigo`; `Transportista`; `Marca` select over `marcas-vehiculo`; `RUC/DNI`; `Constancia Inscr`; `Placa`; `Modelo` select over `modelos-vehiculo` | Active vehiculos. Pick by `Agregar` or double-click. No W3 consumer (W4 dispatch: RegisterGuiaRemision, RegisterProgReparto) |
| BuscarParametroProv | (none) | `parametros-prov` | `Código` (digits, ≤10); `Descripción` (U, ≤255) | Lists active parametros of tipo `C` with flag `S` (`listarParametroProv("", "C", "", "S", "", "", "A")`). **[INFERRED]** the meaning of tipo `C` and of the flag column is not in the repository; the stub lookup (R-MOCK-25) carries it as data. The pick returns the value of a host-chosen column (`indiceTabla`). No W3 consumer (W4 RegisterNotaDebito) |
| BuscarItemConversion | (none) | `items` | `Código` (digits, ≤6); `Código Alt.` (digits, ≤6); `Desc.` (U, ≤255); `Familia` select; `SubFamilia` select ← Familia; `Marca` select | Active items. Extra inputs on the dialog: `VALOR DE CONVERSION` (decimal, default `0.0`), `VALOR DE PAQUETE` (decimal, default `0.0`), `VALOR DE ORIGEN` (decimal, default `1.0`); a blank one returns to its default on blur and Refrescar resets all three. Consumer: the Item `Conversion a Item` tab, which is deferred (R-MST-15); the dialog is built and tested with a harness host |

### R-LKP-8 First consumers and replacement parity
BuscarTrabajador MUST be delivered with its first consumer, the TrabajadorPuntoVenta `id_trabajador` field, which MUST change from a `select` over the read-only lookup to a `lookup` field; the W2 `trabajador-punto-venta` rules (required, unique (trabajador, punto de venta) message, ref validation, S-REF-21) MUST keep their meaning, with the documented W2-test exception of R-MST-18 (UI field helpers only, assertions unchanged). The `usuarios` and `trabajadores` lookup slugs, row shape (`{ id_usuario, usuario, nombre }`, `{ id_trabajador, nombre }`) and the `/v1/lookups/{slug}` behavior MUST stay as in W2, so UsuarioCorrelativo and every other W2 consumer is unchanged (R-REF-11 as modified).

## Scenarios

**S-LKP-1 open and pick** — Given the BuscarTrabajador config over three active trabajadores, When the dialog opens, Then three rows load and none is picked; When a row is selected and `Agregar` pressed, Then the host receives the full row and the dialog closes.

**S-LKP-2 cancel changes nothing** — Given a host field holding trabajador `001`, When the dialog is opened and closed by Esc, by `Cancelar` and by the close box, Then the host value is still `001` and no callback ran.

**S-LKP-3 text filter and first row** — Given rows `JUAN PEREZ`, `MARIA GARCIA`, When `ma` is typed in `R. Social`, Then only `MARIA GARCIA` shows and it is selected; clearing the filter restores both.

**S-LKP-4 filters combine** — Given BuscarItemConversion with a `Familia` and a `Marca` selected, Then only rows matching both show; Given a `SubFamilia` filter, Then it is disabled and empty until a Familia is chosen, and changing the Familia clears and reloads it.

**S-LKP-5 stale response ignored** — Given two filter changes where the first response arrives last, Then the rows shown are those of the latest filter state.

**S-LKP-6 paging** — Given 25 active rows and page size 10, Then page 1 shows 10, page 3 shows 5; When a filter changes while on page 3, Then page 1 of the new result shows.

**S-LKP-7 pick disabled without selection** — Given no selected row, Then `Agregar` is disabled and nothing is handed over; the desktop exception on PanelCargarTrabajador does not occur.

**S-LKP-8 double-click and Enter** — Given a selected row, When it is double-clicked or Enter is pressed on it, Then it is picked once.

**S-LKP-9 host veto** — Given FormClienteBuscar opened by a Cliente whose sustitutos already hold cliente 7, When cliente 7 is picked, Then `Cliente ya Esta Agregado` shows, the dialog stays open and the host grid is unchanged.

**S-LKP-10 typed code resolves** — Given a lookup over transportistas and the active transportista `0000000042`, When `42` is typed and focus leaves, Then the field shows `0000000042` and its razón social and the dialog does not open; Given `99` (no such active transportista), Then the dialog opens; Given an inactive `0000000043`, Then the dialog opens (inactive records never resolve).

**S-LKP-11 clear code** — Given a resolved lookup, When the code is cleared with Backspace, Then its description clears too.

**S-LKP-12 states** — Given a pending request, Then loading shows; Given no rows, Then an empty message; Given a failed request, Then an error with retry; Refrescar after typing filters clears them and reloads page 1.

**S-LKP-13 conversion defaults** — Given BuscarItemConversion, Then the three inputs open at `0.0`, `0.0`, `1.0`; clearing `VALOR DE ORIGEN` and leaving it shows `1.0`; clearing `VALOR DE CONVERSION` shows `0.0`.

**S-LKP-14 vehiculo RUC preset** — Given FormBuscarVehiculo opened with the preset RUC `20123456789`, Then the `RUC/DNI` filter shows it and only that transportista's vehiculos load.

**S-LKP-15 inactive never listed** — Given an inactive trabajador, Then BuscarTrabajador never lists it.

**S-LKP-16 replacement parity** — Given the W2 suites for UsuarioCorrelativo and TrabajadorPuntoVenta, When the trabajador field becomes a lookup, Then S-REF-17 and S-REF-21 keep their meaning and assertions (documented W2-test exception, R-MST-18: only the field helpers of `src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx` change) and `GET /v1/lookups/trabajadores` returns the W2 shape.
