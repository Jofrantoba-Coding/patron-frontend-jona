import React from 'react';
import { cn } from '../lib/cn';

type TextAs = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4';
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
type TextColor = 'default' | 'muted' | 'danger' | 'success' | 'primary';

interface TextAtomProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextAs;
  size?: TextSize;
  color?: TextColor;
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl', '2xl': 'text-2xl font-semibold',
};

const colorClasses: Record<TextColor, string> = {
  default: 'text-neutral-900', muted: 'text-neutral-500', danger: 'text-danger-500', success: 'text-success-500', primary: 'text-primary-600',
};

export const TextAtom: React.FC<TextAtomProps> = ({ as: Tag = 'p', size = 'base', color = 'default', className, children, ...props }) => (
  <Tag className={cn(sizeClasses[size], colorClasses[color], className)} {...props}>{children}</Tag>
);
