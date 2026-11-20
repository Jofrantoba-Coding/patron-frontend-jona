# Apéndice C. Referencias

Las fuentes que el libro cita, agrupadas por tema. Cada entrada indica en qué capítulos aparece. Los enlaces se comprobaron el 31 de octubre de 2026, y los que agregaron los capítulos 15 y 16, el 19 de noviembre de 2026. Medium, npm y ResearchGate rechazan las comprobaciones automáticas, así que esos enlaces se verificaron de otra manera: `jona-ui` en el registro de npm, el artículo de THC-C en el canal RSS de su autor, el artículo de 2024 en su copia en PDF y el de Abramov en su copia archivada en web.archive.org. Las especificaciones y herramientas se citan en la versión que usan los ejemplos cuando esa versión importa.

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

- **Frost, Brad** (2016). *Atomic Design*. <https://atomicdesign.bradfrost.com/> · Capítulos 6, 12, 13, 14, 15, 16.
- **Feature-Sliced Design**. Documentación de la metodología. <https://feature-sliced.design/> · Capítulos 6, 14.
- **Cockburn, Alistair** (2005). *Hexagonal Architecture* (puertos y adaptadores). <https://alistair.cockburn.us/hexagonal-architecture/> · Capítulos 1, 6, 14, 15.
- **Martin, Robert C.** (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall · Capítulos 6, 14.

## BFF y renderizado en el servidor

- **Newman, Sam** (2015, 18 de noviembre). *Pattern: Backends For Frontends*. Un BFF por tipo de cliente («una experiencia, un BFF»), agregación y degradación ante fallos. <https://samnewman.io/patterns/architectural/bff/> · Capítulo 15.
- **React**: `renderToString`, con sus límites y las alternativas de *streaming*. <https://react.dev/reference/react-dom/server/renderToString> · `renderToPipeableStream`: <https://react.dev/reference/react-dom/server/renderToPipeableStream> · Capítulos 15, 16.
- **React**: `hydrateRoot`, `onRecoverableError` y las diferencias de hidratación. <https://react.dev/reference/react-dom/client/hydrateRoot> · Capítulos 15, 16.
- **React**: los componentes `<title>` y `<meta>`, que React coloca en la cabeza del documento desde cualquier componente. <https://react.dev/reference/react-dom/components/title> · <https://react.dev/reference/react-dom/components/meta> · Capítulo 16.
- **React**: `'use client'` y los tipos serializables entre componentes de servidor y de cliente. <https://react.dev/reference/rsc/use-client> · Capítulo 15.
- **Vite**: guía de renderizado en el servidor; compilaciones del cliente y del servidor, y dependencias enlazadas. <https://vite.dev/guide/ssr> · Capítulo 15.
- **Next.js 16** (App Router): *Server and Client Components*, con `'use client'` y `server-only` <https://nextjs.org/docs/app/getting-started/server-and-client-components> · *Mutating Data*, con `'use server'` <https://nextjs.org/docs/app/getting-started/mutating-data> · `headers` <https://nextjs.org/docs/app/api-reference/functions/headers> · Capítulo 15.
- **React Router 8** (modo *framework*): *Data Loading* <https://reactrouter.com/start/framework/data-loading> · *Actions* <https://reactrouter.com/start/framework/actions> · *Route Module* <https://reactrouter.com/start/framework/route-module> · módulos `.server` <https://reactrouter.com/api/framework-conventions/server-modules> · `LoaderFunctionArgs` <https://api.reactrouter.com/v7/interfaces/react-router.LoaderFunctionArgs.html> · Capítulo 15.

## Buscadores y rendimiento web

Lo que el capítulo 16 afirma sobre cómo trata Google una página sale de estas guías de Google Search Central, consultadas el 19 de noviembre de 2026.

- **Google Search Central**: *Understand JavaScript SEO Basics*. Las tres fases (rastreo, renderizado e indexación), la cola de renderizado, por qué renderizar en el servidor o prerenderizar (no todos los bots ejecutan JavaScript), `noindex` en el HTML original y el soft 404 en aplicaciones de una sola página. <https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics> · Capítulo 16.
- **Google Search Central**: *SEO Link Best Practices for Google*. Google rastrea, en general, los enlaces que son `<a>` con `href`; ejemplos con `javascript:` y `onclick`. <https://developers.google.com/search/docs/crawling-indexing/links-crawlable> · Capítulo 16.
- **Google Search Central**: *How to Specify a Canonical with rel="canonical" and Other Methods*. Rutas absolutas en `rel="canonical"`; no usar `noindex` para elegir la canónica; las URL del sitemap se sugieren como canónicas. <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls> · Capítulo 16.
- **Google Search Central**: *URL Structure Best Practices for Google Search*. El manejo de URL distingue mayúsculas: `/APPLE` y `/apple` son URL distintas. <https://developers.google.com/search/docs/crawling-indexing/url-structure> · Capítulo 16.
- **Google Search Central**: *Robots Meta Tags Specifications*. `noindex`, `nofollow`, y por qué una página bloqueada en robots.txt no aplica sus reglas de indexación. <https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag> · Capítulo 16.
- **Google**: *How HTTP Status Codes Affect Google's Crawlers*, en la documentación de la infraestructura de rastreo (la dirección anterior en Search Central redirige aquí). Google no indexa las URL que responden `4xx`; una respuesta `2xx` con contenido de error aparece como soft 404. <https://developers.google.com/crawling/docs/troubleshooting/http-status-codes> · Capítulo 16.
- **Google Search Central**: *Build and Submit a Sitemap*. URL completas y absolutas, solo las que se quieren ver en los resultados, y la línea `Sitemap:` en robots.txt. <https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap> · Capítulo 16.
- **Google Search Central**: *Influencing Title Links in Google Search* <https://developers.google.com/search/docs/appearance/title-link> y *How to Write Meta Descriptions* <https://developers.google.com/search/docs/appearance/snippet>. Títulos y descripciones distintos por página · Capítulo 16.
- **Google Search Central**: *Image SEO Best Practices*. El texto alternativo como el atributo más importante de una imagen. <https://developers.google.com/search/docs/appearance/google-images> · Capítulo 16.
- **Google Search Central**: *How To Add Product Snippet Structured Data*. Propiedades obligatorias y recomendadas de `Product` y `Offer`: `price`, `priceCurrency`, `availability`. <https://developers.google.com/search/docs/appearance/structured-data/product-snippet> · Capítulo 16.
- **schema.org**: `Product` <https://schema.org/Product> · `Offer` <https://schema.org/Offer> · `ItemList` <https://schema.org/ItemList> · Capítulo 16.
- **The Open Graph protocol**. Las propiedades `og:type`, `og:title`, `og:description`, `og:url` y `og:image`. <https://ogp.me/> · Capítulo 16.
- **web.dev**: *Web Vitals* (LCP, INP y CLS, y medición de campo frente a laboratorio) <https://web.dev/articles/vitals> · *Largest Contentful Paint (LCP)* <https://web.dev/articles/lcp> · *Optimize resource loading with the Fetch Priority API* <https://web.dev/articles/fetch-priority> · *Browser-level image lazy loading for the web* <https://web.dev/articles/browser-level-image-lazy-loading> · *Optimize Cumulative Layout Shift* <https://web.dev/articles/optimize-cls> · Capítulo 16.
- **MDN**: el elemento `<img>`, con los atributos `alt`, `loading` y `fetchpriority`. <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img> · Capítulo 16.
- **Herramientas que complementan la auditoría**: Lighthouse <https://developer.chrome.com/docs/lighthouse/overview> · la herramienta de inspección de URL de Search Console <https://support.google.com/webmasters/answer/9012289> · la prueba de resultados enriquecidos de Google <https://search.google.com/test/rich-results> · Capítulo 16.

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

- **W3C** (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. Razón de contraste mínima 4,5:1 para texto y 3:1 para componentes. <https://www.w3.org/TR/WCAG22/> · Capítulos 8, 13.
- **axe-core**. Motor de reglas de accesibilidad de Deque. <https://github.com/dequelabs/axe-core> · Capítulos 8, 13, 16.
- **Storybook**. <https://storybook.js.org/> · Capítulos 2, 6, 8, 13.

## Herramientas de verificación de arquitectura

- **ArchUnit** (Java). <https://www.archunit.org/> · Capítulo 9.
- **ArchUnitNET** (.NET). <https://github.com/TNG/ArchUnitNET> · Capítulo 9.
- **NetArchTest** (.NET). <https://github.com/BenMorris/NetArchTest> · Capítulo 9.
- **dependency-cruiser** (JavaScript y TypeScript). <https://github.com/sverweij/dependency-cruiser> · Capítulo 9.
- **Konsist** (Kotlin). <https://github.com/LemonAppDev/konsist> · Capítulo 9.
- **API del compilador de TypeScript**. <https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API> · Capítulos 6, 9, 12, 13, 14, 15, 16.
- **CODEOWNERS** en GitHub. <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners> · Capítulo 9.

## Otras herramientas usadas en los ejemplos

- **Mermaid**, para los diagramas del libro. <https://mermaid.js.org/> · Todos los capítulos.
- **esbuild**, para medir el empaquetado en el capítulo 12. <https://esbuild.github.io/> · Capítulo 12.
- **Node.js: módulos y paquetes**. El campo `exports` de `package.json` y la resolución de módulos ES, que exige rutas completas. <https://nodejs.org/api/packages.html> · Capítulo 13.
- **TypeScript: referencia de módulos**. Las opciones `moduleResolution` `bundler` y `NodeNext`. <https://www.typescriptlang.org/docs/handbook/modules/reference.html> · Capítulo 13.
- **Vitest** y el ejecutor de pruebas de **Node.js** (`node:test`), en los ejemplos web. <https://vitest.dev/> · <https://nodejs.org/api/test.html> · Apéndice B.
