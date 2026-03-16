// TabsMolecule.tsx — Level 2: Molecule
// Observer pattern: TabsMoleculeProps extends InterEventsTabsMolecule (event contract).
import React, { createContext, useContext } from 'react';
import { cn } from '../lib/cn';
import { InterEventsTabsMolecule } from './events/InterEventsTabsMolecule';

// ── Context ───────────────────────────────────────────────────────────────────

interface TabsContextValue {
  value: string;
  onChange: (v: string) => void;
  onTabFocus?: (v: string) => void;
  onDisabledTabClick?: (v: string) => void;
  variant: 'pill' | 'line';
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue>({
  value: '',
  onChange: () => {},
  variant: 'pill',
  orientation: 'horizontal',
});

// ── Root ──────────────────────────────────────────────────────────────────────

interface TabsMoleculeProps extends InterEventsTabsMolecule {
  value: string;
  variant?: 'pill' | 'line';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: React.ReactNode;
}

export const TabsMolecule: React.FC<TabsMoleculeProps> = ({
  value,
  onChange,
  onTabFocus,
  onDisabledTabClick,
  variant = 'pill',
  orientation = 'horizontal',
  className,
  children,
}) => (
  <TabsContext.Provider value={{ value, onChange: onChange ?? (() => {}), onTabFocus, onDisabledTabClick, variant, orientation }}>
    <div
      className={cn(
        orientation === 'vertical' ? 'flex gap-4' : 'flex flex-col gap-2',
        className
      )}
    >
      {children}
    </div>
  </TabsContext.Provider>
);

// ── List ──────────────────────────────────────────────────────────────────────

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const { variant, orientation } = useContext(TabsContext);
  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        variant === 'pill'
          ? 'bg-neutral-100 rounded-token-md p-1 gap-1'
          : 'border-b border-neutral-200 gap-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ── Trigger ───────────────────────────────────────────────────────────────────

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  children,
  disabled,
  ...props
}) => {
  const { value: activeValue, onChange, onTabFocus, onDisabledTabClick, variant } = useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          onDisabledTabClick?.(value);
        } else {
          onChange(value);
        }
      }}
      onFocus={() => onTabFocus?.(value)}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 text-sm font-medium',
        'transition-all duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'pill'
          ? cn(
              'px-3 py-1.5 rounded-token-sm',
              isActive
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            )
          : cn(
              'px-4 py-2 border-b-2 -mb-px rounded-none',
              isActive
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// ── Content panel ─────────────────────────────────────────────────────────────

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const { value: activeValue } = useContext(TabsContext);
  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
