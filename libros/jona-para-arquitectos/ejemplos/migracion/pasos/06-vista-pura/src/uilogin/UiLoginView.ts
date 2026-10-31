import { Button, Label, TextField } from '../../../../comun/pantalla.js';
import { crearAuthServiceHttp } from '../servicios/AuthServiceHttp.js';
import type { InterAuthService, Usuario } from '../servicios/InterAuthService.js';
import { UILOGIN_DEFAULTS, type InterUiLogin } from './InterUiLogin.js';
import { crearUiLoginImpl } from './UiLoginImpl.js';

export interface PantallaLogin {
  titulo: Label;
  correo: TextField;
  errorCorreo: Label;
  clave: TextField;
  errorClave: Label;
  boton: Button;
  mensaje: Label;
}

/** Vista: modelo de vista -> controles. Solo pinta y reenvía lo que hace la persona; no produce efectos. */
export function crearUiLoginView() {
  const pantalla: PantallaLogin = {
    titulo: new Label(),
    correo: new TextField(),
    errorCorreo: new Label(),
    clave: new TextField(),
    errorClave: new Label(),
    boton: new Button(),
    mensaje: new Label(),
  };
  pantalla.boton.className = 'boton-primario';

  let modelo: InterUiLogin | undefined;
  pantalla.correo.onChange((correo) => modelo?.alCambiarCorreo?.(correo));
  pantalla.clave.onChange((clave) => modelo?.alCambiarClave?.(clave));
  pantalla.boton.onClick(() => modelo?.alEnviar?.());

  function pintar(m: InterUiLogin): void {
    modelo = m;
    pantalla.titulo.text = m.titulo ?? '';
    pantalla.boton.label = m.textoBoton ?? '';
    pantalla.correo.setValue(m.correo);
    pantalla.clave.setValue(m.clave);
    pantalla.errorCorreo.text = m.errorCorreo ?? '';
    pantalla.errorClave.text = m.errorClave ?? '';
    pantalla.mensaje.text = m.mensaje ?? '';
    pantalla.correo.enabled = !m.ocupada;
    pantalla.clave.enabled = !m.ocupada;
    pantalla.boton.enabled = !m.ocupada;
  }

  return { pantalla, pintar };
}

// Composición provisional: sigue aquí, con el servicio por defecto, hasta que exista la entrada (paso 07).
// Es lo único que todavía ata la vista al servicio, y el verificador lo sigue contando como deuda.
export function crearLogin(alEntrar: (usuario: Usuario) => void, servicio: InterAuthService = crearAuthServiceHttp()): PantallaLogin {
  const vista = crearUiLoginView();
  crearUiLoginImpl({ servicio, alAutenticar: (sesion) => alEntrar(sesion.usuario) }, (m) => vista.pintar({ ...UILOGIN_DEFAULTS, ...m }));
  return vista.pantalla;
}
