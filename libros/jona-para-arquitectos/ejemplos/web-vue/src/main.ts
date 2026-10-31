import { createApp } from 'vue';
import App from './App.vue';
import { createAuthServiceHttp } from './services/AuthServiceHttp';

// Raíz de composición: por defecto, el servidor mock (.env); para el backend real solo cambia VITE_API_URL.
const service = createAuthServiceHttp({ baseUrl: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4010' });

createApp(App, { service }).mount('#app');
