import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardPage),
      },
      {
        path: 'documentos',
        loadComponent: () => import('./pages/documentos/documentos').then((m) => m.DocumentosPage),
      },
      // Todas las operaciones (panel de búsqueda) + vistas por producto:
      // una sola OperacionesPage parametrizada por route data.
      {
        path: 'operaciones',
        loadComponent: () => import('./pages/operaciones/operaciones').then((m) => m.OperacionesPage),
      },
      {
        path: 'operaciones/pagos-masivos',
        data: { producto: 'pagos_masivos' },
        loadComponent: () => import('./pages/operaciones/operaciones').then((m) => m.OperacionesPage),
      },
      {
        path: 'operaciones/transferencias',
        data: { producto: 'transferencias' },
        loadComponent: () => import('./pages/operaciones/operaciones').then((m) => m.OperacionesPage),
      },
      {
        path: 'operaciones/factoring',
        data: { producto: 'factoring' },
        loadComponent: () => import('./pages/operaciones/operaciones').then((m) => m.OperacionesPage),
      },
      {
        path: 'planillas',
        loadComponent: () => import('./pages/planillas/planillas').then((m) => m.PlanillasPage),
      },
      {
        path: 'respuestas',
        loadComponent: () => import('./pages/respuestas/respuestas').then((m) => m.RespuestasPage),
      },
      {
        path: 'beneficiarios',
        loadComponent: () => import('./pages/beneficiarios/beneficiarios').then((m) => m.BeneficiariosPage),
      },
      {
        path: 'certificados',
        loadComponent: () => import('./pages/certificados/certificados').then((m) => m.CertificadosPage),
      },
      {
        path: 'catalogos',
        loadComponent: () => import('./pages/catalogos/catalogos').then((m) => m.CatalogosPage),
      },
      {
        path: 'auditoria',
        loadComponent: () => import('./pages/auditoria/auditoria').then((m) => m.AuditoriaPage),
      },
      {
        path: 'rbac',
        loadComponent: () => import('./pages/rbac/rbac').then((m) => m.RbacPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
