// JPageHeaderView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { FG, FG_MUTED, FOCUS_RING, HOVER_FG, TEXT_PAGE, TEXT_SMALL } from '../../theme/tokenClasses';
import { JPageHeaderCrumb, JPageHeaderLevel } from './InterJPageHeader';

export interface JPageHeaderViewProps {
  title: string;
  count?: number;
  breadcrumbs?: JPageHeaderCrumb[];
  breadcrumbLabel: string;
  actions?: React.ReactNode;
  search?: React.ReactNode;
  headingLevel: JPageHeaderLevel;
  onBreadcrumbSelect?: (id: string) => void;
  forwardedRef?: React.Ref<HTMLHeadingElement>;
}

const Crumb: React.FC<{ crumb: JPageHeaderCrumb; current: boolean; onSelect?: (id: string) => void }> = ({
  crumb, current, onSelect,
}) => {
  if (current) return <span aria-current="page" className={cn('font-medium', FG)}>{crumb.label}</span>;
  if (!onSelect) return <span>{crumb.label}</span>;
  return (
    <button
      type="button"
      onClick={() => onSelect(crumb.id)}
      className={cn('rounded-sm underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2', HOVER_FG, FOCUS_RING)}
    >
      {crumb.label}
    </button>
  );
};

export const JPageHeaderView: React.FC<JPageHeaderViewProps> = ({
  title, count, breadcrumbs, breadcrumbLabel, actions, search, headingLevel, onBreadcrumbSelect, forwardedRef,
}) => {
  const Heading = `h${headingLevel}` as 'h1';
  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label={breadcrumbLabel}>
          <ol className={cn('flex flex-row flex-wrap items-center gap-1.5', TEXT_SMALL, FG_MUTED)}>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.id} className="inline-flex items-center gap-1.5">
                {index > 0 && <span aria-hidden="true">/</span>}
                <Crumb crumb={crumb} current={index === breadcrumbs.length - 1} onSelect={onBreadcrumbSelect} />
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-row items-baseline gap-2">
          <Heading ref={forwardedRef} tabIndex={-1} className={cn('min-w-0 break-words focus:outline-none', TEXT_PAGE, FG)}>
            {title}
          </Heading>
          {count !== undefined && <span className={cn('shrink-0 tabular-nums', TEXT_SMALL, FG_MUTED)}>{`(${count})`}</span>}
        </div>
        {actions && <div className="flex flex-row flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {search && <div className="w-full min-w-0">{search}</div>}
    </div>
  );
};
