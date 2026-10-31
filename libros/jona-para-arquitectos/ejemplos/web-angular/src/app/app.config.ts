import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AUTH_SERVICE } from './services/auth.token';
import { createAuthServiceHttp } from './services/AuthServiceHttp';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // El único lugar que decide hacia qué servidor apunta la aplicación (por defecto, el servidor mock).
    { provide: AUTH_SERVICE, useFactory: () => createAuthServiceHttp({ baseUrl: environment.apiUrl }) },
  ],
};
