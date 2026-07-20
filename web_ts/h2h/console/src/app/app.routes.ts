import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { guestGuard } from './core/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
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
        path: 'programaciones',
        loadComponent: () => import('./pages/programaciones/programaciones').then((m) => m.ProgramacionesPage),
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
        path: 'organizacion',
        loadComponent: () => import('./pages/organizacion/organizacion').then((m) => m.OrganizacionPage),
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
        path: 'correlativos',
        loadComponent: () => import('./pages/correlativos/correlativos').then((m) => m.CorrelativosPage),
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
