import type { Button, CheckBox, Label, TextField } from '../comun/pantalla.js';

// Cómo la aplicación de cada variante crea su pantalla. Es la raíz de composición:
// queda fuera de la medición, igual que el `main` de una aplicación real.

export interface ResultadoLogin {
  token: string;
  user: { id: number; usuario: string; nombre: string };
}

export interface OpcionesLogin {
  baseUrl: string;
  onAuthenticated: (result: ResultadoLogin) => void;
}

/** Lo que la suite lee de cualquier pantalla: los controles, no la implementación. */
export interface PantallaVisible {
  title?: Label;
  email: TextField;
  emailError?: Label;
  password: TextField;
  passwordError?: Label;
  remember?: CheckBox;
  submit: Button;
  message: Label;
}

export type CrearLogin = (opciones: OpcionesLogin) => PantallaVisible;

export interface Presentaciones {
  normal: CrearLogin;
  /** Solo en `segunda-vista` (C4). */
  compacta?: CrearLogin;
}

const raiz = (variante: string, instantanea: string) => `../variantes/${variante}/${instantanea}/src`;

/** directo: la pantalla recibe la URL base y llama a fetch por su cuenta. */
async function montarDirecto(instantanea: string): Promise<Presentaciones> {
  const { createLogin } = await import(`${raiz('directo', instantanea)}/login.js`);
  return {
    normal: (o) => createLogin(o),
    compacta: instantanea === 'segunda-vista' ? (o) => createLogin({ ...o, compacto: true }) : undefined,
  };
}

/** jona: la entrada recibe el servicio; aquí se elige el adaptador HTTP. */
async function montarJona(instantanea: string): Promise<Presentaciones> {
  const { createUiLogin } = await import(`${raiz('jona', instantanea)}/UiLogin.js`);
  const { createAuthServiceHttp } = await import(`${raiz('jona', instantanea)}/AuthServiceHttp.js`);
  const deps = (o: OpcionesLogin) => ({ service: createAuthServiceHttp({ baseUrl: o.baseUrl }), onAuthenticated: o.onAuthenticated });
  if (instantanea !== 'segunda-vista') return { normal: (o) => createUiLogin(deps(o)) };
  const { createUiLoginCompacto } = await import(`${raiz('jona', instantanea)}/UiLoginCompacto.js`);
  return { normal: (o) => createUiLogin(deps(o)), compacta: (o) => createUiLoginCompacto(deps(o)) };
}

export function montar(variante: string, instantanea: string): Promise<Presentaciones> {
  return variante === 'directo' ? montarDirecto(instantanea) : montarJona(instantanea);
}
