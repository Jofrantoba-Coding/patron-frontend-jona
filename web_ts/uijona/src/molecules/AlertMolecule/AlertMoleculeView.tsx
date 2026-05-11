// AlertMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterAlertMolecule, AlertVariant } from './InterAlertMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const variantClasses: Record<AlertVariant, string> = {
  default:     'bg-neutral-50 border-neutral-200 text-neutral-900',
  destructive: 'bg-red-50 border-danger-500 text-danger-600',
};

export const AlertMoleculeView: React.FC<InterAlertMolecule> = ({
  variant = 'default', title, icon, className, children, ...props
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none"
    role="alert"
    className={cn('relative w-full min-w-0 rounded-md border p-4', icon && 'pl-11', variantClasses[variant], className)}
    {...props}
  >
    {icon && <span className="absolute left-4 top-4 text-current">{icon}</span>}
    {title && <h5 className="mb-1 break-words font-medium leading-tight tracking-tight">{title}</h5>}
    {children && <PanelAtom variant="ghost" padding="none" radius="none" className="break-words text-sm [&_p]:leading-relaxed">{children}</PanelAtom>}
  </PanelAtom>
);
