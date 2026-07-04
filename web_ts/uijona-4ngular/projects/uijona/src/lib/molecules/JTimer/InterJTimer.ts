export type JTimerMode = 'countdown' | 'stopwatch';

export type JTimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export type JTimerVariant = 'plain' | 'card' | 'inline';

export type JTimerSize = 'sm' | 'md' | 'lg';

export type JTimerTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** Contrato publico de JTimer. */
export interface InterJTimer {
  mode?: JTimerMode;
  durationMs?: number;
  maxMs?: number;
  autoStart?: boolean;
  tickIntervalMs?: number;
  controls?: boolean;
  loop?: boolean;
  showHours?: boolean;
  showMilliseconds?: boolean;
  padHours?: boolean;
  label?: string;
  completedLabel?: string;
  startLabel?: string;
  pauseLabel?: string;
  resumeLabel?: string;
  resetLabel?: string;
  variant?: JTimerVariant;
  size?: JTimerSize;
  tone?: JTimerTone;
}
