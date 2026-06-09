// JErrorPageView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterJErrorPage } from './InterJErrorPage';
import { JButton } from '../../atoms/JButton';
import { JLabel } from '../../atoms/JLabel';
import { JPanel } from '../../atoms/JPanel/JPanel';

export const JErrorPageView: React.FC<InterJErrorPage> = ({
  errorCode,
  title,
  message,
  onGoHome,
  onGoBack,
  primaryLabel,
  secondaryLabel,
}) => (
  <JPanel variant="ghost" padding="none" radius="none" className="flex w-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12">
    <JPanel variant="ghost" padding="none" radius="none" className="flex w-full max-w-sm flex-col items-center sm:max-w-md">
      {errorCode && (
        <JLabel
          as="p"
          size="2xl"
          className="font-extrabold text-blue-600 text-8xl leading-none mb-4 select-none"
        >
          {errorCode}
        </JLabel>
      )}
      <JLabel as="h1" size="2xl" className="font-bold text-gray-900 mb-2">
        {title}
      </JLabel>
      <JLabel as="p" size="base" color="muted" className="mb-8 break-words">
        {message}
      </JLabel>
      <JPanel variant="ghost" padding="none" radius="none" className="flex flex-wrap gap-3 justify-center">
        {onGoHome && (
          <JButton variant="link" onClick={onGoHome}>
            {primaryLabel}
          </JButton>
        )}
        {onGoBack && (
          <JButton variant="outline" onClick={onGoBack}>
            {secondaryLabel}
          </JButton>
        )}
      </JPanel>
    </JPanel>
  </JPanel>
);
