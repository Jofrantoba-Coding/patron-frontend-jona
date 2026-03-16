// LoginOrganismView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterLoginOrganism } from './InterLoginOrganism';
import { CardMolecule, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../molecules/CardMolecule';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { AlertMolecule } from '../../molecules/AlertMolecule';

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
  <div className="flex items-center justify-center min-h-full py-8 px-4">
    <CardMolecule className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>

      <CardContent>
        {alertMessage && (
          <AlertMolecule variant="destructive" title="Error" className="mb-4">
            {alertMessage}
          </AlertMolecule>
        )}
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <FormFieldMolecule
            id="txtEmail"
            label="Email"
            type="email"
            value={email}
            onChange={(value) => setEmail(value)}
            placeholder="you@example.com"
            errorMessage={emailError}
            required
          />
          <FormFieldMolecule
            id="txtPassword"
            label="Password"
            type="password"
            value={password}
            onChange={(value) => setPassword(value)}
            placeholder="••••••••"
            errorMessage={passwordError}
            required
          />
          <ButtonAtom type="submit" fullWidth loading={isLoading}>
            Sign in
          </ButtonAtom>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {onGoToCreateAccount && (
          <ButtonAtom variant="ghost" fullWidth onClick={onGoToCreateAccount}>
            Create account
          </ButtonAtom>
        )}
        {onGoToRecoverPassword && (
          <ButtonAtom variant="link" fullWidth onClick={onGoToRecoverPassword}>
            Forgot password?
          </ButtonAtom>
        )}
      </CardFooter>
    </CardMolecule>
  </div>
);
