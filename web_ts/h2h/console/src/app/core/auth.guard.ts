import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from './session.service';

/**
 * BFF: permite la ruta si hay sesión válida en el gateway (GET /session).
 * Si no, redirige a /login (selección de organización).
 */
export const authGuard: CanActivateFn = async () => {
  const session = inject(SessionService);
  const router = inject(Router);
  return (await session.loadSession()) ? true : router.createUrlTree(['/login']);
};
