// Vista pura: el formulario con los campos del sistema de diseño. El campo de contraseña es un
// JField de tipo password con autoComplete: el navegador y el gestor de contraseñas lo reconocen.
import { JButton, JField, JPageLayout, JText } from '@jona-libro/ds-atomico';
import type { InterUiSesion } from './InterUiSesion';

export function UiSesionView({
  email, clave, pendiente, error,
  titulo, etiquetaEmail, etiquetaClave, textoEntrar, textoCredenciales, textoNoDisponible,
  onCambiarEmail, onCambiarClave, onEntrar,
}: InterUiSesion) {
  return (
    <JPageLayout title={titulo}>
      <form
        aria-label={titulo}
        onSubmit={(evento) => {
          evento.preventDefault();
          onEntrar();
        }}
      >
        <JField label={etiquetaEmail} type="email" autoComplete="username" value={email} onChange={onCambiarEmail} required />
        <JField label={etiquetaClave} type="password" autoComplete="current-password" value={clave} onChange={onCambiarClave} required />
        {error && <JText tone="danger" role="alert">{error === 'credenciales' ? textoCredenciales : textoNoDisponible}</JText>}
        <JButton type="submit" disabled={pendiente}>{textoEntrar}</JButton>
      </form>
    </JPageLayout>
  );
}
