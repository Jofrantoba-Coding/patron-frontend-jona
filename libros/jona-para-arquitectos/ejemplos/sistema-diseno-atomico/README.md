# sistema-diseno-atomico

Ejemplo del capítulo 13: un sistema de diseño construido nivel por nivel con Atomic Design, donde cada componente es una unidad JONA. Tres átomos, dos moléculas, dos organismos y una disposición, más las pruebas que sostienen las reglas entre niveles. La aplicación del capítulo 14 (`../aplicacion-catalogo`) lo consume como paquete.

```bash
npm ci
npm run build   # tsc: comprueba src y test, y emite dist/ con NodeNext
npm test        # vitest (paquete.test.ts necesita dist/)
```

## Qué hay

| Nivel | Unidad | Qué resuelve que el nivel anterior no resolvía |
|---|---|---|
| Tema | `src/tema/tokens.css`, `src/tema/clasesToken.ts` | Roles de color y escala de espaciado (capítulo 8) |
| Átomos | `JButton`, `JInput`, `JText` | Un elemento con su rol y su accesibilidad mínima |
| Moléculas | `JField`, `JSearchBox` | Asociar etiqueta, ayuda y error; guardar el borrador de una búsqueda |
| Organismos | `JTable`, `JConfirmDialog` | Una tabla de filas de cualquier tipo; el foco y el teclado de un diálogo |
| Disposiciones | `JPageLayout` | La estructura de una página, con huecos en lugar de datos |

Cada unidad tiene la misma anatomía (forma mínima, variante b): `Inter*.ts`, `*Impl.tsx`, `*View.tsx`, la entrada y `index.ts`. Ninguna tiene contrato de servicio.

| Prueba | Qué protege |
|---|---|
| `test/niveles/niveles.test.ts` | Las cuatro reglas entre niveles, cada una con su árbol de violación |
| `test/patron.test.ts` | La anatomía JONA en todos los niveles y los DEFAULTS sin estado |
| `test/tokens.test.ts` | Las vistas pintan solo con `clasesToken` |
| `test/contraste.test.ts` | Contraste WCAG de los pares semánticos en claro, oscuro y sistema oscuro |
| `test/superficie.test.ts` | La superficie pública: entradas, contratos y DEFAULTS, nada más |
| `test/paquete.test.ts` | Node carga el paquete compilado por su nombre; una ruta interna falla |
| `test/atomos.test.tsx` … `test/disposiciones.test.tsx` | El comportamiento de cada nivel y axe-core |
| `test/demo.test.tsx` | Una pantalla entera solo con el sistema de diseño, sin servicios |

## Las reglas entre niveles

1. **Dirección de niveles.** Un nivel solo importa niveles inferiores (y `tema`). Dos unidades del mismo nivel no se importan: componerlas es el trabajo del nivel siguiente.
2. **Solo por la entrada.** Otra unidad se usa por su `index.ts`, nunca por su vista o su Implementación.
3. **Sin dependencias del sistema.** Ningún paquete fuera de React, y ningún `fetch`, `localStorage` ni conexión: la unidad expone manejadores.
4. **Contrato propio.** Un `Inter*.ts` no importa contratos de otras unidades: si los heredara, cada cambio de un átomo rompería también a la molécula.
