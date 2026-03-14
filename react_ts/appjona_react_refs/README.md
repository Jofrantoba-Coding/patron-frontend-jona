# appjona_react_refs

Implementación del patrón JONA en React con class components usando `createRef`.

## Descripción

Esta demo introduce React al patrón JONA. El acceso a los valores del formulario se hace mediante referencias directas al DOM (`createRef`), lo que corresponde a inputs no controlados.

## Patrón JONA aplicado

| Archivo | Rol |
|---|---|
| `InterUiIniciarSesion.tsx` | Interfaz — define el contrato de métodos |
| `UiIniciarSesion.tsx` | Clase plantilla — class component con refs y render |
| `UiIniciarSesionImpl.tsx` | Clase implementación — sobreescribe los métodos de negocio |

## Cómo funciona

La clase plantilla extiende `Component` y declara refs con `createRef<HTMLInputElement>()`. Los valores del formulario se leen en el handler via `ref.current?.value`. La clase de implementación extiende la plantilla y sobreescribe los métodos sin tocar el render.

## Levantar el proyecto

```bash
npm install
npm run dev
```
