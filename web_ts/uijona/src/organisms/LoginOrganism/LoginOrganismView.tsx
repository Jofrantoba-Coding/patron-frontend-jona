// LoginOrganismView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterLoginOrganism } from './InterLoginOrganism';
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
import { JFormField } from '../../molecules/JFormField';
import { JButton } from '../../atoms/JButton';
import { JAlert } from '../../molecules/JAlert';

export const LoginOrganismView: React.FC<InterLoginOrganism> = ({
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
  <CardMolecule className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>

      <CardContent>
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
      </CardContent>

      <CardFooter className="flex-col gap-2">
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
      </CardFooter>
  </CardMolecule>
);
