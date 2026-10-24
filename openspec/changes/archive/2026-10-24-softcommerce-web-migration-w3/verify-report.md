# Verify report: softcommerce-web-migration-w3

**Verdict: PASS WITH WARNINGS.** The run found 0 critical findings, 3 warnings and 9 suggestions. Engram mirror: `sdd/softcommerce-web-migration-w3/verify-report`.

**Code:** `web_ts/softcommerce` at chain tip `feat/softcommerce-w3-20-iv-closeout` (8be5518), 70 commits over `main` (7c99e11). The warnings were then fixed on top, in slice W3-21 (see Follow-up).

## Execution

| Check | Result |
|---|---|
| `npm test` | 329 of 329 files passed; 6311 tests passed, 2 skipped. A second run gave the same result, with no flaky test. |
| Real-tree inventory tests | With `SOFTCOMMERCE_DESKTOP_ROOT` set, 9 of 9 passed. Without it they are the 2 skipped above, because the worktree's `desktop_java` submodule is empty. |
| `npm run typecheck` | Clean (exit 0). |
| `npm run build` | OK (exit 0). Vite warns that the index chunk is 500.92 kB, just over its 500 kB advisory limit. |
| tasks.md | 121 tasks checked, 0 unchecked. |

The two skipped tests regenerate the inventory CSV from the desktop tree. They cover the regeneration half of S-INV-19 and S-INV-20/21.

## Structural checks

- **Attribution.** None of the 70 commits carries AI attribution, and all of them are Conventional Commits.
- **W1/W2 test edits.** Exactly 13 W1/W2 test files were modified, and they are the 13 that R-MST-18 lists. `wave3.completeness.spec.ts` pins that same list.
- **No password leak.** The no-leak specs pass:
  - `usuarios.noleak.spec.ts`;
  - the `wave3.completeness` sweep over every registry slug;
  - `UiLogin.clave.spec.tsx`.
- **Menu and grants.** The 8 masters and the 2 custom screens each have a menu node, 13 permission flags and a form registry entry.

## Coverage

| Spec | Requirements | Scenarios | Covered |
|---|---|---|---|
| softcommerce-anexo | 10 | 16 | 16 |
| softcommerce-auth-session | 5 | 10 | 10 |
| softcommerce-catalog-registry | 9 | 11 | 11 |
| softcommerce-crud-templates | 4 | 9 | 9 |
| softcommerce-gui-inventory | 5 | 9 | 9 |
| softcommerce-lookup-dialog | 8 | 16 | 16 |
| softcommerce-master-detail | 10 | 14 | 14 |
| softcommerce-masters | 18 | 37 | 37 |
| softcommerce-mock-api | 12 | 22 | 22 |
| softcommerce-reference-catalogs | 3 | 5 | 5 |
| softcommerce-row-actions | 6 | 9 | 9 |
| softcommerce-user-permissions | 8 | 16 | 16 |
| **Total** | **98** | **174** | **174** |

No scenario is partial or missing. S-REG-28 has no literal ID tag in any test; it is covered by the tests of the scenarios it is made of.

## Findings

### Warnings

| ID | Finding | Status |
|---|---|---|
| W1 | Item formId: the code used `miItem`, but R-MST-1 and the desktop menu (`MenuBarSystemDinamico.java:175`) use `miProducto`. | Fixed in W3-21 (renamed to `miProducto`). |
| W2 | Trabajador modes: the code allowed CLONE, but `PanelTFTrabajador.controlClone()` is empty and R-MST-1 lists INSERT, UPDATE and DETAIL only. | Fixed in W3-21 (CLONE removed). |
| W3 | The 2 real-tree inventory tests skip silently when the desktop submodule is empty. | Run them with `SOFTCOMMERCE_DESKTOP_ROOT` set in the merge gate. |

### Suggestions

| ID | Suggestion | Status |
|---|---|---|
| S1 | No test asserts the `id_usuario` stamp on a child created through a nested write. | Assertion added in W3-21. |
| S2 | The spec example says `ADUANAS`, but the seed and the test use `Aduana`. | Open: align the spec wording. |
| S3 | In apply-progress, the W3-1 heading still says PARTIAL and the W3-5b section is duplicated. | Fixed in W3-21. |
| S4 | A process slip in W3-20: one `git checkout -- <file>`, which the standing rules forbid. Its effect was benign. | Recorded only. |
| S5 | The `wave3.completeness` requirement-to-file mapping only checks that a file names the ID, so it is a guard, not proof of behaviour. Its git check hard-codes base `7c99e11` and skips silently in a clone without it, such as a shallow one. | Accepted as is. |
| S6 | Add the S-REG-28 ID to `lookups.people.spec.ts`. | Open. |
| S7 | A header comment in `completeness.spec.ts` still says "nine", while the test title and assertion say eleven. | Open. This is a W2 test file. |
| S8 | The worktree holds an older committed copy of the openspec change folder. | Refresh it from the main-checkout copy before archiving. |
| S9 | `test/parity.spec.ts` shows as modified because of line-ending noise; its content diff is empty. Do not stage it. If the transient load failures come back, consider setting an explicit `testTimeout`. | Recorded only. |

## Follow-up

The W3-21 slice fixes W1, W2, S1 and S3 on top of the chain. Its gate results are recorded in its PR and in apply-progress.
