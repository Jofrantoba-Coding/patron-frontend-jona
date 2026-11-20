# sistema-diseno-atomico

Ejemplo del capítulo 13: un sistema de diseño construido nivel por nivel con Atomic Design, donde cada componente es una unidad JONA. Seis átomos, dos moléculas, dos organismos y una disposición, más las pruebas que sostienen las reglas entre niveles. Lo consumen como paquete la aplicación del capítulo 14 (`../aplicacion-catalogo`) y los catálogos de los capítulos 15 y 16 (`../catalogo-ssr`, `../catalogo-seo`).

La versión 1.1.0 (capítulo 16) agrega los átomos semánticos `JHeading`, `JLink` y `JImage`, la propiedad `name` de `JInput`, y las reglas 5 y 6: la semántica de la página, que un rastreador lee del HTML, es responsabilidad del sistema de diseño. Es un cambio menor: solo agrega exportaciones y propiedades opcionales.

```bash
npm ci
npm run build   # tsc: comprueba src y test, y emite dist/ con NodeNext
npm test        # vitest (paquete.test.ts necesita dist/)
```

## Qué hay

| Nivel | Unidad | Qué resuelve que el nivel anterior no resolvía |
|---|---|---|
| Tema | `src/tema/tokens.css`, `src/tema/clasesToken.ts` | Roles de color y escala de espaciado (capítulo 8) |
| Átomos | `JButton`, `JInput`, `JText`, `JHeading`, `JLink`, `JImage` | Un elemento con su rol y su accesibilidad mínima; los tres últimos, con la semántica obligatoria en el contrato |
| Moléculas | `JField`, `JSearchBox` | Asociar etiqueta, ayuda y error; guardar el borrador de una búsqueda |
| Organismos | `JTable`, `JConfirmDialog` | Una tabla de filas de cualquier tipo; el foco y el teclado de un diálogo |
| Disposiciones | `JPageLayout` | La estructura de una página, con huecos en lugar de datos |

Cada unidad tiene la misma anatomía (forma mínima, variante b): `Inter*.ts`, `*Impl.tsx`, `*View.tsx`, la entrada y `index.ts`. Ninguna tiene contrato de servicio.

| Prueba | Qué protege |
|---|---|
| `test/niveles/niveles.test.ts` | Las cuatro reglas entre niveles, cada una con su árbol de violación |
| `test/semantica/semantica.test.ts` | Las reglas 5 y 6 sobre las vistas, cada una con sus árboles de violación |
| `test/patron.test.ts` | La anatomía JONA en todos los niveles y los DEFAULTS sin estado |
| `test/tokens.test.ts` | Las vistas pintan solo con `clasesToken` |
| `test/contraste.test.ts` | Contraste WCAG de los pares semánticos en claro, oscuro y sistema oscuro |
| `test/superficie.test.ts` | La superficie pública: entradas, contratos y DEFAULTS, nada más |
| `test/paquete.test.ts` | Node carga el paquete compilado por su nombre; una ruta interna falla |
| `test/atomos.test.tsx` … `test/disposiciones.test.tsx` | El comportamiento de cada nivel y axe-core; en los átomos semánticos, directivas `@ts-expect-error` que `npm run build` comprueba (sin `level`, sin `href`, con `href="#"`, sin `alt`, `width` o `height` no compila) |
| `test/demo.test.tsx` | Una pantalla entera solo con el sistema de diseño, sin servicios |

## Las reglas entre niveles

1. **Dirección de niveles.** Un nivel solo importa niveles inferiores (y `tema`). Dos unidades del mismo nivel no se importan: componerlas es el trabajo del nivel siguiente.
2. **Solo por la entrada.** Otra unidad se usa por su `index.ts`, nunca por su vista o su Implementación.
3. **Sin dependencias del sistema.** Ningún paquete fuera de React, y ningún `fetch`, `localStorage` ni conexión: la unidad expone manejadores.
4. **Contrato propio.** Un `Inter*.ts` no importa contratos de otras unidades: si los heredara, cada cambio de un átomo rompería también a la molécula.

## Las reglas de semántica (`test/semantica`)

5. **Los títulos salen de `JHeading`.** Ninguna vista dibuja `<h1>`…`<h6>` a mano ni usa `as="h1"` en otro átomo. `JHeading` exige el nivel y separa el tamaño: un título puede verse pequeño sin bajar de nivel. `JText` conserva `as="h1"` y `as="h2"` por compatibilidad con la 1.0, y el sistema de diseño ya no los usa.
6. **Navegar es un enlace con destino.** Un `<a>` siempre tiene `href`, y no `"#"` ni `javascript:`. Ningún elemento que no sea interactivo (`div`, `tr`, `li`…) lleva `onClick`: para navegar, `JLink`; para actuar, `JButton`.

Las dos se comprueban también en los tipos: `JHeading` sin `level` y `JLink` sin `href` no compilan, y `JLinkHref` (un tipo de plantilla) rechaza `"#"` y `javascript:` y acepta `/productos/${sku}`. `JImage` exige `alt`, `width` y `height`; el `alt` vacío solo existe con `decorativa`, y `prioridad` marca la imagen principal (`loading="eager"` y `fetchpriority="high"`; sin ella, `loading="lazy"`).

