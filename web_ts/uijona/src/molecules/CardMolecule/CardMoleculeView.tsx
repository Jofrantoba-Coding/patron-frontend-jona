// CardMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

type CardTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>;
type CardDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>;

export const CardMoleculeView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('min-w-0 rounded-lg border border-neutral-200 bg-white shadow-sm', className)} {...props}>{children}</JPanel>
);

export const CardHeaderView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('flex min-w-0 flex-col gap-1.5 p-4 sm:p-6', className)} {...props}>{children}</JPanel>
);

export const CardTitleView: React.FC<CardTitleProps> = ({ className, children, ...props }) => (
  <TextAtom as="h3" className={cn('break-words text-lg font-semibold leading-tight text-neutral-900', className)} {...props}>{children}</TextAtom>
);

export const CardDescriptionView: React.FC<CardDescriptionProps> = ({ className, children, ...props }) => (
  <TextAtom className={cn('break-words text-sm text-neutral-500', className)} {...props}>{children}</TextAtom>
);

export const CardContentView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('min-w-0 p-4 pt-0 sm:p-6 sm:pt-0', className)} {...props}>{children}</JPanel>
);

export const CardFooterView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('flex min-w-0 flex-wrap items-center gap-2 p-4 pt-0 sm:p-6 sm:pt-0', className)} {...props}>{children}</JPanel>
);
