import React from 'react';

export type TimerMoleculeMode = 'countdown' | 'stopwatch';
export type TimerMoleculeStatus = 'idle' | 'running' | 'paused' | 'completed';
export type TimerMoleculeVariant = 'plain' | 'card' | 'inline';
export type TimerMoleculeSize = 'sm' | 'md' | 'lg';
export type TimerMoleculeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface TimerMoleculeFormatContext {
  mode: TimerMoleculeMode;
  status: TimerMoleculeStatus;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalMilliseconds: number;
}

export interface InterTimerMolecule extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onReset' | 'onPause'> {
  mode?: TimerMoleculeMode;
  valueMs?: number;
  defaultValueMs?: number;
  durationMs?: number;
  minMs?: number;
  maxMs?: number;
  autoStart?: boolean;
  tickIntervalMs?: number;
  controls?: boolean;
  resetOnComplete?: boolean;
  loop?: boolean;
  showHours?: boolean;
  showMilliseconds?: boolean;
  padHours?: boolean;
  label?: React.ReactNode;
  completedLabel?: React.ReactNode;
  startLabel?: React.ReactNode;
  pauseLabel?: React.ReactNode;
  resumeLabel?: React.ReactNode;
  resetLabel?: React.ReactNode;
  variant?: TimerMoleculeVariant;
  size?: TimerMoleculeSize;
  tone?: TimerMoleculeTone;
  formatter?: (context: TimerMoleculeFormatContext) => React.ReactNode;
  onChange?: (valueMs: number, status: TimerMoleculeStatus) => void;
  onTick?: (valueMs: number, status: TimerMoleculeStatus) => void;
  onStart?: (valueMs: number) => void;
  onPause?: (valueMs: number) => void;
  onResume?: (valueMs: number) => void;
  onReset?: (valueMs: number) => void;
  onComplete?: () => void;
}

export const TIMER_MOLECULE_DEFAULTS: Required<Pick<
  InterTimerMolecule,
  | 'mode'
  | 'durationMs'
  | 'minMs'
  | 'autoStart'
  | 'tickIntervalMs'
  | 'controls'
  | 'resetOnComplete'
  | 'loop'
  | 'showHours'
  | 'showMilliseconds'
  | 'padHours'
  | 'startLabel'
  | 'pauseLabel'
  | 'resumeLabel'
  | 'resetLabel'
  | 'variant'
  | 'size'
  | 'tone'
>> = {
  mode: 'countdown',
  durationMs: 60_000,
  minMs: 0,
  autoStart: false,
  tickIntervalMs: 1000,
  controls: true,
  resetOnComplete: false,
  loop: false,
  showHours: true,
  showMilliseconds: false,
  padHours: true,
  startLabel: 'Iniciar',
  pauseLabel: 'Pausar',
  resumeLabel: 'Continuar',
  resetLabel: 'Reiniciar',
  variant: 'card',
  size: 'md',
  tone: 'neutral',
};
