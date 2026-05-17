// DatePickerMoleculeView.tsx - JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { InputAtom } from '../../atoms/InputAtom';
import { LabelAtom } from '../../atoms/LabelAtom';
import { JPanel } from '../../atoms/JPanel/JPanel';

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface DatePickerTimeParts {
  hour: number;
  minute: number;
  second: number;
  timezone?: string;
}

interface DatePickerMoleculeViewProps {
  inputValue: string;
  open: boolean;
  viewYear: number;
  viewMonth: number;
  selectedDate: Date | null;
  today: Date;
  min?: Date;
  max?: Date;
  disabled: boolean;
  placeholder: string;
  mask: string;
  showTime: boolean;
  showSeconds: boolean;
  showTimezone: boolean;
  timezoneOptions?: string[];
  timeParts: DatePickerTimeParts;
  className?: string;
  panelStyle: React.CSSProperties;
  triggerRef: React.RefObject<HTMLDivElement>;
  panelRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onTriggerClick: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (date: Date) => void;
  onTimeChange: (part: 'hour' | 'minute' | 'second', value: string) => void;
  onTimezoneChange: (value: string) => void;
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const cells: (Date | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d += 1) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export const DatePickerMoleculeView: React.FC<DatePickerMoleculeViewProps> = ({
  inputValue,
  open,
  viewYear,
  viewMonth,
  selectedDate,
  today,
  min,
  max,
  disabled,
  placeholder,
  mask,
  showTime,
  showSeconds,
  showTimezone,
  timezoneOptions,
  timeParts,
  className,
  panelStyle,
  triggerRef,
  panelRef,
  inputRef,
  onInputChange,
  onTriggerClick,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  onTimeChange,
  onTimezoneChange,
}) => {
  const cells = buildCalendarDays(viewYear, viewMonth);
  const canPrev = !min || new Date(viewYear, viewMonth, 0) >= min;
  const canNext = !max || new Date(viewYear, viewMonth + 1, 1) <= max;

  return (
    <JPanel variant="ghost" padding="none" radius="none" className={cn('relative inline-block w-full', className)}>
      <JPanel variant="ghost" padding="none" radius="none"
        ref={triggerRef}
        className={cn(
          'flex h-9 w-full items-center rounded-md border border-neutral-300 bg-neutral-50 text-sm transition-colors',
          'focus-within:ring-2 focus-within:ring-primary-500',
          disabled && 'cursor-not-allowed opacity-50',
          open && 'ring-2 ring-primary-500'
        )}
      >
        <InputAtom
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder || mask}
          aria-label={placeholder || 'Fecha'}
          className={cn(
            'min-w-0 flex-1 rounded-l-md rounded-r-none border-0 bg-transparent px-3 py-1 text-sm text-neutral-900',
            'placeholder:text-neutral-400 focus-visible:ring-0 disabled:cursor-not-allowed'
          )}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={onTriggerClick}
          aria-label="Abrir calendario"
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            'flex h-full w-9 shrink-0 items-center justify-center rounded-r-md text-neutral-500 transition-colors',
            'hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </JPanel>

      {open && createPortal(
        <JPanel variant="ghost" padding="none" radius="none"
          ref={panelRef}
          role="dialog"
          aria-label="Calendario"
          style={panelStyle}
          className="z-50 w-80 max-w-[calc(100vw-16px)] rounded-lg border border-neutral-200 bg-white p-3 shadow-xl"
        >
          <JPanel variant="ghost" padding="none" radius="none" className="mb-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onPrevMonth}
              disabled={!canPrev}
              aria-label="Mes anterior"
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span className="text-sm font-semibold text-neutral-900">{MONTHS[viewMonth]} {viewYear}</span>
            <button
              type="button"
              onClick={onNextMonth}
              disabled={!canNext}
              aria-label="Mes siguiente"
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </JPanel>

          <JPanel variant="ghost" padding="none" radius="none" className="mb-1 grid grid-cols-7 text-center">
            {DAYS.map((d) => <span key={d} className="text-xs font-medium text-neutral-400">{d}</span>)}
          </JPanel>

          <JPanel variant="ghost" padding="none" radius="none" className="grid grid-cols-7 gap-y-0.5">
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
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors',
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
          </JPanel>

          {(showTime || showTimezone) && (
            <JPanel variant="ghost" padding="none" radius="none" className="mt-3 border-t border-neutral-200 pt-3">
              {showTime && (
                <JPanel variant="ghost" padding="none" radius="none" className="grid grid-cols-3 gap-2">
                  <LabelAtom className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
                    HH
                    <InputAtom
                      type="number"
                      min={0}
                      max={23}
                      value={pad(timeParts.hour)}
                      onChange={(value) => onTimeChange('hour', value)}
                      className="h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    />
                  </LabelAtom>
                  <LabelAtom className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
                    mm
                    <InputAtom
                      type="number"
                      min={0}
                      max={59}
                      value={pad(timeParts.minute)}
                      onChange={(value) => onTimeChange('minute', value)}
                      className="h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    />
                  </LabelAtom>
                  {showSeconds && (
                    <LabelAtom className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
                      ss
                      <InputAtom
                        type="number"
                        min={0}
                        max={59}
                        value={pad(timeParts.second)}
                        onChange={(value) => onTimeChange('second', value)}
                        className="h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      />
                    </LabelAtom>
                  )}
                </JPanel>
              )}

              {showTimezone && (
                <LabelAtom className="mt-2 flex flex-col gap-1 text-xs font-medium text-neutral-600">
                  Timezone
                  {timezoneOptions?.length ? (
                    <select
                      value={timeParts.timezone ?? ''}
                      onChange={(event) => onTimezoneChange(event.target.value)}
                      className="h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      {!timeParts.timezone && <option value="">Seleccionar timezone</option>}
                      {timezoneOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <InputAtom
                      type="text"
                      value={timeParts.timezone ?? ''}
                      onChange={onTimezoneChange}
                      placeholder="America/Lima"
                      className="h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    />
                  )}
                </LabelAtom>
              )}
            </JPanel>
          )}
        </JPanel>,
        document.body
      )}
    </JPanel>
  );
};
