# Spec: jona-ui-foundations

The base layer of the `jona-ui` design system (`web_ts/uijona`): how its CSS ships and cascades, the semantic light/dark tokens, the theme mode, the type scale, the density tokens, the `JButton` accessibility/density extension, and the versioning and export contract of the 1.5.2 and 1.6.0 releases. Requirements are behavior-level; the only pixel values are the measurable layout/density tokens named here.
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise. **[DEVIATION]** = intended break from current behavior. Requirements R-FND-1..9, scenarios S-FND-1..26.

## Requirements

### R-FND-1 CSS distribution
The package MUST ship one stylesheet that consumers import once (`jona-ui/index.css`), and `package.json` `sideEffects` MUST list the CSS files (for example `["**/*.css"]`), so a bundler that honors `sideEffects` keeps the import. Every class token written in the lib source (`src/**/*.{ts,tsx}`, including class constants and the static text of template literals) MUST be present in the built CSS. A lib test MUST fail and name each missing token. Interpolating a value into a class token (for example `grid-cols-${n}`) is forbidden. Dynamic geometry goes through CSS variables. Styles opt in through a separate `jona-ui/base.css` (R-FND-5), which is also listed in the export map.

### R-FND-2 Cascade: utilities beat layout rules
Lib **layout-engine** rules (`.jpanel*`, `.jona-layout-mobile-grid`, `.jona-gridbag`, `.jona-group-layout`, `.jona-spring-layout`) MUST have zero specificity (`:where()`). That lets a single utility class on the same element win, including responsive ones such as `lg:hidden` and `sm:flex`. The `JSidebarLayout` mobile hamburger bar MUST be hidden from 1024 px wide (`lg`) as a consequence.

Component state and slot rules MUST keep their 1.5.1 selectors and specificity, because they deliberately override the component's own utilities. These are `.jbutton*`, `.jtextbox*`, `.jcheckbox*`, `.jcombobox*`, `.jtextarea*`, `[data-jlabel-*]`, `.jskeleton*`, `.jprogress*` and `.javatar*`. For example, the icon padding of `JTextBox` beats its `px-3`.

The `hidden` attribute MUST always hide (`[hidden]` with `display: none !important`, except `until-found`).

Making the engine rules zero-specificity lets JPanel `className`s that 1.5.1 silently overrode apply, which is a **visible layout correction**. Every such call site MUST be listed by a reviewed snapshot test, audited in Storybook at 375, 1024 and 1920 px before release, and named in the CHANGELOG. Where a View's `flex` meant a row, the row direction MUST be made explicit (`flex-row`), because the engine still sets `flex-direction` (column by default) and Tailwind's `flex` sets none; these additions are listed with the other corrections.

### R-FND-3 Semantic tokens, light and dark
The theme MUST define these semantic color tokens, each for light and dark: `surface`, `surface-muted`, `surface-raised`, `fg`, `fg-muted`, `line`, `line-strong`, `focus`, `selection`, `on-primary`. It MUST also define `50`, `100` and `700` tints for `danger`, `success` and `warning`.
- **Format**: they are RGB-triplet CSS custom properties. Light values of the semantic tokens are `var()` references to the palette, declared on `:root` and `[data-jona-scope]`, so `JonaThemeProvider` overrides flow through. The tints are palette steps themselves (RGB triplets on `:root`, next to the existing 400/500/600 steps). `JonaThemeTokens` gains the matching keys.
- **Use**: lib components MUST paint with them through the arbitrary-value class constants of `src/theme/tokenClasses.ts` (for example `bg-[rgb(var(--jona-surface))]`). These classes also generate in consumers that run their own Tailwind over `dist/**/*.js`.
- **Lint**: View source MUST NOT use raw `white`, `black`, `neutral`, `gray`, `slate` or `zinc` color utilities (bg, text, border, ring, outline, divide, fill, stroke, placeholder and gradient stops), nor hex or rgb literals. The hard-coded colors of `index.css` move to tokens. Exceptions live only in an explicit allowlist held by the token-lint test.
- **Contrast**: in both modes, `fg` and `fg-muted` on `surface` and on `surface-muted` MUST reach at least 4.5:1, and `focus` and `line-strong` on `surface` at least 3:1.

### R-FND-4 Theme mode
The lib MUST offer a theme mode of `light`, `dark` or `system` (`JonaThemeModeProvider`, `useThemeMode`). `system` MUST resolve from `prefers-color-scheme` and follow its live changes. The provider and the init script MUST set two attributes on the document root:
- `data-theme-mode`: the choice;
- `data-theme`: the resolved `light` or `dark`.

Dark mode is **opt-in**. Component dark values apply only under `:root[data-theme-mode='dark']`, or under `prefers-color-scheme: dark` with `:root[data-theme-mode='system']`. Without the attribute, components render light as in 1.5.x. The chart tokens keep their 1.5.1 selectors.

The chosen mode MUST be persisted in `localStorage` (default key `jona-theme-mode`) and restored on the next load. A missing or invalid stored value MUST resolve to `system`.

The lib MUST export:
- `applyStoredThemeMode(storage, root, key?)`, unit-tested;
- `themeInitScript(key?)`, which serialises it for an inline pre-paint script.

The existing `JonaThemeProvider` RGB overrides MUST keep working.

### R-FND-5 Type scale and base styles
The theme MUST define these text styles as tokens:

| Style | Size / line height | Weight |
|---|---|---|
| page title | 20 / 28 px | semibold |
| section | 16 / 24 px | semibold |
| body | 14 / 20 px | regular |
| small | 13 / 18 px | regular |
| caption | 12 / 16 px | regular |
| table | 13 / 18 px | regular, tabular numerals |

The base styles are **opt-in**: the separate stylesheet `jona-ui/base.css` (not imported by `index.css`) MUST style `body` with the body style, the `fg` color and the `surface` background, and `h1`–`h3` with the page, section and body-semibold styles. Lib components that render a title (`JPageHeader`, `JAuthLayout`, `JFormSection`, `JDialog`, `JDrawer`) MUST use the scale, so a heading never renders as unstyled body text.

### R-FND-6 Density tokens
The theme MUST define the control height as 44 px below 640 px (`sm`) and 36 px from 640 px. It MUST also define a table row of 36 px, a toolbar of 40 px, a topbar of 48 px and a tabs bar of 40 px, all as CSS custom properties in the built CSS.

### R-FND-7 JButton accessibility and density
`JButton` (and the icon-button form of `JIcon`) MUST accept typed `title`, `aria-label`, `aria-keyshortcuts` and `aria-describedby` and pass them to the native button. It MUST also accept `density`: `touch` (44 px), `compact` (36 px) or `auto` (44 px below `sm`, 36 px from `sm`). `density` has no default: without it, the rendered size MUST be the 1.5.1 size (non-breaking).
- In 1.5.2, `auto` uses fixed classes.
- From 1.6.0, `auto` follows `--jona-control-h`, so an ancestor `[data-jona-density=compact|touch]` changes it.
- An explicit `touch` or `compact` always wins over an ancestor attribute.

### R-FND-8 Versioning, export map and release
- `1.5.2` MUST contain only R-FND-1, R-FND-2, R-FND-7 and the `JTableRow` selection of jona-ui-data R-DAT-1, plus packaging hygiene that changes no export (test-only declarations are kept out of `dist/`). `1.6.0` MUST contain every requirement of the jona-ui-* capabilities.
- Every new public component and hook MUST be exported from the root entry and listed in the `package.json` export map, and the package-exports test MUST list each one.
- No existing export, prop or default behavior MAY change in either release, except these bug fixes, each named in the CHANGELOG:
  - the R-FND-2 visible layout corrections and `[hidden]` precedence;
  - `danger` toasts announced as `role="alert"` (jona-ui-feedback R-FBK-5);
  - in 1.6.0, the layout fixes of the JPagination Previous/Next chevrons (jona-ui-data R-DAT-7) and of the JTable header label (a JPanel that now states `flex-row`, an R-FND-2 D1a site), and the dark modal backdrop.
- Each release MUST have a CHANGELOG entry.
- A version MUST be published only from a GitHub Release of a commit on `main` (`publish-npm.yml`), never with `workflow_dispatch`. The release tag MUST equal the `package.json` version; this is checked in the release checklist before the Release is published. A published version MUST NOT be republished: a defect is fixed forward with a new patch.

### R-FND-9 Component pattern
Every new or extended piece (jona-ui-feedback, -forms, -data, -app-chrome) MUST follow the JONA layering: an `Inter*` contract with DEFAULTS that hold no state values, an `*Impl`, a pure `*View` and an entry `index`. Callbacks MUST be value-first. Each piece MUST ship with a vitest/Testing Library test file and a Storybook story.

## Scenarios

**S-FND-1 sideEffects keeps CSS** — Given `web_ts/uijona/package.json`, Then `sideEffects` is an array that matches `index.css` and is not `false`.

**S-FND-2 class coverage** — Given the lib source and the built `dist/index.css`, When the coverage test extracts every class token, Then zero tokens are missing. Given a token deliberately added only in a template literal, Then the test fails and names it.

**S-FND-3 layout specificity** — Given the built CSS, When every selector that targets `.jpanel` with a `data-jpanel-*` attribute is parsed, Then none has a specificity above (0,1,0).

**S-FND-4 responsive utility wins** — Given a `JPanel` with desktop layout `box` and class `lg:hidden`, When the built CSS is evaluated at a width of 1024 px or more (CSS-parse test of rule order and specificity), Then `display: none` wins.

**S-FND-5 hamburger hidden on desktop** — Given `JSidebarLayout` at 1024 px or more, Then the `Abrir menú` bar is hidden; below 1024 px it is shown.

**S-FND-6 semantic tokens defined** — Given the built CSS, Then each semantic token of R-FND-3 (a palette reference) and each status tint (a palette triplet) has a light value and a dark value. The dark values sit only under the `data-theme-mode` selectors.

**S-FND-7 contrast** — Given the token values of each mode, When contrast is computed, Then `fg` and `fg-muted` reach 4.5:1 on `surface` and on `surface-muted`, and `focus` and `line-strong` reach 3:1 on `surface`.

**S-FND-8 token lint** — Given the lib View source and `index.css`, Then no file outside the allowlist uses a raw white, black, neutral, gray, slate or zinc color utility, or a hex or rgb color literal.

**S-FND-9 system mode follows the OS** — Given mode `system` and a mocked `prefers-color-scheme: dark`, Then the root reports `dark`. When the media query changes to light, Then the root reports `light` with no reload.

**S-FND-10 explicit mode wins** — Given mode `light` while the OS prefers dark, Then the root reports `light`.

**S-FND-11 persisted mode** — Given a storage key and mode `dark` chosen, When the provider remounts, Then the mode is `dark`. Given the stored value `blue`, Then the mode is `system`.

**S-FND-12 overrides still apply** — Given a `JonaThemeProvider` primary override, Then the override custom property is set as in 1.5.1, in both modes.

**S-FND-13 type scale tokens** — Given the built CSS, Then the six text styles exist with the sizes, line heights and weights of R-FND-5, and the table style sets tabular numerals.

**S-FND-14 body base** — Given `dist/base.css`, Then a `body` rule sets the body text style, the `fg` color and the `surface` background. Given `dist/index.css`, Then it has no `body` or `h1`–`h3` rule beyond preflight.

**S-FND-15 lib titles styled** — Given `JPageHeader` with title `Cliente`, Then the `h1` named `Cliente` carries the page-title style class (present in the built CSS).

**S-FND-16 density tokens** — Given the built CSS, Then the control height is 44 px below `sm` and 36 px from `sm`, and the row, toolbar, topbar and tabs tokens are 36, 40, 48 and 40 px.

**S-FND-17 button passthrough** — Given `<JButton title="Agregar (Alt+A)" aria-keyshortcuts="Alt+A" aria-describedby="r1">`, Then the native button carries those three attributes.

**S-FND-18 button density** — Given `density="auto"`, Then the button carries the classes for 44 px below `sm` and 36 px from `sm` (present in the built CSS). Given no density, Then its classes equal the 1.5.1 output.

**S-FND-19 export map** — Given the 1.6.0 package, Then every component and hook of jona-ui-feedback, -forms, -data and -app-chrome imports from `jona-ui` and is listed in the export map, and the package-exports test enumerates each one.

**S-FND-20 no breaking change** — Given the 1.5.1 lib test suite, When run against 1.5.2 and 1.6.0, Then it passes unchanged, except the assertions of the R-FND-8 named bug fixes, each listed in the CHANGELOG.

**S-FND-21 release from main** — Given the release checklist of a version, Then the tag equals the `package.json` version, the Release targets a `main` commit, and no `workflow_dispatch` run published it.

**S-FND-22 component pattern** — Given each new component folder, Then it contains the `Inter*`, `*Impl`, `*View` and `index` files, a test and a story, and its DEFAULTS hold no state value (no `value`, `selected*`, `open`, `checked*` keys).

**S-FND-23 component state rules kept** — Given a `JTextBox` with a left icon, When the built CSS is evaluated, Then `padding-left: 2.25rem` wins over its `px-3`.

**S-FND-24 visible corrections audited** — Given the lib source, Then the snapshot of JPanel `className` tokens that set an engine property (display, gap, width, flex, align, justify, grid-template) matches the reviewed list, and each entry is named in the CHANGELOG.

**S-FND-25 dark is opt-in** — Given no `data-theme-mode` on the root and the OS in dark mode, Then every component semantic token resolves to its light value, and only the chart tokens switch, as in 1.5.1.

**S-FND-26 init script** — Given `localStorage['jona-theme-mode']='dark'`, When `applyStoredThemeMode` runs, Then the root has `data-theme-mode="dark"` and `data-theme="dark"`. Given `blue`, Then `system` is used.
