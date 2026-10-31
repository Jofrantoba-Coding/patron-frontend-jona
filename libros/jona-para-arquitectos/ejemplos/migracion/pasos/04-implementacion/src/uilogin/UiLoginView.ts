import { Button, Label, TextField } from '../../../../comun/pantalla.js';
import { crearAuthServiceHttp } from '../servicios/AuthServiceHttp.js';
import type { InterAuthService, Usuario } from '../servicios/InterAuthService.js';
import { crearUiLoginImpl, type ModeloLogin } from './UiLoginImpl.js';

export interface PantallaLogin {
  titulo: Label;
  correo: TextField;
  errorCorreo: Label;
  clave: TextField;
  errorClave: Label;
  boton: Button;
  mensaje: Label;
}

// El estado y las decisiones ya viven en UiLoginImpl. Aquí quedan los controles, el almacenamiento
// (se mueve en el paso 06) y la elección del servicio por defecto (se mueve a la entrada en el paso 07).
export function crearLogin(alEntrar: (usuario: Usuario) => void, servicio: InterAuthService = crearAuthServiceHttp()): PantallaLogin {
  const p: PantallaLogin = {
    titulo: new Label(),
    correo: new TextField(),
    errorCorreo: new Label(),
    clave: new TextField(),
    errorClave: new Label(),
    boton: new Button(),
    mensaje: new Label(),
  };
  p.titulo.text = 'Iniciar sesión';
  p.boton.label = 'Ingresar';
  p.boton.className = 'boton-primario';

  let modelo: ModeloLogin | undefined;
  p.correo.onChange((correo) => modelo?.alCambiarCorreo?.(correo));
  p.clave.onChange((clave) => modelo?.alCambiarClave?.(clave));
  p.boton.onClick(() => modelo?.alEnviar?.());

  function pintar(m: ModeloLogin): void {
    modelo = m;
    p.correo.setValue(m.correo);
    p.clave.setValue(m.clave);
    p.errorCorreo.text = m.errorCorreo ?? '';
    p.errorClave.text = m.errorClave ?? '';
    p.mensaje.text = m.mensaje ?? '';
    p.correo.enabled = !m.ocupada;
    p.clave.enabled = !m.ocupada;
    p.boton.enabled = !m.ocupada;
  }

  crearUiLoginImpl({
    servicio,
    correoInicial: localStorage.getItem('ultimoCorreo') ?? '',
    alAutenticar: (sesion) => {
      localStorage.setItem('tkn', sesion.token); // otras pantallas leen 'tkn'
      localStorage.setItem('ultimoCorreo', sesion.usuario.usuario);
      alEntrar(sesion.usuario);
    },
  }, pintar);

  return p;
}
