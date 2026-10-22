# Use-case model — SoftCommerce Web, wave 1

Diagram: [diagrams/uc-model.drawio](diagrams/uc-model.drawio). Traceability: [README.md](README.md#traceability-matrix-use-case--scenario--task).

## System boundary

SoftCommerce Web, wave 1: the React app in `web_ts/softcommerce` (JONA view units, service seam, shell, CRUD templates, Localidad slice). The Node mock server is outside the boundary and acts as a system actor.

## Actors

| Actor | Kind | Description |
|---|---|---|
| Usuario (operador) | Primary, human | Desktop-app operator who logs in, picks a working context and maintains catalogs. Wave 1 audience is demo-grade [ASSUMPTION, proposal]. |
| Servidor mock (API) | Secondary, system | Zero-dependency Node mock server (`mock-server/http/app.js`) that owns the HTTP contract, tenant gate, seed and error shape. In `VITE_API_MODE=mock` its role is played in-process by `AppServicesMock`, which runs the same `mock-server/core` rules on the same seed. |

## Use cases

| ID | Name | Goal | Spec |
|---|---|---|---|
| CU-01 | Iniciar sesión (tenant + credenciales) | Authenticate against a tenant (BdEmpresa) and reach step 2 | [uc-01-iniciar-sesion.md](uc-01-iniciar-sesion.md) |
| CU-02 | Seleccionar contexto de trabajo (empresa, punto de venta, período) | Fix empresa, punto de venta and a valid period, and open the session | [uc-02-seleccionar-contexto.md](uc-02-seleccionar-contexto.md) |
| CU-03 | Navegar menú y abrir formulario (menú, permisos, pestañas) | Find a form in the menu and work on it in a tab with its permissions | [uc-03-navegar-menu-abrir-formulario.md](uc-03-navegar-menu-abrir-formulario.md) |
| CU-04 | Mantener Localidad | List, add, modify, logically delete, view and clone localidades | [uc-04-mantener-localidad.md](uc-04-mantener-localidad.md) |
| CU-04a | Seleccionar Ubigeo en cascada | Pick Departamento → Provincia → Distrito | [uc-04 §CU-04a](uc-04-mantener-localidad.md#cu-04a-seleccionar-ubigeo-en-cascada-include) |
| CU-04b | Seleccionar Empresa | Pick the owning empresa | [uc-04 §CU-04b](uc-04-mantener-localidad.md#cu-04b-seleccionar-empresa-include) |

## Relationships

| From | Relation | To | Why |
|---|---|---|---|
| CU-01 | «include» | CU-02 | Login has two mandatory steps. The session exists only after step 2, and CU-02 is never started on its own (the period is fixed per session). |
| CU-04 | «include» | CU-04a | Every editable Localidad form needs the Ubigeo cascade. |
| CU-04 | «include» | CU-04b | Every editable Localidad form needs the Empresa combo. |
| CU-04 | «extend» | CU-03 | At extension point *formulario abierto*, condition `[formId = mi_localidad]`. CU-03 is complete without CU-04; opening Localidad adds its behavior. |

Usuario and Servidor mock (API) are associated with CU-01, CU-02, CU-03 and CU-04.

## Out of the use-case model

Mock-API infrastructure, the GUI inventory script, the pinned `jona-ui` dependency and template extensibility have no operator goal. They are listed as supporting requirements in [README.md](README.md#supporting--non-use-case-requirements).
