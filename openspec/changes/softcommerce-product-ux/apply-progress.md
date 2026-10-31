# Apply progress: softcommerce-product-ux

Mode: Strict TDD (vitest). Delivery: auto-chain, feature-branch-chain, 800-line budget per slice (lock, golden JSON and generated files excluded). Worktree: `D:/Kiro Projects/patron-frontend-jona-worktrees/softcommerce-ux`.

## Slice a1: cascade, hidden, distribution (DONE)

### Branches (fallback split applied)

| Branch | Base | Tasks | Lines (numstat, lock and golden excluded) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a1-css-cascade-i` @ `ec804b94` | tracker `feat/softcommerce-product-ux` @ `ad092390` | a1.1-a1.3 | 725 | test 34 files / 290 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a1-css-cascade-ii` @ `4bfd6cd1` | a1-i | a1.4-a1.6 | 673 | test 36 files / 303 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a1-css-cascade` @ `4bfd6cd1` | alias of the a1-ii tip | - | - | same as a1-ii |

The original branch was renamed to `-i` (`git branch -m`) when a1.2-a1.3 reached 725 lines; the planned name was then created with `git switch -c` at the final a1-ii tip (no force move). a1-ii stayed under 800, so no `-iii`.

Baseline (tracker @ `ad092390`): test 33 files / 281 tests; lint, build, build-storybook pass.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `4f639d86` | fix(uijona): zero-specificity layout engine rules and hidden precedence | a1.2 |
| `ec804b94` | fix(uijona): declare css side effects | a1.3 |
| `97d168c1` | fix(uijona): add class coverage test and drop class tokens the stylesheet never had | a1.4 |
| `4bfd6cd1` | fix(uijona): audit JPanel classes honored by the cascade fix and make flex rows explicit | a1.5-a1.6 |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a1.2 | `src/__tests__/css/cascade.test.ts` (new) | Unit (in-memory postcss + Tailwind compile, cascade resolver) + RTL render | 33/281 | 6 failed / 2 passed. S-FND-3: 120 engine selectors were not in `:where()`. S-FND-4 (x2) and S-FND-5: `flex` won over `lg:hidden`/`sm:grid`. D2 (x2): there was no `!important` `[hidden]` rule. The 2 passes are the S-FND-23 guards, which pass by design. After a resolver fix (`Boolean(decl.important)`), RED was re-run against the 1.5.1 CSS: same 6/2 | 8/8 | S-FND-4 at 1024/1920/375 plus `sm:grid` at 640/375; S-FND-5 at 1024/1023/375; D2 at 375/1920. MUTATION: wrapping the JTextBox icon padding rule in `:where()` failed both S-FND-23 guards; restored | selectors and the layer boundary only (155+/140-) |
| a1.3 | `src/__tests__/packageExports.test.ts` (1 test added) | Unit | 3/3 | 1 failed (`sideEffects: false`) | 4/4 | `dist/index.css`, `dist/theme/tokens.css` match; `dist/index.js` does not | none |
| a1.4 | `src/__tests__/css/classCoverage.test.ts` (new) | Unit (TypeScript AST + compiled CSS) | 34/290 | 1 failed with 11 missing tokens; with stories scanned, also `hover:bg-success-700` | 4/4 | fixtures: a template-literal-only token is named; `grid-cols-${n}` is named as a fragment; comparison operands and lookup indexes are skipped | test-side false positives fixed before GREEN (hex-escaped `\2c ` in arbitrary values; story `argTypes.className` objects) |
| a1.5 | `src/__tests__/css/jpanelOverrides.test.ts` + `jpanelOverrides.golden.json` (new); `cascade.test.ts` (+4 tests for the story-less Views) | Unit (AST) + RTL with the cascade resolver | 35/294 | 3 failed. The kept list did not match the reviewed golden. The row-direction invariant listed 34 JPanels without a direction. `added` was empty | 4/4 + 4/4 | fixture: a variant-prefixed `md:flex` without a direction is flagged, while `flex flex-row` and `flex flex-col` pass. MUTATION: restoring the 1.5.1 JNavbar, JDashboardPreview and JLogoMarquee Views failed 6 tests (4 cascade + 2 overrides); restored | none |
| a1.6 | full 1.5.1 lib suite | - | - | n/a (CHECK) | 36 files / 303 tests pass. No pre-existing test file was modified except one added test in `packageExports.test.ts` | - | - |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a1.2 | `npx vitest run src/__tests__/css/cascade.test.ts` -> 8 passed | `dist/index.css` has `[hidden]:where(:not([hidden=until-found])){display:none!important}`. `:where(.jpanel[data-jpanel-desktop-layout=box])` (byte 19475) precedes `lg\:hidden{display:none}` (byte 80342) | `src/styles/index.css` layer boundary, `:where()` and `[hidden]`; `postcss-import` |
| a1.3 | `npx vitest run src/__tests__/packageExports.test.ts` -> 4 passed | N/A: package metadata only | `package.json` `sideEffects` |
| a1.4 | `npx vitest run src/__tests__/css` -> 12 passed | `npm run build-storybook` pass | the 11 token removals in 7 Views, the `jdot`/`jglyph` rule, 2 story hover classes |
| a1.5 | `npx vitest run src/__tests__/css` -> 21 passed | Headless Edge screenshots of two `storybook-static` builds (1.5.1 CSS vs current) over `file://` with no server, at 375, 1024 and 1920, for the 18 Views that have stories. Every row-intent site renders as a row in 1.5.2 and as a column in 1.5.1. Sheets: `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/{g1-1024,g2-1024,g3-1024,a-375,b-375,a-1920,b-1920}.png` | the `flex-row` tokens in 21 Views, `jpanelOverrides.*`, the 4 cascade tests |

### Decisions

- **Engine block kept at its old indentation** between `@tailwind base` and `@tailwind utilities`, to keep the diff small.
- **Dead class tokens removed, not repainted** (a1.4). 1.5.1 wrote 11 tokens that Tailwind never generated: `danger/success/warning` 50/200/700 and `max-w-content`. They rendered nothing, so removing them is a no-op; this was checked against twMerge. Repainting them would be a visible change that R-FND-8 does not list, and D5 forbids new config keys. JSwitch error+unchecked still has no track color, as in 1.5.1.
- **`jdot`/`jglyph`** get `box-sizing: border-box`, like `.jbadge`.
- **Stories are scanned** by the coverage test. The story buttons that used `hover:bg-success-700` now use `hover:bg-success-600`, which renders the same.
- **a1.5, option A (orchestrator decision):** `flex-row` was added to the 34 JPanels whose `flex` meant a row: JCard footer, JCheckBoxField, JDataTable toolbar, JDialog overlay, JDrawer header, JEmptyState (icon and actions), JMultiSelect, JNumberInput, JOptionPane overlay, JProgressItem, JSearchInput, JSkeletonPresets (x3), JStatCard (x3), JTable toolbars (x2), JTimer (x2), JDashboardPreview (x2), JErrorPage actions, JFooterPage (x2), JHeaderPage actions, JLogoMarquee (x2), JNavbar (x4). No honored token was wrong once honored, so `removed` is not used.
  - Excluded: the JDialog footer (`layout="flow"`, already a row) and the JDrawer root (`flex-col` arrives through `sideStyles`).
  - The overlays (JDialog, JOptionPane) and single-child boxes (the JEmptyState icon, the JStatCard icon) center the same either way; they get `flex-row` for a uniform invariant.

### Deviations (spec/design text aligned)

- spec `jona-ui-foundations` R-FND-2 and design D1a: one sentence each saying that the row direction is made explicit where `flex` meant a row (`flex-row`, listed under `added`).
- tasks.md a1: the fallback split; the a1.4 GREEN extension (drop the dead tokens, `jdot`/`jglyph` rule); the a1.5 resolution note.
- Commit plan: commit (2) was split into `ec804b94` (a1.3) and `97d168c1` (a1.4), because the split boundary falls between them.

### Pre-existing test assertions changed

None. `packageExports.test.ts` gained one test.

### Deferred items

- **Storybook audit gap:** JNavbar, JDashboardPreview, JLogoMarquee and JLanguageSwitcher have no stories. They are checked through RTL and the cascade resolver in `cascade.test.ts`: rows at 1024; JNavbar links hidden at 375 and a row at 1024; JLanguageSwitcher `inline-block` and its 9rem menu.
- **Finding, not fixed (needs a decision): engine `width: 100%` on JPanel flex items.**
  - JHeaderPage (title) and JFooterPage (left and center slots) put a JPanel inside a flex row. The View relies on content width (`flex-1 md:flex-none`), but the box engine sets `width: 100%`, so the row wraps: brand, nav and actions stack, in 1.5.1 and in 1.5.2.
  - A `w-auto` on those panels would fix it, but it is outside the option A decision.
- a2b: repaint the removed status tints with the R-FND-3 tokens; JNavbar content max width.
- rel152 CHANGELOG (Fixed):
  - the D1 engine `:where()`;
  - `[hidden]` precedence;
  - `sideEffects`;
  - the a1.4 dead-token cleanup (no visual change);
  - the D1a list from `jpanelOverrides.golden.json`: the `kept` tokens now honored, and the 34 `added` `flex-row` sites.

## Slice a3: JButton a11y and density, JTableRow selected (DONE)

### Branch

| Branch | Base | Tasks | Lines (lock excluded) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a3-button-row-selection` @ `b76d8a73` | `feat/softcommerce-a1-css-cascade` @ `4bfd6cd1` | a3.1-a3.4 | 404 | lib: test 36 files / 318 tests pass, lint, build and build-storybook pass. App (`web_ts/softcommerce`, still on npm `jona-ui@1.5.1`): typecheck and build pass. `npm test` had 6 failures in 2 files, a pre-existing timezone defect (see below); with `TZ=UTC` it is 330 files / 6330 passed, 2 skipped |

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `f35c73a4` | feat(uijona): add typed a11y props and density to JButton and JIcon | a3.1-a3.2 (+ JButton/JIcon stories) |
| `b76d8a73` | feat(uijona): add JTableRow selected state | a3.3-a3.4 |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a3.1 | `src/atoms/__tests__/JButton.test.tsx` (+8 tests) | RTL | 6/6 | 4 failed (density touch, compact, auto, icon). The passthrough and the 1.5.1 class string passed already, as approval tests, because `JButtonImpl` already spread `ButtonHTMLAttributes`. MUTATION: dropping `{...rest}` failed 3 tests; restored | 13/13 | touch, compact on `lg`, auto on `lg`, compact on `icon` | none |
| a3.2 | `src/atoms/__tests__/JLabelJIconJChip.test.tsx` (+2) and `JIcon.stories.tsx` | RTL + type check (`npm run lint`) | 3/3 | type RED: `npm run lint` gave 3 TS2322 errors (`density` on JIcon in the new story). The runtime tests pass through JButton | lint clean; 5/5 | the a11y props and density | none |
| a3.3 | `src/molecules/__tests__/JTable.test.tsx` (+3) and `cascade.test.ts` (+1, S-DAT-2) | RTL + cascade resolver | 13/13 | 2 failed (selected attributes and classes; selection kept on hover) and 1 failed (S-DAT-2: no primary-50 background). The unselected-row test passed (approval) | 16/16; 14/14 | selected, unselected, `selected={false}`, hover | none |
| a3.4 | the axe tests in `JButton.test.tsx` and `JTable.test.tsx`; `src/__tests__/quality/axe.ts` | RTL + axe-core | - | RED: module not found (the helper did not exist) | 31/31. MUTATION: an unnamed icon button reports `button-name`; the probe was removed | JButton (3 variants), JTable with a selected row | none |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| 1 | `npx vitest run src/atoms` -> 61 passed | storybook-static `atoms-jbutton--density` screenshot: Touch is taller, Compact and Auto are 36 px at 700 px width | `src/atoms/JButton/*`, `src/atoms/JIcon/InterJIcon.ts`, the 2 stories |
| 2 | `npx vitest run src/molecules/__tests__/JTable.test.tsx src/__tests__/css` -> 38 passed | storybook-static `molecules-jtable--selected-row` screenshot: CUSCO row has a primary-50 background and a 3px blue start border | `src/molecules/JTable/{InterJTable,JTable,JTableView}`, `axe.ts`, `axe-core` |

### Decisions and deviations

- **Density classes set both breakpoints:** `touch` = `min-h-11 sm:min-h-11`, `compact` = `min-h-9 sm:min-h-9`, `auto` = `min-h-11 sm:min-h-9`. With only `min-h-11`, twMerge would keep the size's `sm:min-h-9`, so `touch` would be 36 px from sm. design.md D8 and tasks.md a3.1 are aligned in place.
- **Selected rows keep their background on hover:** `hover:bg-primary-50` replaces `hover:bg-neutral-50` through twMerge. Without it, hover would hide the selection (R-DAT-1: selection must differ from hover).
- **Exports:** `JButtonDensity` and `JBUTTON_DENSITIES` (doc map, no state values) are exported from JButton, and `InterJTableRow` from JTable. These are additive.
- **axe-core version:** `npm install -D axe-core@^4.12.1 --prefer-offline` resolved `^4.14.0`; the lock was updated.

### Pre-existing test assertions changed

None. The three test files only gained tests and imports.

### Deferred items and risks

- **App timezone defect, pre-existing and not caused by this slice** (the app diff is empty):
  - Failing specs: `test/catalogs/bancos.spec.ts` (2) and `test/catalogs/items.almacenes.spec.ts` (4).
  - Cause: "today" is compared as a UTC date against the local date. The specs fail in the local evening (UTC-5 after 19:00), when the UTC date has already rolled over.
  - Evidence: rerun, still 6 failed; with `TZ=UTC`, 131/131 pass, and the full app suite passes.
- **Package pollution:** `src/__tests__/quality/axe.ts` emits `dist/__tests__/quality/axe.d.ts`, like the existing `dist/test/setup.d.ts`. rel152 should check `npm pack --dry-run`, or exclude `src/__tests__` and `src/test` from the declaration build.
- S-DAT-2 dark half and the 1.6.0 selection token: a2b.

## Slice rel152: release 1.5.2 (DONE, pending Gate 1)

### Branch

| Branch | Base | Tasks | Lines (numstat, lock excluded) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-rel152-release` @ `5089135c` | `feat/softcommerce-a3-button-row-selection` @ `b76d8a73` | r.1, r.2, r.2a, r.3 | 149 (lock 2+2) | lib: test 36 files / 319 tests pass; lint, build, build-storybook pass; `npm pack --dry-run` 2116 files. App (still on npm `jona-ui@1.5.1`, app diff empty): typecheck and build pass; `npm test` 6 failed / 6324 passed / 2 skipped (the known timezone defect, run at 21:47 UTC-5); with `TZ=UTC`, 330 files / 6330 passed, 2 skipped |

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `aabf7f49` | build(uijona): keep test-only declarations out of the package | r.2a |
| `5089135c` | chore(uijona): release 1.5.2 | r.2 (version, CHANGELOG.md, README notes) |

No tag, no Release, no publish, no push.

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| r.1 | - | CHECK | - | n/a | orchestrator: owner confirmed `1.5.2`; `npm view jona-ui versions` ends at `1.5.1` | - | - |
| r.2a | `src/__tests__/packageExports.test.ts` (+1 test) | Unit (TypeScript config API) | 4/4 | 1 failed: the build program held `src/__tests__/quality/axe.ts` and `src/test/setup.ts` | 5/5 | build-level RED/GREEN for the second emitter: with only `tsconfig.build.json` fixed, `npm run build` still emitted `dist/test/setup.d.ts` and `dist/__tests__/quality/axe.d.ts` (vite-plugin-dts); after its `exclude`, neither exists | none |
| r.2 | - | MUTATION-free (version, docs) | - | n/a | `npm version 1.5.2 --no-git-tag-version` -> `v1.5.2` (package.json and lock, no tag) | - | - |
| r.3 | full 1.5.1 lib suite + pack | CHECK | - | n/a | 36 files / 319 tests (318 at a3 + r.2a). No pre-existing assertion changed (S-FND-20) | pack vs 1.5.1 tarball: same 2117 paths minus `dist/test/setup.d.ts`, none added | - |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| r.2a | `npx vitest run src/__tests__/packageExports.test.ts` -> 5 passed | `npm run build` then `npm pack --dry-run`: 2118 -> 2116 files, removed exactly `dist/__tests__/quality/axe.d.ts` and `dist/test/setup.d.ts` | `tsconfig.build.json` exclude, `vite.config.ts` dts exclude, the one test |
| r.2 | `npm pack --dry-run` -> `jona-ui@1.5.2`, 2116 files | N/A until Gate 1 (owner Release, then `npm view jona-ui@1.5.2 version`) | `package.json`/lock version, `CHANGELOG.md`, README notes (a bad version is deprecated and patched forward) |

### `npm pack --dry-run` (tip)

`jona-ui@1.5.2`, 2116 files, 566.4 kB packed, 2.7 MB unpacked. Outside `dist/`: only `README.md` and `package.json`. In `dist/`: `index.css` and `theme/tokens.css` (2 css), 384 `.js` + 384 `.cjs` (+ maps), 576 `.d.ts` (`index.d.ts` included). Every `exports` target exists. No test, story, spec or `__tests__` path. Against the published 1.5.1 tarball: nothing added, `dist/test/setup.d.ts` removed.

### Decisions

- **Test-only declarations excluded** (orchestrator request, small and safe): both emitters exclude `src/test` and `src/__tests__`. Only tests import those files (`vitest.config.ts` `setupFiles` and the axe helper users). `dist/test/setup.d.ts` shipped in 1.5.1 but was never in the export map, so no consumer import changes.
- **CHANGELOG** in English (Keep a Changelog style, no date: the owner releases at Gate 1). The D1a lists are generated from `jpanelOverrides.golden.json` (37 Views `kept`, 34 `added` sites in 21 Views with 1.5.2 line numbers), satisfying S-FND-24 "each entry is named in the CHANGELOG". It also names the known JHeaderPage/JFooterPage `width: 100%` finding from a1 as unchanged.
- **README notes in Spanish**, matching the existing README language (no accents, as the file): `sideEffects` under Instalacion, a `density` table under Uso Rapido, and the JButton catalog row.
- `CHANGELOG.md` is not added to `files`; npm does not pack it, the repo copy is the record. Adding it is a one-line follow-up if the owner wants it on npm.

### Deviations (spec/design text aligned)

- spec `jona-ui-foundations` R-FND-8: "plus packaging hygiene that changes no export (test-only declarations are kept out of `dist/`)" added to the 1.5.2 scope sentence.
- tasks.md rel152: r.2a added; r.3 names the packaging hygiene. Release checklist: the Storybook audit item is marked done by reference to a1.5 (no CSS or View changed since).

### Pre-existing test assertions changed

None. `packageExports.test.ts` gained one test and two imports.

### Deferred items

- Owner: merge the tracker into `main`, publish GitHub Release `v1.5.2` on that commit (never `workflow_dispatch`), then `npm view jona-ui@1.5.2 version` before b1a.
- b1a: the app timezone defect (`test/catalogs/bancos.spec.ts` 2, `test/catalogs/items.almacenes.spec.ts` 4) still fails in the local evening; passes with `TZ=UTC`.
- The orchestrator copies the a1.5 Storybook sheets list into the rel152 PR body.

## Slice a2a: tokens, theme mode, type scale, base.css (DONE)

Base: the tracker `feat/softcommerce-product-ux` @ `1d53c20f` (orchestrator reorder: b1a waits for the 1.5.2 publish and is inserted later). Version stays 1.5.2 (1.6.0 only in a10).

### Branches (fallback split applied)

| Branch | Base | Tasks | Lines (numstat) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a2a-tokens-theme-i` @ `e05b453f` | tracker @ `1d53c20f` | a2a.1-a2a.3, a2a.6 | 694 | test 39 files / 344 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a2a-tokens-theme-ii` @ `243c0dba` | a2a-i | a2a.4, a2a.5 (+ theme-mode story) | 561 | test 41 files / 361 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a2a-tokens-theme` @ `243c0dba` | alias of the a2a-ii tip | - | - | same as a2a-ii |

The branch was renamed to `-i` (`git branch -m`) after commit 1 measured 640 lines (the 780 forecast was low: the tests are about 520 of the 1,255 lines). Baseline (tracker): test 36 files / 319 tests; lint and build pass.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `405418c8` | feat(uijona): add semantic light and dark tokens, type scale and density tokens | a2a.1-a2a.3 |
| `e05b453f` | feat(uijona): add token class constants | a2a.6 |
| `cd7ff9b0` | feat(uijona): add theme mode provider and init script | a2a.4 + `Theme/Theme mode` story |
| `243c0dba` | feat(uijona): ship opt-in base.css | a2a.5 |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a2a.1 | `src/theme/__tests__/tokens.test.ts` (new) + helper `src/__tests__/css/tokenCascade.ts` (root-token cascade resolver) | Unit (in-memory postcss + Tailwind compile) | 36/319 | 14 failed / 2 passed (no semantic, tint, type-scale or density tokens; the 2 passes are the S-FND-25 chart-selector guards, by design) | 16/16 | dark / system+OS dark / system+OS light / light+OS dark; control height at 375/639/640/1920; density compact at 375 and touch at 1920 | none |
| a2a.2 | `src/__tests__/quality/contrast.test.ts` (new) | Unit | - | 2 failed ("`--jona-fg` does not resolve to an RGB triplet") | 3/3 | MUTATION: dark fg-muted -> neutral-600 failed dark (2.36 and 1.93); light line-strong -> neutral-400 failed light (2.56); both restored | none |
| a2a.3 | `src/theme/__tests__/ThemeProvider.test.tsx` (new) | RTL | no prior test | 3 failed (30 new keys not applied; no `data-jona-scope`; `fg` not applied). The 2 primary-override tests passed (approval of the 1.5.1 behavior) | 5/5 | root scope is not marked; unmount removes the marker | none |
| a2a.6 | `src/__tests__/css/classCoverage.test.ts` (+1 test) | Unit | 4/4 | module not found (`tokenClasses`) | 5/5 | MUTATION: `SELECTION = 'bg-selection'` failed naming `SELECTION: bg-selection`; restored | none |
| a2a.4 | `src/theme/__tests__/themeMode.test.tsx` (new) | Unit + RTL | - | 11 failed (exports undefined) | 11/11 | invalid/missing/custom key/throwing storage; live OS change; explicit light over OS dark; remount persistence. MUTATION: removing the `change` listener failed S-FND-9; restored | none |
| a2a.5 | `src/__tests__/css/baseStyles.test.ts` (new), `packageExports.test.ts` (+1) | Unit | 5/5 | ENOENT `base.css`; export `./base.css` missing | 5/5 + 6/6 | body, h1, h2, h3; index.css against a preflight-only compile | none |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a2a.1-3 | `npx vitest run src/theme src/__tests__/quality/contrast.test.ts` -> 24 passed | `dist/index.css` keeps `:root,[data-jona-scope]{--jona-surface:…}`, the dark block with its `[data-jona-scope]` twin and `color-scheme:dark`, the `@media (prefers-color-scheme:dark)` system block and the density rules after minification | `src/theme/tokens.css` additions; `ThemeProvider.tsx` keys and scope marker |
| a2a.6 | `npx vitest run src/__tests__/css/classCoverage.test.ts` -> 5 passed | `dist/index.css` has `.bg-\[rgb\(var\(--jona-surface\)\)\]` and `.min-h-\[var\(--jona-control-h\)\]` | `src/theme/tokenClasses.ts` |
| a2a.4 | `npx vitest run src/theme/__tests__/themeMode.test.tsx` -> 11 passed | `themeInitScript('k')` from the minified `dist/theme/index.cjs`, run against a fake window, sets `data-theme-mode=dark` and `data-theme=dark`. Headless Edge over `file://` on storybook-static, `Theme/Theme mode` Light vs Dark at 375/1024/1920: `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/a2a-theme-{375,1024,1920}.png` | `src/theme/{InterThemeMode.ts,themeInit.ts,ThemeModeImpl.tsx,ThemeMode.tsx,ThemeMode.stories.tsx}`; one line in `src/theme/index.ts` |
| a2a.5 | `npx vitest run src/__tests__/css/baseStyles.test.ts src/__tests__/packageExports.test.ts` -> 11 passed | `npm run build`: `dist/base.css` is byte-identical to `src/styles/base.css` | `src/styles/base.css`; the `vite.config.ts` copy list; `package.json` `./base.css` |

### Decisions

- **Tints are palette steps.** `--jona-{danger,success,warning}-{50,100,700}` are RGB triplets on `:root` next to 400-600 (the Tailwind red/green/yellow values), with dark overrides. There is no other palette for them to reference.
- **The dark blocks cover scopes.** `:root[data-theme-mode='dark'] [data-jona-scope]` (and its system twin) re-declare the dark values; otherwise a provider scope's light re-declaration would win inside it. A test keeps the two dark blocks identical.
- **Light values:** surface white; surface-muted neutral-50; fg neutral-900; fg-muted neutral-500 (4.54:1 on neutral-50); line neutral-200; line-strong neutral-500 (neutral-400 fails 3:1); focus primary-500 (3.68:1); selection primary-50.
- **Dark values:** surface neutral-900; surface-muted and surface-raised neutral-800; fg neutral-50; fg-muted neutral-400; line neutral-700; line-strong neutral-500; focus primary-400; selection primary-900; tints red/green/yellow 950/900/300.
- **The type-scale tokens are split** (`-size`, `-leading`, `-weight`, plus `--jona-text-table-numeric`) rather than a `font` shorthand, so `base.css` never resets a consumer's font family.
- **base.css is unlayered plain CSS** and is documented to be imported after `index.css`. A native `@layer` would lose to the unlayered preflight.
- **themeInitScript** serialises `applyStoredThemeMode.toString()`, so that function is self-contained (a literal default key, no imports). The key is JSON-escaped, with `<` written as `\u003c`.
- **Provider read rule:** a missing stored value gives `defaultMode`; an invalid one gives `system` (S-FND-11, D6).
- `CONTROL_H` sets both breakpoints; with only the base one, twMerge would keep a size's `sm:` height.
- `tokenClasses.ts` stays internal (not exported from `theme/index.ts`, as the design says). `tsc` still emits `dist/theme/tokenClasses.d.ts`, which nothing references.

### Deviations (spec/design text aligned)

- spec R-FND-3 Format and S-FND-6: the tints are palette triplets; only the semantic tokens are `var()` references.
- design D7: the type-scale token names gain `-{size,leading,weight}`, plus `--jona-text-table-numeric`.
- tasks.md a2a: the fallback split, the a2a.1 tint wording, the a2a.5 test location (source plus the compiled index.css; `dist/base.css` is checked by the build harness), and the commit list.

### Pre-existing test assertions changed

None. `classCoverage.test.ts` and `packageExports.test.ts` gained one test each.

### Deferred items

- README (`jona-ui/base.css`, `themeInitScript`) and CHANGELOG: a10.

## Slice a2b: component token migration (DONE)

### Branches (fallback split applied)

| Branch | Base | Tasks | Lines (numstat; golden JSON excluded) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a2b-token-migration-i` @ `fef49b5a` | a2a @ `243c0dba` | a2b.1, a2b.2, a2b.4 | 456 | test 42 files / 370 tests pass; lint, build, build-storybook pass. Run on a `git archive` export of `fef49b5a` with a node_modules junction, because the worktree had moved on and checkout/stash are not allowed |
| `feat/softcommerce-a2b-token-migration-ii` @ `eb026e5a` | a2b-i | a2b.3, the deferred items, the Storybook toolbar | 478 (+27 golden) | test 44 files / 383 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a2b-token-migration` @ `eb026e5a` | alias of the a2b-ii tip | - | - | same as a2b-ii |

The slice measured 858 lines before its last commits. `git branch -m` renamed the branch to `-i` at the a2b.2/a2b.4 tip, and `git switch -c` started `-ii` with the pending a2b.3 work.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `236f42ee` | feat(uijona): add token lint and tokenize index.css colors | a2b.1 |
| `fef49b5a` | feat(uijona): migrate atoms to semantic tokens | a2b.2, a2b.4 |
| `fd260cda` | feat(uijona): migrate molecules and layouts to semantic tokens | a2b.3 + status-tint repaint |
| `acbacc45` | fix(uijona): give header and footer slots their content width and cap the navbar row | a1 deferred items |
| `eb026e5a` | docs(uijona): add a Tema toolbar to Storybook to preview dark mode | dark spot-check support |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a2b.1 | `src/__tests__/quality/tokenLint.test.ts` + `darkModeAllowlist.ts` (new) | Unit (TS AST string scan + postcss) | 41/361 | 2 failed: 383 source violations with an empty allowlist, and 10 index.css colors. The fixture then caught a false positive (`white` inside `--jona-white`); the regex was fixed and the fixture extended | 4/4 | fixture: raw utilities with variants and opacity, hex and `rgb()` are flagged; token classes, brand palettes, `#section` and `white-space` are accepted | none |
| a2b.2 | tokenLint, with the atom entries removed from the allowlist | Unit | 4/4 | 1 failed: 62 atom violations | 4/4; full suite 42/370 | the shrink-only test failed on a stale JTable entry until the allowlist was regenerated | codemod (`scratchpad/prs-ux/tokenize.cjs`) + manual JProgress SVG |
| a2b.4 | `JButton.test.tsx` (1 changed, 2 new), `JTable.test.tsx` (3 changed), `cascade.test.ts` (light half changed, 3 new dark tests) | RTL + cascade/token resolver | 16/16, 34/34 | 4 failed (JButton auto, the 1.5.1 string with `text-white`, the ancestor test) + 4 failed (JTable selection/hover/unselected string, S-DAT-2 light rule names). The dark-half token tests passed at once (a2a tokens) | 16/16 + 34/34 | MUTATION: dark selection -> neutral-800 failed the dark S-DAT-2 test; restored. Explicit touch/compact under `[data-jona-density=compact]` keep their fixed classes | none |
| a2b.3 (S-FND-15) | `src/molecules/__tests__/titleScale.test.tsx` (new) | RTL | - | 2 failed (JDialog `text-sm`, JDrawer `text-base`, both off the scale) | 2/2 | dialog and drawer | none |
| status tints | `src/__tests__/quality/statusTints.test.tsx` (new) | RTL | - | 8 failed (no tint classes) | 8/8 | JSwitch error track; JAlert danger + dismiss hover; JOptionPane danger icon; JStatCard success/warning/danger tiles and up/down trend; JTimer warning | none |
| layout items | `cascade.test.ts` (+3) | RTL + cascade resolver | 17/17 | 3 failed: JNavbar max-width `100%`, JHeaderPage title width `100%`, JFooterPage slot width `100%` | 20/20 | the title at 375 and 1024; the left and center footer slots | jpanelOverrides golden updated (`kept` + `added`) |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a2b.1 | `npx vitest run src/__tests__/quality/tokenLint.test.ts` -> 4 passed | `npm run build`: no hex left in the index.css component rules | the index.css color declarations; the lint test and allowlist |
| a2b.2/a2b.4 | `npx vitest run src/atoms src/molecules/__tests__/JTable.test.tsx src/__tests__` -> all pass | headless Edge on storybook-static over `file://`, `?globals=themeMode:light` vs `dark`: `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/a2b-g1-{375,1024,1920}.png` (JButton, JTextBox, JTable selected row, JDialog) | the 17 atom Views; the JTableRow classes; the `tokenClasses.ts` additions |
| a2b.3 + items | `npx vitest run src/molecules src/__tests__/css src/__tests__/quality` -> all pass | same folder: `a2b-g2-*` (JOptionPane, JDatePicker, JTabs, JToast), `a2b-g3-*` (JSidebarLayout; JHeaderPage, now one row at 1024; JFooterPage; JStatCard tints), `a2b-drawer-*` (JDrawer open, JPagination, JStepper, JEmptyState), `a2b-probe.png` (JButton, JAlert variants); all light vs dark at 375/1024/1920 | the 15 molecule/layout Views; the 6 tint sites; the 3 organism class lists; `.storybook/preview.ts` |

### Decisions

- **Token mapping:**
  - neutral-900/800/700 text -> FG; 600-300 -> FG_MUTED;
  - bg-white -> SURFACE (SURFACE_RAISED for dialogs, drawers, option panes, dropdowns);
  - bg-neutral-50/100 -> SURFACE_MUTED; bg-neutral-200 -> LINE_BG; bg-neutral-300 -> LINE_BG_STRONG;
  - border-neutral-100/200 -> LINE; border-neutral-300 -> CONTROL_BORDER (`line-strong/0.45`);
  - hover:bg-neutral-50 -> HOVER_SURFACE_MUTED; hover:bg-neutral-100/200 and hover:bg-black/10 -> HOVER_OVERLAY (`fg/0.06`);
  - text-white on a color -> ON_PRIMARY; bg-black/40-50 -> BACKDROP;
  - the default JToast -> INVERSE, with `ring-current`.
- **Light-mode deltas are small:** muted text 400 -> 500; neutral-100 fills -> neutral-50; control borders close to the old neutral-300; the dialog title 14 -> 16 px (S-FND-15).
- **All atoms are migrated**, not only the listed ones, because JPanel is everywhere. JIcon and JAvatar had nothing to migrate.
- **The JProgress SVG** uses `stroke-*`/`fill-*` classes, because a presentation attribute does not resolve `var()`. `warning` moves from amber-500 `#f59e0b` to the palette warning-500.
- **Status tints:** the 1.5.1 `200` step maps to the `100` tint, since only 50/100/700 exist, so the JSwitch error track is `danger-100`. JAlert danger also drops the default-palette `bg-red-50` for `danger-50`.
- **JNavbar content width** is `max-w-7xl`, the same cap as JSiteFooter.
- **JHeaderPage/JFooterPage:** `w-auto` on the title and on the left/center slots (orchestrator assignment). The header now lays out as one row at 1024.
- **Storybook `Tema` toolbar** (globals `themeMode`, default light): it sets `data-theme-mode` on the preview root and paints the body with the tokens. It makes the dark spot-check possible on every story and changes nothing in light.
- **The allowlist is generated** from the scan (`scratchpad/prs-ux/{dumplint,genallow}.cjs`): 76 files at a2b.1, 59 after the atoms, 43 at the tip.

### Deviations (spec/design text aligned)

- design D5: names the derived and variant constants (status tints, fg wash, `line-strong/0.45`, backdrop, inverse, SVG stroke/fill).
- design D8: the 1.6.0 `auto` sets both breakpoints with the control-height variable.
- tasks.md a2b: the fallback split note, the a2b.1 scan scope, the a2b.2/a2b.3 notes, and the commit list.

### Pre-existing test assertions changed

| File | Assertion | Allowed by |
|---|---|---|
| `src/atoms/__tests__/JButton.test.tsx` | `MD_151`: `text-white` -> `text-[rgb(var(--jona-on-primary))]`; the rest of the no-density string is identical | a2b: "1.5.1 lib assertions that named raw palette classes are updated" |
| `src/atoms/__tests__/JButton.test.tsx` | `auto` test: its name, and the expected `min-h-11 sm:min-h-9` -> `min-h-[var(--jona-control-h)] sm:min-h-[var(--jona-control-h)]` | S-FND-18 (1.6.0 half) |
| `src/molecules/__tests__/JTable.test.tsx` | selected `bg-primary-50` -> the selection token; hover `hover:bg-primary-50`/`hover:bg-neutral-50` -> the selection/surface-muted hover tokens; the unselected-row class string tokenized | S-DAT-1, R-DAT-1 (1.6.0 uses the selection token) |
| `src/__tests__/css/cascade.test.ts` | S-DAT-2 light: the hover and selected-hover rule selectors, and the expected variables (`--jona-neutral-50`/`--jona-primary-50` -> `--jona-surface-muted`/`--jona-selection`) | S-DAT-2 (1.6.0) |
| `src/__tests__/quality/customization.test.tsx` | JSwitch override test: its name, and `not.toContain('bg-neutral-300')` -> the token off-track class | a2b raw-palette assertion update; the meaning is kept (the override replaces the default) |
| `src/__tests__/css/jpanelOverrides.golden.json` | `kept` + `added`: JHeaderPage/JFooterPage `w-auto`, JNavbar `max-w-7xl` | S-FND-24 (reviewed snapshot of the honored JPanel tokens) |

### Deferred items

- **43 Views stay on the allowlist:** organisms and marketing molecules, such as JHeaderPage, JFooterPage, the JStatCard and JTimer neutrals, JDashboardPreview, JDataTable, JCombobox, JMultiSelect, JTooltip and JCard.
  - They keep their 1.5.x light colors in dark mode.
  - Text that inherits the body color can disappear on their white surfaces in dark (seen in the JFooterPage story).
  - Migrate them as later slices touch them (a6-a9 compose several).
- **Non-neutral default-palette tints stay light in dark:** JAlert info/success/warning (`bg-green-50`, `bg-yellow-50`) and the `bg-primary-50` info tiles. The lint covers neutrals only, per R-FND-3.
- **Open overlays not screenshot:** the dialog, option-pane and toast stories open on click, so their open states were not captured. RTL covers them, and the open JDrawer shares the overlay tokens.
- **Golden line numbers:** the `added` line numbers in `jpanelOverrides.golden.json` are informational (not checked). The a2b import lines shifted some of them by one; the a10 CHANGELOG should regenerate them.
- **CHANGELOG 1.6.0 (a10):**
  - Changed: the light-mode deltas above; JButton `auto` follows `--jona-control-h`; the dialog/drawer titles use the section style; the status tints are repainted; the JNavbar/JHeaderPage/JFooterPage widths.
  - Notes: 43 Views are still light in dark.

## Slice a4: form primitives (DONE)

Base: the a2b tip `feat/softcommerce-a2b-token-migration` @ `eb026e5a`. Baseline there: test 44 files / 383 tests. Version stays 1.5.2.

### Branches (split applied at a different boundary than the named fallback)

| Branch | Base | Tasks | Lines (numstat) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a4-forms-i` @ `2df8abac` | a2b @ `eb026e5a` | a4.1-a4.3 | 752 | test 47 files / 405 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a4-forms-ii` @ `522807ac` | a4-i | a4.4-a4.7 | 708 | test 49 files / 432 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a4-forms` @ `522807ac` | alias of the a4-ii tip | - | - | same as a4-ii |

a4.1-a4.3 alone measured 752 lines, so the named fallback (a4-i = a4.1-a4.5) could not hold. `git branch -m` renamed the branch to `-i` after commit 1; `-ii` was started with `git switch -c`; a4.6 fit in `-ii` (708), so there is no `-iii`. The planned name was created with `git switch -c` at the a4-ii tip.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `2df8abac` | feat(uijona): add JField and JFieldGrid | a4.1-a4.3 (+ exports, stories) |
| `348fdf3f` | feat(uijona): add JFormSection and JErrorSummary | a4.4-a4.5 (+ exports, stories) |
| `522807ac` | feat(uijona): add label, error and ref to JDatePicker | a4.6-a4.7 |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a4.1 | `src/__tests__/quality/componentPattern.test.ts` (new); `packageExports.test.ts` (+1 R-FND-8 list) | Unit (fs + TypeScript AST) | 44/383 | 6 failed / 1 passed (files, DEFAULTS and exports missing for JField and JFieldGrid; the fixture passes by design) | 7/7 | fixture: `open`, `selectedId` and quoted `'checked'` are flagged; a non-DEFAULTS `value` is ignored | none |
| a4.2 | `src/molecules/__tests__/JField.test.tsx` (new) | RTL + axe | N/A (new) | module not found | 9/9 | required vs optional; help + error vs error alone; error removed; custom `requiredLabel`; `as="fieldset"` | none |
| a4.3 | `src/layouts/__tests__/JFieldGrid.test.tsx` (new) + helper `src/__tests__/css/utilityStyle.ts` | RTL + compiled-CSS utility resolver | N/A (new) | module not found; then 1 failed: an explicit `span={undefined}` lost the default through the DEFAULTS spread (a real bug, fixed with `??`) | 5/5 | spans 3/4/6/12/default at 768 and 1024; 12 at 767 and 375; gap md vs lg. MUTATION: dropping `col-span-12` from span 3 failed the below-md test; restored | type-only helper (the compile moved into the test, so `tsc` stays clean) |
| a4.4 | `src/molecules/__tests__/JFormSection.test.tsx` (new) | RTL + axe | N/A (new) | module not found | 5/5 | description + error order; error removed; heading level 3 vs 2; S-FND-15 title class | none |
| a4.5 | `src/molecules/__tests__/JErrorSummary.test.tsx` (new) | RTL + axe | N/A (new) | module not found | 5/5 | empty vs two errors; default vs custom title; select first vs second. MUTATION: `autoFocus` on the first entry failed S-FRM-9; restored | none |
| a4.6 | `src/molecules/__tests__/JDatePicker.test.tsx` (+11 cases, +4 imports) | RTL + axe | 3/3 (+ mobile-layout 46) | 10 failed / 1 passed (the axe guard passes by design) | 14/14; the 3 existing cases unchanged (S-FRM-16) | label vs JField wiring; own error vs external description; complete vs incomplete entry; typed vs calendar pick; iso vs mask `onBlur`. MUTATION: reporting the masked text instead of ISO failed 3 tests; restored | none |
| a4.7 | exports, stories | CHECK | - | n/a | gate at a4-ii | - | - |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a4-i | `npx vitest run src/__tests__ src/molecules/__tests__/JField.test.tsx src/layouts` -> all pass | headless Edge on storybook-static over `file://`, light vs dark (`?globals=themeMode:`) at 375/1024/1920: `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/a4i-{375,1024,1920}.png` (JField with error, fieldset, JFieldGrid register form: 3/6/3, 4/4/4, 6/6 and 12 at 1024; one column at 375) | `src/molecules/JField/*`, `src/layouts/JFieldGrid/*`, their tests, `componentPattern.test.ts`, `utilityStyle.ts`, 2 export lines, 2 export-map entries, 1 packageExports test |
| a4-ii | `npx vitest run src/molecules src/__tests__` -> all pass | same, `sheets/a4ii-{375,1024,1920}.png` (JFormSection group error, JErrorSummary, JDatePicker label + error, the dd/MM/yyyy + ISO recipe showing `15/01/2026` for the value `2026-01-15`) | `src/molecules/{JFormSection,JErrorSummary}/*` and their tests; the JDatePicker Inter/Impl/View/story additions and the 11 new cases |

### Decisions

- **JField `requiredLabel`** is the hover `title` of the aria-hidden `*`. The control gets `aria-required`, so the name stays exactly the label (S-FRM-1, S-FRM-4) and the description stays help + error (S-FRM-2). The exploration's sr-only "obligatorio" would have broken S-FRM-1's exact name.
- **JField fieldset mode:** the fieldset carries `aria-describedby`; the children get `id`, `aria-invalid` and `aria-required` (no describedby, so each option keeps its own name).
- **Field and section errors** are `TEXT_CAPTION` + `DANGER_FG` paragraphs, never `role="alert"`. JLabel `error` is an alert, so it is not used.
- **JFieldGrid** is `grid grid-cols-12` at every width; each JField carries `col-span-12` plus `md:col-span-{3,4,6}`. A 1-column base grid would make `col-span-12` create implicit columns.
- **DEFAULTS resolve with `??`**, not a spread, so an explicit `undefined` prop still takes the default (found by the JFieldGrid RED).
- **JDatePicker ISO recipe:** `valueFormat="iso"` shows an ISO value through the mask and reports a complete valid entry as ISO. An incomplete entry is reported as typed, so a controlled parent never erases the text being typed. A calendar pick is shown masked and reported as ISO. `onBlur(value)` reports in the value format.
- **JDatePicker name:** with `label` or `id`, the placeholder is no longer the `aria-label` (an `aria-label` would override the label). An `id` without `label` expects an external `<label for>`, as JField renders. Without both, the 1.5.1 `aria-label` stays.
- **Locked APIs kept exactly:** no `className` was added to JField, JFieldGrid, JFormSection or JErrorSummary; `onSelect(field)` takes the field only.
- **Dark mode:** every new View uses `tokenClasses`, and nothing was added to the dark allowlist. The composed Views (JTextBox, JLabel, JDatePicker, JPanel) were already off the allowlist, so there was nothing to shrink.

### Deviations (spec/design text aligned)

- spec `jona-ui-forms` R-FRM-6: the ISO recipe is named as a fix of `valueFormat="iso"` for the 1.6.0 CHANGELOG (1.5.1 showed the raw ISO text and reported the masked text); incomplete entries are reported as typed; with `label`/`id` the placeholder is no longer the `aria-label`.
- design (Interfaces): the JDatePicker note above; the JField `requiredLabel` and fieldset wiring.
- tasks.md a4: the split note and the commit tips.

### Pre-existing test assertions changed

None. `packageExports.test.ts` gained one test. `JDatePicker.test.tsx` gained 11 cases and 4 imports; its 3 cases are unchanged (S-FRM-16).

### Deferred items

- **a10 CHANGELOG 1.6.0:** Added: JField, JFieldGrid, JFormSection, JErrorSummary; JDatePicker `label`, `error`, `id`, `name`, `required`, aria props, `onBlur` and ref. Fixed: `valueFormat="iso"` with a non-ISO mask now displays through the mask and reports ISO.
- The JDatePicker trigger shows a danger border when invalid. A JTextBox inside a JField still needs `hasError` from the host for its own red border; the JField stories show only the text error.

## Slice a5: feedback (DONE)

Base: the a4 tip `feat/softcommerce-a4-forms` @ `522807ac`.

### Branches (split applied at a task boundary; a5 had no named fallback)

| Branch | Base | Tasks | Lines (numstat; snapshot excluded) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a5-feedback-i` @ `8271ad0e` | a4 @ `522807ac` | a5.1-a5.2 | 616 (+182 generated snapshot) | test 51 files / 456 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a5-feedback-ii` @ `f2dbcf05` | a5-i | a5.3-a5.4 | 347 | test 52 files / 468 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a5-feedback` @ `f2dbcf05` | alias of the a5-ii tip | - | - | same as a5-ii |

a5.1-a5.2 measured 616 lines; the toasts would have taken the slice to about 963. `git branch -m` renamed the branch to `-i` after commit 2.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `5a79e2ca` | feat(uijona): add JOptionPane details and initial focus | a5.1 (+ `details` story) |
| `8271ad0e` | feat(uijona): add useConfirm and ConfirmProvider | a5.2 (+ exports, confirm-over-a-dialog story) |
| `f2dbcf05` | fix(uijona): announce danger toasts as alerts and add toast options | a5.3-a5.4 |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a5.1 | `src/molecules/__tests__/JOptionPane.test.tsx` (new) + `__snapshots__/JOptionPane.test.tsx.snap` | RTL + approval snapshot | the JOptionPane cases of focus-management, mobile-layout and statusTints green | 4 failed / 2 passed: the no-details snapshot (approval, written before the change) and the panel-focus default pass by design | 6/6, snapshot unchanged | details with a description vs alone; string vs node; focus cancel vs confirm vs none | buttons reached through JButton refs, not data attributes, so the no-details markup is byte-identical |
| a5.2 | `src/hooks/__tests__/useConfirm.test.tsx` (new) | RTL + axe | N/A (new) | module not found | 15/15 | three decline paths; danger vs info vs explicit focus; a JDialog beneath with and without `renderPane`; FIFO answers true then false; unmount with two pending. MUTATION: removing `stopImmediatePropagation` failed S-FBK-8 (the JDialog closed); restored | none |
| a5.3 | `src/hooks/__tests__/useToast.test.tsx` (new) | RTL + fake timers + compiled-CSS resolver + axe | the toast cases of mobile-layout and mobile-touch-p2 green | 5 failed / 7 passed (the passes approve the 1.5.1 behavior that is kept: the 4000 ms timer, no focus steal, the English defaults, bottom-right and top-right placement) | 12/12 | hover vs focus pause; success vs danger; the `error` helper; custom vs default labels and offset. MUTATION: ignoring the pause failed 2 tests; restored | none |
| a5.4 | stories, exports | CHECK | - | n/a | gate at a5-ii | - | - |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a5-i | `npx vitest run src/hooks src/molecules/__tests__/JOptionPane.test.tsx src/__tests__` -> all pass | headless Edge, light vs dark at 375/1024/1920: `sheets/a5i-{375,1024,1920}.png` (JOptionPane with details and cancel focused; the confirm opened over a JDialog on mount) | the JOptionPane Inter/Impl/View/entry/story additions, its test and snapshot; `src/hooks/useConfirm/*` and its test; 1 export line, 1 export-map entry, the pattern and export-list entries |
| a5-ii | `npx vitest run src/hooks src/__tests__/quality` -> all pass | same, `sheets/a5ii-{375,1024,1920}.png` (top-right stack with Spanish labels, a success and a persistent danger toast, focus left in the text box) | JToast Inter/Impl/View; useToast Inter/Impl/entry/story; the toast test |

### Decisions

- **useConfirm folder:** `InterUseConfirm.ts`, `UseConfirmImpl.tsx`, `UseConfirmView.tsx` (renders the first queued pane through `renderPane` or a `JOptionPane`), `useConfirm.ts` and `index.ts`. `componentPattern.test.ts` gained optional `unit`/`defaults` fields for hook folders (`CONFIRM_DEFAULTS`).
- **One pane per request:** each request mounts a fresh pane (`key` = request id), so the focus trap saves and restores the opener per request. Requests settle by id, so a late second click can never answer the next request.
- **Esc (D9):** the provider adds a window-capture `keydown` listener only while its own pane is open (`preventDefault` + `stopImmediatePropagation`). With `renderPane`, no listener is added.
- **The "close control"** of S-FBK-2 is the JOptionPane backdrop; the pane has no close button.
- **JOptionPane `initialFocus`** runs after the focus trap has focused the panel. Without it the panel keeps focus (1.5.1).
- **Toasts:** `danger` is `role="alert"` with `aria-live="assertive"`. The timer keeps the time left across pauses (hover, or focus inside). `JToast` gained `dismissLabel` (a new `JTOAST_DEFAULTS` key, `'Dismiss notification'`) so the provider can pass its label. `message` became optional in `InterJToast` and `ToastData`, because S-FBK-12 calls `toast({ variant, title })`.
- **ToastProvider `offset`:** the default `'1rem'` keeps the 1.5.1 classes and adds no inline style. Another offset sets the position's sides and a `max-width` inline (D4), so the 1.5.1 width classes stay. `TOAST_PROVIDER_DEFAULTS` and `ToastProviderProps` are now exported.
- **Dark mode:** no View touched here is on the allowlist (JOptionPane, JToast and JDialog were migrated in a2b), and nothing was added.

### Deviations (spec/design text aligned)

- spec `jona-ui-feedback` S-FBK-2: the close control is the backdrop. S-FBK-11: the approval snapshot is taken before the change, on the a2b-tokenized classes.
- design (Interfaces): the ToastProvider defaults and offset rule; JToast `dismissLabel` and optional `message`; the ConfirmProvider per-request pane and folder files.
- tasks.md a5: the split note; the useConfirm exports and stories ship with a5.2.

### Pre-existing test assertions changed

None. No lib test asserted a `danger` toast as `status`, so the a5 "1.5.1 lib assertion changed" item had nothing to change. The new toast test pins the fix.

### Deferred items

- **a10 CHANGELOG 1.6.0:** Added: useConfirm, ConfirmProvider and CONFIRM_DEFAULTS; JOptionPane `details` and `initialFocus`; ToastProvider `label`, `dismissLabel` and `offset`; JToast `dismissLabel`. Fixed: `danger` toasts are `role="alert"`; the toast timer pauses on hover and focus. Changed: `message` is optional.
- **a10 README:** the `top-right` toast recommendation (the stories already carry it).
- **Dark backdrop:** in dark mode the `BACKDROP` (`neutral-900/0.5`) barely shows over the dark page, so a confirm over a JDialog does not visibly dim the dialog. This is the a2b token choice; it shows in `a5i-1024.png`.

## Slice a6: page chrome (DONE)

Base: the a5 tip `feat/softcommerce-a5-feedback` @ `f2dbcf05`. Baseline there: test 52 files / 468 tests. Version stays 1.5.2.

### Branches (split at task boundaries; the named fallback could not hold)

| Branch | Base | Tasks | Lines (numstat; snapshot excluded) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a6-page-chrome-i` @ `32932427` | a5 @ `f2dbcf05` | a6.1 | 265 | test 54 files / 479 tests pass; lint, build pass (run on a `git archive` export of `32932427` with a node_modules junction). No story changed |
| `feat/softcommerce-a6-page-chrome-ii` @ `9b36aa0f` | a6-i | a6.2 (+ JToolbar exports, story) | 578 | test 55 files / 493 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a6-page-chrome-iii` @ `c988d39f` | a6-ii | a6.3-a6.6 | 652 (+3 generated snapshot) | test 58 files / 517 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a6-page-chrome` @ `c988d39f` | alias of the a6-iii tip | - | - | same as a6-iii |

a6.1-a6.2 measured 836 lines (the fallback a6-i), so the branch was renamed to `-i` after the a6.1 commit (`git branch -m`). a6-ii plus a6.3 measured 854, so JPageHeader moved to `-iii`.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `32932427` | feat(uijona): add roving focus and menu popup helpers | a6.1 |
| `9b36aa0f` | feat(uijona): add JToolbar | a6.2 (+ exports, stories incl. `OverflowOpen` with a play function) |
| `5ee7ddb1` | feat(uijona): add JPageHeader and JInputGroup | a6.3-a6.4 (+ exports, stories) |
| `c988d39f` | feat(uijona): add JPagination rows info | a6.5-a6.6 |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a6.1 | `src/lib/__tests__/roving.test.ts`, `src/lib/__tests__/menuPopup.test.tsx` (new) | Unit + RTL | 52/468 | module not found (both files) | 11/11 (a test-side `act()` wrap for the native dispatch) | orientations, bounds, Home/End, paging from 0/20/4/14, disabled skip, entry from -1, empty list; Esc vs other keys, inside vs outside press, closed menu. MUTATION: dropping `stopPropagation` let Esc reach `document` (1 failed); restored | none |
| a6.2 | `src/molecules/__tests__/JToolbar.test.tsx` (new) | RTL + axe | - | module not found | 11/11 | groups and separator; → skips a disabled item, ←, End, Home; reason as description and title; shortcut; overflow open/select/disabled item; ↑↓ in the menu; no overflow; custom label; Esc over a JDialog; outside press; axe closed and open. MUTATION: roving without the disabled filter failed S-DAT-17; restored | none |
| a6.2 exports | `componentPattern.test.ts`, `packageExports.test.ts` (+1 list entry each) | Unit | 24/26 | 2 failed (export missing) | 26/26 | - | - |
| a6.3 | `src/molecules/__tests__/JPageHeader.test.tsx` (new) | RTL + axe | - | module not found | 6/6 | crumbs as text vs buttons; level 1 vs 2; custom label; slots present vs absent; ref focus. MUTATION: `TEXT_SMALL` on the heading failed S-FND-15; restored | none |
| a6.4 | `src/molecules/__tests__/JInputGroup.test.tsx` (new) | RTL + compiled-CSS utility resolver + axe | - | module not found; then a test-side query fix (`getAllByRole` takes no predicate) | 6/6 | lookup at 640 vs 639; `columns` override; default row; invalid on/off. MUTATION: lookup `sm:items-center` failed S-FRM-11; restored | none |
| a6.5 | `src/molecules/__tests__/JPagination.test.tsx` (new) + `__snapshots__/JPagination.test.tsx.snap` | RTL + approval snapshot + axe | the JPagination cases of `mobile-layout` green | 4 failed / 2 passed (the no-info snapshot was written on the 1.5.1 View before the change; axe passes by design) | 6/6, snapshot unchanged; mobile-layout 46/46 | page 1, last page, 0 rows with one page, custom label | none |
| a6.6 | exports, stories | CHECK | - | n/a | gate at a6-iii | - | - |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a6-i | `npx vitest run src/lib` -> 11 passed | N/A: internal helpers with no runtime surface until JToolbar | `src/lib/{roving,menuPopup}.ts` and their tests |
| a6-ii | `npx vitest run src/molecules/__tests__/JToolbar.test.tsx src/__tests__` -> all pass | headless Edge on storybook-static over `file://`, light vs dark at 375/1024/1920: `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/a6ii-{375,1024,1920}.png` (toolbar with disabled items and a separator; the overflow menu opened by the play function). The row wraps at 375 with 44 px controls | `src/molecules/JToolbar/*`, its test, 1 export line, 1 export-map entry, 2 list entries |
| a6-iii | `npx vitest run src/molecules src/__tests__` -> all pass | same folder, `sheets/a6iii-{375,1024,1920}.png` (JPageHeader list-page composition; JInputGroup lookup in one row from 640 and stacked at 375, the invalid outline, the default `S/` row; JPagination `1–20 de 134`, `121–134 de 134`, `0 de 0`) | `src/molecules/{JPageHeader,JInputGroup}/*` and their tests; the JPagination Inter/View/story additions, its test and snapshot |

### Decisions

- **JToolbar:** the tooltip is the native `title` (a disabled button fires no mouse events, so JTooltip could not show it; JTooltip is also on the dark allowlist). A disabled item's reason is a `hidden` span linked by `aria-describedby`. ← / → do not wrap. The overflow button is the last roving slot. Overflow menu items stay focusable when disabled (`aria-disabled` and the reason), so the reason is reachable by keyboard. The menu is positioned under its button (`--jona-z-dropdown`), with no portal. Tones: primary = JButton `default`, default = `outline`, danger = `outline` + `DANGER_FG`; all use `density="auto"` plus `CONTROL_H`.
- **menuPopup** is a hook, `useMenuPopup({ open, rootRef, triggerRef, onClose })`: a `document` `pointerdown` listener only while open, and an `onKeyDown` for the root that handles Esc (`preventDefault` + `stopPropagation`) and returns focus to the trigger.
- **roving:** `nextRovingIndex(current, count, key, { orientation, pageStep?, isEnabled? })` returns `null` for unhandled keys and the same index at a bound (the caller prevents the default and changes nothing).
- **JPageHeader:** the root is a `div` (a `<header>` outside `main` is a banner landmark and would clash with JAppShell); `headingLevel` 1-6; the crumb separator is an aria-hidden `/`; the count is `TEXT_SMALL` muted text outside the heading.
- **JInputGroup:** `addonEnd` is one grid cell (the lookup actions), so the 3-column preset holds code, description and actions. With no template the group is a flex row. `invalid` sets `data-invalid` and a danger outline; there is no `aria-invalid` on the `group` (ARIA 1.2 does not support it on that role; the controls carry their own).
- **JPagination:** with `showRowsInfo` and one page (or 0 rows) only the info renders. `JPAGINATION_DEFAULTS` gains `showRowsInfo: false` and `rowsInfoLabel` (additive; `formatRowsInfo` stays internal).
- **Dark mode:** every new View paints through `tokenClasses`; nothing was added to the allowlist. The composed Views (JButton, JTextBox, JDialog, JPagination) were not on it, so there was nothing to migrate.
- **JTabs `keepMounted`** is task a8.x, not a6/a7; it was not implemented here.

### Deviations (spec/design text aligned)

- design (Interfaces): the JToolbar tooltip/roving/menu/tone notes; the JPageHeader root and level range; the JInputGroup `addonEnd`, template and `invalid`; the JPagination single-page info and DEFAULTS.
- spec `jona-ui-data` R-DAT-6: a disabled menu item stays focusable with `aria-disabled` and its reason.
- tasks.md a6: the split note, the commit list, and the deferred backdrop note in a10.

### Pre-existing test assertions changed

None. `componentPattern.test.ts` and `packageExports.test.ts` only gained list entries (JToolbar, JPageHeader, JInputGroup).

### Deferred items

- **Dark `BACKDROP` (the orchestrator's extra item) -> a10, needs a decision.** It is implemented and tested in commit `cf5d980a`, parked on `feat/softcommerce-a10-backdrop-candidate` (not in the chain): `--jona-backdrop` / `--jona-backdrop-alpha`, light neutral-900 at 0.5 (unchanged), dark black at 0.7. A dialog surface beneath dims 1.34:1 (it was 1.11:1; RED recorded). With it, the full suite failed only the a5 S-FBK-11 JOptionPane approval snapshot, because the `BACKDROP` class string is in that snapshot. Regenerating it changes a pre-existing assertion that no task names, so the item was taken out of a6 (rules: stop and report) and deferred. To land it: cherry-pick `cf5d980a` and regenerate that one snapshot as a named churn.
- **Pre-existing, not changed:** JPagination's Previous/Next stack the chevron above the label from `sm` (the same in the a5 build); JTableHead's label panel is a column JPanel, so JTable header labels sit centered (JDataGrid uses its own header cells).
- **a10 CHANGELOG 1.6.0:** Added JToolbar, JPageHeader, JInputGroup; JPagination `totalRows`, `pageSize`, `showRowsInfo`, `rowsInfoLabel`.

## Slice a7: data grid (DONE)

Base: the a6 tip `feat/softcommerce-a6-page-chrome` @ `c988d39f`.

### Branches (named fallback applied)

| Branch | Base | Tasks | Lines (numstat) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a7-data-grid-i` @ `b11a9ba9` | a6 @ `c988d39f` | a7.1-a7.2 (+ exports, base story) | 594 | test 59 files / 534 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a7-data-grid-ii` @ `8b2693bc` | a7-i | a7.3 | 213 | test 59 files / 542 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a7-data-grid` @ `8b2693bc` | alias of the a7-ii tip | - | - | same as a7-ii |

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `b11a9ba9` | feat(uijona): add JDataGrid roles, selection and keyboard | a7.1-a7.2 (+ the `FOCUS_OUTLINE` token class, exports, story) |
| `8b2693bc` | feat(uijona): add JDataGrid loading, empty and row states | a7.3 (+ state stories) |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a7.1 | `src/molecules/__tests__/JDataGrid.test.tsx` (new) | RTL + axe | 58/517 | module not found | 5/5 | render function vs plain cell; sort none -> asc -> desc; click vs double-click | the visual check showed JTableHead centering its label (a column JPanel): a new RED test, "a header label sits directly in its cell", failed (`DIV` vs `BUTTON`) and passed with the grid's own `<th>`; amended into the same commit |
| a7.2 | same file | RTL + user-event | - | (the same module-not-found run) | 8/8 after one fix: keys read the row from the event target instead of state (a focus set outside `act` left a stale tab stop) | Tab in and out; the selected row as tab stop; ↓↓↑; End/Home/PgDn/PgUp on 25 rows; Enter; a bound; a cell control keeps its keys; `focusRow(key)` and `focusRow()`. MUTATION: returning before `preventDefault` at a bound failed S-DAT-10; restored | none |
| a7.3 | same file (+8 tests) | RTL + axe | 14/14 | 7 failed / 1 passed (the axe case passes on the unimplemented grid) | 22/22 | custom loading label; refresh off vs on; empty slot vs status; error row vs plain row; badge + muted vs plain; maxHeight absent vs `24rem`. MUTATION: dropping the error id from `aria-describedby` failed S-DAT-15; restored | none |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a7-i | `npx vitest run src/molecules/__tests__/JDataGrid.test.tsx src/__tests__` -> all pass | headless Edge, light vs dark at 375/1024/1920: `sheets/a7i-{375,1024,1920}.png` (the selected row in the selection token; headers left-aligned with sort icons) | `src/molecules/JDataGrid/*`, its test, `FOCUS_OUTLINE`, 1 export line, 1 export-map entry, 2 list entries |
| a7-ii | `npx vitest run src/molecules/__tests__/JDataGrid.test.tsx` -> 22 passed | same, `sheets/a7ii-{375,1024,1920}.png` (row error, the `Inactivo` muted row, the `Nuevo` badge; skeleton rows; the refresh bar over kept rows in dark; the empty slot; the 25-row Keyboard story capped by `maxHeight`) | the states in JDataGridView/Impl, the 8 tests, 4 stories |

### Decisions

- **Header cells are the grid's own `<th>`** (`role="columnheader"`, `scope="col"`, `aria-sort` only on the sorted column, a sort button whose icon is aria-hidden). Rows, cells, header and body are the JTable primitives. A column is sortable only when `onSortChange` is given.
- **Keys** are handled only when the event target is a row (S-DAT-11). Enter opens. Arrows, Home, End, PgUp and PgDn go through `nextRovingIndex` (`JDATAGRID_PAGE_STEP = 10`, exported). Focus moves first, then `onSelect`. The tab stop is the last focused row, else `selectedKey`, else the first row; a new `selectedKey` moves it.
- **Row states:** the badge (`JBadge` inside an aria-hidden span) and the error (`TEXT_CAPTION` + `DANGER_FG`) sit in the first cell; both are linked by the row's `aria-describedby`; an error sets `aria-invalid="true"` (axe accepts it on the row). `muted` = `data-muted` + `opacity-60`.
- **Loading:** `initial` renders 5 aria-hidden skeleton rows and an `sr-only` `role="status"`; `refresh` keeps the rows, sets `aria-busy` and shows an indeterminate `role="progressbar"` named by `loadingLabel`.
- **maxHeight:** `--jona-grid-max-h` inline + `max-h-[var(--jona-grid-max-h)]`; when unset the variable is invalid and the cap is `none`. The header is sticky.
- **Generic forwardRef:** `JDataGrid` is cast to `<T>(props & { ref }) => ReactElement`, so `<JDataGrid<Row> ref={...}>` type-checks.
- **Token class:** `FOCUS_OUTLINE` (`focus-visible:outline-[rgb(var(--jona-focus))]`) was added to `tokenClasses.ts` for the row focus (a table row cannot carry a ring).
- **Dark mode:** tokens only; JBadge, JSkeleton and the JTable primitives are not on the allowlist; nothing added.

### Deviations (spec/design text aligned)

- design (Interfaces): the JDataGrid note (own header cells, badge and error placement, muted, refresh bar, the key target rule).
- tasks.md a7: the fallback note.

### Pre-existing test assertions changed

None. `componentPattern.test.ts` and `packageExports.test.ts` gained the JDataGrid entry.

### Deferred items

- **a10 CHANGELOG 1.6.0:** Added JDataGrid (+ `JDataGridHandle`, `JDATAGRID_PAGE_STEP`).
- A long row error wraps inside the first column when that column is narrow (seen with the 6rem `Código` column); the host can put a wider column first.

## Slice a8: navigation (DONE)

Base: the a7 tip `feat/softcommerce-a7-data-grid` @ `8b2693bc`. Baseline there: test 59 files / 542 tests. Version stays 1.5.2.

### Branches (split at a task boundary; a8 had no named fallback)

| Branch | Base | Tasks | Lines (numstat) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a8-navigation-i` @ `43bccd0e` | a7 @ `8b2693bc` | a8.1-a8.2 (+ JTreeNav exports, base story) | 683 | test 61 files / 562 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a8-navigation-ii` @ `a6a4e3bd` | a8-i | a8.3-a8.5 | 704 | test 61 files / 582 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a8-navigation` @ `a6a4e3bd` | alias of the a8-ii tip | - | - | same as a8-ii |

a8.1-a8.3 measured 1,081 lines (tests 489, JTreeNav 350, story 140). The finished a8.3 sources were saved to the scratchpad, the a8.2-state Inter/View/Impl/story were written back and committed as a8-i (`git branch -m` to `-i`), and `-ii` (`git switch -c`) re-ran the a8.3 RED against the committed a8.2 code (10 failed) before the a8.3 sources were restored.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `43bccd0e` | feat(uijona): add JTreeNav and filterTree | a8.1-a8.2 (+ exports, `Default` story) |
| `c4232fe1` | feat(uijona): add JTreeNav filter box and checkbox variant | a8.3 (+ `WithFilter`, `Filtered`, `NoResults`, `Checkbox` stories) |
| `a6a4e3bd` | feat(uijona): add JTabs keepMounted and trigger indicators | a8.4-a8.5 (+ `KeepMounted`, `TriggerIndicators` stories) |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a8.1 | `src/molecules/__tests__/filterTree.test.ts` (new) | Unit | 59/542 | module not found | 7/7 | upper-case vs accented text; several branches; a branch label alone matches nothing; no match; blank text returns the input; input not mutated. MUTATION: dropping the diacritic strip failed the `clí` case; restored | the accent fold is `/\p{M}/gu` (ASCII source) |
| a8.2 | `src/molecules/__tests__/JTreeNav.test.tsx` (new) | RTL + axe | - | module not found | 10/10 | → on a closed vs an open branch; ← on a child vs an open branch; Enter vs Space; leaf vs branch; click on a branch vs a leaf; one letter vs a quick run (fake `Date`); active vs default tab stop. MUTATION: a type-ahead that starts at the current node failed S-CHR-8; dropping the badge `aria-describedby` failed S-CHR-10; both restored | none |
| a8.2 exports | `componentPattern.test.ts`, `packageExports.test.ts` (+1 entry each) | Unit | - | 3 failed | all pass | - | - |
| a8.3 | same file (+13 tests) | RTL + axe | 10/10 | 10 failed / 3 passed (the two axe cases and "a disabled node is not checked" pass on the a8.2 tree). Re-run on a8-ii against the committed a8.2 code: 10 failed | 23/23 | controlled vs box filter; default vs custom labels; match vs no match; checked vs unchecked; text vs box vs chevron; Space vs Enter; disabled; maxHeight on/off. MUTATION: reporting `onToggle` during a filter failed S-CHR-12; no `stopPropagation` on the box failed S-CHR-13; both restored | none |
| a8.4 | `src/molecules/__tests__/JTabs.test.tsx` (+7 cases, +3 import lines) | RTL + axe | 65/65 (JTabs, mobile-layout, responsive) | 5 failed / 7 passed (the 5 1.5.1 cases, the "without the prop" approval and axe) | 12/12 after a test-side fix (`textContent` includes the hidden description, so the count is asserted as a visible element) | keepMounted on/off with state kept vs reset; invalid on/off; default vs custom label; count 3 vs 0; invalid + count. MUTATION: `hidden={false}` failed S-CHR-19; restored | the visual check showed the dot and counter invisible inside JButton's inline `.jbutton-text` span: `inline-block` + `ms-1.5` (amended into the same commit) |
| a8.5 | stories | CHECK | - | n/a | gate at a8-ii | - | - |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a8-i | `npx vitest run src/__tests__ src/molecules/__tests__/JTreeNav.test.tsx src/molecules/__tests__/filterTree.test.ts` -> 277 passed | headless Edge on storybook-static over `file://`, light vs dark at 375/1024/1920: `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/a8i-{375,1024,1920}.png` and `a8i-1024-full.png` (Recientes, 49 leaves, the active `Cliente` in the selection token, the `Próximamente` badge) | `src/molecules/JTreeNav/*`, two tests, 1 export line, 1 export-map entry, 2 list entries |
| a8-ii | `npx vitest run src/molecules/__tests__/JTreeNav.test.tsx src/molecules/__tests__/JTabs.test.tsx src/__tests__` -> all pass | same folder, `sheets/a8ii-{375,1024,1920}.png` (filter `cli`, checkbox tree capped by `maxHeight`, `Sin resultados`, tab indicators, keepMounted) and full-scale `sheets/a8ii-trigger-indicators-{light,dark}.png`, `a8ii-keep-mounted-{light,dark}.png` | the a8.3 JTreeNav additions and tests; the JTabs Inter/Impl/View/entry/story additions and the 7 cases |

### Decisions

- **JTreeNav DOM:** `ul[role=tree] > li[role=none] > div[role=treeitem] + ul[role=group]` (the APG navigation pattern), so a branch's name is its label only. Indentation is `--jona-tree-level` inline with one literal `ps-[calc(...)]` class (D4).
- **Keys:** handled only when the treeitem itself is the target. Disabled nodes are focusable and in the roving order. Type-ahead keeps a 500 ms buffer (`Date.now`, no timers); a repeated letter cycles; matching is accent-insensitive (`foldText`, shared with `filterTree`).
- **Filter:** `filter` controls the text; without it the box keeps its own. While a filter is active the expansion is local (seeded from `filterTree().expandedIds`) and `onToggle` is not called, so clearing restores the host's `expandedIds` exactly (S-CHR-12). With no match the tree is replaced by the `noResultsLabel` text (an empty `role=tree` fails axe).
- **Checkbox variant:** the row click selects, the aria-hidden box (`data-jtreenav-check`) and Space check, the chevron (`data-jtreenav-toggle`) and Enter toggle, and the arrow keys select the node they move to (softcommerce-user-permissions: "a click on the node text, or the arrow keys, selects the node"). A disabled node is not checked. The box is primary-600 when checked, `CONTROL_BORDER` + `SURFACE` when not.
- **`badge` is a string**, shown in a `JBadge secondary` inside an aria-hidden span that is the `aria-describedby` target.
- **Recientes** is data: the host puts a `Recientes` branch first (the story shows it). No lib prop was added.
- **JTabsTrigger:** `invalid` = an aria-hidden `bg-danger-600` dot + a hidden `invalidLabel` span; `count` = an aria-hidden counter (`LINE_BG`, `FG`) that is also a describedby target, so the description reads `Con errores 3`. A host `aria-describedby` is merged first. `JTABS_TRIGGER_DEFAULTS` and `InterJTabsTrigger` are exported; `JTABS_DEFAULTS` gains `keepMounted: false`.
- **Dark mode:** JTreeNav and the JTabs additions paint through `tokenClasses`; JTabs, JBadge and JTextBox are not on the allowlist; nothing added.

### Deviations (spec/design text aligned)

- spec `jona-ui-app-chrome` R-CHR-3: expansion during a filter is local and not reported through `onToggle`. R-CHR-4: in the checkbox variant the arrow keys select, the chevron and Enter toggle, and a disabled node is not checked.
- design (Interfaces): the JTreeNav note (DOM, type-ahead, filter, checkbox, defaults) and the JTabs/JTabsTrigger note.
- tasks.md a8: the split note and the commit list.

### Pre-existing test assertions changed

None. `componentPattern.test.ts` and `packageExports.test.ts` gained the JTreeNav entry. `JTabs.test.tsx` gained 3 import lines and 7 cases; its 5 1.5.1 cases and their imports are byte-identical.

### Deferred items

- **a10 CHANGELOG 1.6.0:** Added JTreeNav (`filterTree`, `JTREENAV_DEFAULTS`); JTabs `keepMounted`; JTabsTrigger `invalid`, `invalidLabel`, `count` (`JTABS_TRIGGER_DEFAULTS`, `InterJTabsTrigger`).
- **b4 note:** JTreeNav has no ref to its filter box (the locked API has none). Ctrl+K and `/` (`Buscar opción`) in b4 must focus it through the DOM (the searchbox named by `filterLabel`) or through a 1.6.x additive prop.
- A long label next to the `Próximamente` badge truncates in a 16.5rem sidebar (`Registro de V…`).

## Slice a9a: app shell, user menu, context chip (DONE)

Base: the a8 tip `feat/softcommerce-a8-navigation` @ `a6a4e3bd`.

### Branches (split at a task boundary; a9a had no named fallback)

| Branch | Base | Tasks | Lines (numstat) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a9a-app-shell-i` @ `4b77b7ca` | a8 @ `a6a4e3bd` | a9a.1 (+ exports, stories) | 505 | test 62 files / 595 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a9a-app-shell-ii` @ `2c756d3e` | a9a-i | a9a.2-a9a.3 + a JAppShell topbar fix | 693 | test 64 files / 615 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a9a-app-shell` @ `2c756d3e` | alias of the a9a-ii tip | - | - | same as a9a-ii |

JAppShell alone measured 505, so the 620 forecast could not hold. `git branch -m` renamed the branch to `-i` after commit 1.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `4b77b7ca` | feat(uijona): add JAppShell | a9a.1 (+ exports, `Default`, `Rail`, `DrawerOpen` stories) |
| `0c6ba3f6` | fix(uijona): let the JAppShell topbar end shrink before the brand | found by the a9a-ii visual check (+1 test) |
| `2c756d3e` | feat(uijona): add JUserMenu and JContextChip | a9a.2-a9a.3 (+ exports, stories; the JAppShell story composes both) |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a9a.1 | `src/layouts/__tests__/JAppShell.test.tsx` (new) | RTL + compiled-CSS utility resolver + axe | 61/582 | module not found | 10/10 | expanded vs rail; default vs custom widths; defaultCollapsed; Esc vs Cerrar menú vs `api.close` vs outside press; 1023 vs 1024; default vs custom labels; axe closed and open. MUTATION: no drawer Esc handler failed S-CHR-3; no rail class failed S-CHR-2; both restored | none |
| a9a.1 exports | `componentPattern.test.ts`, `packageExports.test.ts` | Unit | - | 3 failed | all pass | - | - |
| topbar fix | same file (+1 test) | compiled-CSS utility resolver | 10/10 | 1 failed (brand `flex-shrink` undefined) | 11/11 | - | none |
| a9a.2 | `src/molecules/__tests__/JUserMenu.test.tsx` (new) | RTL + axe | - | module not found | 9/9 after a test-side fix (the role query takes no regex or function: `querySelectorAll('[role^="menuitem"]')`) | click vs ↓ on the closed button; ↓ ↑ End; Enter (action) vs Space (radio); enabled vs disabled; checked vs unchecked; Esc over a JDialog; inside vs outside press. MUTATION: inverted `aria-checked` failed S-CHR-22; restored | `entriesOf` typed for `tsc` |
| a9a.3 | `src/molecules/__tests__/JContextChip.test.tsx` (new) | RTL + axe | - | module not found | 4/4 | three items vs one vs none. MUTATION: no `title` failed 1; no `aria-describedby` was masked (the `title` also yields the description), so an assertion on the describedby target was added, which then failed; restored | none |
| a9a.2-3 exports | `componentPattern.test.ts`, `packageExports.test.ts` | Unit | - | 5 failed | all pass | - | - |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a9a-i | `npx vitest run src/__tests__ src/layouts` -> 287 passed | headless Edge, light vs dark at 375/1024/1920: `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/a9ai-{375,1024,1920}.png` (inline sidebar with a JTreeNav, the rail, the drawer opened by the play function at 375 with its backdrop) | `src/layouts/JAppShell/*`, its test, 1 export line, 1 export-map entry, 2 list entries |
| a9a-ii | `npx vitest run src/__tests__ src/molecules/__tests__/JUserMenu.test.tsx src/molecules/__tests__/JContextChip.test.tsx src/layouts` -> all pass | same folder, `sheets/a9aii-{375,1024,1920}.png` (the open user menu with the `Tema` group and `Cerrar sesión` in danger; the chip; the shell topbar with chip + menu, brand intact at 375) | `src/molecules/{JUserMenu,JContextChip}/*` and their tests; the JAppShellView brand/end classes and their test; 2 export lines, 2 map entries, 4 list entries |

### Decisions

- **JAppShell does not compose JSidebarLayout**: its Esc is a `document` listener, which D9 forbids, so JSidebarLayout is untouched (it is not on the dark allowlist either). `SidebarRenderApi` is imported from JSidebarLayout and not re-exported (a second star export would be ambiguous).
- **Drawer (below lg):** the sidebar element becomes `role=dialog aria-modal` named `navLabel`, with `useFocusTrap` (focus in, Tab cycle, focus back to `Abrir menú`) and the a6 `useMenuPopup` (Esc on its own root with `preventDefault` + `stopPropagation`, outside `pointerdown`). Closed below lg it is `invisible -translate-x-full`; from lg it is `lg:static lg:visible`. A resize to >= 1024 closes it. `api.collapsed` is false inside the drawer.
- **Rail:** the widths are `--jona-shell-sidebar-w` / `--jona-shell-rail-w` inline on the root, with literal `lg:w-[var(...)]` classes. The collapse toggle sits in the sidebar foot (`hidden lg:flex`), keeps the name `Contraer menú` and reports the state with `aria-expanded` + `aria-controls`.
- **Topbar:** `header role=banner`, `h-[var(--jona-topbar-h)]`; the `Abrir menú` container is `flex lg:hidden` (S-FND-4 mechanism); the brand keeps its width and `topbarEnd` takes the rest, so a chip truncates first.
- **JUserMenu:** reuses `nextRovingIndex` and `useMenuPopup`. The name/subtitle header is in the popup but outside `role=menu`; each radio item is a `role=group` labelled by its caption, with `menuitemradio` options; separators split item kinds. The button is named by `aria-label={name}` (the visible name is hidden below `sm`); the avatar is JAvatar with the initials of the first two words. ↓/↑ on the closed button open the menu at the first/last item; Tab closes it. The root is `h-fit`, so `top-full` stays under the button in a stretching flex parent (found visually).
- **JContextChip:** a `<p>` (no button role), an `inline-block` pill; text = the values joined ` · `; `title` and `aria-describedby` (a hidden span) = the pairs joined `; `; nothing renders with no items.
- **DEFAULTS:** `JUSERMENU_DEFAULTS` and `JCONTEXTCHIP_DEFAULTS` are empty objects (the locked APIs have no optional prop with a default), so the component-pattern check still finds them.
- **Dark mode:** every new View uses `tokenClasses`. The composed Views (JAvatar, JTreeNav, JPageHeader) are not on the allowlist; JUserAvatar (allowlisted) is not used; nothing added or migrated.

### Deviations (spec/design text aligned)

- design (Interfaces): the JAppShell note (no JSidebarLayout composition, drawer, rail, toggle name, topbar shrink), the JUserMenu note (radio `value`, header outside the menu, keys, empty DEFAULTS) and the JContextChip note.
- tasks.md a9a: the split note and the commit list; the a10 backdrop note records the orchestrator's approval.

### Pre-existing test assertions changed

None. `componentPattern.test.ts` and `packageExports.test.ts` gained the JAppShell, JUserMenu and JContextChip entries.

### Deferred items

- **a10:** land the approved dark `BACKDROP` (`cf5d980a`) and regenerate the S-FBK-11 snapshot; the JAppShell drawer backdrop barely dims in dark until then (`a9ai-375.png`).
- **a10 CHANGELOG 1.6.0:** Added JAppShell (`JAPPSHELL_DEFAULTS`), JUserMenu (`JUserMenuItem`, `JUserMenuAction`, `JUserMenuRadio`), JContextChip (`JContextChipItem`).
- The axe icon-ligature check prints a jsdom `HTMLCanvasElement.getContext` "not implemented" message to stderr in the JUserMenu axe case (the avatar initials); the test passes.

## Slice a9b: workspace tabs, shortcut sheet (DONE)

Base: the a9a tip `feat/softcommerce-a9a-app-shell` @ `2c756d3e`. Baseline there: test 64 files / 615 tests. Version stays 1.5.2.

### Branches (split at a task boundary; a9b had no named fallback)

| Branch | Base | Tasks | Lines (numstat) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a9b-workspace-tabs-i` @ `a3ec804f` | a9a @ `2c756d3e` | a9b.1 (+ exports, stories) | 783 | test 65 files / 634 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a9b-workspace-tabs-ii` @ `71813596` | a9b-i | a9b.2, a9b.3 (focusFilter), a separator fix | 357 | test 66 files / 645 tests pass; lint, build, build-storybook pass |
| `feat/softcommerce-a9b-workspace-tabs` @ `71813596` | alias of the a9b-ii tip | - | - | same as a9b-ii |

JWorkspaceTabs alone measured 783 lines, so `git branch -m` renamed the branch to `-i` after commit 1 and `-ii` was started with `git switch -c`. The planned name was created with `git switch -c` at the a9b-ii tip.

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `a3ec804f` | feat(uijona): add JWorkspaceTabs | a9b.1 (+ exports, `Default`, `Overflow`, `OverflowOpen` stories) |
| `eacfae45` | feat(uijona): add JShortcutSheet | a9b.2 (+ exports, `Default`, `Open` stories) |
| `1ffcb6e6` | feat(uijona): add a JTreeNav focusFilter handle | a9b.3 (orchestrator decision 2; + story doc sentence) |
| `71813596` | fix(uijona): paint the JShortcutSheet row separators with the line token | found by the a9b visual check (+1 test) |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| a9b.1 | `src/organisms/__tests__/JWorkspaceTabs.test.tsx` (new) | RTL + axe | 64/615 | module not found (+ 3 list failures in componentPattern/packageExports) | 16/16 after one test-side fix (a hidden panel has no computed name in Testing Library, so it is found through its tab's `aria-controls`) and two class fixes caught by `classCoverage` (`col-span-[…]` is not a Tailwind 3 utility: `col-[1/span_var(…)]`; logical corners are `rounded-ss/se`) | click vs keys; ← → Home End with bounds; middle vs right auxclick; dirty vs clean; default vs custom labels; overflow with the active tab inside vs overflowed; no overflow; Esc over a JDialog; outside press; focusPanel; axe closed and open. MUTATION: dropping the `button !== 1` guard failed the right-button case; restored | none |
| a9b.2 | `src/molecules/__tests__/JShortcutSheet.test.tsx` (new) | RTL + axe | - | module not found (+ 4 list failures) | 5/5 | Esc vs Cerrar; default vs custom title; open vs closed. MUTATION: `span` instead of `kbd` failed S-CHR-24; restored | none |
| a9b.3 | `src/molecules/__tests__/JTreeNav.test.tsx` (+2 cases, +3 import lines) | RTL | 23/23 | 1 failed (no handle: focus stayed on body); the no-filter case passes by design | 25/25 | filter box vs none. MUTATION: dropping `select()` failed the selection assertion (`[3,3]` vs `[0,3]`); restored | none |
| separator fix | same JShortcutSheet file (+1 test) | compiled-CSS utility resolver | 5/5 | 1 failed (rows had no border color: `divide-y` fell back to the preflight gray) | 6/6 | first vs last row | none |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| a9b-i | `npx vitest run src/organisms src/__tests__` -> 288 passed | headless Edge on storybook-static over `file://`, light vs dark at 375/1024/1920: `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/a9bi-{375,1024,1920}.png` (each close button beside its tab, the dirty dots, `+3` overflow and the open `Más pestañas` menu with a dirty entry; the strip scrolls at 375 with the overflow button pinned) | `src/organisms/JWorkspaceTabs/*`, its test, 1 export line, 1 export-map entry, 2 list entries |
| a9b-ii | `npx vitest run src/molecules/__tests__/JShortcutSheet.test.tsx src/molecules/__tests__/JTreeNav.test.tsx src/__tests__` -> all pass | same folder, `sheets/a9bii-{375,1024,1920}.png` and `sheets/a9bii-sheet-light-full.png` (the sheet in two columns from `sm`, one at 375, kbd keys, the Cerrar footer; JTreeNav `WithFilter` unchanged) | `src/molecules/JShortcutSheet/*` and its test; the JTreeNav Inter/Impl/View/entry/story additions and the 2 cases |

### Decisions

- **Close buttons outside the tablist (S-CHR-14) without `display: contents`:** one grid row where the tablist is a `grid-cols-subgrid` spanning `2n` columns (`col-[1/span_var(--jona-wtabs-span)]`), tab i sits in column 2i+1 and its close button, a sibling of the tablist, in 2i+2 (`col-start-[var(--jona-wtab-col)]`). The tablist keeps its box, so its role stays in the accessibility tree.
- **Tab order:** the tablist is one tab stop (the active tab); only the active tab's close button is focusable by Tab (inactive ones are `tabIndex=-1`, still clickable). ← → Home End select on focus and do not wrap.
- **Middle click:** `auxclick` with `button === 1` requests the close; `mousedown` with button 1 is prevented so the browser does not start autoscroll.
- **Overflow:** the first `maxVisible` tabs show; an overflowed active tab takes the last slot. The `Más pestañas` button shows an aria-hidden `+N` and a chevron; its menu (useMenuPopup, roving ↑↓ Home End, Enter/Space) lists the rest in tab order with the dirty description. Picking one focuses the button, then the new tab once the host makes it active.
- **Panels:** all mounted, `hidden` when inactive, `tabIndex=-1` for `focusPanel`, `aria-labelledby` the tab, or `aria-label=title` while their tab is overflowed (no dangling idref).
- **JShortcutSheet** composes JDialog (`size="lg"`, no header close button, whose label is the English `Close dialog`) with a `Cerrar` footer button (fixed label, D17; the locked API has no label prop). Each group: an `h3` and a list named by it.
- **JTreeNav focusFilter:** `JTreeNav` became a `forwardRef<JTreeNavHandle>`; `focusFilter()` focuses and selects the filter box, a no-op without `showFilter`. Additive (no ref, no change).
- **Dark mode:** every new View paints through `tokenClasses`; nothing was added to the allowlist.

### Deviations (spec/design text aligned)

- design (Interfaces): the JWorkspaceTabs note (subgrid row, tab stops, middle click, overflow slot, panel naming, DEFAULTS), the JShortcutSheet note (JDialog, `Cerrar`, groups) and `JTreeNavHandle { focusFilter() }`.
- spec `jona-ui-app-chrome` R-CHR-3 (focusFilter), R-CHR-5 (close buttons outside the tablist, only the active one in the tab order; the overflowed active tab takes the last slot), R-CHR-8 (backdrop and the `Cerrar` button close).
- tasks.md a9b: the split note, a9b.3, the commit list.

### Pre-existing test assertions changed

None. `componentPattern.test.ts` and `packageExports.test.ts` gained the JWorkspaceTabs and JShortcutSheet entries; `JTreeNav.test.tsx` gained 3 import lines and 2 cases, its 23 cases byte-identical.

### Deferred items

- **a9b-ii tip flake (fixed forward in a10):** the separator test compiles the stylesheet inside a 5 s default timeout; under a loaded full run it timed out once at a10 (rerun: 67 files / 666 tests pass). a10 gives it 60 s (`71d3dafa`).
- **b5:** JWorkspaceTabs has no `onCloseOthers` (not in the locked API); the app can add it on its own menu if needed.
- **a10 CHANGELOG 1.6.0:** Added JWorkspaceTabs (`JWorkspaceTabsHandle`, `JWORKSPACETABS_DEFAULTS`), JShortcutSheet (`JShortcutGroup`, `JShortcutItem`, `JSHORTCUTSHEET_DEFAULTS`), `JTreeNavHandle.focusFilter()` (done in a10).

## Slice a10: auth layout and release 1.6.0 preparation (DONE except the version bump)

Base: the a9b tip `feat/softcommerce-a9b-workspace-tabs` @ `71813596`. Version stays **1.5.2**: the owner has not confirmed 1.6.0 (orchestrator decision 4). No publish, tag or push.

### Branch

| Branch | Base | Tasks | Lines (numstat; 2 regenerated snapshots and the golden JSON excluded, 39 lines) | Gate at tip |
|---|---|---|---|---|
| `feat/softcommerce-a10-auth-release` @ `71d3dafa` | a9b @ `71813596` | a10.1-a10.5 (a10.6 open) | 600 | test 67 files / 666 tests pass; lint, build, build-storybook pass; `npm pack --dry-run` pass. First full run: 2 failures in `JShortcutSheet.test.tsx` (a stylesheet-compile timeout and the axe case after it); rerun with no change: 67/666 pass; hardened in `71d3dafa`, then the final gate above |

### Commits

| Hash | Subject | Tasks |
|---|---|---|
| `fb20145d` | fix(uijona): keep the modal backdrop visible over a dark page | decision 1 (`cf5d980a` cherry-picked with `-n`, the S-FBK-11 snapshot regenerated in the same commit) |
| `44bec1dc` | feat(uijona): add JAuthLayout | a10.1 (+ exports, `Login`, `SecondStep` stories) |
| `df93b984` | feat(uijona): migrate JAccordion to semantic tokens | decision 3, dark gate |
| `deea2197` | fix(uijona): lay out the JTable header label as a row | decision 3 (+ golden `added` regenerated) |
| `710fd0a3` | fix(uijona): keep the JPagination chevrons beside the Previous and Next labels | decision 3 (+ the S-DAT-22 snapshot regenerated) |
| `fe69dfd3` | test(uijona): sweep exports and component pattern for 1.6.0 | a10.2, a10.3 |
| `9993089e` | docs(uijona): prepare the 1.6.0 changelog and readme | a10.5 |
| `71d3dafa` | test(uijona): give the JShortcutSheet separator test the stylesheet compile timeout | gate hardening |

### TDD cycle evidence

| Task | Test file | Layer | Safety net | RED | GREEN | Triangulate | Refactor |
|---|---|---|---|---|---|---|---|
| backdrop | `src/__tests__/quality/contrast.test.ts` (from `cf5d980a`) | Unit (token resolver) | 66/645 | recorded at a6 (1.11:1). Applied here, the full suite failed only the S-FBK-11 snapshot (1/650), as named. MUTATION: dark backdrop back to neutral-900 at 0.5 failed the dark and system-dark cases (1.11 < 1.3); restored | 650/650 after `-u` on the one snapshot (the word diff is only `bg-[rgb(var(--jona-neutral-900)/0.5)]` -> `bg-[rgb(var(--jona-backdrop)/var(--jona-backdrop-alpha))]`) | light / dark / system dark | none |
| a10.1 | `src/layouts/__tests__/JAuthLayout.test.tsx` (new) | RTL + compiled-CSS utility resolver + axe | - | module not found (+ 4 list failures) | 7/7 | step 2 vs step 1 vs no steps; brand panel at 375/1023/1024; card gutter; form submit untouched; logo; footer. MUTATION: dropping `hidden` on the brand panel failed S-CHR-26; restored | none |
| dark gate | `src/__tests__/quality/tokenLint.test.ts` | Unit | 4/4 | dropping the JAccordion entry from the allowlist: 1 failed with its 9 raw tokens | 4/4 after the migration; JAccordion 1.5.1 tests unchanged and green | - | none |
| JTable header | `src/__tests__/css/cascade.test.ts` (+2 tests, +1 import line) | RTL + cascade resolver | 20/20 | 1 failed: `flex-direction` resolved to `var(--jpanel-desktop-direction, column)` | 22/22; JTable 16/16 | plain and sortable vs filterable (still a column) | none |
| JPagination | same file (+2 tests, +1 import line) | RTL + cascade resolver | 22/22 | 2 failed (the chevron's parent had no display rule) | 24/24 after regenerating S-DAT-22 (adds only the two `inline-flex items-center gap-1` wrappers) | Previous vs Next | none |
| a10.2 | `packageExports.test.ts` (+1 test, +1 import line), `componentPattern.test.ts` (+1 test) | Unit | 57/57 | no gap, so MUTATION: renaming one root export failed S-FND-19 (named `molecules/JRating`); dropping JAuthLayout from the list failed S-FND-22; both restored | 58/58 | - | none |
| a10.3 | the 33 test files of `ad092390` (1.5.1) | CHECK | - | n/a | a `git archive` export of the a10 sources with those files overlaid (node_modules junction): 33 files / 281 tests pass, none changed | - | - |
| a10.5 | - | CHECK (docs) | - | n/a | gate + pack | - | - |

### Work unit evidence

| Unit | Focused test | Runtime harness | Rollback boundary |
|---|---|---|---|
| backdrop | `npx vitest run src/__tests__/quality/contrast.test.ts src/molecules/__tests__/JOptionPane.test.tsx` -> pass | `sheets/a10-fix-{375,1024,1920}.png`: the confirm over a JDialog dims the dialog in dark; the JAppShell drawer backdrop dims the page at 375 in dark | `tokens.css` backdrop tokens, `BACKDROP`, the contrast block, one snapshot line |
| a10.1 | `npx vitest run src/layouts/__tests__/JAuthLayout.test.tsx src/__tests__` -> all pass | `C:/Users/Usuario/AppData/Local/Temp/claude/D--Kiro-Projects-patron-frontend-jona/726e75ba-211a-45d1-b83d-a0cbcf2dae12/scratchpad/prs-ux/sheets/a10-auth-{375,1024,1920}.png` (brand panel from 1024, card alone at 375, steps, the login form, dark) | `src/layouts/JAuthLayout/*`, its test, 1 export line, 1 map entry, 2 list entries |
| fixes | `npx vitest run src/__tests__ src/molecules` -> all pass | `sheets/a10-fix-*.png` (JAccordion light/dark; JPagination `‹ Previous` / `Next ›` on one row from `sm`; JTable headers) | the JAccordion View, one JTable class token, the JPagination wrappers, their tests, snapshot and golden |
| a10.5 | `npm pack --dry-run` | see the pack summary | `CHANGELOG.md`, `README.md` |

### `npm pack --dry-run` (a10 tip, version 1.5.2)

`jona-ui@1.5.2`, 2509 files, 741.0 kB packed, 3.5 MB unpacked. Outside `dist/`: only `README.md` and `package.json`. CSS: `dist/base.css`, `dist/index.css`, `dist/theme/tokens.css`. Every `exports` target exists in the tarball (0 missing), including the new subpaths (`organisms/JWorkspaceTabs`, `molecules/JShortcutSheet`, `layouts/JAuthLayout` and the earlier 1.6.0 ones, `.js`/`.cjs`/`.d.ts`). No test, story or `__tests__` path. 1.5.2 had 2116 files.

### Final dark allowlist (decision 3)

42 entries, none used by softcommerce today or adopted by a b-slice per design. Check: every `jona-ui` import in `web_ts/softcommerce/src` (JAccordion, JAlert, JButton, JCheckBox, JComboBox, JDatePicker, JDialog, JFormField, JLabel, JOptionPane, JPagination, JRadioButton, JSelectField, JSidebarLayout, JTable*, JTabs*, JTextArea, JTextBox) plus the b-slice pieces (JAppShell, JTreeNav, JWorkspaceTabs, JUserMenu, JContextChip, JShortcutSheet, JAuthLayout, JStepper, JPageHeader, JToolbar, JDataGrid, JField, JFieldGrid, JFormSection, JErrorSummary, JInputGroup, JDrawer, useConfirm, useToast/JToast, JEmptyState, JBadge), walked through their relative imports (`scratchpad/prs-ux/darkreach.cjs`, 229 files): the only allowlisted file reached was `molecules/JAccordion/JAccordionView.tsx`, now migrated. Remaining: JBorderLayout (Inter + View), JCard, JCombobox, JContactMethodCard, JDataTable, JFaqItem, JFileUpload, JLanguageSwitcher, JMetricCard, JMultiSelect, JNumberedStep, JNumberInput, JPopover, JProgressItem, JRadioGroup, JRating, JRelatedItem, JSectionHeading, JServiceCard, JSkeletonPresets, JStatCard, JSwitchField, JTimer, JTooltip, JUserAvatar, and the organisms JCaseStudies, JContactMethods, JContactSteps, JDashboardPreview, JDetailCTA, JDetailHero, JErrorPage, JFooterPage, JHeaderPage, JHeroDynamic, JLogoMarquee, JMarketingCTA, JMarketingHero, JMetricsBand, JNavbar, JSiteFooter.

### Decisions

- **JAuthLayout `currentStep` is a step id** (the locked API names no type; the steps carry ids). JStepper gets its index; no match shows the first step. The brand panel is a plain `div` (`primary-700`, `ON_PRIMARY`), hidden below `lg`; the card always shows the product name. `JAUTHLAYOUT_DEFAULTS` is empty.
- **JAccordion** maps to `DIVIDE`, `LINE`, `SURFACE`, `FG`, `FG_MUTED`, `HOVER_SURFACE_MUTED` (the a2b mapping). Light delta: content text neutral-600 -> fg-muted (neutral-500), chevron neutral-400 -> 500.
- **JTable header:** `flex-row` on the label panel (the a1.5 option A rule); the a1.5 audit missed it because the `filterable` branch's `flex-col` counted as a stated direction. Golden `added` gains `JTableView.tsx:461`; the `kept` list already had `flex-row`.
- **JPagination:** an `inline-flex items-center gap-1` span around each chevron and label (the svg is `display:block` by preflight). A global `.jbutton-text > svg` rule was rejected: it would change every JButton with an svg child and the component rules are byte-frozen (D1).
- **Golden line numbers** regenerated by mapping each 1.5.2 JPanel element to the same element in the current file (`scratchpad/prs-ux/regolden.cjs`); the two JTable toolbar entries were one line off already in 1.5.2 and were mapped by hand (142, 144). 15 of 39 entries moved.
- **CHANGELOG** heading `## 1.6.0` without a date, like 1.5.2. **README** (Spanish, no accents, as the file): `base.css`, the theme mode with a Vite `transformIndexHtml` example for `themeInitScript()`, the `top-right` toast recommendation, the `auto` density note and the catalog rows.

### Deviations (spec/design text aligned)

- spec `jona-ui-app-chrome` R-CHR-9: `currentStep` is a step id.
- spec `jona-ui-data` R-DAT-7 and S-DAT-22: the 1.5.1 output except the chevron wrapper (named fix).
- spec `jona-ui-feedback` S-FBK-11: the snapshot is regenerated once in a10 for the backdrop token.
- spec `jona-ui-foundations` R-FND-8: the named 1.6.0 fixes gain the JPagination chevron, the JTable header label and the dark backdrop.
- design: D5 backdrop tokens; the JPagination and JDataGrid (JTableHead) notes; the JAuthLayout note.
- tasks.md a10: a10.4 (orchestrator items), a10.5 (checklist without the bump), a10.6 open (the bump); the release checklist items done.

### Pre-existing test assertions changed

| File | Assertion | Allowed by |
|---|---|---|
| `src/molecules/__tests__/__snapshots__/JOptionPane.test.tsx.snap` | S-FBK-11 approval: the `BACKDROP` class string only | orchestrator decision 1 (named churn; S-FBK-11 aligned) |
| `src/molecules/__tests__/__snapshots__/JPagination.test.tsx.snap` | S-DAT-22 approval: two wrapper spans only | orchestrator decision 3 (the fix needs it; R-DAT-7/S-DAT-22 aligned) |
| `src/__tests__/css/jpanelOverrides.golden.json` | `added`: line numbers regenerated, the JTable header site added | S-FND-24 (reviewed snapshot); decision 4 (regenerated line numbers) |

The other test files only gained cases and import lines. The 1.5.1 suite (33 files at `ad092390`) runs unchanged and green (S-FND-20).

### Deferred items

- **a10.6 DONE (2026-10-30, owner confirmed 1.6.0):** `41e028fd` fix(uijona): JStepper current step number on `FG` (RED: `contrast.test.ts` dark and system dark 2.66:1 < 4.5 with `text-primary-700`; GREEN 11/11; the mutation back to primary-700 fails the same 2). `a5feb5ca` chore(uijona): release 1.6.0 (`npm version`, package and lock; CHANGELOG notes that 1.5.2 was not published to npm and ships in 1.6.0). Gate at `a5feb5ca`: test 67 files / 669 tests pass; lint, build, build-storybook pass; `npm pack --dry-run` `jona-ui@1.6.0`, 2509 files, 741.1 kB.
- Still light in dark: the non-neutral default-palette tints (JAlert info/success/warning, `bg-primary-50` tiles), as noted since a2b.
- **Gate 2 DONE (2026-10-31):** pre-check at the chain tip `a5feb5ca` (`npm ci`, lint, 67 files / 669 tests, build, `npm pack --dry-run` 2509 files, 740.7 kB); #113–#132 merged in order into the tracker (each retargeted to `feat/softcommerce-product-ux`, merge commits); #133 tracker -> `main` (`490ce807`; GitGuardian and Socket green); GitHub Release `v1.6.0` on `main`; `publish-npm.yml` run 41246244698 (event `release`) published `jona-ui@1.6.0` as `latest` at 2026-10-31T22:04:32Z. 1.5.2 was never published: npm goes 1.5.1 -> 1.6.0. b1 can start.
