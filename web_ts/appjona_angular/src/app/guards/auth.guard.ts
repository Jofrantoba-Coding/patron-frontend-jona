// auth.guard.ts — Guard de rutas protegidas (equivalente a ProtectedRoute en React)
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAuthenticated = localStorage.getItem('jona_authenticated') === 'true';
  return isAuthenticated ? true : router.createUrlTree(['/login']);
};
