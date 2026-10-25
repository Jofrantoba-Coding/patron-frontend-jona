// JStepperView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJStepper, JStepperStepStatus } from './InterJStepper';
import { CONTROL_BORDER, FG, FG_MUTED, ON_PRIMARY, SURFACE } from '../../theme/tokenClasses';

export type JStepperViewProps = Omit<InterJStepper, 'currentStep' | 'defaultStep' | 'onStepChange'> & {
  activeStep:  number;
  onStepClick: (stepIndex: number) => void;
};

const getStatus = (index: number, activeStep: number): JStepperStepStatus => {
  if (index < activeStep)  return 'complete';
  if (index === activeStep) return 'current';
  return 'upcoming';
};

const CheckIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m20 6-11 11-5-5" />
  </svg>
);

export const JStepperView: React.FC<JStepperViewProps> = ({
  steps, activeStep, orientation = 'horizontal', allowStepClick = false, onStepClick, className, ...props
}) => (
  <ol
    className={cn(
      orientation === 'vertical'
        ? 'flex min-w-0 flex-col gap-4'
        : 'flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start',
      className,
    )}
    {...props}
  >
    {steps.map((step, index) => {
      const status      = getStatus(index, activeStep);
      const isClickable = allowStepClick && !step.disabled;

      const indicatorCn = cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
        status === 'complete'  && `border-primary-600 bg-primary-600 ${ON_PRIMARY}`,
        status === 'current'   && `border-primary-600 ${SURFACE} text-primary-700`,
        status === 'upcoming'  && `${CONTROL_BORDER} ${SURFACE} ${FG_MUTED}`,
        step.disabled          && 'opacity-50',
      );

      const content = (
        <>
          <span className={indicatorCn}>
            {status === 'complete' ? <CheckIcon /> : index + 1}
          </span>
          <span className="min-w-0">
            <span className={cn('block break-words text-sm font-medium', status === 'current' ? `${FG}` : `${FG}`)}>
              {step.label}
            </span>
            {step.description && (
              <span className={`mt-0.5 block break-words text-sm ${FG_MUTED}`}>{step.description}</span>
            )}
          </span>
        </>
      );

      return (
        <li
          key={step.id}
          className={cn(
            'relative flex min-w-0 gap-3',
            orientation === 'horizontal' && 'sm:flex-1',
            step.disabled && 'opacity-60',
          )}
          aria-current={status === 'current' ? 'step' : undefined}
        >
          {isClickable ? (
            <button
              type="button"
              disabled={step.disabled}
              onClick={() => onStepClick(index)}
              className="flex min-w-0 gap-3 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {content}
            </button>
          ) : (
            <div className="flex min-w-0 gap-3">{content}</div>
          )}
        </li>
      );
    })}
  </ol>
);
