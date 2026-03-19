// Capa: Template
// Responsabilidad: estado local, handlers y estructura visual del organismo.
// Restricciones: no importar servicios, router ni storage.
import { useState, type FormEvent } from 'react';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import type { UiIniciarSesionProps } from './UiIniciarSesionProps';
import type { UiIniciarSesionTemplateModel } from './UiIniciarSesionTemplateModel';

export function useUiIniciarSesion(): UiIniciarSesionTemplateModel {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function isValidData(nextEmail: string, nextPassword: string): boolean {
    const trimmedEmail = nextEmail.trim();
    const trimmedPassword = nextPassword.trim();
    let valid = true;

    if (!trimmedEmail) {
      setEmailError('El email es obligatorio.');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setEmailError('El email debe tener un formato válido.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!trimmedPassword) {
      setPasswordError('La contraseña es obligatoria.');
      valid = false;
    } else if (trimmedPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  }

  function login(_email: string, _password: string): void {
    setSubmitError('El Template no puede autenticar; ese trabajo pertenece al Impl.');
  }

  function goToCreateAccount(): void {
    setSubmitError('La navegación real a crear cuenta debe integrarse en UiIniciarSesionImpl.');
  }

  function goToRecoverPassword(): void {
    setSubmitError('La recuperación de contraseña debe integrarse en UiIniciarSesionImpl.');
  }

  function handlerEmailChange(value: string): void {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
    if (submitError) {
      setSubmitError('');
    }
  }

  function handlerPasswordChange(value: string): void {
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
    if (submitError) {
      setSubmitError('');
    }
  }

  function handlerLogin(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSubmitError('');

    if (isValidData(email, password)) {
      login(email, password);
    }
  }

  function handlerGoToCreateAccount(): void {
    goToCreateAccount();
  }

  function handlerGoToRecoverPassword(): void {
    goToRecoverPassword();
  }

  return {
    email,
    password,
    emailError,
    passwordError,
    submitError,
    isSubmitting,
    setEmail,
    setPassword,
    setEmailError,
    setPasswordError,
    setSubmitError,
    setIsSubmitting,
    login,
    goToCreateAccount,
    goToRecoverPassword,
    isValidData,
    handlerEmailChange,
    handlerPasswordChange,
    handlerLogin,
    handlerGoToCreateAccount,
    handlerGoToRecoverPassword,
  };
}

export function UiIniciarSesion({
  email,
  password,
  emailError,
  passwordError,
  submitError,
  isSubmitting,
  handlerEmailChange,
  handlerPasswordChange,
  handlerLogin,
  handlerGoToCreateAccount,
  handlerGoToRecoverPassword,
}: UiIniciarSesionProps) {
  return (
    <section className="card stack-lg">
      <div className="stack-sm">
        <span className="badge">Organism JONA</span>
        <TextAtom as="h2" tone="strong" className="card__title">
          UiIniciarSesion
        </TextAtom>
        <TextAtom tone="muted">
          La Interface dice qué puede hacer la vista; el Template organiza estado local y
          composición visual sin tocar backend.
        </TextAtom>
      </div>

      <div className="divider" />

      <form className="stack-sm" onSubmit={handlerLogin} noValidate>
        <FormFieldMolecule
          id="txtEmail"
          label="Email"
          type="email"
          value={email}
          autoComplete="email"
          placeholder="architect@jona.dev"
          required
          disabled={isSubmitting}
          errorMessage={emailError}
          onChange={handlerEmailChange}
        />

        <FormFieldMolecule
          id="txtPassword"
          label="Contraseña"
          type="password"
          value={password}
          autoComplete="current-password"
          placeholder="codex123"
          required
          disabled={isSubmitting}
          errorMessage={passwordError}
          onChange={handlerPasswordChange}
        />

        {submitError ? <TextAtom tone="danger">{submitError}</TextAtom> : null}

        <div className="card__actions">
          <ButtonAtom type="submit" variant="primary" loading={isSubmitting}>
            Iniciar sesión
          </ButtonAtom>
          <ButtonAtom type="button" variant="ghost" onClick={handlerGoToCreateAccount}>
            Crear cuenta
          </ButtonAtom>
          <ButtonAtom type="button" variant="secondary" onClick={handlerGoToRecoverPassword}>
            Recuperar contraseña
          </ButtonAtom>
        </div>
      </form>
    </section>
  );
}
