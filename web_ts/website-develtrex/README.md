# website-develtrex

Website de prueba para consumir `jona-ui` usando arquitectura JONA + Feature Based.

Consume la libreria local `jona-ui` por ruta (`"jona-ui": "file:../uijona"`), no la version de npm.

## Requisito previo: compilar `jona-ui`

`npm install` crea un **symlink** a `../uijona`, que lee su carpeta `dist/`. Como `dist/` no esta versionado, **hay que compilar la libreria antes** de instalar o levantar este proyecto:

```bash
cd ../uijona
npm install
npm run build
```

Si cambias codigo de la libreria, recompilala en `../uijona` (`npm run build`) para que este proyecto vea los cambios.

## Desarrollo

```bash
npm install
npm run dev
```

Arranca Vite en `http://localhost:5173/` (o el puerto libre que elija).

## Build para GitHub Pages

```bash
npm run build       # corre `tsc` (typecheck) + `vite build` -> dist/
npm run preview     # sirve el dist/ compilado para revisarlo localmente
```

El proyecto usa `base: './'` en Vite, por lo que el contenido de `dist/` puede publicarse como GitHub Pages desde una rama o workflow.

## Puesta en marcha desde cero (resumen)

```bash
# 1) Compilar la libreria
cd web_ts/uijona && npm install && npm run build

# 2) Levantar el sitio
cd ../website-develtrex && npm install && npm run dev
```
