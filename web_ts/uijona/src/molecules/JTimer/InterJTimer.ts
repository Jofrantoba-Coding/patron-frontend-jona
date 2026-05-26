// InterJTimer.ts — JONA Interface
import React from 'react';

export type JTimerMode    = 'countdown' | 'stopwatch';
export type JTimerStatus  = 'idle' | 'running' | 'paused' | 'completed';
export type JTimerVariant = 'plain' | 'card' | 'inline';
export type JTimerSize    = 'sm' | 'md' | 'lg';
export type JTimerTone    = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface JTimerFormatContext {
  mode:              JTimerMode;
  status:            JTimerStatus;
  hours:             number;
  minutes:           number;
  seconds:           number;
  milliseconds:      number;
  totalMilliseconds: number;
}

export interface InterJTimer extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onReset' | 'onPause'> {
  mode?:            JTimerMode;
  valueMs?:         number;
  defaultValueMs?:  number;
  durationMs?:      number;
  minMs?:           number;
  maxMs?:           number;
  autoStart?:       boolean;
  tickIntervalMs?:  number;
  controls?:        boolean;
  resetOnComplete?: boolean;
  loop?:            boolean;
  showHours?:       boolean;
  showMilliseconds?: boolean;
  padHours?:        boolean;
  label?:           React.ReactNode;
  completedLabel?:  React.ReactNode;
  startLabel?:      React.ReactNode;
  pauseLabel?:      React.ReactNode;
  resumeLabel?:     React.ReactNode;
  resetLabel?:      React.ReactNode;
  variant?:         JTimerVariant;
  size?:            JTimerSize;
  tone?:            JTimerTone;
  formatter?:       (context: JTimerFormatContext) => React.ReactNode;
  onChange?:        (valueMs: number, status: JTimerStatus) => void;
  onTick?:          (valueMs: number, status: JTimerStatus) => void;
  onStart?:         (valueMs: number) => void;
  onPause?:         (valueMs: number) => void;
  onResume?:        (valueMs: number) => void;
  onReset?:         (valueMs: number) => void;
  onComplete?:      () => void;
}

export const JTIMER_DEFAULTS: Required<Pick<
  InterJTimer,
  | 'mode' | 'durationMs' | 'minMs' | 'autoStart' | 'tickIntervalMs'
  | 'controls' | 'resetOnComplete' | 'loop' | 'showHours' | 'showMilliseconds'
  | 'padHours' | 'startLabel' | 'pauseLabel' | 'resumeLabel' | 'resetLabel'
  | 'variant' | 'size' | 'tone'
>> = {
  mode:             'countdown',
  durationMs:       60_000,
  minMs:            0,
  autoStart:        false,
  tickIntervalMs:   1000,
  controls:         true,
  resetOnComplete:  false,
  loop:             false,
  showHours:        true,
  showMilliseconds: false,
  padHours:         true,
  startLabel:       'Iniciar',
  pauseLabel:       'Pausar',
  resumeLabel:      'Continuar',
  resetLabel:       'Reiniciar',
  variant:          'card',
  size:             'md',
  tone:             'neutral',
};
