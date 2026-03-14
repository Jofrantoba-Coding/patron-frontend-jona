# appjona_ts_puro

Implementación del patrón JONA en TypeScript puro, sin framework de UI.

## Descripción

Esta demo muestra la forma más básica del patrón: manipulación directa del DOM sin React ni ningún otro framework. Es el punto de partida para entender la separación de responsabilidades que propone JONA.

## Patrón JONA aplicado

| Archivo | Rol |
|---|---|
| `InterUiIniciarSesion.tsx` | Interfaz — define el contrato de métodos |
| `UiIniciarSesion.tsx` | Clase plantilla — crea los elementos HTML y maneja eventos |
| `UiIniciarSesionImpl.tsx` | Clase implementación — sobreescribe los métodos de negocio |

## Cómo funciona

La clase plantilla construye el formulario programáticamente con `document.createElement` y adjunta los event listeners en el constructor. La clase de implementación extiende la plantilla y sobreescribe únicamente los métodos que necesita personalizar.

## Levantar el proyecto

```bash
npm install
npm run dev
```
