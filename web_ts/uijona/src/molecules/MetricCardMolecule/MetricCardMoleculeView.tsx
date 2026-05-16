// MetricCardMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { InterMetricCardMolecule } from './InterMetricCardMolecule';

export const MetricCardMoleculeView: React.FC<InterMetricCardMolecule> = ({
  value,
  label,
  className,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('metric-item', className)}>
    <TextAtom as="strong">{value}</TextAtom>
    <TextAtom as="span">{label}</TextAtom>
  </PanelAtom>
);
