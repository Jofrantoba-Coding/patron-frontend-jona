// JContactMethodCardView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJContactMethodCard } from './InterJContactMethodCard';

export const JContactMethodCardView: React.FC<InterJContactMethodCard> = ({
  icon,
  label,
  description,
  href,
  actionLabel,
  isPrimary,
  className,
}) => (
  <div
    className={cn(
      'flex min-w-0 flex-col gap-2.5 rounded-2xl border p-7 transition-shadow duration-200 hover:shadow-lg',
      isPrimary
        ? 'border-primary-500 bg-primary-50'
        : 'border-neutral-200 bg-neutral-50',
      className,
    )}
  >
    <span className="text-3xl leading-none" aria-hidden="true">{icon}</span>
    <strong className="text-base font-bold text-neutral-900">{label}</strong>
    <p className="text-sm leading-relaxed text-neutral-500">{description}</p>
    {actionLabel ? (
      <a
        href={href}
        className="mt-2 inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-primary-600 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
      >
        {actionLabel}
      </a>
    ) : (
      <a
        href={href}
        className="mt-2 inline-flex w-fit items-center text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        {href}
      </a>
    )}
  </div>
);
