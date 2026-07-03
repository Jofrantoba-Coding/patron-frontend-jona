// JFaqItemView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJFaqItem } from './InterJFaqItem';

export const JFaqItemView: React.FC<InterJFaqItem> = ({
  question,
  answer,
  className,
}) => (
  <div
    className={cn(
      'rounded-xl border border-neutral-200 bg-neutral-50 p-6',
      className,
    )}
  >
    <strong className="mb-2 block text-base font-bold text-neutral-900">{question}</strong>
    <p className="text-sm leading-relaxed text-neutral-600">{answer}</p>
  </div>
);
