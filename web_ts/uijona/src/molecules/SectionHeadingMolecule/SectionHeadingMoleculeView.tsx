// SectionHeadingMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterSectionHeadingMolecule } from './InterSectionHeadingMolecule';

export const SectionHeadingMoleculeView: React.FC<InterSectionHeadingMolecule> = ({
  eyebrow,
  heading,
  description,
  className,
}) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('section-heading', className)}>
    {eyebrow && (
      <JLabel as="span" className="eyebrow">{eyebrow}</JLabel>
    )}
    <JLabel as="h2" className="section-title">{heading}</JLabel>
    {description && (
      <JLabel className="section-copy">{description}</JLabel>
    )}
  </JPanel>
);
