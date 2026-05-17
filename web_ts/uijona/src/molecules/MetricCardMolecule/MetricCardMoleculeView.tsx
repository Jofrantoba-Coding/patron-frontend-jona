// MetricCardMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { InterMetricCardMolecule } from './InterMetricCardMolecule';

export const MetricCardMoleculeView: React.FC<InterMetricCardMolecule> = ({
  value,
  label,
  className,
}) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('metric-item', className)}>
    <TextAtom as="strong">{value}</TextAtom>
    <TextAtom as="span">{label}</TextAtom>
  </JPanel>
);
