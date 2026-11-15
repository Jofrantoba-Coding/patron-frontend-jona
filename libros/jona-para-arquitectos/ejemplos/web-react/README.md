# web-react

Ejemplo de referencia de los capítulos 1 a 4: las formas mínima (variantes a y b) y extendida de JONA, con React, el contrato de servicio, su adaptador HTTP, el servicio falso y la suite de contrato de doble fuente. Vite, React, TypeScript, Vitest y Testing Library.

```bash
npm ci
npm run mock      # terminal 1: el servidor mock en http://127.0.0.1:4010
npm run dev       # terminal 2: la aplicación, conectada al servidor mock
npm test          # pruebas (arrancan su propio servidor mock en un puerto libre)
npm run build     # verificación de tipos y compilación
```

`npm run dev` usa el servidor mock por defecto: `.env` define `VITE_API_URL=http://127.0.0.1:4010`. Para conectarse a un backend real solo cambia esa URL (por ejemplo, en un `.env.local`); el resto del código es el mismo. Para ver un error en la pantalla, cambie el escenario del mock con `POST /__mock/scenario` (ver `../mock-server`).

## Qué hay

| Pieza | Archivo |
|---|---|
| Raíz de composición | `src/main.tsx` |
| Forma mínima, variante a | `src/uilogin/` |
| Forma mínima, variante b | `src/jbutton/` |
| Forma extendida, con el modelo base | `src/uiloginextendida/` |
| Contrato de un buscador (solo el contrato, capítulo 3) | `src/jsearchbox/InterJSearchBox.ts` |
| Contrato de servicio, `ApiError`, adaptador HTTP y servicio falso | `src/services/` |
| Suite de contrato de doble fuente | `src/services/authServiceContract.ts` |

Las pruebas incluyen:

- la suite de contrato contra `AuthServiceFake` y contra `AuthServiceHttp` con el servidor mock en ejecución (lo arranca `test/mockServer.globalSetup.ts`);
- las pruebas de la pantalla (`src/loginScreen.test.tsx`), que se ejecutan sobre la forma mínima y sobre la extendida: inicio correcto, datos faltantes, credenciales inválidas, usuario bloqueado, error del servidor, doble envío y error que se limpia al reintentar;
- las reglas puras de la Implementación, el modelo base sin integración y `JButton`.

Para correr la suite de contrato contra otro servidor (por ejemplo, el backend real); la prueba del escenario `errorServidor` se omite, porque solo existe en el servidor mock:

```bash
CONTRATO_API_URL=https://backend.example.com npx vitest run src/services/AuthServiceHttp.test.ts
```
