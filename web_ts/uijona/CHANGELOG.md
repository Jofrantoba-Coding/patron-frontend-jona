# Changelog

All notable changes to `jona-ui` are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the package uses [Semantic Versioning](https://semver.org/).

## 1.5.2

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
