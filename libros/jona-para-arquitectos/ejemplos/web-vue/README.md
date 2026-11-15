# web-vue

Ejemplo del capítulo 4: Vue 3 con la forma mínima de JONA. El *composable* `useUiLoginImpl` es la Implementación, la vista `UiLoginView.vue` tiene como *props* exactamente `InterUiLogin` y `UiLogin.vue` es la entrada. Vite, Vitest y `@vue/test-utils`.

```bash
npm ci
npm run mock      # terminal 1: el servidor mock
npm run dev       # terminal 2: la aplicación, conectada al servidor mock (.env)
npm test
npm run build     # vue-tsc y vite build
```

`src/main.ts` toma la URL de `VITE_API_URL`; `.env` apunta al servidor mock, y para otro servidor solo cambia esa variable.

## Qué hay

| Pieza | Archivo |
|---|---|
| Raíz de composición | `src/main.ts` |
| Contrato de UI, Implementación (`useUiLoginImpl.ts`), vista y entrada | `src/uilogin/` |
| Contrato de servicio, `ApiError`, adaptador HTTP, servicio falso y suite de contrato | `src/services/` |

`npm test` corre la suite de contrato contra el servicio falso y contra el adaptador HTTP (`test/mockServer.globalSetup.ts` arranca el servidor mock en un puerto libre), y las pruebas de la pantalla y de la vista en `src/uilogin/UiLogin.test.ts`. Con `CONTRATO_API_URL=<url>`, la suite del adaptador HTTP corre contra ese servidor y se omite la prueba del escenario `errorServidor`.
