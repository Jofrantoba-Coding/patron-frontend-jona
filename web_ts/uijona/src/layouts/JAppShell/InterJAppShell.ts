// InterJAppShell.ts — JONA Interface
import React from 'react';
import type { SidebarRenderApi } from '../JSidebarLayout/InterJSidebarLayout';

export interface InterJAppShell {
  /** The product mark at the start of the topbar. */
  brand: React.ReactNode;
  /** The end of the topbar (context chip, user menu...). */
  topbarEnd?: React.ReactNode;
  /** The sidebar content; `api.close` closes the drawer below lg, `api.collapsed` is the rail state. */
  sidebar: (api: SidebarRenderApi) => React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: string;
  railWidth?: string;
  defaultCollapsed?: boolean;
  navLabel?: string;
  openMenuLabel?: string;
  closeMenuLabel?: string;
  collapseLabel?: string;
  /** Observer event — value-first: the new rail state. */
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const JAPPSHELL_DEFAULTS = {
  sidebarWidth: '16.5rem',
  railWidth: '3.5rem',
  defaultCollapsed: false,
  navLabel: 'Menú de navegación',
  openMenuLabel: 'Abrir menú',
  closeMenuLabel: 'Cerrar menú',
  collapseLabel: 'Contraer menú',
} as const satisfies Required<Pick<InterJAppShell,
  'sidebarWidth' | 'railWidth' | 'defaultCollapsed' | 'navLabel' | 'openMenuLabel' | 'closeMenuLabel' | 'collapseLabel'
>>;
