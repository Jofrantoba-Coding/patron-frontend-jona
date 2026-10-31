import { Button, Label, TextField } from '../../../../comun/pantalla.js';

// Pantalla de inicio de sesión, escrita hace años. Cada persona que la tocó agregó «solo una cosa más»:
// el límite de tiempo, recordar el último correo, borrar la clave al fallar. Funciona y nadie quiere tocarla.

const URL_API = 'http://127.0.0.1:4010';

export interface Usuario {
  id: number;
  usuario: string;
  nombre: string;
}

export interface PantallaLogin {
  titulo: Label;
  correo: TextField;
  errorCorreo: Label;
  clave: TextField;
  errorClave: Label;
  boton: Button;
  mensaje: Label;
}

export function crearLogin(alEntrar: (usuario: Usuario) => void): PantallaLogin {
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
    let codigo = '';
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), 10000);
    try {
      const r = await fetch(URL_API + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: p.correo.value, clave: p.clave.value }),
        signal: control.signal,
      });
      const datos = await r.json();
      if (r.ok) {
        localStorage.setItem('tkn', datos.token); // otras pantallas leen 'tkn'
        localStorage.setItem('ultimoCorreo', datos.user.usuario);
        ocupar(false);
        alEntrar(datos.user);
        return;
      }
      codigo = datos.code;
      for (const d of datos.details ?? []) {
        if (d.field === 'usuario') p.errorCorreo.text = d.message;
        if (d.field === 'clave') p.errorClave.text = d.message;
      }
    } catch (e) {
      codigo = (e as Error).name === 'AbortError' ? 'TIEMPO_AGOTADO' : 'SIN_RED';
    } finally {
      clearTimeout(temporizador);
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
