# Delta for softcommerce-reference-catalogs

Wave 3 promotes the `usuarios` and `trabajadores` lookups to writable masters (R-REF-11) and closes the three W2 exclusions that waited for G10 / G11 / G12 (R-REF-12): the Chofer activation tab, the Vehiculo propietario picker and the TrabajadorPuntoVenta trabajador picker. The 38 catalog tables of R-REF-4..R-REF-6 are NOT rewritten: the three affected rows are amended by R-REF-14 below, which supersedes their W2 notes. Marker legend: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-REF-1..13, S-REF-1..39).

## ADDED Requirements

### R-REF-14 Wave 3 amendments to W2 catalogs
These rows of R-REF-4..R-REF-6 are amended, and the quoted W2 notes cease to apply:
- `choferes` (R-REF-6): "activation tab excluded (R-REF-12)" no longer applies. The register MUST gain the `Activación de Chofer` tab on the shared Anexo grid (softcommerce-anexo R-ANX-10); its `modes` stay `[INSERT, UPDATE, DETAIL, CLONE]`; the seeded rows get an `INICIO` activation; the server-recorded initial activation of W2 is now visible and editable through the grid. S-REF-25..S-REF-29 pass unchanged.
- `vehiculos` (R-REF-6): "propietario excluded (R-REF-12)" no longer applies. The register MUST gain the optional `id_anexo_empresa_transportista` (`Propietario`) as a `lookup` over `transportistas` with typed-code resolution (softcommerce-masters R-MST-6, softcommerce-lookup-dialog R-LKP-6); the W2 field rules, uniqueness and messages stay; the list gains the joined `Propietario` (razón social of the transportista, empty when none); `Vehiculos` of a Transportista and this catalog are ONE store.
- `trabajador-punto-venta` (R-REF-6): "the desktop trabajador picker is a select (R-REF-12)" no longer applies. `id_trabajador` MUST become a `lookup` over `trabajadores` (the BuscarTrabajador picker, softcommerce-lookup-dialog R-LKP-8); its required message `Para {modo} un Trabajador, debes especificar su Nombre.` (field label `Nombre`), the unique (trabajador, punto de venta) rule and its literal message, the chain `empresa -> localidad -> punto de venta`, the `habilitar` default and the tenant-wide list (all W2 **[DEVIATION]** notes) stay; S-REF-21 keeps its meaning and assertions (W2-test exception, softcommerce-masters R-MST-18: only the UI field helpers of `src/catalogs/registry.trabajadorPuntoVenta.ui.spec.tsx` change).
All other rows are unchanged.

## MODIFIED Requirements

### R-REF-11 Read-only seeded lookups
The mock MUST expose these lookups as read-only (R-REG-11; writes answer 405 `METHOD_NOT_ALLOWED`). Scope per entry: `shared` (global, W6 to confirm) for monedas, tipos-doc-iden, tablas-sunat, tablas-detalle-sunat, tipos-doc-venta, familias-sunat and subfamilias-sunat. The DNI id of tipos-doc-iden and every `codeWidth` are read from the desktop at apply time. `usuarios` and `trabajadores` are NO LONGER read-only lookups: from Wave 3 they are writable masters (softcommerce-masters R-MST-4, R-MST-7) that keep the slugs, the row shapes (`{ id_usuario, usuario, nombre }`, `{ id_trabajador, nombre }`), the `tenant` scope and the `/v1/lookups/{slug}` behavior of Wave 2, so UsuarioCorrelativo and TrabajadorPuntoVenta are unchanged (R-MST-17); the lookups of Wave 3 stubs (`cuentas-contables`, `parametros-prov`, `clases-sunat`, `padrones`) are defined in softcommerce-mock-api R-MOCK-25.

| Slug | Purpose | Needed seed |
|---|---|---|
| monedas | TipoCambio | includes `DOLAR AMERICANO` |
| tipos-doc-iden | Chofer, Socio, and the anexo masters | includes `DNI` (`01`) and `RUC` (`05`), with the `persona` (persons) and `estado` (active) flags, `optionLabel` `abreviatura`; selects use `where {persona: true, estado: true}` |
| tablas-sunat | TipoMovInventario, UnidadMedida | at least 6 rows; the 6th is the units table |
| tablas-detalle-sunat | same, filter `id_tabla_sunat`; the Cliente `Cuenta` bank list (tabla `3`) | detail rows per tabla |
| tipos-doc-venta | Correlativo, UsuarioCorrelativo | includes `TI`; filter `id_punto_venta` |
| familias-sunat, subfamilias-sunat | Familia, SubFamilia | `subfamilias-sunat` filtered by `codigo_familia_sunat` |

All lookups above are confirmed read-only seeded lookups; they are the W6 / W2b contract. In Wave 2 they had no screens; in Wave 3 `usuarios` and `trabajadores` have their master screens (softcommerce-masters).
(Previously: `usuarios` and `trabajadores` were read-only lookups (`tenant` scope; `usuarios` a projection of the auth seed, `trabajadores` minimal rows) with no screens.)

### R-REF-12 Excluded desktop behaviors
The following are NOT part of Wave 3 (W2 list, as amended): nested "create related" buttons (SubFamilia familia, TipoCambio moneda, and the Usuario `Nuevo Trabajador` button); the UnidadMedida presentation panel (Presentación / Unidad Base, FP, UP: not persisted or validated by the desktop). The three items that Wave 2 excluded are CLOSED in Wave 3 and are no longer exclusions: the Chofer "Activación" tab with its activar / desactivar actions and history grid (G11 / G12, now softcommerce-anexo R-ANX-10), the Vehiculo "Propietario" transportista picker (G10 and Transportista, now softcommerce-masters R-MST-6), and the entity-picker dialogs (the TrabajadorPuntoVenta trabajador, now softcommerce-lookup-dialog R-LKP-8). Out of scope for Wave 3 too: image / file upload and the real cuentas contables.
(Previously: Wave 2 excluded the Chofer activation tab, the Vehiculo propietario picker and the entity-picker dialogs as W2b / G10 / G11 / G12 work.)

## MODIFIED Scenarios

**S-REF-39 excluded behaviors absent** — Given SubFamilia, TipoCambio and UnidadMedida, Then no nested-create button or presentation panel is rendered; Given Usuario, Then no `Nuevo Trabajador` button is rendered. (Chofer now shows its activation tab and Vehiculo its propietario lookup: S-REF-40, S-REF-41.)

## ADDED Scenarios

**S-REF-40 chofer activation tab** — Given the Chofer register in UPDATE on a seeded chofer, Then the `Activación de Chofer` tab shows the seeded `INICIO` activation; `Desactivar` on it with a motivo marks it deactivated and unchecks `Estado`; the toolbar still offers no DELETE and `DELETE` answers 405 `MODE_NOT_SUPPORTED`.

**S-REF-41 vehiculo propietario** — Given the Vehiculo register, Then `Propietario` is an optional lookup over active transportistas; saving with no propietario succeeds; saving with transportista T shows `Propietario` T in the list and the vehiculo appears in T's `Vehiculos` grid.

**S-REF-42 trabajador-punto-venta lookup** — Given the TrabajadorPuntoVenta register, Then `Nombre` is a lookup opening BuscarTrabajador; a blank value shows `Para agregar un Trabajador, debes especificar su Nombre.`; a duplicate (trabajador, punto de venta) still answers 409 on `id_trabajador` with the W2 literal message.

**S-REF-43 usuarios and trabajadores no longer read-only** — Given `usuarios` and `trabajadores`, Then `POST` creates records (201) instead of answering 405 `METHOD_NOT_ALLOWED`, `GET /v1/lookups/usuarios|trabajadores` keep `{ items: [{ id, name }] }` of active records, and S-REF-17 and S-REF-21 keep their assertions (S-REF-21 under the R-MST-18 helper exception).
