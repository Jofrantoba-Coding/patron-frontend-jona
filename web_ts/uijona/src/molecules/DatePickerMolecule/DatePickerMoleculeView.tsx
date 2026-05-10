// DatePickerMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

interface DatePickerMoleculeViewProps {
  displayValue: string;
  open: boolean;
  viewYear: number;
  viewMonth: number;
  selectedDate: Date | null;
  today: Date;
  min?: Date;
  max?: Date;
  disabled: boolean;
  placeholder: string;
  className?: string;
  panelStyle: React.CSSProperties;
  triggerRef: React.RefObject<HTMLButtonElement>;
  panelRef: React.RefObject<HTMLDivElement>;
  onTriggerClick: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (date: Date) => void;
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const cells: (Date | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export const DatePickerMoleculeView: React.FC<DatePickerMoleculeViewProps> = ({
  displayValue, open, viewYear, viewMonth, selectedDate, today, min, max, disabled, placeholder,
  className, panelStyle, triggerRef, panelRef, onTriggerClick, onPrevMonth, onNextMonth, onSelectDay,
}) => {
  const cells = buildCalendarDays(viewYear, viewMonth);
  const canPrev = !min || new Date(viewYear, viewMonth, 0) >= min;
  const canNext = !max || new Date(viewYear, viewMonth + 1, 1) <= max;

  return (
    <div className={cn('relative inline-block w-full', className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={onTriggerClick}
        aria-label={displayValue || placeholder}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          open && 'ring-2 ring-primary-500',
          !displayValue && 'text-neutral-400'
        )}
      >
        <span>{displayValue || placeholder}</span>
        <svg className="h-4 w-4 shrink-0 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {/* Calendar panel */}
      {open && createPortal(
        <div ref={panelRef} role="dialog" aria-label="Calendario" style={panelStyle}
          className="z-50 w-72 rounded-lg border border-neutral-200 bg-white p-3 shadow-xl">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <button type="button" onClick={onPrevMonth} disabled={!canPrev} aria-label="Mes anterior"
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="text-sm font-semibold text-neutral-900">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={onNextMonth} disabled={!canNext} aria-label="Mes siguiente"
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {DAYS.map((d) => <span key={d} className="text-xs font-medium text-neutral-400">{d}</span>)}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((date, i) => {
              if (!date) return <span key={i} />;
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
              const isToday = isSameDay(date, today);
              const isDisabled = (min && date < min) || (max && date > max);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !isDisabled && onSelectDay(date)}
                  disabled={!!isDisabled}
                  aria-label={date.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors mx-auto',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    isDisabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:bg-neutral-100',
                    isSelected && 'bg-primary-600 font-semibold text-white hover:bg-primary-700',
                    isToday && !isSelected && 'border border-primary-400 font-medium text-primary-600'
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
