# electron

Ejemplo del capítulo 4: el renderizador usa la forma mínima de React. El proceso principal atiende el canal `auth:login` con `AuthServiceHttp` contra el servidor mock; el *preload* expone el canal como `window.authIpc`; el adaptador `createAuthServiceIpc`, en el renderizador, reconstruye el `ApiError` (el capítulo 4 explica por qué no en el *preload*).

```bash
npm ci
npm run mock      # terminal 1: el servidor mock
npm start         # terminal 2: compila y abre la aplicación (API_URL=<url> para otro servidor)
npm test          # sin Electron: manejador, preload y adaptador con dobles, y la suite de contrato sobre la cadena
```

Electron no se instala aparte: es una dependencia de desarrollo del ejemplo. `npm ci` descarga su binario (unos 100 MB) la primera vez y lo guarda en la caché del usuario. `npm run build` verifica los tipos, compila el renderizador con Vite y empaqueta el proceso principal y el *preload* con `build-electron.mjs`.

## Qué hay

| Pieza | Archivo |
|---|---|
| Contrato de IPC: el canal, sus argumentos y su respuesta | `src/shared/ipcContract.ts` |
| Proceso principal y manejador del canal | `src/main/main.ts`, `src/main/loginHandler.ts` |
| *Preload* | `src/preload/preload.ts` |
| Adaptador IPC del renderizador | `src/renderer/services/AuthServiceIpc.ts` |
| Unidad de inicio de sesión (forma mínima) | `src/renderer/uilogin/` |
| Contrato de servicio, `ApiError`, adaptador HTTP, servicio falso y suite de contrato | `src/shared/services/` |

`src/ipcChain.test.ts` corre la suite de contrato sobre la cadena completa sin Electron (adaptador IPC, manejador del proceso principal y servicio), una vez con el servicio falso y otra con el adaptador HTTP contra el servidor mock, que arranca `test/mockServer.globalSetup.ts`. Con `CONTRATO_API_URL=<url>`, la cadena con el adaptador HTTP corre contra ese servidor.
