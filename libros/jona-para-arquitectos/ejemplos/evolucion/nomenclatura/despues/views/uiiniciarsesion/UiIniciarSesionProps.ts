// Props del render: los datos y manejadores que necesita para pintarse.
export interface UiIniciarSesionProps {
  email: string;
  mensaje: string;
  handlerLogin(): void;
}
