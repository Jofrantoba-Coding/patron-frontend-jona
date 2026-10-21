// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JFormField, JSelectField } from 'jona-ui';
import type { InterUiLogin } from './InterUiLogin';

export function UiLoginView({
  title,
  submitLabel,
  tenantOptions,
  tenantId,
  usuario,
  clave,
  tenantError,
  usuarioError,
  claveError,
  submitError,
  submitErrorTraceId,
  isLoadingTenants,
  isSubmitting,
  onTenantChange,
  onUsuarioChange,
  onClaveChange,
  onSubmit,
}: InterUiLogin) {
  return (
    <form
      noValidate
      aria-label={title}
      style={{ display: 'grid', gap: 12, maxWidth: 380, margin: '4rem auto' }}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <h1>{title}</h1>
      {submitError ? (
        <JAlert variant="danger" role="alert">
          <span>{submitError}</span>
          {submitErrorTraceId ? <small> Código de seguimiento: {submitErrorTraceId}</small> : null}
        </JAlert>
      ) : null}
      <JSelectField
        id="login-tenant"
        label="Base de datos"
        placeholder={isLoadingTenants ? 'Cargando...' : 'Seleccione'}
        options={tenantOptions}
        value={tenantId}
        errorMessage={tenantError}
        disabled={isLoadingTenants || isSubmitting}
        onChange={(value) => onTenantChange?.(value)}
      />
      <JFormField
        id="login-usuario"
        label="Usuario"
        autoComplete="username"
        value={usuario}
        errorMessage={usuarioError}
        disabled={isSubmitting}
        onChange={(value) => onUsuarioChange?.(value)}
      />
      <JFormField
        id="login-clave"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={clave}
        errorMessage={claveError}
        disabled={isSubmitting}
        onChange={(value) => onClaveChange?.(value)}
      />
      <JButton type="submit" loading={isSubmitting}>
        {submitLabel}
      </JButton>
    </form>
  );
}
