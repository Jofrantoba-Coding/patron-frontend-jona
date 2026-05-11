// CardMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

export const CardMoleculeView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('min-w-0 rounded-lg border border-neutral-200 bg-white shadow-sm', className)} {...props}>{children}</PanelAtom>
);

export const CardHeaderView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('flex min-w-0 flex-col gap-1.5 p-4 sm:p-6', className)} {...props}>{children}</PanelAtom>
);

export const CardTitleView: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={cn('break-words text-lg font-semibold leading-tight text-neutral-900', className)} {...props}>{children}</h3>
);

export const CardDescriptionView: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={cn('break-words text-sm text-neutral-500', className)} {...props}>{children}</p>
);

export const CardContentView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('min-w-0 p-4 pt-0 sm:p-6 sm:pt-0', className)} {...props}>{children}</PanelAtom>
);

export const CardFooterView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('flex min-w-0 flex-wrap items-center gap-2 p-4 pt-0 sm:p-6 sm:pt-0', className)} {...props}>{children}</PanelAtom>
);
