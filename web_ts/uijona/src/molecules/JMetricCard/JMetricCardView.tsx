// JMetricCardView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJMetricCard } from './InterJMetricCard';

export const JMetricCardView: React.FC<InterJMetricCard> = ({
  value,
  label,
  className,
}) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('metric-item', className)}>
    <JLabel as="strong">{value}</JLabel>
    <JLabel as="span">{label}</JLabel>
  </JPanel>
);
