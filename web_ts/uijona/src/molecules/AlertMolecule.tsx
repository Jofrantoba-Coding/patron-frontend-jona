import React from 'react';
import { cn } from '../lib/cn';

type AlertVariant = 'default' | 'destructive';

interface AlertMoleculeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<AlertVariant, string> = {
  default:     'bg-neutral-50 border-neutral-200 text-neutral-900',
  destructive: 'bg-red-50 border-danger-500 text-danger-600',
};

export const AlertMolecule: React.FC<AlertMoleculeProps> = ({ variant = 'default', title, icon, className, children, ...props }) => (
  <div role="alert" className={cn('relative w-full rounded-md border p-4', icon && 'pl-11', variantClasses[variant], className)} {...props}>
    {icon && <span className="absolute left-4 top-4 text-current">{icon}</span>}
    {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
    {children && <div className="text-sm [&_p]:leading-relaxed">{children}</div>}
  </div>
);
