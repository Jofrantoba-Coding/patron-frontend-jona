// JNumberedStepView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJNumberedStep } from './InterJNumberedStep';

export const JNumberedStepView: React.FC<InterJNumberedStep> = ({
  num,
  title,
  body,
  className,
}) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('contact-step', className)}>
    <JLabel as="span" className="contact-step-num">{num}</JLabel>
    <JPanel variant="ghost" padding="none" radius="none" className="contact-step-body">
      <JLabel as="strong" className="contact-step-title">{title}</JLabel>
      <JLabel className="contact-step-desc">{body}</JLabel>
    </JPanel>
  </JPanel>
);
