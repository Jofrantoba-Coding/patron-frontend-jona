// CardMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';

export const CardMoleculeView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('rounded-lg border border-neutral-200 bg-white shadow-sm', className)} {...props}>{children}</div>
);

export const CardHeaderView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props}>{children}</div>
);

export const CardTitleView: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg font-semibold text-neutral-900 leading-none', className)} {...props}>{children}</h3>
);

export const CardDescriptionView: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-neutral-500', className)} {...props}>{children}</p>
);

export const CardContentView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>{children}</div>
);

export const CardFooterView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0 gap-2', className)} {...props}>{children}</div>
);
