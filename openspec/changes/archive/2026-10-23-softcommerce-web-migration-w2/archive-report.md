# Archive Report: softcommerce-web-migration-w2 (Wave 2)

**Archive date**: 2026-10-23
**Mode**: hybrid (OpenSpec files + Engram)
**Worktree**: `D:/Kiro Projects/patron-frontend-jona-worktrees/w2-archive`, branch `feat/softcommerce-w2` (tracker). Code tree identical to the verified chain tip 75be689.
**Archive status**: specs merged. Folder move NOT performed by the archive executor (no shell available; see "Pending Operation"). Review gate: `disabled/unmanaged` (no review receipt).

## Final State at Close

| Item | Final state | Source |
|------|-------------|--------|
| Tasks | 97 `[x]`, 0 `[ ]` | `verify-report.md` (checked against `tasks.md`) |
| Verify verdict | PASS WITH WARNINGS: 0 critical, 1 warning, 3 suggestions | `verify-report` obs #631 |
| Gate at chain tip 75be689 | `npm test` 174 files / 4270 tests passed; typecheck clean; build OK (576 modules) | `verify-report.md` |
| Registry | 48 entries: 38 writable W2 catalogs (12 T1, 11 T2, 15 T3), Localidad (compat), 9 read-only lookups | `verify-report.md` |
| Scenario coverage | 103 scenarios: 102 covered, 1 partial (S-CRUD-39), 0 missing | `verify-report.md` |
| jona-ui pin | `1.5.1` exact (was 1.4.0), guarded by `test/pinned-deps.spec.ts` | `verify-report.md`, merged spec R-CRUD-9 / S-CRUD-21 |
| Delivery | Tracker PR #25 (`feat/softcommerce-w2`); 33 child PRs #26 to #58 merged in order into the tracker; code tree identical to the verified tip | Launch prompt |
| Review gate | Receipt-driven development disabled by the user; no review receipt exists, none fabricated | Launch prompt |

### Verify warning (unresolved, non-blocking)

- **W-1**: S-CRUD-39, S-REG-15 and S-REF-38 ("Wave 1 unchanged") have no dedicated guard. They rely on the Wave 1 suites passing plus a manual `git diff`.

Suggestions: S-1 requirement IDs covered only through scenarios/tables; S-2 S-CRUD-37/38/40 list-view tests could be consolidated; S-3 a single cross-consumer drift test over all 38 entries would make R-REG-3 more visible.

## Review Gate Record

- `reviewGate.delivery`: `disabled/unmanaged`
- `reviewGate.result`: not `allow`. No review governs this change.
- No approved terminal receipt is claimed. Archive proceeds under the `disabled/unmanaged` relaxation only.

## Task Completion Gate

All tasks are `[x]` (97 of 97) per the verify report; the launch prompt confirms all `[x]`. No stale-checkbox reconciliation was needed.

## Specs Synced

| Capability | Main spec path | Action | Requirements |
|------------|----------------|--------|--------------|
| softcommerce-crud-templates | `openspec/specs/softcommerce-crud-templates/spec.md` | Merged in place | Added R-CRUD-11..16; modified R-CRUD-1, 5, 6, 7, 9 (in place, IDs kept); scenarios S-CRUD-17 and S-CRUD-21 replaced in place; added S-CRUD-24..41 |
| softcommerce-mock-api | `openspec/specs/softcommerce-mock-api/spec.md` | Merged in place | Added R-MOCK-9..18; modified R-MOCK-1, 5, 7 (in place); added S-MOCK-15..38 |
| softcommerce-catalog-registry | `openspec/specs/softcommerce-catalog-registry/spec.md` | New capability created | R-REG-1..12, S-REG-1..19 |
| softcommerce-reference-catalogs | `openspec/specs/softcommerce-reference-catalogs/spec.md` | New capability created | R-REF-1..13, S-REF-1..39 |

No requirement was removed or renumbered. W1 requirement text that the delta did not modify (for example R-CRUD-10 and S-CRUD-1..16, 18..20, 22, 23) is untouched. The "Previously:" notes of the delta were not carried into the main specs.

## Pending Operation: Folder Move

The archive executor had no shell, so `git mv` could not run (a copy would leave a duplicate active change). Pending:

```
git -C "D:/Kiro Projects/patron-frontend-jona-worktrees/w2-archive" mv openspec/changes/softcommerce-web-migration-w2 openspec/changes/archive/2026-10-23-softcommerce-web-migration-w2
```

This archive-report.md was written inside the active folder so it moves with the rest. Afterwards confirm `openspec/changes/softcommerce-web-migration-w2/` no longer exists.

## Observation IDs (Traceability)

| Artifact | Engram ID | Topic key | Notes |
|----------|-----------|-----------|-------|
| explore | #613 | `sdd/softcommerce-web-migration-w2/explore` | |
| proposal | #615 | `sdd/softcommerce-web-migration-w2/proposal` | |
| spec | #617 | `sdd/softcommerce-web-migration-w2/spec` | Post-apply alignment note; filesystem is the source of truth |
| design | #616 | `sdd/softcommerce-web-migration-w2/design` | Post-apply alignment note |
| tasks | #618 | `sdd/softcommerce-web-migration-w2/tasks` | |
| apply-progress | #620 | `sdd/softcommerce-web-migration-w2/apply-progress` | |
| verify-report | #631 | `sdd/softcommerce-web-migration-w2/verify-report` | Snapshot at 75be689 |
| decisions | #614 | W2 spec/design reconciliation decisions | |
| review artifacts | none | `sdd/softcommerce-web-migration-w2/review/*` | Review disabled |

## Open Product Questions (from design.md, not blockers)

1. The W1 permission seed keeps `miTipoCambio` read-only (`add/modify/eliminate/clone: false`) because W1 `auth.spec` asserts it. W6 (real permissions) or an approved W1 test edit must widen it.
2. Inferred `codeWidth` values with no desktop evidence, to confirm in W6: almacenes, tipos-cambio, unidades-medida, vehiculos at 3, plus aduanas, colores, nacionalidades, clasif-inventarios, condiciones-pago, tipos-trabajador, marcas-vehiculo and modelos-vehiculo at 3; usuario-correlativos and trabajador-punto-venta at 5 (from the `focusLost` pad, no SQL).
3. Demo ids and rows are invented (SUNAT tablas and detalles, familias-sunat codes, monedas other than `00001` / `00004`, tipos-doc-venta demo rows, trabajadores). Only the 6th tabla id `6` and DNI `01` / RUC `05` / TI ids are load-bearing.
4. W6 contract points: select `where` sent as strings, `lookups/ubigeo?parent=&has=zonas`, the `estado: 'A'` where of the correlativo serie select, the `X-User-Id` / `X-Empresa-Id` headers, 400 `INVALID_FILTER`, the stamp-only empresa model, and the `shared` scope of familias-sunat.
5. Menu titles and formIds that are proposals (`miTipoAnexo`, "Motivo de Nota de Credito", "Tipo Trabajador Perfil"); tamanos empresa scope and the stamp-only decisions for marcas-vehiculo, modelos-vehiculo, subfamilias and tipos-cambio.
6. W6 must confirm the `shared` scope of Moneda, TipoDocIden, the SUNAT tables, tipos-doc-venta, familias-sunat and subfamilias-sunat.
7. [DEVIATION] punto-venta and trabajador-punto-venta lists are tenant-wide although the desktop lists the session empresa (no list-only empresa scope in the core).

## Risks and Notes

- Review gate was disabled by the user. No review evidence exists for this change.
- Delivery facts (PR numbers #25 to #58, merge order, tree identity) are orchestrator-provided; the executor did not run git.
- Engram spec/design observations (#616, #617) are alignment notes, not full copies; the files on disk are authoritative.
- Nothing was committed or pushed by this run.
