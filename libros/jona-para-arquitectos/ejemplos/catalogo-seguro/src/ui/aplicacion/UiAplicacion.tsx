// La composición de las dos pantallas: sin sesión, el inicio de sesión; con sesión, el catálogo.
// No tiene vista propia ni decide permisos: guarda la sesión que respondió el servidor y la pasa.
import { useEffect, useState } from 'react';
import type { SesionUsuario } from '../../dominio/SesionUsuario';
import { UiCatalogo, type InterServicioCatalogo } from '../catalogo';
import { UiSesion, type InterServicioSesion } from '../sesion';

/** Lo que necesita la aplicación entera: lo implementan el adaptador fetch y el servicio falso. */
export type InterServicioAplicacion = InterServicioSesion & InterServicioCatalogo;

export interface UiAplicacionProps {
  servicio: InterServicioAplicacion;
}

export function UiAplicacion({ servicio }: UiAplicacionProps) {
  // undefined: todavía no se preguntó; null: no hay sesión.
  const [sesion, setSesion] = useState<SesionUsuario | null>();

  useEffect(() => {
    servicio.actual().then((actual) => setSesion(actual ?? null), () => setSesion(null));
  }, [servicio]);

  if (sesion === undefined) return null;
  if (sesion === null) return <UiSesion servicio={servicio} onEntro={setSesion} />;
  return (
    <UiCatalogo
      sesion={sesion}
      servicio={servicio}
      onSalir={() => {
        servicio.salir().finally(() => setSesion(null));
      }}
    />
  );
}
