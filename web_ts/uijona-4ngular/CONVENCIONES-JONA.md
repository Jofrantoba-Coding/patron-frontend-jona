# El patrón JONA en `uijona-4ngular`

Cómo se organiza cada componente de la librería y por qué. La referencia es
`web_ts/uijona` (React, `jona-ui`): esta librería es su equivalente en Angular,
no una reinterpretación.

**Estas reglas se verifican en CI**: `npm run lint:jona`. Si una regla estorba,
se discute y se cambia el verificador — no se ignora.

---

## Las capas, y qué archivo es cada una

```
atoms/JButton/
├── InterJButton.ts      Contrato    — qué expone el componente
├── JButtonStyles.ts     Presentación— cómo se ve (clases Tailwind, valores CSS)
├── JButtonView.html     Vista       — estructura y bindings
├── JButtonView.css      Vista       — estilos encapsulados del componente
├── JButtonImpl.ts       Implementación — estado, eventos, composición
├── JButton.ts           Entry point — la API pública del componente
└── index.ts             Reexport
```

### 1. Contrato — `Inter<Comp>.ts`

Tipos, `<COMP>_DEFAULTS` y los mapas de **documentación** de cada opción.

> **Regla:** el contrato solo contiene lo que **no cambia si cambia el diseño**.

Nada de Tailwind, nada de valores CSS, nada de geometría. Si un rediseño obliga
a tocar el contrato, el contrato estaba mal.

Los mapas de documentación son parte del valor del sistema de diseño: describen
para qué sirve cada variante y alimentan Storybook y las guías de uso.

```ts
export const JBUTTON_SIZES: Record<JButtonSize, string> = {
  sm: '28px min-height. Dentro de tablas o listas.',
  md: '36px min-height. Tamaño por defecto.',
};
```

### 2. Presentación — `<Comp>Styles.ts`

Los mapas de clases Tailwind, los valores CSS y la geometría.

> **Regla:** es detalle de implementación. **No se exporta** desde el entry point
> ni desde `public-api.ts`.

Esto es deliberado: permite rediseñar sin romper a ningún consumidor. Si un
consumidor necesita una variante nueva, se añade al contrato; no se le da acceso
a las clases internas.

### 3. Vista — `<Comp>View.html` (+ `<Comp>View.css`)

La plantilla es un archivo `.html` real, referenciado con `templateUrl`.

> **Regla:** ningún `@Component` usa `template:` en línea.

El motivo es práctico: un `.html` tiene resaltado de sintaxis, el language
service de Angular, autocompletado de bindings, ir-a-definición y formateo. Con
la plantilla dentro de un template literal de TypeScript no hay nada de eso, y
la capa deja de ser editable por alguien de diseño — que es justo lo que el
patrón busca al separarla.

Los estilos propios del componente van en `<Comp>View.css` con `styleUrl`,
encapsulados por Angular. El resto del aspecto sale de las utilidades de
Tailwind y de la hoja global `styles/uijona.css`.

**Compartir está permitido, duplicar no.** Los layouts basados en `JPanel`
comparten `layouts/LayoutBaseView.html` y `layouts/InterLayoutBase.ts`; cada uno
apunta con `templateUrl: '../LayoutBaseView.html'`. El verificador comprueba que
la ruta exista, no que el archivo esté en la misma carpeta.

### 4. Implementación — `<Comp>Impl.ts`

El `@Component`: `input()` / `output()` / `model()`, los `computed()` que
componen clases con `cn()`, y los manejadores. Importa el contrato y los
estilos; no contiene marcado.

### 5. Entry point — `<Comp>.ts` e `index.ts`

Lo que ve el consumidor: la clase, los tipos, los `DEFAULTS` y los mapas de
documentación. Nunca los mapas de presentación.

---

## Convenciones de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Carpeta | PascalCase, idéntica a React | `atoms/JButton/` |
| Clase | Nombre público, sin sufijo `Impl` | `export class JButton` |
| Selector | kebab-case | `j-button` |
| Slots | atributo con prefijo `j` | `[jIcon]`, `[jVisual]` |
| Outputs | en pasado, para no chocar con eventos del DOM | `clicked`, `blurred`, `dismissed` |
| Valor bidireccional | `model()` | `[(value)]`, `[(checked)]` |

### Eventos: el contrato Observer

En React la firma es *value-first*: `onChange(value, event)`. En Angular un
output emite un solo valor, así que:

- si solo hay valor → se emite el valor: `search: output<string>()`
- si hacen falta valor y evento → un objeto: `enterPress: output<{ value; event }>()`

El mapeo React → Angular queda documentado en cada contrato.

---

## Verificación

```bash
npm run lint:jona   # las 5 reglas del patrón
npm test            # 83 pruebas, incl. los contratos de calidad de diseño
npm run build       # librería + hoja de estilos compilada
npm run verify      # las tres cosas
```

Las suites de `src/lib/__tests__/quality/` son el port de los *design-quality
contracts* de `jona-ui`: accesibilidad, personalización, interacción y contrato
responsive. Son la definición ejecutable de "esto sigue siendo el mismo sistema
de diseño que la versión React".

> Requiere Node ≥ 22.12 (hay `.node-version`; con `fnm` el cambio es automático).
