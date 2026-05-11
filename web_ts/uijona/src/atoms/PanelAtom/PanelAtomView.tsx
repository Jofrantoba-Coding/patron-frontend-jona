import React from 'react';
import { cn } from '../../lib/cn';
import {
  InterPanelAtom,
  PANEL_ATOM_DEFAULTS,
  PanelPadding,
  PanelRadius,
  PanelVariant,
} from './InterPanelAtom';

const variantClasses: Record<PanelVariant, string> = {
  default:  'bg-white border border-neutral-200',
  outlined: 'bg-transparent border border-neutral-300',
  elevated: 'bg-white shadow-md border-0',
  flat:     'bg-neutral-50 border-0',
  ghost:    'bg-transparent border-0',
};

const paddingClasses: Record<PanelPadding, string> = {
  none: 'p-0',
  sm:   'p-2',
  md:   'p-4',
  lg:   'p-6',
  xl:   'p-8',
};

const radiusClasses: Record<PanelRadius, string> = {
  none: 'rounded-none',
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  full: 'rounded-full',
};

const resolvePanelTag = (as?: React.ElementType): React.ElementType => {
  if (typeof as === 'string') {
    return as.trim() ? as : 'div';
  }

  return as ?? 'div';
};

export const PanelAtomView = React.forwardRef<HTMLDivElement, InterPanelAtom>(
  (
    {
      variant = PANEL_ATOM_DEFAULTS.variant,
      padding = PANEL_ATOM_DEFAULTS.padding,
      radius  = PANEL_ATOM_DEFAULTS.radius,
      as,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Tag = resolvePanelTag(as);

    return (
      <Tag
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          radiusClasses[radius],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
PanelAtomView.displayName = 'PanelAtomView';
