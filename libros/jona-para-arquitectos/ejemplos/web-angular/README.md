# web-angular

Ejemplo del capítulo 4: la forma clásica de JONA con Angular 21. La Plantilla `UiLoginComponent` y la Implementación `UiLoginImplComponent` comparten `ui-login.component.html`; el servicio llega por el token `AUTH_SERVICE`, que `app.config.ts` asocia con el adaptador HTTP y `environment.apiUrl` (el servidor mock).

```bash
npm ci
npm run mock      # terminal 1: el servidor mock
npm start         # terminal 2: ng serve, en http://localhost:4200
npm test          # ng test: Vitest sobre jsdom, sin navegador
npm run build
```

`ng test` lee `vitest.config.ts`, que arranca el servidor mock para las pruebas HTTP. `angular.json` desactiva la telemetría del CLI, así que `ng` no hace preguntas. Angular CLI no se instala aparte: es una dependencia de desarrollo del ejemplo.

## Qué hay

| Pieza | Archivo |
|---|---|
| Raíz de composición: asocia `AUTH_SERVICE` con el adaptador | `src/app/app.config.ts` |
| URL del servidor | `src/environments/environment.ts` |
| Contrato de UI, Plantilla, Implementación y su HTML compartido | `src/app/uilogin/` |
| Contrato de servicio, token, `ApiError`, adaptador HTTP, servicio falso y suite de contrato | `src/app/services/` |

Con `CONTRATO_API_URL=<url>`, la suite del adaptador HTTP corre contra ese servidor y se omite la prueba del escenario `errorServidor`.
