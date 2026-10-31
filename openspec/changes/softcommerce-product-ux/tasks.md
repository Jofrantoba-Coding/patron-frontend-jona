# Tasks: SoftCommerce Product UX (jona-ui 1.5.2 / 1.6.0 + app adoption)

Lib paths are relative to `web_ts/uijona/`, app paths to `web_ts/softcommerce/`. Strict TDD: every task is RED (a failing test that names its spec scenario) -> GREEN (minimum code) -> REFACTOR (tests stay green). Where no genuine RED is possible (a version, a pin, a CHANGELOG), the task says `MUTATION` or `CHECK`. Tests ship in the same commit as the code they prove (Conventional Commits, no AI attribution).

Conventions used by every task:
- **Design wins.** The locked APIs, rollout gates and file map of `design.md` are authoritative. Specs were aligned to it in place.
- **Gate stays green.** A slice that changes a label, role or markup updates every W1-W3 assertion that it breaks, in the same slice. Only the churn named by the spec deltas is allowed, and each changed assertion keeps its meaning (S-UX-22, S-UX-23). Desktop texts never change (R-UX-8).
- **Lib units (R-FND-9, S-FND-22).** Each new unit is a JONA folder: `Inter*.ts` with `*_DEFAULTS` holding no state values, `*View.tsx`, `*Impl.tsx`, an entry, `index.ts`, a story and a test in `src/<layer>/__tests__/`. It is added to `src/index.ts`, to the `package.json` export map and to `src/__tests__/packageExports.test.ts` in the same slice. Default labels are Spanish (D17), callbacks value-first, no interpolated class fragments (D4), colors only through `src/theme/tokenClasses.ts` from a2b on (D5). Component tests run `axe-core` (serious/critical, color-contrast off in jsdom).
- **App CSS contract (R-UX-6).** No utility class outside the shipped CSS, no color literal, inline `style` only from the allowlist in `src/styles/cssContract.spec.ts`. Every b-slice removes the inline styles and `app.css` rules of the files it touches and shrinks the allowlist.
- **The app never consumes an unpublished lib.** b1a and b1 start with `npm view jona-ui@<x> version`.
- **Line budget.** After each GREEN pair run `git diff --shortstat <base>...HEAD`, excluding `package-lock.json`, golden/seed JSON and generated files (`dist/`, `storybook-static/`). It MUST stay <= 800. Split at the named fallback BEFORE the PR is opened, never after.
- **Git hygiene.** Never stash, reset or clean. Stage explicit pathspecs; `git diff --cached --name-only` lists only the intended paths. The untracked `openspec/changes/softcommerce-product-ux/` folder is committed only by the archive step. Apply does not push: push, PRs and retargeting belong to the orchestrator.
- **Threat matrix: N/A** (design). No threat RED tasks.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~18,400 total across 30 implementation PRs (13 lib, 17 app); 120 to 790 each; `package-lock.json`, golden/seed JSON and generated files excluded |
| 400-line budget risk | High (total); review budget is 800 per PR; no slice is forecast above 790, eleven are flagged near the limit |
| Chained PRs recommended | Yes |
| Suggested split | a1 -> a3 -> rel152 -> [Gate 1] -> b1a -> a2a -> a2b -> a4 -> a5 -> a6 -> a7 -> a8 -> a9a -> a9b -> a10 -> [Gate 2] -> b1 -> b2 -> b3 -> b4 -> b5 -> b6 -> b7a1 -> b7a2 -> b7b1 -> b7b2 -> b7c -> b8 -> b9 -> b10 -> b11a -> b11b -> verify -> archive -> [Gate 3] |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

Reason for "No": auto-chain with feature-branch-chain is cached, every slice is forecast <= 800, and every flagged slice has a named fallback. Owner input is needed only at the two release checklists (version confirmation, Release publish) and before b11a (the Socio `Desactivar` reason, which has a default).

Pre-splits added beyond the design list, each to keep a slice <= 800:
- **a9 -> a9a / a9b**: five chrome components with keyboard, Esc and tests forecast ~1,180 together.
- **b7a -> b7a1 / b7a2**: the shared field views and the register view plus the 19-file `role="alert"` churn forecast ~1,140.
- **b7b -> b7b1 / b7b2 / b7c**: the design's b7b1 (copy, driver, register/list/master specs) and b7b2 (`registry.*.ui` specs) are kept, but the label flip moves to **b7c**. If b7b1 flipped the labels, the `registry.*.ui` suites would fail its gate. So b7b1 and b7b2 migrate the specs to `registerDriver` with the current labels, and b7c flips the copy in one place.
- **b11 -> b11a / b11b**: Socio Acciones inline and Autorizar Series drawer forecast ~1,160 together.

Fallback splits (at a task boundary; renumber later children and retarget their bases):

| Slice | ~Lines | Fallback split |
|-------|--------|----------------|
| a1 | 720 | a1-i = a1.2-a1.3 (cascade, `[hidden]`, sideEffects); a1-ii = a1.4-a1.5 (coverage, JPanel audit) |
| a2a | 780 | a2a-i = a2a.1-a2a.3 + a2a.6 (tokens, contrast, overrides, tokenClasses); a2a-ii = a2a.4-a2a.5 (theme mode, base.css) |
| a2b | 760 | a2b-i = a2b.1, a2b.2, a2b.4 (lint, index.css, atoms, density/selection); a2b-ii = a2b.3 (molecules, layouts) |
| a4 | 760 | a4-i = a4.1-a4.5 (JField, JFieldGrid, JFormSection, JErrorSummary); a4-ii = a4.6 (JDatePicker) |
| a6 | 790 | a6-i = a6.1-a6.2 (roving, menuPopup, JToolbar); a6-ii = a6.3-a6.5 (JPageHeader, JInputGroup, JPagination) |
| a7 | 760 | a7-i = a7.1-a7.2 (roles, keyboard); a7-ii = a7.3 (states, slots) |
| b1 | 700 | b1-i = b1.2-b1.5 (pin, providers, notify, theme init); b1-ii = b1.6 (contract test move) |
| b5 | 780 | b5-i = b5.1-b5.2 (dirty store, tabs, guards); b5-ii = b5.3-b5.4 (shortcuts, sheet) |
| b6 | 790 | b6-i = b6.1-b6.2 (openMode, toolbar); b6-ii = b6.3-b6.4 (grid, page header) |
| b7b1 | 620 | b7b1-i = b7b1.1-b7b1.2 (pure copy, driver); b7b1-ii = b7b1.3 (spec migration) |
| b8 | 780 | b8-i = b8.1-b8.2 (tabs, ChildGrid); b8-ii = b8.3-b8.5 (drawer, confirms, dirty) |

Other slices need no fallback (<= 650).

### Chain topology

Tracker: `feat/softcommerce-product-ux`, cut from `main` only AFTER PR #107 merges, with a draft no-merge PR to `main`. Child PR #1 targets the tracker; each later child targets the immediately previous child branch. At each gate the owner merges the tracker into `main` with a merge commit. The orchestrator then reopens a draft tracker PR for the next segment. The next child keeps the previous child as its base, and its diff must show only its own changes; if not, retarget or rebase. Each child PR body carries the dependency diagram (current PR marked with the pin emoji), start, end, prior dependencies, follow-up and out-of-scope items.

| # | Slice | Branch | PR base | PR title | ~Lines |
|---|-------|--------|---------|----------|--------|
| 0 | PR #107 | `fix/softcommerce-session-flow` | `main` | (done) contexto bounce, RedirectIfSession, period mask, app.css stopgap | - |
| 1 | a1 | `feat/softcommerce-a1-css-cascade` | tracker | `fix(uijona): zero-specificity layout rules, hidden precedence and css side effects` | 720 |
| 2 | a3 | `feat/softcommerce-a3-button-row-selection` | a1 | `feat(uijona): add JButton a11y props and density, and JTableRow selected` | 450 |
| 3 | rel152 | `feat/softcommerce-rel152-release` | a3 | `chore(uijona): release 1.5.2` | 150 |
| - | **Gate 1** | tracker -> `main`; GitHub Release `v1.5.2` (owner) | | | |
| 4 | b1a | `feat/softcommerce-b1a-pin-152` | rel152 | `chore(softcommerce): pin jona-ui 1.5.2 and trim the cascade stopgap` | 120 |
| 5 | a2a | `feat/softcommerce-a2a-tokens-theme` | b1a | `feat(uijona): add semantic tokens, theme mode, type scale and base.css` | 780 |
| 6 | a2b | `feat/softcommerce-a2b-token-migration` | a2a | `feat(uijona): migrate component colors to semantic tokens` | 760 |
| 7 | a4 | `feat/softcommerce-a4-forms` | a2b | `feat(uijona): add JField, JFieldGrid, JFormSection, JErrorSummary and JDatePicker label` | 760 |
| 8 | a5 | `feat/softcommerce-a5-feedback` | a4 | `feat(uijona): add useConfirm and toast conventions` | 600 |
| 9 | a6 | `feat/softcommerce-a6-page-chrome` | a5 | `feat(uijona): add JToolbar, JPageHeader, JInputGroup and pagination rows info` | 790 |
| 10 | a7 | `feat/softcommerce-a7-data-grid` | a6 | `feat(uijona): add JDataGrid` | 760 |
| 11 | a8 | `feat/softcommerce-a8-navigation` | a7 | `feat(uijona): add JTreeNav and JTabs keepMounted` | 740 |
| 12 | a9a | `feat/softcommerce-a9a-app-shell` | a8 | `feat(uijona): add JAppShell, JUserMenu and JContextChip` | 620 |
| 13 | a9b | `feat/softcommerce-a9b-workspace-tabs` | a9a | `feat(uijona): add JWorkspaceTabs and JShortcutSheet` | 560 |
| 14 | a10 | `feat/softcommerce-a10-auth-release` | a9b | `feat(uijona): add JAuthLayout and release 1.6.0` | 520 |
| - | **Gate 2** | tracker -> `main`; GitHub Release `v1.6.0` (owner) | | | |
| 15 | b1 | `feat/softcommerce-b1-adopt-160` | a10 | `feat(softcommerce): adopt jona-ui 1.6.0 providers, theme and css contract` | 700 |
| 16 | b2 | `feat/softcommerce-b2-auth` | b1 | `feat(softcommerce): rebuild login and contexto on JAuthLayout` | 650 |
| 17 | b3 | `feat/softcommerce-b3-shell-chrome` | b2 | `feat(softcommerce): add app shell topbar and user menu` | 620 |
| 18 | b4 | `feat/softcommerce-b4-menu` | b3 | `feat(softcommerce): add tree menu with filter and Recientes` | 650 |
| 19 | b5 | `feat/softcommerce-b5-workspace-dirty` | b4 | `feat(softcommerce): add workspace tabs, dirty guards and shell keys` | 780 |
| 20 | b6 | `feat/softcommerce-b6-list-page` | b5 | `feat(softcommerce): rebuild the list on JPageHeader, JToolbar and JDataGrid` | 790 |
| 21 | b7a1 | `feat/softcommerce-b7a1-field-views` | b6 | `feat(softcommerce): render shared field views through JField` | 520 |
| 22 | b7a2 | `feat/softcommerce-b7a2-register-layout` | b7a1 | `feat(softcommerce): add register field grid and error summary` | 620 |
| 23 | b7b1 | `feat/softcommerce-b7b1-confirm-copy-driver` | b7a2 | `test(softcommerce): add confirm copy and the register driver` | 620 |
| 24 | b7b2 | `feat/softcommerce-b7b2-registry-driver` | b7b1 | `test(softcommerce): drive registry ui specs through the register driver` | 450 |
| 25 | b7c | `feat/softcommerce-b7c-register-actions` | b7b2 | `feat(softcommerce): per-mode register copy, success toasts and focus restore` | 600 |
| 26 | b8 | `feat/softcommerce-b8-master-detail` | b7c | `feat(softcommerce): add tab errors, child grid keys, child drawer and danger confirms` | 780 |
| 27 | b9 | `feat/softcommerce-b9-lookups` | b8 | `feat(softcommerce): rebuild lookups on JInputGroup and JDataGrid` | 560 |
| 28 | b10 | `feat/softcommerce-b10-seguridad-perfil` | b9 | `feat(softcommerce): rebuild Seguridad Perfil on JDataGrid and JTreeNav` | 600 |
| 29 | b11a | `feat/softcommerce-b11a-socio-inline` | b10 | `feat(softcommerce): render Socio Acciones inline` | 560 |
| 30 | b11b | `feat/softcommerce-b11b-series-drawer-closeout` | b11a | `feat(softcommerce): move Autorizar Series to a drawer and delete app.css` | 600 |
| 31 | verify | `feat/softcommerce-v-verify-fixes` (only if verify fails) | b11b | `fix(softcommerce): product ux verify fixes` | <= 300 |
| 32 | archive | on the tracker | - | `docs(openspec): archive softcommerce product ux and promote its specs` | docs |
| - | **Gate 3** | tracker -> `main` (owner) | | | |

Total forecast: ~18,400 changed lines, 30 implementation PRs (+ conditional verify fixes).

### Per-slice gates

- **Lib slices** (a1-a10, rel152), from `web_ts/uijona`: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` (every lib slice touches CSS or stories).
- **App slices** (b1a-b11b, verify), from `web_ts/softcommerce`: `npm test`, `npm run typecheck`, `npm run build`.

Record each exact result and the changed-line count in the PR body. Each slice is revertible alone, in reverse order. A bad lib version is deprecated and fixed forward with a patch, never unpublished.

### Release checklists

**jona-ui 1.5.2 (slice rel152, Gate 1)**
- [x] Owner confirms the version number `1.5.2` before anything is bumped (the orchestrator asks once). `npm view jona-ui versions` does not list it.
- [x] `npm version 1.5.2 --no-git-tag-version` in `web_ts/uijona` (updates `package.json` and the lock).
- [x] `CHANGELOG.md` (new), entry `1.5.2`: Fixed = every D1a correction from the a1.5 snapshot (file, token), `[hidden]` precedence, `sideEffects`. Added = JButton/JIcon typed a11y props and `density`, `JTableRow selected`.
- [x] `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook`, `npm pack --dry-run` (lists `dist/index.css` and the types).
- [x] Storybook audit of the D1a call sites at 375/1024/1920, recorded in the PR body. (Done in a1.5 on the same CSS and Views; rel152 changes no CSS or View. The orchestrator copies the a1.5 sheets list into the PR body.)
- [x] Owner merges the tracker into `main` (merge commit). Done in #108 (2026-10-25).
- [x] ~~Owner publishes a GitHub Release `v1.5.2` on that `main` commit.~~ Superseded: 1.5.2 was never released; its changes ship in 1.6.0 (see the 1.6.0 CHANGELOG entry).
- [x] ~~`npm view jona-ui@1.5.2 version` returns `1.5.2` before b1a starts.~~ Superseded with the item above; npm went from 1.5.1 to 1.6.0.

**jona-ui 1.6.0 (slice a10, Gate 2)**
- [x] Owner confirms the version number `1.6.0` before the bump. `npm view jona-ui versions` does not list it. (2026-10-30)
- [x] `npm version 1.6.0 --no-git-tag-version` (package and lock). `a5feb5ca`.
- [x] CHANGELOG entry `1.6.0`: Added = tokens, theme mode, `base.css`, type scale, density, every new component and hook, the JDatePicker/JTabs/JPagination/JOptionPane/ToastProvider extensions. Fixed = `danger` toasts announced as `role="alert"`. Notes = dark and base styles are opt-in.
- [x] README: `jona-ui/base.css`, `themeInitScript`, the `top-right` toast recommendation.
- [x] `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook`, `npm pack --dry-run` (lists `dist/base.css` and every new subpath). Run on the a10 tip with the version still 1.5.2; rerun after the bump.
- [x] Owner merges the tracker into `main` (merge commit). #113–#132 merged in order into the tracker, then #133 into `main` (`490ce807`, 2026-10-31).
- [x] Owner publishes the GitHub Release `v1.6.0` on that `main` commit; tag == `package.json`. **Never `workflow_dispatch`.** `publish-npm.yml` run 41246244698 (event `release`) succeeded.
- [x] `npm view jona-ui@1.6.0 version` returns `1.6.0` before b1 starts. Published 2026-10-31T22:04:32Z, `latest`, 2509 files.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Cascade, hidden, coverage | a1 | `npx vitest run src/__tests__/css src/__tests__/packageExports.test.ts` | `npm run storybook`: JSidebarLayout at 1024 hides `Abrir menú` | `src/styles/index.css` engine block, `sideEffects`, D1a removals |
| 2 | Button a11y, row selection | a3 | `npx vitest run src/atoms/__tests__/JButton.test.tsx src/molecules/__tests__/JTable.test.tsx` | Storybook: JButton density, JTable selected row | JButton/JIcon/JTableRow props |
| 3 | Release 1.5.2 | rel152 | `npm pack --dry-run` | Release `v1.5.2`, `npm view jona-ui@1.5.2` | version + CHANGELOG (deprecate + patch if bad) |
| 4 | App on 1.5.2 | b1a | `npx vitest run src/styles` | `npm run mock` + `npm run dev` at 1024 | pin + removed stopgap rules |
| 5 | Tokens, theme, migration | a2a, a2b | `npx vitest run src/theme src/__tests__/quality src/__tests__/css` | Storybook theme toggle, light/dark | `tokens.css`, `src/theme/*`, `base.css`, migrated Views |
| 6 | Form primitives | a4 | `npx vitest run src/molecules src/layouts` | Storybook JField, JDatePicker dd/MM/yyyy | four new folders, JDatePicker props |
| 7 | Feedback | a5 | `npx vitest run src/hooks src/molecules/__tests__/JOptionPane.test.tsx` | Storybook confirm over JDialog, Esc twice | `useConfirm`, toast props |
| 8 | Page chrome | a6 | `npx vitest run src/lib src/molecules` | Storybook JToolbar overflow, JInputGroup at 640 | `src/lib/*`, four folders |
| 9 | Data grid | a7 | `npx vitest run src/molecules/__tests__/JDataGrid.test.tsx` | Storybook keyboard on 25 rows | `JDataGrid` folder |
| 10 | Navigation | a8 | `npx vitest run src/molecules/__tests__/JTreeNav.test.tsx src/molecules/__tests__/JTabs.test.tsx` | Storybook 49-leaf filter | `JTreeNav`, JTabs props |
| 11 | Shell pieces | a9a, a9b | `npx vitest run src/layouts src/organisms src/molecules` | Storybook JAppShell at 375/1024 | five folders |
| 12 | Auth layout, 1.6.0 | a10 | `npx vitest run src/layouts src/__tests__` | Release `v1.6.0` | `JAuthLayout`, version, CHANGELOG |
| 13 | App adoption | b1 | `npx vitest run src/styles src/views/uishell src/shared/feedback` | dev: login, choose theme, reload | pin, providers, contract test |
| 14 | Auth | b2 | `npx vitest run src/views/uilogin src/views/uicontexto src/domain src/App.spec.tsx` | dev: login -> contexto -> shell at 375/1920 | `uilogin`, `uicontexto`, `period.ts` |
| 15 | Shell, menu, tabs | b3, b4, b5 | `npx vitest run src/views/uishell src/shared/ui/MenuTree src/domain src/session` | dev: filter `cli`, dirty close, Alt+W | `uishell/*`, `MenuTree`, `workspaceDirty.tsx` |
| 16 | List page | b6 | `npx vitest run src/views/uicrudlist src/shared/ui/CrudToolbar src/shared/ui/CrudGrid src/domain/crud` | dev: Localidad keys, Buscar | `uicrudlist`, `CrudToolbar`, `CrudGrid` |
| 17 | Register | b7a1-b7c | `npx vitest run src/views/uicrudregister src/shared/ui src/domain/crud src/catalogs test/catalogs` | dev: INSERT and DELETE Color | `uicrudregister`, field views, `registerDriver.ts` |
| 18 | Master-detail | b8 | `npx vitest run src/views/uimasterregister src/shared/ui/ChildGrid src/catalogs` | dev: Cliente Direcciones drawer | `uimasterregister`, `ChildGrid` |
| 19 | Lookups | b9 | `npx vitest run src/shared/ui/LookupField src/shared/ui/LookupDialog` | dev: Transportista F2 | `LookupField`, `LookupDialog` |
| 20 | Seguridad Perfil | b10 | `npx vitest run src/views/uiseguridadperfil` | dev: toggle a node, save | `uiseguridadperfil` |
| 21 | Socio, Series, closeout | b11a, b11b | `npx vitest run src/views/uisocioacciones src/views/uiautorizarseries src/styles` | dev: Socio inline; Usuario Autorizar Series | two views, `app.css` deletion |

---

## Slice 0: PR #107 (recorded, not re-implemented)

- [x] 0.1 PR #107 `fix/softcommerce-session-flow` -> `main` implements the contexto bounce fix (guard on `!pending && !session`), RedirectIfSession, the dd/MM/yyyy period fields, and the `src/styles/app.css` stopgap with `src/styles/appStyles.spec.ts`. The owner merges it.
- [ ] 0.2 After the merge: the orchestrator creates the tracker `feat/softcommerce-product-ux` from that `main` commit and opens the draft tracker PR. The b2 tasks keep PR #107's tests and add only the missing scenarios.

## Slice a1: cascade, hidden, distribution (branch `feat/softcommerce-a1-css-cascade`, base: tracker)

Specs: R-FND-1, R-FND-2; S-FND-1, 2, 3, 4, 5, 23, 24. Design: D1, D1a, D2, D3, D4. Forecast ~720 (flagged).

**Applied as the fallback split** (a1-i 725 lines + a1-ii, over 800 together): `feat/softcommerce-a1-css-cascade-i` = a1.2-a1.3, `feat/softcommerce-a1-css-cascade-ii` = a1.4-a1.6; the planned name `feat/softcommerce-a1-css-cascade` points at the a1-ii tip (a1-ii stayed at 673 lines, no `-iii`).

- [x] a1.1 Preflight: `git switch -c feat/softcommerce-a1-css-cascade feat/softcommerce-product-ux`. Record a green lib baseline (all four gate commands).
- [x] a1.2 RED `src/__tests__/css/cascade.test.ts`, compiled in memory with `postcss([postcssImport, tailwindcss(config)])`:
  - S-FND-3: every layout-engine selector sits inside `:where(`;
  - S-FND-4: `lg:hidden` beats a box JPanel at >= 1024;
  - S-FND-5: the JSidebarLayout `Abrir menú` bar is hidden from `lg`;
  - S-FND-23: the JTextBox icon padding `2.25rem` beats `px-3`, and the component state selectors are byte-identical to 1.5.1;
  - D2: `[hidden]` is `display:none !important` in `@layer base`.

  GREEN `src/styles/index.css`: the engine rules leave `@layer utilities`, sit between `@tailwind base` and `@tailwind utilities`, and are wrapped in `:where()`; add the `[hidden]` rule; the card `hidden` and the iOS rule are untouched. Keep the diff small by moving the layer boundary rather than the blocks. Add the `postcss-import` devDependency.
- [x] a1.3 RED `src/__tests__/packageExports.test.ts`: S-FND-1 (`sideEffects` is an array that matches `index.css`). GREEN `package.json` `"sideEffects": ["**/*.css"]`.
- [x] a1.4 RED `src/__tests__/css/classCoverage.test.ts`:
  - S-FND-2: zero tokens of `src/**/*.{ts,tsx}` are missing from the compiled CSS;
  - a fixture token present only in a template literal fails and is named;
  - no `${`-interpolated class fragment exists.

  GREEN: replace any interpolated fragment with a CSS variable in inline `style` (D4). Also drop the class tokens 1.5.1 wrote but Tailwind never generated (they rendered nothing, so there is no visual change; the status tints return with the 1.6.0 tokens in a2b), and give the `jdot`/`jglyph` hook classes a CSS rule.
- [x] a1.5 RED `src/__tests__/css/jpanelOverrides.test.ts`: S-FND-24, an authored, reviewed list of every JPanel `className` token that sets an engine property, per View. GREEN:
  - audit each site in Storybook at 375/1024/1920 (`JNavbarView.tsx:44,65`, JFooterPage, JErrorPage, JDataTable, JCombobox, JCheckBoxField, JHeaderPage, ...);
  - remove each class that is wrong once honored;
  - write the final list (file, token, verdict) in the PR body for the CHANGELOG.

  **Resolved (orchestrator, option A):** 34 JPanels whose `flex` meant a row (no `flex-col`, no `direction`) rendered as columns because the engine sets `flex-direction: var(--jpanel-direction, column)`; each now carries `flex-row`, listed under `added` in `jpanelOverrides.golden.json`, and a test fails on any JPanel that turns flex on without a direction. No token was wrong once honored. The four Views without a story (JNavbar, JDashboardPreview, JLogoMarquee, JLanguageSwitcher) are checked in `cascade.test.ts` instead.
- [x] a1.6 Run the 1.5.1 lib suite (S-FND-20). Any assertion changed by D1a/D2 is listed for the CHANGELOG; nothing else changes. Gate.

W1-W3 assertions changed: none (lib only). Commits: (1) `fix(uijona): zero-specificity layout engine rules and hidden precedence` a1.2; (2) `fix(uijona): declare css side effects and add class coverage test` a1.3-a1.4; (3) `fix(uijona): audit JPanel classes honored by the cascade fix` a1.5-a1.6.

## Slice a3: JButton a11y and density, JTableRow selected (branch `feat/softcommerce-a3-button-row-selection`, base: a1)

Specs: R-FND-7 (1.5.2 part), R-DAT-1 (1.5.2 part); S-FND-17, S-FND-18 (1.5.2 half), S-DAT-1, S-DAT-2 (light half). Forecast ~450.

- [x] a3.1 RED `src/atoms/__tests__/JButton.test.tsx`:
  - S-FND-17: `title`, `id`, `aria-label`, `aria-describedby`, `aria-keyshortcuts`, `aria-pressed`, `aria-expanded`, `aria-controls` and `aria-haspopup` reach the native button;
  - S-FND-18 (1.5.2 half): `touch` = `min-h-11 sm:min-h-11`, `compact` = `min-h-9 sm:min-h-9`, `auto` = `min-h-11 sm:min-h-9`; no density = the 1.5.1 class string.

  GREEN `src/atoms/JButton/*` (typed props, no default density).
- [x] a3.2 RED `src/atoms/__tests__/JLabelJIconJChip.test.tsx`: the icon-button form of JIcon passes the same props. GREEN `src/atoms/JIcon/*`.
- [x] a3.3 RED `src/molecules/__tests__/JTable.test.tsx`: S-DAT-1 (`selected` sets `aria-selected` and `data-state="selected"` and adds `bg-primary-50` plus a 3px `primary-600` start border; the classes are covered by `classCoverage`). RED `cascade.test.ts`: S-DAT-2 light half (the selected and hover backgrounds differ, and the selected rule adds the border). GREEN `src/molecules/JTable/*` JTableRow `selected`.
- [x] a3.4 Add the `axe-core` devDependency and the helper `src/__tests__/quality/axe.ts`; JButton and the selected JTableRow pass it. Stories: JButton density and a11y, JTable selected row. Gate.

W1-W3 assertions changed: none. Commits: (1) `feat(uijona): add typed a11y props and density to JButton and JIcon` a3.1-a3.2; (2) `feat(uijona): add JTableRow selected state` a3.3-a3.4.

## Slice rel152: release 1.5.2 (branch `feat/softcommerce-rel152-release`, base: a3)

Specs: R-FND-8 (1.5.2 scope); S-FND-20, S-FND-21. Forecast ~150.

- [x] r.1 CHECK: the owner confirmed `1.5.2` (blocking; the orchestrator asks once).
- [x] r.2 MUTATION-free bump: `npm version 1.5.2 --no-git-tag-version`; create `CHANGELOG.md` (1.5.2 checklist above); README notes on `sideEffects` and `density`.
- [x] r.2a (added in apply, orchestrator request) RED `src/__tests__/packageExports.test.ts`: the declaration build (`tsconfig.build.json`) includes no `src/test` or `src/__tests__` file. GREEN: both declaration emitters (`tsconfig.build.json` and the `vite-plugin-dts` options in `vite.config.ts`) exclude them, so `dist/test/setup.d.ts` (shipped by 1.5.1) and `dist/__tests__/quality/axe.d.ts` (from a3.4) leave the package. Commit `build(uijona): keep test-only declarations out of the package`.
- [x] r.3 CHECK: `npm pack --dry-run`; the 1.5.2 contents are only R-FND-1, R-FND-2, R-FND-7 and R-DAT-1 (S-FND-20), plus the r.2a packaging hygiene (no export changes). Gate, then run the 1.5.2 checklist.

**Gate 1**: tracker -> `main` and GitHub Release `v1.5.2`, both by the owner, then `npm view` confirms it.

## Slice b1a: pin 1.5.2, trim the stopgap (branch `feat/softcommerce-b1a-pin-152`, base: rel152)

Specs: R-CRUD-9 (interim pin), R-UX-6; S-CRUD-21 (interim form), S-FND-5 (consumer side). Forecast ~120.

- [ ] b1a.1 Preflight: `npm view jona-ui@1.5.2 version` returns `1.5.2`, else STOP.
- [ ] b1a.2 RED: the pin assertion (locate it with `rg "1\.5\.1" src test`) expects `"1.5.2"` with no range. GREEN `package.json` and the lock (`npm install jona-ui@1.5.2 --save-exact`).
- [ ] b1a.3 RED `src/styles/appStyles.spec.ts`: the cascade stopgap rules are gone from `src/styles/app.css`, and the shell hamburger is still hidden from 1024 px (the lib now covers it). GREEN: delete those rules. Gate; dev check at 1024 px.

W1-W3 assertions changed: the pin value only. Commit: `chore(softcommerce): pin jona-ui 1.5.2 and drop the cascade stopgap`.

## Slice a2a: tokens, theme mode, type scale, base.css (branch `feat/softcommerce-a2a-tokens-theme`, base: b1a)

Specs: R-FND-3 (tokens, contrast), R-FND-4, R-FND-5, R-FND-6; S-FND-6, 7, 9, 10, 11, 12, 13, 14, 16, 25, 26. Design: D5, D6, D7, D8 (tokens). Forecast ~780 (flagged).

**Applied as the fallback split** (a2a-i 694 lines; a2a-i + a2a-ii over 800 together): `feat/softcommerce-a2a-tokens-theme-i` = a2a.1-a2a.3 + a2a.6, `feat/softcommerce-a2a-tokens-theme-ii` = a2a.4-a2a.5 (561 lines, the theme-mode story moved here because it needs a2a.4); the planned name `feat/softcommerce-a2a-tokens-theme` points at the a2a-ii tip. Base: the tracker @ `1d53c20f` (b1a reordered after a2b by the orchestrator).

- [x] a2a.1 RED `src/theme/__tests__/tokens.test.ts`:
  - S-FND-6: every semantic token has a light value (a `var()` to the palette on `:root, [data-jona-scope]`) and each `danger`/`success`/`warning` 50/100/700 tint is a palette step (an RGB triplet on `:root`); all of them have a dark value, only under the `data-theme-mode` selectors, with `color-scheme: dark`;
  - S-FND-25: without the attribute, the component tokens are light and the chart selectors are unchanged;
  - S-FND-13: the six text styles;
  - S-FND-16: the density tokens, with `[data-jona-density]` overriding `--jona-control-h` only.

  GREEN `src/theme/tokens.css`.
- [x] a2a.2 RED `src/__tests__/quality/contrast.test.ts`: S-FND-7 for each mode. GREEN: tune the dark values.
- [x] a2a.3 RED S-FND-12: the `JonaThemeProvider` overrides apply in both modes; a non-root scope sets `data-jona-scope`; the new `JonaThemeTokens` keys exist. GREEN `src/theme/ThemeProvider.tsx`.
- [x] a2a.4 RED `src/theme/__tests__/themeMode.test.tsx`:
  - S-FND-9 (`matchMedia` live), S-FND-10, S-FND-11 (persisted; `blue` -> `system`);
  - S-FND-26 (`applyStoredThemeMode`, and `themeInitScript` serialises it).

  GREEN `src/theme/{InterThemeMode.ts,ThemeModeImpl.tsx,ThemeMode.tsx,themeInit.ts,index.ts}`, root exports.
- [x] a2a.5 RED S-FND-14 (`src/styles/base.css` styles `body` and `h1`-`h3`; the compiled `index.css` has no body/h1-h3 rule beyond preflight; `dist/base.css` checked after `npm run build`) and `packageExports` `./base.css`. GREEN `src/styles/base.css`, the `vite.config.ts` copy, the `package.json` exports.
- [x] a2a.6 Add `src/theme/tokenClasses.ts` constants (surface, fg, line, focus, selection, control height, text scale); `classCoverage` covers their literals (D5). Theme-mode story (shipped with a2a.4 in a2a-ii). Gate.

W1-W3 assertions changed: none. Commits: (1) `feat(uijona): add semantic light and dark tokens, type scale and density tokens` a2a.1-a2a.3; (2) `feat(uijona): add token class constants` a2a.6 (a2a-i tip); (3) `feat(uijona): add theme mode provider and init script` a2a.4 + story; (4) `feat(uijona): ship opt-in base.css` a2a.5 (a2a-ii tip).

## Slice a2b: component token migration (branch `feat/softcommerce-a2b-token-migration`, base: a2a)

Specs: R-FND-3 (lint), R-FND-5 (lib titles), R-FND-7 (1.6.0 density), R-DAT-1 (1.6.0); S-FND-8, S-FND-15 (JDialog, JDrawer), S-FND-18 (1.6.0 half), S-DAT-2 (dark half). Forecast ~760 (flagged).

**Applied as the fallback split** (a2b-i + a2b-ii = 858 lines before the split): `feat/softcommerce-a2b-token-migration-i` = a2b.1, a2b.2, a2b.4 (456 lines); `feat/softcommerce-a2b-token-migration-ii` = a2b.3 plus the a1/a3 deferred items assigned to a2b (status-tint repaint, JNavbar content width, JHeaderPage/JFooterPage `w-auto`) and the Storybook `Tema` toolbar (478 lines, golden JSON excluded); the planned name `feat/softcommerce-a2b-token-migration` points at the a2b-ii tip.

- [x] a2b.1 RED `src/__tests__/quality/tokenLint.test.ts` with `src/__tests__/quality/darkModeAllowlist.ts`: S-FND-8 over the lib source strings (Views, Inter and Impl files; stories, tests and `tokenClasses.ts` excluded) and `index.css`. The allowlist only shrinks: each entry must still exist and still violate. GREEN `src/styles/index.css` hard-coded colors -> tokens (jcheckbox ring, skeleton `#e5e7eb`/`#f9fafb`, `.jtextbox-icon #6b7280`, shimmer, the `var(--danger-500, #ef4444)`-style fallbacks).
- [x] a2b.2 GREEN: migrate the atoms to `tokenClasses` (JButton, JTextBox, JTextArea, JComboBox, JCheckBox, JRadioButton, JLabel/JIcon/JChip, JBadge, JSkeleton, avatar) and drop them from the allowlist. Applied to every atom (also JDot, JGlyph, JPanel, JProgress, JSeparator, JSpinner, JSwitch); JIcon and JAvatar had no raw color.
- [x] a2b.3 GREEN: migrate the molecules and layouts the app renders or that 1.6.0 pieces compose (JDialog, JOptionPane, JDrawer, JTable, JTabs, JPagination, JDatePicker, JToast, JAlert, JDropdown, JSearchInput, JBreadcrumb, JEmptyState, JStepper, JFormField, JSidebarLayout; confirm the names with `fd` at apply). JDialog and JDrawer titles use the type scale (S-FND-15). JFormField had no raw color.
- [x] a2b.4 RED:
  - S-DAT-2 dark half: the selected and hover tokens differ in dark;
  - S-FND-18 (1.6.0 half): `auto` uses `min-h-[var(--jona-control-h)]`, an ancestor `[data-jona-density]` changes it, and an explicit `touch`/`compact` wins.

  GREEN: JTableRow uses the selection token; JButton `auto`. Spot-check dark in Storybook. Gate.

1.5.1 lib assertions that named raw palette classes are updated and listed in the PR (behavior unchanged). W1-W3: none. Commits: (1) `feat(uijona): add token lint and tokenize index.css colors` a2b.1; (2) `feat(uijona): migrate atoms to semantic tokens` a2b.2, a2b.4 (a2b-i tip); (3) `feat(uijona): migrate molecules and layouts to semantic tokens` a2b.3 + status tints; (4) `fix(uijona): give header and footer slots their content width and cap the navbar row`; (5) `docs(uijona): add a Tema toolbar to Storybook to preview dark mode` (a2b-ii tip).

## Slice a4: form primitives (branch `feat/softcommerce-a4-forms`, base: a2b)

Specs: R-FRM-1, 2, 3, 4, 6, R-FND-9; S-FRM-1..9, 12..16, S-FND-15 (JFormSection), S-FND-22 (introduced). Design: D11. Forecast ~760 (flagged).

**Split applied at a different task boundary than the named fallback** (a4.1-a4.3 alone measured 752 lines, so a4.1-a4.5 could not fit): `feat/softcommerce-a4-forms-i` = a4.1-a4.3 (752 lines); `feat/softcommerce-a4-forms-ii` = a4.4-a4.7 (708 lines); the planned name `feat/softcommerce-a4-forms` points at the a4-ii tip. Exports and stories ship with each piece's commit.

- [x] a4.1 RED `src/__tests__/quality/componentPattern.test.ts`: S-FND-22 over the list of 1.6.0 folders. Every later lib slice appends its folders. (The R-FND-8 1.6.0 subpath list lives in `packageExports.test.ts`; each slice appends to it too.)
- [x] a4.2 RED `src/molecules/__tests__/JField.test.tsx`: S-FRM-1, 2, 3, 4, axe. GREEN `src/molecules/JField/*` (render-prop children, `requiredLabel='obligatorio'`, `span` default 6, `as='fieldset'`).
- [x] a4.3 RED `src/layouts/__tests__/JFieldGrid.test.tsx`: S-FRM-5 (12 columns from `md`, spans 3/4/6/12, one column below `md`, classes in the compiled CSS). GREEN `src/layouts/JFieldGrid/*`.
- [x] a4.4 RED `src/molecules/__tests__/JFormSection.test.tsx`: S-FRM-6, S-FND-15 (title style). GREEN `src/molecules/JFormSection/*`.
- [x] a4.5 RED `src/molecules/__tests__/JErrorSummary.test.tsx`: S-FRM-7, 8, 9. GREEN `src/molecules/JErrorSummary/*`.
- [x] a4.6 RED `src/molecules/__tests__/JDatePicker.test.tsx` (new cases): S-FRM-12, 13, 14, 15; the existing cases stay unchanged (S-FRM-16). GREEN `src/molecules/JDatePicker/*`: `forwardRef`, `id`, `name`, `label`, `error`, `required`, aria props, `onBlur(value)`; the story documents the `dd/MM/yyyy` + `iso` recipe.
- [x] a4.7 Exports, stories. Gate.

W1-W3: none. Commits: (1) `feat(uijona): add JField and JFieldGrid` a4.1-a4.3 (a4-i tip); (2) `feat(uijona): add JFormSection and JErrorSummary` a4.4-a4.5; (3) `feat(uijona): add label, error and ref to JDatePicker` a4.6-a4.7 (a4-ii tip).

## Slice a5: feedback (branch `feat/softcommerce-a5-feedback`, base: a4)

Specs: R-FBK-1..6; S-FBK-1..16. Design: D9 (confirm Esc). Forecast ~600.

**Split at a task boundary** (no named fallback; a5.1-a5.2 alone measured 616 lines, the toast work would have taken the slice to ~963): `feat/softcommerce-a5-feedback-i` = a5.1-a5.2 (616 lines plus a 182-line generated snapshot); `feat/softcommerce-a5-feedback-ii` = a5.3-a5.4 (347 lines); the planned name `feat/softcommerce-a5-feedback` points at the a5-ii tip. The useConfirm exports and its confirm-over-a-dialog story ship with a5.2; the JOptionPane `details` story with a5.1.

- [x] a5.1 RED `src/molecules/__tests__/JOptionPane.test.tsx`: S-FBK-11 (`details` is inside the pane and its description; without it, the 1.5.1 snapshot), `initialFocus`. GREEN `src/molecules/JOptionPane/*` (`JOPTIONPANE_DEFAULTS` unchanged).
- [x] a5.2 RED `src/hooks/__tests__/useConfirm.test.tsx`:
  - S-FBK-1..7;
  - S-FBK-8: the window-capture Esc interceptor leaves a `JDialog` beneath open; with `renderPane`, the host owns Esc;
  - S-FBK-9 (FIFO), S-FBK-10 (unmount resolves `false`).

  GREEN `src/hooks/useConfirm/*` (`CONFIRM_DEFAULTS`, focus `cancel` for danger).
- [x] a5.3 RED `src/hooks/__tests__/useToast.test.tsx`: S-FBK-12..16 (`danger` is `role="alert"`, `duration: 0` persists, the timer pauses on hover/focus, no focus steal, `label`/`dismissLabel`/`offset`, the default position unchanged). GREEN `src/hooks/useToast/*`, `src/molecules/JToast/*`.
- [x] a5.4 Stories (confirm over a dialog; ToastProvider `top-right` recommendation, R-FBK-6), exports. Gate.

1.5.1 lib assertion changed: a `danger` toast found as `status` becomes `alert` (named fix, 1.6.0 CHANGELOG). At apply no lib test asserted a danger toast as `status`, so no existing assertion changed. W1-W3: none. Commits: (1) `feat(uijona): add JOptionPane details and initial focus` a5.1; (2) `feat(uijona): add useConfirm and ConfirmProvider` a5.2 (a5-i tip); (3) `fix(uijona): announce danger toasts as alerts and add toast options` a5.3-a5.4 (a5-ii tip).

## Slice a6: page chrome (branch `feat/softcommerce-a6-page-chrome`, base: a5)

Specs: R-DAT-5, 6, 7, R-FRM-5, R-CHR-6, R-CHR-7 (Esc rule, toolbar overflow); S-DAT-16..22, S-FRM-10, 11, S-CHR-20, S-FND-15 (JPageHeader). Design: D9. Forecast ~790 (flagged).

**Split at task boundaries** (the named fallback could not hold: a6.1-a6.2 measured 836 lines, and a6.2 plus a6.3 measured 854): `feat/softcommerce-a6-page-chrome-i` = a6.1 (265 lines); `-ii` = a6.2 (578); `-iii` = a6.3-a6.6 (652 plus a 3-line generated snapshot); the planned name `feat/softcommerce-a6-page-chrome` points at the a6-iii tip. Exports and stories ship with each component's commit.

- [x] a6.1 RED `src/lib/__tests__/roving.test.ts` and `src/lib/__tests__/menuPopup.test.tsx`: roving index math; the menu root handles Esc with `preventDefault` + `stopPropagation`; an outside `pointerdown` closes. GREEN `src/lib/roving.ts`, `src/lib/menuPopup.ts` (internal, not exported).
- [x] a6.2 RED `src/molecules/__tests__/JToolbar.test.tsx`: S-DAT-16..21, and an overflow Esc leaves a `JDialog` beneath open. GREEN `src/molecules/JToolbar/*`.
- [x] a6.3 RED `src/molecules/__tests__/JPageHeader.test.tsx`: S-CHR-20, S-FND-15. GREEN `src/molecules/JPageHeader/*` (`forwardRef` to the heading).
- [x] a6.4 RED `src/molecules/__tests__/JInputGroup.test.tsx`: S-FRM-10, S-FRM-11 (the `lookup` preset is `10rem 1fr auto` from `sm`, bottom-aligned; `columns` through a CSS variable). GREEN `src/molecules/JInputGroup/*`.
- [x] a6.5 RED `src/molecules/__tests__/JPagination.test.tsx`: S-DAT-22. GREEN `src/molecules/JPagination/*`.
- [x] a6.6 Exports, stories. Gate.

W1-W3: none. Commits: (1) `feat(uijona): add roving focus and menu popup helpers` a6.1 (a6-i tip); (2) `feat(uijona): add JToolbar` a6.2 (a6-ii tip); (3) `feat(uijona): add JPageHeader and JInputGroup` a6.3-a6.4; (4) `feat(uijona): add JPagination rows info` a6.5-a6.6 (a6-iii tip). The orchestrator's extra item (the dark `BACKDROP`) is deferred to a10: it changes the class string pinned by the a5 S-FBK-11 approval snapshot; the ready commit is parked on `feat/softcommerce-a10-backdrop-candidate`.

## Slice a7: data grid (branch `feat/softcommerce-a7-data-grid`, base: a6)

Specs: R-DAT-2, 3, 4; S-DAT-3..15. Design: D10. Forecast ~760 (flagged).

**Named fallback applied:** `feat/softcommerce-a7-data-grid-i` = a7.1-a7.2 with the exports and the base story (594 lines); `-ii` = a7.3 (213); the planned name points at the a7-ii tip.

- [x] a7.1 RED `src/molecules/__tests__/JDataGrid.test.tsx`: S-DAT-3, 4, 5, axe. GREEN `src/molecules/JDataGrid/*` on the JTable primitives.
- [x] a7.2 RED: S-DAT-6..11 and the `JDataGridHandle.focusRow(key)` handle. GREEN: keyboard through `src/lib/roving.ts`, selection follows focus.
- [x] a7.3 RED: S-DAT-12, 13, 14, 15, `maxHeight` through a CSS variable, `muted`, the badge as the description. GREEN: states and `rowState`. Exports, story. Gate.

W1-W3: none. Commits: (1) `feat(uijona): add JDataGrid roles, selection and keyboard` a7.1-a7.2; (2) `feat(uijona): add JDataGrid loading, empty and row states` a7.3.

## Slice a8: navigation (branch `feat/softcommerce-a8-navigation`, base: a7)

Specs: R-CHR-2, 3, 4, R-CHR-5 (`JTabs keepMounted`); S-CHR-5..13, 19; the `JTabsTrigger` `invalid`/`count` lib contract used by R-MD-1. Forecast ~740.

**Split at a task boundary** (a8 had no named fallback; JTreeNav alone measured 1,081 lines): `feat/softcommerce-a8-navigation-i` = a8.1-a8.2 with the JTreeNav exports and base story (683 lines); `-ii` = a8.3-a8.5 (704); the planned name points at the a8-ii tip.

- [x] a8.1 RED `src/molecules/__tests__/filterTree.test.ts`: the pure `filterTree` (case- and accent-insensitive, ancestors expanded, no check propagation). GREEN `src/molecules/JTreeNav/filterTree.ts`.
- [x] a8.2 RED `src/molecules/__tests__/JTreeNav.test.tsx`: S-CHR-5..10, axe. GREEN `src/molecules/JTreeNav/*`, `nav` variant.
- [x] a8.3 RED: S-CHR-11, 12 (the filter box, restored expansion), S-CHR-13 (checkbox), `maxHeight`. GREEN: filter and checkbox variant.
- [x] a8.4 RED `src/molecules/__tests__/JTabs.test.tsx` (new cases): S-CHR-19; `JTabsTrigger invalid` gives the description `Con errores` with the name unchanged; `count`. The 1.5.1 cases stay unchanged. GREEN `src/molecules/JTabs/*`.
- [x] a8.5 Exports, stories. Gate.

W1-W3: none. Commits: (1) `feat(uijona): add JTreeNav and filterTree` a8.1-a8.2 (+ exports, base story; a8-i tip); (2) `feat(uijona): add JTreeNav filter box and checkbox variant` a8.3; (3) `feat(uijona): add JTabs keepMounted and trigger indicators` a8.4-a8.5 (a8-ii tip).

## Slice a9a: app shell, user menu, context chip (branch `feat/softcommerce-a9a-app-shell`, base: a8)

Specs: R-CHR-1, R-CHR-7; S-CHR-1..4, 21, 22, 23. Design: D9. Forecast ~620.

**Split at a task boundary** (a9a had no named fallback; JAppShell alone measured 505 lines): `feat/softcommerce-a9a-app-shell-i` = a9a.1 with its exports and story (505); `-ii` = a9a.2-a9a.3 plus a JAppShell topbar fix (693); the planned name points at the a9a-ii tip.

- [x] a9a.1 RED `src/layouts/__tests__/JAppShell.test.tsx`: S-CHR-1..4; drawer Esc on its own root and focus returns to `Abrir menú`; axe. GREEN `src/layouts/JAppShell/*`.
- [x] a9a.2 RED `src/molecules/__tests__/JUserMenu.test.tsx`: S-CHR-21, 22; Esc leaves a `JDialog` beneath open; an outside press closes. GREEN `src/molecules/JUserMenu/*` on `menuPopup`.
- [x] a9a.3 RED `src/molecules/__tests__/JContextChip.test.tsx`: S-CHR-23. GREEN `src/molecules/JContextChip/*`. Exports, stories. Gate.

W1-W3: none. Commits: (1) `feat(uijona): add JAppShell` a9a.1 (a9a-i tip); (2) `fix(uijona): let the JAppShell topbar end shrink before the brand` (found by the a9a-ii visual check); (3) `feat(uijona): add JUserMenu and JContextChip` a9a.2-a9a.3 (a9a-ii tip).

## Slice a9b: workspace tabs, shortcut sheet (branch `feat/softcommerce-a9b-workspace-tabs`, base: a9a)

Specs: R-CHR-5 (JWorkspaceTabs), R-CHR-8, R-CHR-3 (focusFilter); S-CHR-14..18, 24. Forecast ~560.

**Split at a task boundary** (a9b had no named fallback; JWorkspaceTabs alone measured 783 lines): `feat/softcommerce-a9b-workspace-tabs-i` = a9b.1 with its exports and story (783); `-ii` = a9b.2-a9b.3 plus a JShortcutSheet separator fix (357); the planned name points at the a9b-ii tip.

- [x] a9b.1 RED `src/organisms/__tests__/JWorkspaceTabs.test.tsx`: S-CHR-14..18; the overflow Esc rule; the `focusPanel(id)` handle. GREEN `src/organisms/JWorkspaceTabs/*`.
- [x] a9b.2 RED `src/molecules/__tests__/JShortcutSheet.test.tsx`: S-CHR-24. GREEN `src/molecules/JShortcutSheet/*`. Exports, stories. Gate.
- [x] a9b.3 (orchestrator item) RED `src/molecules/__tests__/JTreeNav.test.tsx` (new cases): the `JTreeNavHandle.focusFilter()` ref focuses the filter box and selects its text, and does nothing without it. GREEN: `JTreeNav` forwards the handle (additive; R-CHR-3 and the design Interfaces note aligned).

W1-W3: none. Commits: (1) `feat(uijona): add JWorkspaceTabs` a9b.1 (a9b-i tip); (2) `feat(uijona): add JShortcutSheet` a9b.2; (3) `feat(uijona): add a JTreeNav focusFilter handle` a9b.3; (4) `fix(uijona): paint the JShortcutSheet row separators with the line token` (found by the a9b visual check; a9b-ii tip).

## Slice a10: auth layout and release 1.6.0 (branch `feat/softcommerce-a10-auth-release`, base: a9b)

Specs: R-CHR-9, R-FND-8; S-CHR-25, 26, 27, S-FND-15 (JAuthLayout), S-FND-19, 20, 21, 22 (sweep). Forecast ~520. Measured 600 (the two regenerated snapshots and the golden JSON excluded), no split.

- [x] a10.1 RED `src/layouts/__tests__/JAuthLayout.test.tsx`: S-CHR-25, 26, 27, S-FND-15. GREEN `src/layouts/JAuthLayout/*` (JStepper `aria-current="step"`; `currentStep` is a step id).
- [x] a10.2 RED sweeps: S-FND-19 (every component and hook folder is in the root entry and the export map; the 1.6.0 list in `packageExports`); S-FND-22 (the `componentPattern` list equals the design placement); `classCoverage` and `tokenLint` green. GREEN: no gap (MUTATION evidence).
- [x] a10.3 CHECK S-FND-20: the 1.5.1 lib suite (the 33 test files at `ad092390`, unchanged) passes against the a10 sources: 33 files / 281 tests.
- [x] a10.4 (orchestrator items) the dark `BACKDROP` (`cf5d980a`) with the S-FBK-11 snapshot regenerated; the dark gate: `JAccordion` (used by softcommerce) leaves the allowlist; the JTable header label and the JPagination chevron layout fixes (S-DAT-22 snapshot regenerated); the jpanelOverrides `added` line numbers regenerated.
- [x] a10.5 The 1.6.0 checklist without the bump: CHANGELOG 1.6.0, README (`base.css`, `themeInitScript`, the `top-right` toast recommendation), lint, test, build, build-storybook, `npm pack --dry-run` (lists `dist/base.css` and every export target). Gate.
- [x] a10.6 After the owner confirms `1.6.0` (`npm view jona-ui versions` does not list it): `npm version 1.6.0 --no-git-tag-version` in `web_ts/uijona` (package and lock), then commit `chore(uijona): release 1.6.0`. Owner confirmed 2026-10-30; 1.5.2 is not published, so the CHANGELOG states that 1.6.0 ships the 1.5.2 changes. Preceded by the JStepper dark fix (current step number on `FG`).

Deferred from a6 (**approved by the orchestrator for a10**, with the S-FBK-11 JOptionPane snapshot regenerated as named churn): the dark `BACKDROP`. Landed in a10 (`fb20145d`): `--jona-backdrop`/`--jona-backdrop-alpha` (light neutral-900 at 0.5, unchanged; dark black at 0.7) and a contrast test (a dialog surface beneath dims >= 1.3:1; it was 1.11:1). The S-FBK-11 approval snapshot changes only in the `BACKDROP` class string.

W1-W3: none. Named churn (spec deltas aligned): the S-FBK-11 JOptionPane snapshot (backdrop token), the S-DAT-22 JPagination snapshot (chevron wrapper spans) and the jpanelOverrides golden `added` list (S-FND-24). Commits: (1) `fix(uijona): keep the modal backdrop visible over a dark page`; (2) `feat(uijona): add JAuthLayout` a10.1; (3) `feat(uijona): migrate JAccordion to semantic tokens`; (4) `fix(uijona): lay out the JTable header label as a row`; (5) `fix(uijona): keep the JPagination chevrons beside the Previous and Next labels`; (6) `test(uijona): sweep exports and component pattern for 1.6.0` a10.2-a10.3; (7) `docs(uijona): prepare the 1.6.0 changelog and readme` a10.5; (8) `test(uijona): give the JShortcutSheet separator test the stylesheet compile timeout` (a10 tip). (9) `fix(uijona): paint the JStepper current step number with the fg token` `41e028fd`; (10) `chore(uijona): release 1.6.0` a10.6 `a5feb5ca` (tip).

**Gate 2**: tracker -> `main` and GitHub Release `v1.6.0`, both by the owner, then `npm view` confirms it.

## Slice b1: adopt 1.6.0, providers, theme, CSS contract (branch `feat/softcommerce-b1-adopt-160`, base: a10)

Specs: R-CRUD-9, R-UX-2, R-UX-5 (init), R-UX-6; S-CRUD-21, S-UX-4, 17, 18 (reload half), 19, 20. Design: D9 (release), D12. Forecast ~700 (flagged).

- [ ] b1.1 Preflight: `npm view jona-ui@1.6.0 version` returns `1.6.0`, else STOP.
- [ ] b1.2 RED: the pin assertion expects `"1.6.0"` (S-CRUD-21). GREEN `package.json` and the lock; add the `axe-core` devDependency and `src/test/axe.ts`.
- [ ] b1.3 RED `src/views/uishell/DialogStackProvider.spec.tsx`:
  - S-UX-4: one toast container (`Notificaciones`, top-right) and one confirm provider at `/login` and at `/`; a nested provider is a passthrough; a confirm over a register closes alone with one Esc;
  - D9: a stopped Esc does not leave the stack stuck (`setTimeout(0)` release).

  GREEN `src/views/uishell/DialogStackProvider.tsx` (ToastProvider + ConfirmProvider with `renderPane` = GuardedOptionPane); `src/App.tsx` mounts it once inside the router, around every route.
- [ ] b1.4 RED `src/shared/feedback/useNotify.spec.tsx`: the success titles, 4 s, the verbatim server message; errors are `danger` with `duration: 0`. GREEN `src/shared/feedback/useNotify.ts`.
- [ ] b1.5 RED: `vite.config.ts` `transformIndexHtml` injects `themeInitScript()`; S-UX-17 (no stored mode and OS dark -> root `dark`); S-UX-18 reload half (stored `light` -> `light` at `/login`). GREEN `vite.config.ts`, `src/main.tsx` (imports `jona-ui/base.css`; `JonaThemeModeProvider` around the `BrowserRouter` with the v7 flags).
- [ ] b1.6 `git mv src/styles/appStyles.spec.ts src/styles/cssContract.spec.ts`. RED:
  - S-UX-19: the className tokens are a subset of the dist CSS plus `app.css`; a `foo-bar` fixture fails and is named;
  - S-UX-20: no color literal; the inline-style allowlist lists today's entries, each with a reason.

  GREEN: remove the `#e5e5e5` literal from `src/views/uishell/ShellHeaderView.tsx` (the header is rebuilt in b3). Gate.

W1-W3 assertions changed: the S-CRUD-21 pin value; the `appStyles.spec.ts` assertions move into `cssContract.spec.ts` with their meaning kept. Commits: (1) `chore(softcommerce): pin jona-ui 1.6.0` b1.2; (2) `feat(softcommerce): mount toast and confirm providers in DialogStackProvider` b1.3-b1.4; (3) `feat(softcommerce): apply the stored theme before first paint` b1.5; (4) `test(softcommerce): evolve appStyles spec into the css contract` b1.6.

## Slice b2: auth flow (branch `feat/softcommerce-b2-auth`, base: b1)

Specs: R-AUTH-5, R-AUTH-7, R-AUTH-14, R-UX-3 (login), R-UX-9; S-AUTH-32..42, S-UX-5, 6, 24 (auth half). Forecast ~650.

- [ ] b2.1 RED `src/domain/period.spec.ts`: S-AUTH-33 pure (with now = 2026-10-24: 01/01/2026 to today; the clamp to `INICIO_ACTIVIDADES` applies only while `Desde` is untouched). GREEN `src/domain/period.ts` `defaultPeriod(now, inicioActividades?)`.
- [ ] b2.2 RED `src/views/uilogin/UiLogin.spec.tsx`: S-AUTH-40 (step 1), S-AUTH-41, S-UX-5, S-UX-24 (auth card), axe. GREEN `src/views/uilogin/*` on JAuthLayout + JField; tenant `Reintentar`.
- [ ] b2.3 RED `src/views/uicontexto/UiContexto.spec.tsx`: S-AUTH-32, 33 (UI), 34, 38, 40 (step 2), 42, S-UX-6. GREEN `src/views/uicontexto/*`: the `Período` JFormSection with the period error; `Desde`/`Hasta` JDatePicker (`mask='dd/MM/yyyy'`, `valueFormat='iso'`); the `Conectado como` line; `Cambiar usuario`; the punto de venta loading state.
- [ ] b2.4 RED `src/App.spec.tsx`: S-AUTH-35, 36, 37, 39, keeping PR #107's tests and adding only the missing ones. GREEN `src/App.tsx` (the `/contexto` redirect, if missing).
- [ ] b2.5 Churn below; shrink the allowlist (`UiLoginView.tsx:28`, `UiContextoView.tsx:31`). Gate.

W1-W3 assertions changed: `UiContexto.spec.tsx:56-57`, `UiContexto.grants.spec.tsx` and `App.spec.tsx:45-46` query `Desde`/`Hasta` labels instead of the `Fecha inicio`/`Fecha fin` placeholders, and clear the default first. The S-AUTH-11..16 assertions are unchanged. Commits: (1) `feat(softcommerce): add default period` b2.1; (2) `feat(softcommerce): rebuild login on JAuthLayout` b2.2; (3) `feat(softcommerce): rebuild contexto with labelled period and cambiar usuario` b2.3-b2.5.

## Slice b3: shell chrome (branch `feat/softcommerce-b3-shell-chrome`, base: b2)

Specs: R-SHELL-5, R-UX-5 (radio), R-UX-9; S-SHELL-15, 26, 29, S-UX-17 (radio), 18, 24 (banner). Forecast ~620.

- [ ] b3.1 RED `src/views/uishell/ShellHeader.spec.tsx`: S-SHELL-15, S-SHELL-29, S-UX-24 (banner), S-UX-17 (`Sistema` checked), S-UX-18 (`Claro` survives a logout and another login). GREEN `src/views/uishell/ShellHeader*`:
  - JContextChip: empresa, punto de venta, period as `dd/MM/yyyy–dd/MM/yyyy`, with the tenant in the description;
  - JUserMenu: the header, `Base de datos: {tenant}`, the `Tema` radio through `useThemeMode`, `Cerrar sesión` (danger).
- [ ] b3.2 RED `src/views/uishell/UiShell.spec.tsx`: S-SHELL-26 (banner, navigation and main; `Abrir menú` hidden from `lg` per the shipped CSS; the rail toggle); the empty-workspace text is kept. GREEN `src/views/uishell/UiShellView.tsx` on JAppShell (brand `SoftCommerce`, empty state through JEmptyState); `src/App.tsx` drops its inline flex.
- [ ] b3.3 Churn below; shrink the allowlist. Gate.

W1-W3 assertions changed:
- `ShellHeader.spec.tsx:63,71`: `Cerrar sesión` is a `menuitem`;
- `App.spec.tsx:54-56,65`: banner text, and logout through the menu (S-AUTH-18 meaning kept).

Commits: (1) `feat(softcommerce): add topbar context chip and user menu with theme` b3.1; (2) `feat(softcommerce): render the shell in JAppShell` b3.2-b3.3.

## Slice b4: menu (branch `feat/softcommerce-b4-menu`, base: b3)

Specs: R-SHELL-2, R-SHELL-5 (empty workspace), R-UX-1 (unavailable); S-SHELL-5, 17, 18, 19, 20, 27. Forecast ~650.

- [ ] b4.1 RED `src/domain/menuTree.spec.ts`: an unregistered leaf becomes `disabled` with `badge: 'Próximamente'`; `menuPath(id)`. GREEN `src/domain/menuTree.ts`.
- [ ] b4.2 RED `src/session/recentForms.spec.ts`: S-SHELL-19 (the last 5, deduplicated, `softcommerce.recent.{tenant}.{user}` in sessionStorage, registered and visible only). GREEN `src/session/recentForms.ts`.
- [ ] b4.3 RED `src/shared/ui/MenuTree/MenuTree.spec.tsx` and `UiShell.spec.tsx`:
  - S-SHELL-5: the info toast through `useNotify`, no tab, no modal;
  - S-SHELL-17, 18, 20;
  - the `Cargando...` and `Reintentar` states.

  GREEN `src/shared/ui/MenuTree/*` as an adapter over JTreeNav (`Menú principal`, `Buscar opción`); `UiShellImpl` handles the selection.
- [ ] b4.4 RED: S-SHELL-27 (up to 6 Recientes shortcuts in the empty workspace). GREEN `UiShellView`. Churn; gate.

W1-W3 assertions changed:
- `MenuTree.spec.tsx`: tree roles;
- `UiShell.spec.tsx`: the unknown-leaf notice becomes a toast;
- `App.spec.tsx:57`: `button 'Maestros'` becomes `treeitem 'Maestros'`.

Commits: (1) `feat(softcommerce): add menu tree mapping and recent forms` b4.1-b4.2; (2) `feat(softcommerce): render the menu as JTreeNav with filter and Recientes` b4.3-b4.4.

## Slice b5: workspace tabs, dirty guards, shell keys (branch `feat/softcommerce-b5-workspace-dirty`, base: b4)

Specs: R-SHELL-4, R-SHELL-6, R-UX-3 (tab close), R-UX-4; S-SHELL-21, 22, 23, 24, 28, S-UX-8, 13, 14, 15, 16. Design: D9 (`useGuardedClose`), D13. Forecast ~780 (flagged).

- [ ] b5.1 RED `src/views/uishell/workspaceDirty.spec.tsx`: the store keyed by form id and source; `useReportDirty`; `FormIdContext`. GREEN `src/views/uishell/workspaceDirty.tsx`; `FormHost.tsx` provides `FormIdContext`; `UiCrudRegisterImpl` reports `open && dirty`.
- [ ] b5.2 RED `UiShell.spec.tsx`: S-SHELL-21, 22, 23, 24, S-UX-8. GREEN `UiShellView` on JWorkspaceTabs (dirty from the store); the close, logout and unload guards use `useConfirm` danger. The reducer is untouched (D13).
- [ ] b5.3 RED `src/domain/shellShortcuts.spec.ts`: S-UX-15, 16 (the key-map data is unique, has no Ctrl+Alt, and matches physical codes). GREEN `src/domain/shellShortcuts.ts`.
- [ ] b5.4 RED `src/views/uishell/UiShell.keys.spec.tsx`: S-SHELL-28, S-UX-13, 14; Ctrl+K opens the drawer below 1024 px. GREEN: the `UiShellImpl` key handler; JShortcutSheet with `useGuardedClose`, listing the R-CRUD-10 keys, the grid keys and the shell keys. Churn; gate.

W1-W3 assertions changed: `UiShell.spec.tsx:93,103,113` keep the name `Cerrar pestaña {title}`, now outside the `tablist`. `workspace.spec.ts` is unchanged (it is asserted untouched). Commits: (1) `feat(softcommerce): add workspace dirty store and tab guards` b5.1-b5.2; (2) `feat(softcommerce): add shell shortcuts and the shortcut sheet` b5.3-b5.4.

## Slice b6: list page (branch `feat/softcommerce-b6-list-page`, base: b5)

Specs: R-CRUD-1, R-CRUD-2, R-CRUD-8 (grid), R-UX-3 (tab open), R-UX-7; S-CRUD-1, 7, 51, 52, 53, 54, 55, 56, 57, S-UX-7, 22. Forecast ~790 (flagged).

- [ ] b6.1 RED `src/domain/crud/openMode.spec.ts`: S-CRUD-7 pure (DETAIL, else UPDATE, else nothing). GREEN `src/domain/crud/openMode.ts`.
- [ ] b6.2 RED `src/shared/ui/CrudToolbar/CrudToolbar.spec.tsx`: S-CRUD-56, 57, the overflow half of S-CRUD-55. GREEN `src/shared/ui/CrudToolbar/*` on JToolbar (groups, the `Más acciones` overflow with `Buscar`/`Exportar`, `disabledReason`, `shortcut`); the reasons in `src/domain/crud/toolbarGate.ts`.
- [ ] b6.3 RED `src/shared/ui/CrudGrid/CrudGrid.spec.tsx`: S-CRUD-52, 53, 54, S-CRUD-1 (initial skeleton, refresh `aria-busy`). GREEN `src/shared/ui/CrudGrid/*` as an adapter over JDataGrid, forwarding `focusRow`.
- [ ] b6.4 RED `src/views/uicrudlist/UiCrudList.page.spec.tsx`:
  - S-CRUD-51; S-CRUD-55 (Alt+B focuses `Filtro` and selects its text);
  - S-UX-7 (opening the tab focuses the heading), S-UX-22;
  - the empty state with `Agregar` and `Limpiar filtro`; `Actualizar` and `Reintentar` keep the rows.

  GREEN `src/views/uicrudlist/*`: JPageHeader with breadcrumbs from `menuPath`, the count, and the `Filtro` search; JPagination rows info; `openMode` on Enter and double-click. Churn; shrink the allowlist; gate.

W1-W3 assertions changed:
- `CrudToolbar.spec.tsx`: the `title` wrapper becomes a description; `Buscar` and `Exportar` move into `Más acciones`;
- `CrudGrid.spec.tsx`: `aria-selected` inside `role="grid"`;
- `localidad.config.spec.tsx`: the toolbar;
- `UiCrudListStates.spec.tsx`, `UiCatalog.spec.tsx`: loading and empty states.

The 7 `Filtro` specs and S-CRUD-4 are unchanged. Commits: (1) `feat(softcommerce): rebuild CrudToolbar on JToolbar with working Buscar` b6.1-b6.2; (2) `feat(softcommerce): rebuild the list on JPageHeader and JDataGrid` b6.3-b6.4.

## Slice b7a1: shared field views on JField (branch `feat/softcommerce-b7a1-field-views`, base: b6)

Specs: R-CRUD-21 (fields), R-CRUD-9 (`DateField`); S-CRUD-61 (per kind). Forecast ~520.

- [ ] b7a1.1 RED, one spec per view (`src/shared/ui/<View>/<View>.spec.tsx`): S-CRUD-61 per kind (exact name, required, `aria-invalid`, the message in the description, no `role="alert"`). GREEN: `UppercaseTextField`, `NumberField`, `TextAreaField`, `PasswordField` and `OptionsField` through JField.
- [ ] b7a1.2 RED: the same for `DateField`, `DependentSelect` and `CascadeSelect`. GREEN: `DateField` uses JDatePicker `label`/`error`/`ref`, and the local ref workaround in `DateFieldImpl.ts` is deleted. Churn; gate.

W1-W3 assertions changed: `CascadeSelect.spec.tsx` and `DependentSelect.spec.tsx` read the field error from the description. Any register spec broken by these views moves its field-error assertion here. Commits: (1) `feat(softcommerce): render text field views through JField` b7a1.1; (2) `feat(softcommerce): render date and select field views through JField` b7a1.2.

## Slice b7a2: register layout (branch `feat/softcommerce-b7a2-register-layout`, base: b7a1)

Specs: R-CRUD-21, R-UX-3 (register open); S-CRUD-61, 62, S-UX-9. Forecast ~620.

- [ ] b7a2.1 RED `src/domain/crud/registerSize.spec.ts`: `md` up to 6 fields, `lg` up to 14, `xl` above that or with children. GREEN `src/domain/crud/registerSize.ts`.
- [ ] b7a2.2 RED `src/views/uicrudregister/UiCrudRegister.layout.spec.tsx`:
  - S-CRUD-61, S-CRUD-62 (one summary in config order, focus on the first invalid field, an entry focuses its field and switches tab);
  - S-UX-9; the skeleton plus `Cargando...`.

  GREEN `src/views/uicrudregister/*`: a JFieldGrid with full-width spans for textarea, cascade, lookup and the password pair; JErrorSummary at the top.
- [ ] b7a2.3 Churn on the remaining field-error files below; shrink the allowlist. Gate.

W1-W3 assertions changed (field-error assertions only; form-level, list, menu and permission alerts keep `role="alert"`): `UiCatalog.spec`, `UiCrudListStates.spec`, `UiContexto.grants.spec`, `registry.choferes.ui.spec`, `UiCrudRegister.spec`, `localidad.config.spec`, `UiCrudRegister.serverErrors.spec`, `registry.clientes.padrones.ui.spec`, `UiShell.spec`, `UiCrudRegister.select.spec`, `FormHost.spec`, `UiMasterRegister.errors.spec`, `UiMasterRegister.inline.spec`, `UiCrudRegister.docIdentidad.spec`, `UiMasterRegister.spec`. Commits: (1) `feat(softcommerce): size registers by field count` b7a2.1; (2) `feat(softcommerce): lay out registers with JFieldGrid and JErrorSummary` b7a2.2-b7a2.3.

## Slice b7b1: confirm copy and register driver (branch `feat/softcommerce-b7b1-confirm-copy-driver`, base: b7a2)

Specs: R-CRUD-20 (copy table, summary); S-CRUD-58, S-CRUD-59 (pure halves). No UI behavior change. Forecast ~620 (flagged).

- [ ] b7b1.1 RED `src/domain/crud/confirmCopy.spec.ts`: S-CRUD-58 table (title, body, button, an explicit variant for every mode, decline `No`, `details` except INSERT, DETAIL has no primary). RED `src/domain/crud/recordSummary.spec.ts`: `0002 · CUSCO`, empty parts omitted. GREEN both pure modules, not wired yet.
- [ ] b7b1.2 Add `src/test/registerDriver.ts` (`submit(mode)`, `confirm(mode)`, `decline()`), whose single label map still holds today's labels (`Aceptar`/`Confirmar`). CHECK: its own spec passes against the current register.
- [ ] b7b1.3 Migrate the specs in `src/views/uicrudregister`, `src/views/uicrudlist` and `src/views/uimasterregister` to the driver. The assertions keep their meaning and the suite stays green. Gate.

W1-W3 assertions changed: none in meaning (the clicks route through the driver). Commits: (1) `feat(softcommerce): add per-mode confirm copy and record summary` b7b1.1; (2) `test(softcommerce): add the register driver and migrate register, list and master specs` b7b1.2-b7b1.3.

## Slice b7b2: registry specs on the driver (branch `feat/softcommerce-b7b2-registry-driver`, base: b7b1)

Specs: test churn of R-CRUD-20. Forecast ~450.

- [ ] b7b2.1 Migrate every `src/catalogs/registry.*.ui.spec.tsx` and the `test/catalogs/*` UI helpers to `registerDriver`. The assertions keep their meaning. CHECK: `rg "'(Aceptar|Confirmar)'" src test` lists only Socio Acciones (R-MST-16) and the desktop dialogs that keep their own buttons. Gate.

Commit: `test(softcommerce): drive registry ui specs through the register driver`.

## Slice b7c: per-mode actions, toasts, focus restore (branch `feat/softcommerce-b7c-register-actions`, base: b7b2)

Specs: R-CRUD-20, R-CRUD-5, R-UX-1 (register), R-UX-3 (after save, delete, cancel); S-CRUD-8, 9, 10, 58, 59, 60, S-UX-1 (register), 10, 11, 12. Design: D14. Forecast ~600.

- [ ] b7c.1 RED `src/views/uicrudregister/UiCrudRegister.confirm.spec.tsx`: S-CRUD-58, S-CRUD-59 (summary; DELETE is `danger` with `No` focused), S-CRUD-10. GREEN `UiCrudRegisterImpl`/`View`: the primary label per mode, a destructive DELETE, the confirm through `useConfirm(confirmCopy(...))`. The `registerDriver` label map flips to R-CRUD-20 in one edit.
- [ ] b7c.2 RED `src/views/uicrudlist/UiCrudList.roundtrip.spec.tsx`: S-CRUD-8, 9, 60, S-UX-1 (register), 10, 11, 12. GREEN: `onDone(mode, record)` -> `useNotify` success -> `refresh({select})` keeps the rows -> `grid.focusRow(key)`; a cancel returns focus to the invoker. Gate.

W1-W3 assertions changed: every register flow now uses the R-CRUD-20 labels through the driver (about 270 occurrences in 74 files, already routed in b7b1 and b7b2); their meaning is kept. Commits: (1) `feat(softcommerce): use per-mode register copy through useConfirm` b7c.1; (2) `feat(softcommerce): add success toasts, non-blanking refresh and focus restore` b7c.2.

## Slice b8: master-detail (branch `feat/softcommerce-b8-master-detail`, base: b7c)

Specs: R-MD-1, 2, 3, 4, 5, R-ACT-4 (deferred unchanged); S-MD-8, 15, 16, 17, 18, 19, S-ACT-11, plus the focus-trap open question. Forecast ~780 (flagged).

- [ ] b8.1 RED `src/views/uimasterregister/UiMasterRegister.ux.spec.tsx`: S-MD-15 (`Con errores` on the tab through `JTabsTrigger invalid`; it clears). GREEN `UiMasterRegisterView`/`Impl`: `JTabs keepMounted` replaces the `hidden` panel workaround (S-MD-2 unchanged).
- [ ] b8.2 RED `src/shared/ui/ChildGrid/ChildGrid.spec.tsx`: S-MD-18; S-MD-8 (the row is `aria-invalid` with the message in its description, no alert list, the tab shows `Con errores`). GREEN `src/shared/ui/ChildGrid/*` as an adapter over JDataGrid, with `rowState` (badges `Nuevo`/`Modificado`/`Desactivado`, error, muted).
- [ ] b8.3 RED (the design's open question): S-MD-16, and a child JDrawer over the master JDialog keeps Tab inside the drawer. GREEN: the child entry is a JDrawer `lg` with `useGuardedClose`; focus returns to `Agregar`.
- [ ] b8.4 RED: S-MD-17 (`danger`, the row summary in `details`, `No` focused), S-ACT-11, S-MD-19. GREEN: `Quitar` and the deactivating row-action confirms go through `useConfirm` + `recordSummary`.
- [ ] b8.5 RED: pending children make the tab dirty (R-MD-1, through `useReportDirty`). GREEN. Churn; gate.

W1-W3 assertions changed:
- files: `UiMasterRegister*.spec.tsx` (9 files), `ChildGrid.spec.tsx`, `ChildGrid.actions.spec.tsx`, `registry.clientes.*.ui.spec.tsx`, `registry.{bancos,proveedores,trabajadores,transportistas,vendedores,items.almacenes}.ui.spec.tsx`;
- changes: row errors are read from the row description, and the confirm variant changes;
- desktop texts are unchanged (S-UX-23).

Commits: (1) `feat(softcommerce): add master tab error indicators and keyboard child grid` b8.1-b8.2; (2) `feat(softcommerce): open child entry in a drawer and use danger confirms` b8.3-b8.5.

## Slice b9: lookups (branch `feat/softcommerce-b9-lookups`, base: b8)

Specs: R-CRUD-19, R-LKP-4; S-CRUD-63, 64, S-LKP-17..21. Forecast ~560.

- [ ] b9.1 RED `src/shared/ui/LookupField/LookupField.spec.tsx`: S-CRUD-63, S-CRUD-64, the description `F2 abre la búsqueda`. GREEN `src/shared/ui/LookupField/*` on `JInputGroup preset='lookup'` + JField.
- [ ] b9.2 RED `src/shared/ui/LookupDialog/LookupDialog.spec.tsx`: S-LKP-17..21. GREEN `src/shared/ui/LookupDialog/*`:
  - the results are a JDataGrid named by the title, or `Resultados`;
  - the footer is [Cancelar][pick];
  - `Refrescar` is an icon button in the results header.
- [ ] b9.3 Remove `sm:grid-cols-[10rem_1fr_auto_auto]` and `sm:items-end` from `LookupFieldView.tsx` and from `app.css`. Churn; gate.

W1-W3 assertions changed:
- `LookupField.spec.tsx`, `fill.spec.tsx`, `lookupHarness.spec.tsx`: the `title` attribute;
- `LookupDialog.spec.tsx`: `group` becomes `grid`, the footer order changes, `Refrescar` moves to the results header;
- `useLookup.spec.tsx`: the field error is read from the description.

Commits: (1) `feat(softcommerce): rebuild LookupField on JInputGroup with F2` b9.1; (2) `feat(softcommerce): rebuild LookupDialog results on JDataGrid` b9.2-b9.3.

## Slice b10: Seguridad Perfil (branch `feat/softcommerce-b10-seguridad-perfil`, base: b9)

Specs: R-PRM-2, R-PRM-3, R-PRM-9; S-PRM-4, 17, 18, 19, 21, S-SHELL-25, S-UX-1 (perfil). Forecast ~600.

- [ ] b10.1 RED `src/views/uiseguridadperfil/perfilList.spec.tsx`: S-PRM-18. GREEN: the perfil list is a JDataGrid with `maxHeight`.
- [ ] b10.2 RED `src/views/uiseguridadperfil/perfilPermisos.spec.tsx`: S-PRM-19, S-PRM-4 (toast, no modal), S-SHELL-25, S-PRM-21. GREEN `UiSeguridadPerfil*`: JPageHeader `Seguridad - Perfil`, two panes from `lg`, JTreeNav `variant='checkbox'` with `maxHeight`, `useReportDirty`, `useNotify`.
- [ ] b10.3 RED: S-PRM-17. GREEN `src/views/uiseguridadperfil/permisos/PermisosDialog*` (a toast; the dialog stays open).
- [ ] b10.4 Remove `max-h-80`, `max-h-96`, `content-start`, `list-none` and `m-0` from the source (including `OptionsFieldView.tsx`) and from `app.css`. Churn; gate.

W1-W3 assertions changed: `perfilList.spec.tsx` (`listbox`/`option` become `grid`/`row`); `perfilPermisos.spec.tsx` (tree roles; the `Mensaje` modal becomes a toast). Commits: (1) `feat(softcommerce): put the perfil list on JDataGrid` b10.1; (2) `feat(softcommerce): put the perfil tree on JTreeNav with toasts and dirty state` b10.2-b10.4.

## Slice b11a: Socio Acciones inline (branch `feat/softcommerce-b11a-socio-inline`, base: b10)

Specs: R-MST-16; S-MST-35, 38, 39, 40, S-UX-1 (socio). Forecast ~560.

- [ ] b11a.1 CHECK: the owner confirmed the Socio `Desactivar` reason text. Default `No disponible` if no answer arrives before apply.
- [ ] b11a.2 RED `src/views/uisocioacciones/UiSocioAcciones.spec.tsx`: S-MST-38, S-MST-39. GREEN `UiSocioAccionesView`/`Impl`: JPageHeader `Acciones de Socio`; `JTabs keepMounted` with `Socios`/`Precio`; a JToolbar (`Activar`/`Desactivar`) and a JDataGrid per tab; `Aceptar`/`Cancelar` at the end.
- [ ] b11a.3 RED:
  - S-MST-35 (the server message as a toast; the tab is no longer dirty; `Cancelar` restores);
  - S-MST-40; `Cancelar` with pending rows asks the discard confirm;
  - `Desea Desactivar Precio?` is `danger` with `No`.

  GREEN: `useReportDirty`, `useNotify`, `useConfirm`; the `Activar Socio`, `Activar Precio` and `Desactivar Precio` dialogs use `useGuardedClose`.
- [ ] b11a.4 Remove `justify-self-start` and `sm:grid-cols-3` (`SocioDialogView.tsx`) from the source and from `app.css`. Churn; gate.

W1-W3 assertions changed: `UiSocioAcciones.spec.tsx:29,221,236` query the inline screen (no dialog, no reopen button); the save-message assertions read the toast. Commits: (1) `feat(softcommerce): render Socio Acciones inline` b11a.1-b11a.2; (2) `feat(softcommerce): add socio dirty state, toasts and danger precio confirm` b11a.3-b11a.4.

## Slice b11b: Autorizar Series drawer and CSS closeout (branch `feat/softcommerce-b11b-series-drawer-closeout`, base: b11a)

Specs: R-PRM-6, R-ACT-4, R-ACT-6, R-UX-1, R-UX-6; S-PRM-12, 13, 20, S-ACT-6, 10, S-UX-1 (closeout), 2, 3, 20, 21. Forecast ~600.

- [ ] b11b.1 RED `src/views/uiautorizarseries/UiAutorizarSeries.spec.tsx`: S-PRM-20. GREEN `src/views/uiautorizarseries/*`: a JDrawer `lg` that keeps its title; a header row (`Trabajador:`, `Usuario:`) outside the JToolbar; a JDataGrid.
- [ ] b11b.2 RED:
  - S-ACT-6, S-PRM-13: a `danger` confirm `Desactivar` with the body `Se desactivará el registro seleccionado.` and the row summary; `No` sends nothing; the toast;
  - S-ACT-10 / S-UX-3: a 409 gives a `danger` toast, the grid is unchanged, no modal;
  - S-PRM-12: `Activar` shows a toast and the dialog closes;
  - S-UX-2: no row gives the `Aviso` modal and no toast.

  GREEN.
- [ ] b11b.3 RED `src/styles/cssContract.spec.ts`:
  - S-UX-21: `app.css` and `appStyles.spec.ts` are absent, and the contract no longer unions `app.css`;
  - S-UX-20: the final allowlist holds only computed runtime values;
  - S-UX-1 closeout: every success path is a toast.

  GREEN: delete `src/styles/app.css` and its import. Churn; gate.

W1-W3 assertions changed: the Autorizar Series specs open a drawer, confirm `Desactivar` first, and read the toast instead of the `Mensaje` modal. Commits: (1) `feat(softcommerce): move Autorizar Series to a drawer with a danger Desactivar` b11b.1-b11b.2; (2) `chore(softcommerce): delete the app.css stopgap` b11b.3.

## Verify and archive

- [ ] V.1 Run `sdd-verify` on the tracker head:
  - the full gates of both packages;
  - S-UX-22 and S-UX-23 (the W3 message suites unchanged); W1-W3 suites green except the named churn;
  - the proposal success criteria;
  - a manual walkthrough at 375/1024/1920, light and dark, with axe DevTools at 0 serious/critical;
  - `jona-ui` pinned `1.6.0` exactly.
- [ ] V.2 Only if V.1 fails: fix in `feat/softcommerce-v-verify-fixes` (base b11b, <= 300 lines), then re-verify.
- [ ] A.1 Run `sdd-archive` on the tracker:
  - promote the 5 `jona-ui-*` specs;
  - merge the 8 `softcommerce-*` deltas into `openspec/specs/`;
  - move the change to `openspec/changes/archive/<date>-softcommerce-product-ux/`;
  - commit `docs(openspec): archive softcommerce product ux and promote its specs`.

**Gate 3**: tracker -> `main` (owner, merge commit).

---

## Coverage

| Spec area | Scenarios | Slices |
|-----------|-----------|--------|
| jona-ui-foundations | S-FND-1..5, 23, 24 / 17, 18 / 6, 7, 9..14, 16, 25, 26 / 8, 15, 18 / 19..22 | a1 / a3, a2b / a2a / a2b / rel152, a10 |
| jona-ui-feedback | S-FBK-1..16 | a5 |
| jona-ui-forms | S-FRM-1..9, 12..16 / 10, 11 | a4 / a6 |
| jona-ui-data | S-DAT-1, 2 / 16..22 / 3..15 | a3, a2b / a6 / a7 |
| jona-ui-app-chrome | S-CHR-20 / 5..13, 19 / 1..4, 21..23 / 14..18, 24 / 25..27 | a6 / a8 / a9a / a9b / a10 |
| ux-conventions | S-UX-4, 17..20 / 5, 6, 24 / 7, 22 / 8, 13..16 / 9 / 1, 10..12 / 2, 3, 21 / 23 | b1 / b2, b3 / b6 / b5 / b7a2 / b7c, b10, b11a, b11b / b11b / verify |
| auth-session | S-AUTH-32..42 | b2 (S-AUTH-37 from PR #107) |
| shell-workspace | S-SHELL-15, 26, 29 / 5, 17..20, 27 / 21..24, 28 / 25 | b3 / b4 / b5 / b10 |
| crud-templates | S-CRUD-1, 7, 51..57 / 61, 62 / 8..10, 58..60 / 63, 64 / 21 | b6 / b7a1, b7a2 / b7b1, b7c / b9 / b1a, b1 |
| master-detail | S-MD-8, 15..19 | b8 |
| lookup-dialog | S-LKP-17..21 | b9 |
| row-actions | S-ACT-6, 10 / 11 | b11b / b8 |
| user-permissions | S-PRM-4, 17..19, 21 / 12, 13, 20 | b10 / b11b |
| masters | S-MST-35, 38..40 | b11a |

Totals: 30 implementation slices plus Slice 0 (recorded) and verify/archive; 121 slice tasks, plus the two 8-item release checklists. The lib forecast is ~8,210 lines and the app forecast ~10,220 (~18,430 in all).

## Open owner items

- [ ] **Blocking for b11a (has a default):** the Socio `Desactivar` disabled-reason text. The default is `No disponible` (R-MST-16, S-MST-39).
- [ ] **Blocking at each release:** confirm the version numbers `1.5.2` (rel152) and `1.6.0` (a10). Merge the tracker and publish each GitHub Release (never `workflow_dispatch`).
- [ ] **Remaining [ASSUMPTION]s.** Not blocking: apply uses the spec wording unless the owner changes it.
  - auth: the `Conectado como {nombre} en {base de datos}` wording; the `Desde` clamp to `INICIO_ACTIVIDADES`;
  - shell: `Buscar opción`; `Seguir editando` / `Descartar y salir`; the `Sistema` / `Claro` / `Oscuro` labels; the R-SHELL-6 key set;
  - lib defaults: `Más acciones`, `Más pestañas`, `Sin resultados`, `Ruta`, `Atajos de teclado`, `Con errores`, `Cambios sin guardar`;
  - lib behavior: PgUp/PgDn move 10 rows; the cancel button is focused for danger confirms; FIFO confirms; error toasts use `duration: 0`; a disabled toolbar item is natively disabled; JFieldGrid defaults to 2 columns; the filter ignores accents; `0 de 0`;
  - crud: the record summary is the first two columns; the decline is `No`; the toast titles `Registro creado` / `Registro actualizado` / `Registro eliminado`; `F2 abre la búsqueda`; `Resultados`; `Limpiar filtro`; list actions stay visible; `Buscar` selects the filter text;
  - screens: the Desactivar body `Se desactivará el registro seleccionado.`; the `Acciones de Socio` title; the socio `Cancelar` asks a discard confirm.
