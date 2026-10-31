import React from 'react';
import { cn } from '../../lib/cn';
import { JPROGRESS_DEFAULTS, InterJProgress, JProgressVariant, JProgressSize } from './InterJProgress';
import { FG_MUTED, FG_MUTED_FILL, LINE_BG, LINE_STROKE } from '../../theme/tokenClasses';

// ── Bar ──────────────────────────────────────────────────────────────────────

const barHeight: Record<JProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

const barFill: Record<JProgressVariant, string> = {
  default: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-500',
  danger:  'bg-danger-500',
};

// ── Circle ───────────────────────────────────────────────────────────────────

const circleDiameter: Record<JProgressSize, number> = {
  sm: 48,
  md: 72,
  lg: 104,
};

const circleStrokeWidth: Record<JProgressSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
};

// Stroke classes, so the circle follows the theme tokens (an SVG attribute cannot read var()).
const circleStroke: Record<JProgressVariant, string> = {
  default: 'stroke-primary-600',
  success: 'stroke-success-600',
  warning: 'stroke-warning-500',
  danger:  'stroke-danger-500',
};

const circleFontSize: Record<JProgressSize, number> = {
  sm: 10,
  md: 13,
  lg: 18,
};

// ─────────────────────────────────────────────────────────────────────────────

type JProgressViewProps = InterJProgress & {
  forwardedRef?: React.Ref<HTMLDivElement>;
};

export const JProgressView: React.FC<JProgressViewProps> = ({
  value     = JPROGRESS_DEFAULTS.value,
  max       = JPROGRESS_DEFAULTS.max,
  variant   = JPROGRESS_DEFAULTS.variant,
  type      = JPROGRESS_DEFAULTS.type,
  size      = JPROGRESS_DEFAULTS.size,
  showLabel = JPROGRESS_DEFAULTS.showLabel,
  animated  = JPROGRESS_DEFAULTS.animated,
  label,
  className,
  style,
  forwardedRef,
}) => {
  const pct = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0));
  const displayLabel = label ?? `${Math.round(pct)}%`;

  // ── Circle ──────────────────────────────────────────────────────────────
  if (type === 'circle') {
    const sz  = circleDiameter[size];
    const sw  = circleStrokeWidth[size];
    const r   = (sz - sw) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;

    return (
      <div
        ref={forwardedRef}
        data-jprogress-type="circle"
        data-jprogress-variant={variant}
        data-jprogress-size={size}
        className={cn('jprogress inline-flex items-center justify-center', className)}
        style={style}
      >
        <svg
          width={sz}
          height={sz}
          viewBox={`0 0 ${sz} ${sz}`}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={displayLabel}
        >
          {/* track */}
          <circle
            cx={sz / 2} cy={sz / 2} r={r}
            fill="none"
            className={LINE_STROKE}
            strokeWidth={sw}
          />
          {/* fill */}
          <circle
            cx={sz / 2} cy={sz / 2} r={r}
            fill="none"
            className={circleStroke[variant]}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.35s ease', transformOrigin: 'center' }}
            transform={`rotate(-90 ${sz / 2} ${sz / 2})`}
          />
          {/* label */}
          {showLabel && (
            <text
              x="50%" y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              className={FG_MUTED_FILL}
              fontWeight={600}
              style={{ fontSize: circleFontSize[size], fontVariantNumeric: 'tabular-nums' }}
            >
              {displayLabel}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // ── Bar ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={forwardedRef}
      data-jprogress-type="bar"
      data-jprogress-variant={variant}
      data-jprogress-size={size}
      className={cn('jprogress flex items-center gap-2', className)}
      style={style}
    >
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={displayLabel}
        className={cn(
          `relative flex-1 rounded-full ${LINE_BG} overflow-hidden`,
          barHeight[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            barFill[variant],
            animated && 'jprogress-bar-shimmer'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs ${FG_MUTED} tabular-nums w-9 text-right shrink-0`}>
          {displayLabel}
        </span>
      )}
    </div>
  );
};

JProgressView.displayName = 'JProgressView';
