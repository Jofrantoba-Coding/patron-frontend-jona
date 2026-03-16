// CardMolecule.tsx — Level 2: Molecule
// Inspired by shadcn/ui Card — composable header, content, footer slots.
import React from 'react';
import { cn } from '../lib/cn';

// Root card container
export const CardMolecule: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'rounded-token-lg border border-neutral-200 bg-white shadow-sm',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Card header zone
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props}>
    {children}
  </div>
);

// Card title
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn('text-lg font-semibold text-neutral-900 leading-none', className)}
    {...props}
  >
    {children}
  </h3>
);

// Card description
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-sm text-neutral-500', className)} {...props}>
    {children}
  </p>
);

// Card content zone
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

// Card footer zone
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center p-6 pt-0 gap-2', className)} {...props}>
    {children}
  </div>
);
