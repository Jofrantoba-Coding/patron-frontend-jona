// InterJNavbar.ts — JONA Interface
import React from 'react';

export interface InterJNavbar {
  /** Marca (logo + nombre). */
  brand: React.ReactNode;
  /** Enlaces/menús centrales (ocultos en móvil). */
  children?: React.ReactNode;
  /** Acciones a la derecha (p.ej. un JButton). */
  actions?: React.ReactNode;
  /** Contenido del drawer móvil. */
  drawer?: React.ReactNode;
  mobileOpen: boolean;
  onMobileToggle: () => void;
  onMobileClose: () => void;
  /** Ref al <header> (p.ej. para detección de click-outside). */
  navRef?: React.Ref<HTMLElement>;
  className?: string;
}

export const JNAVBAR_DEFAULTS: Partial<InterJNavbar> = {};
