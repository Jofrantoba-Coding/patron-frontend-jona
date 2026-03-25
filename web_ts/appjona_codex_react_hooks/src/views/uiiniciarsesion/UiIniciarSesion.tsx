// Capa: Template (componente visual)
// Responsabilidad: estructura visual del organismo y composicion de Molecules/Atoms.
// Restricciones: no importar servicios, router ni storage.
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import type { UiIniciarSesionProps } from './UiIniciarSesionProps';

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
          La Interface dice que puede hacer la vista; el Template organiza estado local y
          composicion visual sin tocar backend.
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
          label="Contrasena"
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
            Iniciar sesion
          </ButtonAtom>
          <ButtonAtom type="button" variant="ghost" onClick={handlerGoToCreateAccount}>
            Crear cuenta
          </ButtonAtom>
          <ButtonAtom type="button" variant="secondary" onClick={handlerGoToRecoverPassword}>
            Recuperar contrasena
          </ButtonAtom>
        </div>
      </form>
    </section>
  );
}
