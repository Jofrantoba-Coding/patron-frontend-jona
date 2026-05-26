// JProgressItemView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJProgressItem, JProgressItemVariant, JProgressItemSize } from './InterJProgressItem';
import { JProgress } from '../../atoms/JProgress';
import { JPanel } from '../../atoms/JPanel/JPanel';

// ── Style maps ────────────────────────────────────────────────────────────────

const TEXT_SIZE: Record<JProgressItemSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const CARD_PADDING: Record<JProgressItemSize, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

const VALUE_COLOR: Record<JProgressItemVariant, string> = {
  default: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-warning-500',
  danger:  'text-danger-500',
};

// ── View ──────────────────────────────────────────────────────────────────────

export const JProgressItemView: React.FC<InterJProgressItem> = ({
  label,
  value,
  max       = 100,
  variant   = 'default',
  size      = 'md',
  showValue = true,
  className,
  style,
}) => {
  const pct = Math.min(100, Math.max(0, max > 0 ? Math.round((value / max) * 100) : 0));

  return (
    <JPanel
      variant="ghost"
      padding="none"
      className={cn(
        'w-full rounded-lg border border-neutral-200 bg-white',
        CARD_PADDING[size],
        className,
      )}
      style={style}
    >
      <JPanel variant="ghost" padding="none" className="mb-2 flex items-center justify-between gap-2">
        <span className={cn('font-medium text-neutral-800 leading-snug', TEXT_SIZE[size])}>
          {label}
        </span>
        {showValue && (
          <span className={cn('shrink-0 tabular-nums font-semibold', TEXT_SIZE[size], VALUE_COLOR[variant])}>
            {pct}%
          </span>
        )}
      </JPanel>

      <JProgress value={value} max={max} variant={variant} size={size} />
    </JPanel>
  );
};
