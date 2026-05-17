// BenefitItemMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { InterBenefitItemMolecule } from './InterBenefitItemMolecule';

export const BenefitItemMoleculeView: React.FC<InterBenefitItemMolecule> = ({
  text,
  className,
}) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('detail-benefit-card', className)}>
    <JPanel as="span" variant="ghost" padding="none" radius="none" className="detail-benefit-dot" />
    <TextAtom className="detail-benefit-text">{text}</TextAtom>
  </JPanel>
);
