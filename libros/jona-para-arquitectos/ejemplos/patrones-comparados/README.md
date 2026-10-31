# Patrones comparados: la misma pantalla de login, cinco veces

Ejemplo del capítulo 7 («JONA frente a MVC, MVP, MVVM y contenedor-presentacional»).

La misma pantalla de login está escrita con **MVC**, **MVP**, **MVVM**, **JONA clásica** (Plantilla + Implementación por herencia) y **JONA mínima** (contrato de UI + Implementación + Vista + entrada). Ninguna usa un DOM: `src/comun/pantalla.ts` es un juego mínimo de controles (`TextField`, `Button`, `Label`) con el que se escriben vistas reales.

Dos pruebas sostienen la tesis del capítulo:

- **El comportamiento es idéntico.** `test/loginBehavior.ts` es una sola suite que maneja la pantalla como lo haría una persona (escribe, pulsa, lee el mensaje) y corre contra los cinco patrones, cada uno creado con su propia función pública.
- **Lo que cambia es dónde vive cada decisión.** `test/estructura.test.ts` lee los `import` de `src/` con `ts.preProcessFile` y comprueba, por patrón, quién conoce el servicio, quién conoce los controles, quién importa la vista y quién decide el mensaje. Un fixture acoplado (`test/fixtures/acoplado/`) demuestra que esas reglas sí detectan una violación.

| Patrón | Función de creación |
|---|---|
| MVC | `createMvcLogin(deps)` en `src/mvc/createLogin.ts` |
| MVP | `createMvpLogin(deps)` en `src/mvp/createLogin.ts` |
| MVVM | `createMvvmLogin(deps)` en `src/mvvm/createLogin.ts` |
| JONA clásica | `new UiLoginImpl(deps)`: la Implementación es la entrada |
| JONA mínima | `createUiLogin(deps)` en `src/jona-minima/UiLogin.ts` |

Los textos, los datos de prueba (`ana@ejemplo.com` / `secreta123`, `bloqueado@ejemplo.com`) y el puerto `InterAuthService` son los mismos de `web-react`.

## Cómo correrlo

Requiere Node 22.

```bash
npm ci
npm test      # compila con tsc y corre node --test sobre dist/test
```
