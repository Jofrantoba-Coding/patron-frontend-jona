// JInputGroupView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { JInputGroupPreset } from './InterJInputGroup';

export interface JInputGroupViewProps {
  children: React.ReactNode;
  addonStart?: React.ReactNode;
  addonEnd?: React.ReactNode;
  preset: JInputGroupPreset;
  /** The resolved template; without it the group is one flex row. */
  template?: string;
  ariaLabel?: string;
  invalid?: boolean;
}

const LAYOUT_CLASSES = {
  row: 'flex flex-row items-center gap-2',
  grid: 'grid grid-cols-1 gap-2 sm:grid-cols-[var(--jona-input-group-columns)] sm:items-center',
  lookup: 'grid grid-cols-1 gap-2 sm:grid-cols-[var(--jona-input-group-columns)] sm:items-end',
};

export const JInputGroupView: React.FC<JInputGroupViewProps> = ({
  children, addonStart, addonEnd, preset, template, ariaLabel, invalid,
}) => {
  const layout = !template ? 'row' : preset === 'lookup' ? 'lookup' : 'grid';
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-invalid={invalid ? 'true' : undefined}
      style={template ? ({ '--jona-input-group-columns': template } as React.CSSProperties) : undefined}
      className={cn(
        'w-full min-w-0 max-w-full',
        LAYOUT_CLASSES[layout],
        invalid && 'rounded-md outline outline-1 outline-offset-2 outline-danger-500',
      )}
    >
      {addonStart !== undefined && <div className="flex min-w-0 shrink-0 flex-row items-center gap-1">{addonStart}</div>}
      {children}
      {addonEnd !== undefined && <div className="flex min-w-0 shrink-0 flex-row items-center gap-1">{addonEnd}</div>}
    </div>
  );
};
