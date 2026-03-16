// BreadcrumbMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterBreadcrumbLink } from './InterBreadcrumbMolecule';

export const BreadcrumbMoleculeView: React.FC<React.HTMLAttributes<HTMLElement>> = ({ className, ...props }) => (
  <nav aria-label="breadcrumb" className={cn('flex', className)} {...props} />
);

export const BreadcrumbListView: React.FC<React.OlHTMLAttributes<HTMLOListElement>> = ({ className, ...props }) => (
  <ol className={cn('flex flex-wrap items-center gap-1.5 text-sm text-neutral-500', className)} {...props} />
);

export const BreadcrumbItemView: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({ className, ...props }) => (
  <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
);

export const BreadcrumbLinkView: React.FC<InterBreadcrumbLink> = ({ className, onNavigate, onClick, children, href, ...props }) => (
  <a
    href={href ?? '#'}
    onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(); } onClick?.(e); }}
    className={cn('transition-colors hover:text-neutral-900 cursor-pointer', className)}
    {...props}
  >{children}</a>
);

export const BreadcrumbPageView: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span role="link" aria-current="page" aria-disabled="true" className={cn('font-medium text-neutral-900', className)} {...props} />
);

export const BreadcrumbSeparatorView: React.FC<React.HTMLAttributes<HTMLLIElement>> = ({ className, children, ...props }) => (
  <li role="presentation" aria-hidden="true" className={cn('text-neutral-400 select-none', className)} {...props}>
    {children ?? <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>}
  </li>
);

export const BreadcrumbEllipsisView: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span role="presentation" aria-hidden="true" className={cn('flex h-5 w-5 items-center justify-center text-neutral-400', className)} {...props}>···</span>
);
