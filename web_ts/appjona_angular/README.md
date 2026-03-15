# appjona_angular

**JONA Design Pattern — Angular 17 (Standalone Components)**

Implementación del patrón JONA en Angular usando componentes standalone, herencia de clases y el sistema de inyección de dependencias de Angular.

---

## Paradigma

| Mecanismo | Angular |
|---|---|
| Interface | TypeScript `interface` |
| Template | `@Component` standalone (clase base) |
| Implementation | Clase que `extends` el Template + inyección de `AuthService` y `Router` |
| View Orchestrator | Componente standalone registrado en el router |
| Estado | Propiedades de clase + `[(ngModel)]` |
| Extensión Template→Impl | Herencia de clases (`extends`) + `override` |

---

## Estructura

```
src/app/
├── views/
│   ├── uiiniciarsesion/
│   │   ├── inter-ui-iniciar-sesion.ts          ← Interface
│   │   ├── ui-iniciar-sesion.component.ts       ← Template
│   │   └── ui-iniciar-sesion-impl.component.ts  ← Implementation
│   ├── uihome/
│   │   ├── inter-ui-home.ts                    ← Interface
│   │   ├── ui-home.component.ts                ← Template
│   │   ├── ui-home-impl.component.ts           ← Implementation
│   │   └── ui-home-view.component.ts           ← View Orchestrator (/login)
│   └── uihomesesion/
│       ├── inter-ui-home-session.ts            ← Interface
│       ├── ui-home-session.component.ts        ← Template
│       ├── ui-home-session-impl.component.ts   ← Implementation
│       └── ui-home-session-view.component.ts   ← View Orchestrator (/homesesion)
├── services/
│   └── auth.service.ts                         ← Solo accesible desde Implementation
├── guards/
│   └── auth.guard.ts                           ← Equivalente a ProtectedRoute
├── uilayouts/
│   └── border-layout.component.ts
├── uiutils/
│   ├── header.component.ts
│   └── footer.component.ts
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

---

## Instalación y ejecución

```bash
cd web_ts/appjona_angular
npm install
npm start        # ng serve → http://localhost:4200
npm run build    # ng build
npm test         # ng test --watch=false
```

## Usuarios mock

| Email | Password |
|---|---|
| `admin@jona.com` | `123456` |
| `user@jona.com` | `abcdef` |
