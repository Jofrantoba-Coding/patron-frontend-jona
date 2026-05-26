// JTimerImpl.tsx — JONA Implementation
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InterJTimer, JTIMER_DEFAULTS, JTimerFormatContext, JTimerStatus } from './InterJTimer';
import { JTimerView } from './JTimerView';

function clamp(value: number, min: number, max?: number): number {
  return Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min, value));
}

function getDefaultValue(props: InterJTimer): number {
  if (props.defaultValueMs !== undefined) return props.defaultValueMs;
  if (props.mode === 'stopwatch') return 0;
  return props.durationMs ?? JTIMER_DEFAULTS.durationMs;
}

function toFormatContext(
  totalMilliseconds: number,
  mode: NonNullable<InterJTimer['mode']>,
  status: JTimerStatus,
): JTimerFormatContext {
  const safeMs    = Math.max(0, totalMilliseconds);
  const hours     = Math.floor(safeMs / 3_600_000);
  const minutes   = Math.floor((safeMs % 3_600_000) / 60_000);
  const seconds   = Math.floor((safeMs % 60_000) / 1000);
  const milliseconds = safeMs % 1000;
  return { mode, status, hours, minutes, seconds, milliseconds, totalMilliseconds: safeMs };
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

function formatDigital(
  context: JTimerFormatContext,
  showHours: boolean,
  showMilliseconds: boolean,
  padHours: boolean,
): string {
  const hours   = padHours ? pad(context.hours) : String(context.hours);
  const minutes = pad(context.minutes);
  const seconds = pad(context.seconds);
  const ms      = pad(context.milliseconds, 3);
  const base    = showHours || context.hours > 0
    ? `${hours}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
  return showMilliseconds ? `${base}.${ms}` : base;
}

export const JTimerImpl: React.FC<InterJTimer> = (props) => {
  const resolved    = { ...JTIMER_DEFAULTS, ...props };
  const isControlled = props.valueMs !== undefined;
  const minMs       = resolved.minMs;
  const maxMs       = props.maxMs;
  const initialValue = clamp(props.valueMs ?? getDefaultValue(resolved), minMs, maxMs);

  const [internalValue, setInternalValue] = useState(initialValue);
  const [status, setStatus] = useState<JTimerStatus>(resolved.autoStart ? 'running' : 'idle');
  const lastTickRef  = useRef<number | null>(null);
  const completedRef = useRef(false);
  const valueRef     = useRef(initialValue);
  const valueMs      = clamp(props.valueMs ?? internalValue, minMs, maxMs);
  const mode         = resolved.mode;

  useEffect(() => {
    if (isControlled) setInternalValue(clamp(props.valueMs ?? initialValue, minMs, maxMs));
  }, [isControlled, props.valueMs, initialValue, minMs, maxMs]);

  useEffect(() => { valueRef.current = valueMs; }, [valueMs]);

  const setNextValue = (nextValue: number, nextStatus = status) => {
    const clamped = clamp(nextValue, minMs, maxMs);
    valueRef.current = clamped;
    if (!isControlled) setInternalValue(clamped);
    props.onChange?.(clamped, nextStatus);
    props.onTick?.(clamped, nextStatus);
    return clamped;
  };

  const complete = () => {
    if (completedRef.current && !resolved.loop) return;
    completedRef.current = true;
    props.onComplete?.();

    if (resolved.loop) {
      const restartValue = mode === 'countdown' ? resolved.durationMs : minMs;
      valueRef.current = restartValue;
      if (!isControlled) setInternalValue(restartValue);
      setStatus('running');
      lastTickRef.current = Date.now();
      return;
    }

    setStatus('completed');
    lastTickRef.current = null;
  };

  useEffect(() => {
    if (status !== 'running') { lastTickRef.current = null; return undefined; }

    lastTickRef.current = Date.now();
    const timer = window.setInterval(() => {
      const now     = Date.now();
      const elapsed = now - (lastTickRef.current ?? now);
      lastTickRef.current = now;

      const current       = valueRef.current;
      const next          = mode === 'countdown' ? current - elapsed : current + elapsed;
      const reachedTarget = mode === 'countdown'
        ? next <= minMs
        : maxMs !== undefined && next >= maxMs;
      const target    = mode === 'countdown' ? minMs : maxMs;
      const nextValue = reachedTarget ? (target ?? next) : next;

      setNextValue(nextValue, reachedTarget ? 'completed' : 'running');
      if (reachedTarget) complete();
    }, Math.max(16, resolved.tickIntervalMs));

    return () => window.clearInterval(timer);
  }, [status, mode, minMs, maxMs, resolved.tickIntervalMs, props.valueMs]);

  const context = useMemo(
    () => toFormatContext(valueMs, mode, status),
    [valueMs, mode, status],
  );

  const displayValue = resolved.formatter
    ? resolved.formatter(context)
    : formatDigital(context, resolved.showHours, resolved.showMilliseconds, resolved.padHours);

  const resetValue = mode === 'countdown' ? resolved.durationMs : (props.defaultValueMs ?? minMs);
  const canStart  = status === 'idle' || (status === 'completed' && resolved.resetOnComplete);
  const canPause  = status === 'running';
  const canResume = status === 'paused';

  const handleStart = () => {
    completedRef.current = false;
    if (status === 'completed' && resolved.resetOnComplete) setNextValue(resetValue, 'running');
    setStatus('running');
    props.onStart?.(valueMs);
  };

  const handlePause = () => { setStatus('paused'); props.onPause?.(valueMs); };

  const handleResume = () => { setStatus('running'); props.onResume?.(valueMs); };

  const handleReset = () => {
    completedRef.current = false;
    const nextValue = clamp(resetValue, minMs, maxMs);
    valueRef.current = nextValue;
    if (!isControlled) setInternalValue(nextValue);
    const nextStatus = resolved.autoStart ? 'running' : 'idle';
    setStatus(nextStatus);
    props.onReset?.(nextValue);
    props.onChange?.(nextValue, nextStatus);
  };

  return (
    <JTimerView
      {...resolved}
      status={status}
      context={context}
      displayValue={displayValue}
      canStart={canStart}
      canPause={canPause}
      canResume={canResume}
      onStartClick={handleStart}
      onPauseClick={handlePause}
      onResumeClick={handleResume}
      onResetClick={handleReset}
    />
  );
};

JTimerImpl.displayName = 'JTimer';
