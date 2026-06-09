// JTabsView.tsx — JONA View (render puro)
import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton/JButton';
import { InterJTabs } from './InterJTabs';

// ── Context ────────────────────────────────────────────────────────────────
interface JTabsContextValue {
  value:               string;
  onChange:            (v: string) => void;
  onTabFocus?:         (v: string) => void;
  onDisabledTabClick?: (v: string) => void;
  variant:             'pill' | 'line';
  orientation:         'horizontal' | 'vertical';
}

export const JTabsContext = createContext<JTabsContextValue>({
  value: '', onChange: () => {}, variant: 'pill', orientation: 'horizontal',
});

// ── Root ───────────────────────────────────────────────────────────────────
export const JTabsView: React.FC<InterJTabs> = ({
  value, onChange, onTabFocus, onDisabledTabClick,
  variant = 'pill', orientation = 'horizontal', className, children,
}) => (
  <JTabsContext.Provider
    value={{ value, onChange: onChange ?? (() => {}), onTabFocus, onDisabledTabClick, variant, orientation }}
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
          ? 'gap-1 rounded-md bg-neutral-100 p-1'
          : 'gap-0 border-b border-neutral-200',
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
}

export const JTabsTriggerView: React.FC<JTabsTriggerViewProps> = ({
  value, className, children, disabled, ...props
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
        'inline-flex max-w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'pill'
          ? cn(
              'rounded px-3 py-1.5',
              isActive
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700',
            )
          : cn(
              '-mb-px rounded-none border-b-2 px-4 py-2',
              isActive
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700',
            ),
        className,
      )}
      {...props}
    >
      {children}
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
  const { value: activeValue } = useContext(JTabsContext);
  if (activeValue !== value) return null;
  return (
    <div
      role="tabpanel"
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
