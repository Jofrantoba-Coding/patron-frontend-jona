// BenefitItemMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { InterBenefitItemMolecule } from './InterBenefitItemMolecule';

export const BenefitItemMoleculeView: React.FC<InterBenefitItemMolecule> = ({
  text,
  className,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('detail-benefit-card', className)}>
    <PanelAtom as="span" variant="ghost" padding="none" radius="none" className="detail-benefit-dot" />
    <TextAtom className="detail-benefit-text">{text}</TextAtom>
  </PanelAtom>
);
