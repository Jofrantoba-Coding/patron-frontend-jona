// JFaqItemView.tsx — JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJFaqItem } from './InterJFaqItem';

export const JFaqItemView: React.FC<InterJFaqItem> = ({
  question,
  answer,
  className,
}) => (
  <JPanel variant="ghost" padding="none" radius="none" className={cn('detail-faq-item', className)}>
    <JLabel as="strong" className="detail-faq-q">{question}</JLabel>
    <JLabel className="detail-faq-a">{answer}</JLabel>
  </JPanel>
);
