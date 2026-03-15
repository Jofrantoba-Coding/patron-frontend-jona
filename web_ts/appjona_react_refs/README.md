# appjona_react_refs

Implementación del patrón JONA en React con class components usando `createRef`.

## Descripción

Introduce React al patrón JONA. El acceso a los valores del formulario se hace mediante referencias directas al DOM (`createRef`), lo que corresponde a inputs no controlados.

## Patrón JONA aplicado

| Archivo | Rol |
|---|---|
| `InterUiIniciarSesion.tsx` | Interfaz — define el contrato de métodos |
| `UiIniciarSesion.tsx` | Clase plantilla — class component con refs y render |
| `UiIniciarSesionImpl.tsx` | Clase implementación — sobreescribe los métodos de negocio |

## Implementación

### 1. Interfaz

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

Extiende `Component`, declara refs con `createRef` y lee los valores en el handler via `ref.current?.value`. Define el render y el comportamiento base.

```tsx
// UiIniciarSesion.tsx
export class UiIniciarSesion extends Component implements InterUiIniciarSesion {
  private txtEmailRef = createRef<HTMLInputElement>();
  private txtPasswordRef = createRef<HTMLInputElement>();

  handlerLogin = () => {
    const email = this.txtEmailRef.current?.value;
    const password = this.txtPasswordRef.current?.value;
    this.login(email, password);
  }

  login(email: string, password: string): void {
    window.alert('Click a plantilla iniciar sesión');
  }

  irCrearCuenta(): void { /* lógica base */ }
  irRecuperarClave(): void { /* lógica base */ }
  isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  render() {
    return (
      <form>
        <input type="email" ref={this.txtEmailRef} />
        <input type="password" ref={this.txtPasswordRef} />
        <button onClick={this.handlerLogin}>Login</button>
      </form>
    );
  }
}
```

### 3. Clase implementación

Extiende la plantilla y sobreescribe los métodos. No modifica el `render`.

```ts
// UiIniciarSesionImpl.tsx
export class UiIniciarSesionImpl extends UiIniciarSesion {

  login(email: string, password: string): void {
    window.alert('New Click a iniciar sesión');
    console.log(`Implementación — email: ${email}, password: ${password}`);
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
