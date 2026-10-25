// JDrawerView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton';
import { InterJDrawer, JDrawerSide } from './InterJDrawer';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { BACKDROP, FG, FG_MUTED, LINE, SURFACE_RAISED, TEXT_SECTION } from '../../theme/tokenClasses';

const sideStyles: Record<JDrawerSide, { panel: string; open: string }> = {
  right:  { panel: 'inset-y-0 right-0 h-full flex-col', open: 'translate-x-0' },
  left:   { panel: 'inset-y-0 left-0 h-full flex-col',  open: 'translate-x-0' },
  top:    { panel: 'inset-x-0 top-0 w-full flex-col',   open: 'translate-y-0' },
  bottom: { panel: 'inset-x-0 bottom-0 w-full flex-col', open: 'translate-y-0' },
};

const sideHidden: Record<JDrawerSide, string> = {
  right:  'translate-x-full',
  left:   '-translate-x-full',
  top:    '-translate-y-full',
  bottom: 'translate-y-full',
};

const sizeStyles: Record<string, Record<JDrawerSide, string>> = {
  sm:   { right: 'w-64',   left: 'w-64',   top: 'h-48',  bottom: 'h-48'  },
  md:   { right: 'w-80',   left: 'w-80',   top: 'h-64',  bottom: 'h-64'  },
  lg:   { right: 'w-[28rem]', left: 'w-[28rem]', top: 'h-80', bottom: 'h-80' },
  full: { right: 'w-full', left: 'w-full', top: 'h-full', bottom: 'h-full' },
};

interface JDrawerViewProps extends Required<Pick<InterJDrawer, 'open' | 'side' | 'size' | 'showCloseButton' | 'onClose'>> {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onOverlayClick: () => void;
  panelRef: React.RefObject<HTMLDivElement>;
  onPanelKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export const JDrawerView: React.FC<JDrawerViewProps> = ({
  open, side, size, showCloseButton, title, description, className, children, footer,
  onOverlayClick, onClose, panelRef, onPanelKeyDown,
}) => {
  const { panel } = sideStyles[side];
  const hiddenClass = sideHidden[side];
  const sizeClass = sizeStyles[size][side];
  const isHorizontal = side === 'left' || side === 'right';

  return createPortal(
    <>
      {/* Overlay */}
      <JPanel variant="ghost" padding="none" radius="none"
        aria-hidden="true"
        onClick={onOverlayClick}
        className={cn(
          `fixed inset-0 z-40 ${BACKDROP} transition-opacity duration-300`,
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />
      {/* Panel — a modal dialog only while open (it stays mounted to animate) */}
      <JPanel variant="ghost" padding="none" radius="none"
        ref={panelRef}
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
        aria-labelledby={open && title ? 'drawer-title' : undefined}
        aria-describedby={open && description ? 'drawer-desc' : undefined}
        tabIndex={-1}
        onKeyDown={onPanelKeyDown}
        className={cn(
          `fixed z-50 flex ${SURFACE_RAISED} shadow-xl transition-transform duration-300 ease-in-out focus:outline-none`,
          panel,
          sizeClass,
          // Nunca exceder el viewport en pantallas más estrechas/bajas que el panel
          // (dvh descuenta la barra del navegador móvil)
          isHorizontal ? 'max-w-[85vw]' : 'max-h-[85dvh]',
          open ? sideStyles[side].open : hiddenClass,
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <JPanel variant="ghost" padding="none" radius="none" className={`flex flex-row shrink-0 items-start justify-between gap-4 border-b ${LINE} p-4 sm:p-5`}>
            <JPanel variant="ghost" padding="none" radius="none" className="flex min-w-0 flex-col gap-0.5">
              {title && <h2 id="drawer-title" className={`break-words ${TEXT_SECTION} ${FG}`}>{title}</h2>}
              {description && <p id="drawer-desc" className={`break-words text-sm ${FG_MUTED}`}>{description}</p>}
            </JPanel>
            {showCloseButton && (
              <JButton variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar panel" className="shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </JButton>
            )}
          </JPanel>
        )}
        {/* Body */}
        <JPanel variant="ghost" padding="none" radius="none" className={cn('min-h-0 flex-1 overflow-y-auto p-4 sm:p-5', !isHorizontal && 'overflow-x-auto')}>
          {children}
        </JPanel>
        {/* Footer */}
        {footer && (
          <JPanel variant="ghost" padding="none" radius="none" className={`flex shrink-0 flex-col-reverse gap-2 border-t ${LINE} p-4 sm:flex-row sm:justify-end sm:p-5`}>
            {footer}
          </JPanel>
        )}
      </JPanel>
    </>,
    document.body
  );
};
