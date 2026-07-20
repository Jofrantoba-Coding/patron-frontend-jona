import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SessionService } from './session.service';

/**
 * BFF: si el gateway responde 401 a una llamada de API (sesión perdida o expirada),
 * limpia el contexto y redirige a /login para reiniciar el flujo de autenticación.
 * Se excluye /session, cuyo 401 es normal (lo maneja SessionService.loadSession).
 */
export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const session = inject(SessionService);
  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        req.url.startsWith(environment.gatewayBaseUrl) &&
        !req.url.includes('/session')
      ) {
        session.clear();
        void router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
