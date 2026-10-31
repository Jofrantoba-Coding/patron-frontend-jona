// JAuthLayoutView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { JStepper } from '../../molecules/JStepper/JStepper';
import {
  FG, FG_MUTED, LINE, ON_PRIMARY, SURFACE_MUTED, SURFACE_RAISED, TEXT_BODY, TEXT_PAGE, TEXT_SECTION,
} from '../../theme/tokenClasses';
import { JAuthLayoutBrand, JAuthLayoutStep } from './InterJAuthLayout';

export interface JAuthLayoutViewProps {
  brand: JAuthLayoutBrand;
  steps?: JAuthLayoutStep[];
  /** The index of the current step, or -1 when none matches. */
  stepIndex: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const JAuthLayoutView: React.FC<JAuthLayoutViewProps> = ({
  brand, steps, stepIndex, title, description, children, footer,
}) => (
  <main className={cn('flex min-h-screen w-full min-w-0', SURFACE_MUTED)}>
    <div
      data-jauthlayout-brand=""
      className={cn('hidden w-2/5 max-w-xl shrink-0 flex-col justify-center gap-4 bg-primary-700 p-12 lg:flex', ON_PRIMARY)}
    >
      {brand.logo && <span className="flex h-12 w-12 items-center justify-center">{brand.logo}</span>}
      <p className="text-3xl font-semibold leading-tight">{brand.name}</p>
      {brand.tagline && <p className="text-lg leading-7 opacity-90">{brand.tagline}</p>}
    </div>
    <div className="flex min-w-0 flex-1 items-center justify-center px-4 py-8 sm:px-8">
      <div
        data-jauthlayout-card=""
        className={cn('flex w-full max-w-md flex-col gap-5 rounded-lg border p-6 shadow-sm sm:p-8', LINE, SURFACE_RAISED)}
      >
        <p className={cn('flex items-center gap-2', TEXT_SECTION, FG)}>
          {brand.logo && <span className="flex h-6 w-6 shrink-0 items-center justify-center">{brand.logo}</span>}
          <span className="min-w-0 truncate">{brand.name}</span>
        </p>
        {steps && steps.length > 0 && (
          <JStepper steps={steps} currentStep={Math.max(stepIndex, 0)} />
        )}
        <div className="flex flex-col gap-1">
          <h1 className={cn(TEXT_PAGE, FG)}>{title}</h1>
          {description && <p className={cn(TEXT_BODY, FG_MUTED)}>{description}</p>}
        </div>
        <div className="min-w-0">{children}</div>
        {footer && <div className={cn('border-t pt-4', LINE, TEXT_BODY, FG_MUTED)}>{footer}</div>}
      </div>
    </div>
  </main>
);
