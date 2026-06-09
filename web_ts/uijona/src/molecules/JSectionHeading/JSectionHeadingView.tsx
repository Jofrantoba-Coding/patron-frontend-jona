// JSectionHeadingView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJSectionHeading } from './InterJSectionHeading';

export const JSectionHeadingView: React.FC<InterJSectionHeading> = ({
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
