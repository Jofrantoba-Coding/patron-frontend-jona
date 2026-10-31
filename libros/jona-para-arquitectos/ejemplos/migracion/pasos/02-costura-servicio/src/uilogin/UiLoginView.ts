import { Button, Label, TextField } from '../../../../comun/pantalla.js';
import { crearAuthServiceHttp } from '../servicios/AuthServiceHttp.js';
import type { InterAuthService, Usuario } from '../servicios/InterAuthService.js';

// Pantalla de inicio de sesión, escrita hace años. Cada persona que la tocó agregó «solo una cosa más»:
// el límite de tiempo, recordar el último correo, borrar la clave al fallar. Funciona y nadie quiere tocarla.

export interface PantallaLogin {
  titulo: Label;
  correo: TextField;
  errorCorreo: Label;
  clave: TextField;
  errorClave: Label;
  boton: Button;
  mensaje: Label;
}

// Costura: la pantalla recibe el servicio. Por defecto, el adaptador HTTP, para que App no cambie todavía.
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
  p.correo.setValue(localStorage.getItem('ultimoCorreo') ?? '');
  p.boton.onClick(() => void entrar());

  function ocupar(si: boolean): void {
    p.correo.enabled = !si;
    p.clave.enabled = !si;
    p.boton.enabled = !si;
  }

  async function entrar(): Promise<void> {
    p.mensaje.text = '';
    p.errorCorreo.text = '';
    p.errorClave.text = '';
    // Solo el correo se valida aquí; la clave vacía la rechaza el servidor.
    if (p.correo.value === '') {
      p.mensaje.text = 'Ingrese su correo.';
      return;
    }
    ocupar(true);
    const resultado = await servicio.iniciarSesion(p.correo.value, p.clave.value);
    if (resultado.tipo === 'ok') {
      localStorage.setItem('tkn', resultado.sesion.token); // otras pantallas leen 'tkn'
      localStorage.setItem('ultimoCorreo', resultado.sesion.usuario.usuario);
      ocupar(false);
      alEntrar(resultado.sesion.usuario);
      return;
    }
    const codigo = resultado.codigo;
    for (const d of resultado.detalles) {
      if (d.campo === 'correo') p.errorCorreo.text = d.mensaje;
      if (d.campo === 'clave') p.errorClave.text = d.mensaje;
    }
    ocupar(false);
    if (codigo === 'INVALID_CREDENTIALS') {
      p.mensaje.text = 'Correo o contraseña incorrectos.';
      p.clave.setValue('');
    } else if (codigo === 'USER_DISABLED') {
      p.mensaje.text = 'Su usuario está bloqueado. Contacte al administrador.';
    } else if (codigo === 'VALIDATION_ERROR') {
      p.mensaje.text = 'Revise los datos marcados.';
    } else if (codigo === 'SIN_RED') {
      p.mensaje.text = 'No se pudo conectar con el servidor. Revise su conexión.';
    } else if (codigo === 'TIEMPO_AGOTADO') {
      p.mensaje.text = 'El servidor no respondió a tiempo. Intente de nuevo.';
    } else {
      p.mensaje.text = 'No se pudo iniciar sesión. Intente de nuevo.';
    }
  }

  return p;
}
