import React, { useState } from 'react';
import { cn } from '../../lib/cn';
import { JCHIP_DEFAULTS, InterJChip, JChipVariant } from './InterJChip';

const variantClasses: Record<JChipVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  primary:  'bg-primary-50 text-primary-700 border-primary-200',
  success:  'bg-green-50 text-success-600 border-green-200',
  warning:  'bg-yellow-50 text-warning-600 border-yellow-200',
  danger:   'bg-red-50 text-danger-600 border-red-200',
};

type JChipViewProps = InterJChip &
  Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'children' | 'onClick'> & {
    forwardedRef?: React.Ref<HTMLSpanElement>;
  };

export const JChipView: React.FC<JChipViewProps> = ({
  variant = JCHIP_DEFAULTS.variant,
  selected,
  removable = JCHIP_DEFAULTS.removable,
  onRemove,
  id,
  className,
  style,
  children,
  onClick,
  forwardedRef,
  ...htmlProps
}) => {
  const [internalSelected, setInternalSelected] = useState(false);
  const effectiveSelected = selected ?? internalSelected;

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (selected === undefined) setInternalSelected((s) => !s);
    onClick?.(e);
  };

  return (
    <span
      ref={forwardedRef}
      id={id}
      data-jchip-variant={variant}
      data-jchip-selected={effectiveSelected || undefined}
      className={cn(
        'jchip',
        'inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium cursor-pointer',
        'data-[jchip-selected=true]:ring-2 data-[jchip-selected=true]:ring-primary-500 data-[jchip-selected=true]:ring-offset-1',
        variantClasses[variant],
        className
      )}
      style={style}
      onClick={handleClick}
      {...htmlProps}
    >
      {children}
      {removable && (
        <button
          type="button"
          aria-label="Remove"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
        >
          ×
        </button>
      )}
    </span>
  );
};

JChipView.displayName = 'JChipView';
