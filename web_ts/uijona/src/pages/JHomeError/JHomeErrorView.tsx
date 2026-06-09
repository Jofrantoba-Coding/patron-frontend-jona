// JHomeErrorView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterJHomeError } from './InterJHomeError';
import { JBorderLayoutView } from '../../layouts/JBorderLayout';
import { JErrorPageView } from '../../organisms/JErrorPage';
import { JHeaderPageView } from '../../organisms/JHeaderPage';
import { JFooterPageView } from '../../organisms/JFooterPage';

export const JHomeErrorView: React.FC<InterJHomeError> = ({
  errorCode, title, message,
  onGoHome, onGoBack,
  primaryLabel, secondaryLabel,
  appTitle, footerText,
}) => (
  <JBorderLayoutView
    north={<JHeaderPageView title={appTitle} />}
    south={<JFooterPageView text={footerText} />}
    center={
      <JErrorPageView
        errorCode={errorCode}
        title={title}
        message={message}
        onGoHome={onGoHome}
        onGoBack={onGoBack}
        primaryLabel={primaryLabel}
        secondaryLabel={secondaryLabel}
      />
    }
  />
);
