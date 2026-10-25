# SoftCommerce web: UX/UI and interaction-design audit and plan

Scope: `web_ts/softcommerce` (React 18 + react-router 6.30.6, jona-ui pinned `1.5.1`) and `web_ts/uijona` (jona-ui source, v1.5.1).
Mode: read-only. Every claim below has a file:line reference. Paths are relative to `web_ts/softcommerce` unless they start with `uijona/` (`web_ts/uijona`) or `openspec/` (repo root).

---

## 0. Executive summary

The app follows the JONA layering correctly. What the owner sees comes from four structural gaps:

1. **No product chrome.** There is no app frame. The header is a `<dl>` of key/value pairs with inline styles (`src/views/uishell/ShellHeaderView.tsx:24-39`). Pages have no visible title. The list title exists only as an `aria-label` (`src/views/uicrudlist/UiCrudListView.tsx:13`). There is no breadcrumb, no brand and no user menu.
2. **No feedback channel.** There are zero toasts in the app (no `ToastProvider` or `useToast` anywhere in `src/`). A successful save closes the dialog and refreshes the list silently (`src/views/uicrudregister/UiCrudRegisterImpl.ts:164-165`, `src/views/uicrudlist/UiCrudList.tsx:74`). Every message, including success, is a blocking modal: 19 `GuardedOptionPane` usages.
3. **No visible selection and no keyboard grid.** `CrudGrid` marks the selected row with `aria-selected` (`src/shared/ui/CrudGrid/CrudGrid.tsx:31`). jona-ui only styles `data-[state=selected]` (`uijona/src/molecules/JTable/JTableView.tsx:278`). The selected row looks the same as every other row, yet Modificar/Eliminar become enabled. Rows react only to mouse click and double click (`CrudGrid.tsx:33-34`).
4. **Styling that silently does nothing.** The lib CSS is compiled only from the lib's own source (`uijona/tailwind.config.js:3`). softcommerce has no Tailwind, so 9 app classes are no-ops (§4.1). There are also 34 inline `style={{}}` blocks in 21 files, and the touch-floor string `min-h-11 sm:min-h-9` is copied 36 times.

### Verification of the briefed bugs (I checked each one)

| Briefed bug | Verdict | Evidence |
|---|---|---|
| Context step sends the user back to `/login` | **Confirmed. Likely root cause found.** | `startSession` clears `pending` (`src/session/sessionStore.ts:58-61`). The guard effect `if (!hasPending) navigate('/login', {replace:true})` (`src/views/uicontexto/UiContextoImpl.ts:36-38`) then fires before `navigate('/')` (`:109`) commits. That `navigate('/')` runs inside a transition because `BrowserRouter future={{ v7_startTransition: true }}` (`src/main.tsx:21`), while the session store update is a sync `useSyncExternalStore` render. `App.spec.tsx:10-18` uses `MemoryRouter` **without** the future flag, so the test passes and the production path fails. Fix: guard on `!pending && !session`, and render the tests with the same future flags. A second problem: `/login` never redirects a user who already has a session (`src/App.tsx:16`). |
| Desktop sidebar invisible because the `lg:` classes are missing from the lib CSS | **The stated cause is not what the CSS shows.** | The shipped `node_modules/jona-ui/dist/index.css` (1.5.1) **does** contain `.lg\:static`, `.lg\:z-auto`, `.lg\:translate-x-0`, `.lg\:hidden` and `.lg\:flex` (media block at byte offset about 75690). A real cascade defect does exist: inside `@media (min-width:1024px)`, `.jpanel[data-jpanel-desktop-layout=box]{display:flex}` has specificity 0,2,0 and beats `.lg\:hidden{display:none}` at 0,1,0. So any `JPanel` with `lg:hidden` stays visible on desktop. That includes the JSidebarLayout hamburger bar (`uijona/src/layouts/JSidebarLayout/JSidebarLayoutView.tsx:181-185`). **Check the sidebar in a real browser before shipping the separate fix.** The missing-class problem is real, but it affects app classes (§4.1), not these. |
| Date fields use an ISO mask instead of dd/MM/yyyy | **Confirmed.** | `UiContextoView.tsx:64-65` uses `JDatePicker` without `mask`, and the lib default is `'yyyy-MM-dd'` (`uijona/src/molecules/JDatePicker/InterJDatePicker.ts:26`). The register date fields use `DATE_MASK = 'dd/MM/yyyy'` (`src/shared/ui/DateField/InterDateField.ts:22`). The lib already offers `valueFormat: 'iso'` (`InterJDatePicker.ts:17`), so the fix is mask `dd/MM/yyyy` plus an ISO value. |
| Silent submit | **Confirmed** (see item 2 above). | |

---

## 1. Screen inventory

### 1.1 Route map and flow

```
/login (UiLogin) --Ingresar ok--> /contexto (UiContexto) --Confirmar--> / (RequireSession > ShellHeader + UiShell)
   ^  ^                                |  (reload: pending lost -> /login, UiContextoImpl.ts:36)          |
   |  +--------- logout (no confirm) --+---------------------------------------------------------------+
   +-- * (any unknown path) -> / -> RequireSession -> /login   (App.tsx:29, RequireSession.tsx:8)
```

Shell: a sidebar `MenuTree` from `GET /menu` (`mock-server/data/menu.json`). That file has 54 items: `Maestros > Generales` holds **49 leaves in one flat group**, and `Ventas` holds 1 leaf. Opening a leaf creates a workspace tab, whose body is `FormHost` (permissions), which renders a form from `formRegistry`.

### 1.2 Form registry (`src/views/uishell/formRegistry.ts:15-21`)

There are 51 menu leaves. 47 generic registry forms, plus `mi_localidad` (compat) and the 2 custom screens, make 50 working forms. 2 leaves are not registered.

| Group | Form ids (menu `nombre`) | Unit | Register |
|---|---|---|---|
| Reference catalogs (simple) | miTipoCambio, miAduana, miColor, miEstadoDocumento, miLaboratorioClinico, miMarca, miNacionalidad, miMotivoTraslado, miClasifCliente, miTamano, miTipoAnexo, miTipoDescuento, miClasifInventario, miCondicionPago, miTipoTrabajador, miMarcaVehiculo, miTurno, miMotivoDescuento, miMotivoNotaCredito, miTipoTrabajadorPerfil, miFamilia, miModeloVehiculo, miSubFamilia, miPromocion, mi_puntoventa, mi_almacen, miZona, PanelTFCorrelativo, PnlUbicacion, miTipoMovInventario, miUnidadMedida, miVehiculo, mi_usuariocorrelativo, miZonaDistancia, miTrabajadorPuntoVenta | `UiCatalog` → `UiCrudList` | `UiCrudRegister` (dialog) |
| Single record | mi_principal (Empresa: modes UPDATE, DETAIL only) | same | same |
| Masters with children / lookups / row actions | miCliente, miProveedor (modes INSERT and UPDATE only), miBancoAnexo, PanelTFChofer, PanelTFSocio, miTrabajador, miVendedor, miTransportista, miProducto (Item, `generalTab: 'Datos de Item'`), mi_usuario (list action `autorizar-series`) | `UiCatalog` → `UiCrudList` | `UiMasterRegister` (tabbed dialog with child grids, inline entry, picker child, row actions) |
| Legacy | mi_localidad | `UiLocalidad` → `UiCrudList` | `UiCrudRegister` |
| Custom | mi_SeguridadPerfil | `UiSeguridadPerfil` | + `PermisosDialog` |
| Custom | miAccionSocio | `UiSocioAcciones` | + `SocioDialog`, `PrecioDialog` |
| List panel | Usuario → Autorizar Series | `UiAutorizarSeries` (dialog) | + `ActivarSerieDialog` |
| **Not registered** | `demo_stub` ("Formulario de Demostracion"), `miVentas` ("Registro de Ventas") | modal notice "Esta opción aún no está disponible." (`UiShellImpl.ts:37`) | - |

### 1.3 Per-screen findings

Each card below lists layout, flow, states and defects. Severity: **P0** breaks the flow, **P1** reads as unfinished, **P2** polish.

#### A. Login: `/login` (`src/views/uilogin/*`)
- **Layout:** a bare `<form>` with inline style `{display:grid, gap:12, maxWidth:380, margin:'4rem auto'}` (`UiLoginView.tsx:28`). It has no brand, no surface or card, and the page background is the default browser white.
- **Flow:** load tenants, then pick tenant, user and password, then Enter or Ingresar, then `/contexto` (`UiLoginImpl.ts:66-71`).
- **States:** the tenant placeholder shows "Cargando..." (`:44`). Errors use `JAlert` plus the trace id. The submit button shows `loading`.
- **Defects:**
  - P1: `<h1>{title}</h1>` has no class (`:34`). Tailwind preflight (`uijona/src/styles/index.css:14`, `@tailwind base`) resets heading size, so the title renders as body text and there is no visual hierarchy.
  - P1: no initial focus (no `autoFocus` anywhere in `src/`).
  - P1: if the tenant list fails, the failure shows as `submitError` and leaves a disabled select with no retry (`UiLoginImpl.ts:43`).
  - P2: no show-password or Caps Lock hint. `JFormField` already has `onEnterPress` and `required`, but neither the required marker nor the `required` prop is used.
  - P1: a user with a session who visits `/login` sees the form again (`App.tsx:16`).

#### B. Context step: `/contexto` (`src/views/uicontexto/*`)
- **Layout:** the same bare form (`UiContextoView.tsx:31`), and the same unstyled `<h1>` (`:37`).
- **Flow:** empresa, then puntos de venta, then dates, then Confirmar (which loads params, validates the period, takes the grants snapshot and creates the session; `UiContextoImpl.ts:78-115`).
- **Defects:**
  - **P0:** the redirect to `/login` (see §0).
  - P1: the two date pickers have **no label**, only a placeholder (`:64-65`). The tests query them by placeholder (`UiContexto.spec.tsx:56-57`, `App.spec.tsx:45-46`).
  - P1: the period error is a loose `<small role="alert">` that is not linked to either field (`:66`).
  - P1: the screen does not say who logged in or on which database. There is no "change user" or back link, so the only way back is a reload, which bounces to login.
  - P1: punto-de-venta loading has no loading state (`UiContextoImpl.ts:54-65`, no flag), and a failure there lands in the generic `submitError`.
  - P2: no default period. The user types 16 digits every login. Prefilling 1 Jan to today of the current year is an [ASSUMPTION] that needs owner approval.
  - P2: no step indicator for the 2-step flow.

#### C. Shell: `/` (`App.tsx:18-27`, `src/views/uishell/*`)
- **Layout:**
  - An app-level inline flex column (`App.tsx:22`).
  - `ShellHeader` as `<header>` holding a `<dl>` with 4 key/value pairs and a hard-coded `#e5e5e5` border (`ShellHeaderView.tsx:25-31`).
  - `JSidebarLayout` with `collapsible={false}` (`UiShellView.tsx:62`).
  - Workspace tabs from `JTabs` plus loose `×` buttons (`:66-80`).
- **States:**
  - Menu loading is a plain `<p style={{padding:12}}>` (`:44`).
  - Menu error is an alert plus Reintentar (`:45-55`).
  - The empty workspace is a bare `<p>` (`:64`).
  - Form permissions loading is a plain `<p>Cargando permisos...</p>` (`FormHost.tsx:35`).
- **Defects:**
  - P1: no brand or app name. The header is a debug-style `<dl>`, and `Usuario:` is rendered with a colon inside `<dt>` (`ShellHeaderView.tsx:30`).
  - P1: logout fires instantly, with no confirmation and no dirty check (`ShellHeaderImpl.ts:18`). Unsaved work in any tab is lost.
  - P1: closing a tab never checks for unsaved changes (`UiShellImpl.ts:49`).
  - P1: the close `<button>` sits **inside** the `tablist` (`UiShellView.tsx:67-80`), which is invalid ARIA: a tablist should own only tabs. It is also unstyled except for touch floors.
  - P1: no tab overflow strategy. Tabs wrap or scroll with no "more" menu.
  - P1: focus does not move into a newly opened tab, and the active menu leaf has no highlight.
  - P1: an unknown leaf opens a **modal** to say "not available" (`:91-100`). It should be a badge in the menu or a toast.
  - P2: the hamburger bar shows on desktop (lib cascade defect, §0).

#### D. Menu tree (`src/shared/ui/MenuTree/*`)
- **Layout:** nested `<ul role="tree">`. Each node is a full-width ghost `JButton` with inline `paddingLeft` (`MenuTreeView.tsx:10-27`).
- **Defects:**
  - P1: 49 leaves in one group and no search or filter. Finding "Cliente" means scrolling.
  - P1: `role="treeitem"` sits on an `<li>` that contains a focusable `<button>`, with no roving tabindex, no arrow keys, no `aria-level` and no type-ahead. That is not a working ARIA tree.
  - P2: no expand/collapse chevron and no icons.
  - P2: unregistered leaves look like working ones.

#### E. Generic list (`UiCatalog` → `UiCrudList`, `src/views/uicrudlist/*`, `src/shared/ui/CrudToolbar/*`, `src/shared/ui/CrudGrid/*`)
- **Layout:** `<section style={{display:grid,gap:12}}>` (`UiCrudListView.tsx:13`), then the toolbar (8 equal-weight outline buttons, `CrudToolbarView.tsx:20`), then an optional second toolbar for list actions (`:22-30`), then a filter `JTextBox` with only an `aria-label` (`:34`), then the grid and `JPagination` (`CrudGrid.tsx:44`).
- **States:**
  - Loading is a `<p>Cargando...</p>` that **replaces** the grid (`:35`), so the layout jumps on every refresh and after every save.
  - Error is an alert with Reintentar (`:36-44`).
  - Empty is a bare `<p>No hay registros.</p>` (`:46`).
  - Truncated is a warning alert (`:45`).
- **Defects:**
  - **P0:** the selected row is not visible (§0 item 3).
  - **P0:** keyboard users cannot select or open a row. The only handlers are `onClick` and `onDoubleClick` (`CrudGrid.tsx:33-34`). `aria-selected` on a `<tr>` outside `role="grid"` is also invalid.
  - P1: no visible page title and no record count (`matchCount` is computed but never shown).
  - P1: **"Buscar" is a dead button.** `search` is in `DEFAULT_ACTIONS` (`src/domain/crud/toolbarGate.ts:7`) and is enabled when permitted, but `ACTION_MODES` has no entry for it (`UiCrudList.tsx:36-42`), so clicking it does nothing. "Exportar" shows disabled with "No disponible" (`toolbarGate.ts:13`).
  - P1: double click does nothing on catalogs without DETAIL, such as miCliente and miProveedor (`UiCrudList.tsx:56`).
  - P1: all toolbar actions look alike. No primary "Agregar", no icons, no grouping, and the tooltip is a native `title` on a wrapping `<span>` because `JButton` has no typed aria or title passthrough (`CrudToolbarView.tsx:13-18`).
  - P1: a list action pressed with no row selected opens a **modal** "Aviso" (`UiCrudListView.tsx:31-33`). The spec requires this (`openspec/specs/softcommerce-user-permissions/spec.md:32`), but the button could be shown as needing a selection.
  - P1: no success feedback after register execute (§0 item 2), and focus is not returned to the grid row.
  - P2: the filter has no search icon, no clear button and no placeholder.

#### F. Generic register (`src/views/uicrudregister/*`)
- **Layout:** a `JDialog` (default `md`) titled `"{Modo}: {Catálogo}"` (`UiCrudRegisterView.tsx:28`). The body is a single-column `display:grid gap 12` (`:45`). Fields are `<label style={{display:grid,gap:4}}><span>` (repeated at `:60-62, :112-126, :216-227` and in every shared field view). Each error is a `<small role="alert">` under its field (`:88, :108, :127, :143, :156, :181, :198, :212, :228, :245`).
- **Flow:** load (lookups, record, select options, children), then edit, then Aceptar, then validate, then confirm ("¿Desea continuar con esta operación?" with Confirmar / No), then execute, then close and refresh (`UiCrudRegisterImpl.ts:154-176, 267-282`).
- **Defects:**
  - P1: the title names the catalog but not the record ("Modificar: Cliente" instead of "Modificar cliente 000123 · ACME SAC").
  - P1: one column whatever the field count, so long masters scroll a lot.
  - P1: no required markers, and errors are not linked with `aria-describedby`. Several `role="alert"` regions announce together on a blocked submit.
  - P1: every mode uses the same confirm text. In DELETE the primary button is a neutral "Aceptar" (`:35-39`), and only the second pane is `danger` (`:265`).
  - P1: no success toast.
  - P2: Cancelar comes before Aceptar with no visual weight difference. A DETAIL dialog has no route to "Modificar".
  - P2: a "Cargando..." `<p>` instead of a form skeleton (`:46`).

#### G. Master register (`src/views/uimasterregister/*`, `src/shared/ui/ChildGrid/*`)
- **Layout:** a `JTabs` trigger list, then panels that stay mounted and `hidden` (a workaround for `JTabsContent` unmounting inactive panels, `UiMasterRegisterView.tsx:16-36`). The child grid has a toolbar of Agregar, Quitar and row actions (`ChildGrid.tsx:12-28`).
- **Defects:**
  - P1: a tab gives no error indication. A failed submit switches tabs (`UiMasterRegisterImpl.ts:72,80`), but the tab trigger has no badge or count.
  - P1: child dialogs stack a second modal over the master (`UiMasterRegisterView.tsx:43-45`).
  - P1: Quitar and row-action confirms use the `info` variant (`:48`), not `danger`.
  - P1: row errors render as a list of alerts **above** the grid with text `"{firstColumn}: msg"` (`ChildGrid.tsx:29-31`) instead of on the row.
  - P2: the state column uses glyphs `●`/`○` (`:47-49`). Pending and changed rows (`_changed`, `~` keys) are not visually distinguished.
  - P2: the inline entry has a hard-coded "Agregar" label (`InlineEntry.tsx:18-20`).

#### H. Lookups (`src/shared/ui/LookupField/*`, `src/shared/ui/LookupDialog/*`)
- **Layout:** code box, description box, then `…` and `×` buttons, laid out with `grid gap-2 sm:grid-cols-[10rem_1fr_auto_auto] sm:items-end` (`LookupFieldView.tsx:11`).
- **Defects:**
  - **P1: neither `sm:grid-cols-[10rem_1fr_auto_auto]` nor `sm:items-end` is in the lib CSS**, so on desktop the 4 parts stack vertically.
  - P1: the buttons are glyph-only (`…`, `×`). They do have `aria-label` (`:19-20`) through an untyped spread.
  - P1: a miss on blur auto-opens the dialog (`LookupFieldImpl.ts:45-47`). That keeps desktop parity but needs an explanation, such as a field hint.
  - P1 (dialog): the footer order is Refrescar / pick / Cancelar (`LookupDialogView.tsx:13-15`). The results wrapper is a `tabIndex=0 role="group"` that handles only Enter (`:64`), with no arrow-key row navigation.
  - P1 (dialog): the same invisible-selection defect as the list.

#### I. Seguridad - Perfil (`src/views/uiseguridadperfil/*`)
- **Layout:** two columns at `lg` (`UiSeguridadPerfilView.tsx:38`). The left column has filters, a listbox of perfiles and the buttons "Perfil" and "Permisos de Formulario". The right column has the tree title, a checkbox tree, Guardar and Permisos.
- **Defects:**
  - P1: `max-h-80`, `max-h-96`, `content-start`, `list-none` and `m-0` are **not in the lib CSS** (`:17, :39, :48, :67, :69`). The scroll containers never cap, so a long perfil list or menu tree pushes the page. Preflight resets `ul` margins, so `m-0` and `list-none` do no harm.
  - P1: the tree node is a clickable `<div>` with no role or keyboard (`:20-24`). Every level is always expanded.
  - P1: the listbox options are mouse-only (`:48-61`).
  - P1: the "Perfil" button label means "load tree for this perfil" (`InterUiSeguridadPerfil.ts:77`) and is unclear.
  - P1: success ("Permisos actualizados correctamente") is a modal (`UiSeguridadPerfilImpl.ts:96`).
  - P2 (PermisosDialog): no Cancel button in the footer (`PermisosDialogView.tsx:27-31`), and the accordion title shows the raw `formId` (`:40`).

#### J. Acciones de Socio (`src/views/uisocioacciones/*`)
- **Layout:** the tab body shows a launcher button and hint (`UiSocioAccionesView.tsx:49-50`) that opens an `xl` modal with tabs Socios and Precio. Inside that, `SocioDialog` and `PrecioDialog` stack on top.
- **Defects:**
  - P1: a workspace tab whose content is a button that opens a modal is double framing. The spec mandates this (`openspec/specs/softcommerce-masters/spec.md:117`), so changing it needs a spec delta.
  - P1: "Desactivar" on Socios is a dead button (`UiSocioAccionesImpl.ts:197`). That is desktop parity per the spec, but it should render disabled with an explanatory tooltip.
  - P1: `justify-self-start` and `sm:grid-cols-3` are not in the lib CSS (`UiSocioAccionesView.tsx:49`, `SocioDialogView.tsx:32`).
  - P2: raw uppercase headers (`ESTADO`, `F_INICIO`; `UiSocioAccionesView.tsx:14-31`) are spec'd desktop names. Styling can soften them.

#### K. Autorizar Series panel (`src/views/uiautorizarseries/*`)
- **Layout:** an `lg` `JDialog` with no footer (`UiAutorizarSeriesView.tsx:23`). The toolbar mixes buttons with label/value spans (`:25-32`).
- **Defects:**
  - P1: Desactivar runs immediately with no confirmation (`UiAutorizarSeriesImpl.ts:51-61`). The spec does not ask for one (`openspec/specs/softcommerce-user-permissions/spec.md:34`), so adding one is a DEVIATION delta.
  - P1: the result message is a modal "Mensaje".
  - P2: the context (Trabajador/Usuario) should be a header row, not part of the toolbar.

### 1.4 Cross-cutting defects (all screens)

| # | Defect | Evidence |
|---|---|---|
| X1 | 34 inline `style={{}}` blocks in 21 non-test files, and a hard-coded color | `rg "style=\{\{" src` ; `ShellHeaderView.tsx:25` |
| X2 | Touch-floor class `min-h-11 sm:min-h-9` copied 36 times (belongs in a JButton or field density prop) | `rg "min-h-11 sm:min-h-9" src` |
| X3 | No toasts at all, and 19 blocking notice panes | §0 |
| X4 | No focus management across navigation: no initial focus, no focus on tab open, no focus restore after register close | only `focus()` calls: `UiCrudRegisterImpl.ts:145,278`, `LookupDialogImpl.ts:103` |
| X5 | Field errors are not linked by `aria-describedby`, and there is no required marker | `UiCrudRegisterView.tsx` field blocks |
| X6 | Loading states are text that replaces content, so layout jumps; no skeletons (lib has `JSkeleton`/`JSkeletonPresets`) | `UiCrudListView.tsx:35`, `FormHost.tsx:35`, `UiCrudRegisterView.tsx:46` |
| X7 | No dark mode for components. Only chart tokens switch theme. | `uijona/src/theme/tokens.css:149-187` |
| X8 | `package.json` `"sideEffects": false` in jona-ui. A strict bundler can drop `import 'jona-ui/index.css'`. | `uijona/package.json:7` |

---

## 2. Cross-screen interaction design

### 2.1 Navigation model (desktop ERP metaphor, web-native)

```
+-------------------------------------------------------------------------------+
| [≡] SoftCommerce   [Buscar opción… Ctrl+K]      Empresa · PV · 01/01–31/12  (JT)▾|  <- topbar 48px
+-----------+-------------------------------------------------------------------+
| [buscar]  | [Cliente ●][Marca][Usuario ×] [⋯]                                   |  <- workspace tabs 40px
| ★ Recientes| Maestros / Generales / Cliente                                     |  <- breadcrumb
| ▾ Maestros|  Cliente  (134)                         [Buscar en la lista… ×]    |  <- page header
|  ▾ Generales| [+ Agregar] | Modificar Eliminar Clonar Detalle | ⟳ | ⋯           |  <- toolbar
|    Cliente |  ┌ table (sticky header, selectable rows) ───────────────────┐    |
|    Marca   |  └───────────────────────────────────────────────────────────┘    |
| ▸ Ventas   |  1–20 de 134                                   ‹ 1 2 3 … 7 ›       |
+-----------+-------------------------------------------------------------------+
```

- **Sidebar (`JTreeNav`):**
  - A filter box filters leaves by `descripcion` and auto-expands the matching branches.
  - A "Recientes" group holds the last 5 opened forms (sessionStorage per user).
  - The active leaf is highlighted when its tab is active.
  - An unregistered leaf shows a muted "Próximamente" badge and is `aria-disabled`.
  - Collapses to a 56px rail at `lg` and becomes a drawer below `lg`.
- **Workspace tabs (`JWorkspaceTabs`):** one tab per form (R-SHELL-4 unchanged), with:
  - a close button **outside** the tab element (sibling inside a tab-chip wrapper, or `aria-controls` with `role="button"`), plus middle-click close;
  - a dirty dot `●` when the form reports unsaved changes;
  - an overflow menu `⋯` listing every tab;
  - a context menu: Cerrar, Cerrar otras, Cerrar todas.
- **Breadcrumb** (`JBreadcrumb`, exists): built from the menu path of the active tab. Read-only, with clickable ancestors that expand the tree.
- **Focus:**
  - When a tab opens, focus moves to the page heading (`tabIndex=-1`).
  - When a tab closes, focus moves to the newly active tab.
  - When a dialog closes, focus returns to the invoker or the reselected grid row.

### 2.2 Dirty-form guards (new shell contract)

- Add a `WorkspaceDirtyContext` provided by `UiShell`. `FormHost` injects `useReportDirty(formId)`. `UiCrudRegisterImpl` already computes `dirty` (`UiCrudRegisterImpl.ts:150`) and reports it while its dialog is open. `UiSocioAcciones` and `UiSeguridadPerfil` report their pending edits.
- Guards:
  - **Close tab** with a dirty form shows a `danger` confirm: "Cliente tiene cambios sin guardar. ¿Cerrar y descartar?" with [Seguir editando] [Descartar y cerrar].
  - **Logout** with any dirty tab shows the same confirm, listing the tabs.
  - **Browser unload** uses `beforeunload` only while something is dirty.
- `workspaceReducer` (`src/domain/workspace.ts:24-41`) gains a `requestClose` path. The Impl decides; the reducer stays pure.

### 2.3 List and register round trip

1. List: a row is selected (visible highlight, `aria-selected` inside `role="grid"`). Enter opens DETAIL, or UPDATE when DETAIL is not supported and `modify` is allowed. That fixes the dead double click on miCliente.
2. The register dialog opens with initial focus on the first editable field. In DETAIL mode, focus goes to the Cerrar button.
3. Submit, then the confirm (variant per mode, below), then execute:
   - **Success:** the dialog closes, a toast says "Cliente 000123 creado/actualizado/eliminado", the list refreshes **without** blanking (the grid keeps its rows with a top progress bar or skeleton overlay), the row is reselected (existing `refresh({select})`, `UiCrudListImpl.ts:55-73`), and focus returns to that row.
   - **Failure:** the dialog stays open, a form-level `JAlert` appears at the top, and field errors are inline (R-CRUD-7 unchanged).
4. Confirm copy per mode:

   | Mode | Title | Body | Confirm button |
   |---|---|---|---|
   | INSERT | Nuevo cliente | ¿Guardar el nuevo registro? | Guardar (primary) |
   | UPDATE | Modificar cliente | ¿Guardar los cambios? | Guardar (primary) |
   | CLONE | Clonar cliente | ¿Crear la copia? | Crear (primary) |
   | DELETE | Eliminar cliente | "Se eliminará **000123 · ACME SAC**." | Eliminar (destructive) |

   The current single message is `InterUiCrudRegister.ts:73`. Keep the button **accessible names** "Aceptar" and "Confirmar" if test churn must be avoided (§5.3). The strategy is to change the visible text through a label prop and keep the names in a test-stable layer, or to accept a bulk spec update.

### 2.4 Lookups and pickers
- A field group: `[code ▢▢▢▢][description (read-only, muted)][🔍][✕]`, as one `JInputGroup` with a correct grid that ships in the lib CSS.
- Keyboard: F2 or Alt+↓ in the code box opens the picker. Enter on a typed code resolves it, as on blur today.
- Picker dialog layout: filters in a responsive grid, then results as a `JDataGrid` with a selectable row (↑↓, Enter picks, double click picks), then a footer with [Cancelar] (left, ghost) and [Seleccionar] (right, primary). Refrescar becomes an icon button in the results header. The veto message shows inline above the results (already done, `LookupDialogView.tsx:54`).

### 2.5 Feedback taxonomy

| Situation | Channel | Today | Spec impact |
|---|---|---|---|
| Success of a save/delete/action | Toast (success, 4s, `aria-live=polite`) | silent, or a modal "Mensaje" | delta needed where a spec names the modal (Seguridad Perfil `SAVED`, Socio Acciones, Autorizar Series server messages) |
| Validation (field) | Inline under the field plus a top summary on submit | inline `<small role=alert>` | none |
| Server error | Inline form alert (dialog) or toast (background action) with trace id in "Detalles" | alert | none |
| Refusal guard mandated by desktop text ("Seleccione un registro de la tabla", title "Aviso") | Keep the modal (spec) **and** pre-empt it by showing the needed selection in the button tooltip | modal | none |
| Destructive action | `danger` confirm with a record summary | mixed info/danger | Autorizar Series Desactivar needs a DEVIATION delta |
| Unavailable feature | Menu badge plus toast if clicked | modal | S-SHELL-5 wording: "notice" can be satisfied by a toast; confirm with the owner |

### 2.6 Session header and user menu
- Topbar right: a **context chip** "Comercial Demo SAC · Tienda Central · 01/01/2026–31/12/2026" (read-only, R-AUTH-6), with a tooltip naming the database (tenant). Then an **avatar menu** (`JDropdown` plus `JUserAvatar`, both exist) with: name and user, Base de datos, "Cerrar sesión" (destructive item, dirty guard).
- Keep `role="banner"` on the topbar. `App.spec.tsx:37,54` relies on it.

### 2.7 Keyboard map (desktop-consistent, browser-safe)

| Keys | Action | Status |
|---|---|---|
| Alt+A/M/E/N/Z/B/R/X/I/F/S | toolbar actions (R-CRUD-10) | exists (`toolbarShortcuts.ts:8-20`); show them in tooltips **and** a help sheet |
| Enter / Esc | submit / close topmost dialog (R-CRUD-8, R-SHELL-6) | exists |
| ↑ ↓ Home End PgUp PgDn | move row selection in any grid | **new** |
| Enter on a row | open DETAIL (or UPDATE fallback) | **new** |
| Ctrl+K or `/` (outside inputs) | focus the menu search | **new** |
| Alt+1…9 | go to workspace tab n | **new** (no clash with the Alt letters above) |
| Alt+W | close the active tab (dirty guard) | **new** (W is unused by `TOOLBAR_SHORTCUTS`) |
| F2 / Alt+↓ in a lookup code | open the picker | **new** |
| Shift+? | keyboard help dialog | **new** |

Avoid Ctrl+Alt combinations: Windows reports AltGr that way, as already noted in `toolbarShortcuts.ts:32`.

---

## 3. Visual system

### 3.1 What jona-ui offers today (`uijona/src/theme/tokens.css`, `uijona/tailwind.config.js`)

| Area | Available | Missing |
|---|---|---|
| Color | primary/accent/neutral 50-900; danger/success/warning **400-600 only** (`tokens.css:17-65`), all as RGB triplets, mapped to Tailwind (`tailwind.config.js:6-57`) | semantic tokens (`--jona-surface`, `--jona-surface-muted`, `--jona-text`, `--jona-text-muted`, `--jona-border`, `--jona-focus`, `--jona-selection`), status 50/100 tints for badges and rows |
| Dark mode | chart palette only (`tokens.css:149-187`) | component surfaces and text (components hard-code `bg-white`, `text-neutral-600`, etc., for example `JSidebarLayoutView.tsx:95`) |
| Typography | font stacks only (`tokens.css:81-84`) | a type scale (display/h1/h2/h3/body/small/caption), heading atom, and body base styles (no `body{}` rule in `styles/index.css`) |
| Spacing | `--jona-spacing-1..4` (0.25-1rem) | 5-8 (1.5-3rem). Layout components use Tailwind spacing anyway. |
| Radius, shadow, z-index | complete (`tokens.css:68-95`) | - |
| Density | none | `--jona-control-h` (36px desktop / 44px touch) to replace X2 |
| Theming | `JonaThemeProvider` (RGB overrides, `uijona/src/theme/ThemeProvider.tsx`) | brand slot (logo, product name) for app layouts |

### 3.2 Proposed base (lib, additive)

- **Semantic tokens** in light and dark: `surface` (white / neutral-900), `surface-muted` (neutral-50 / neutral-800), `text` (neutral-900 / neutral-50), `text-muted` (neutral-500 / neutral-400), `border` (neutral-200 / neutral-700), `focus` (primary-500), `selection` (primary-50 / primary-900 at 40%).
- **Type scale for an ERP:**
  - page title 20/28 semibold
  - section 16/24 semibold
  - body 14/20
  - small 13/18
  - caption 12/16
  - table 13/18 (tabular-nums)
- **Density:** control height 36px from `sm`, 44px below `sm` (the current mobile floor). Table row 36px, toolbar 40px, topbar 48px, tabs 40px.
- **Grid:**
  - forms: 12-column `JFieldGrid` with `span` 3/4/6/12; on mobile everything spans 12.
  - content max-width: none for lists (full width); 960px for custom pages.

### 3.3 Layout specs

**Auth (login and contexto as one 2-step flow, `JAuthLayout`)**
- ≥lg: a 40% left brand panel (product name, tagline, primary-700 to accent gradient) and a 60% right panel with a centered 400px card. Below lg: the card only, 16px gutters.
- Card header: product name plus a `JStepper` (exists) "1 Credenciales · 2 Contexto de trabajo" (`currentStep`).
- Step 1: Base de datos (select), Usuario, Contraseña (with show toggle), primary full-width "Ingresar". Initial focus goes to the first empty field.
- Step 2:
  - a muted line "Conectado como **Administrador** en **demo** · [Cambiar usuario]" (clears the pending login and goes back to step 1);
  - Empresa, Punto de venta;
  - "Período" fieldset with labeled **Desde / Hasta** dd/MM/yyyy fields;
  - period error tied to the fieldset;
  - primary "Ingresar al sistema".
- Errors: a `JAlert` at the card top. The trace id goes in a `<details>Código de seguimiento</details>`.

**App shell (`JAppShell`)**
- Topbar 48px: hamburger (<lg) or rail toggle, product name, menu search trigger, context chip, user menu.
- Sidebar 264px, or a 56px rail: search, Recientes, tree.
- Workspace: tabs bar 40px (sticky), then the content area with 16px padding (24px ≥sm) on `surface-muted`. Each page is a `surface` card.
- Empty workspace: `JEmptyState` (exists) "Abra una opción del menú para comenzar" (keep the text, `UiShell.spec.tsx:18`) with up to 6 "Recientes" or most-used shortcuts.

**List page (`JPageHeader` + `JToolbar` + `JDataGrid`)**
- Header row: breadcrumb (small), H1 title, a count badge `(134)`, and the right-aligned `JSearchInput` (exists, clearable; keep the accessible name "Filtro").
- Toolbar:
  - [+ Agregar] primary;
  - a separator, then a group with Modificar, Eliminar (destructive tone), Clonar and Detalle (icons and labels, collapsing to icons below md);
  - a separator, then ⟳ Actualizar;
  - an overflow `⋯` menu with Buscar, Exportar and the list actions (Autorizar Series).
  - Disabled reasons show in a tooltip ("Seleccione un registro" / "Sin permiso").
- Grid: sticky header, sortable headers, selected row in `selection` color with a 3px primary left border, hover `surface-muted`, `role="grid"` with roving focus. Below md it switches to card mode (JTable already supports `cards`).
- Footer: "1–20 de 134" on the left and pagination on the right.
- Loading: a skeleton of 8 rows the first time; afterwards a thin top progress bar and the rows stay.
- Empty: `JEmptyState` with "No hay registros." (keep the text) and the [+ Agregar] action when permitted. With a filter active: "Sin resultados para «x»" plus [Limpiar filtro].

**Register form (`JDialog` + `JFormSection` + `JFieldGrid` + `JField`)**
- Size by field count: `md` up to 6 fields, `lg` up to 14, `xl` for masters. A full-screen sheet below sm.
- Header: a mode badge (Nuevo/Modificar/Eliminar/Clonar/Detalle in neutral/primary/danger tone) plus "Cliente" plus the record identity (code · descripción) when it exists.
- Body:
  - fields in a 2-column grid ≥md; textarea, cascade and lookup span the full width;
  - required `*` with an sr-only "obligatorio";
  - help text under the field;
  - each error under its field with `aria-describedby`; one top error summary on a blocked submit (`role="alert"`, links that focus the fields).
- Footer (sticky): [Cancelar] ghost on the left; on the right the primary action per mode (Guardar / Crear / Eliminar destructive). DETAIL shows [Cerrar] plus [Modificar] when allowed.
- Master: tabs with an error dot and a child row count `Direcciones (3)`. The child grid uses the same `JDataGrid` with row badges `Nuevo` / `Modificado` / `Desactivado` and inline row errors.

**Dialogs and drawers**
- `JOptionPane` for decisions only: variant `danger` for every destructive one and `info` for neutral ones.
- Nested data entry, such as a child register over a master: open it as a **right `JDrawer` (lg)** on top of the master dialog instead of a second centered modal. `JDrawer` exists (`uijona/src/molecules/JDrawer/InterJDrawer.ts`). The lookup picker stays a dialog (`xl`).
- Side panels such as Autorizar Series: a right `JDrawer` (lg) with a header context (Trabajador / Usuario) and a toolbar.

---

## 4. Design-system gap list

### 4.1 The CSS distribution problem

**Root cause:** `uijona/tailwind.config.js:3` sets `content: ['./src/**/*.{ts,tsx}']`. The shipped CSS has only the utilities the lib source uses. A consumer without Tailwind that writes utility strings gets silent no-ops.

**Measured in softcommerce:** 60 distinct utility tokens are used and 9 are missing from `jona-ui/dist/index.css`. I checked with a scratch script that matches every `className` token against the shipped CSS.

| Missing class | Where |
|---|---|
| `sm:grid-cols-[10rem_1fr_auto_auto]`, `sm:items-end` | `src/shared/ui/LookupField/LookupFieldView.tsx:11` |
| `max-h-80` | `src/views/uiseguridadperfil/UiSeguridadPerfilView.tsx:48` |
| `max-h-96` | `UiSeguridadPerfilView.tsx:69`, `src/views/uiseguridadperfil/permisos/PermisosDialogView.tsx:39` |
| `content-start` | `UiSeguridadPerfilView.tsx:39,67` |
| `list-none`, `m-0` | `UiSeguridadPerfilView.tsx:17,48`, `src/shared/ui/OptionsField/OptionsFieldView.tsx:15` (harmless: preflight already resets) |
| `sm:grid-cols-3` | `src/views/uisocioacciones/SocioDialogView.tsx:32` |
| `justify-self-start` | `src/views/uisocioacciones/UiSocioAccionesView.tsx:49` |

**Second root cause: specificity.** JPanel's attribute rules (`.jpanel[data-jpanel-*-layout=…]`, 0,2,0) beat single-class responsive utilities (0,1,0). So `lg:hidden` and `sm:flex` on a JPanel lose (§0).

**Options:**

| Option | What | Pros | Cons |
|---|---|---|---|
| **A (recommended): apps write no utility classes** | Everything the app needs for layout becomes a lib layout or prop (`JStack`/`JInline` exist as `JPanel` layouts, plus new `JFieldGrid`, `JPageLayout`, `JInputGroup`, density props). Add a **consumer contract test** in softcommerce that fails CI on any `className` token missing from the shipped CSS (port of the scratch script). | deterministic, no consumer tooling, enforces the design system | more lib surface; one-time migration of 60 tokens |
| B: publish a Tailwind preset | `jona-ui/tailwind-preset` (tokens and theme) plus documentation for consumers that run Tailwind with `content` including `node_modules/jona-ui/dist/**/*.js` | full Tailwind freedom | forces Tailwind on every consumer; softcommerce has none |
| C: safelist a documented utility subset | Add `safelist` patterns (display, gap 0-8, grid-cols 1-4 at sm/md/lg, col-span, max-h 40-96, overflow, justify/items/self, min-h touch floors) | quick | +15-30 KB CSS; silent no-ops remain for anything outside the list |

**Required regardless of the option:**
1. Wrap the JPanel attribute selectors in `:where(...)` (`uijona/src/styles/index.css:17-…`) so utilities and app classes can override them. Add a regression test for `lg:hidden` on a JPanel.
2. Set `"sideEffects": ["**/*.css"]` (`uijona/package.json:7`).
3. Add a lib-side test asserting that every class string in `src/**/*.tsx` appears in the built CSS. This catches template-literal classes the JIT cannot see.

### 4.2 Component gap list (EXISTS = name the jona-ui component; ADD = new)

API sketches follow JONA (Inter + DEFAULTS without state values, value-first callbacks).

| Need | Status | Level | API sketch |
|---|---|---|---|
| Toasts | **EXISTS**: `ToastProvider`, `useToast`, `useToastHelpers` (`uijona/src/hooks/useToast/UseToastImpl.tsx:65-73`), `JToast` | hook/molecule | adopt; position `top-right` for an ERP (bottom-right hides behind the pagination) |
| Promise confirm | **ADD** `useConfirm` + `ConfirmProvider` | hook | `const ok = await confirm({ title, description, variant:'danger', confirmLabel, cancelLabel })` returns `Promise<boolean>`; must coexist with the app's Esc stack (`DialogStackProvider.tsx`) and accept `onBeforeEsc` |
| Decision pane | **EXISTS** `JOptionPane` (`InterJOptionPane.ts`) | molecule | keep; add an optional `details?: ReactNode` for record summaries |
| Button a11y and density | **EXTEND** `JButton`, `JIcon` | atom | add typed `title`, `aria-label`, `aria-keyshortcuts`, `aria-describedby`, and `density?: 'touch'\|'compact'\|'auto'` (auto = 44px below sm, 36px from sm). Removes the 36 copies of the touch-floor string. |
| Heading or text | **ADD** `JHeading` (`level`, `size`), `JText` (`tone`, `size`) | atom | `<JHeading level={1} size="page">Cliente</JHeading>` |
| Field wrapper | **ADD** `JField` | molecule | `{ id, label, required?, description?, error?, span?: 3\|4\|6\|12, children: (aria: {id, 'aria-describedby', 'aria-invalid', required}) => ReactNode }`; renders label, control slot, help and error with the ids wired |
| Field grid / form section | **ADD** `JFieldGrid` (layout), `JFormSection` (molecule) | layout / molecule | `JFieldGrid { columns?: {base:1, md:2, lg:3}, gap? }`; `JFormSection { title, description?, children }` |
| Error summary | **ADD** `JErrorSummary` | molecule | `{ title, errors: {field, message}[], onSelect?: (field) => void }` (value-first) |
| Date field | **EXTEND** `JDatePicker` | molecule | add `label?`, `error?`, `aria-invalid`, `forwardRef` to the input (softcommerce works around this, `DateFieldImpl.ts:6,18-28`), and a documented `mask="dd/MM/yyyy" valueFormat="iso"` recipe |
| Input group | **ADD** `JInputGroup` | molecule | `{ children, addonStart?, addonEnd? }`, with lookup-field columns built in (`code` / `description` / actions) |
| Page header | **ADD** `JPageHeader` | molecule | `{ title, count?, breadcrumbs?: {label, onSelect?}[], actions?: ReactNode, search?: ReactNode }` |
| Toolbar | **ADD** `JToolbar`, `JToolbarGroup` | molecule | `JToolbar { ariaLabel, items: {id, label, icon?, tone?:'primary'\|'default'\|'danger', disabled?, disabledReason?, shortcut?, group?, overflow?:boolean}[], onAction: (id) => void }`; roving tabindex (`role="toolbar"` arrow keys), overflow menu via `JDropdown` (exists) |
| Selectable data grid | **ADD** `JDataGrid` (or extend `JTable`) | molecule | `{ columns, rows, rowKey, selectedKey?, sort?, onSelect:(key)=>void, onOpen:(key)=>void, onSortChange:(key)=>void, loading?:'initial'\|'refresh', empty?: ReactNode, rowBadge?, rowError? }`; `role="grid"`, `aria-selected`, roving focus, ↑↓ Home End PgUp PgDn Enter. **Quick fix in `JTableRow`:** a `selected?: boolean` prop that sets `data-state="selected"` and `aria-selected`. |
| Pagination info | **EXTEND** `JPagination` | molecule | add `totalRows`, `pageSize` and `showRowsInfo` ("1–20 de 134"). `JTablePaginationConfig.showRowsInfo` already exists in `InterJTable.ts:44`, so reuse it. |
| Search input | **EXISTS** `JSearchInput` (`InterJSearchInput.ts`) | molecule | adopt for the list filter and the menu filter |
| Empty state | **EXISTS** `JEmptyState` | molecule | adopt |
| Skeletons | **EXISTS** `JSkeleton`, `JSkeletonPresets` (`InterSkeletonTableRows`, `InterSkeletonForm`) | atom/molecule | adopt |
| Badge / status | **EXISTS** `JBadge`, `JDot`, `JChip` | atom | adopt for mode badges, row state, "Próximamente" |
| Tree navigation | **ADD** `JTreeNav` | molecule | `{ nodes: {id, label, children?, disabled?, badge?}[], expandedIds, activeId?, filter?, onToggle:(id)=>void, onSelect:(id)=>void, onFilterChange?:(text)=>void }`; full ARIA tree (roving tabindex, arrows, type-ahead, `aria-level`), with a checkbox variant `selectable="checkbox"` and `onCheckedChange:(id, checked)=>void` for Seguridad Perfil |
| Workspace tabs | **ADD** `JWorkspaceTabs` | organism | `{ tabs:{id, title, dirty?}[], activeId, onSelect:(id)=>void, onCloseRequest:(id)=>void, onCloseOthers?, maxVisible? }`; the close control is outside `role="tab"`, with overflow menu and keyboard. Panels stay mounted (solves the `JTabsContent` unmount workaround, `UiMasterRegisterView.tsx:16-17`). **Also:** `JTabs` gains `keepMounted?: boolean`. |
| App shell | **ADD** `JAppShell` | layout | `{ topbar: ReactNode, sidebar: (api) => ReactNode, children, sidebarWidth?, railWidth?, defaultCollapsed? }`; fixes the hamburger defect; replaces the `JSidebarLayout` usage |
| Topbar pieces | **ADD** `JUserMenu` (from `JDropdown` + `JUserAvatar`, both exist), `JContextChip` | molecule | `JUserMenu { name, subtitle?, items: JDropdownGroup[] }`; `JContextChip { items: {label, value}[] }` |
| Breadcrumb | **EXISTS** `JBreadcrumb` | molecule | adopt |
| Drawer | **EXISTS** `JDrawer` | molecule | adopt for child entry and side panels |
| Auth layout | **ADD** `JAuthLayout` | page (template) | `{ brand: {name, tagline?, logo?}, steps?: JStepperStep[], currentStep?, children, footer? }`. The existing `JHomeLogin`/`JLogin` are email-and-password marketing pages (`InterJLogin.ts:2-16`) and do not fit tenant plus context. |
| Stepper | **EXISTS** `JStepper` | molecule | adopt inside `JAuthLayout` |
| Keyboard help | **ADD** `JShortcutSheet` | molecule | `{ groups: {title, items:{keys, label}[]}[] }` in a `JDialog` |
| Semantic tokens and dark mode | **ADD** | theme | §3.2 |

**Stays app-local (domain-specific, R-CRUD-9):** `CrudToolbar` gating (rebuilt on `JToolbar`), `LookupField`/`LookupDialog` behavior (rebuilt on `JInputGroup` and `JDataGrid`), `CascadeSelect`, `DependentSelect`, `UppercaseTextField`, `NumberField`, `MenuTree` adapter (maps `/menu` to `JTreeNav`), and `DialogStackProvider`.

---

## 5. Implementation slices

Each slice is at most 800 changed lines, one PR. Order matters.

### 5.1 jona-ui (package a), shipped as **1.6.0**

| # | Slice | Contents | Est. lines |
|---|---|---|---|
| a1 | CSS distribution fix | `:where()` on JPanel attribute rules; `sideEffects: ["**/*.css"]`; lib test "every class in src is in dist CSS"; regression test for `lg:hidden` on a JPanel; JSidebarLayout hamburger fixed by that | ~300 |
| a2 | Tokens and base | semantic tokens light and dark; status 50/100; type scale; `body` base (font, bg, color); `JHeading`/`JText` atoms with stories | ~550 |
| a3 | Button a11y and density | typed `title`/`aria-*` on `JButton`/`JIcon`; `density` prop; `JTableRow selected` prop (immediate fix for the invisible selection) | ~350 |
| a4 | Form primitives | `JField`, `JFieldGrid`, `JFormSection`, `JErrorSummary`; `JDatePicker` label/error/ref | ~750 |
| a5 | Feedback | `useConfirm` + `ConfirmProvider`; `JOptionPane.details`; toast position defaults documented | ~350 |
| a6 | Page chrome | `JPageHeader`, `JToolbar`/`JToolbarGroup` (overflow, disabled reasons, shortcuts), `JInputGroup`, `JPagination` rows info | ~700 |
| a7 | Data grid | `JDataGrid` (roving focus, selection, open, loading/empty slots, row badge and error slots, cards mode below md) | ~800 |
| a8 | Navigation | `JTreeNav` (nav and checkbox variants, filter), `JTabs keepMounted` | ~750 |
| a9 | Shell | `JAppShell`, `JWorkspaceTabs`, `JUserMenu`, `JContextChip`, `JShortcutSheet` | ~800 |
| a10 | Auth template and release | `JAuthLayout`; export map entries (`uijona/package.json` exports, `src/__tests__/packageExports.test.ts`); CHANGELOG; version `1.6.0`; Storybook pages | ~450 |

If owner pressure is high, a1 and a3 can ship first as **1.5.2**. They are non-breaking and fix the invisible selection and the cascade.

### 5.2 softcommerce (package b)

| # | Slice | Contents | Depends | Est. lines |
|---|---|---|---|---|
| b0 | (in flight elsewhere) | contexto redirect, date mask, silent submit, sidebar | - | - |
| b1 | Adopt 1.6.0 and guardrails | bump the exact pin; `ToastProvider` + `ConfirmProvider` in `App.tsx`; **consumer CSS contract test** (vitest port of the scratch script); replace the 9 missing classes and the 34 inline styles in already-touched files; update R-CRUD-9 (`openspec/specs/softcommerce-crud-templates/spec.md:37-38`, pin 1.5.1 → 1.6.0) | a1-a10 | ~400 |
| b2 | Auth flow | `JAuthLayout` + stepper for login and contexto; labeled Desde/Hasta; "Cambiar usuario"; initial focus; `/login` redirects to `/` when a session exists; tenant-list retry | b1 | ~500 |
| b3 | Shell chrome | `JAppShell`; topbar (brand, context chip, user menu, logout confirm); empty workspace `JEmptyState`; focus on tab open | b1 | ~600 |
| b4 | Menu | `MenuTree` becomes an adapter over `JTreeNav`; filter; Recientes; "Próximamente" badge plus toast for unregistered leaves (S-SHELL-5 wording delta); breadcrumb from the menu path | b3 | ~450 |
| b5 | Workspace tabs and dirty guards | `JWorkspaceTabs`; `WorkspaceDirtyContext`; `useReportDirty` in `FormHost`/register/custom screens; close/logout/unload guards; Alt+1-9, Alt+W, Ctrl+K, Shift+? sheet; R-SHELL-4 delta (dirty guard) | b3, b4 | ~700 |
| b6 | List page | `UiCrudListView` on `JPageHeader` + `JToolbar` + `JDataGrid`; count; search; skeleton and refresh states; empty state with action; fix the dead **Buscar** (hide until implemented, or wire it to focus the search box); double-click/Enter fallback to UPDATE; focus restore after register | b1 | ~750 |
| b7a | Register layout | `UiCrudRegisterView` field blocks become `JField` + `JFieldGrid`; required markers; `aria-describedby`; error summary; dialog size by field count; record identity in the title | b1 | ~800 |
| b7b | Register actions and feedback | per-mode primary label and confirm copy (§2.3); DELETE destructive with summary; DETAIL "Modificar" switch; success toasts through `onDone` (`UiCrudList.tsx:74`) | b7a | ~400 |
| b8 | Master-detail | tab error dots and counts; `ChildGrid` on `JDataGrid` with row badges and inline row errors; child register in a `JDrawer`; Quitar/row-action confirms `danger` | b7a | ~700 |
| b9 | Lookups | `LookupField` on `JInputGroup` (fixes the stacked layout); F2/Alt+↓; `LookupDialog` on `JDataGrid` with keyboard; footer order | b6 | ~500 |
| b10 | Seguridad Perfil | two-pane layout with `JPageHeader`; perfil list on `JDataGrid` (keyboard); `JTreeNav` checkbox variant; "Cargar menú del perfil" label; save success as a toast (spec delta); `PermisosDialog` Cancel and readable form names | b8 | ~600 |
| b11 | Socio Acciones and Autorizar Series | Socio Acciones rendered **inline in its tab** (spec delta to masters spec line 117) or kept modal with a proper header; dead "Desactivar" socio shown disabled with a reason; Autorizar Series in a `JDrawer` with a header context and Desactivar confirm (DEVIATION delta) | b8 | ~600 |

### 5.3 Test and spec assertions affected

**Strategy:** keep the **accessible names and roles** stable: "Aceptar", "Confirmar", "Filtro", "Cerrar pestaña {title}", "Cerrar sesión", "No hay registros.", "Cargando..." (as an sr-only `role=status` text), `role=tabpanel` with `aria-label`, `role=toolbar`. Restyling must not rename. Where a rename is intended, the specs below change.

| Slice | Specs that will need assertion changes | Why |
|---|---|---|
| b2 | `src/views/uicontexto/UiContexto.spec.tsx:56-57`, `UiContexto.grants.spec.tsx`, `src/App.spec.tsx:45-46` | dates queried by placeholder "Fecha inicio/Fecha fin"; they become labels "Desde/Hasta" (or keep the placeholder text as the label) |
| b2 | `src/App.spec.tsx:10-18` | render with `future={{v7_startTransition:true, v7_relativeSplatPath:true}}` to reproduce production routing |
| b3 | `src/views/uishell/ShellHeader.spec.tsx:63` (expects exactly one button `['Cerrar sesión']`), `:71`; `src/App.spec.tsx:54-56,65` (banner `textContent` contains user and period; logout button now inside the user menu) | header turns into topbar plus menu |
| b4 | `src/shared/ui/MenuTree/MenuTree.spec.tsx`, `src/views/uishell/UiShell.spec.tsx` (unknown-leaf notice), `App.spec.tsx:57` (`button 'Maestros'` becomes `treeitem`) | ARIA tree and toast instead of the notice modal |
| b5 | `src/views/uishell/UiShell.spec.tsx:93,103,113` (close buttons), `src/domain/workspace.spec.ts` | close goes through the dirty guard; reducer gains a request path |
| b6 | 7 specs query `'Filtro'` (`UiShell.spec`, `UiDemoStub.spec`, `UiCrudList.format/joined/options/States/Register.spec`); `UiCrudListStates.spec.tsx` and `UiCatalog.spec.tsx` (empty, loading); `CrudToolbar.spec.tsx` (`title` attribute, `role=toolbar`); `CrudGrid.spec.tsx` (`aria-selected`); `localidad.config.spec.tsx` (`toolbar`) | new grid roles, toolbar grouping, overflow menu (Buscar/Exportar move into the overflow) |
| b7a/b7b | about 40 specs use `'Cargando'`; 19 use `role 'alert'` (errors move to `aria-describedby` plus a summary); 74 click `'Aceptar'`/`'Confirmar'` (only affected if labels change per mode) | field markup and per-mode labels |
| b8 | `UiMasterRegister*.spec.tsx` (9 files), `ChildGrid.spec.tsx`, `ChildGrid.actions.spec.tsx`, `registry.clientes.*.ui.spec.tsx`, `registry.{bancos,proveedores,trabajadores,transportistas,vendedores,items.almacenes}.ui.spec.tsx` | row errors move inline; the child register becomes a drawer (`role=dialog` stays) |
| b9 | `LookupField.spec.tsx`, `fill.spec.tsx`, `LookupDialog.spec.tsx`, `lookupHarness.spec.tsx` (`title` attribute) | input group and keyboard |
| b10 | `perfilList.spec.tsx` (`listbox`/`option`), `perfilPermisos.spec.tsx` | grid and tree roles; toast instead of the "Mensaje" modal |
| b11 | `UiSocioAcciones.spec.tsx:29,221,236` (`queryTitled('Acciones de Socio')` dialog), Autorizar Series specs | inline screen and drawer |

**OpenSpec deltas to write (DEVIATION or ASSUMPTION tags):**
- `softcommerce-crud-templates` R-CRUD-9 (version pin, local component list), R-CRUD-5 (success feedback), R-CRUD-8 (row keyboard).
- `softcommerce-shell-workspace` R-SHELL-2 (badge or toast notice), R-SHELL-4 (dirty guard), R-SHELL-5 (user menu), R-SHELL-6 (extended keyboard map).
- `softcommerce-auth-session` R-AUTH-5 (labeled period, optional default), R-AUTH-7 (`/login` with a session goes to `/`).
- `softcommerce-masters` line 117 (Socio Acciones framing).
- `softcommerce-user-permissions` line 34 (Desactivar confirm) and the Seguridad Perfil success notice.

---

## Appendix: verification commands used (read-only)

- Class coverage: a node script compared every `className`/class-constant token in `src/**/*.tsx` against `node_modules/jona-ui/dist/index.css`. Result: 60 tokens, 9 missing (§4.1).
- Responsive selectors in the shipped CSS: parsed every `@media (min-width:…)` block. The `lg` block includes `lg:static`, `lg:z-auto`, `lg:flex`, `lg:hidden`, `lg:translate-x-0`, `lg:grid-cols-2/3`, `lg:items-center`. There is no `lg:` variant for anything else, so app use of `lg:` beyond these is a no-op (for example `lg:grid-cols-2` works at `UiSeguridadPerfilView.tsx:38` only because the lib happens to use it).
- Menu fan-out: `mock-server/data/menu.json`, 54 items, `{ Maestros: 2 children, Generales: 49 leaves, Ventas: 1 }`.
- Form inventory: menu leaves joined against `mock-server/registry/index.js` entries: 51 leaves, 47 generic registry forms, 2 unregistered leaves (`demo_stub`, `miVentas`).
