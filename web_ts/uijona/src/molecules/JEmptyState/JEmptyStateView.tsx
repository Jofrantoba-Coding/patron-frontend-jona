// JEmptyStateView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton';
import { InterJEmptyState } from './InterJEmptyState';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { CONTROL_BORDER, FG, FG_MUTED, SURFACE, SURFACE_MUTED } from '../../theme/tokenClasses';

export const JEmptyStateView: React.FC<InterJEmptyState> = ({
  icon, title, description, actions, className, ...props
}) => (
  <JPanel variant="ghost" padding="none" radius="none"
    className={cn(`flex w-full min-w-0 flex-col items-center justify-center gap-4 rounded-md border border-dashed ${CONTROL_BORDER} ${SURFACE} px-4 py-8 text-center sm:px-6 sm:py-10`, className)}
    {...props}
  >
    {icon && (
      <JPanel variant="ghost" padding="none" radius="none" className={`flex flex-row h-12 w-12 items-center justify-center rounded-full ${SURFACE_MUTED} ${FG_MUTED}`}>
        {icon}
      </JPanel>
    )}
    <JPanel variant="ghost" padding="none" radius="none" className="flex max-w-md min-w-0 flex-col gap-1">
      <h3 className={`break-words text-base font-semibold ${FG}`}>{title}</h3>
      {description && <p className={`break-words text-sm ${FG_MUTED}`}>{description}</p>}
    </JPanel>
    {actions && actions.length > 0 && (
      <JPanel variant="ghost" padding="none" radius="none" className="flex flex-row flex-wrap items-center justify-center gap-2">
        {actions.map((action) => (
          <JButton
            key={action.label}
            type="button"
            variant={action.variant === 'secondary' ? 'outline' : 'default'}
            onClick={action.onClick}
          >
            {action.label}
          </JButton>
        ))}
      </JPanel>
    )}
  </JPanel>
);
