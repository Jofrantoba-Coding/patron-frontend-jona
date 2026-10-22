# Explore — softcommerce-web-migration

> Source: Engram `sdd/softcommerce-web-migration/explore` (obs #565), materialized to OpenSpec by the orchestrator
> because the explore agent had no write tool. Claims spot-checked by the orchestrator (see "Verification").

## Goal

Migrate the Swing GUIs of `desktop_java/softcommerce-desktop` (~400 GUI classes) to a React + `jona-ui` (uijona)
app in `web_ts/softcommerce`, backed by a mock server, following the JONA view layer and the service seam
proven in `web_ts/appjona_codex_react_hooks`. Delivered in waves; wave 1 = foundation + one reference slice.

## Navigation map

- The menu is DB-driven: `view/formularios/MenuBarSystemDinamico.java` builds the `JMenuBar` from
  `RnUsuario.cargaMenuUsuario(idUsuario, "M")` → `List<MenuDinamico>{id_menu, id_menu_padre, menu_item ('N' = submenu), descripcion, nombre}`.
- Hierarchy and labels are NOT in code (no SQL seed found). Only ~190 item keys (`nombre`) map to `Main.showXxx()`
  in `llamarEvento()` (e.g. `mi_localidad → showLocalidad`, `miTipoCambio → showTipoCambio`).
  The mock must seed the tree; grouping is inferred from key families and `Main.show*` titles.
- `Main.java` (~3.5k lines) is an MDI `JFrame` with a `JDesktopPane`. Each `showX` lazily creates one singleton
  internal frame, loads per-form permissions `RnUsuario.cargaFormularioPerfil(userId, "PanelTFX")` → 13 booleans
  (add, modify, eliminate, nullify, clone, details, search, report, export, print, printFast, close, refresh),
  maximizes it, or re-selects it if already open.
- `ToolBarSystemDinamico` = shortcut toolbar. `FormMenuPerfilArbol` / `FormMenuPerfilPermiso` = profile permission tree editor.

## Login flow (`view/ui/uilogin/UiLoginImpl.java`)

1. Select multi-empresa DB (`BdEmpresa`: ip/port/schema).
2. User + password → `RnUsuario.verificaAcceso`. Reject `flaghabilitado == 'D'` (disabled) and `flagEscritorio == 'N'` (no desktop access).
3. Choose empresa + punto de venta, and the period `fechaInicio`/`fechaFin`:
   valid dates, `>= INICIO_ACTIVIDADES`, `fin >= inicio`, same accounting year.
4. Load `BdEmpresaReport` paths and ~40 `BdEmpresaParametro` flags (e.g. `IS_FACTURADOR_SUNAT`, `ISBOTICA`, `DESPACHO_AUTOMATICO`) that change screen behavior.

## Base-class patterns

Counts come from a single-line `extends` regex and are a lower bound (~35% of classes declare `extends` on a second line).

| Pattern | Base | Approx. count | Web template |
|---|---|---|---|
| List frame | `JHInternalFrame` (ControlView, View, RowSelection) | 67 direct + 62 plain `JInternalFrame` (reports/process) | List page: 13-action permission-gated toolbar, filter, sortable table, double-click = details, Excel export |
| Register dialog | `JHDialog` / `CDialog` (~71), `AbstractRegister` (4) | ~75 | Register form with modes INSERT/UPDATE/DELETE/DETAIL/CLONE/ANULAR; `loadCombo → newRegister → loadRegister`; OK → `isRegisterValid` → confirm → `execute*` → refresh parent and reselect row |
| Search/lookup | `Buscar*` (~28), `FormBuscar*` (~10) | ~38 | Lookup dialog returning a selection (`setValueSearch`) |
| Process/detail forms | `Form*` / `Frm*` | ~107 | Case by case |

Estimate: ~85–95 simple catalog CRUDs fit one config-driven template; ~25 complex masters; 100+ process/transaction screens; ~25 reports.

Not screens (exclude from inventory): `shared/util/render/PnlRenderer*`, `view/tablemodel`, `view/conta/tablas`,
combo box models, and base classes `CDialog`, `JHDialog`, `JHInternalFrame`, `AbstractRegister`, `PanelControlView`, `ControlView`, `FrmPanel`, `CTable`.

## Data contracts

- Entities in `model/ora/entity`, accessed through 138 DAOs and 88 `Rn*` rule classes.
- Business logic largely lives in Oracle PL/SQL: `CallableStatement` appears in ~140 model files.
- Example: `Localidad{id_localidad, id_empresa, descripcion, direccion, id_ubigeo, empresa, departamento, provincia, distrito}`.
- Needed early: `Usuario`, `MenuDinamico`, `BdEmpresa`, `BdEmpresaParametro`, `BdEmpresaReport`, `Ubigeo`, `Dto` (id/name lookups).
- Proposed mock API: `POST /auth/login`, `GET /auth/session-options`, `GET /menu`, `GET /forms/{formId}/permissions`,
  `GET|POST|PUT|DELETE /v1/{catalog}[/{id}]`, `GET /v1/ubigeo?parent=`, `GET /v1/empresas`, `GET /v1/params`.
- Mock server template: `web_ts/h2h/mock-server` (zero-dependency Node, in-memory state, JSON seed, `items` + `pagination`,
  error shape `code/message/details/traceId`, `X-Correlation-Id`).

## uijona fit (`jona-ui` 1.3.1)

Available: `JDataTable`, `JTable`, `JPagination`, `JDatePicker`, `JNumberInput`, `JSelectField`, `JCombobox`, `JFormField`,
`JDialog`, `JOptionPane`, `JTabs`, `JDrawer`, `JToast`, `JFileUpload`, `JStepper`, layouts incl. `JSidebarLayout`,
organisms `JNavbar`, `JLogin`, page `JHomeLogin`.

Gaps: tree (permission editor), menubar/cascading menu, MDI workspace (use tabs), 13-action CRUD toolbar, lookup-dialog
composite, grid features (`JDataTable` has only sort, filter, `onRowClick`: no row selection, column hiding, cell edit,
totals), uppercase/masked input, report/print/export viewer, keyboard Enter-navigation, period/date-range picker.

## Reference slice

Login + **Localidad** (`PanelTFLocalidad` + `RegisterLocalidad`): empresa combo, cascading Departamento → Provincia → Distrito
(`RnUbigeo`), required-field validation, uppercase max 100, all modes, permissions. `RnLocalidad`: `listarGeneral`, `listar`,
`insertar`, `modificar`, `eliminar` (logical), `eliminarFisico`. The Java `view/ui/uiregister*` classes are mostly
`UnsupportedOperationException` stubs; real logic is in `RegisterLocalidad`. TipoCambio (date-based) is the second slice.

## Wave plan (800-line PR budget, auto-chained)

| Wave | Scope | Est. |
|---|---|---|
| W1a | Scaffold React+Vite+jona-ui+vitest, mock server, Auth service seam, login | ~700 lines |
| W1b | Shell: menu from `/menu`, permissions, tab workspace | ~600 lines |
| W1c | Config-driven CRUD list + register templates, Localidad slice, Ubigeo/Empresa lookups | ~750 lines |
| W2 | ~90 simple catalogs (~8 per PR) | ~11 PRs |
| W3 | ~25 complex masters (Cliente, Proveedor, Item, Trabajador, Usuario/Perfil + tree, …) | 1–2 PRs each |
| W4 | Ventas / Reparto | ~20 screens |
| W5 | Inventario / Compras / Importar | ~25 screens |
| W6 | Contabilidad / Tesorería / CxC / CxP | ~60 screens |
| W7 | Reportes / Libros / SUNAT-PLE | ~25 screens |

Total ~40–60 PRs. A script-generated inventory (`inventory.csv`, reading sources as ISO-8859-1) should be a W1 task,
because the regex inventory is incomplete.

## Risks

- Menu hierarchy exists only in Oracle → the mock tree is an inference.
- Business rules in PL/SQL and per-empresa flags are invisible in Swing code; the mock only approximates them.
- Jasper reports (~189 usages in 76 files), ticket/boleta/guía printing, SUNAT e-invoicing and PLE books need a decision (e.g. stub PDF/Excel).
- Swing UX is keyboard-driven (Enter navigation, Esc, F-keys).
- uijona gaps require new components; `jona-ui` is published on npm → versioning question (separate PRs).
- Scale (~400 screens) vs 800-line budget → the config-driven CRUD template is mandatory.
- Spanish strings in Java sources are ISO-8859-1.
- No backend contract exists; the mock defines it.

## Verification (orchestrator)

Confirmed on disk: `MenuBarSystemDinamico.java` (calls `cargaMenuUsuario`), `PanelTFLocalidad.java`, `RegisterLocalidad.java`,
`UiLoginImpl.java`; `Main.java` has 188 `public void show*()` methods; `web_ts/uijona/package.json` is `jona-ui` 1.3.1;
~142 Java files reference `CallableStatement`.

Correction: the explore agent stated the codex service seam is committed. It is NOT — `AuthServiceHttp`, `AuthServiceMock`,
`authServiceComposer`, `InterAuthService`, fixtures and specs are untracked/uncommitted in the working tree
(`AuthService.ts` deleted). The working tree is the reference.

Additional skills discovered for later phases (`web_ts/.claude/skills`): `scaffold-jona-inter`, `scaffold-jona-view`,
`scaffold-jona-impl`, `scaffold-jona-entry`; canonical guide `web_ts/.claude/commands/jona.md`.
