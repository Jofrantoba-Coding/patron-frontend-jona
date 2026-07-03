// JDashboardPreviewView.tsx — JONA View (render puro, Tailwind autocontenido + responsive)
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJDashboardPreview, JDASHBOARD_PREVIEW_DEFAULTS } from './InterJDashboardPreview';

export const JDashboardPreviewView: React.FC<InterJDashboardPreview> = ({
  title,
  statusLabel,
  stats,
  chartLabel,
  chart = JDASHBOARD_PREVIEW_DEFAULTS.chart!,
  className,
}) => (
  <JPanel
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('relative', className)}
  >
    <JPanel variant="ghost" padding="none" radius="none" className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary-100/60 to-transparent blur-2xl" aria-hidden="true" />
    <JPanel variant="ghost" padding="none" radius="none" className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.25)]">
      {/* Toolbar */}
      <JPanel variant="ghost" padding="none" radius="none" className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
        <JLabel as="span" className="ml-2 text-xs font-medium text-neutral-500">{title}</JLabel>
        {statusLabel && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-medium text-success-700">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" /> {statusLabel}
          </span>
        )}
      </JPanel>

      {/* Stats + chart */}
      <JPanel variant="ghost" padding="none" radius="none" className="grid grid-cols-2 gap-3 p-4">
        {stats.map((s) => (
          <JPanel
            key={s.label}
            variant="ghost"
            padding="none"
            radius="none"
            className={cn('rounded-xl border p-3', s.accent ? 'border-primary-200 bg-primary-50/50' : 'border-neutral-200 bg-white')}
          >
            <JLabel as="span" className="block text-[11px] font-medium text-neutral-500">{s.label}</JLabel>
            <JLabel as="strong" className="mt-1 block text-xl font-black text-neutral-900">{s.value}</JLabel>
            {s.delta && <JLabel as="span" className="block text-[11px] font-medium text-primary-600">{s.delta}</JLabel>}
          </JPanel>
        ))}
        {chart && chart.length > 0 && (
          <JPanel variant="ghost" padding="none" radius="none" className="col-span-2 rounded-xl border border-neutral-200 p-3">
            {chartLabel && <JLabel as="span" className="mb-2 block text-[11px] font-medium text-neutral-500">{chartLabel}</JLabel>}
            <JPanel variant="ghost" padding="none" radius="none" className="flex h-16 items-end gap-1.5">
              {chart.map((h, i) => (
                <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary-500 to-primary-300" style={{ height: `${h}%` }} />
              ))}
            </JPanel>
          </JPanel>
        )}
      </JPanel>
    </JPanel>
  </JPanel>
);
