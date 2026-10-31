import type { InterUiLogin } from './InterUiLogin';

/** Vista: render puro. No importa servicios ni la Implementación. */
export function UiLoginView({
  title, submitLabel, email, password, error, isSubmitting,
  onEmailChange, onPasswordChange, onSubmit,
}: InterUiLogin) {
  return (
    <form aria-label={title} onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}>
      <h1>{title}</h1>
      {error ? <p role="alert">{error}</p> : null}
      <input type="email" aria-label="Correo" value={email} disabled={isSubmitting}
             onChange={(event) => onEmailChange?.(event.target.value)} />
      <input type="password" aria-label="Contraseña" value={password} disabled={isSubmitting}
             onChange={(event) => onPasswordChange?.(event.target.value)} />
      <button type="submit" disabled={isSubmitting}>{submitLabel}</button>
    </form>
  );
}
