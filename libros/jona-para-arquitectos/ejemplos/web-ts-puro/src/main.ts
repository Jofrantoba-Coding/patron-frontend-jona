import type { Navigator } from './navigation/Navigator';
import { createAuthServiceHttp } from './services/AuthServiceHttp';
import { UiLoginImpl } from './views/uilogin/UiLoginImpl';

// Raíz de composición: por defecto, el servidor mock (.env); para el backend real solo cambia VITE_API_URL.
const auth = createAuthServiceHttp({ baseUrl: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4010' });

const app = document.getElementById('app')!;
const navigator: Navigator = {
  openHome: (session) => { app.textContent = `Hola, ${session.user.nombre}`; },
  openCreateAccount: () => { window.alert('Aquí se abriría la pantalla para crear una cuenta.'); },
  openRecoverPassword: () => { window.alert('Aquí se abriría la pantalla para recuperar la contraseña.'); },
};

// La aplicación solo conoce la entrada: la Implementación.
app.append(new UiLoginImpl(auth, navigator).element);
