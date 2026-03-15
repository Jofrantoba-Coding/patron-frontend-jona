// app.routes.ts — Definición de rutas (equivalente a App.tsx en React)
// Solo los View Orchestrators se registran aquí
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./views/uihome/ui-home-view.component').then(m => m.UiHomeViewComponent),
  },
  {
    path: 'homesesion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./views/uihomesesion/ui-home-session-view.component').then(m => m.UiHomeSessionViewComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
