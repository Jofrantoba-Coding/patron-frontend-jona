// JMetricsBandView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JGridLayout } from '../../layouts/JGridLayout';
import { InterJMetricsBand } from './InterJMetricsBand';

export const JMetricsBandView: React.FC<InterJMetricsBand> = ({
  metrics,
  as = 'section',
  id,
  className,
}) => (
  <JPanel
    as={as}
    id={id}
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('metrics-section', className)}
  >
    <JPanel variant="ghost" padding="none" radius="none" className="section-shell">
      <JGridLayout autoFitMin="260px" className="metrics-grid">
        {metrics.map((m) => (
          <JPanel key={m.label} variant="ghost" padding="none" radius="none" className="metric-item">
            <JLabel as="strong">{m.value}</JLabel>
            <JLabel as="span">{m.label}</JLabel>
          </JPanel>
        ))}
      </JGridLayout>
    </JPanel>
  </JPanel>
);
