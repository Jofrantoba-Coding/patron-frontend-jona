# Evolución: nomenclatura anterior y el derivado THC/THC-C

Ejemplo del capítulo 12 («Evolución del patrón y antipatrones»). Dos partes, cada una con pruebas que muestran un efecto observable.

## Cómo correrlo

Requiere Node 22.

```bash
npm ci
npm test        # compila con tsc y corre node --test sobre dist/
```

## Parte 1: `nomenclatura/`, el mismo código con dos nomenclaturas

Las implementaciones de referencia más antiguas del repositorio (por ejemplo `web_ts/appjona_codex_react_hooks`) usan una nomenclatura anterior a la del capítulo 2:

| Rol | Anterior | Canónica |
|---|---|---|
| Orquestador: instancia la Implementación y se la entrega al render | `UiIniciarSesionView` | `UiIniciarSesion` (entrada) |
| Render puro | `UiIniciarSesion` | `UiIniciarSesionView` |
| Modelo base | `UiIniciarSesionTemplateModel` (`useUiIniciarSesion`) | `UiIniciarSesionBase` (`useUiIniciarSesionBase`) |
| Contrato, Implementación, props | `InterUiIniciarSesion`, `UiIniciarSesionImpl`, `UiIniciarSesionProps` | sin cambios |

`antes/` es una reconstrucción mínima, sin framework, con la misma estructura que la aplicación real. `despues/` es el mismo código con los archivos e identificadores renombrados según `mapeo.json` (orquestador y render intercambian nombres: los renombres se aplican a la vez, no en cadena).

Lo que prueban `test/nomenclatura.test.ts`:

- El verificador canónico (copia de `gobierno/ts`) informa en `antes/` una sola violación, N4 en `App.ts`, y sugiere como «entrada» el render: el mensaje engaña por los nombres, no por la estructura.
- En `despues/` no informa nada.
- `mapeo.json` aplicado a la lista de archivos de `antes/` da la de `despues/`, y cada archivo, normalizado con el mapeo, es idéntico a su par. Las dos aplicaciones producen la misma salida. El cambio es solo de nombres.
- Caso real, solo lectura: en `web_ts/appjona_codex_react_hooks/src` el verificador produce el mismo mensaje (`App.tsx` importa `UiHomeView.tsx`; «use su entrada: `UiHome.tsx`», que es el render). Si esa carpeta no existe, la prueba se omite.

## Parte 2: `thc-c/`, observaciones sobre THC/THC-C

THC/THC-C es un derivado externo de JONA: Harol Rodriguez, «Patrón THC / THC-C», Medium, 21-03-2026, <https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921>. `thc-c/` no copia el artículo: es una reconstrucción para análisis con los mismos tipos (`ApiResponse<T>`, `ApiErrorResponse`, `Cuenta`), la misma estructura de módulos (variante B: servicio real, mock, `composer.ts`, `composeConfig.ts`, fixtures por escenario) y el mismo hook, sin React.

| Observación | Prueba | Qué se ve |
|---|---|---|
| 1. El fixture `emailDuplicado` agrega `code`, que `ApiErrorResponse` no declara | `thc-tipos.test.ts` | `tsc` lo rechaza: TS2353 (exceso de propiedad) |
| 2. El Test Plan pide `503 EMAIL_SERVICE_UNAVAILABLE`, pero 503 no está en la unión de `status` | `thc-tipos.test.ts` | `tsc` lo rechaza: TS2322 |
| 3. El Composer importa de forma estática el mock y el servicio real | `thc-bundle.test.ts` | Con `useMock: false`, esbuild deja el mock en la entrada y publica los fixtures (también el que no compila). Con `import()` dinámico, como en `web_ts/softcommerce/src/services/serviceComposer.ts`, la entrada no lleva ni el mock ni los fixtures |
| 4. El fixture lleva `status` en el cuerpo; el servicio real devuelve `response.json()` | `thc-asimetria.test.ts` | Ante un backend que pone el código en la respuesta HTTP, `result.status` es `undefined`: un 409 cae en error por casualidad y un 201 exitoso se trata como error |
| 5. El hook decide con `result.status === 200 \|\| result.status === 201` y lee `result.error` | `thc-tipos.test.ts` | Tal como está escrito, no compila: TS2339. El hook ejecutable usa el cast que el artículo escribe en su variante con TanStack Query |

Los dos fixtures que no compilan (`fixtures/emailDuplicado`, `fixtures/emailServiceUnavailable`) quedan fuera de `tsconfig.json`: las pruebas los compilan aparte con la API del compilador.

## Otras pruebas

`test/copias.test.ts` verifica que `herramientas/jona-check.ts` y `herramientas/deuda.ts` son idénticos a los de `gobierno/ts/herramientas` (una sola implementación de las reglas, copias vigiladas).
