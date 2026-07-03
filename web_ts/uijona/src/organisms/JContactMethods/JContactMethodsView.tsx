// JContactMethodsView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { JContactMethodCard } from '../../molecules/JContactMethodCard/JContactMethodCard';
import { InterJContactMethods } from './InterJContactMethods';

export const JContactMethodsView: React.FC<InterJContactMethods> = ({
  methods,
  as = 'section',
  className,
}) => {
  const Tag = as;
  return (
    <Tag className={cn('w-full bg-white py-16 sm:py-20', className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          {methods.map((method) => (
            <JContactMethodCard
              key={method.label}
              icon={method.icon}
              label={method.label}
              description={method.description}
              href={method.href}
              actionLabel={method.actionLabel}
              isPrimary={method.isPrimary}
            />
          ))}
        </div>
      </div>
    </Tag>
  );
};
