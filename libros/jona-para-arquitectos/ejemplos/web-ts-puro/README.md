# web-ts-puro

Ejemplo del capítulo 4: la forma clásica del artículo de 2024, en TypeScript sin framework. `UiLogin` es una clase que construye el DOM y `UiLoginImpl` la extiende. Vite, TypeScript, Vitest y jsdom.

```bash
npm ci
npm run mock      # terminal 1: el servidor mock
npm run dev       # terminal 2: la aplicación, conectada al servidor mock (.env)
npm test
npm run build
```

`src/main.ts` toma la URL de `VITE_API_URL`; `.env` apunta al servidor mock, y para otro servidor solo cambia esa variable.

## Qué hay

| Pieza | Archivo |
|---|---|
| Raíz de composición | `src/main.ts` |
| Contrato de UI, Plantilla (`UiLogin.ts`) e Implementación (`UiLoginImpl.ts`) | `src/views/uilogin/` |
| Contrato de servicio, `ApiError`, adaptador HTTP, servicio falso y suite de contrato | `src/services/` |
| Navegación que la Implementación recibe | `src/navigation/Navigator.ts` |

`npm test` corre la suite de contrato contra el servicio falso y contra el adaptador HTTP (`test/mockServer.globalSetup.ts` arranca el servidor mock en un puerto libre), y las pruebas de la Plantilla y la Implementación en `src/views/uilogin/UiLogin.test.ts`. Con `CONTRATO_API_URL=<url>`, la suite del adaptador HTTP corre contra ese servidor y se omite la prueba del escenario `errorServidor`.
