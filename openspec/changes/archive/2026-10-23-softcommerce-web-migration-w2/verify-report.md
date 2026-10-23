# Verify report: softcommerce-web-migration-w2

**Verdict:** PASS WITH WARNINGS. There are 0 critical gaps, 1 warning and 3 suggestions.

**Code:** `web_ts/softcommerce` at chain tip `feat/softcommerce-w2-12-iii-completeness` (75be689). The worktree was clean.

## Execution

All commands ran from `web_ts/softcommerce`.

| Check | Result |
|---|---|
| `npm test` | 174 of 174 files passed; 4270 of 4270 tests passed; 0 skipped |
| `npm run typecheck` | Clean |
| `npm run build` | OK, 576 modules |
| tasks.md | 97 `[x]`, 0 `[ ]` |

## Structural checks

- **Registry:** 48 entries:
  - 38 writable Wave 2 catalogs (12 T1, 11 T2, 15 T3);
  - Localidad (compat);
  - 9 read-only lookups.

  `test/catalogs/completeness.spec.ts` asserts the 38.
- **Menu and permissions:** each of the 38 has a menu node and the 13 permission flags (`completeness.spec`, `menuPermissions.spec`).
- **Wave 1 test edits:** only the two documented exceptions.
  1. The `miTipoCambio` → `miFormularioInexistente` rename in `src/views/uishell/formRegistry.spec.ts`.
  2. The menu-seed comparisons in `mock-server/core/auth.spec.ts`, `src/domain/menuTree.spec.ts`, `src/services/mock/AppServicesMock.spec.ts` and the shared helper `src/services/shellServiceContract.ts`.
- **Attribution:** `git log main..HEAD` has 55 commits. None contains AI attribution.
- **Pinned dependency:** `jona-ui` is pinned to 1.5.1, covered by `test/pinned-deps.spec.ts`.

## Coverage

| Spec | Scenarios | Covered | Partial | Missing |
|---|---|---|---|---|
| softcommerce-catalog-registry | 19 | 19 | 0 | 0 |
| softcommerce-crud-templates | 21 | 20 | 1 (S-CRUD-39) | 0 |
| softcommerce-mock-api | 24 | 24 | 0 | 0 |
| softcommerce-reference-catalogs | 39 | 39 | 0 | 0 |

**Spec vs code:** no contradictions after the post-apply alignment. Spot-checked:

- empresa modes;
- the chofer and socio modes;
- the scope and stamp of punto-venta, usuario-correlativos and tipos-cambio;
- the zonas-distancia cascade;
- the unidades-medida default;
- the lookup scopes.

## Gaps

| Severity | ID | Gap |
|---|---|---|
| WARNING | W-1 | S-CRUD-39, S-REG-15 and S-REF-38 ("Wave 1 unchanged") have no dedicated guard. They rely on the Wave 1 suites passing plus a manual `git diff`. |
| SUGGESTION | S-1 | Several requirement IDs are covered only through their scenarios and tables, not cited by ID. |
| SUGGESTION | S-2 | The S-CRUD-37/38/40 list-view tests could be consolidated. |
| SUGGESTION | S-3 | A single cross-consumer drift test over all 38 entries would make R-REG-3 more visible. |

## Open product questions (see design.md)

- The Wave 1 permission seed keeps Tipos de Cambio read-only.
- Several `codeWidth` values are inferred.
- Demo ids are invented.
- Contract points remain for W6.
- The punto-venta and trabajador-punto-venta lists are tenant-wide ([DEVIATION]).
