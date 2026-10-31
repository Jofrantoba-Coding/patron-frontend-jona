# JONA para arquitectos

**Joint Orchestrated N-layer Architecture**: intención, forma y decisiones de un patrón de diseño para interfaces de usuario multiplataforma.

*Jonathan Franchesco Torres Baca*

---

## A quién está dirigido

A arquitectos de software y líderes técnicos que necesitan evaluar JONA antes de adoptarlo: qué problema resuelve, qué cuesta, cómo convive con otras metodologías y cuándo no conviene usarlo.

La guía práctica de adopción para equipos es un libro aparte.

---

## Índice

| # | Capítulo | Estado |
|---|---|---|
| 1 | [Qué busca JONA](capitulos/01-que-busca-jona.md) | Borrador |
| 2 | [Anatomía: el núcleo invariante, las formas del patrón y su glosario](capitulos/02-anatomia.md) | Borrador |
| 3 | [Contratos: capacidades, datos, eventos y valores por defecto](capitulos/03-contratos.md) | Borrador |
| 4 | [Herencia y composición: el patrón en web, escritorio, móvil y motores de juego](capitulos/04-herencia-y-composicion.md) | Borrador |
| 5 | [Roles y flujo de trabajo: diseño, frontend e integración en paralelo](capitulos/05-roles-y-flujo.md) | Borrador |
| 6 | [JONA junto a Atomic Design, FSD y Clean/Hexagonal](capitulos/06-atomic-fsd-hexagonal.md) | Borrador |
| 7 | [JONA frente a MVC, MVP, MVVM y contenedor-presentacional](capitulos/07-mvc-mvp-mvvm.md) | Borrador |
| 8 | [Sistemas de diseño con JONA: tokens, temas, accesibilidad y versionado](capitulos/08-sistemas-de-diseno.md) | Borrador |
| 9 | [Verificación y gobierno: cómo comprobar el patrón de forma automática](capitulos/09-verificacion-y-gobierno.md) | Borrador |
| 10 | [Decisiones y compromisos: cuándo usar JONA y cuándo no](capitulos/10-decisiones-y-compromisos.md) | Borrador |
| 11 | [Migración: de código heredado a JONA y entre tecnologías](capitulos/11-migracion.md) | Borrador |
| 12 | [Evolución del patrón y antipatrones](capitulos/12-evolucion-y-antipatrones.md) | Borrador |
| A | [Glosario](capitulos/apendice-a-glosario.md) | Borrador |
| B | [Cómo ejecutar los ejemplos](ejemplos/README.md) | Borrador |
| C | [Referencias](capitulos/apendice-c-referencias.md) | Borrador |

---

## Estructura

```
jona-para-arquitectos/
├── capitulos/     # un archivo Markdown por capítulo
├── ejemplos/      # un mismo caso (inicio de sesión) por tecnología; ver apéndice B
└── herramientas/  # verificaciones del propio libro: diagramas, catálogo de antipatrones y enlaces
```

Los ejemplos se mantienen dentro de esta carpeta, independientes del resto del repositorio. Cada uno compila y tiene sus pruebas, y un solo comando (`npm run all` en `ejemplos/`) los ejecuta todos, de modo que un ejemplo roto se detecte de inmediato. Por ahora cubren el inicio de sesión; los casos de alta, baja y modificación se agregarán con los capítulos que los necesiten.

---

## Cómo leer este libro

Las convenciones visuales son las mismas en todos los capítulos:

| Elemento | Qué significa |
|---|---|
| **Figura N.k** | Un diagrama (Mermaid) con una leyenda que dice qué mirar. Se ve en GitHub y en la vista previa de VS Code. |
| > **Importante** | La regla central del capítulo. |
| > **Nota** / **Consejo** / **Advertencia** / **Precaución** | Una aclaración, una práctica recomendada, un riesgo o un error que cuesta caro. |
| Nodo rojo / nodo verde | Lo que no se debe hacer / lo que se debe hacer. Nodo azul: un doble de prueba. Nodo ámbar: una etapa lenta o externa. |
| 🔴 🟠 🟡 | Gravedad de un antipatrón: el patrón pierde su promesa central · se degrada · queda parcial o mide otra cosa. |
| ❌ **Así no** / ✅ **Así sí** | El mismo caso, mal y bien, en cada ficha de antipatrón. |

Las salidas de consola que aparecen en el texto son reales: se copiaron de ejecutar los ejemplos. La sintaxis de todos los diagramas se verifica con `herramientas/diagramas` (`npm test`), y el ejecutor general de los ejemplos la incluye como un paso más.
