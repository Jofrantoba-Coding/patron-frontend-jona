# Consola H2H · Jofrantoba Consulting TI

Consola web multi-tenant para operar el flujo **Host-to-Host (H2H) con BCP**: cargar
operaciones de beneficiarios, generar planillas TXT/XML, cifrar/firmar, enviar por SFTP,
procesar respuestas del banco, administrar certificados y RBAC.

Marca blanca: **Jofrantoba Consulting TI** (plataforma) · **Develtrex** (tenant de demostración).

## Estructura

```txt
h2h/
  mock-server/   Mock API runnable (Node nativo, sin deps) — datos y flujos de ejemplo
  console/       App Angular 21 (consume la librería uijona-4ngular)
```

## Arranque rápido (dev)

Dos terminales:

```bash
# 1) Mock API  ·  http://localhost:4010
cd web_ts/h2h/mock-server
npm start

# 2) Consola   ·  http://localhost:4200   (requiere Node >= 22.12 → fnm use)
cd web_ts/h2h/console
npm start
```

Login demo: usuario `m.torres` (cualquier contraseña). El mock devuelve el tenant Develtrex
con rol `H2H_SUPERVISOR` y sus permisos efectivos.

> La consola es **zoneless** (signals) y usa `uijona-4ngular` por dependencia local
> (`file:../../uijona-4ngular/dist/uijona`, enlazada por symlink). Si cambias la librería,
> recompílala (`npm run build` en `uijona-4ngular`) para que la consola vea los cambios.

## Consola — arquitectura

- **Angular 21 standalone + signals**, ruteo lazy, `provideZonelessChangeDetection`.
- UI 100% con **uijona-4ngular** (JSidebarLayout, JCard, JDataTable/JTable, JStatCard,
  JBadge, JButton, JFormField, JOptionPane, JAlert, JChip, JDot…).
- Estilos: `uijona-4ngular/styles/uijona.css` (tokens + reset + CSS de componentes) +
  Tailwind propio (preset de la lib) para utilidades de la app.
- `core/`: `ApiService` (HttpClient + headers `Authorization`/`X-Organizacion-Id`/
  `X-Correlation-Id`/`X-Idempotency-Key`), `SessionService` (token en memoria + contexto +
  permisos), `authGuard`, modelos del dominio.
- Pantallas: Login, Dashboard (KPIs/pipeline/salud), Operaciones, Planillas (ciclo con
  confirmación), Respuestas BCP, Certificados (rotación), Usuarios y RBAC.
- La navegación del sidebar se filtra por **permisos efectivos** (RBAC).

## Mock server

Ver [`mock-server/README.md`](./mock-server/README.md). Implementa todo el contrato de la
consola (auth, dashboard, catálogos, operaciones, planillas, respuestas, certificados,
identidad/RBAC, auditoría) con estado en memoria y transiciones simuladas. Sin dependencias.

## Alcance del mock

No cifra archivos, no conecta SFTP/Sterling real, no valida XML/TXT real ni integra Keycloak.
Permite a UX/UI, frontend y QA trabajar contra contratos y ejemplos estables.
