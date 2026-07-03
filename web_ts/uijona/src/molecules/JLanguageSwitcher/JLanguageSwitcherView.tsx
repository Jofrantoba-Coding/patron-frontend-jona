// JLanguageSwitcherView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JGlyph } from '../../atoms/JGlyph';
import { InterJLanguageSwitcher } from './InterJLanguageSwitcher';

export interface JLanguageSwitcherViewProps extends InterJLanguageSwitcher {
  open: boolean;
  onToggle: () => void;
  onSelect: (code: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const Globe = () => (
  <JGlyph size="sm" tone="muted">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
  </JGlyph>
);

export const JLanguageSwitcherView: React.FC<JLanguageSwitcherViewProps> = ({
  languages,
  value,
  open,
  onToggle,
  onSelect,
  triggerRef,
  menuRef,
  className,
  'aria-label': ariaLabel = 'Cambiar idioma',
}) => {
  const current = languages.find((l) => l.code === value) ?? languages[0];

  // Transición de entrada portátil (solo utilidades core de Tailwind).
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => {
    if (!open) { setEntered(false); return; }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <JPanel variant="ghost" padding="none" radius="none" className={cn('relative inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium uppercase transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
          open
            ? 'border-primary-300 bg-primary-50/60 text-neutral-900'
            : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',
        )}
      >
        <Globe />
        <span>{current?.code}</span>
        <JGlyph
          size="xs"
          tone="muted"
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        >
          <polyline points="6 9 12 15 18 9" />
        </JGlyph>
      </button>

      {open && (
        <JPanel
          ref={menuRef}
          role="listbox"
          aria-label={ariaLabel}
          variant="ghost"
          padding="none"
          radius="none"
          className={cn(
            'absolute right-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-lg',
            'origin-top-right transition duration-150 ease-out',
            entered ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          )}
        >
          {languages.map((l) => {
            const active = l.code === value;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => onSelect(l.code)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-100',
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide">{l.code}</span>
                  <span className="text-neutral-500">{l.label}</span>
                </span>
                {active && (
                  <JGlyph size="xs" tone="primary" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" />
                  </JGlyph>
                )}
              </button>
            );
          })}
        </JPanel>
      )}
    </JPanel>
  );
};
