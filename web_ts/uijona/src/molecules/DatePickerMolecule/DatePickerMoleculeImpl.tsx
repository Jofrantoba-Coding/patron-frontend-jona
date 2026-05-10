// DatePickerMoleculeImpl.tsx — JONA Implementation
import React, { useEffect, useRef, useState } from 'react';
import { InterDatePickerMolecule, DATE_PICKER_MOLECULE_DEFAULTS } from './InterDatePickerMolecule';
import { DatePickerMoleculeView } from './DatePickerMoleculeView';

function parseISO(s: string | undefined): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplay(d: Date): string {
  return d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const DatePickerMoleculeImpl: React.FC<InterDatePickerMolecule> = (props) => {
  const merged = { ...DATE_PICKER_MOLECULE_DEFAULTS, ...props };
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const [internalValue, setInternalValue] = useState<string | undefined>(undefined);
  const effectiveValue = props.value ?? internalValue;
  const effectiveSelected = parseISO(effectiveValue);
  const initial = effectiveSelected ?? today;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const minDate = parseISO(props.min);
  const maxDate = parseISO(props.max);
  const displayValue = effectiveSelected ? formatDisplay(effectiveSelected) : '';

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const panelW = 288;
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

  const handleSelect = (date: Date) => {
    const iso = toISO(date);
    setInternalValue(iso);
    props.onChange?.(iso);
    closeCalendar();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { closeCalendar(); triggerRef.current?.focus(); } };
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
      displayValue={displayValue}
      open={open}
      viewYear={viewYear}
      viewMonth={viewMonth}
      selectedDate={effectiveSelected}
      today={today}
      min={minDate ?? undefined}
      max={maxDate ?? undefined}
      disabled={merged.disabled}
      placeholder={merged.placeholder}
      className={props.className}
      panelStyle={panelStyle}
      triggerRef={triggerRef}
      panelRef={panelRef}
      onTriggerClick={() => (open ? closeCalendar() : openCalendar())}
      onPrevMonth={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); } else setViewMonth((m) => m - 1); }}
      onNextMonth={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); } else setViewMonth((m) => m + 1); }}
      onSelectDay={handleSelect}
    />
  );
};

DatePickerMoleculeImpl.displayName = 'DatePickerMolecule';
