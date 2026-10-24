# Delta for softcommerce-gui-inventory

The wave heuristic ("W3 = everything else") puts 74 classes in W3 but only 23 are Wave 3 work. This delta adds a deterministic override map that reassigns the 51 non-W3 rows, so the W3 bucket and the W4-W7 counts become trustworthy. Marker legend: **[ASSUMPTION]**, **[INFERRED]**. Numbering continues the promoted spec (R-INV-1..6, S-INV-1..12). The classification evidence is `exploration.md` of this change (instantiation sites, `Main.java` menu wiring, line counts, the W2 registry).

## ADDED Requirements

### R-INV-7 Wave override map
The script MUST read a committed JSON override map (`class name -> wave or disposition`) and apply it BEFORE the heuristic wave rules (the first match wins, so an overridden class never reaches the rules); a class with no override keeps the heuristic wave unchanged. The map MUST be keyed by class name (unique per scanned tree). The script MUST abort with a non-zero exit and a clear error naming each offender when an override names a class that the scan did not find, when the map holds a duplicate key, or when a value is not an allowed value (R-INV-8). The CSV header, the sort order and the quoting of R-INV-1 and R-INV-5 stay unchanged.

### R-INV-8 Allowed wave values
The `wave` column MUST accept the waves `W1`..`W7` and three dispositions: `shell` (already built on the web: the shell, session and context), `infra` (a Swing infrastructure widget that is not ported as a screen because the CRUD templates, `CrudGrid` and the shell replace it) and `drop` (dead code or not applicable on the web). Heuristic output continues to produce only `W1`..`W7`.

### R-INV-9 The 51 reassigned rows
The override map MUST contain exactly these 51 entries (the group names and counts of the exploration; the apply step MUST resolve every name against the scanned tree, and **[INFERRED]** the Libro class names are copied from the exploration without their package):
- `infra` (7): JHInternal, JHInternalDialog, PanelControlRegister, PanelRowSelection, ProgressBarSystem, RendererCheckBox, StateBarSystem.
- `drop` (6): the dead classes ImagePanel, ImagePreview, TimeSerieResumen and CambiarCondicionPago (never instantiated), plus ConexionBaseDatos (a DB connection dialog, meaningless on the web) and MainFrameTest (a test harness).
- `shell` (5): CambiarEmpresa, CambiarPeriodo, Main, UiLogin, UiLoginImpl.
- `W2` (6, delivered, misassigned because their base is JHInternalFrame): PnlMarcaVehiculo, PnlModeloVehiculo, PnlTipoTrabajador, PnlTurno, PnlUbicacion, PnlVehiculo.
- `W4` (9): PnlLiquidacion, PnlLiquidacionRegistro, PnlCierreProdDespachar, PnlConsultaProdDespachar, PanelDiferenciaPrecio, FormConversion, FormConversionVarios, FormAutorizar, FormDVRegularEstado (FormConversion is also used by W5 from RegisterIngreso).
- `W5` (9): PnlRepKardex, PnlConsultaMovimiento, PnlDocumentoCosteo, PnlMostrarTipoMovimientosFormula, ActualizarAlmacenes, PnlActualizarAlmacenes, JDSeleccionaAlmacen, FormLoteMovimiento, PanelFEDesactivarItemAlm (Kardex could move to W7; **[ASSUMPTION]** W5).
- `W6` (3): PnlCancClienteGroup, PnlCancProvGroup, FrmCambiarFechaDoc.
- `W7` (6): PnlRepLibroCaja, LibroCompras, LibroDiario, LibroDiarioSimp, LibroMayor, LibroPercepcion.

### R-INV-10 The Wave 3 bucket
After the override, the classes with wave `W3` MUST be exactly the 23 Wave 3 rows, with no entry in the map: the 20 child dialogs (Cliente: FormClienteDireccion, FormClienteContacto, FormClienteCuenta, FormClienteCredito; Proveedor: FormDireccionProveedor, FormConfigPadronProveedor, FormPanelConfigPadronProveedor; Item: FormItemCaracteristica, FormItemConfig, FormItemConfigDscto, FormItemAlmacen, FormItemConfigCuenta, FormItemPercepcion; Anexo: FormAnexoActivacion, FormAnexoPadron; Usuario / perfil: FormMenuPerfilArbol, FormMenuPerfilPermiso, FormUA, FormPanelUA; Vendedor: PanelCargarTrabajador) and the 3 Socio acciones dialogs (FormAccionSocio, FormAccionSocioAgregar, FormAccionPrecioAgregar). The `W3` value is the SCOPE bucket, not delivery: the three Proveedor dialogs reachable only from the legacy `RegisterProveedor` and the Item dialogs of deferred tabs stay `W3` in the CSV while softcommerce-masters (R-MST-13, R-MST-15) records that they are not ported in Wave 3. A test MUST assert the exact W3 set and its count.

### R-INV-11 Counts are asserted
The inventory test MUST assert, on the committed `inventory.csv` regenerated from the Java tree, that every one of the 51 overridden classes has its mapped value, that the W3 set equals the list of R-INV-10 (23 rows), and that adding or removing a Java class that is neither overridden nor matched by a heuristic rule changes only the heuristic bucket it falls in. A heuristic or map change MUST fail the test unless the expected lists change with it.

## ADDED Scenarios

**S-INV-13 override beats the heuristic** — Given a fixture class `CambiarEmpresa` that the heuristic would put in `W3` and the map entry `CambiarEmpresa: shell`, Then its row has wave `shell`; given an overridden class in a `ventas` package mapped to `W6`, Then it is `W6` (the map wins over the package rule).

**S-INV-14 non-overridden unchanged** — Given a class not in the map, Then its wave equals the heuristic wave (S-INV-8 and the W1 wave tests pass unchanged).

**S-INV-15 stale override aborts** — Given the map names `NoSuchClass`, When the script runs, Then it exits non-zero with an error naming `NoSuchClass` and writes no CSV.

**S-INV-16 invalid map** — Given a duplicate key or a value such as `W9` or `done`, When the script runs, Then it exits non-zero naming the key and the value.

**S-INV-17 dispositions** — Given the real tree, Then ImagePanel, ImagePreview, TimeSerieResumen, CambiarCondicionPago, ConexionBaseDatos and MainFrameTest are `drop`; JHInternal, JHInternalDialog, PanelControlRegister, PanelRowSelection, ProgressBarSystem, RendererCheckBox and StateBarSystem are `infra`; the five shell classes are `shell`.

**S-INV-18 reassigned waves** — Given the real tree, Then the 6 delivered catalog panels are `W2`, the 9 sales / delivery rows are `W4`, the 9 purchasing / inventory rows are `W5`, the 3 contabilidad rows are `W6` and the 6 libro rows are `W7`.

**S-INV-19 Wave 3 bucket exact** — Given the real tree, Then the rows with wave `W3` are exactly the 23 classes of R-INV-10, none overridden.

**S-INV-20 deterministic with the map** — When the script runs twice on the same tree and the same map, Then the two outputs are byte-identical; the header stays `class, path, package, base, category, wave` and the rows stay sorted.

**S-INV-21 read-only** — After a run with the map, Then the Java tree has no modified files and the map file is not rewritten.
