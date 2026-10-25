# Proposal: SoftCommerce Product UX (jona-ui 1.6 + app adoption)

## Intent

W1 to W3 ported the behaviour, but the app still looks like a prototype. It has no app frame, success is either silent or shown in a blocking modal, the selected row is invisible, grids cannot be used from the keyboard, and lib CSS gaps turn app classes into no-ops (exploration §0). The owner wants it to "feel like a finished product" from login to the last W3 screen, built on design-system pieces that get published.

## Scope

### In Scope
- **Slice 0 (PR #107, absorbed)**: fixes the contexto bounce, adds RedirectIfSession, dd/MM/yyyy period fields, and the `src/styles/app.css` stopgap with `appStyles.spec.ts`. The stopgap is deleted once the lib ships the CSS fix.
- **jona-ui**:
  - CSS distribution fix: `:where()` JPanel selectors, `sideEffects`, a class-coverage test.
  - Semantic light/dark tokens, theme mode, type scale, density.
  - The §4.2 ADD/EXTEND list: JField, JFieldGrid, JFormSection, JErrorSummary, JInputGroup, JDataGrid, JToolbar, JPageHeader, JTreeNav, JWorkspaceTabs, JAppShell, JUserMenu, JContextChip, JShortcutSheet, JAuthLayout, useConfirm. JButton/JDatePicker/JTabs/JPagination/JOptionPane get extensions.
  - Each piece follows the JONA Inter/Impl/View/entry pattern and ships with tests and stories.
- **softcommerce** adoption across 11 areas: auth, shell/topbar ("SoftCommerce", context chip, user menu with theme toggle), menu, workspace tabs + dirty guards, lists, registers, master-detail, lookups, Seguridad Perfil, Socio Acciones, Autorizar Series.
- **Owner decisions**:
  - success feedback uses toasts; modals stay only for destructive confirms and desktop-mandated notices;
  - the period is prefilled from 01/01 of the current year to today;
  - full dark mode;
  - jona-ui palette.

### Out of Scope
- Wave 4 ventas and any new business feature.
- Backend changes.
- `desktop_java/softcommerce-desktop` and `web_ts/devol`.
- A custom brand palette or logo.
- Changing any desktop-mandated Spanish text.

## Capabilities

### New Capabilities
- `jona-ui-foundations`: tokens (light/dark), theme mode, type scale, density, the CSS distribution contract, and the versioning/export map.
- `jona-ui-feedback`: useConfirm/ConfirmProvider, toast conventions, JOptionPane details.
- `jona-ui-forms`: JField, JFieldGrid, JFormSection, JErrorSummary, JInputGroup, JDatePicker label/error/ref.
- `jona-ui-data`: JDataGrid (selection, roving keys), JTableRow selected, JToolbar, JPagination rows info.
- `jona-ui-app-chrome`: JAppShell, JTreeNav, JWorkspaceTabs, JPageHeader, JUserMenu, JContextChip, JShortcutSheet, JAuthLayout.
- `softcommerce-ux-conventions`: feedback taxonomy, focus management, keyboard map, theme toggle, and the "no class outside shipped CSS" contract.

### Modified Capabilities
- `softcommerce-auth-session`:
  - R-AUTH-5: labelled Desde/Hasta in dd/MM/yyyy, with the default period.
  - R-AUTH-7: a session on `/login` or `/contexto` redirects to `/`; "Cambiar usuario" returns to step 1.
- `softcommerce-shell-workspace`:
  - R-SHELL-2: badge plus toast, menu filter, Recientes, ARIA tree.
  - R-SHELL-4: dirty guard.
  - R-SHELL-5: topbar and user menu.
  - R-SHELL-6: keyboard map.
- `softcommerce-crud-templates`:
  - R-CRUD-1: visible title/count/selection, non-blanking refresh, Enter/double-click falls back to UPDATE.
  - R-CRUD-2: Buscar is no longer dead.
  - R-CRUD-5: success toast and focus restore.
  - R-CRUD-8: grid keys.
  - R-CRUD-9 / S-CRUD-21: pin `1.6.0`, smaller local component list.
  - R-CRUD-19: lookup layout and F2.
- `softcommerce-master-detail`: tab error indicators, child register in a drawer, inline row errors, danger confirms.
- `softcommerce-lookup-dialog`: keyboard row navigation and footer order.
- `softcommerce-row-actions`: destructive `immediate` actions confirm first [DEVIATION].
- `softcommerce-user-permissions`:
  - R-PRM-2/3: `Permisos actualizados correctamente` shows as a toast (same text).
  - R-PRM-6: Autorizar Series moves to a drawer and Desactivar gets a confirm.
- `softcommerce-masters`: R-MST-16 framing of Socio Acciones, success messages as toasts, and a disabled socio `Desactivar` that shows its reason.

## Approach

- Exploration Option A: the app writes no utility classes, and layout comes from lib layouts and props.
- Accessible names and roles stay stable, so restyling does not rename anything.
- Strict TDD.
- Rollout: one tracker `feat/softcommerce-product-ux` with chained PRs of at most 800 lines each. There are three merge-to-main gates:

| Order | Slices | Gate |
|---|---|---|
| 0 | PR #107 | merge |
| 1 | a1 CSS fix, a3 selection/a11y/density | Release `v1.5.2` → npm; then b1a bumps the app and deletes the stopgap rules the lib now covers |
| 2 | a2, a4–a10 | Release `v1.6.0` → npm |
| 3 | b1–b11 (exploration §5.2) | merge |

- Releases are GitHub Releases (`publish-npm.yml`), published from the commit on main only.

## Affected Areas

| Area | Impact |
|---|---|
| `web_ts/uijona/src/{theme,styles,atoms,molecules,organisms,layouts,pages,hooks}/**`, `package.json`, `CHANGELOG` | New/Modified |
| `web_ts/softcommerce/src/{views,shared/ui,session,styles}/**`, `App.tsx`, `main.tsx`, `package.json` | Modified |
| `openspec/specs/softcommerce-*` (8 deltas), `jona-ui-*` (5 new) | New/Modified |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Test churn (labels, roles, alerts) | High | Keep accessible names stable; deltas name each changed scenario (§5.3) |
| A published npm version cannot be reused | Med | Release only from main after lib CI and a Storybook check; fix forward with a patch |
| CSS cascade regressions (`:where`, dark tokens) | Med | Lib class-coverage and specificity tests; app CSS contract test; walkthrough at 375/1024/1920 |
| Lib API churn before 1.6.0 | Med | Lock APIs in design; app slices start only after the release |
| Dark mode misses hard-coded `bg-white` | Med | Token lint test over the lib source |

## Rollback Plan

Revert the app slices in reverse order. A revert of the bump restores `1.5.2`, or `1.5.1` together with the PR #107 stopgap. A bad lib version is deprecated on npm and replaced by a patch; nothing is unpublished.

## Dependencies

- W3 archived; PR #107 merged; `NPM_TOKEN` secret; publish authorized by the owner.

## Success Criteria (browser walkthrough plus CI)

- [ ] Login → contexto → shell works with no bounce at 375 and 1920 px; the period shows `01/01/YYYY`–today; `/login` with a session lands on `/`.
- [ ] The topbar shows "SoftCommerce", the context chip and a user menu (theme toggle, Cerrar sesión); the hamburger is hidden at 1024 px and above.
- [ ] The selected row is visibly highlighted; ↑↓/Enter select and open rows in lists, lookups and child grids.
- [ ] Every save, delete or action success is a toast; no success modal remains.
- [ ] Dark mode on every walkthrough screen: zero serious/critical axe issues, including contrast.
- [ ] The CSS contract test reports 0 missing classes; `app.css` is deleted.
- [ ] `jona-ui@1.6.0` is on npm and softcommerce pins it exactly; W1–W3 suites pass except the named deltas.

## Proposal question round (answered by the owner, 2026-10-24)

| Question | Owner decision |
|---|---|
| Socio Acciones: render it inline in its tab, or keep it as a modal with a proper header? | Inline in its tab (R-MST-16 delta) |
| Per-mode confirm copy ("Guardar", "Eliminar") or keep the desktop "¿Desea continuar…?" / Aceptar? | **Per-mode copy**: title per mode, record summary, confirm button "Guardar" / "Crear" / "Eliminar" (danger for delete). Accepts the bulk spec/test update (~74 Aceptar/Confirmar assertions); every changed scenario must be named in the deltas. |
| Dirty guards on tab close, logout and unload: in this change? | Yes |
| Theme default | Follows the OS `prefers-color-scheme`; the user's choice is persisted per browser |
| Unregistered leaves | "Próximamente" badge plus toast (S-SHELL-5 delta) |
