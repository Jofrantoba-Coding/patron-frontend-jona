// JRatingView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJRating } from './InterJRating';

const sizeClasses: Record<NonNullable<InterJRating['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

export interface JRatingViewProps {
  value:        number;
  max:          number;
  readOnly:     boolean;
  size:         NonNullable<InterJRating['size']>;
  hovered:      number | null;
  className?:   string;
  onStarClick:  (star: number) => void;
  onStarEnter:  (star: number) => void;
  onStarLeave:  () => void;
}

export const JRatingView: React.FC<JRatingViewProps> = ({
  value, max, readOnly, size, hovered, className,
  onStarClick, onStarEnter, onStarLeave,
}) => {
  const active = hovered ?? value;

  return (
    // span nativo: evita los CSS variables de JPanel (flex-direction:column)
    // que rompían el layout horizontal de las estrellas
    <span
      role={readOnly ? 'img' : 'group'}
      aria-label={readOnly
        ? `Calificación: ${value} de ${max}`
        : `Selecciona calificación de ${max}`}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {Array.from({ length: max }, (_, i) => {
        const star   = i + 1;
        const filled = star <= active;
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} estrella${star !== 1 ? 's' : ''}`}
            aria-pressed={star === value}
            disabled={readOnly}
            onClick={() => onStarClick(star)}
            onMouseEnter={() => onStarEnter(star)}
            onMouseLeave={onStarLeave}
            className={cn(
              'rounded-sm transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
              readOnly ? 'pointer-events-none cursor-default' : 'cursor-pointer',
              sizeClasses[size],
            )}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={cn(
                'h-full w-full transition-colors duration-150',
                filled
                  ? 'fill-yellow-400 stroke-yellow-400'
                  : 'fill-neutral-200 stroke-neutral-300',
              )}
            >
              <path
                strokeWidth="1.5"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        );
      })}
    </span>
  );
};
