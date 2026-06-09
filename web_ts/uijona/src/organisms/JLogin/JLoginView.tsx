// JLoginView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterJLogin } from './InterJLogin';
import { JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JCardFooter } from '../../molecules/JCard';
import { JFormField } from '../../molecules/JFormField';
import { JButton } from '../../atoms/JButton';
import { JAlert } from '../../molecules/JAlert';

export const JLoginView: React.FC<InterJLogin> = ({
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
}) => (
  <JCard className="w-full max-w-sm mx-auto">
      <JCardHeader>
        <JCardTitle>Sign in</JCardTitle>
        <JCardDescription>Enter your credentials to access your account</JCardDescription>
      </JCardHeader>

      <JCardContent>
        {alertMessage && (
          <JAlert variant="danger" title="Error" className="mb-4">
            {alertMessage}
          </JAlert>
        )}
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <JFormField
            id="txtEmail"
            label="Email"
            type="email"
            value={email}
            onChange={(value) => setEmail(value)}
            placeholder="you@example.com"
            errorMessage={emailError}
            required
          />
          <JFormField
            id="txtPassword"
            label="Password"
            type="password"
            value={password}
            onChange={(value) => setPassword(value)}
            placeholder="••••••••"
            errorMessage={passwordError}
            required
          />
          <JButton type="submit" fullWidth loading={isLoading}>
            Sign in
          </JButton>
        </form>
      </JCardContent>

      <JCardFooter className="flex-col gap-2">
        {onGoToCreateAccount && (
          <JButton variant="ghost" fullWidth onClick={onGoToCreateAccount}>
            Create account
          </JButton>
        )}
        {onGoToRecoverPassword && (
          <JButton variant="link" fullWidth onClick={onGoToRecoverPassword}>
            Forgot password?
          </JButton>
        )}
      </JCardFooter>
  </JCard>
);
