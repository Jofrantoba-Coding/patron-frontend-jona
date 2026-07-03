# appjona_vuejs

Implementacion del patron JONA en **Vue 3** con TypeScript: separa contrato, implementacion y vista adaptando la filosofia JONA al modelo de componentes de Vue.

## Stack

- Vue 3 + TypeScript
- Vue Router 4
- Vite 5 (build con `vue-tsc`)

## Puesta en marcha

Desde `web_ts/appjona_vuejs`:

```bash
npm install
npm run dev        # servidor de desarrollo Vite (http://localhost:5173)
```

## Scripts

| Script | Que hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR. |
| `npm run build` | `vue-tsc --build` (typecheck) + `vite build` -> `dist/`. |
| `npm run preview` | Sirve el `dist/` compilado para revisarlo localmente. |

## Build

```bash
npm run build
npm run preview
```

`dist/` es salida de build y esta en `.gitignore`; se regenera con `npm run build`. Este proyecto es privado (`"private": true`), no se publica en npm.
