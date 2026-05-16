// RelatedItemMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { LinkAtom } from '../../atoms/LinkAtom/LinkAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { InterRelatedItemMolecule } from './InterRelatedItemMolecule';

export const RelatedItemMoleculeView: React.FC<InterRelatedItemMolecule> = ({
  name,
  outcome,
  href,
  linkLabel,
  className,
}) => (
  <LinkAtom href={href} className={cn('detail-related-card', className)}>
    <TextAtom as="strong" className="detail-related-name">{name}</TextAtom>
    <TextAtom className="detail-related-outcome">{outcome}</TextAtom>
    <TextAtom as="span" className="detail-related-link">{linkLabel}</TextAtom>
  </LinkAtom>
);
