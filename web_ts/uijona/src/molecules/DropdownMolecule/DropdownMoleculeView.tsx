// DropdownMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { JSeparator } from '../../atoms/JSeparator';
import { InterDropdownMolecule, DropdownGroup } from './InterDropdownMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JButton } from '../../atoms/JButton/JButton';

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
    <JPanel variant="ghost" padding="none" radius="none" ref={triggerRef} className="inline-block" onClick={onTriggerClick}>{trigger}</JPanel>
    {open && createPortal(
      <JPanel variant="ghost" padding="none" radius="none" ref={menuRef} role="menu" style={menuStyle} className={cn('max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg', className)}>
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <JSeparator className="my-1" />}
            {group.label && <p className="px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide">{group.label}</p>}
            {group.items.map((item, ii) => (
              <JButton variant="ghost" key={ii} role="menuitem" type="button" aria-disabled={item.disabled || undefined}
                onClick={() => { if (item.disabled) { onDisabledItemClick?.(item.label); return; } onItemClick(item); }}
                className={cn('w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:bg-neutral-100',
                  item.disabled && 'cursor-not-allowed opacity-50',
                  item.variant === 'destructive' ? 'text-danger-500 hover:bg-red-50' : 'text-neutral-700 hover:bg-neutral-100')}
              >
                {item.icon && <span className="w-4 h-4 shrink-0" aria-hidden="true">{item.icon}</span>}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.shortcut && <span className="ml-auto shrink-0 text-xs text-neutral-400">{item.shortcut}</span>}
              </JButton>
            ))}
          </React.Fragment>
        ))}
      </JPanel>,
      document.body
    )}
  </>
);
