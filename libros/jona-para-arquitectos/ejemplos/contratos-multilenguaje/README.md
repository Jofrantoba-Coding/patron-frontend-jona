# contratos-multilenguaje

Ejemplo del capítulo 1: el contrato de capacidades `InterUiLogin`, con una implementación mínima (`UiLoginDemo`) y una prueba en TypeScript, Kotlin y C#.

```bash
cd typescript && npm ci && npm test     # tsc y node --test sobre dist/
cd ../kotlin && mvn test                # JDK 21; kotlin-maven-plugin compila Kotlin, sin kotlinc
cd ../csharp && dotnet test             # .NET 10
```

## Qué hay

| Lenguaje | Contrato | Implementación | Prueba |
|---|---|---|---|
| TypeScript | `typescript/src/InterUiLogin.ts` | `typescript/src/UiLoginDemo.ts` | `typescript/src/UiLoginDemo.test.ts` |
| Kotlin | `kotlin/src/main/kotlin/InterUiLogin.kt` | `kotlin/src/main/kotlin/UiLoginDemo.kt` | `kotlin/src/test/kotlin/UiLoginDemoTest.kt` |
| C# | `csharp/InterUiLogin.cs` | `csharp/UiLoginDemo.cs` | `csharp/UiLoginDemoTests.cs` |

El proyecto C# incluye su propio `NuGet.config`, de modo que no depende de la configuración de NuGet de la máquina.

La versión en Swift del capítulo 1 es ilustrativa: no hay un proyecto Swift porque no se puede verificar en todas las plataformas donde se ejecutan estos ejemplos.
