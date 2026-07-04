# Mock server · Consola H2H

Mock server de la **Consola H2H de Jofrantoba Consulting TI** (tenant de demostración: **Develtrex**),
para desarrollar y probar las interfaces sin backend real. **Sin dependencias** — solo Node nativo.

> No cifra archivos, no conecta a SFTP/Sterling real, no valida XML/TXT real ni integra Keycloak.
> Simula datos, paginación, transiciones de estado y convenciones de error.

## Arrancar

```bash
cd web_ts/h2h/mock-server
npm start          # node server.js  ·  http://localhost:4010
# o con recarga:
npm run dev
```

Cambiar puerto: `PORT=5000 npm start`.

Health del propio mock: `GET http://localhost:4010/__mock/health`.

## Convenciones

- Éxitos en JSON; listados con `items` + `pagination` (`?page`, `?pageSize`).
- Errores con `code`, `message`, `details?`, `traceId` (400/404/500).
- Devuelve `X-Correlation-Id` en cada respuesta; CORS abierto para el front local.
- El estado es **en memoria**: crear/generar/acciones muta y persiste hasta reiniciar.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/mock/auth/login` | Login mock (devuelve token + tenant + user) |
| GET | `/v1/me/context` | Tenant, usuario, roles y permisos |
| GET | `/v1/tenants/current` · `/v1/tenants` | Tenant actual · listado backoffice |
| POST | `/v1/tenants` | Crear tenant (mock) |
| GET | `/v1/dashboard/summary` | KPIs, pipeline y alertas |
| GET | `/v1/monitoring/health` | Salud de servicios H2H |
| GET | `/v1/catalogs` · `/v1/catalogs/{catalogo}` | Catálogos |
| GET | `/v1/operaciones` | Listar operaciones (paginado) |
| POST | `/v1/operaciones/manual` · `/v1/operaciones/carga` | Crear manual · carga masiva |
| GET | `/v1/operaciones/{id}` | Detalle |
| PATCH | `/v1/operaciones/{id}/anular` | Anular |
| GET | `/v1/planillas` | Listar planillas |
| POST | `/v1/planillas/generar` | Generar planilla |
| GET | `/v1/planillas/{id}` · `/detalles` · `/preview` | Detalle · detalle operaciones · preview TXT/XML |
| POST | `/v1/planillas/{id}/{validar\|cifrar\|enviar\|reintentar-envio\|cancelar}` | Acciones de ciclo |
| GET | `/v1/respuestas` (`?planillaId=`) | Listar respuestas BCP |
| POST | `/v1/respuestas/cargar-manual` · `/v1/respuestas/{id}/procesar` | Cargar · procesar |
| GET | `/v1/certificados` | Listar certificados/llaves |
| POST | `/v1/certificados` · PATCH `/v1/certificados/{id}/rotar` | Registrar · rotar |
| GET | `/v1/identity/users` · `/roles` · `/v1/rbac/effective-permissions` | Identidad y RBAC |
| GET | `/v1/audit/events` | Auditoría |

## Datos

Todo sale de [`data/mock-data.json`](./data/mock-data.json). Marca blanca:
Jofrantoba Consulting TI (plataforma) · Develtrex (tenant demo).
