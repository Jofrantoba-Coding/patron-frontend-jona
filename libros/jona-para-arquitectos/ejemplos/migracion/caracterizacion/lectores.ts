import { Raiz } from '../comun/declarativo.js';
import { Button, Label, TextField } from '../comun/pantalla.js';

// Adaptadores delgados de prueba, uno por tecnología de vista: traducen «lo que la persona hace y ve»
// a cada juego de controles. Viven fuera de src: la caracterización no depende de cómo está hecha la pantalla.

/** Todo lo visible de la pantalla de login, para compararlo de una sola vez. */
export interface Visible {
  titulo: string;
  correo: string;
  errorCorreo: string;
  clave: string;
  errorClave: string;
  boton: string;
  claseBoton: string;
  mensaje: string;
  correoHabilitado: boolean;
  claveHabilitada: boolean;
  botonHabilitado: boolean;
}

export interface PantallaObservada {
  escribirCorreo(texto: string): void;
  escribirClave(texto: string): void;
  pulsarIngresar(): void;
  leer(): Visible;
}

/** Los controles que exponen los pasos 00 a 07 (juego imperativo de comun/pantalla.ts). */
interface ControlesPantalla {
  titulo: Label;
  correo: TextField;
  errorCorreo: Label;
  clave: TextField;
  errorClave: Label;
  boton: Button;
  mensaje: Label;
}

function lectorPantalla(p: ControlesPantalla): PantallaObservada {
  return {
    escribirCorreo: (texto) => p.correo.type(texto),
    escribirClave: (texto) => p.clave.type(texto),
    pulsarIngresar: () => p.boton.click(),
    leer: () => ({
      titulo: p.titulo.text,
      correo: p.correo.value,
      errorCorreo: p.errorCorreo.text,
      clave: p.clave.value,
      errorClave: p.errorClave.text,
      boton: p.boton.label,
      claseBoton: p.boton.className,
      mensaje: p.mensaje.text,
      correoHabilitado: p.correo.enabled,
      claveHabilitada: p.clave.enabled,
      botonHabilitado: p.boton.enabled,
    }),
  };
}

/** El árbol que pinta el paso 08 (juego declarativo de comun/declarativo.ts), leído por id. */
function lectorDeclarativo(raiz: Raiz): PantallaObservada {
  const habilitado = (id: string) => raiz.buscar(id)?.props.deshabilitado !== true;
  return {
    escribirCorreo: (texto) => raiz.escribir('correo', texto),
    escribirClave: (texto) => raiz.escribir('clave', texto),
    pulsarIngresar: () => raiz.pulsar('ingresar'),
    leer: () => ({
      titulo: raiz.texto('titulo'),
      correo: raiz.buscar('correo')?.props.valor ?? '',
      errorCorreo: raiz.texto('error-correo'),
      clave: raiz.buscar('clave')?.props.valor ?? '',
      errorClave: raiz.texto('error-clave'),
      boton: raiz.texto('ingresar'),
      claseBoton: raiz.buscar('ingresar')?.props.clase ?? '',
      mensaje: raiz.texto('mensaje'),
      correoHabilitado: habilitado('correo'),
      claveHabilitada: habilitado('clave'),
      botonHabilitado: habilitado('ingresar'),
    }),
  };
}

/** Elige el lector según lo que la aplicación devuelve como pantalla de login. */
export function lectorPara(login: unknown): PantallaObservada {
  if (login instanceof Raiz) return lectorDeclarativo(login);
  if ((login as Partial<ControlesPantalla>)?.correo instanceof TextField) return lectorPantalla(login as ControlesPantalla);
  throw new Error('la pantalla de login no usa una tecnología de vista conocida por la caracterización');
}
