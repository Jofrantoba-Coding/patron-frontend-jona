import { JButton } from '../../../shared/ui/jbutton';
import { JTextField } from '../../../shared/ui/jtextfield';
import type { InterUiLogin } from '../model/InterUiLogin';

/**
 * Vista: render puro. Solo conoce el contrato de UI; no importa servicios ni la Implementación.
 * En Atomic Design es un organismo: se compone con átomos de shared/ui, por su API pública.
 */
export function UiLoginView({
  title, submitLabel, email, password, error, isSubmitting,
  onEmailChange, onPasswordChange, onSubmit,
}: InterUiLogin) {
  return (
    <form aria-label={title} onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}>
      <h1>{title}</h1>
      {error ? <p role="alert">{error}</p> : null}
      <JTextField label="Correo" type="email" value={email} disabled={isSubmitting} onChange={onEmailChange} />
      <JTextField label="Contraseña" type="password" value={password} disabled={isSubmitting} onChange={onPasswordChange} />
      <JButton type="submit" loading={isSubmitting}>{submitLabel}</JButton>
    </form>
  );
}
