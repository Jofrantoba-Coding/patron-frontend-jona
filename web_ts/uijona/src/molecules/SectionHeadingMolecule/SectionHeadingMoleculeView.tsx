// SectionHeadingMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { InterSectionHeadingMolecule } from './InterSectionHeadingMolecule';

export const SectionHeadingMoleculeView: React.FC<InterSectionHeadingMolecule> = ({
  eyebrow,
  heading,
  description,
  className,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('section-heading', className)}>
    {eyebrow && (
      <TextAtom as="span" className="eyebrow">{eyebrow}</TextAtom>
    )}
    <TextAtom as="h2" className="section-title">{heading}</TextAtom>
    {description && (
      <TextAtom className="section-copy">{description}</TextAtom>
    )}
  </PanelAtom>
);
