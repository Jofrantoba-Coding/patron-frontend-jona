# Apéndice C. Referencias

Las fuentes que el libro cita, agrupadas por tema. Cada entrada indica en qué capítulos aparece. Los enlaces se comprobaron el 31 de octubre de 2026. Medium, npm y ResearchGate rechazan las comprobaciones automáticas, así que esos enlaces se verificaron de otra manera: `jona-ui` en el registro de npm, el artículo de THC-C en el canal RSS de su autor, el artículo de 2024 en su copia en PDF y el de Abramov en su copia archivada en web.archive.org. Las especificaciones y herramientas se citan en la versión que usan los ejemplos cuando esa versión importa.

---

## Fuentes del patrón

- **Torres Baca, Jonathan Franchesco** (2024, 22 de mayo). *El Patrón de Diseño JONA para el Desarrollo Frontend*. ResearchGate. La definición fundacional: Interfaz, Clase Plantilla y Clase de Implementación. <https://www.researchgate.net/publication/380760595_El_Patron_de_Diseno_JONA_para_el_Desarrollo_Frontend_-_jofrantoba> · Capítulos 1, 2, 12.
- **Repositorio del patrón JONA**: implementaciones de referencia, `uijona`, `softcommerce` y los ejemplos de este libro. <https://github.com/Jofrantoba-Coding/patron-frontend-jona> · Todos los capítulos.
- **`jona-ui`**, la biblioteca de componentes del patrón, publicada en npm (versión 1.6.0, 31 de octubre de 2026). <https://www.npmjs.com/package/jona-ui> · Capítulos 6, 8, 12.
- **Rodriguez, Harol** (2026, 21 de marzo). *Patrón THC / THC-C*. Medium. Primer derivado externo de JONA. <https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921> · Repositorio: <https://github.com/Graphene-Labs/thc-pattern> · Capítulos 1, 5, 12.

## Patrones de presentación

- **Reenskaug, Trygve** (1979). Notas sobre *Model-View-Controller*, Xerox PARC. La página donde el autor las recopiló ya no está en línea; copia archivada: <https://web.archive.org/web/20191116101725/http://folk.uio.no/trygver/themes/mvc/mvc-index.html> · Capítulo 7.
- **Potel, Mike** (1996). *MVP: Model-View-Presenter. The Taligent Programming Model for C++ and Java*. Taligent, Inc. · Capítulo 7.
- **Fowler, Martin** (2004). *Presentation Model*. <https://martinfowler.com/eaaDev/PresentationModel.html> · Capítulo 7.
- **Fowler, Martin** (2006). *GUI Architectures*. <https://martinfowler.com/eaaDev/uiArchs.html> · Con *Passive View* (<https://martinfowler.com/eaaDev/PassiveScreen.html>) y *Supervising Controller* (<https://martinfowler.com/eaaDev/SupervisingPresenter.html>) · Capítulo 7.
- **Gossman, John** (2005, 8 de octubre). *Introduction to Model/View/ViewModel pattern for building WPF apps*. Blog de Microsoft (MSDN) · Capítulo 7.
- **Abramov, Dan** (2015). *Presentational and Container Components*. Medium; con la nota agregada por el autor en 2019. <https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0> · Capítulo 7.
- **Gamma, Erich; Helm, Richard; Johnson, Ralph; Vlissides, John** (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley. *Template Method* · Capítulo 7.

## Arquitectura y organización del código

- **Frost, Brad** (2016). *Atomic Design*. <https://atomicdesign.bradfrost.com/> · Capítulos 6, 12.
- **Feature-Sliced Design**. Documentación de la metodología. <https://feature-sliced.design/> · Capítulo 6.
- **Cockburn, Alistair** (2005). *Hexagonal Architecture* (puertos y adaptadores). <https://alistair.cockburn.us/hexagonal-architecture/> · Capítulos 1, 6.
- **Martin, Robert C.** (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall · Capítulo 6.

## Evolución, verificación y migración

- **Ford, Neal; Parsons, Rebecca; Kua, Patrick** (2017). *Building Evolutionary Architectures*. O'Reilly. Funciones de aptitud · Capítulo 9.
- **Feathers, Michael** (2004). *Working Effectively with Legacy Code*. Prentice Hall. Pruebas de caracterización y costuras · Capítulo 11.
- **Fowler, Martin** (2004). *StranglerFigApplication*. <https://martinfowler.com/bliki/StranglerFigApplication.html> · Capítulo 11.
- **Nygard, Michael** (2011, 15 de noviembre). *Documenting Architecture Decisions*. Origen de los registros de decisión de arquitectura (ADR). <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions> · Capítulos 9, 10.

## Contratos, versiones y pruebas de aceptación

- **OpenAPI Specification 3.1.0**. OpenAPI Initiative. <https://spec.openapis.org/oas/v3.1.0> · Capítulos 3, 5, 9.
- **Gherkin**. Referencia del lenguaje. <https://cucumber.io/docs/gherkin/reference/> · Capítulo 5.
- **Pact**. Contratos guiados por el consumidor. <https://docs.pact.io/> · Capítulo 9.
- **oasdiff**. Comparador de especificaciones OpenAPI. <https://github.com/oasdiff/oasdiff> · Capítulo 9.
- **Semantic Versioning 2.0.0**. <https://semver.org/> · Capítulos 3, 8.
- **Keep a Changelog 1.1.0**. <https://keepachangelog.com/en/1.1.0/> · Capítulos 3, 8.

## Sistemas de diseño y accesibilidad

- **W3C** (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. Razón de contraste mínima 4,5:1 para texto y 3:1 para componentes. <https://www.w3.org/TR/WCAG22/> · Capítulo 8.
- **axe-core**. Motor de reglas de accesibilidad de Deque. <https://github.com/dequelabs/axe-core> · Capítulo 8.
- **Storybook**. <https://storybook.js.org/> · Capítulos 2, 6, 8.

## Herramientas de verificación de arquitectura

- **ArchUnit** (Java). <https://www.archunit.org/> · Capítulo 9.
- **ArchUnitNET** (.NET). <https://github.com/TNG/ArchUnitNET> · Capítulo 9.
- **NetArchTest** (.NET). <https://github.com/BenMorris/NetArchTest> · Capítulo 9.
- **dependency-cruiser** (JavaScript y TypeScript). <https://github.com/sverweij/dependency-cruiser> · Capítulo 9.
- **Konsist** (Kotlin). <https://github.com/LemonAppDev/konsist> · Capítulo 9.
- **API del compilador de TypeScript**. <https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API> · Capítulos 6, 9, 12.
- **CODEOWNERS** en GitHub. <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners> · Capítulo 9.

## Otras herramientas usadas en los ejemplos

- **Mermaid**, para los diagramas del libro. <https://mermaid.js.org/> · Todos los capítulos.
- **esbuild**, para medir el empaquetado en el capítulo 12. <https://esbuild.github.io/> · Capítulo 12.
- **Vitest** y el ejecutor de pruebas de **Node.js** (`node:test`), en los ejemplos web. <https://vitest.dev/> · <https://nodejs.org/api/test.html> · Apéndice B.
