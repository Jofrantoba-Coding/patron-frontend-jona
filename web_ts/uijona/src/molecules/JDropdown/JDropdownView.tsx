// JDropdownView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { JSeparator } from '../../atoms/JSeparator';
import { JButton } from '../../atoms/JButton/JButton';
import { InterJDropdown, JDropdownGroup } from './InterJDropdown';

export interface JDropdownViewProps extends InterJDropdown {
  open:           boolean;
  menuStyle:      React.CSSProperties;
  triggerRef:     React.RefObject<HTMLDivElement>;
  menuRef:        React.RefObject<HTMLDivElement>;
  onTriggerClick: () => void;
  onItemClick:    (item: JDropdownGroup['items'][number]) => void;
}

export const JDropdownView: React.FC<JDropdownViewProps> = ({
  trigger, groups, className, open, menuStyle, triggerRef, menuRef,
  onTriggerClick, onItemClick, onDisabledItemClick,
}) => (
  <>
    <div ref={triggerRef} className="inline-block" onClick={onTriggerClick}>
      {trigger}
    </div>

    {open && createPortal(
      <div
        ref={menuRef}
        role="menu"
        style={menuStyle}
        className={cn(
          'max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg',
          className,
        )}
      >
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <JSeparator className="my-1" />}
            {group.label && (
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {group.label}
              </p>
            )}
            {group.items.map((item, ii) => (
              <JButton
                key={ii}
                variant="ghost"
                role="menuitem"
                type="button"
                aria-disabled={item.disabled || undefined}
                onClick={() => {
                  if (item.disabled) { onDisabledItemClick?.(item.label); return; }
                  onItemClick(item);
                }}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors duration-150 focus-visible:bg-neutral-100 focus-visible:outline-none',
                  item.disabled && 'cursor-not-allowed opacity-50',
                  item.variant === 'destructive'
                    ? 'text-danger-500 hover:bg-red-50'
                    : 'text-neutral-700 hover:bg-neutral-100',
                )}
              >
                {item.icon && (
                  <span className="h-4 w-4 shrink-0" aria-hidden="true">{item.icon}</span>
                )}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.shortcut && (
                  <span className="ml-auto shrink-0 text-xs text-neutral-400">{item.shortcut}</span>
                )}
              </JButton>
            ))}
          </React.Fragment>
        ))}
      </div>,
      document.body,
    )}
  </>
);
