// DropdownMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { SeparatorAtom } from '../../atoms/SeparatorAtom';
import { InterDropdownMolecule, DropdownGroup } from './InterDropdownMolecule';

interface DropdownMoleculeViewProps extends InterDropdownMolecule {
  open: boolean;
  menuStyle: React.CSSProperties;
  triggerRef: React.RefObject<HTMLDivElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  onTriggerClick: () => void;
  onItemClick: (group: DropdownGroup['items'][number]) => void;
}

export const DropdownMoleculeView: React.FC<DropdownMoleculeViewProps> = ({
  trigger, groups, className, open, menuStyle, triggerRef, menuRef, onTriggerClick, onItemClick, onDisabledItemClick,
}) => (
  <>
    <div ref={triggerRef} className="inline-block" onClick={onTriggerClick}>{trigger}</div>
    {open && createPortal(
      <div ref={menuRef} role="menu" style={menuStyle} className={cn('bg-white border border-neutral-200 rounded-md shadow-lg py-1 min-w-[160px] max-w-xs', className)}>
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <SeparatorAtom className="my-1" />}
            {group.label && <p className="px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide">{group.label}</p>}
            {group.items.map((item, ii) => (
              <button key={ii} role="menuitem" type="button" disabled={item.disabled}
                onClick={() => { if (item.disabled) { onDisabledItemClick?.(item.label); return; } onItemClick(item); }}
                className={cn('w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:bg-neutral-100 disabled:pointer-events-none disabled:opacity-50',
                  item.variant === 'destructive' ? 'text-danger-500 hover:bg-red-50' : 'text-neutral-700 hover:bg-neutral-100')}
              >
                {item.icon && <span className="w-4 h-4 shrink-0" aria-hidden="true">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && <span className="text-xs text-neutral-400 ml-auto">{item.shortcut}</span>}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>,
      document.body
    )}
  </>
);
