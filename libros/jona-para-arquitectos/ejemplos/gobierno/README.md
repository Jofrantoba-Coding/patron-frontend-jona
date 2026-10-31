# Gobierno: la norma JONA verificada de forma automática

Un catálogo de reglas (`reglas.json`) y tres implementaciones: TypeScript, Java y C#. Cada suite tiene una
prueba que lee el catálogo y falla si una regla no está implementada en ese lenguaje, o si el lenguaje
implementa una regla que el catálogo no tiene. La norma vive en un solo lugar; los lenguajes la cumplen.

## El catálogo

| Id | Regla | Qué se verifica |
|----|-------|-----------------|
| `JONA-N1` | Contratos explícitos | Toda unidad tiene un contrato de UI (`Inter*`). La unidad depende del contrato de servicio (`Inter*Service`), nunca de un adaptador. |
| `JONA-N2` | Los contratos no llevan comportamiento | Un contrato solo declara tipos, eventos y `DEFAULTS` literales: sin funciones, clases con lógica ni imports de ejecución. |
| `JONA-N3` | Efectos solo en la Implementación y en los adaptadores | La vista y el contrato no importan servicios ni adaptadores; nada en la unidad, salvo la Implementación, produce efectos (red, almacenamiento, temporizadores, hilos). |
| `JONA-N4` | El resto de la aplicación solo conoce la entrada | Fuera de una unidad solo se importa su entrada. Las pruebas y las historias están exentas. |

Los roles se reconocen por la convención de nombres de JONA: `Inter*` (contrato), `Inter*Service` (contrato de
servicio), `<X>Service<Variante>` que implementa `Inter<X>Service` (adaptador), `*Impl`, `*View`, y la entrada
(`index`, o el nombre del contrato sin `Inter`; en la forma de Plantilla, `XImpl extends X`, la Implementación).

## Qué prueba cada carpeta

| Carpeta | Herramienta | Qué demuestra |
|---------|-------------|---------------|
| `ts/` | Verificador propio con la API del compilador de TypeScript (`herramientas/jona-check.ts`) | Las cuatro reglas, un fixture por caso de violación (`fixtures/`), `src/` sin violaciones, el trinquete de deuda (`deuda.ts`, CLI) y la generalidad: el mismo verificador, en solo lectura, sobre `../web-react/src` y `../web-ts-puro/src`. |
| `java/` | ArchUnit 1.4 (JUnit 5) | Las reglas como `ArchRule`, fixtures en paquetes de prueba y el trinquete con `FreezingArchRule`: la deuda congelada en `deuda-archunit/`, que las pruebas no pueden crear ni modificar (`archunit.properties`). |
| `dotnet/` | ArchUnitNET 0.13 (xUnit) y reflexión | Las reglas como `IArchRule`; N2 usa reflexión porque ArchUnitNET describe dependencias, no si un método tiene cuerpo. |

## Comandos

```bash
cd ts && npm ci && npm run build && npm test
npm run check -- src                                                     # informe y código de salida
npm run check -- fixtures/deuda/legado --deuda fixtures/deuda/deuda.json # con deuda conocida

cd java && mvn -B test

cd dotnet && dotnet test
```

## El trinquete: la deuda solo baja

- **TypeScript.** `deuda.json` anota violaciones conocidas (regla, archivo y mensaje, sin línea). Una violación
  anotada pasa; una nueva falla; una anotada que ya no ocurre también falla, con el aviso de quitarla del archivo.
- **Java.** `FreezingArchRule` guarda las violaciones conocidas en `deuda-archunit/` (versionado). Con
  `allowStoreCreation=false` y `allowStoreUpdate=false`, una prueba no puede crear el almacén ni reescribirlo:
  una violación nueva falla, y una congelada que desaparece también falla hasta que alguien actualice el
  almacén a propósito, en local: `mvn test -Darchunit.freeze.store.default.allowStoreUpdate=true`.
- **C#.** No se incluye; ArchUnitNET 0.13 trae su propio `FreezingArchRule`.

## Límites

Los verificadores leen la estructura, no la intención. No ven imports dinámicos con rutas calculadas ni alias de
rutas (TypeScript), ni dependencias por reflexión o inyección de dependencias configurada en tiempo de ejecución
(Java y C#); la lista de efectos es explícita y se amplía a mano.
