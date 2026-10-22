// Layer: Interface. Public contract of the shell: shapes and defaults only, no logic.
import type { ReactNode } from 'react';
import type { MenuItem } from '../../domain/menuTree';
import type { WorkspaceTab } from '../../domain/workspace';

export type MenuStatus = 'loading' | 'ready' | 'error';

export interface ShellNotice {
  title: string;
  description: string;
}

export interface InterUiShell {
  emptyMessage?: string;
  menuLoadingMessage?: string;
  retryLabel?: string;
  closeTabLabel?: string;
  noticeConfirmLabel?: string;
  noticeCloseLabel?: string;
  menuStatus: MenuStatus;
  menuItems: MenuItem[];
  menuError?: string;
  menuErrorTraceId?: string;
  tabs: WorkspaceTab[];
  /** `formId` of the selected tab, `null` when the workspace is empty. */
  activeId: string | null;
  notice?: ShellNotice;
  /** Renders the body of a tab; the entry supplies it because the Impl renders nothing. */
  renderForm: (formId: string) => ReactNode;
  /** Callbacks are value-first: the business value, no DOM event. */
  onLeafSelect?: (item: MenuItem) => void;
  onTabSelect?: (formId: string) => void;
  onTabClose?: (formId: string) => void;
  onMenuRetry?: () => void;
  onNoticeClose?: () => void;
}

/** Presentation defaults only; menu data, tabs and the notice are state and never defaulted. */
export const UISHELL_DEFAULTS: Required<
  Pick<
    InterUiShell,
    | 'emptyMessage'
    | 'menuLoadingMessage'
    | 'retryLabel'
    | 'closeTabLabel'
    | 'noticeConfirmLabel'
    | 'noticeCloseLabel'
  >
> = {
  emptyMessage: 'Abra una opción del menú para comenzar.',
  menuLoadingMessage: 'Cargando menú...',
  retryLabel: 'Reintentar',
  closeTabLabel: 'Cerrar pestaña',
  noticeConfirmLabel: 'Aceptar',
  noticeCloseLabel: 'Cerrar',
};
