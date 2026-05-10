// DatePickerMoleculeImpl.tsx - JONA Implementation
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  InterDatePickerMolecule,
  DATE_PICKER_MOLECULE_DEFAULTS,
} from './InterDatePickerMolecule';
import { DatePickerMoleculeView } from './DatePickerMoleculeView';

type MaskToken = 'yyyy' | 'MM' | 'dd' | 'HH' | 'mm' | 'ss' | 'XXX' | 'z';
type MaskSegment = { type: 'token'; value: MaskToken } | { type: 'literal'; value: string };

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timezone?: string;
}

const TOKEN_SPECS: Record<MaskToken, { pattern: string; length?: number }> = {
  yyyy: { pattern: '(\\d{4})', length: 4 },
  MM: { pattern: '(\\d{2})', length: 2 },
  dd: { pattern: '(\\d{2})', length: 2 },
  HH: { pattern: '(\\d{2})', length: 2 },
  mm: { pattern: '(\\d{2})', length: 2 },
  ss: { pattern: '(\\d{2})', length: 2 },
  XXX: { pattern: '([+-]\\d{2}:?\\d{2}|Z)' },
  z: { pattern: '(.+)' },
};

const TOKENS: MaskToken[] = ['yyyy', 'XXX', 'MM', 'dd', 'HH', 'mm', 'ss', 'z'];

function tokenizeMask(mask: string): MaskSegment[] {
  const segments: MaskSegment[] = [];
  let i = 0;

  while (i < mask.length) {
    const token = TOKENS.find((candidate) => mask.startsWith(candidate, i));
    if (token) {
      segments.push({ type: 'token', value: token });
      i += token.length;
      continue;
    }

    segments.push({ type: 'literal', value: mask[i] });
    i += 1;
  }

  return segments;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseWithMask(value: string | undefined, mask: string, fallbackTimezone?: string): DateParts | null {
  if (!value) return null;

  const captures: MaskToken[] = [];
  const pattern = tokenizeMask(mask)
    .map((segment) => {
      if (segment.type === 'literal') return escapeRegExp(segment.value);
      captures.push(segment.value);
      return TOKEN_SPECS[segment.value].pattern;
    })
    .join('');
  const match = new RegExp(`^${pattern}$`).exec(value.trim());

  if (!match) return parseIsoLike(value, fallbackTimezone);

  const parts: DateParts = {
    year: 0,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timezone: fallbackTimezone,
  };

  captures.forEach((token, index) => {
    const captured = match[index + 1];
    if (token === 'yyyy') parts.year = Number(captured);
    if (token === 'MM') parts.month = Number(captured);
    if (token === 'dd') parts.day = Number(captured);
    if (token === 'HH') parts.hour = Number(captured);
    if (token === 'mm') parts.minute = Number(captured);
    if (token === 'ss') parts.second = Number(captured);
    if (token === 'z' || token === 'XXX') parts.timezone = captured;
  });

  return isValidParts(parts) ? parts : null;
}

function parseIsoLike(value: string, fallbackTimezone?: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?(?:\s*(Z|[+-]\d{2}:?\d{2}|[A-Za-z][\w/+-]+))?$/.exec(value.trim());
  if (!match) return null;

  const parts: DateParts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? 0),
    minute: Number(match[5] ?? 0),
    second: Number(match[6] ?? 0),
    timezone: match[7] ?? fallbackTimezone,
  };

  return isValidParts(parts) ? parts : null;
}

function isValidParts(parts: DateParts): boolean {
  if (parts.month < 1 || parts.month > 12) return false;
  if (parts.day < 1 || parts.day > 31) return false;
  if (parts.hour < 0 || parts.hour > 23) return false;
  if (parts.minute < 0 || parts.minute > 59) return false;
  if (parts.second < 0 || parts.second > 59) return false;

  const date = new Date(parts.year, parts.month - 1, parts.day);
  return (
    date.getFullYear() === parts.year
    && date.getMonth() === parts.month - 1
    && date.getDate() === parts.day
  );
}

function partsToDate(parts: DateParts | null): Date | null {
  if (!parts) return null;
  return new Date(parts.year, parts.month - 1, parts.day);
}

function partsFromDate(date: Date, base?: DateParts | null, timezone?: string): DateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: base?.hour ?? 0,
    minute: base?.minute ?? 0,
    second: base?.second ?? 0,
    timezone: base?.timezone ?? timezone,
  };
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

function formatWithMask(parts: DateParts, mask: string): string {
  return tokenizeMask(mask)
    .map((segment) => {
      if (segment.type === 'literal') return segment.value;
      if (segment.value === 'yyyy') return pad(parts.year, 4);
      if (segment.value === 'MM') return pad(parts.month);
      if (segment.value === 'dd') return pad(parts.day);
      if (segment.value === 'HH') return pad(parts.hour);
      if (segment.value === 'mm') return pad(parts.minute);
      if (segment.value === 'ss') return pad(parts.second);
      return parts.timezone ?? '';
    })
    .join('')
    .trim();
}

function formatIso(parts: DateParts, includeTime: boolean, includeSeconds: boolean): string {
  const date = `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}`;
  if (!includeTime) return date;

  const time = `${pad(parts.hour)}:${pad(parts.minute)}${includeSeconds ? `:${pad(parts.second)}` : ''}`;
  const timezone = parts.timezone && /^(Z|[+-]\d{2}:?\d{2})$/.test(parts.timezone) ? parts.timezone : '';
  return `${date}T${time}${timezone}`;
}

function formatValue(
  parts: DateParts,
  mask: string,
  valueFormat: InterDatePickerMolecule['valueFormat'],
  includeTime: boolean,
  includeSeconds: boolean
): string {
  return valueFormat === 'iso' ? formatIso(parts, includeTime, includeSeconds) : formatWithMask(parts, mask);
}

function applyInputMask(value: string, mask: string): string {
  const segments = tokenizeMask(mask);
  const firstTimezoneIndex = segments.findIndex((segment) => (
    segment.type === 'token' && (segment.value === 'z' || segment.value === 'XXX')
  ));
  const numericSegments = firstTimezoneIndex >= 0 ? segments.slice(0, firstTimezoneIndex) : segments;
  const requiredDigits = numericSegments.reduce((total, segment) => {
    if (segment.type !== 'token') return total;
    return total + (TOKEN_SPECS[segment.value].length ?? 0);
  }, 0);
  const digits = value.replace(/\D/g, '').slice(0, requiredDigits);

  let digitIndex = 0;
  let output = '';

  for (const segment of numericSegments) {
    if (segment.type === 'literal') {
      if (digitIndex > 0 && digitIndex < digits.length) output += segment.value;
      continue;
    }

    const length = TOKEN_SPECS[segment.value].length;
    if (!length) continue;

    const next = digits.slice(digitIndex, digitIndex + length);
    if (!next) break;

    output += next;
    digitIndex += next.length;
    if (next.length < length) break;
  }

  if (firstTimezoneIndex >= 0 && digits.length >= requiredDigits && value.length > output.length) {
    const textTail = /[A-Za-z].*$/.exec(value)?.[0];
    const offsetTail = /(?:^|[\sT])([+-]\d{0,2}:?\d{0,2}|Z)$/.exec(value)?.[1];
    const tail = (textTail ?? offsetTail ?? value.slice(output.length).replace(/^[^A-Za-zZ+-]+/, '')).trim();
    if (tail) return `${output} ${tail}`;
  }

  return output;
}

function clampNumber(value: string, min: number, max: number): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

export const DatePickerMoleculeImpl: React.FC<InterDatePickerMolecule> = (props) => {
  const merged = { ...DATE_PICKER_MOLECULE_DEFAULTS, ...props };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mask = merged.mask;
  const hasTimeInMask = /HH|mm|ss/.test(mask);
  const hasSecondsInMask = mask.includes('ss');
  const hasTimezoneInMask = /XXX|z/.test(mask);
  const showTime = merged.showTime || hasTimeInMask;
  const showSeconds = merged.showSeconds || hasSecondsInMask;
  const showTimezone = hasTimezoneInMask || !!props.timezoneOptions?.length;

  const [internalValue, setInternalValue] = useState<string>('');
  const effectiveValue = props.value ?? internalValue;
  const [inputValue, setInputValue] = useState(effectiveValue);

  useEffect(() => {
    setInputValue(effectiveValue);
  }, [effectiveValue]);

  const selectedParts = useMemo(
    () => parseWithMask(effectiveValue, mask, props.timezone),
    [effectiveValue, mask, props.timezone]
  );
  const effectiveSelected = partsToDate(selectedParts);
  const initial = effectiveSelected ?? today;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  const minDate = partsToDate(parseWithMask(props.min, mask, props.timezone));
  const maxDate = partsToDate(parseWithMask(props.max, mask, props.timezone));

  const emitValue = (parts: DateParts) => {
    const nextValue = formatValue(parts, mask, merged.valueFormat, showTime, showSeconds);
    setInternalValue(nextValue);
    setInputValue(nextValue);
    props.onChange?.(nextValue);
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const panelW = 320;
    const left = Math.min(r.left, vw - panelW - 8);
    setPanelStyle({ position: 'fixed', top: r.bottom + 4, left: Math.max(8, left), zIndex: 50 });
  };

  const openCalendar = () => {
    updatePosition();
    const base = effectiveSelected ?? today;
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setOpen(true);
  };

  const closeCalendar = () => setOpen(false);

  const handleInputChange = (value: string) => {
    const nextValue = merged.autoApplyMask ? applyInputMask(value, mask) : value;
    setInternalValue(nextValue);
    setInputValue(nextValue);
    props.onChange?.(nextValue);
  };

  const handleSelect = (date: Date) => {
    emitValue(partsFromDate(date, selectedParts, props.timezone));
    closeCalendar();
    inputRef.current?.focus();
  };

  const handleTimeChange = (part: 'hour' | 'minute' | 'second', value: string) => {
    const baseDate = effectiveSelected ?? today;
    const baseParts = selectedParts ?? partsFromDate(baseDate, null, props.timezone);
    const limit = part === 'hour' ? 23 : 59;
    emitValue({ ...baseParts, [part]: clampNumber(value, 0, limit) });
  };

  const handleTimezoneChange = (value: string) => {
    const baseDate = effectiveSelected ?? today;
    const baseParts = selectedParts ?? partsFromDate(baseDate, null, props.timezone);
    emitValue({ ...baseParts, timezone: value });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCalendar();
        inputRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !panelRef.current?.contains(e.target as Node)) closeCalendar();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  return (
    <DatePickerMoleculeView
      inputValue={inputValue}
      open={open}
      viewYear={viewYear}
      viewMonth={viewMonth}
      selectedDate={effectiveSelected}
      today={today}
      min={minDate ?? undefined}
      max={maxDate ?? undefined}
      disabled={merged.disabled}
      placeholder={merged.placeholder}
      mask={mask}
      showTime={showTime}
      showSeconds={showSeconds}
      showTimezone={showTimezone}
      timezoneOptions={props.timezoneOptions}
      timeParts={selectedParts ?? partsFromDate(effectiveSelected ?? today, null, props.timezone)}
      className={props.className}
      panelStyle={panelStyle}
      triggerRef={triggerRef}
      panelRef={panelRef}
      inputRef={inputRef}
      onInputChange={handleInputChange}
      onTriggerClick={() => (open ? closeCalendar() : openCalendar())}
      onPrevMonth={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); } else setViewMonth((m) => m - 1); }}
      onNextMonth={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); } else setViewMonth((m) => m + 1); }}
      onSelectDay={handleSelect}
      onTimeChange={handleTimeChange}
      onTimezoneChange={handleTimezoneChange}
    />
  );
};

DatePickerMoleculeImpl.displayName = 'DatePickerMolecule';
