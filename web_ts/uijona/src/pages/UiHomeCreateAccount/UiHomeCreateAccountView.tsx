// UiHomeCreateAccountView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterUiHomeCreateAccount } from './InterUiHomeCreateAccount';
import { BorderLayoutView } from '../../layouts/BorderLayout';
import { CreateAccountOrganismView } from '../../organisms/CreateAccountOrganism';
import { HeaderPageOrganismView } from '../../organisms/HeaderPageOrganism';
import { FooterPageOrganismView } from '../../organisms/FooterPageOrganism';

export const UiHomeCreateAccountView: React.FC<InterUiHomeCreateAccount> = ({
  name, email, password, confirmPassword,
  nameError, emailError, passwordError, confirmPasswordError,
  alertMessage, isLoading,
  setName, setEmail, setPassword, setConfirmPassword,
  onSubmit, onGoToLogin,
  appTitle, footerText,
}) => (
  <BorderLayoutView
    north={<HeaderPageOrganismView title={appTitle} />}
    south={<FooterPageOrganismView text={footerText} />}
    center={
      <CreateAccountOrganismView
        name={name}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        nameError={nameError}
        emailError={emailError}
        passwordError={passwordError}
        confirmPasswordError={confirmPasswordError}
        alertMessage={alertMessage}
        isLoading={isLoading}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={onSubmit}
        onGoToLogin={onGoToLogin}
      />
    }
  />
);
