// JGlyphView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJGlyph, JGlyphSize, JGlyphTone } from './InterJGlyph';

const sizeClasses: Record<JGlyphSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-[1.125rem] w-[1.125rem]',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

const toneClasses: Record<JGlyphTone, string> = {
  current: '',
  primary: 'text-primary-600',
  accent:  'text-accent-600',
  neutral: 'text-neutral-700',
  muted:   'text-neutral-400',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger:  'text-danger-600',
};

export const JGlyphView: React.FC<InterJGlyph> = ({
  children,
  size = 'md',
  tone = 'current',
  viewBox = '0 0 24 24',
  strokeWidth = 2,
  filled = false,
  className,
  style,
  'aria-label': ariaLabel,
}) => {
  const isNumeric = typeof size === 'number';
  const a11y = ariaLabel
    ? { role: 'img' as const, 'aria-label': ariaLabel }
    : { 'aria-hidden': true as const };

  return (
    <svg
      viewBox={viewBox}
      width={isNumeric ? (size as number) : undefined}
      height={isNumeric ? (size as number) : undefined}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? undefined : 'currentColor'}
      strokeWidth={filled ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('jglyph inline-block shrink-0', !isNumeric && sizeClasses[size as JGlyphSize], toneClasses[tone], className)}
      style={style}
      {...a11y}
    >
      {children}
    </svg>
  );
};
