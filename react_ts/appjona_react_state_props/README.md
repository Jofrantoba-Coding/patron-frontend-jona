# appjona_react_state_props

Implementación del patrón JONA en React con class components usando `state` y `props`.

## Descripción

Evoluciona el patrón hacia inputs controlados. El estado del formulario vive en el componente (`setState`) y los métodos de la interfaz se tipan como props, lo que permite inyectarlos desde afuera.

## Patrón JONA aplicado

| Archivo | Rol |
|---|---|
| `InterUiIniciarSesion.tsx` | Interfaz — define el contrato de métodos |
| `UiIniciarSesionProps.tsx` | Tipo de props — extiende la interfaz |
| `UiIniciarSesionState.tsx` | Tipo de estado — email y password |
| `UiIniciarSesion.tsx` | Clase plantilla — class component con state/props y render |
| `UiIniciarSesionImpl.tsx` | Clase implementación — sobreescribe los métodos de negocio |

## Implementación

### 1. Interfaz

```ts
// InterUiIniciarSesion.tsx
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
}
```

### 2. Props y State

```ts
// UiIniciarSesionProps.tsx
export interface UiIniciarSesionProps extends InterUiIniciarSesion {
  irCrearCuenta: () => void;
  irRecuperarClave: () => void;
}

// UiIniciarSesionState.tsx
export interface UiIniciarSesionState {
  email: string;
  password: string;
}
```

### 3. Clase plantilla

Extiende `Component<Props, State>`, maneja los cambios del formulario con `setState` y define el comportamiento base.

```tsx
// UiIniciarSesion.tsx
export class UiIniciarSesion extends Component<UiIniciarSesionProps, UiIniciarSesionState> {
  state: UiIniciarSesionState = { email: '', password: '' };

  handlerLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const { email, password } = this.state;
    if (this.isValidData(email, password)) {
      this.login(email, password);
    }
  }

  login(email: string, password: string): void {
    window.alert('Click a plantilla iniciar sesión');
  }

  irCrearCuenta(): void { /* lógica base */ }
  irRecuperarClave(): void { /* lógica base */ }
  isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  render() {
    const { email, password } = this.state;
    return (
      <form>
        <input type="email" value={email} onChange={this.handleEmailChange} />
        <input type="password" value={password} onChange={...} />
        <button onClick={this.handlerLogin}>Login</button>
      </form>
    );
  }
}
```

### 4. Clase implementación

Extiende la plantilla y sobreescribe los métodos. No modifica el `render` ni el `state`.

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
