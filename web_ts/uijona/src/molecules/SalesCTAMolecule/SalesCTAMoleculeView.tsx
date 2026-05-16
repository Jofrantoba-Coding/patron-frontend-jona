// SalesCTAMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { InterSalesCTAMolecule, SalesCTATone } from './InterSalesCTAMolecule';

const containerClasses: Record<SalesCTATone, string> = {
  brand: 'bg-primary-600',
  dark:  'bg-neutral-900',
  light: 'bg-neutral-50 border border-neutral-200',
};

const headingClasses: Record<SalesCTATone, string> = {
  brand: 'text-white',
  dark:  'text-white',
  light: 'text-neutral-900',
};

const descClasses: Record<SalesCTATone, string> = {
  brand: 'text-white/80',
  dark:  'text-white/70',
  light: 'text-neutral-600',
};

const primaryBtnClasses: Record<SalesCTATone, string> = {
  brand: 'bg-white text-primary-700 hover:bg-neutral-100',
  dark:  'bg-primary-600 text-white hover:bg-primary-700',
  light: 'bg-primary-600 text-white hover:bg-primary-700',
};

const secondaryBtnClasses: Record<SalesCTATone, string> = {
  brand: 'border border-white/40 text-white hover:bg-white/10',
  dark:  'border border-white/30 text-white hover:bg-white/10',
  light: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100',
};

export const SalesCTAMoleculeView: React.FC<InterSalesCTAMolecule> = ({
  heading,
  description,
  primaryLabel,
  primaryHref,
  onPrimaryClick,
  secondaryLabel,
  secondaryHref,
  onSecondaryClick,
  tone = 'brand',
  className,
  ...props
}) => (
  <div
    className={cn(
      'min-w-0 rounded-2xl px-6 py-10 sm:px-10 sm:py-14',
      containerClasses[tone],
      className
    )}
    {...props}
  >
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className={cn('text-2xl font-bold leading-tight sm:text-3xl', headingClasses[tone])}>
          {heading}
        </h2>
        {description && (
          <p className={cn('mt-2 text-base leading-relaxed', descClasses[tone])}>
            {description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        {primaryHref ? (
          <a
            href={primaryHref}
            className={cn(
              'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200',
              primaryBtnClasses[tone]
            )}
          >
            {primaryLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onPrimaryClick}
            className={cn(
              'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200',
              primaryBtnClasses[tone]
            )}
          >
            {primaryLabel}
          </button>
        )}
        {secondaryLabel && (
          secondaryHref ? (
            <a
              href={secondaryHref}
              className={cn(
                'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200',
                secondaryBtnClasses[tone]
              )}
            >
              {secondaryLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={onSecondaryClick}
              className={cn(
                'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200',
                secondaryBtnClasses[tone]
              )}
            >
              {secondaryLabel}
            </button>
          )
        )}
      </div>
    </div>
  </div>
);
