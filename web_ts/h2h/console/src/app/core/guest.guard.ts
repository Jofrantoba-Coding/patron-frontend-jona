import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from './session.service';

/**
 * BFF: guarda /login. Si ya hay sesión en el gateway, salta al dashboard.
 */
export const guestGuard: CanActivateFn = async () => {
  const session = inject(SessionService);
  const router = inject(Router);
  return (await session.loadSession()) ? router.createUrlTree(['/dashboard']) : true;
};
