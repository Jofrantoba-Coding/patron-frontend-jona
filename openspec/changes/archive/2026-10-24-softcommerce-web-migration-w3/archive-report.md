# Archive Report: softcommerce-web-migration-w3 (Wave 3, Rich Masters)

**Archive date**: 2026-10-24
**Mode**: hybrid (OpenSpec files + Engram)
**Worktree**: `D:/Kiro Projects/patron-frontend-jona-worktrees/w3-archive`, branch `feat/softcommerce-w3` (tracker). Code tree identical to the verified tip (chain tip `feat/softcommerce-w3-20-iv-closeout` 8be5518 plus the W3-21 verify-fix slice).
**Archive status**: specs merged. Folder move NOT performed by the archive executor (no shell available; see "Pending Operation"). Review gate: `disabled/unmanaged` (no review receipt).

## Final State at Close

| Item | Final state | Source |
|------|-------------|--------|
| Tasks | 121 `[x]`, 0 `[ ]` | `verify-report.md` (checked against `tasks.md`); launch prompt confirms all `[x]` |
| Verify verdict | PASS WITH WARNINGS: 0 critical, 3 warnings, 9 suggestions at verification time. W1, W2, S1 and S3 were fixed afterwards in slice W3-21 (PR #106). W3 is an environment caveat that is handled by a merge-gate command, not a code change. S2, S6, S7 stay open (below) | `verify-report.md`, `verify-report` obs #662, launch prompt |
| Gate at the W3-21 tip | `npm test` 329 files / 6313 tests passed, 2 skipped; `npm run typecheck` clean; `npm run build` OK; `SOFTCOMMERCE_DESKTOP_ROOT=... npx vitest run scripts/inventory`: 2 files / 61 passed | `apply-progress.md` section W3-21 (later than the verify run, which saw 6311 passed, 2 skipped) |
| Coverage | 98 requirements, 174 scenarios, 174 covered, 0 partial, 0 missing (verify run, before W3-21; W3-21 only fixed two code/spec contradictions and added assertions) | `verify-report.md` |
| W1/W2 test edits | Exactly 13 W1/W2 test files modified; they are the 13 that R-MST-18 lists; pinned by `test/catalogs/wave3.completeness.spec.ts` | `verify-report.md`, merged spec R-MST-18 |
| Delivery | Tracker PR #59 (`feat/softcommerce-w3`); 47 child PRs #60 to #106 merged in order into the tracker; code tree identical to the verified tip | Launch prompt |
| Review gate | Receipt-driven development disabled by the user; no review receipt exists, none fabricated | Launch prompt |

### Verify findings and how each was resolved

| ID | Finding (per `verify-report.md` at verification time) | Final state |
|----|-------------------------------------------------------|-------------|
| W1 | Item formId was `miItem`, but R-MST-1 and the desktop menu (`MenuBarSystemDinamico.java:175`) use `miProducto` | FIXED in W3-21 (commit f030ba0): renamed in `items.js`, `menu.json` node 53, `permissions.json` and the two Item specs. The merged spec R-MST-14 says `miProducto` |
| W2 | Trabajador allowed CLONE, but `PanelTFTrabajador.controlClone()` is empty and R-MST-1 lists INSERT, UPDATE, DETAIL | FIXED in W3-21 (commits 6d2e135, 3fea7df): modes are `INSERT, UPDATE, DETAIL`, grant `clone: false`. A 405 assertion for CLONE is not expressible (a CLONE is a plain `POST`, same verb as INSERT), so refusal is asserted through `entry.modes`, the grant and the absent `Clonar` button (D-W3-21-3) |
| W3 | The 2 real-tree inventory tests skip silently when the `desktop_java` submodule is empty | Handled by procedure, no code change: run them with `SOFTCOMMERCE_DESKTOP_ROOT` set in the merge gate. The W3-21 gate ran them that way (61 passed) |
| S1 | No test asserted the `id_usuario` stamp of a child created through a nested write | FIXED in W3-21 (commit 9a52ded): assertion added; a mutation of `children.js` `insertion` made it fail |
| S3 | apply-progress: W3-1 heading said PARTIAL, W3-5b section duplicated | FIXED in W3-21 (heading now DONE, duplicate removed) |
| S2 | Spec examples say `OPCION: ADUANAS` / menu `Aduanas` (S-PRM-6, S-AUTH-26); the seed node and the test use `Aduana` | OPEN, wording only. The merged specs keep the delta text as written. Align when next touching those specs |
| S4 | A process slip in W3-20: one `git checkout -- <file>`, which the standing rules forbid | Recorded only; effect benign |
| S5 | `wave3.completeness` requirement mapping only proves a named file mentions the ID; its git check hard-codes base `7c99e11` and skips silently where that commit is absent | Accepted as is |
| S6 | S-REG-28 has no literal ID tag in a test | OPEN; it is covered through the scenarios it is composed of |
| S7 | `test/catalogs/completeness.spec.ts` header comment still says "nine" while the title and assertion say eleven | OPEN; it is a W2 test file |
| S8 | The worktree held an older committed copy of the change folder | Resolved for this archive: the launch prompt states the folder in this worktree holds the final as-built artifacts |
| S9 | `test/parity.spec.ts` shows as modified through line-ending noise; do not stage it | Recorded only |

## Review Gate Record

- `reviewGate.delivery`: `disabled/unmanaged`
- `reviewGate.result`: not `allow`. No review governs this change.
- No approved terminal receipt is claimed. Archive proceeds under the `disabled/unmanaged` relaxation only. No explicit review artifact exists for this change, so none failed validation.

## Task Completion Gate

All 121 tasks are `[x]` per `verify-report.md` and the launch prompt; apply-progress records the W3-21 follow-ups as done. No stale-checkbox reconciliation was needed.

## Specs Synced

Delta specs were merged into `openspec/specs/`. No requirement was removed or renumbered. The "Previously:" notes of the deltas were not carried into the main specs. Text of W2 requirements that a delta did not modify (for example R-REG-1..12, S-REG-1..19, R-CRUD-1..10 and 12..16) is untouched.

### Existing capabilities (merged in place)

| Capability | Main spec path | Requirements | Scenarios |
|------------|----------------|--------------|-----------|
| softcommerce-auth-session | `openspec/specs/softcommerce-auth-session/spec.md` | Added R-AUTH-10..13; modified R-AUTH-7 (session also holds grants) | Modified S-AUTH-16; added S-AUTH-23..31 |
| softcommerce-catalog-registry | `openspec/specs/softcommerce-catalog-registry/spec.md` | Added R-REG-13..21 | Added S-REG-20..30 |
| softcommerce-crud-templates | `openspec/specs/softcommerce-crud-templates/spec.md` | Added R-CRUD-17..19; modified R-CRUD-11 (kinds `password`, `textarea`, `lookup`) | Added S-CRUD-42..50 |
| softcommerce-gui-inventory | `openspec/specs/softcommerce-gui-inventory/spec.md` | Added R-INV-7..11 | Added S-INV-13..21 |
| softcommerce-mock-api | `openspec/specs/softcommerce-mock-api/spec.md` | Added R-MOCK-19..26; modified R-MOCK-1, 6, 15, 18 | Modified S-MOCK-35, S-MOCK-38; added S-MOCK-39..58 |
| softcommerce-reference-catalogs | `openspec/specs/softcommerce-reference-catalogs/spec.md` | Added R-REF-14; modified R-REF-11 (usuarios and trabajadores are no longer read-only; table rows for tipos-doc-iden and tablas-detalle-sunat extended) and R-REF-12 (exclusions closed) | Modified S-REF-39; added S-REF-40..43 |

### New capabilities (created from the deltas)

| Capability | Main spec path | Requirements | Scenarios |
|------------|----------------|--------------|-----------|
| softcommerce-lookup-dialog | `openspec/specs/softcommerce-lookup-dialog/spec.md` | R-LKP-1..8 | S-LKP-1..16 |
| softcommerce-master-detail | `openspec/specs/softcommerce-master-detail/spec.md` | R-MD-1..10 | S-MD-1..14 |
| softcommerce-row-actions | `openspec/specs/softcommerce-row-actions/spec.md` | R-ACT-1..6 | S-ACT-1..9 |
| softcommerce-anexo | `openspec/specs/softcommerce-anexo/spec.md` | R-ANX-1..10 | S-ANX-1..16 |
| softcommerce-masters | `openspec/specs/softcommerce-masters/spec.md` | R-MST-1..18 | S-MST-1..37 |
| softcommerce-user-permissions | `openspec/specs/softcommerce-user-permissions/spec.md` | R-PRM-1..8 | S-PRM-1..16 |

The merged text is the as-built delta text, including its "Applied in W3-n" notes (they record what shipped). One typographical fix was made while copying R-MST-18 (a missing full stop before "Also (W3-16b ..."). Untouched capabilities: `softcommerce-localidad-catalog` and `softcommerce-shell-workspace` (no delta).

## Pending Operation: Folder Move

The archive executor had no shell, so `git mv` could not run (a copy would leave a duplicate active change). Pending:

```
git -C "D:/Kiro Projects/patron-frontend-jona-worktrees/w3-archive" mv openspec/changes/softcommerce-web-migration-w3 openspec/changes/archive/2026-10-24-softcommerce-web-migration-w3
```

This archive-report.md was written inside the active folder so it moves with the rest. Afterwards confirm `openspec/changes/softcommerce-web-migration-w3/` no longer exists. Note that the folder was untracked in the main checkout; if it is also committed in this worktree history (verify S8), `git mv` moves that committed copy and the current files must then be staged over it.

## Observation IDs (Traceability)

| Artifact | Engram ID | Topic key | Notes |
|----------|-----------|-----------|-------|
| explore | #637 | `sdd/softcommerce-web-migration-w3/explore` | |
| proposal | #639 | `sdd/softcommerce-web-migration-w3/proposal` | Mirror of `proposal.md` |
| design | #640 | `sdd/softcommerce-web-migration-w3/design` | Final text is `design.md` on disk (D1 to D27 as applied) |
| spec | #641 | `sdd/softcommerce-web-migration-w3/spec` | Follow-up edits note; the files on disk are authoritative |
| tasks | #642 | `sdd/softcommerce-web-migration-w3/tasks` | 121 tasks |
| apply-progress (pointer) | #643 | `sdd/softcommerce-web-migration-w3/apply-progress` | Pointer to `apply-progress.md`, which is authoritative |
| apply-progress W3-3 (partial snapshot) | #644 | `sdd/softcommerce-web-migration-w3/apply-progress` | Superseded: W3-3 was later completed (blocker resolved by the approved `reference.cases.ts` exception) |
| apply-progress per slice | #646 (W3-7), #647 (W3-8), #648 (W3-9), #649 (W3-10), #650 (W3-11a), #651 (W3-11b), #652 (W3-12), #653 (W3-13), #654 (W3-14), #655 (W3-15), #656 (W3-16a), #657 (W3-16b), #658 (W3-17), #659 (W3-18), #660 (W3-19), #661 (W3-20), #663 (W3-21) | `sdd/softcommerce-web-migration-w3/apply-progress-w3-*` | |
| verify-report | #662 | `sdd/softcommerce-web-migration-w3/verify-report` | Snapshot at 8be5518, before W3-21. Its YAML header says `verdict: pass`; its body says PASS WITH WARNINGS |
| review artifacts | none | `sdd/softcommerce-web-migration-w3/review/*` | Review disabled |

## Open Product Questions (not blockers)

Items the product owner may want to revisit. Each is a decision recorded during design or apply, with the evidence status.

1. **Tipo anexo ids.** Banco `3`, Chofer `7`, Transportista `6` are read from the desktop (`listAnexo("3" | "7" | "6")`). Vendedor `8` is from `newRegister`. Proveedor `1` and Cliente `2` are [INFERRED] from `FormAnexoPadron(..., 1 | 2, ...)`. Trabajador `9` is a [INFERRED] placeholder (`TIPO_ANEXO.trabajador`; `mantTrabajador` passes none and `8` is the Vendedor). The design's original open question about Banco and Trabajador ids is partly closed (Banco found) and partly still open (Trabajador). Confirm in W6.
2. **Inferred code widths.** Anexo masters pad to 10 (the desktop pads typed ids in `buscarVendedor` / `buscarTransportista` and `PanelTFBanco.focusLost`; Proveedor and Cliente have no pad logic, so 10 is [INFERRED] for them). Item pads to 6 [INFERRED] from the six-digit `Codigo` filter of BuscarItemConversion. Confirm in W6.
3. **Trabajador `codeWidth` is 3, not the desktop's 5** [DEVIATION, D-W3-8-3]. Reason: the W2 seed codes are `001..004` and a typed code in the BuscarTrabajador lookup must still resolve them. Real width 5 would need a seed and picker change.
4. **Composed `nombre` order is `paterno materno nombres`** (`PEREZ LOPEZ ANA`), not the `nombres paterno materno` that the first spec text assumed [DEVIATION, D-W3-8-2]. It follows `RegisterTrabajador.getBeanTrabajador` and matches Banco and Chofer. The W2 seed rows keep their old strings until edited.
5. **Vendedor filled fields are always read-only.** `Nombres`, `Dirección` and `Numero` (and the picker in UPDATE) cannot be edited in any mode [DEVIATION from "then read-only", D-W3-9-3], so `Debe elegir un trabajdor` cannot be bypassed. A trabajador whose DNI has 10 digits can then hit a 422 on `numero_doc` under DNI (max 8) that the user cannot edit away; changing the tipo is the only way out.
6. **Autorizar Series `Activar` over a deactivated pair re-activates that row [ASSUMPTION].** The rule lives in the Oracle function `FN_MANT_AUTORIZAR_CORRE`, which is not in the repository (R-PRM-7, D-W3-14). The Activar dialog also closes on success, whereas the desktop leaves it open [DEVIATION].
7. **Socio `Desactivar` is inert.** `FormAccionSocio.actionPerformed` has an empty branch for `btnDesactivarSocio` (lines 351-352), so the web button exists and does nothing, like the desktop. The server still accepts an `A` op with `estado: 'D'` and a `fecha_fin`. A real deactivation needs a product decision and a `Desactivar Socio` dialog (`FormAccionSocioAgregar` with `swRegistro` false is the starting point). This closes the design's open question about the handler.
8. **Grants are snapshotted at login** (user decision of 2026-10-23, R-AUTH-11, R-PRM-8) [DEVIATION from the desktop, which reads grants per form open]. Edits to a perfil apply only at the next login; an open session keeps its grants.
9. **CLONE drops child rows** (R-MD-9) [DEVIATION from `RegisterBancoAnexo.java:788`, which loads the original's children on CLONE]. The copy gets a fresh `INICIO` activation.
10. **Usuario conventions.** The mock keeps `flaghabilitado` `A` / `D` (the desktop uses `H` / `D`) [INFERRED]. A new user defaults all four flags OFF, so it cannot log in until an administrator ticks `Habilitado` and `Escritorio`. Editing a seeded user (`admin`, `cajero`), which has no trabajador, requires picking one, which also replaces its `nombre` (D-W3-11b-5). User ids are the next integer across every tenant. New message texts not present in the desktop: `El nombre de usuario ya existe.`, `La confirmación de la contraseña no coincide.`, and for Item `El codigo alternativo ya existe.`.
11. **Menu titles and placement proposals.** `Seguridad - Perfil` (node 50) and `Acciones de Socio` (node 54) sit under Generales; the desktop opens them from other places (`Main`, `PanelTFTipoTrabajadorPerfil`). `miProducto` (the Item leaf, node 53) was aligned with the desktop in W3-21.
12. **W6 contract points.** The `GET /v1/params` keys of R-MOCK-24 (`PORC_IGV` and the `IS_CLIENTE_*` / `IS_ITEM_RESUMEN_PRECIO` flags, with the seeded values per tenant); the shapes of the stubs `cuentas-contables`, `parametros-prov`, `clases-sunat` (all [INFERRED]) and `padrones`; the `shared` scope of the SUNAT tables, `padrones` and `clases-sunat`; the seeded tabla 3 banks (56 BCP, 57 INTERBANK, 58 OTROS, 59 retired) behind the Cliente `Cuenta`; the `INICIO` row semantics; real permission storage behind the perfil overlay.
13. **Cliente decisions.** The `OTROS` skip for `Tipo Cliente` is a `requiredWhen` over the offered tipo ids because no seeded tipo has abreviatura `OTROS` [INFERRED]; the tipo de cliente has no default (the desktop selects the first one); the Credito and Credito Temp totals are derived from the rows rather than stored on the parent [DEVIATION]; the sustituto veto of the cliente being edited is [ASSUMPTION]; `Cliente esta desactivado` is a client check only; the Direcciones distrito sentence says `un Distrito` (desktop says `un Almacen`); condición de pago offers only CONTADO and CREDITO.
14. **Item decisions.** Derived fields use a new `follows` attribute instead of D27b's `derive` (a `derive` target cannot be a field); `Stock Min` is stored as typed in every tenant; `Suj. Percepción` and `Porc. Perc` open read-only and are not locked on the server; scope `empresa`; the seven deferred Item tabs and their dialogs are not ported; the Item almacén child stores `id_localidad` and `id_punto_venta` too (the desktop keeps only the almacén).
15. **Pickers without a production consumer.** BuscarCliente, FormBuscarVehiculo, BuscarParametroProv and BuscarItemConversion are built and tested only through harness hosts; W4 sales and dispatch are their first consumers.
16. **Not ported by design.** The legacy Proveedor, Cliente and Vendedor screens (the three Proveedor dialogs are only used by the legacy `RegisterProveedor`), the conta `Bancos` screen, and the desktop-only quirks listed as [DEVIATION] in the merged specs.
17. **Carried from W2.** Open question 1 of the W2 archive (the `miTipoCambio` read-only permission seed) and the inferred W2 `codeWidth` values still belong to W6.

## Risks and Notes

- Review gate was disabled by the user. No review evidence exists for this change.
- Delivery facts (PR numbers #59 to #106, merge order, tree identity) are orchestrator-provided; the archive executor did not run git or any tests. Test counts are carried from `apply-progress.md` (W3-21 gate) and `verify-report.md`, attributed above.
- Engram spec and design observations (#640, #641) are alignment notes, not full copies; the files on disk are authoritative.
- Engram `verify-report` #662 is a snapshot from before W3-21 and lists W1 and W2 as pending. Per the final-state rule they are reported above as fixed in W3-21. No contradiction was left unresolved: the fix is corroborated by `apply-progress.md` (W3-21), `verify-report.md` (Follow-up) and the launch prompt.
- Nothing was committed or pushed by this run.
