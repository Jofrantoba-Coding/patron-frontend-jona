// UiHomeErrorView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterUiHomeError } from './InterUiHomeError';
import { BorderLayoutView } from '../../layouts/BorderLayout';
import { ErrorPageOrganismView } from '../../organisms/ErrorPageOrganism';
import { HeaderPageOrganismView } from '../../organisms/HeaderPageOrganism';
import { FooterPageOrganismView } from '../../organisms/FooterPageOrganism';

export const UiHomeErrorView: React.FC<InterUiHomeError> = ({
  errorCode, title, message,
  onGoHome, onGoBack,
  primaryLabel, secondaryLabel,
  appTitle, footerText,
}) => (
  <BorderLayoutView
    north={<HeaderPageOrganismView title={appTitle} />}
    south={<FooterPageOrganismView text={footerText} />}
    center={
      <ErrorPageOrganismView
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
