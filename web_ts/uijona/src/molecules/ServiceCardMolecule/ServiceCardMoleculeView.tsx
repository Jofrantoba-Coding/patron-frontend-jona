// ServiceCardMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { InterServiceCardMolecule } from './InterServiceCardMolecule';

export const ServiceCardMoleculeView: React.FC<InterServiceCardMolecule> = ({
  icon,
  title,
  description,
  tags,
  href,
  className,
  ...props
}) => {
  const inner = (
    <div
      className={cn(
        'group flex min-w-0 flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm',
        'transition-shadow duration-200 hover:shadow-md',
        href && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="text-2xl leading-none" aria-hidden="true">
          {icon}
        </span>
      )}
      <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
        {title}
      </h3>
      <p className="flex-1 text-sm leading-relaxed text-neutral-600">{description}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block min-w-0 no-underline">
        {inner}
      </a>
    );
  }

  return inner;
};
