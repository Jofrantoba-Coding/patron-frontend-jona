import { useState } from 'react';
import type { SesionUsuario } from '../../dominio/SesionUsuario';
import type { InterServicioSesion } from './InterServicioSesion';
import type { DatosUiSesion, EventosUiSesion } from './InterUiSesion';

/**
 * Implementación: el formulario y su envío. La contraseña vive en el estado solo mientras se
 * escribe: se borra después de cada intento, salga bien o mal. No guarda nada más de la sesión
 * que lo que entrega a quien compone.
 */
export function useUiSesionImpl(servicio: InterServicioSesion, onEntro: (sesion: SesionUsuario) => void): DatosUiSesion & EventosUiSesion {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState<DatosUiSesion['error']>();

  return {
    email,
    clave,
    pendiente,
    error,
    onCambiarEmail: setEmail,
    onCambiarClave: setClave,
    onEntrar: async () => {
      setPendiente(true);
      setError(undefined);
      try {
        const sesion = await servicio.entrar(email.trim(), clave);
        if (sesion) onEntro(sesion);
        else setError('credenciales');
      } catch {
        setError('no-disponible');
      } finally {
        setClave('');
        setPendiente(false);
      }
    },
  };
}
