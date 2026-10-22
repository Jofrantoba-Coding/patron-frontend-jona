# Spec: softcommerce-gui-inventory (ADDED)

Script under `web_ts/softcommerce/scripts/inventory` generating `inventory.csv` for `desktop_java/softcommerce-desktop`. Delivered in its own PR.

## Requirements

### R-INV-1 Output
The script MUST produce `inventory.csv` with a header and one row per GUI class, with at least: class name, relative path, package, base class (resolved across multi-line `extends`), pattern category (list frame, register dialog, search/lookup, process/detail form, other), and approximate wave.

### R-INV-2 Encoding
Sources MUST be read as ISO-8859-1; Spanish accented characters in names or text MUST NOT be corrupted; the CSV MUST be written as UTF-8.

### R-INV-3 Extends detection
`extends` MUST be detected even when declared on a following line (about 35% of classes), not only single-line.

### R-INV-4 Exclusions
The inventory MUST exclude: base classes `CDialog`, `JHDialog`, `JHInternalFrame`, `AbstractRegister`, `PanelControlView`, `ControlView`, `FrmPanel`, `CTable`; renderers (`shared/util/render/PnlRenderer*`); `view/tablemodel`; `view/conta/tablas`; combo box models.

### R-INV-5 Determinism
Output MUST be deterministic: sorted rows, stable CSV quoting, same input gives byte-identical output. The script MUST be runnable via an npm script and be read-only toward the Java tree.

### R-INV-6 Failure handling
A missing source directory MUST abort with a clear error and non-zero exit; an unreadable single file MUST be reported and skipped without aborting.

## Scenarios

**S-INV-1 lists a screen** — Given a fixture class `RegisterLocalidad extends JHDialog`, Then it appears with category register dialog.

**S-INV-2 multi-line extends** — Given `public class X\n    extends JHInternalFrame {`, Then X is listed with base `JHInternalFrame`.

**S-INV-3 base classes excluded** — Given fixtures named `CDialog`, `JHDialog`, `JHInternalFrame`, `AbstractRegister`, `PanelControlView`, `ControlView`, `FrmPanel`, `CTable`, Then none appears.

**S-INV-4 renderers excluded** — Given a class in `shared/util/render` named `PnlRendererFoo`, Then it does not appear.

**S-INV-5 tablemodel and conta tablas excluded** — Given classes under `view/tablemodel` and `view/conta/tablas`, Then none appears.

**S-INV-6 combo models excluded** — Given a combo box model class, Then it does not appear.

**S-INV-7 encoding** — Given an ISO-8859-1 file containing "Descripción" in a class name or comment used for the title, Then the CSV shows "Descripción" intact in UTF-8.

**S-INV-8 category mapping** — Given `BuscarCliente`, `FormBuscarItem`, `FormVentas`, Then categories are search/lookup, search/lookup, process/detail form respectively.

**S-INV-9 deterministic** — When run twice on the same tree, Then the two outputs are byte-identical.

**S-INV-10 missing source root** — Given a nonexistent path, Then exit code is non-zero with an error naming the path.

**S-INV-11 unreadable file** — Given one unreadable file among valid ones, Then it is reported on stderr, skipped, and the remaining rows are written.

**S-INV-12 read-only** — After a run, Then the Java tree has no modified files.
