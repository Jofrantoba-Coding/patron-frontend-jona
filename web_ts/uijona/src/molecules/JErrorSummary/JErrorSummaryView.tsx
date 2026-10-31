// JErrorSummaryView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { DANGER_BG, DANGER_FG, FOCUS_RING, TEXT_BODY } from '../../theme/tokenClasses';
import { JErrorSummaryItem } from './InterJErrorSummary';

export interface JErrorSummaryViewProps {
  title: string;
  errors: JErrorSummaryItem[];
  onSelect: (field: string) => void;
}

/** A single live region; it never takes focus (R-FRM-4). */
export const JErrorSummaryView: React.FC<JErrorSummaryViewProps> = ({ title, errors, onSelect }) => (
  <div role="alert" className={cn('w-full min-w-0 rounded-md border border-danger-500 p-3', DANGER_BG, DANGER_FG, TEXT_BODY)}>
    <p className="font-semibold">{title}</p>
    <ul className="mt-1 flex flex-col gap-0.5">
      {errors.map((error) => (
        <li key={error.field}>
          <button
            type="button"
            onClick={() => onSelect(error.field)}
            className={cn(
              'break-words text-left underline underline-offset-2 rounded-sm',
              'focus-visible:outline-none focus-visible:ring-2',
              FOCUS_RING,
            )}
          >
            {`${error.label}: ${error.message}`}
          </button>
        </li>
      ))}
    </ul>
  </div>
);
