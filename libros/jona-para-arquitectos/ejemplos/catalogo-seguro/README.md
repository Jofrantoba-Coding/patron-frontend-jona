# catalogo-seguro

Ejemplo del capítulo 17: el catálogo de productos con inicio de sesión, construido para que cada práctica de seguridad viva en una pieza JONA concreta. Un BFF sobre `node:http` guarda la sesión, entrega una cookie que JavaScript no puede leer, rechaza las peticiones que no vienen de la propia página, autoriza cada acción y sirve el documento con una CSP con nonce nuevo en cada respuesta. El cliente es React 19 con Vite, sin framework, y dibuja con el sistema de diseño del capítulo 13 (`file:../sistema-diseno-atomico`, versión 1.2.0).

```bash
# antes: npm ci && npm run build en ../sistema-diseno-atomico
npm ci
npm run build   # tsc --noEmit, vite build (dist/client) y vite build --ssr del servidor (dist/server)
npm test        # vitest; artefacto.test.ts y e2e.test.ts necesitan dist/
npm start       # node dist/server/principal.js, en http://127.0.0.1:4070
```

Abra **`http://localhost:4070`**, no `127.0.0.1`: la defensa CSRF compara el origen de cada petición con `ORIGEN_PUBLICO`, que por defecto es `http://localhost:4070`. Desde otro origen, el inicio de sesión responde 403.

| Usuario | Contraseña | Rol |
|---|---|---|
| `ana@ejemplo.com` | `secreta123` | administrador: ve y elimina |
| `beto@ejemplo.com` | `secreta123` | lector: solo ve; si pide eliminar igual, el BFF responde 403 |

Son usuarios de demostración: se registran al arrancar, con un hash scrypt y sal propia, y solo existen en el servidor. En producción, el directorio de usuarios es el proveedor de identidad.

| Variable | Por defecto | Qué hace |
|---|---|---|
| `ORIGEN_PUBLICO` | `http://localhost:4070` | El origen con el que el navegador abre la aplicación; la defensa CSRF lo compara con `Origin` |
| `PORT`, `HOST` | `4070`, `127.0.0.1` | Dónde escucha el servidor |

Sin el BFF, para trabajar la interfaz: `npm run dev` y abrir la URL que muestra Vite con `?falso` al final. La entrada carga entonces el servicio falso (punto de sustitución 2), que acepta cualquier contraseña. Ese servicio no llega al bundle de producción.

El producto `MON-003` trae datos hostiles a propósito: un nombre con `<img onerror>`, una descripción con `</script><script>` y un enlace `javascript:`. La pantalla muestra los dos textos como texto y no dibuja el enlace.

## Qué hay

```
src/
├── dominio/                    Producto y SesionUsuario (sin token ni identificador de sesión)
├── compartido/
│   ├── protocolo.ts            la cabecera propia X-Jona-Csrf: lo único que comparten cliente y BFF
│   └── UrlSegura.ts            el tipo con marca y aUrlSegura, su único productor
├── ui/
│   ├── sesion/                 unidad JONA del inicio de sesión (contrato, Implementación, vista, entrada)
│   ├── catalogo/               unidad JONA del catálogo: permisos como datos, enlaces UrlSegura
│   └── aplicacion/             la composición de las dos pantallas según la sesión
├── cliente/
│   ├── leerRespuestas.ts       la frontera: JSON desconocido → tipos del dominio, o error
│   ├── crearServicioFetch.ts   el adaptador contra el BFF: mismo origen, cabecera propia, sin token
│   ├── servicioFalso.ts        punto de sustitución 2, solo en desarrollo
│   └── entradaCliente.tsx      raíz de composición del cliente
└── servidor/                   el BFF
    ├── usuarios.ts             directorio con scrypt y comparación en tiempo constante
    ├── sesiones.ts             identificadores de 256 bits, vencimiento por inactividad
    ├── permisos.ts             la única tabla de permisos; denegar por defecto
    ├── proteccionCsrf.ts       cabecera propia, Sec-Fetch-Site y Origin
    ├── cabeceras.ts            CSP con nonce, nosniff, Referrer-Policy, COOP, no-store
    ├── documento.ts            el index.html de cada respuesta, con su nonce
    ├── crearServidor.ts        las rutas, en este orden: CSRF, sesión, autorización
    └── principal.ts            el punto de entrada del proceso
test/
├── architecture/reglas.ts      cinco reglas sobre el código del cliente, con un árbol de violación cada caso
├── artefacto.test.ts           el bundle compilado: sin servicio falso, sin nada del servidor
├── dependencias.test.ts        versiones exactas y lockfile: lo que se comprueba sin red
└── e2e.test.ts                 el proceso compilado
```

## Decisiones

- **El BFF entrega el HTML.** Un nonce sirve si es distinto en cada respuesta, y un archivo estático es siempre el mismo. Vite deja la marca `NONCE_POR_RESPUESTA` en cada `<script>` y `<style>` (`html.cspNonce`), y `documento.ts` la reemplaza.
- **Sin OAuth en el ejemplo.** Un BFF real obtiene los tokens del proveedor de identidad como cliente confidencial y los guarda en la sesión. Aquí un directorio local hace de proveedor, para que el ejemplo no dependa de otro servicio; la cookie, la defensa CSRF y la autorización son las mismas.
- **La cabecera propia en todo `/api`, también en `GET`.** La RFC 10017 pide que el BFF la exija en cada petición. Así ninguna ruta queda fuera por olvido.
- **scrypt con N=2^14, r=8, p=5.** Es una de las configuraciones mínimas que da la hoja de OWASP sobre almacenamiento de contraseñas; usa 16 MiB por derivación, dentro del límite por defecto de Node.

| Prueba | Pruebas | Qué protege |
|---|--:|---|
| `src/servidor/usuarios.test.ts` | 4 | Hash con sal propia; la misma respuesta para correo desconocido y contraseña incorrecta |
| `src/servidor/sesiones.test.ts` | 4 | Identificadores de 256 bits sin repetirse; vencimiento por inactividad; destruir invalida |
| `src/servidor/proteccionCsrf.test.ts` | 7 | La cabecera propia, `Sec-Fetch-Site` y `Origin` |
| `src/servidor/cabeceras.test.ts` | 5 | La CSP exacta, el nonce de 128 bits, las cabeceras comunes, el nonce dentro del HTML |
| `src/servidor/crearServidor.test.ts` | 14 | Cookie `__Host-` HttpOnly; fijación de sesión; 401, 403 y 204; CSRF en todo `/api`; nonce por respuesta; un error sin detalles; estáticos sin `../` |
| `src/compartido/UrlSegura.test.ts` | 11 | http y https sí; `javascript:` con mayúsculas, espacios o tabuladores, `data:` y relativas, no; los tipos |
| `src/cliente/crearServicioFetch.test.ts` | 4 | Mismo origen y cabecera propia, sin `Authorization`; respuestas validadas; estados traducidos |
| `src/ui/catalogo/UiCatalogo.test.tsx` | 4 | Datos hostiles como texto; el enlace `javascript:` no llega; el lector no ve Eliminar; el servidor dice que no |
| `src/ui/sesion/UiSesion.test.tsx` | 3 | Campo `password` con `current-password`; mensaje genérico; la contraseña no queda escrita |
| `src/ui/aplicacion/UiAplicacion.test.tsx` | 1 | Entrar, ver el catálogo y salir, con el servicio falso |
| `test/architecture/seguridad.test.ts` | 9 | Las cinco reglas sobre `src/`, y siete árboles de violación |
| `test/artefacto.test.ts` | 6 | Nonce en cada `<script>`; el bundle del cliente sin servicio falso ni nada del servidor, con sus controles positivos |
| `test/e2e.test.ts` | 3 | `npm start`: documento con nonce, 403 y 204, `ORIGEN_PUBLICO` |
| `test/dependencias.test.ts` | 3 | Versiones exactas; el lockfile coincide con `package.json`; tres dependencias de ejecución |
| **Total** | **78** | |
