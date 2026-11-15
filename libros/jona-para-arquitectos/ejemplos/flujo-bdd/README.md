# flujo-bdd

Ejemplo del capítulo 5: el plan de pruebas de la sección 5.3 (`plan/iniciar-sesion.feature`, Gherkin en español) y la verificación de la sección 5.4. No tiene dependencias: un analizador mínimo de Gherkin (`src/gherkin.mjs`) y pruebas con `node:test` que arrancan el servidor mock de `../mock-server` en un puerto libre.

```bash
npm test          # el analizador (test/gherkin.test.mjs) y la trazabilidad (test/trazabilidad.test.mjs)
```

`test/trazabilidad.test.mjs` comprueba la cadena en las dos direcciones:

- **Del plan al servidor mock:** para cada escenario, envía `POST /auth/login` con el usuario de prueba válido y la cabecera `X-Mock-Scenario` de su etiqueta `@mock:<escenario>`, y compara el estado y el código con su línea *Entonces*.
- **Del servidor mock al plan:** cada escenario de `../mock-server/src/datos.mjs` (`ESCENARIOS`) tiene su caso en el plan, y cada etiqueta del plan existe en el servidor mock.

Los mensajes de las líneas "la interfaz muestra" no se comparan aquí con los de la Implementación: viven en código TypeScript y React de `web-react`, que este ejemplo no puede importar sin compilarlo. Las pruebas de pantalla de `web-react` verifican esos mismos textos.
