---
layout: default
title: Angular
parent: Implementaciones
nav_order: 4
---

# JONA con Angular 17
{: .no_toc }

Implementación usando **standalone components** de Angular 17. Las capas del patrón se mapean a componentes Angular en lugar de hooks.
{: .fs-5 .fw-300 }

## Tabla de contenidos
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Stack tecnológico

| Herramienta | Versión |
|-------------|---------|
| Angular | 17.3.0 |
| TypeScript | 5.4.2 |
| RxJS | 7.8.0 |
| Tailwind CSS | 3.4.3 |

**Carpeta:** `appjona_angular/`

---

## Mapeo del patrón a Angular

El patrón JONA en Angular utiliza **componentes** en lugar de hooks para cada capa:

| Capa JONA | React Hooks | Angular |
|-----------|-------------|---------|
| Contrato | `Inter*.ts` (interface) | `inter-*.ts` (interface) |
| Template | Hook `useUi*()` | `UiComponent` (standalone) |
| Implementación | Hook `useUi*Impl()` | `UiImplComponent` (standalone) |
| Visual | Componente `.tsx` | Template HTML del componente |
| View | `*View.tsx` | `UiViewComponent` (en router) |

---

## Estructura de archivos

```
src/app/views/uihome/
├── inter-ui-home.ts              # Contrato (TypeScript interface)
├── ui-home.component.ts          # Componente template
├── ui-home-impl.component.ts     # Componente implementación
└── ui-home-view.component.ts     # Componente view (ruta)

src/app/views/uiiniciarsesion/
├── inter-ui-iniciar-sesion.ts
├── ui-iniciar-sesion.component.ts
├── ui-iniciar-sesion.component.html
└── ui-iniciar-sesion-impl.component.ts
```

---

## Capa 1 — Interfaz

```typescript
// inter-ui-home.ts
export interface InterUiHome {
  onMount: () => void;
}

// inter-ui-iniciar-sesion.ts
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  isValidData: (email: string, password: string) => boolean;
}
```

---

## Capa 2 — Componente Template

```typescript
// ui-iniciar-sesion.component.ts
@Component({
  selector: 'app-ui-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-sm mx-auto p-4">
      <form (ngSubmit)="handlerLogin()">
        <input [(ngModel)]="email" type="email" />
        <input [(ngModel)]="password" type="password" />
        <button type="submit">Iniciar sesión</button>
        <button type="button" (click)="goToCreateAccount()">Crear cuenta</button>
      </form>
    </div>
  `,
})
export class UiIniciarSesionComponent implements InterUiIniciarSesion, OnInit {
  email = '';
  password = '';

  ngOnInit(): void {
    console.log('Template montado');
  }

  login(email: string, password: string): void {
    alert(`Template: login(${email})`);
  }

  goToCreateAccount(): void {
    alert('Template: ir a crear cuenta');
  }

  isValidData(email: string, password: string): boolean {
    return email.length > 0 && password.length > 0;
  }

  handlerLogin(): void {
    this.login(this.email, this.password);
  }
}
```

---

## Capa 3 — Componente Implementación

En Angular, la implementación se hace extendiendo el componente template:

```typescript
// ui-iniciar-sesion-impl.component.ts
@Component({
  selector: 'app-ui-iniciar-sesion-impl',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-sm mx-auto p-4">
      <form (ngSubmit)="handlerLogin()">
        <input [(ngModel)]="email" type="email" placeholder="Email" />
        <input [(ngModel)]="password" type="password" placeholder="Contraseña" />
        <button type="submit">Iniciar sesión</button>
        <button type="button" (click)="goToCreateAccount()">Crear cuenta</button>
      </form>
    </div>
  `,
})
export class UiIniciarSesionImplComponent
  extends UiIniciarSesionComponent
  implements OnInit
{
  constructor(private router: Router) {
    super();
  }

  override ngOnInit(): void {
    console.log('Implementación montada');
  }

  override login(email: string, password: string): void {
    if (!this.isValidData(email, password)) return;
    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('jona_token', response.token);
        this.router.navigate(['/homesesion']);
      })
      .catch(error => alert(error.message));
  }

  override goToCreateAccount(): void {
    this.router.navigate(['/create-account']);
  }
}
```

---

## Capa 4 — Componente View (Orquestador)

```typescript
// ui-home-impl.component.ts — la vista Home compone la implementación
@Component({
  selector: 'app-ui-home-impl',
  standalone: true,
  imports: [
    BorderLayoutComponent,
    HeaderComponent,
    FooterComponent,
    UiIniciarSesionImplComponent,
  ],
  template: `
    <app-border-layout>
      <app-header slot="north" />
      <app-ui-iniciar-sesion-impl slot="center" />
      <app-footer slot="south" />
    </app-border-layout>
  `,
})
export class UiHomeImplComponent implements OnInit {
  ngOnInit(): void {
    console.log('Home implementation montada');
  }
}
```

---

## Routing

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'login',      component: UiHomeImplComponent },
  { path: 'homesesion', component: UiHomeSessionImplComponent, canActivate: [authGuard] },
  { path: '',           redirectTo: '/login', pathMatch: 'full' },
  { path: '**',         redirectTo: '/login' },
];
```

---

## Diferencias clave respecto a React

| Aspecto | React Hooks | Angular |
|---------|-------------|---------|
| Template | Hook funcional | Clase `Component` con decorador |
| Implementación | Composición con spread `{...base}` | Herencia de clase (`extends`) |
| Estado | `useState` | Variables de instancia |
| Ciclo de vida | `useEffect` | `ngOnInit`, `ngOnDestroy` |
| Navegación | `useNavigate()` | Inyección de `Router` |
| Binding | Props + handlers | `[(ngModel)]`, `(click)`, etc. |

---

## Por qué herencia en Angular

En React, la composición con hooks es natural (spread de objetos). En Angular, los componentes son clases, por lo que la forma idiomática de "extender" un template es a través de **herencia de clase** con `extends`.

```typescript
// React: composición funcional
const impl = { ...base, login: overriddenLogin };

// Angular: herencia de clase
class ImplComponent extends TemplateComponent {
  override login() { /* lógica real */ }
}
```
