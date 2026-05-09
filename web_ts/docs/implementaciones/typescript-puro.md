---
layout: default
title: TypeScript Puro
parent: Implementaciones
nav_order: 8
---

# JONA con TypeScript Puro
{: .no_toc }

Implementación **sin framework**. Manipulación directa del DOM con clases TypeScript. Demuestra que el patrón JONA es independiente de cualquier tecnología.
{: .fs-5 .fw-300 }

## Tabla de contenidos
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Stack tecnológico

| Herramienta | Versión |
|-------------|---------|
| TypeScript | 5.2.2 |
| Vite | 5.1.0 |
| React/ReactDOM | 18.2.0 (solo para compilar JSX, no se usa en runtime) |

**Carpeta:** `appjona_ts_puro/`

---

## ¿Por qué TypeScript puro?

Esta variante existe para demostrar que el patrón JONA no depende de React, Angular ni ningún framework. Los conceptos de **interfaz → template → implementación** son puramente de diseño orientado a objetos y se pueden aplicar con cualquier lenguaje que soporte interfaces y herencia.

---

## Estructura de archivos

```
src/views/uiiniciarsesion/
├── InterUiIniciarSesion.tsx       # Contrato (interface TypeScript)
├── UiIniciarSesion.tsx            # Clase template (crea y gestiona DOM)
└── UiIniciarSesionImpl.tsx        # Clase implementación (extiende template)

src/
├── main.ts                        # Entry point (instancia la implementación)
└── services/
    └── AuthService.ts
```

---

## Capa 1 — Interfaz

```typescript
// InterUiIniciarSesion.tsx
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
  render: (container: HTMLElement) => void;
}
```

---

## Capa 2 — Clase Template (DOM manual)

```typescript
// UiIniciarSesion.tsx
export class UiIniciarSesion implements InterUiIniciarSesion {
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private submitButton!: HTMLButtonElement;
  private container!: HTMLElement;

  render(container: HTMLElement): void {
    this.container = container;
    this.initializeUI();
    this.setupEventListeners();
  }

  private initializeUI(): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'max-w-sm mx-auto p-4';

    const form = document.createElement('form');
    form.className = 'space-y-4';

    this.emailInput = document.createElement('input');
    this.emailInput.type = 'email';
    this.emailInput.placeholder = 'Email';
    this.emailInput.className = 'w-full border rounded px-3 py-2';

    this.passwordInput = document.createElement('input');
    this.passwordInput.type = 'password';
    this.passwordInput.placeholder = 'Contraseña';
    this.passwordInput.className = 'w-full border rounded px-3 py-2';

    this.submitButton = document.createElement('button');
    this.submitButton.type = 'submit';
    this.submitButton.textContent = 'Iniciar sesión';
    this.submitButton.className = 'w-full bg-blue-600 text-white py-2 rounded';

    const createAccountBtn = document.createElement('button');
    createAccountBtn.type = 'button';
    createAccountBtn.textContent = 'Crear cuenta';
    createAccountBtn.addEventListener('click', () => this.goToCreateAccount());

    form.appendChild(this.emailInput);
    form.appendChild(this.passwordInput);
    form.appendChild(this.submitButton);
    form.appendChild(createAccountBtn);
    wrapper.appendChild(form);
    this.container.appendChild(wrapper);
  }

  private setupEventListeners(): void {
    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.login(this.emailInput.value, this.passwordInput.value);
    });
  }

  // Métodos del contrato — implementación placeholder
  login(email: string, password: string): void {
    window.alert(`Template: login(${email})`);
  }

  goToCreateAccount(): void {
    window.alert('Template: crear cuenta');
  }

  goToRecoverPassword(): void {
    window.alert('Template: recuperar contraseña');
  }

  isValidData(email: string, password: string): boolean {
    return email.length > 0 && password.length > 0;
  }
}
```

---

## Capa 3 — Clase Implementación

```typescript
// UiIniciarSesionImpl.tsx
export class UiIniciarSesionImpl extends UiIniciarSesion {
  private navigateTo: (path: string) => void;

  constructor(navigateTo: (path: string) => void) {
    super();
    this.navigateTo = navigateTo;
  }

  override login(email: string, password: string): void {
    if (!this.isValidData(email, password)) {
      alert('Email y contraseña requeridos');
      return;
    }

    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('jona_token', response.token);
        this.navigateTo('/homesesion');
      })
      .catch(error => alert(error.message));
  }

  override goToCreateAccount(): void {
    this.navigateTo('/create-account');
  }
}
```

---

## Entry Point

```typescript
// main.ts
const container = document.getElementById('app')!;

// Navegación simple sin router
function navigateTo(path: string): void {
  window.location.hash = path;
  renderCurrentRoute();
}

function renderCurrentRoute(): void {
  container.innerHTML = '';
  const path = window.location.hash || '#/login';

  if (path === '#/login') {
    const view = new UiIniciarSesionImpl(navigateTo);
    view.render(container);
  } else if (path === '#/homesesion') {
    const view = new UiHomeSessionImpl(navigateTo);
    view.render(container);
  }
}

window.addEventListener('hashchange', renderCurrentRoute);
renderCurrentRoute();
```

---

## Comparación de capas entre variantes

| Capa | React Hooks | TypeScript Puro |
|------|-------------|----------------|
| Estado | `useState` | Variables de instancia + DOM |
| Ciclo de vida | `useEffect` | Constructor + método `render()` |
| Renderizado | JSX → Virtual DOM | `document.createElement()` |
| Navegación | `useNavigate()` | `window.location.hash` |
| Composición | Hook spread `{...base}` | Herencia de clase + `super()` |
| Reactividad | Automática (React) | Manual (actualizar DOM) |

---

## Por qué es valioso

Esta variante prueba que el **patrón JONA es agnóstico al framework**. Los mismos principios de:

1. Definir un contrato (interface)
2. Crear un template con comportamiento placeholder
3. Extender con implementación real
4. Separar la construcción del DOM de la lógica

...funcionan igual en TypeScript puro, en entornos sin bundler, en Node.js con jsdom, o en cualquier contexto donde no sea posible usar un framework.

{: .highlight }
> Si entiendes el patrón JONA en TypeScript puro, lo entiendes en cualquier tecnología.
