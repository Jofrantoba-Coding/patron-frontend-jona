// EmptyStateMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { InterEmptyStateMolecule } from './InterEmptyStateMolecule';

export const EmptyStateMoleculeView: React.FC<InterEmptyStateMolecule> = ({
  icon, title, description, actions, className, ...props
}) => (
  <div
    className={cn('flex w-full min-w-0 flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-white px-4 py-8 text-center sm:px-6 sm:py-10', className)}
    {...props}
  >
    {icon && (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        {icon}
      </div>
    )}
    <div className="flex max-w-md min-w-0 flex-col gap-1">
      <h3 className="break-words text-base font-semibold text-neutral-900">{title}</h3>
      {description && <p className="break-words text-sm text-neutral-500">{description}</p>}
    </div>
    {actions && actions.length > 0 && (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {actions.map((action) => (
          <ButtonAtom
            key={action.label}
            type="button"
            variant={action.variant === 'secondary' ? 'outline' : 'default'}
            onClick={action.onClick}
          >
            {action.label}
          </ButtonAtom>
        ))}
      </div>
    )}
  </div>
);
