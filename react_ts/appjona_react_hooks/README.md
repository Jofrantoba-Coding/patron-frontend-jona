# appjona_react_hooks

Implementación del patrón JONA en React con functional components y hooks.

## Descripción

Adapta el patrón JONA al paradigma funcional de React. En lugar de herencia de clases, la extensión se logra mediante composición de hooks: el hook de implementación consume el hook plantilla y sobreescribe los métodos que necesita.

## Patrón JONA aplicado

| Archivo | Rol |
|---|---|
| `InterUiIniciarSesion.tsx` | Interfaz — define el contrato de métodos |
| `UiIniciarSesion.tsx` | Hook plantilla + componente visual — `useUiIniciarSesion` y `UiIniciarSesion` |
| `UiIniciarSesionImpl.tsx` | Hook implementación — `useUiIniciarSesionImpl`, solo métodos, sin JSX |

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

### 2. Hook plantilla + componente visual

El hook provee el estado y los métodos base. El componente visual es un functional component puro que recibe todo por props — no contiene lógica de negocio.

```tsx
// UiIniciarSesion.tsx

// Hook plantilla
export function useUiIniciarSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log('useUiIniciarSesion montado (plantilla)');
  }, []);

  function login(email: string, password: string): void {
    window.alert('Click a plantilla iniciar sesión');
  }

  function irCrearCuenta(): void { /* lógica base */ }
  function irRecuperarClave(): void { /* lógica base */ }
  function isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(email, password)) login(email, password);
  }

  return { email, password, setEmail, setPassword,
           login, irCrearCuenta, irRecuperarClave,
           isValidData, handlerLogin, ... };
}

// Componente visual — solo renderiza, recibe todo por props
export const UiIniciarSesion: React.FC<UiIniciarSesionProps> = ({
  email, password, setEmail, setPassword,
  handlerLogin, handlerCrearCuenta, handlerRecuperarClave,
}) => (
  <form>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handlerLogin}>Login</button>
    <button type="button" onClick={handlerCrearCuenta}>Crear cuenta</button>
    <button type="button" onClick={handlerRecuperarClave}>Recuperar contraseña</button>
  </form>
);
```

### 3. Hook implementación

Consume el hook plantilla y sobreescribe los métodos. No contiene ninguna línea de JSX.

```ts
// UiIniciarSesionImpl.tsx
export function useUiIniciarSesionImpl() {
  const base = useUiIniciarSesion();

  useEffect(() => {
    console.log('useUiIniciarSesionImpl montado (implementación)');
  }, []);

  function login(email: string, password: string): void {
    window.alert('New Click a iniciar sesión');
    console.log(`Implementación — email: ${email}, password: ${password}`);
  }

  function irCrearCuenta(): void {
    window.alert('Click a ir a cuenta');
  }

  function irRecuperarClave(): void {
    window.alert('Click a ir a recuperar clave');
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    login(base.email, base.password);
  }

  // Retorna el estado de la plantilla + métodos sobreescritos
  return { ...base, login, irCrearCuenta, irRecuperarClave, handlerLogin, ... };
}
```

### 4. Orquestación en UiHome

`UiHome` instancia el hook de implementación e inyecta sus métodos en el componente visual.

```tsx
// UiHome.tsx
export const UiHome: React.FC = () => {
  const impl = useUiIniciarSesionImpl();

  return (
    <BorderLayout
      north={<Header />}
      south={<Footer />}
      center={<UiIniciarSesion {...impl} />}
    />
  );
};
```

## Flujo del patrón

```
useUiIniciarSesionImpl
  └── useUiIniciarSesion   (estado: email, password)
        └── UiIniciarSesion (UI — recibe props, no sabe de negocio)
```

## Levantar el proyecto

```bash
npm install
npm run dev
```

Abrir: `http://localhost:5173/login`

## Usuarios mock

| Email | Password |
|---|---|
| `admin@jona.com` | `123456` |
| `user@jona.com` | `abcdef` |
