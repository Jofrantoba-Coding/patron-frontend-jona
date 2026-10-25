# Design: SoftCommerce Product UX (jona-ui 1.5.2 / 1.6.0 + app adoption)

## Technical Approach

This change follows exploration Option A: **the app writes no utility classes**. Layout, density, color and type come from jona-ui props, layouts and tokens. jona-ui ships two releases from `main`:

- **1.5.2**: a bug-fix release with **visible layout corrections**:
  - the JPanel cascade fix;
  - `[hidden]` precedence;
  - `sideEffects`;
  - typed a11y props and `density` on JButton;
  - `JTableRow selected`.
- **1.6.0**: an additive minor release. Dark mode and the base styles are **opt-in**. It adds tokens, theme mode, the new components and the extensions below.

softcommerce adopts each release with an exact pin. Every lib API below is **locked here**, so 1.6.0 is the only minor. A missing need is solved app-side or fixed forward as 1.6.x, and it never changes a locked signature.

**Owner decisions win over older wording:**
- per-mode confirm copy;
- Socio Acciones rendered inline;
- dirty guards;
- the OS-default theme with a persisted 3-way choice;
- the "Próximamente" badge plus a toast.

**Spec alignment rule.** Between spec and design, the design's locked APIs win. The specs in `specs/*/spec.md` were aligned to this design in place, keeping their IDs.

**Accessible names and roles stay stable**, except the changes listed in the Spec churn plan. Decorations never enter an accessible name: dots, counts and badges are `aria-hidden`, and they are linked through `aria-describedby`.

## Architecture Decisions

| # | Decision | Rejected | Rationale |
|---|---|---|---|
| D1 | **Cascade (1.5.2)**<br>- Only the *layout-engine* rules (`.jpanel*`, `.jona-layout-mobile-grid`, `.jona-gridbag`, `.jona-group-layout`, `.jona-spring-layout`) move out of `@layer utilities`. They become plain CSS between `@tailwind base` and `@tailwind utilities`, with each selector wrapped in `:where()` (specificity 0,0,0).<br>- Component **state/slot rules stay byte-identical, at their current specificity**: `.jbutton*`, `.jtextbox*`, `.jcheckbox*`, `.jcombobox*`, `.jtextarea*`, `[data-jlabel-*]`, `.jskeleton*`, `.jprogress*`, `.javatar*`. These rules deliberately override the component's own utilities; for example `.jtextbox-root[data-jtextbox-has-icon-left] .jtextbox` must keep beating `px-3`.<br>- The card `hidden` keeps `!important`. The iOS 16px rule is untouched | Wrapping every rule (the icon text overlaps, a regression); `.jpanel:where([…])` (the result depends on order); keeping `@layer utilities` (purge risk) | Fixes `lg:hidden`/`sm:flex` on JPanel without touching component internals |
| D1a | **Visible corrections from D1.** JPanel `className`s that 0,2,0 rules silently overrode now apply. That covers 93 sites in 33 lib Views, among them:<br>- JNavbar `hidden … lg:flex` (`JNavbarView.tsx:44`) and `w-[85vw]` (`:65`);<br>- the `gap-*`/`w-*`/`flex-*` classes in JFooterPage, JErrorPage, JDataTable, JCombobox, JCheckBoxField and JHeaderPage.<br>The 1.5.2 slice runs `jpanelOverrides.test.ts`, which lists every JPanel `className` token that sets an engine property (display, gap, width, flex, align, justify, grid-template) as a reviewed snapshot. It also audits those stories in Storybook at 375/1024/1920. A class that is wrong once honored is removed from its View in the same slice. The CHANGELOG lists the corrections | Shipping silently | Consumers see intended layouts, documented |
| D2 | **`[hidden]`**: `@layer base { [hidden]:where(:not([hidden='until-found'])) { display:none !important } }`. Listed in the CHANGELOG | Preflight `[hidden]` (0,1,0) loses to `.flex` | The `hidden` attribute always hides |
| D3 | **Distribution**<br>- `sideEffects: ["**/*.css"]`; `content` unchanged.<br>- Consumers get every lib class because the lib's own source is scanned, and a test proves it. Consumers write none. Own-Tailwind consumers (showcase "If you already use Tailwind", `ThemingGuideView.tsx:251-275`) keep working (D5).<br>- New devDependencies: `postcss-import` (the in-memory compile resolves `@import '../theme/tokens.css'`) and `axe-core` | Safelist; a mandatory preset | Deterministic |
| D4 | **No dynamic class fragments in the lib.** Dynamic geometry goes through CSS variables in inline `style` (for example `JInputGroup columns`, `maxHeight`) | — | The coverage test can be exhaustive |
| D5 | **Semantic tokens, consumed through arbitrary-value utilities.**<br>- RGB triplets live in `tokens.css`. Light values are `var()` references to the palette (`--jona-fg: var(--jona-neutral-900)`, `--jona-surface: var(--jona-white)`), declared on `:root, [data-jona-scope]`, so `JonaThemeProvider` overrides flow through. On a non-root scope, the provider sets `data-jona-scope` on its target.<br>- Lib Views use the constants of `src/theme/tokenClasses.ts`, for example `'bg-[rgb(var(--jona-surface))]'`, `'min-h-[var(--jona-control-h)]'` and `'text-[1.25rem] leading-7 font-semibold'`.<br>- Those literal strings are generated both by the lib build and by any consumer Tailwind that scans `dist/**/*.js`, which only needs `jona-ui/theme/tokens.css` (already documented).<br>- No `dark:` variants. No new `tailwind.config.js` keys | Named Tailwind color keys (they break the own-Tailwind consumers, who lack the keys); inverting the neutral ramp | One class serves both themes and both distribution paths |
| D6 | **Dark is opt-in**<br>- Component dark values apply only under `:root[data-theme-mode='dark']`, or `@media (prefers-color-scheme:dark) { :root[data-theme-mode='system'] }`. They come with `color-scheme: dark`.<br>- Without the provider or the init script there is no `data-theme-mode`, so components stay light, as in 1.5.x.<br>- The chart tokens keep their existing selectors.<br>- `JonaThemeModeProvider` and the init script set `data-theme-mode` (the choice) and `data-theme` (the resolved value, `light`/`dark`, tracking `matchMedia` live) on `<html>`. The choice persists in `localStorage['jona-theme-mode']`, and an invalid value is read as `system` | Keying components on `prefers-color-scheme` or `data-theme` alone (it breaks consumers with their own `bg-white`, for example showcase `^1.2.4`); a 2.0.0 | Additive minor |
| D7 | **Base styles are opt-in**: `jona-ui/base.css` (`src/styles/base.css`, plain CSS, copied to `dist/`, `exports["./base.css"]`). It styles `body` (font, `surface`, `fg`, body size) and `h1`–`h3` (page/section/body-600). The type scale ships as tokens: `--jona-text-{page,section,body,small,caption,table}` (20/28/600, 16/24/600, 14/20, 13/18, 12/16, 13/18 tabular-nums). No JHeading atom | A global `@layer base` restyle | Showcase is unaffected unless it imports the file |
| D8 | **Density**<br>- Tokens: `--jona-control-h` (2.75rem; 2.25rem from `sm`), `--jona-row-h` 2.25rem, `--jona-toolbar-h` 2.5rem, `--jona-topbar-h` 3rem, `--jona-tabs-h` 2.5rem.<br>- `[data-jona-density=compact\|touch]` on an ancestor overrides `--jona-control-h` only.<br>- **JButton `density`** has no default; without it the size is the 1.5.1 output. In 1.5.2: `touch` = `min-h-11`, `compact` = `min-h-9`, `auto` = `min-h-11 sm:min-h-9`. In 1.6.0, `auto` uses `min-h-[var(--jona-control-h)]`, so it follows an ancestor attribute.<br>- Precedence: an explicit `touch`/`compact` > the ancestor attribute > the size default | A prop on every atom | Removes the 37 copies of the touch floor |
| D9 | **Esc ownership**<br>- New lib overlays (JUserMenu, the JToolbar overflow, the JWorkspaceTabs overflow, the JAppShell drawer) do **not** use JDropdown's `document` listeners. They handle Esc on their own root with `preventDefault` + `stopPropagation`, and close on an outside `pointerdown`.<br>- `ConfirmProvider` with no `renderPane` installs a window-capture Esc interceptor while it is open (`stopImmediatePropagation`, resolves `false`), so no `JDialog` beneath sees it. With `renderPane`, the host owns Esc.<br>- The app's `DialogStackProvider` releases its Esc snapshot with `setTimeout(0)` instead of relying on the window bubble listener, so a stopped event cannot leave it stuck.<br>- The app wraps JShortcutSheet's and the child JDrawer's `onClose` with `useGuardedClose` | A lib-wide dialog stack | Coexists with R-SHELL-6 |
| D10 | **JDataGrid is new**, built on JTable primitives: `role=grid`, a roving row focus, and selection that follows focus | Extending `JDataTable`/`JTable` (the role change breaks their consumers) | Different contract |
| D11 | **JField uses render-prop children** that receive the wired aria. JFormField is unchanged | Extending JFormField | Wraps any control |
| D12 | **App providers**<br>- `DialogStackProvider` (same export) composes `ToastProvider` and `ConfirmProvider` (`renderPane` = GuardedOptionPane).<br>- It mounts once at the App root inside the router, around every route, `/login` included.<br>- A nested `DialogStackProvider` under an outer one is a **passthrough**: the UiShell mount and the 90 JSX mounts in 109 importing test files stay valid, with no duplicate toasts | New provider names | Tests get feedback for free; one provider each (R-UX-2) |
| D13 | **Dirty guard**: a `WorkspaceDirty` store (`useSyncExternalStore`) keyed by form id and source. `FormHost` provides `FormIdContext`. The reducer is unchanged: the Impl confirms, then dispatches `close` | A reducer `requestClose` | `workspace.spec.ts` untouched |
| D14 | **The register confirm goes through `useConfirm`** with the pure `confirmCopy(mode, config, record)`. `src/test/registerDriver.ts` absorbs the label assertions (about 270 occurrences of `'Aceptar'`/`'Confirmar'` in 74 spec files) | Pane state in the Impl | One place for copy |
| D15 | **`publish-npm.yml` unchanged.** Publishing happens only through a GitHub Release of a commit on `main`. `workflow_dispatch` is **never** used to publish | Adding a guard step (scope) | The Rollout checklist covers it |
| D16 | **React only.** `uijona-4ngular` parity is deferred | — | Scope |
| D17 | **Lib default labels are Spanish** for every new prop and component, matching JOptionPane, JDatePicker and JSidebarLayout. The existing English JToast/ToastProvider defaults are unchanged for compatibility, and the app overrides them through the new props | Mixed | One convention |

## Data Flow

```
index.html (vite transformIndexHtml ◄ themeInitScript()) ─► <html data-theme-mode data-theme>
main.tsx: import 'jona-ui/index.css' + 'jona-ui/base.css'; JonaThemeModeProvider ─► BrowserRouter(v7 flags)
  └ SessionProvider ─► DialogStackProvider(+Toast top-right, +Confirm) ─► routes
/ : RequireSession ─► UiShell ─► WorkspaceDirtyProvider ─► JAppShell
      topbar: "SoftCommerce" · JContextChip · JUserMenu(Tema radio, Cerrar sesión→guard)
      sidebar: MenuTree adapter ─► JTreeNav(filter, Recientes, Próximamente→toast)
      main: JWorkspaceTabs ─► FormHost(FormIdContext) ─► UiCatalog ─► UiCrudList
UiCrudList: JPageHeader + CrudToolbar(JToolbar) + CrudGrid(JDataGrid)
  Enter/dblclick ─► openMode() ─► UiCrudRegister ─► useReportDirty(open && dirty)
  submit ─► validate ─► confirm(confirmCopy) ─► execute ─► onDone(mode, record)
  onDone ─► notify.success ─► refresh({select}) (rows kept, aria-busy) ─► grid.focusRow(key)
close tab / Alt+W / logout / unload ─► dirty? ─► confirm(danger) ─► dispatch / logout
```

## Interfaces / Contracts (jona-ui, locked)

```ts
// 1.5.2 ─ JButton and JIcon icon-button (additive)
title?; id?; 'aria-label'?; 'aria-describedby'?; 'aria-keyshortcuts'?; 'aria-pressed'?; 'aria-expanded'?;
'aria-controls'?; 'aria-haspopup'?; density?: 'auto'|'compact'|'touch'      // no default (D8)
// 1.5.2 ─ JTableRow: selected?: boolean → aria-selected + data-state="selected";
//          1.5.2 paints bg-primary-50 + a 3px primary-600 start border; 1.6.0 uses the selection token
// 1.6.0 extensions
JDatePicker: forwardRef<HTMLInputElement>; id?, name?, label?, error?, required?, 'aria-describedby'?, 'aria-invalid'?, onBlur?(value)
JTabs: keepMounted?=false;  JTabsTrigger: invalid?, invalidLabel?='Con errores', count?
JPagination: totalRows?, pageSize?, showRowsInfo?=false, rowsInfoLabel?(first,last,total)   // "1–20 de 134", "0 de 0"
JOptionPane: details?: ReactNode; initialFocus?: 'confirm'|'cancel'   // JOPTIONPANE_DEFAULTS unchanged
ToastProvider: label?, dismissLabel?, offset?='1rem'
JToast: danger → role="alert" (a11y fix, in the CHANGELOG); duration 0 = stays until dismissed;
        the timer pauses on hover/focus
JonaThemeTokens: + white, accent50..900, {danger,success,warning}{50,100,700}, surface, surfaceMuted,
  surfaceRaised, fg, fgMuted, line, lineStrong, focus, selection, onPrimary
// theme
type JonaThemeMode = 'system'|'light'|'dark';
JonaThemeModeProvider { defaultMode?='system'; storageKey?='jona-theme-mode'; children }
useThemeMode(): { mode; resolved: 'light'|'dark'; setMode(mode) }
applyStoredThemeMode(storage: Storage, root: HTMLElement, storageKey?, matchMedia?): JonaThemeMode   // pure-ish, tested
themeInitScript(storageKey?): string            // serialises applyStoredThemeMode for index.html
// hooks/useConfirm
interface ConfirmOptions { title; description?; details?: ReactNode; variant?: JOptionPaneVariant;
  confirmLabel?; cancelLabel?; initialFocus? }
CONFIRM_DEFAULTS = { variant:'info', confirmLabel:'Confirmar', cancelLabel:'Cancelar' }
  // initialFocus when omitted: 'cancel' for danger, else 'confirm'
ConfirmProvider { children; renderPane?: (pane: InterJOptionPane) => ReactNode }
useConfirm(): (o: ConfirmOptions) => Promise<boolean>   // FIFO; Esc/cancel → false; unmount → false
// forms
JField { id; label; required?; requiredLabel?='obligatorio'; description?; error?; span?: 3|4|6|12 (6);
  as?: 'field'|'fieldset'; children: (a: { id; 'aria-describedby'?; 'aria-invalid'?; 'aria-required'? }) => ReactNode }
JFieldGrid { children; gap?: JPanelGap ('md') }            // 12 columns from md, 1 below
JFormSection { title; description?; error?; headingLevel?: 2|3|4 (3); children }   // a named group
JErrorSummary { title?='Revise los campos marcados'; errors: { field; label; message }[]; onSelect?(field) }
  // role=alert; renders nothing when empty; never takes focus
JInputGroup { children; addonStart?; addonEnd?; preset?: 'default'|'lookup'; columns?: string;
  ariaLabel?; invalid? }   // lookup = '10rem 1fr auto', bottom-aligned from sm
// data
JDataGridColumn<T> { key; header; align?; width?; sortable?; render?(row: T) }
JDataGrid<T> { ariaLabel; columns; rows: T[]; rowKey(row): string; selectedKey?: string|null;
  loading?: false|'initial'|'refresh'; loadingLabel?='Cargando...'; empty?: ReactNode; maxHeight?: string;
  sort?: { key; direction: 'asc'|'desc' };
  rowState?(row): { badge?: { label; variant: JBadgeVariant }; error?: string; muted?: boolean };
  onSelect(key); onOpen(key); onSortChange?(key, direction) }
JDataGridHandle { focusRow(key?: string): void }   // ↑↓ Home End PgUp/PgDn(10) Enter
JToolbarItem { id; label; icon?; tone?: 'primary'|'default'|'danger'; disabled?; disabledReason?;
  shortcut?; group?; overflow? }
JToolbar { ariaLabel; items; overflowLabel?='Más acciones'; onAction(id) }
  // native disabled; the reason is the description and the tooltip; ←→ Home End
JPageHeader (forwardRef → heading, tabIndex -1) { title; count?; breadcrumbs?: { id; label }[];
  breadcrumbLabel?='Ruta'; actions?; search?; headingLevel?=1; onBreadcrumbSelect?(id) }
// chrome
JTreeNavNode { id; label; children?; disabled?; badge? }   // disabled: aria-disabled, focusable, still onSelect
JTreeNav { ariaLabel; nodes; expandedIds: string[]; activeId?; variant?: 'nav'|'checkbox' ('nav');
  checkedIds?; filter?; showFilter?=false; filterLabel?='Buscar en el menú'; noResultsLabel?='Sin resultados';
  maxHeight?; onToggle(id, expanded); onSelect(id); onCheckedChange?(id, checked); onFilterChange?(text) }
filterTree(nodes, text): { nodes; expandedIds }   // pure, case- and accent-insensitive, no check propagation
JWorkspaceTabs { ariaLabel?='Pestañas de trabajo'; tabs: { id; title; dirty? }[]; activeId: string|null;
  closeLabel?(title)=`Cerrar pestaña ${title}`; dirtyLabel?='Cambios sin guardar'; maxVisible?;
  overflowLabel?='Más pestañas'; renderPanel(id); onSelect(id); onCloseRequest(id) }   // close sits outside role=tab
JWorkspaceTabsHandle { focusPanel(id): void }
JAppShell { brand: ReactNode; topbarEnd?; sidebar(api: SidebarRenderApi); children; sidebarWidth?='16.5rem';
  railWidth?='3.5rem'; defaultCollapsed?=false; navLabel?='Menú de navegación'; openMenuLabel?='Abrir menú';
  closeMenuLabel?='Cerrar menú'; collapseLabel?='Contraer menú'; onCollapsedChange?(collapsed) }
JUserMenuItem = { kind:'action'; id; label; tone?: 'default'|'danger'; disabled? }
  | { kind:'radio'; id; label; value; options: { value; label }[] }
JUserMenu { name; subtitle?; avatarSrc?; items; onAction(id); onRadioChange?(value, id) }   // named by `name`
JContextChip { items: { label; value }[] }
JShortcutSheet { open; title?='Atajos de teclado'; groups: { title; items: { keys: string[]; label }[] }[]; onClose() }
JAuthLayout { brand: { name; tagline?; logo? }; steps?: { id; label }[]; currentStep?; title; description?; children; footer? }
```

Every new unit is a JONA folder: `Inter*.ts` with `*_DEFAULTS` that hold no state values, `*View.tsx`, `*Impl.tsx`, an entry, `index.ts`, a story and a test. It is added to `src/index.ts` and to the `exports` subpaths (`packageExports.test.ts` checks this).

Placement:
- `molecules/`: JField, JFormSection, JErrorSummary, JInputGroup, JDataGrid, JToolbar, JPageHeader, JTreeNav, JUserMenu, JContextChip, JShortcutSheet;
- `layouts/`: JFieldGrid, JAppShell, JAuthLayout;
- `organisms/`: JWorkspaceTabs;
- `hooks/useConfirm`;
- `theme/`.

Internal only: `src/lib/roving.ts`, `src/lib/menuPopup.ts`, `src/theme/tokenClasses.ts`.

## App conventions (softcommerce, locked)

| Topic | Contract |
|---|---|
| Register confirm (`domain/crud/confirmCopy.ts`) | The title is `{modeLabels[mode]}: {title}`: `Nuevo:`, `Modificar:`, `Clonar:`, `Eliminar:`. Per mode:<br>- INSERT: body `¿Guardar el nuevo registro?`, button **Guardar**, `info`;<br>- UPDATE: body `¿Guardar los cambios?`, button **Guardar**, `info`;<br>- CLONE: body `¿Crear la copia?`, button **Crear**, `info`;<br>- DELETE: body `Se eliminará el registro.`, button **Eliminar**, `danger`, focus on the decline button.<br>The decline button is always **`No`**, so it never collides with the register's `Cancelar`. Every mode except INSERT shows `details` = `recordSummary`. The footer primary carries the same label. DETAIL has no primary button |
| Record summary (`domain/crud/recordSummary.ts`) | The values of the first two visible columns, joined by ` · `, with empty parts omitted (for example `0002 · CUSCO`). Used for confirms, child rows and toasts |
| Toasts (`shared/feedback/useNotify.ts`) | Success: title `Registro creado` (INSERT, CLONE), `Registro actualizado` or `Registro eliminado`. The message is the summary, or the catalog title when the summary is empty. 4 s.<br>Server and desktop texts are shown verbatim as the message (`Permisos actualizados correctamente`, `Serie desactivada`).<br>A background error is a `danger` toast with `duration: 0` (`role=alert`). Errors inside a dialog stay inline.<br>Desktop-mandated notices (`Aviso`, `Mensaje`, `Perfiles`, `Precio`) stay modal |
| Round trip | Enter or double-click opens DETAIL, or UPDATE when DETAIL is unsupported and `modify` is set (`openMode.ts`). Buscar and Alt+B focus `Filtro` and select its text. A refresh keeps the rows. After `onDone` the row is reselected and focused with `focusRow`. On open, focus goes to the first editable field (Cerrar in DETAIL) |
| Dirty guard | Close tab, Alt+W, logout and unload. The tab confirm is `danger`: `{title} tiene cambios sin guardar. ¿Cerrar y descartar?`, with [Seguir editando] [Descartar y cerrar]. The logout confirm lists the dirty tabs, with [Seguir editando] [Descartar y salir] |
| Row actions [DEVIATION] | A destructive `immediate` action runs a `danger` confirm first: title = the action label; body `Se desactivará el registro seleccionado.`; `details` = the row summary; confirm = the action label; decline `No`. A decline sends nothing. For Autorizar Series `Desactivar` that is the title `Desactivar` and the confirm `Desactivar` |
| Master-detail confirms | `Quitar` and the deactivating row actions use the desktop text (`Desea Quitar Direccion?` …) as the body, `danger`, the row summary as `details`, the confirm label unchanged from W3 and the decline `No`. The child entry is a `JDrawer` (`lg`) with `useGuardedClose` |
| Lookup | `JInputGroup preset='lookup'`; the icon buttons keep their aria-labels. F2 or Alt+↓ open the picker. Picker footer: [Cancelar] (secondary, first), then the pick label (primary, last). `Refrescar` is an icon button in the results header |
| Keyboard (`domain/shellShortcuts.ts`, pure) | - Alt+1…9, Alt+W.<br>- Ctrl+K, or `/` outside inputs: `Buscar opción`.<br>- Shift+? outside inputs: the sheet.<br>- F2 / Alt+↓ in a lookup.<br>Keys match by physical code. They are ignored while a dialog is open. No Ctrl+Alt |
| Auth | `JAuthLayout` with the brand `SoftCommerce` and the steps `Iniciar sesión` / `Contexto de trabajo`.<br>- `Cambiar usuario` clears the pending login and returns to step 1 with `Usuario` and `Contraseña` empty.<br>- `/login` or `/contexto` with a session redirects to `/` (replace).<br>- Period: `defaultPeriod(now, inicioActividades?)`: `Desde` = max(01/01 of the current year, `INICIO_ACTIVIDADES`), `Hasta` = today. It is applied at confirm only while `Desde` is untouched. Masked dd/MM/yyyy, `valueFormat:'iso'`, labels `Desde`/`Hasta` inside the `Período` group |
| Brand and theme | The literal `SoftCommerce` appears in the topbar and the auth card. No `JonaThemeProvider` overrides, no logo (jona-ui palette). The JUserMenu radio `Tema` offers `Sistema`/`Claro`/`Oscuro` (`system`/`light`/`dark`) |
| Menu | The filter is named `Buscar opción`. Recientes holds the last 5 forms, in sessionStorage `softcommerce.recent.{tenant}.{user}`. The breadcrumb comes from `menuPath()`. An unregistered leaf is `disabled` with `badge:'Próximamente'`; selecting it shows an `info` toast (title = its `descripcion`, message `Esta opción aún no está disponible.`) |
| Socio Acciones (inline) | The tab panel holds a `JPageHeader` `Acciones de Socio` and inline `JTabs keepMounted` with `Socios`/`Precio`. Each tab has its `Activar`/`Desactivar` toolbar and a `JDataGrid`. `Aceptar`/`Cancelar` (desktop labels, not per-mode) sit at the end. Pending rows report dirty.<br>The dialogs `Activar Socio`, `Activar Precio` and `Desactivar Precio` stay dialogs, and `Desea Desactivar Precio?` is a `danger` confirm. The socio `Desactivar` is disabled with the reason `No disponible` [ASSUMPTION, owner to confirm] |
| Seguridad Perfil | The perfil list is a `JDataGrid` and the tree is a `JTreeNav variant='checkbox'`. The scroll caps come from their `maxHeight` props (no app class) |
| CSS contract | No utility classes outside the shipped CSS. No color literals. No `style={{}}` except an allowlist in the contract test, where each entry is a computed runtime value. `src/styles/app.css` (PR #107) shrinks with each slice and is deleted with its last class. `appStyles.spec.ts` **evolves into** `src/styles/cssContract.spec.ts` (`git mv` in b1) |

## File Changes

| Package | Path | Action |
|---|---|---|
| lib | `src/styles/index.css` (D1, D2; index.css colors → tokens in 1.6.0), `src/styles/base.css`, `src/theme/tokens.css`, `vite.config.ts` (copy `base.css`), `package.json` (sideEffects, exports `./base.css` and the new subpaths, version, devDependencies `postcss-import` and `axe-core`), `package-lock.json`, `CHANGELOG.md` (new), `README.md` | Modify / Create |
| lib | `src/theme/{ThemeProvider.tsx,InterThemeMode.ts,ThemeModeImpl.tsx,ThemeMode.tsx,themeInit.ts,tokenClasses.ts,index.ts}` | Modify / Create |
| lib | `src/hooks/useConfirm/*`; `src/molecules/{JField,JFormSection,JErrorSummary,JInputGroup,JDataGrid,JToolbar,JPageHeader,JTreeNav,JUserMenu,JContextChip,JShortcutSheet}/*`; `src/layouts/{JFieldGrid,JAppShell,JAuthLayout}/*`; `src/organisms/JWorkspaceTabs/*`; `src/lib/{roving,menuPopup}.ts` | Create |
| lib | `src/atoms/{JButton,JIcon}/*`, `src/molecules/{JTable,JDatePicker,JTabs,JPagination,JOptionPane,JToast}/*`, `src/hooks/useToast/*`, the D1a class removals, and the token migration of every View outside the allowlist | Modify |
| lib | `src/index.ts`; `src/__tests__/css/{classCoverage,cascade,jpanelOverrides}.test.ts`; `src/__tests__/quality/{tokenLint,contrast}.test.ts`, `darkModeAllowlist.ts`; `src/<layer>/__tests__/*.test.tsx` | Modify / Create |
| app | `package.json` and its lock (`jona-ui` 1.5.2 → 1.6.0 exact, `axe-core` dev), `vite.config.ts` (`transformIndexHtml`), `src/main.tsx`, `src/App.tsx` | Modify |
| app | `src/views/uishell/{UiShell*,ShellHeader*,FormHost.tsx,DialogStackProvider.tsx}`, new `workspaceDirty.tsx` | Modify / Create |
| app | `src/domain/{shellShortcuts,period}.ts`, `src/domain/crud/{confirmCopy,recordSummary,openMode}.ts`, `src/domain/menuTree.ts`, `src/session/recentForms.ts`, `src/shared/feedback/useNotify.ts` | Create / Modify |
| app | `src/shared/ui/{MenuTree,CrudToolbar,CrudGrid,ChildGrid,LookupField,LookupDialog,DateField,…Field}/*`, `src/views/{uilogin,uicontexto,uicrudlist,uicrudregister,uimasterregister,uiseguridadperfil,uisocioacciones,uiautorizarseries,uicatalog}/*` | Modify |
| app | `src/styles/appStyles.spec.ts` → `cssContract.spec.ts` (move); `src/test/{axe,registerDriver}.ts` | Move / Create |
| app | `src/styles/app.css` | Delete (last b-slice) |

## Testing Strategy (strict TDD, RED first)

| Layer | What | Approach |
|---|---|---|
| Lib CSS | - Class coverage, including the tokenClasses literals.<br>- Every layout-engine selector is inside `:where(`.<br>- Component state rules unchanged: the icon padding beats `px-3`; a JTextBox with an icon keeps `padding-left: 2.25rem`.<br>- `[hidden]` is `!important`.<br>- `lg:hidden` beats a JPanel.<br>- The `jpanelOverrides` snapshot.<br>- No template-literal classes | In-memory `postcss([postcssImport, tailwindcss(config)])`, then parse |
| Lib tokens | - The lint covers all `(bg\|text\|border\|ring\|outline\|divide\|fill\|stroke\|placeholder\|from\|via\|to)-(white\|black\|neutral\|gray\|slate\|zinc)` utilities and hex/rgb literals in Views, plus the hard-coded colors in `index.css` (jcheckbox ring, skeleton `#e5e7eb`/`#f9fafb`, `.jtextbox-icon #6b7280`, shimmer).<br>- WCAG ratios per light and dark pair: text 4.5:1, focus and line 3:1.<br>- Dark rules sit only under `data-theme-mode`; without it, every component token equals light | Source scan with a shrinking allowlist; computed ratios |
| Lib theme | `applyStoredThemeMode`: valid, invalid and missing values, and `matchMedia` live. Provider persistence. Type-scale token values. The density override precedence (prop > ancestor > default). `base.css` is shipped and not imported by `index.css` | Unit + RTL |
| Lib components | Keyboard (grid, toolbar, tree, menus, tabs). Value-first callbacks. Defaults. Focus handles. The useConfirm queue and Esc interceptor (a `JDialog` beneath stays open). Esc-on-root stop for the menus. Toast role and pause | RTL + `axe-core` (serious/critical; color-contrast off in jsdom) |
| App unit | `confirmCopy` (variant for every mode), `recordSummary`, `openMode`, `shellShortcuts`, `defaultPeriod` (with the clamp), `menuPath`, `recentForms`, the dirty store, the `DialogStackProvider` passthrough and the `setTimeout` release | Pure / RTL |
| App component | Guards, toasts (the Próximamente toast), focus restore, F2, the Enter fallback, the theme radio, the period prefill, the `/login` redirect, Socio inline (no dialog named `Acciones de Socio`), the child drawer over the master (focus trap, RED in b8) | RTL with the routing future flags, `registerDriver`, axe |
| App contract | className tokens ⊂ dist CSS ∪ `app.css` (until deleted); no color literals; inline styles only from the allowlist | `cssContract.spec.ts` |
| Manual | Walkthrough at 375/1024/1920, light and dark, with axe DevTools: 0 serious/critical. Pre-release Storybook audit of the D1a call sites | Verify / release |

**Spec churn plan.** These are the only renames and role changes. Each one is named in a delta:

| Change | Delta | Size |
|---|---|---|
| Register labels and confirm (R-CRUD-20) | crud-templates | about 270 occurrences, 74 spec files, through `registerDriver`. **b7b re-estimated at about 900 lines and pre-split into b7b1 (copy, driver, `uicrudregister`/`uicrudlist`/`uimasterregister` specs) and b7b2 (`registry.*.ui` specs)** |
| Field `role=alert` → description plus summary | crud-templates | 19 files listed in the R-CRUD-21 churn |
| `Fecha inicio`/`Fecha fin` placeholders → `Desde`/`Hasta` | auth-session | — |
| `Mensaje` modal → toast | permissions, row-actions, masters | — |
| Socio Acciones dialog → inline | masters | — |
| Autorizar Series → drawer (`role=dialog` stays) | permissions | — |
| Menu `button` → `treeitem` | shell-workspace | — |
| Header buttons → menu items | shell-workspace | — |
| Lookup results `group` → `grid` | lookup-dialog | — |
| Perfil `listbox` → `grid` | permissions | — |

## Threat Matrix

N/A. There is no shell, subprocess, VCS/PR automation, executable-file classification or process-integration boundary. SPA routes are not routing in the matrix sense, and `publish-npm.yml` is unchanged (D15).

## Migration / Rollout

The tracker branch `feat/softcommerce-product-ux` is cut from `main` **only after PR #107 merges**. It runs as a feature-branch chain of PRs of at most 800 lines, merged into `main` with merge commits.

**Release checklist (both releases):**
- `npm version X --no-git-tag-version`, which updates the lock;
- a CHANGELOG entry that lists the visible corrections (D1a, D2, the danger toast role);
- `lint`, `test`, `build`, `build-storybook` and `npm pack --dry-run` (check that `dist/base.css` is included for 1.6.0);
- the tracker merges to `main`;
- the owner publishes a GitHub Release `vX` on that `main` commit, with the tag equal to `package.json`;
- never `workflow_dispatch`.

**Order:**
1. **Gate 1**: a1 (D1, D1a audit, D2, D3, D4), a3 (JButton, JTableRow), then a release slice for 1.5.2.
2. **b1a**: pins 1.5.2 and removes the cascade stopgap rules from `app.css`.
3. **Gate 2**: a2a (tokens, `tokenClasses`, theme mode, `base.css`), a2b (component migration), a4–a10. a10 bumps to 1.6.0, then Release.
4. **Gate 3**: b1 (pin 1.6.0, providers, contract test, R-CRUD-9) through b11, with b7b split.

The app never consumes an unpublished lib.

**Rollback:** revert the app slices in reverse order. A bad lib version is deprecated and replaced by a patch, never unpublished.

**Downstream consumers:**
- `web_ts/showcase_uijona` (`^1.2.4`) receives the D1a and D2 corrections and nothing visual from 1.6.0 unless it opts in.
- Own-Tailwind consumers need nothing new: they already import `tokens.css` (D5).

## Open Questions

- [ ] **[ASSUMPTION, owner]** The disabled reason of the Socio `Desactivar` is `No disponible`.
- [ ] Prove the child JDrawer-over-JDialog focus trap with a RED test in b8.
