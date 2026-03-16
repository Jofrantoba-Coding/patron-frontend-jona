// UiHomeLoginView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterUiHomeLogin } from './InterUiHomeLogin';
import { BorderLayoutView } from '../../layouts/BorderLayout';
import { LoginOrganismView } from '../../organisms/LoginOrganism';
import { HeaderPageOrganismView } from '../../organisms/HeaderPageOrganism';
import { FooterPageOrganismView } from '../../organisms/FooterPageOrganism';

export const UiHomeLoginView: React.FC<InterUiHomeLogin> = ({
  email,
  password,
  emailError,
  passwordError,
  alertMessage,
  isLoading,
  setEmail,
  setPassword,
  onSubmit,
  onGoToCreateAccount,
  onGoToRecoverPassword,
  appTitle,
  footerText,
}) => (
  <BorderLayoutView
    north={<HeaderPageOrganismView title={appTitle} />}
    south={<FooterPageOrganismView text={footerText} />}
    center={
      <LoginOrganismView
        email={email}
        password={password}
        emailError={emailError}
        passwordError={passwordError}
        alertMessage={alertMessage}
        isLoading={isLoading}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={onSubmit}
        onGoToCreateAccount={onGoToCreateAccount}
        onGoToRecoverPassword={onGoToRecoverPassword}
      />
    }
  />
);
