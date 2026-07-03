// JServiceCardView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJServiceCard } from './InterJServiceCard';

export const JServiceCardView: React.FC<InterJServiceCard> = ({
  icon,
  title,
  description,
  proof,
  href,
  className,
}) => {
  const cardClass = cn(
    'group flex min-w-0 flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 no-underline transition-all duration-200',
    href && 'hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
    className,
  );

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-xl leading-none" aria-hidden="true">{icon}</span>}
          <h3 className="text-base font-bold text-neutral-900 group-hover:text-primary-700">{title}</h3>
        </div>
        {href && (
          <span className="mt-0.5 shrink-0 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary-500" aria-hidden="true">→</span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
      {proof && (
        <p className="mt-auto border-t border-neutral-100 pt-3 text-xs leading-relaxed text-neutral-500">{proof}</p>
      )}
    </>
  );

  return href ? (
    <a href={href} className={cardClass}>{body}</a>
  ) : (
    <div className={cardClass}>{body}</div>
  );
};
