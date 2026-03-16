// UiHomeLoginImpl.tsx — JONA Layer: Implementation (state + handlers)
import React, { useState } from 'react';
import { InterUiHomeLogin, UI_HOME_LOGIN_DEFAULTS } from './InterUiHomeLogin';
import { UiHomeLoginView } from './UiHomeLoginView';

type UiHomeLoginImplProps = Partial<InterUiHomeLogin> & {
  /** Called with email + password when validation passes */
  onLogin?: (email: string, password: string) => void | Promise<void>;
};

export const UiHomeLoginImpl: React.FC<UiHomeLoginImplProps> = (props) => {
  const merged = { ...UI_HOME_LOGIN_DEFAULTS, ...props };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(merged.emailError);
  const [passwordError, setPasswordError] = useState(merged.passwordError);
  const [alertMessage, setAlertMessage] = useState(merged.alertMessage);
  const [isLoading, setIsLoading] = useState(merged.isLoading);

  function validate(): boolean {
    const eErr = !email ? 'Email is required' : '';
    const pErr = !password ? 'Password is required' : '';
    setEmailError(eErr);
    setPasswordError(pErr);
    return !eErr && !pErr;
  }

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setAlertMessage('');
    try {
      await props.onLogin?.(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setAlertMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const viewProps: InterUiHomeLogin = {
    email,
    password,
    emailError,
    passwordError,
    alertMessage,
    isLoading,
    setEmail,
    setPassword,
    onSubmit,
    onGoToCreateAccount: props.onGoToCreateAccount,
    onGoToRecoverPassword: props.onGoToRecoverPassword,
    appTitle: merged.appTitle,
    footerText: merged.footerText,
  };

  return <UiHomeLoginView {...viewProps} />;
};
