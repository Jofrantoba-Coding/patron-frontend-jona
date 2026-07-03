# showcase-uijona

Showcase / playground de la libreria `jona-ui` con editor de codigo en vivo (Monaco). Sirve para explorar los componentes del design system de forma interactiva.

## Stack

- React 18 + TypeScript
- React Router 6
- Vite 5
- `@monaco-editor/react` (editor embebido)
- `jona-ui` (consumido desde el registro **npm**, no por ruta local)

> A diferencia de `website-develtrex` (que usa `jona-ui` con `file:../uijona`), este showcase depende de la version **publicada** en npm (`"jona-ui": "^1.2.4"`). No requiere compilar `../uijona` antes; `npm install` la descarga del registro. Para probar cambios locales de la libreria, cambia la dependencia a `"jona-ui": "file:../uijona"` y recompila `../uijona`.

## Puesta en marcha

Desde `web_ts/showcase_uijona`:

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

## Build

```bash
npm run build
npm run preview
```

`dist/` es salida de build y esta en `.gitignore`; se regenera con `npm run build`. Este proyecto es privado (`"private": true`), no se publica en npm.
