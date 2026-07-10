export interface PlanillasPageContract {
  rows: import('../../core/models').Planilla[];
  loading: boolean;
  confirm: { title: string; desc: string; planilla: import('../../core/models').Planilla; def: import('./planillas-view.component').AccionDef } | null;
  canSend: boolean;
}
