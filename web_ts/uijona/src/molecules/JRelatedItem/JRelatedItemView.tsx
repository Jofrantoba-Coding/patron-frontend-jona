// JRelatedItemView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJRelatedItem } from './InterJRelatedItem';

export const JRelatedItemView: React.FC<InterJRelatedItem> = ({
  name,
  outcome,
  href,
  linkLabel,
  className,
}) => (
  <a
    href={href}
    className={cn(
      'flex min-w-0 flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-5 no-underline transition-shadow duration-200 hover:shadow-md',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
      className,
    )}
  >
    <strong className="text-base font-bold text-neutral-900">{name}</strong>
    <span className="text-sm leading-relaxed text-neutral-500">{outcome}</span>
    <span className="mt-1 text-sm font-semibold text-primary-600">{linkLabel}</span>
  </a>
);
