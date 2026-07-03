// JNavbarView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="6" x2="20" y2="6" /><line x1="2" y1="11" x2="20" y2="11" /><line x1="2" y1="16" x2="20" y2="16" />
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

type JNavbarViewProps = InterJNavbarView;
interface InterJNavbarView {
  brand: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  drawer?: React.ReactNode;
  mobileOpen: boolean;
  onMobileToggle: () => void;
  onMobileClose: () => void;
  className?: string;
  navRef?: React.Ref<HTMLElement>;
}

export const JNavbarView: React.FC<JNavbarViewProps> = ({
  brand, children, actions, drawer, mobileOpen, onMobileToggle, onMobileClose, className, navRef,
}) => (
  <>
  <JPanel
    as="header"
    ref={navRef as React.Ref<HTMLDivElement>}
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md', className)}
  >
    <JPanel as="nav" variant="ghost" padding="none" radius="none" className="mx-auto flex h-16 w-full max-w-content items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
      {brand}
      <JPanel variant="ghost" padding="none" radius="none" className="hidden items-center gap-1 lg:flex">
        {children}
      </JPanel>
      <JPanel variant="ghost" padding="none" radius="none" className="flex items-center gap-2">
        {actions}
        <button
          onClick={onMobileToggle}
          aria-label="Abrir menú"
          className="grid h-10 w-10 place-items-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 lg:hidden"
        >
          <MenuIcon />
        </button>
      </JPanel>
    </JPanel>
  </JPanel>

    {/* Drawer móvil: hermano del header — nunca anidado bajo un ancestro con
        backdrop-filter/transform, que atraparía el `position: fixed`. */}
    {mobileOpen && (
      <JPanel variant="ghost" padding="none" radius="none" className="fixed inset-0 z-50 lg:hidden">
        <JPanel variant="ghost" padding="none" radius="none" className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onMobileClose} aria-hidden="true" />
        <JPanel variant="ghost" padding="none" radius="none" className="absolute left-0 top-0 flex h-full w-[85vw] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
          <JPanel variant="ghost" padding="none" radius="none" className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5">
            {brand}
            <button onClick={onMobileClose} aria-label="Cerrar menú" className="grid h-10 w-10 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100">
              <CloseIcon />
            </button>
          </JPanel>
          <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-6 p-5">
            {drawer}
          </JPanel>
        </JPanel>
      </JPanel>
    )}
  </>
);
