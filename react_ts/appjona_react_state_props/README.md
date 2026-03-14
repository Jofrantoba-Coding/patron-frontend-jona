# appjona_react_state_props

Implementación del patrón JONA en React con class components usando `state` y `props`.

## Descripción

Esta demo evoluciona el patrón hacia inputs controlados. El estado del formulario vive en el componente (`setState`) y los métodos de la interfaz se tipan como props, lo que permite inyectarlos desde afuera.

## Patrón JONA aplicado

| Archivo | Rol |
|---|---|
| `InterUiIniciarSesion.tsx` | Interfaz — define el contrato de métodos |
| `UiIniciarSesionProps.tsx` | Tipo de props — extiende la interfaz |
| `UiIniciarSesionState.tsx` | Tipo de estado — email y password |
| `UiIniciarSesion.tsx` | Clase plantilla — class component con state/props y render |
| `UiIniciarSesionImpl.tsx` | Clase implementación — sobreescribe los métodos de negocio |

## Cómo funciona

La clase plantilla extiende `Component<Props, State>` y maneja los cambios del formulario con `setState`. La clase de implementación extiende la plantilla y sobreescribe los métodos sin modificar el render ni el estado.

## Levantar el proyecto

```bash
npm install
npm run dev
```
