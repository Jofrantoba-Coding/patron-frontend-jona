import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { credentialsInterceptor } from './core/credentials.interceptor';
import { unauthorizedInterceptor } from './core/unauthorized.interceptor';

/**
 * BFF: sin Keycloak en el navegador. `credentialsInterceptor` adjunta la cookie de
 * sesión del gateway (`withCredentials`); `unauthorizedInterceptor` redirige a /login
 * si el gateway devuelve 401 (sesión perdida/expirada).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor, unauthorizedInterceptor])),
  ],
};
