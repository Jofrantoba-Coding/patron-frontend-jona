// JAccordionView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJAccordion, JAccordionItem, JAccordionSize, JAccordionVariant } from './InterJAccordion';
import { JPanel } from '../../atoms/JPanel/JPanel';

// ── Style maps ────────────────────────────────────────────────────────────────

const TRIGGER_SIZE: Record<JAccordionSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-base',
};

const CONTENT_SIZE: Record<JAccordionSize, string> = {
  sm: 'px-3 pb-2 text-xs',
  md: 'px-4 pb-4 text-sm',
  lg: 'px-5 pb-5 text-base',
};

const CONTAINER_VARIANT: Record<JAccordionVariant, string> = {
  default:  'w-full divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white',
  bordered: 'w-full flex flex-col gap-2',
  ghost:    'w-full divide-y divide-neutral-100',
};

const ITEM_VARIANT: Record<JAccordionVariant, string> = {
  default:  '',
  bordered: 'rounded-md border border-neutral-200 bg-white overflow-hidden',
  ghost:    '',
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface JAccordionViewProps extends InterJAccordion {
  openValues:    string[];
  onItemToggle:  (item: JAccordionItem) => void;
}

// ── View ──────────────────────────────────────────────────────────────────────

export const JAccordionView: React.FC<JAccordionViewProps> = ({
  items,
  openValues,
  className,
  style,
  onItemToggle,
  variant = 'default',
  size    = 'md',
}) => (
  <JPanel
    variant="ghost"
    padding="none"
    className={cn(CONTAINER_VARIANT[variant], className)}
    style={style}
  >
    {items.map((item) => {
      const open     = openValues.includes(item.value);
      const buttonId = `jaccordion-trigger-${item.value}`;
      const panelId  = `jaccordion-panel-${item.value}`;

      return (
        <JPanel
          variant="ghost"
          padding="none"
          key={item.value}
          className={ITEM_VARIANT[variant]}
        >
          <h3>
            <button
              id={buttonId}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => onItemToggle(item)}
              className={cn(
                'flex w-full items-center justify-between gap-3 text-left font-medium text-neutral-900',
                'transition-colors hover:bg-neutral-50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                TRIGGER_SIZE[size],
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                {item.icon && (
                  <span className="shrink-0 text-neutral-500" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="truncate">{item.title}</span>
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  'shrink-0 text-neutral-400 transition-transform duration-200',
                  open && 'rotate-180',
                )}
              >
                ▾
              </span>
            </button>
          </h3>

          {/* Animación suave via CSS grid-template-rows */}
          <div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            style={{
              display: 'grid',
              gridTemplateRows: open ? '1fr' : '0fr',
              transition: 'grid-template-rows 200ms ease',
            }}
          >
            <div className="overflow-hidden">
              <div className={cn('text-neutral-600', CONTENT_SIZE[size])}>
                {item.content}
              </div>
            </div>
          </div>
        </JPanel>
      );
    })}
  </JPanel>
);
