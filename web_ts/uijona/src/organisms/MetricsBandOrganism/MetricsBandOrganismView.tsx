// MetricsBandOrganismView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { GridLayout } from '../../layouts/GridLayout';
import { InterMetricsBandOrganism } from './InterMetricsBandOrganism';

export const MetricsBandOrganismView: React.FC<InterMetricsBandOrganism> = ({
  metrics,
  as = 'section',
  id,
  className,
}) => (
  <PanelAtom
    as={as}
    id={id}
    variant="ghost"
    padding="none"
    radius="none"
    className={cn('metrics-section', className)}
  >
    <PanelAtom variant="ghost" padding="none" radius="none" className="section-shell">
      <GridLayout autoFitMin="260px" className="metrics-grid">
        {metrics.map((m) => (
          <PanelAtom key={m.label} variant="ghost" padding="none" radius="none" className="metric-item">
            <TextAtom as="strong">{m.value}</TextAtom>
            <TextAtom as="span">{m.label}</TextAtom>
          </PanelAtom>
        ))}
      </GridLayout>
    </PanelAtom>
  </PanelAtom>
);
