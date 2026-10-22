# Spec: softcommerce-localidad-catalog

Reference slice: Localidad (`PanelTFLocalidad` + `RegisterLocalidad`), built only as a config on the CRUD templates.

## Requirements

### R-LOC-1 Entity
Localidad: `id_localidad, id_empresa, descripcion, direccion, id_ubigeo`, with display fields `empresa, departamento, provincia, distrito`.

### R-LOC-2 List
The list MUST show descripcion, direccion, empresa, departamento, provincia, distrito, scoped by the tenant, hiding inactive records. Form id grants the 13 permission flags.

### R-LOC-3 Fields
- Empresa: required combo from `/v1/empresas`.
- Descripcion: required, uppercase, max 100.
- Direccion: required, uppercase, max 100.
- Departamento, Provincia, Distrito: required cascading combos from `/v1/ubigeo?parent=`; the selected distrito id is `id_ubigeo`.

### R-LOC-4 Ubigeo cascade
Provincia options MUST load only after a departamento is chosen; distrito options only after a provincia. Changing a level MUST clear and reload the levels below it and leave levels above unchanged. Levels below an unselected parent MUST be disabled.

### R-LOC-5 Modes
All five modes (INSERT, UPDATE, DELETE, DETAIL, CLONE) MUST work against the mock server. In UPDATE/DELETE/DETAIL/CLONE the three ubigeo levels MUST be restored from the record's `id_ubigeo` (all levels preselected with options loaded).

### R-LOC-6 Delete **[ASSUMPTION]**
Delete is logical only (`eliminar`) and gated by the `eliminate` flag; no physical delete (`eliminarFisico`) is offered.

### R-LOC-7 Dual-source validation
The slice MUST run identically against the mock implementation of `InterCatalogService` loaded lazily by the composer (typed fixtures, mock mode, in-process) and the real mock server over HTTP, via the same service interface. The composer MUST validate `VITE_API_*` for the catalog service the same way as for auth: invalid mode or missing URL fails fast; mock mode loads fixtures by dynamic import and does not touch the network.

## Scenarios

**S-LOC-1 list columns** — Given the seeded localidades of the demo tenant (5 rows, 1 inactive), When the list loads, Then only the 4 active rows show, with empresa and ubigeo (departamento, provincia, distrito) names resolved, and the inactive row is hidden.

**S-LOC-2 INSERT happy path** — Given add=true, When Empresa, "sede lima" and "av. x 123" are entered with a full ubigeo and submitted, Then create is called with uppercase "SEDE LIMA", "AV. X 123" and the distrito id as `id_ubigeo`; the new row is selected.

**S-LOC-3 empresa required** — Given no empresa, Then submit is blocked with a field error.

**S-LOC-4 descripcion limit** — Given descripcion holds 100 chars, When one more char is typed, Then the insertion is ignored and the value stays at 100 chars. Given descripcion holds 95 chars, When 10 chars are pasted, Then the whole paste is ignored (no truncation, no error) and the value is unchanged. A value longer than 100 is never sent.

**S-LOC-5 ubigeo required** — Given departamento and provincia chosen but no distrito, Then submit is blocked.

**S-LOC-6 initial cascade** — Given a fresh INSERT form, Then provincia and distrito combos are disabled and empty; choosing a departamento enables and loads provincias only.

**S-LOC-7 cascade reset on departamento** — Given Lima/Lima/Miraflores selected, When departamento changes to Cusco, Then provincia and distrito are cleared, provincia options reload for Cusco, distrito is disabled.

**S-LOC-8 cascade reset on provincia** — Given Lima/Lima/Miraflores, When provincia changes, Then distrito is cleared and reloads for the new provincia; departamento is unchanged.

**S-LOC-9 distrito change** — Given a full selection, When distrito changes, Then departamento and provincia stay unchanged.

**S-LOC-10 stale response ignored** — Given departamento changes twice quickly, When the first response arrives last, Then provincia options reflect only the latest departamento.

**S-LOC-11 UPDATE restores ubigeo** — Given a record with `id_ubigeo` of Miraflores, When Modify opens, Then departamento, provincia and distrito are all preselected with their option lists loaded.

**S-LOC-12 UPDATE** — Given a changed direccion, When submitted, Then update is called with the id and the list shows the new value.

**S-LOC-13 DELETE logical** — Given Delete confirmed, Then the localidad leaves the default list and remains flagged inactive on the server.

**S-LOC-14 DELETE denied** — Given `eliminate=false`, Then Delete is disabled and no request is sent.

**S-LOC-15 DETAIL** — Given double-click with details=true, Then all fields including ubigeo are read-only and populated.

**S-LOC-16 CLONE** — Given a selected localidad, When Clone is submitted unchanged, Then a new record with a new id and identical data is created; the original remains.

**S-LOC-17 no physical delete** — Then no UI action or service method performs a physical delete.

**S-LOC-18 composer mock mode** — Given mock mode, Then the catalog service is fixture-backed, loaded by dynamic import, and no HTTP request is made; the same scenarios S-LOC-2, 7, 13 pass.

**S-LOC-19 composer http mode** — Given http mode and valid URL, Then the same scenarios pass against the running mock server.

**S-LOC-20 composer invalid config** — Given invalid mode or missing URL, Then composition throws a configuration error before any request.
