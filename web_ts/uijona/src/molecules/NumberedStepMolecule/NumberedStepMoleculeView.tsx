// NumberedStepMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { InterNumberedStepMolecule } from './InterNumberedStepMolecule';

export const NumberedStepMoleculeView: React.FC<InterNumberedStepMolecule> = ({
  num,
  title,
  body,
  className,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('contact-step', className)}>
    <TextAtom as="span" className="contact-step-num">{num}</TextAtom>
    <PanelAtom variant="ghost" padding="none" radius="none" className="contact-step-body">
      <TextAtom as="strong" className="contact-step-title">{title}</TextAtom>
      <TextAtom className="contact-step-desc">{body}</TextAtom>
    </PanelAtom>
  </PanelAtom>
);
