// DropdownMolecule.tsx — Level 2: Molecule
// Inspired by shadcn/ui DropdownMenu — trigger + portal menu with groups, labels, separators.
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { SeparatorAtom } from '../atoms/SeparatorAtom';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownGroup {
  label?: string;
  items: DropdownItem[];
}

interface DropdownMoleculeProps {
  trigger: React.ReactNode;
  groups: DropdownGroup[];
  align?: 'start' | 'end';
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const DropdownMolecule: React.FC<DropdownMoleculeProps> = ({
  trigger,
  groups,
  align = 'start',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position menu below trigger
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      ...(align === 'end'
        ? { right: window.innerWidth - rect.right }
        : { left: rect.left }),
      minWidth: rect.width,
      zIndex: 50,
    });
  };

  // Close on outside click or ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const handleTriggerClick = () => {
    updatePosition();
    setOpen((v) => !v);
  };

  return (
    <>
      {/* Trigger wrapper */}
      <div ref={triggerRef} className="inline-block" onClick={handleTriggerClick}>
        {trigger}
      </div>

      {/* Menu portal */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={menuStyle}
            className={cn(
              'bg-white border border-neutral-200 rounded-token-md shadow-lg py-1',
              'min-w-[160px] max-w-xs',
              className
            )}
          >
            {groups.map((group, gi) => (
              <React.Fragment key={gi}>
                {gi > 0 && <SeparatorAtom className="my-1" />}
                {group.label && (
                  <p className="px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    {group.label}
                  </p>
                )}
                {group.items.map((item, ii) => (
                  <button
                    key={ii}
                    role="menuitem"
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (!item.disabled) {
                        item.onClick?.();
                        setOpen(false);
                      }
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left',
                      'transition-colors duration-150 cursor-pointer',
                      'focus-visible:outline-none focus-visible:bg-neutral-100',
                      'disabled:pointer-events-none disabled:opacity-50',
                      item.variant === 'destructive'
                        ? 'text-danger-500 hover:bg-red-50'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    )}
                  >
                    {item.icon && (
                      <span className="w-4 h-4 shrink-0" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <span className="text-xs text-neutral-400 ml-auto">{item.shortcut}</span>
                    )}
                  </button>
                ))}
              </React.Fragment>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};
