// JHomeCreateAccountView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterJHomeCreateAccount } from './InterJHomeCreateAccount';
import { JBorderLayoutView } from '../../layouts/JBorderLayout';
import { JCreateAccountView } from '../../organisms/JCreateAccount';
import { JHeaderPageView } from '../../organisms/JHeaderPage';
import { JFooterPageView } from '../../organisms/JFooterPage';

export const JHomeCreateAccountView: React.FC<InterJHomeCreateAccount> = ({
  name, email, password, confirmPassword,
  nameError, emailError, passwordError, confirmPasswordError,
  alertMessage, isLoading,
  setName, setEmail, setPassword, setConfirmPassword,
  onSubmit, onGoToLogin,
  appTitle, footerText,
}) => (
  <JBorderLayoutView
    north={<JHeaderPageView title={appTitle} />}
    south={<JFooterPageView text={footerText} />}
    center={
      <JCreateAccountView
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
