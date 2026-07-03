# app_jona_systemdesign_react_hooks

Variante del patron JONA en React con hooks, orientada a **System Design**: separa contrato, implementacion y vista, y compone la UI con utilidades de diseno (Tailwind + `clsx`/`tailwind-merge`) e iconos (`lucide-react`).

## Stack

- React 18 + TypeScript
- React Router 6
- Vite 5
- Tailwind CSS (via PostCSS)

## Puesta en marcha

Desde `web_ts/app_jona_systemdesign_react_hooks`:

```bash
npm install
npm run dev        # servidor de desarrollo Vite (http://localhost:5173)
```

## Scripts

| Script | Que hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR. |
| `npm run build` | `tsc` (typecheck) + `vite build` -> `dist/`. |
| `npm run preview` | Sirve el `dist/` compilado para revisarlo localmente. |
| `npm run lint` | ESLint sobre `.ts`/`.tsx` (0 warnings permitidos). |

## Build

```bash
npm run build
npm run preview
```

`dist/` es salida de build y esta en `.gitignore`; se regenera con `npm run build`. Este proyecto es privado (`"private": true`), no se publica en npm.
