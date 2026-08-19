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
      // Paneles por entidad. Una sola Page parametrizada por `data.entidad`, igual que
      // OperacionesPage se parametriza por `producto`: los tres hacen lo mismo —estados,
      // cantidades e importes— con otro vocabulario. El de planillas trae además la
      // conciliación de las respuestas, que no se entiende separada del archivo.
      {
        path: 'dashboard/operaciones',
        data: { entidad: 'operaciones' },
        loadComponent: () => import('./pages/panel/panel-entidad').then((m) => m.PanelEntidadPage),
      },
      {
        path: 'dashboard/programaciones',
        data: { entidad: 'programaciones' },
        loadComponent: () => import('./pages/panel/panel-entidad').then((m) => m.PanelEntidadPage),
      },
      {
        path: 'dashboard/planillas',
        data: { entidad: 'planillas' },
        loadComponent: () => import('./pages/panel/panel-entidad').then((m) => m.PanelEntidadPage),
      },
      // 'documentos' se retiró: la bandeja unificada solo existía en el mock y
      // los archivos se descargan desde el detalle de cada planilla. A
      // diferencia de 'certificados' no se deja redirección, porque no hay
      // pantalla que herede su función. La ruta comodín lleva al panel.
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
      // 'certificados' se retiró (duplicaba Llaves de cifrado sobre datos del
      // mock). Se redirige para no romper enlaces guardados ni marcadores.
      { path: 'certificados', pathMatch: 'full', redirectTo: 'llaves-cifrado' },
      {
        path: 'llaves-cifrado',
        loadComponent: () => import('./pages/llaves-cifrado/llaves-cifrado').then((m) => m.LlavesCifradoPage),
      },
      {
        path: 'sftp-seguimiento',
        loadComponent: () => import('./pages/sftp-seguimiento/sftp-seguimiento').then((m) => m.SftpSeguimientoPage),
      },
      {
        path: 'jobs-configuracion',
        loadComponent: () =>
          import('./pages/jobs-configuracion/jobs-configuracion').then((m) => m.JobsConfiguracionPage),
      },
      {
        path: 'schedulers-seguimiento',
        loadComponent: () =>
          import('./pages/schedulers-seguimiento/schedulers-seguimiento').then(
            (m) => m.SchedulersSeguimientoPage
          ),
      },
      {
        path: 'calimaco',
        loadComponent: () =>
          import('./pages/calimaco/calimaco').then((m) => m.CalimacoPage),
      },
      {
        path: 'informes',
        loadComponent: () =>
          import('./pages/informes/informes').then((m) => m.InformesPage),
      },
      {
        path: 'sftp-config',
        loadComponent: () => import('./pages/sftp-config/sftp-config').then((m) => m.SftpConfigPage),
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
