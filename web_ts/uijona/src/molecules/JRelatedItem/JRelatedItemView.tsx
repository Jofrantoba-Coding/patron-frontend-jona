// JRelatedItemView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JLabel } from '../../atoms/JLabel';
import { InterJRelatedItem } from './InterJRelatedItem';

export const JRelatedItemView: React.FC<InterJRelatedItem> = ({
  name,
  outcome,
  href,
  linkLabel,
  className,
}) => (
  <JLabel variant="link" href={href} className={cn('detail-related-card', className)}>
    <JLabel as="strong" className="detail-related-name">{name}</JLabel>
    <JLabel className="detail-related-outcome">{outcome}</JLabel>
    <JLabel as="span" className="detail-related-link">{linkLabel}</JLabel>
  </JLabel>
);
