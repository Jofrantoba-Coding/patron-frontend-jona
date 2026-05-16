// FaqItemMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { InterFaqItemMolecule } from './InterFaqItemMolecule';

export const FaqItemMoleculeView: React.FC<InterFaqItemMolecule> = ({
  question,
  answer,
  className,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('detail-faq-item', className)}>
    <TextAtom as="strong" className="detail-faq-q">{question}</TextAtom>
    <TextAtom className="detail-faq-a">{answer}</TextAtom>
  </PanelAtom>
);
