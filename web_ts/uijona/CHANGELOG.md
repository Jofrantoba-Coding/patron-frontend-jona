# Changelog

All notable changes to `jona-ui` are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the package uses [Semantic Versioning](https://semver.org/).

## 1.6.0

An additive minor release: semantic tokens, an opt-in dark theme and base stylesheet, a type scale and density tokens, and the application-chrome, form, data and feedback pieces listed below. No export or prop was removed. Dark mode and `base.css` are **opt-in**: without `JonaThemeModeProvider` (or `themeInitScript`) and without `import 'jona-ui/base.css'`, components render light, as in 1.5.x. The 1.5.1 test suite passes unchanged against this release.

1.6.0 also ships every 1.5.2 change: 1.5.2 was not published to npm, so 1.6.0 is the first release after 1.5.1. When upgrading from 1.5.1, read the 1.5.2 entry below too, in particular "Who sees a visible change".

### Added

- **Semantic tokens** in `jona-ui/theme/tokens.css` and the compiled `index.css`: `surface`, `surface-muted`, `surface-raised`, `fg`, `fg-muted`, `line`, `line-strong`, `focus`, `selection`, `on-primary`, the `danger`/`success`/`warning` 50, 100 and 700 tints, and `--jona-backdrop`/`--jona-backdrop-alpha`. Light values reference the palette, on `:root` and `[data-jona-scope]`, so `JonaThemeProvider` overrides flow through. `JonaThemeTokens` gains `white`, `accent50`…`accent900`, the tints and the semantic keys.
- **Theme mode:** `JonaThemeModeProvider` (`defaultMode='system'`, `storageKey='jona-theme-mode'`), `useThemeMode()` (`mode`, `resolved`, `setMode`), `applyStoredThemeMode(storage, root, key?, matchMedia?)`, `themeInitScript(key?)` and `THEME_MODE_DEFAULTS`. The root gets `data-theme-mode` (the choice: `light`, `dark` or `system`) and `data-theme` (the resolved value, following `prefers-color-scheme` live). The choice is persisted; a missing value gives `defaultMode`, an invalid one gives `system`.
- **`jona-ui/base.css`** (opt-in, import it after `index.css`): `body` in the body text style on `surface`/`fg`, and `h1`–`h3` in the page, section and body-semibold styles.
- **Type scale tokens:** `--jona-text-{page,section,body,small,caption,table}-{size,leading,weight}` (20/28 semibold, 16/24 semibold, 14/20, 13/18, 12/16, 13/18) and `--jona-text-table-numeric: tabular-nums`.
- **Density tokens:** `--jona-control-h` (44 px, 36 px from `sm`), `--jona-row-h` 36 px, `--jona-toolbar-h` 40 px, `--jona-topbar-h` 48 px, `--jona-tabs-h` 40 px. `[data-jona-density=compact|touch]` on an ancestor overrides the control height.
- **Forms:** `JField` (render-prop children that receive `id`, `aria-describedby`, `aria-invalid` and `aria-required`; `requiredLabel='obligatorio'`, `span` 3/4/6/12, `as='fieldset'`), `JFieldGrid` (12 columns from `md`, one below), `JFormSection` (a named group with a section title and an optional error), `JErrorSummary` (`role="alert"`, `Revise los campos marcados`, `onSelect(field)`; renders nothing when empty).
- **JDatePicker:** `forwardRef<HTMLInputElement>`, `id`, `name`, `label`, `error`, `required`, `aria-describedby`, `aria-invalid` and `onBlur(value)`.
- **Feedback:** `useConfirm`, `ConfirmProvider` (`renderPane` for a host-owned pane) and `CONFIRM_DEFAULTS` (`Confirmar`/`Cancelar`, focus on `cancel` for `danger`). Requests queue FIFO; Esc and cancel answer `false`, and so does an unmount. Without `renderPane`, Esc is taken in the capture phase while the pane is open, so a `JDialog` beneath stays open.
- **JOptionPane:** `details` (inside the pane and its description) and `initialFocus` (`'confirm' | 'cancel'`).
- **ToastProvider:** `label`, `dismissLabel` and `offset` (`TOAST_PROVIDER_DEFAULTS` and `ToastProviderProps` are exported); **JToast:** `dismissLabel` (a `JTOAST_DEFAULTS` key). `duration: 0` keeps a toast until it is dismissed.
- **Data:** `JDataGrid` (`role="grid"`, one tab stop, selection follows focus, ↑ ↓ Home End PgUp PgDn Enter, sortable headers with `aria-sort`, `loading` `initial`/`refresh`, `empty`, `rowState` badge/error/muted, `maxHeight`; `JDataGridHandle.focusRow(key?)`, `JDATAGRID_PAGE_STEP`), `JToolbar` (groups, separators, ← → Home End, disabled reasons as descriptions, shortcuts, `Más acciones` overflow menu).
- **JPagination:** `totalRows`, `pageSize`, `showRowsInfo` and `rowsInfoLabel` (`1–20 de 134`, `0 de 0`).
- **Page chrome:** `JPageHeader` (a focusable heading, `count`, `Ruta` breadcrumbs, `actions` and `search` slots; `forwardRef` to the heading), `JInputGroup` (`addonStart`, `addonEnd`, the `lookup` preset `10rem 1fr auto` from `sm`, `columns`, `invalid`; `JINPUTGROUP_LOOKUP_COLUMNS`).
- **Navigation:** `JTreeNav` (an ARIA tree with type-ahead, `nav` and `checkbox` variants, a filter box with `filterTree`, `disabled` nodes that still report `onSelect`, `badge` as the description, `maxHeight`; the `JTreeNavHandle.focusFilter()` ref focuses the filter box and selects its text). **JTabs:** `keepMounted`; **JTabsTrigger:** `invalid`, `invalidLabel='Con errores'` and `count` (`JTABS_TRIGGER_DEFAULTS`, `InterJTabsTrigger`).
- **Application chrome:** `JAppShell` (banner topbar, a navigation sidebar that collapses to a rail from `lg` and is an off-canvas drawer below it, `main`), `JWorkspaceTabs` (a tablist that holds only tabs, each close button next to its tab but outside the tablist, middle-click to request a close, a dirty dot described as `Cambios sin guardar`, panels kept mounted, the `Más pestañas` overflow menu with `maxVisible`; `JWorkspaceTabsHandle.focusPanel(id)`), `JUserMenu` (`menuitem`, a labelled `menuitemradio` group and a `danger` tone), `JContextChip` (read-only context text with the `label: value` pairs as its description), `JShortcutSheet` (`Atajos de teclado`: groups with headings and `kbd` keys), `JAuthLayout` (a `main` card with the product name, the page heading and the host's form; a brand panel from `lg`; an optional `JStepper` with `aria-current="step"`).
- New menus and overlays (JUserMenu, the JToolbar and JWorkspaceTabs overflow menus, the JAppShell drawer) handle Esc on their own root and stop it there, so a `JDialog` beneath stays open; an outside press closes them.
- Every new component and hook is exported from `jona-ui` and from its own subpath (for example `jona-ui/organisms/JWorkspaceTabs`), with its `*_DEFAULTS`.
- **JButton `density="auto"`** follows `--jona-control-h`, so an ancestor `[data-jona-density]` changes it. An explicit `touch` or `compact` still wins.

### Fixed

- **`danger` toasts are announced as alerts** (`role="alert"`, `aria-live="assertive"`). 1.5.x announced them as `status`.
- **The toast timer pauses** while the pointer is over the toast or focus is inside it, and keeps the time left.
- **JDatePicker `valueFormat="iso"` with a non-ISO mask** now shows an ISO value through the mask (for example `2026-01-15` as `15/01/2026`) and reports a complete, valid entry as ISO. An incomplete entry is reported as typed. 1.5.x showed the raw ISO text and reported the masked text. With `label` or `id`, the placeholder is no longer used as the `aria-label`.
- **Modal backdrop in dark mode:** the scrim is black at 70% in dark (neutral-900 at 50% in light, unchanged), so a dialog beneath a confirm and the JAppShell drawer backdrop visibly dim a dark page (at least 1.3:1; it was 1.11:1).
- **JPagination:** the Previous and Next chevrons sit beside their labels from `sm`. The chevron is an svg, which preflight makes `display: block`, so it stacked above the label.
- **JTable header labels** start at the cell start and are centered vertically. The JTableHead label panel turned `flex` on without a direction, so the JPanel engine stacked and centered it. A filterable header still stacks its label above the filter box.
- **JStepper current step in dark mode:** the current step number is painted with the `fg` token instead of `primary-700`, so it reads on the dark surface (it was 2.66:1; it now reaches 4.5:1 in light and dark). In light, the number is neutral-900 instead of primary-700; the `primary-600` ring is unchanged. This also applies to the JAuthLayout steps.

### Changed

- **Components paint through the semantic tokens** (atoms, the molecules and layouts listed in the design, and JAccordion), so they follow the theme mode. The light-mode deltas are small: muted text moves from neutral-400 to neutral-500, neutral-100 fills to neutral-50, control borders use `line-strong` at 45% (close to the old neutral-300), and the JProgress `warning` stroke moves from amber-500 to the palette `warning-500`.
- **Dialog and drawer titles** use the section style (16/24 semibold); the JDialog title was 14 px.
- **Status tints are repainted** with the 50/100/700 tints that 1.5.2 removed as dead classes (JSwitch error track, JAlert danger, the JOptionPane danger icon, the JStatCard tiles and trends, the JTimer warning). JAlert `danger` uses `danger-50` instead of the default-palette `bg-red-50`.
- **Widths:** the JNavbar content row is capped at `max-w-7xl`; the JHeaderPage title and the JFooterPage left and center slots take their content width (`w-auto`), so the JHeaderPage row no longer wraps at 1024 px. This resolves the 1.5.2 known issue.
- **ToastProvider and JToast `message` is optional**, as in `toast({ variant, title })`.
- **The reviewed D1a list** (`src/__tests__/css/jpanelOverrides.golden.json`) gains the JTable header site and the `w-auto`/`max-w-7xl` tokens above, and its line numbers are regenerated against the 1.6.0 sources:
  - JCard (`src/molecules/JCard/JCardView.tsx`): `flex-row` line 31
  - JCheckBoxField (`src/molecules/JCheckBoxField/JCheckBoxFieldView.tsx`): `flex-row` line 15
  - JDataTable (`src/molecules/JDataTable/JDataTableView.tsx`): `flex-row` line 54
  - JDialog (`src/molecules/JDialog/JDialogView.tsx`): `flex-row` line 53
  - JDrawer (`src/molecules/JDrawer/JDrawerView.tsx`): `flex-row` line 84
  - JEmptyState (`src/molecules/JEmptyState/JEmptyStateView.tsx`): `flex-row` lines 17, 26
  - JMultiSelect (`src/molecules/JMultiSelect/JMultiSelectView.tsx`): `flex-row` line 40
  - JNumberInput (`src/molecules/JNumberInput/JNumberInputView.tsx`): `flex-row` line 45
  - JOptionPane (`src/molecules/JOptionPane/JOptionPaneView.tsx`): `flex-row` line 83
  - JProgressItem (`src/molecules/JProgressItem/JProgressItemView.tsx`): `flex-row` line 54
  - JSearchInput (`src/molecules/JSearchInput/JSearchInputView.tsx`): `flex-row` line 50
  - JSkeletonPresets (`src/molecules/JSkeletonPresets/JSkeletonPresetsView.tsx`): `flex-row` lines 8, 28, 38
  - JStatCard (`src/molecules/JStatCard/JStatCardView.tsx`): `flex-row` lines 34, 48, 51
  - JTable (`src/molecules/JTable/JTableView.tsx`): `flex-row` lines 142, 144, 461 (461 is new: the header label)
  - JTimer (`src/molecules/JTimer/JTimerView.tsx`): `flex-row` lines 133, 148
  - JDashboardPreview (`src/organisms/JDashboardPreview/JDashboardPreviewView.tsx`): `flex-row` lines 26, 56
  - JErrorPage (`src/organisms/JErrorPage/JErrorPageView.tsx`): `flex-row` line 34
  - JFooterPage (`src/organisms/JFooterPage/JFooterPageView.tsx`): `w-auto` lines 22, 28; `flex-row` lines 28, 35
  - JHeaderPage (`src/organisms/JHeaderPage/JHeaderPageView.tsx`): `w-auto` line 21; `flex-row` line 34
  - JLogoMarquee (`src/organisms/JLogoMarquee/JLogoMarqueeView.tsx`): `flex-row` lines 39, 51
  - JNavbar (`src/organisms/JNavbar/JNavbarView.tsx`): `flex-row` lines 42, 44, 47, 66; `max-w-7xl` line 42

### Notes

- **Dark mode and `base.css` are opt-in.** Apply the stored mode before the first paint with `themeInitScript()` in `index.html`, then mount `JonaThemeModeProvider`.
- **42 Views still keep their 1.5.x light colors in dark mode** (the marketing organisms and molecules such as JHeaderPage, JFooterPage, JCard, JDataTable, JCombobox, JMultiSelect, JTooltip, JStatCard and JTimer). They are listed in `src/__tests__/quality/darkModeAllowlist.ts`, which only shrinks. Text that inherits the body color can disappear on their white surfaces in dark.
- **Non-neutral default-palette tints stay light in dark** (JAlert info, success and warning; the `bg-primary-50` info tiles).
- **Toast placement:** for application screens, mount one `ToastProvider` with `position="top-right"`, so toasts stay clear of the page footer actions. The default position is unchanged.
- **Default labels:** new components use Spanish defaults (`Más pestañas`, `Cerrar pestaña {title}`, `Atajos de teclado`, `Revise los campos marcados`…). The existing English JToast/ToastProvider defaults are unchanged; override them with the new props.

### Internal

- New tests: token lint with the dark allowlist, WCAG contrast per mode (text 4.5:1, focus and line 3:1, backdrop dimming), the theme mode and init script, the component pattern of every 1.6.0 folder, the export-map sweep, and a compiled-CSS resolver for responsive utilities. The JOptionPane (S-FBK-11) and JPagination (S-DAT-22) approval snapshots were regenerated for the backdrop token and the chevron fix.

## 1.5.2

Not published to npm; these changes ship in 1.6.0.

A bug-fix release. No export, prop or default behavior was removed or changed in its meaning, and the 1.5.1 test suite passes unchanged. The layout fixes are **visible**: class names that 1.5.1 silently ignored now apply, so some components render the layout their markup always asked for. See "Who sees a visible change" below.

### Fixed

- **Layout engine specificity (D1).** The JPanel and layout-manager rules (`.jpanel*`, `.jona-layout-mobile-grid`, `.jona-gridbag`, `.jona-group-layout`, `.jona-spring-layout`) left `@layer utilities`. They are now plain CSS between `@tailwind base` and `@tailwind utilities`, and every selector is wrapped in `:where()` (specificity 0,0,0). A utility on the same element now wins: `lg:hidden`, `sm:grid`, `md:flex`, `gap-4`, `w-full` on a JPanel take effect at their breakpoint. In 1.5.1 the engine rules (specificity 0,2,0) overrode them. Component state and slot rules (`.jbutton*`, `.jtextbox*`, `.jcheckbox*`, `.jcombobox*`, `.jtextarea*`, `[data-jlabel-*]`, `.jskeleton*`, `.jprogress*`, `.javatar*`) are unchanged, byte for byte, and keep their specificity. For example, the JTextBox left-icon padding still beats `px-3`.
- **`[hidden]` precedence (D2).** `[hidden]:where(:not([hidden='until-found'])) { display: none !important }` in `@layer base`. An element with the `hidden` attribute is hidden even when it also has a display utility such as `flex` or `grid`. `hidden="until-found"` keeps its browser behavior.
- **`sideEffects` (D3).** `package.json` declared `"sideEffects": false`, so a bundler could drop `import 'jona-ui/index.css'` from a production build. It is now `["**/*.css"]`: JS stays tree-shakeable and the CSS imports are kept.
- **JSidebarLayout:** the mobile `Abrir menú` bar is hidden from `lg` (its `lg:hidden` now applies).
- **JPanel classes now honored (D1a).** Each JPanel `className` token below sets an engine property (display, gap, width, flex, align, justify or grid-template) and was overridden in 1.5.1. Each one was reviewed in Storybook at 375, 1024 and 1920 px, and none was wrong once honored, so none was removed. The list is the `kept` section of `src/__tests__/css/jpanelOverrides.golden.json`; a test fails if it drifts.
  - JBoxLayout (`src/layouts/JBoxLayout/JBoxLayoutView.tsx`): `max-w-full`, `min-w-0`, `w-full`
  - JCardLayout (`src/layouts/JCardLayout/JCardLayoutView.tsx`): `max-w-full`, `min-w-0`, `w-full`
  - JFlowLayout (`src/layouts/JFlowLayout/JFlowLayoutView.tsx`): `max-w-full`, `min-w-0`, `w-full`
  - JGridBagLayout (`src/layouts/JGridBagLayout/JGridBagLayoutView.tsx`): `max-w-full`, `min-w-0`, `w-full`
  - JGridLayout (`src/layouts/JGridLayout/JGridLayoutView.tsx`): `max-w-full`, `min-w-0`, `w-full`
  - JGroupLayout (`src/layouts/JGroupLayout/JGroupLayoutView.tsx`): `max-w-full`, `min-w-0`, `w-full`
  - JSidebarLayout (`src/layouts/JSidebarLayout/JSidebarLayoutView.tsx`): `lg:hidden`, `min-w-0`
  - JSpringLayout (`src/layouts/JSpringLayout/JSpringLayoutView.tsx`): `max-w-full`, `min-w-0`, `w-full`
  - JAccordion (`src/molecules/JAccordion/JAccordionView.tsx`): `flex`, `flex-col`, `gap-2`, `w-full`
  - JAlert (`src/molecules/JAlert/JAlertView.tsx`): `min-w-0`, `w-full`
  - JCard (`src/molecules/JCard/JCardView.tsx`): `flex`, `flex-col`, `flex-row`, `flex-wrap`, `gap-1.5`, `gap-2`, `items-center`, `min-w-0`
  - JCheckBoxField (`src/molecules/JCheckBoxField/JCheckBoxFieldView.tsx`): `flex`, `flex-col`, `flex-row`, `gap-0.5`, `gap-1`, `gap-2`, `items-start`
  - JCombobox (`src/molecules/JCombobox/JComboboxView.tsx`): `flex`, `flex-col`, `inline-block`, `max-w-[calc(100vw-1rem)]`, `w-full`
  - JDataTable (`src/molecules/JDataTable/JDataTableView.tsx`): `flex`, `flex-col`, `flex-row`, `gap-1`, `gap-2`, `gap-3`, `items-center`, `max-w-full`, `w-full`
  - JDialog (`src/molecules/JDialog/JDialogView.tsx`): `flex`, `flex-col`, `flex-row`, `flex-wrap`, `items-center`, `justify-center`, `max-w-lg`, `max-w-md`, `max-w-sm`, `max-w-xl`, `min-w-0`, `w-full`
  - JDrawer (`src/molecules/JDrawer/JDrawerView.tsx`): `flex`, `flex-col`, `flex-col-reverse`, `flex-row`, `gap-0.5`, `gap-2`, `gap-4`, `items-start`, `justify-between`, `max-w-[85vw]`, `min-w-0`, `sm:flex-row`, `sm:justify-end`, `w-64`, `w-80`, `w-[28rem]`, `w-full`
  - JEmptyState (`src/molecules/JEmptyState/JEmptyStateView.tsx`): `flex`, `flex-col`, `flex-row`, `flex-wrap`, `gap-1`, `gap-2`, `gap-4`, `items-center`, `justify-center`, `max-w-md`, `min-w-0`, `w-12`, `w-full`
  - JFileUpload (`src/molecules/JFileUpload/JFileUploadView.tsx`): `flex`, `flex-col`, `gap-3`, `min-w-0`, `w-full`
  - JLanguageSwitcher (`src/molecules/JLanguageSwitcher/JLanguageSwitcherView.tsx`): `inline-block`, `min-w-[9rem]`
  - JMultiSelect (`src/molecules/JMultiSelect/JMultiSelectView.tsx`): `flex`, `flex-col`, `flex-row`, `flex-wrap`, `gap-1`, `items-center`, `max-w-[calc(100vw-1rem)]`, `w-full`
  - JNumberInput (`src/molecules/JNumberInput/JNumberInputView.tsx`): `flex-row`, `inline-flex`, `items-stretch`, `max-w-full`, `min-w-0`
  - JOptionPane (`src/molecules/JOptionPane/JOptionPaneView.tsx`): `flex`, `flex-row`, `items-center`, `justify-center`, `max-w-sm`, `sm:max-w-md`, `w-full`
  - JPopover (`src/molecules/JPopover/JPopoverView.tsx`): `inline-block`, `max-w-[calc(100vw-1rem)]`, `min-w-[12rem]`
  - JProgressItem (`src/molecules/JProgressItem/JProgressItemView.tsx`): `flex`, `flex-row`, `gap-2`, `items-center`, `justify-between`, `w-full`
  - JRadioGroup (`src/molecules/JRadioGroup/JRadioGroupView.tsx`): `flex`, `flex-col`, `flex-row`, `flex-wrap`, `gap-3`
  - JSearchInput (`src/molecules/JSearchInput/JSearchInputView.tsx`): `flex`, `flex-row`, `gap-2`, `items-center`, `min-w-0`, `w-full`
  - JSelectField (`src/molecules/JSelectField/JSelectFieldView.tsx`): `flex`, `flex-col`, `gap-1.5`
  - JSkeletonPresets (`src/molecules/JSkeletonPresets/JSkeletonPresetsView.tsx`): `flex`, `flex-col`, `flex-row`, `gap-2`, `gap-3`, `gap-4`, `items-center`
  - JStatCard (`src/molecules/JStatCard/JStatCardView.tsx`): `flex`, `flex-row`, `flex-wrap`, `gap-3`, `gap-x-2`, `gap-y-1`, `items-center`, `items-start`, `justify-between`, `justify-center`, `min-w-0`, `w-10`
  - JTable (`src/molecules/JTable/JTableView.tsx`): `flex`, `flex-col`, `flex-row`, `flex-wrap`, `gap-1`, `gap-2`, `gap-3`, `gap-4`, `items-center`, `items-stretch`, `justify-center`, `max-w-full`, `min-w-0`, `sm:flex-row`, `sm:items-center`, `sm:justify-between`, `w-full`
  - JTimer (`src/molecules/JTimer/JTimerView.tsx`): `flex`, `flex-col`, `flex-row`, `flex-wrap`, `gap-2`, `gap-3`, `inline-flex`, `items-center`, `min-w-0`
  - JDashboardPreview (`src/organisms/JDashboardPreview/JDashboardPreviewView.tsx`): `flex`, `flex-row`, `gap-1.5`, `gap-2`, `gap-3`, `grid`, `grid-cols-2`, `items-center`, `items-end`
  - JErrorPage (`src/organisms/JErrorPage/JErrorPageView.tsx`): `flex`, `flex-col`, `flex-row`, `flex-wrap`, `gap-3`, `items-center`, `justify-center`, `max-w-sm`, `sm:max-w-md`, `w-full`
  - JFooterPage (`src/organisms/JFooterPage/JFooterPageView.tsx`): `flex`, `flex-row`, `gap-2`, `gap-4`, `hidden`, `items-center`, `max-w-full`, `md:flex`, `min-w-0`
  - JHeaderPage (`src/organisms/JHeaderPage/JHeaderPageView.tsx`): `flex`, `flex-row`, `gap-2`, `items-center`, `min-w-0`
  - JLogoMarquee (`src/organisms/JLogoMarquee/JLogoMarqueeView.tsx`): `flex`, `flex-row`, `gap-14`, `items-center`, `w-max`
  - JNavbar (`src/organisms/JNavbar/JNavbarView.tsx`): `flex`, `flex-col`, `flex-row`, `gap-1`, `gap-2`, `gap-4`, `gap-6`, `hidden`, `items-center`, `justify-between`, `lg:flex`, `lg:hidden`, `max-w-sm`, `w-[85vw]`, `w-full`
- **Explicit row direction (D1a, 34 sites).** The engine sets `flex-direction: var(--jpanel-direction, column)`, and `flex` does not override it. These JPanels used `flex` to mean a row, but in 1.5.1 they rendered as a column. Each now carries `flex-row` (the `added` section of the golden file). Line numbers are those of the 1.5.2 source.
  - JCard footer (`src/molecules/JCard/JCardView.tsx`): line 31
  - JCheckBoxField (`src/molecules/JCheckBoxField/JCheckBoxFieldView.tsx`): line 15
  - JDataTable toolbar (`src/molecules/JDataTable/JDataTableView.tsx`): line 54
  - JDialog overlay (`src/molecules/JDialog/JDialogView.tsx`): line 52
  - JDrawer header (`src/molecules/JDrawer/JDrawerView.tsx`): line 83
  - JEmptyState icon and actions (`src/molecules/JEmptyState/JEmptyStateView.tsx`): lines 16, 25
  - JMultiSelect (`src/molecules/JMultiSelect/JMultiSelectView.tsx`): line 40
  - JNumberInput (`src/molecules/JNumberInput/JNumberInputView.tsx`): line 45
  - JOptionPane overlay (`src/molecules/JOptionPane/JOptionPaneView.tsx`): line 75
  - JProgressItem (`src/molecules/JProgressItem/JProgressItemView.tsx`): line 54
  - JSearchInput (`src/molecules/JSearchInput/JSearchInputView.tsx`): line 49
  - JSkeletonPresets (`src/molecules/JSkeletonPresets/JSkeletonPresetsView.tsx`): lines 8, 28, 38
  - JStatCard (`src/molecules/JStatCard/JStatCardView.tsx`): lines 33, 47, 50
  - JTable toolbars (`src/molecules/JTable/JTableView.tsx`): lines 137, 139
  - JTimer (`src/molecules/JTimer/JTimerView.tsx`): lines 132, 147
  - JDashboardPreview (`src/organisms/JDashboardPreview/JDashboardPreviewView.tsx`): lines 25, 55
  - JErrorPage actions (`src/organisms/JErrorPage/JErrorPageView.tsx`): line 34
  - JFooterPage (`src/organisms/JFooterPage/JFooterPageView.tsx`): lines 28, 35
  - JHeaderPage actions (`src/organisms/JHeaderPage/JHeaderPageView.tsx`): line 34
  - JLogoMarquee (`src/organisms/JLogoMarquee/JLogoMarqueeView.tsx`): lines 39, 51
  - JNavbar (`src/organisms/JNavbar/JNavbarView.tsx`): lines 42, 44, 47, 66

  The overlays (JDialog, JOptionPane) and the single-child boxes (the JEmptyState icon, the JStatCard icon) look the same in either direction. They get `flex-row` so that every JPanel that turns `flex` on also states its direction; a test enforces this.
- **Class names the stylesheet never had (no visual change).** 1.5.1 wrote 11 class tokens that Tailwind never generated, so they rendered nothing: the `danger`, `success` and `warning` 50, 200 and 700 tints (JSwitch, JOptionPane, JStatCard, JTimer, JAlert, JDashboardPreview) and `max-w-content` (JNavbar). They were removed. The status tints return with the semantic tokens of 1.6.0. The `jdot` and `jglyph` hook classes now have a CSS rule (`box-sizing: border-box`, as `.jbadge`).

### Added

- **JButton:** typed accessibility props `title`, `id`, `aria-label`, `aria-describedby`, `aria-keyshortcuts`, `aria-pressed`, `aria-expanded`, `aria-controls` and `aria-haspopup`. They reach the native `<button>`.
- **JButton `density`** (`'touch' | 'compact' | 'auto'`, new type `JButtonDensity`, doc map `JBUTTON_DENSITIES`). `touch` = 44 px at every width (`min-h-11 sm:min-h-11`), `compact` = 36 px at every width (`min-h-9 sm:min-h-9`), `auto` = 44 px below `sm` and 36 px from `sm` (`min-h-11 sm:min-h-9`). The density beats the height of `size`. There is no default: without `density`, every size renders the 1.5.1 classes.
- **JIcon** (the icon-only button): the same accessibility props and `density`. `label` stays the accessible name.
- **JTableRow `selected`** (new exported type `InterJTableRow`). `selected` sets `aria-selected="true"` and `data-state="selected"`, a `primary-50` background and a 3 px `primary-600` start border. The selected background stays on hover, so selection never looks like hover. Without `selected`, the row renders as in 1.5.1.

### Internal

- `axe-core` dev dependency and the test helper `src/__tests__/quality/axe.ts` (`seriousViolations(container)`: serious and critical violations, `color-contrast` off in jsdom). JButton and a selected JTableRow pass it. It is not part of the package.
- Test-only declarations (`dist/test/setup.d.ts`, which 1.5.1 shipped, and `dist/__tests__/`) are no longer emitted. They were never exported.
- New CSS tests: the cascade (`cascade.test.ts`), class coverage (every class token used in `src` exists in the compiled CSS, no interpolated class fragments) and the reviewed JPanel class snapshot (`jpanelOverrides.test.ts`).

### Who sees a visible change

- **Apps that use the Views listed above** (JNavbar, JFooterPage, JHeaderPage, JErrorPage, JDataTable, JTable, JDialog, JDrawer, JEmptyState, JStatCard and the rest): their gaps, widths, alignment and breakpoint classes apply, and in the 21 Views of the row-direction list, rows that 1.5.1 stacked as columns now render as rows. This is the layout the markup always declared.
- **Apps that pass layout utilities to `JPanel` or a layout manager through `className`** (`hidden lg:flex`, `lg:hidden`, `sm:grid`, `gap-*`, `w-*`, `items-*`, `justify-*`): those classes now apply. If an app added CSS to work around them being ignored, that CSS may be redundant now. A JPanel with `flex` and no `flex-row` or `direction` still renders as a column, as in 1.5.1.
- **Apps that render elements with the `hidden` attribute and a display utility**: those elements are now hidden.
- **Apps with a bundler that honored `sideEffects: false`**: `import 'jona-ui/index.css'` is now kept in production builds.
- **No visible change** for JButton, JIcon and JTableRow unless the new props are used, and for the removed class tokens.
- In this repository, `web_ts/softcommerce` carries a stopgap in `src/styles/app.css` for the cascade gaps; it can be trimmed after pinning 1.5.2. `web_ts/showcase_uijona` gets the layout and `[hidden]` fixes when it updates.

### Known issues

- JHeaderPage (title) and JFooterPage (left and center slots) put a JPanel inside a flex row. The engine gives that JPanel `width: 100%`, so the row wraps. This is unchanged from 1.5.1.
