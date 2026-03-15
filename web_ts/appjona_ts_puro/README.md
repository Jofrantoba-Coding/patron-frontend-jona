# appjona_ts_puro

Implementación del patrón JONA en TypeScript puro, sin framework de UI.

## Descripción

Forma más básica del patrón: manipulación directa del DOM sin React ni ningún otro framework. Es el punto de partida para entender la separación de responsabilidades que propone JONA.

## Patrón JONA aplicado

| Archivo | Rol |
|---|---|
| `InterUiIniciarSesion.tsx` | Interfaz — define el contrato de métodos |
| `UiIniciarSesion.tsx` | Clase plantilla — crea los elementos HTML y maneja eventos |
| `UiIniciarSesionImpl.tsx` | Clase implementación — sobreescribe los métodos de negocio |

## Implementación

### 1. Interfaz

Define el contrato que deben cumplir la plantilla y la implementación.

```ts
// InterUiIniciarSesion.tsx
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  irCrearCuenta: () => void;
  irRecuperarClave: () => void;
  isValidData: (email: string, password: string) => boolean;
}
```

### 2. Clase plantilla

Implementa la interfaz, construye el DOM y conecta los eventos. Define el comportamiento base.

```ts
// UiIniciarSesion.tsx
export class UiIniciarSesion implements InterUiIniciarSesion {
  private emailInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;

  constructor() {
    this.initializeUI();
    this.setupEventListeners();
  }

  private initializeUI(): void {
    this.emailInput = document.createElement('input');
    this.emailInput.type = 'email';
    // ... agrega elementos al DOM
  }

  login(email: string, password: string): void {
    window.alert('Click a plantilla iniciar sesión');
  }

  irCrearCuenta(): void { /* lógica base */ }
  irRecuperarClave(): void { /* lógica base */ }
  isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }
}
```

### 3. Clase implementación

Extiende la plantilla y sobreescribe solo los métodos de negocio. No toca el DOM.

```ts
// UiIniciarSesionImpl.tsx
export class UiIniciarSesionImpl extends UiIniciarSesion {

  login(email: string, password: string): void {
    window.alert('New Click a iniciar sesión');
    console.log(`Implementación — email: ${email}, password: ${password}`);
    // Aquí iría la llamada al servidor
  }

  irCrearCuenta(): void {
    window.alert('Click a ir a cuenta');
  }

  irRecuperarClave(): void {
    window.alert('Click a ir a recuperar clave');
  }

  isValidData(email: string, password: string): boolean {
    console.log('email:', email);
    console.log('password:', password);
    return true;
  }
}
```

## Levantar el proyecto

```bash
npm install
npm run dev
```
