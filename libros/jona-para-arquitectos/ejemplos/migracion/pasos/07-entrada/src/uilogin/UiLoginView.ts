import { Button, Label, TextField } from '../../../../comun/pantalla.js';
import type { InterUiLogin } from './InterUiLogin.js';

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

