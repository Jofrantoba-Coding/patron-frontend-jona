import React from 'react';
import { cn } from '../../lib/cn';
import {
  InterTimerMolecule,
  TimerMoleculeFormatContext,
  TimerMoleculeSize,
  TimerMoleculeStatus,
  TimerMoleculeTone,
  TimerMoleculeVariant,
} from './InterTimerMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';

const variantClasses: Record<TimerMoleculeVariant, string> = {
  plain: 'bg-transparent',
  card: 'rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5',
  inline: 'inline-flex items-center gap-3',
};

const sizeClasses: Record<TimerMoleculeSize, { display: string; label: string; button: string }> = {
  sm: {
    display: 'text-xl',
    label: 'text-xs',
    button: 'h-8 px-3 text-xs',
  },
  md: {
    display: 'text-3xl',
    label: 'text-sm',
    button: 'h-9 px-3 text-sm',
  },
  lg: {
    display: 'text-5xl',
    label: 'text-base',
    button: 'h-10 px-4 text-sm',
  },
};

const toneClasses: Record<TimerMoleculeTone, string> = {
  neutral: 'text-neutral-900',
  success: 'text-success-700',
  warning: 'text-warning-700',
  danger: 'text-danger-700',
  info: 'text-primary-700',
};

const statusText: Record<TimerMoleculeStatus, string> = {
  idle: 'Idle',
  running: 'Running',
  paused: 'Paused',
  completed: 'Completed',
};

interface TimerMoleculeViewProps extends InterTimerMolecule {
  status: TimerMoleculeStatus;
  context: TimerMoleculeFormatContext;
  displayValue: React.ReactNode;
  canStart: boolean;
  canPause: boolean;
  canResume: boolean;
  onStartClick: () => void;
  onPauseClick: () => void;
  onResumeClick: () => void;
  onResetClick: () => void;
}

export const TimerMoleculeView: React.FC<TimerMoleculeViewProps> = ({
  status,
  context,
  displayValue,
  canStart,
  canPause,
  canResume,
  onStartClick,
  onPauseClick,
  onResumeClick,
  onResetClick,
  mode: _mode,
  valueMs: _valueMs,
  defaultValueMs: _defaultValueMs,
  durationMs: _durationMs,
  minMs: _minMs,
  maxMs: _maxMs,
  autoStart: _autoStart,
  tickIntervalMs: _tickIntervalMs,
  resetOnComplete: _resetOnComplete,
  loop: _loop,
  showHours: _showHours,
  showMilliseconds: _showMilliseconds,
  padHours: _padHours,
  formatter: _formatter,
  onChange: _onChange,
  onTick: _onTick,
  onStart: _onStart,
  onPause: _onPause,
  onResume: _onResume,
  onReset: _onReset,
  onComplete: _onComplete,
  controls = true,
  label,
  completedLabel,
  startLabel = 'Iniciar',
  pauseLabel = 'Pausar',
  resumeLabel = 'Continuar',
  resetLabel = 'Reiniciar',
  variant = 'card',
  size = 'md',
  tone = 'neutral',
  className,
  ...props
}) => {
  const isInline = variant === 'inline';

  return (
    <JPanel variant="ghost" padding="none" radius="none"
      className={cn(
        'min-w-0',
        variantClasses[variant],
        !isInline && 'flex flex-col gap-3',
        className
      )}
      data-status={status}
      data-mode={context.mode}
      {...props}
    >
      {(label || completedLabel) && !isInline && (
        <JPanel variant="ghost" padding="none" radius="none" className="min-w-0">
          {label && <p className={cn('break-words font-medium text-neutral-500', sizeClasses[size].label)}>{label}</p>}
          {status === 'completed' && completedLabel && (
            <p className={cn('mt-1 break-words font-medium', sizeClasses[size].label, toneClasses[tone])}>{completedLabel}</p>
          )}
        </JPanel>
      )}

      <JPanel variant="ghost" padding="none" radius="none" className={cn('min-w-0', isInline && 'flex items-center gap-3')}>
        <output
          aria-live={status === 'running' ? 'off' : 'polite'}
          aria-label="Timer"
          className={cn(
            'block break-words font-mono font-semibold leading-none tabular-nums',
            sizeClasses[size].display,
            toneClasses[tone]
          )}
        >
          {displayValue}
        </output>
        <span className="sr-only">{statusText[status]}</span>

        {controls && (
          <JPanel variant="ghost" padding="none" radius="none" className={cn('flex flex-wrap items-center gap-2', isInline ? 'ml-1' : 'mt-3')}>
            {canStart && (
              <button
                type="button"
                onClick={onStartClick}
                className={cn(
                  'rounded-md bg-primary-600 font-medium text-white transition-colors hover:bg-primary-700',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  sizeClasses[size].button
                )}
              >
                {startLabel}
              </button>
            )}
            {canPause && (
              <button
                type="button"
                onClick={onPauseClick}
                className={cn(
                  'rounded-md border border-neutral-300 bg-white font-medium text-neutral-700 transition-colors hover:bg-neutral-50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  sizeClasses[size].button
                )}
              >
                {pauseLabel}
              </button>
            )}
            {canResume && (
              <button
                type="button"
                onClick={onResumeClick}
                className={cn(
                  'rounded-md bg-primary-600 font-medium text-white transition-colors hover:bg-primary-700',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  sizeClasses[size].button
                )}
              >
                {resumeLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onResetClick}
              className={cn(
                'rounded-md border border-neutral-300 bg-white font-medium text-neutral-700 transition-colors hover:bg-neutral-50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                sizeClasses[size].button
              )}
            >
              {resetLabel}
            </button>
          </JPanel>
        )}
      </JPanel>
    </JPanel>
  );
};
