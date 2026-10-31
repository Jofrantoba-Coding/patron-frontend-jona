// JTabsView.tsx — JONA View (render puro)
import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton/JButton';
import { InterJTabs } from './InterJTabs';
import { FG, FG_MUTED, HOVER_CONTROL_BORDER, HOVER_FG, LINE, LINE_BG, SURFACE, SURFACE_MUTED } from '../../theme/tokenClasses';

// ── Context ────────────────────────────────────────────────────────────────
interface JTabsContextValue {
  value:               string;
  onChange:            (v: string) => void;
  onTabFocus?:         (v: string) => void;
  onDisabledTabClick?: (v: string) => void;
  variant:             'pill' | 'line';
  orientation:         'horizontal' | 'vertical';
  keepMounted:         boolean;
}

export const JTabsContext = createContext<JTabsContextValue>({
  value: '', onChange: () => {}, variant: 'pill', orientation: 'horizontal', keepMounted: false,
});

// ── Root ───────────────────────────────────────────────────────────────────
export const JTabsView: React.FC<InterJTabs> = ({
  value, onChange, onTabFocus, onDisabledTabClick,
  variant = 'pill', orientation = 'horizontal', keepMounted = false, className, children,
}) => (
  <JTabsContext.Provider
    value={{ value, onChange: onChange ?? (() => {}), onTabFocus, onDisabledTabClick, variant, orientation, keepMounted }}
  >
    <div
      className={cn(
        'min-w-0',
        orientation === 'vertical'
          ? 'flex flex-col gap-4 sm:flex-row'
          : 'flex flex-col gap-2',
        className,
      )}
    >
      {children}
    </div>
  </JTabsContext.Provider>
);

// ── TabsList ───────────────────────────────────────────────────────────────
export const JTabsListView: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className, children, ...props
}) => {
  const { variant, orientation } = useContext(JTabsContext);
  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        'flex max-w-full min-w-0',
        orientation === 'vertical'
          ? 'flex-row overflow-x-auto sm:flex-col sm:overflow-visible'
          : 'flex-row overflow-x-auto',
        variant === 'pill'
          ? `gap-1 rounded-md ${SURFACE_MUTED} p-1`
          : `gap-0 border-b ${LINE}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ── TabsTrigger ────────────────────────────────────────────────────────────
interface JTabsTriggerViewProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  /** Set when the trigger is invalid: the id of its hidden description. */
  invalidId?: string;
  invalidLabel?: string;
  countId?: string;
  count?: number;
}

export const JTabsTriggerView: React.FC<JTabsTriggerViewProps> = ({
  value, className, children, disabled, invalidId, invalidLabel, countId, count, ...props
}) => {
  const { value: activeValue, onChange, onTabFocus, onDisabledTabClick, variant } = useContext(JTabsContext);
  const isActive = activeValue === value;
  return (
    <JButton
      variant="ghost"
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => {
        if (disabled) onDisabledTabClick?.(value);
        else onChange(value);
      }}
      onFocus={() => onTabFocus?.(value)}
      className={cn(
        'inline-flex min-h-11 max-w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 sm:min-h-9',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'pill'
          ? cn(
              'rounded px-3 py-1.5',
              isActive
                ? `${SURFACE} ${FG} shadow-sm`
                : `${FG_MUTED} ${HOVER_FG}`,
            )
          : cn(
              '-mb-px rounded-none border-b-2 px-4 py-2',
              isActive
                ? 'border-primary-600 text-primary-600'
                : `border-transparent ${FG_MUTED} ${HOVER_CONTROL_BORDER} ${HOVER_FG}`,
            ),
        className,
      )}
      {...props}
    >
      {children}
      {invalidId && (
        <>
          <span className="ms-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-danger-600 align-middle" aria-hidden="true" />
          <span id={invalidId} hidden>{invalidLabel}</span>
        </>
      )}
      {countId && (
        <span id={countId} aria-hidden="true" className={cn('ms-1.5 inline-block rounded-full px-1.5 align-middle text-xs leading-4', LINE_BG, FG)}>
          {count}
        </span>
      )}
    </JButton>
  );
};

// ── TabsContent ────────────────────────────────────────────────────────────
interface JTabsContentViewProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const JTabsContentView: React.FC<JTabsContentViewProps> = ({
  value, className, children, ...props
}) => {
  const { value: activeValue, keepMounted } = useContext(JTabsContext);
  const active = activeValue === value;
  if (!active && !keepMounted) return null;
  return (
    <div
      role="tabpanel"
      hidden={!active}
      tabIndex={0}
      className={cn(
        'min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
