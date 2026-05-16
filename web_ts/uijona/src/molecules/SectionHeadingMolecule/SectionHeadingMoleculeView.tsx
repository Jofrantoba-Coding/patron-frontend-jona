// SectionHeadingMoleculeView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { EyebrowAtom } from '../../atoms/EyebrowAtom/EyebrowAtom';
import {
  InterSectionHeadingMolecule,
  SectionHeadingAlign,
  SectionHeadingTone,
} from './InterSectionHeadingMolecule';

const alignClasses: Record<SectionHeadingAlign, string> = {
  left:   'items-start text-left',
  center: 'items-center text-center',
};

const headingToneClasses: Record<SectionHeadingTone, string> = {
  light: 'text-neutral-900',
  dark:  'text-white',
};

const descToneClasses: Record<SectionHeadingTone, string> = {
  light: 'text-neutral-600',
  dark:  'text-white/70',
};

export const SectionHeadingMoleculeView: React.FC<InterSectionHeadingMolecule> = ({
  eyebrow,
  heading,
  description,
  align = 'left',
  tone = 'light',
  eyebrowVariant = 'primary',
  className,
}) => (
  <div className={cn('flex flex-col gap-3', alignClasses[align], className)}>
    {eyebrow && <EyebrowAtom variant={eyebrowVariant}>{eyebrow}</EyebrowAtom>}
    <h2 className={cn('text-3xl font-bold leading-tight sm:text-4xl', headingToneClasses[tone])}>
      {heading}
    </h2>
    {description && (
      <p className={cn('max-w-2xl text-base leading-relaxed sm:text-lg', descToneClasses[tone])}>
        {description}
      </p>
    )}
  </div>
);
