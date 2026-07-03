// JCaseStudiesView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { JSectionHeading } from '../../molecules/JSectionHeading/JSectionHeading';
import { InterJCaseStudies, CaseStudyItem } from './InterJCaseStudies';

const CaseCard: React.FC<{ item: CaseStudyItem }> = ({ item }) => {
  const { sector, title, outcome, metrics, tags, href, linkLabel = 'Ver caso →' } = item;
  const inner = (
    <>
      {sector && (
        <span className="inline-flex w-fit rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
          {sector}
        </span>
      )}
      <strong className="text-lg font-bold leading-snug text-neutral-900">{title}</strong>
      <p className="text-sm leading-relaxed text-neutral-500">{outcome}</p>

      {metrics && metrics.length > 0 && (
        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-0.5">
              <strong className="text-xl font-black leading-none text-neutral-900">{m.value}</strong>
              <span className="text-xs leading-tight text-neutral-500">{m.label}</span>
            </div>
          ))}
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
              {t}
            </span>
          ))}
        </div>
      )}

      {href && (
        <span className="mt-1 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
          {linkLabel}
        </span>
      )}
    </>
  );

  const cardClass =
    'group flex min-w-0 flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow duration-200 hover:shadow-lg';

  return href ? (
    <a
      href={href}
      className={cn(
        cardClass,
        'no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
      )}
    >
      {inner}
    </a>
  ) : (
    <div className={cardClass}>{inner}</div>
  );
};

export const JCaseStudiesView: React.FC<InterJCaseStudies> = ({
  eyebrow,
  heading,
  description,
  items,
  as = 'section',
  className,
}) => {
  const Tag = as;
  return (
    <Tag className={cn('w-full bg-neutral-50 py-16 sm:py-20', className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <JSectionHeading eyebrow={eyebrow} heading={heading} description={description} className="mb-10" />
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {items.map((item) => (
            <CaseCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </Tag>
  );
};
