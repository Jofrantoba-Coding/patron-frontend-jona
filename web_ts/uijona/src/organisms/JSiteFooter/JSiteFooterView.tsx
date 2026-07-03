// JSiteFooterView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJSiteFooter } from './InterJSiteFooter';

export const JSiteFooterView: React.FC<InterJSiteFooter> = ({
  copyright,
  links,
  className,
}) => (
  <footer
    className={cn(
      'mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-4 py-7 text-sm text-neutral-500',
      className,
    )}
  >
    <span>{copyright}</span>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="font-medium text-neutral-500 no-underline transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {link.label}
        </a>
      ))}
    </div>
  </footer>
);
