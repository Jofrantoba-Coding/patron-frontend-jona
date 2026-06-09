// JHomeCreateAccountImpl.tsx — JONA Layer: Implementation (state + handlers)
import React, { useState } from 'react';
import { InterJHomeCreateAccount, JHOME_CREATE_ACCOUNT_DEFAULTS } from './InterJHomeCreateAccount';
import { JHomeCreateAccountView } from './JHomeCreateAccountView';

type JHomeCreateAccountImplProps = Partial<InterJHomeCreateAccount> & {
  /** Called with name, email, password when validation passes */
  onCreateAccount?: (name: string, email: string, password: string) => void | Promise<void>;
};

export const JHomeCreateAccountImpl: React.FC<JHomeCreateAccountImplProps> = (props) => {
  const merged = { ...JHOME_CREATE_ACCOUNT_DEFAULTS, ...props };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState(merged.nameError);
  const [emailError, setEmailError] = useState(merged.emailError);
  const [passwordError, setPasswordError] = useState(merged.passwordError);
  const [confirmPasswordError, setConfirmPasswordError] = useState(merged.confirmPasswordError);
  const [alertMessage, setAlertMessage] = useState(merged.alertMessage);
  const [isLoading, setIsLoading] = useState(merged.isLoading);

  function validate(): boolean {
    const nErr = !name ? 'Full name is required' : '';
    const eErr = !email ? 'Email is required' : '';
    const pErr = !password ? 'Password is required' : password.length < 6 ? 'Password must be at least 6 characters' : '';
    const cErr = !confirmPassword ? 'Please confirm your password' : confirmPassword !== password ? 'Passwords do not match' : '';
    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cErr);
    return !nErr && !eErr && !pErr && !cErr;
  }

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setAlertMessage('');
    try {
      await props.onCreateAccount?.(name, email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setAlertMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const viewProps: InterJHomeCreateAccount = {
    name, email, password, confirmPassword,
    nameError, emailError, passwordError, confirmPasswordError,
    alertMessage, isLoading,
    setName, setEmail, setPassword, setConfirmPassword,
    onSubmit,
    onGoToLogin: props.onGoToLogin,
    appTitle: merged.appTitle,
    footerText: merged.footerText,
  };

  return <JHomeCreateAccountView {...viewProps} />;
};
