// RelatedItemMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JLabel } from '../../atoms/JLabel';
import { InterRelatedItemMolecule } from './InterRelatedItemMolecule';

export const RelatedItemMoleculeView: React.FC<InterRelatedItemMolecule> = ({
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
