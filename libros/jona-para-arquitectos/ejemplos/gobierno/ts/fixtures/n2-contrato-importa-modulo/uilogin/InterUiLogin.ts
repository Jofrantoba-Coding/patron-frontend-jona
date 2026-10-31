import { TITULO } from '../textos';

export interface InterUiLogin {
  correo: string;
  onEnviar?: () => void;
}

export type Titulo = typeof TITULO;
