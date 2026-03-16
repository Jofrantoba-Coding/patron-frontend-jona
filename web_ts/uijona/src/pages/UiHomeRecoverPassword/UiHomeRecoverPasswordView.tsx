// UiHomeRecoverPasswordView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterUiHomeRecoverPassword } from './InterUiHomeRecoverPassword';
import { BorderLayoutView } from '../../layouts/BorderLayout';
import { RecoverPasswordOrganismView } from '../../organisms/RecoverPasswordOrganism';
import { HeaderPageOrganismView } from '../../organisms/HeaderPageOrganism';
import { FooterPageOrganismView } from '../../organisms/FooterPageOrganism';

export const UiHomeRecoverPasswordView: React.FC<InterUiHomeRecoverPassword> = ({
  email,
  emailError,
  alertMessage,
  successMessage,
  isLoading,
  setEmail,
  onSubmit,
  onGoToLogin,
  appTitle,
  footerText,
}) => (
  <BorderLayoutView
    north={<HeaderPageOrganismView title={appTitle} />}
    south={<FooterPageOrganismView text={footerText} />}
    center={
      <RecoverPasswordOrganismView
        email={email}
        emailError={emailError}
        alertMessage={alertMessage}
        successMessage={successMessage}
        isLoading={isLoading}
        setEmail={setEmail}
        onSubmit={onSubmit}
        onGoToLogin={onGoToLogin}
      />
    }
  />
);
