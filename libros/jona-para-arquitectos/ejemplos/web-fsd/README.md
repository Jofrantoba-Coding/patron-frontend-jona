# web-fsd

Ejemplo del capítulo 6: el mismo inicio de sesión, organizado con Feature-Sliced Design entre unidades y con JONA dentro de cada unidad. Vite, React, TypeScript, Vitest y Testing Library, con las mismas versiones que `web-react`.

```bash
npm ci
npm run mock      # terminal 1: el servidor mock
npm run dev       # terminal 2: la aplicación, conectada al servidor mock
npm test          # comportamiento, suites de contrato y pruebas de arquitectura
npm run build     # verificación de tipos y compilación
```

Sin variables, la aplicación usa el adaptador HTTP contra `http://127.0.0.1:4010`. `VITE_API_URL=<url>` cambia el servidor y `VITE_AUTH_SERVICE=fake` usa el servicio en memoria (por ejemplo, en un `.env.local`).

Para correr la suite de contrato del adaptador HTTP contra otro servidor (se omite la prueba del escenario `errorServidor`):

```bash
CONTRATO_API_URL=https://backend.example.com npx vitest run src/features/auth-login/api/createAuthServiceHttp.test.ts
```

## Qué hay

```
src/
├── app/                      raíz de composición: elige el adaptador (createAuthService.ts) y muestra las páginas
├── pages/login/, pages/home/ páginas: componen entradas de capas inferiores
├── features/auth-login/      una unidad JONA con contrato de servicio
│   ├── model/                InterUiLogin.ts (contrato de UI), InterAuthService.ts (puerto), UiLoginImpl.ts
│   ├── ui/                   UiLoginView.tsx (vista), UiLogin.tsx (entrada)
│   ├── api/                  createAuthServiceHttp.ts, createAuthServiceFake.ts (adaptadores)
│   └── index.ts              API pública = N4: la entrada, el puerto y las fábricas de adaptadores
├── entities/session/         LoginResult y LoginUser
└── shared/
    ├── api/                  ApiError
    └── ui/jbutton/, ui/jtextfield/   átomos del sistema de diseño: forma mínima, variante b
```

## Las reglas de arquitectura

`test/architecture/rules.ts` verifica, con la API del compilador de TypeScript, cinco reglas sobre los imports de `src/`:

1. Las capas solo importan capas inferiores.
2. Dos *slices* de la misma capa no se importan.
3. Entre unidades solo se importa el `index.ts`, que no expone vistas ni Implementaciones.
4. Dentro de una unidad, `model/` no importa `ui/` ni `api/`, `ui/` y `api/` no se importan entre sí, la vista solo importa contratos `Inter*`, y solo `app` importa un adaptador.
5. Los archivos `Inter*.ts` solo contienen tipos y objetos `*_DEFAULTS` con valores literales.

Cada regla se prueba además contra un árbol de `test/fixtures/` que contiene una sola violación. Los archivos `*.test.ts(x)` quedan fuera del análisis: una prueba es su propia raíz de composición.
