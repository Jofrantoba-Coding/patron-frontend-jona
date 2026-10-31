# sistema-diseno

Ejemplo del capítulo 8: un sistema de diseño mínimo con JONA. Dos átomos (`JButton`, `JCheckbox`), una unidad de modo de tema y las pruebas que lo sostienen: contraste, lint de tokens, patrón JONA, accesibilidad y versionado semántico de la superficie pública. Sin Tailwind ni PostCSS: el CSS es un archivo plano.

```bash
npm ci
npm run build   # tsc: comprueba src, test y scripts, y emite dist/
npm test        # vitest
```

## Qué hay

| Pieza | Archivo |
|---|---|
| Tokens en dos capas (primitiva y semántica) y tema oscuro opcional | `src/tema/tokens.css` |
| Clases de token: lo único con lo que pintan las Vistas | `src/tema/clasesToken.ts` |
| Unidad de modo de tema (`system`, `light`, `dark` en `data-theme-mode`) | `src/tema/InterModoTema.ts`, `src/tema/ModoTemaImpl.ts` |
| Átomos con la forma mínima, variante b | `src/atomos/jbutton/`, `src/atomos/jcheckbox/` |
| Superficie pública | `src/index.ts` |
| Instantánea de la superficie | `api-publica.json` |

| Prueba | Qué protege |
|---|---|
| `test/contraste.test.ts` | Contraste WCAG de los pares semánticos en claro, oscuro y sistema oscuro |
| `test/tokens.test.ts` | Las Vistas no usan colores literales, tokens a mano ni clases sueltas |
| `test/patron.test.ts` | Cada unidad tiene Inter, Impl, View, Entrada e índice; los DEFAULTS no guardan estado |
| `test/a11y.test.tsx` | axe-core sobre el DOM, y un botón solo icono sin `aria-label` no compila |
| `test/version.test.ts` | La versión de `package.json` sube lo que exige el cambio de superficie |

Cada regla tiene su prueba en contra con un fixture de `test/fixtures/`, para que no pase en vacío.

## Decisión: la superficie pública no incluye las Vistas

`src/index.ts` exporta las Entradas, los contratos, los DEFAULTS y la unidad de tema. Las Vistas y `clasesToken` son detalle interno: la aplicación compone los átomos, no los repinta. Así una Vista puede cambiar de marcado o de clases en una versión PATCH sin romper a nadie. La alternativa, publicar las Vistas para que cada aplicación arme su propia Implementación, vuelve parte del contrato todo el marcado y obliga a versionarlo; el capítulo 8 compara ambas opciones.

## Publicar una versión

1. Cambie el código. `npm test` falla si la superficie cambió y la versión de `package.json` no sube lo necesario: MAJOR si se quita una exportación o una propiedad, si una propiedad pasa a obligatoria o cambia de tipo; MINOR si solo se agrega.
2. Suba la versión en `package.json`.
3. Regenere la instantánea con `npm run api:actualizar`. El script se niega si la versión no alcanza.
4. Confirme `package.json` y `api-publica.json` juntos.

El tema oscuro se usa así: `import 'sistema-diseno-ejemplo/tokens.css'` y `new ModoTemaImpl({ modoInicial: 'dark' })`. Sin un `data-theme-mode`, rige el tema claro.
