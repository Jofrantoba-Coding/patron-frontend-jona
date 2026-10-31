package jona.ejemplo.uilogin;

/** Contrato de UI: solo firmas, eventos y DEFAULTS constantes (N2). */
public interface InterUiLogin {
    void mostrarError(String mensaje);

    void setEnviando(boolean enviando);

    /** Eventos: la vista avisa con valores de negocio, no con eventos de Swing. */
    interface Eventos {
        void onEnviar(String correo, String clave);
    }

    /** Solo valores de presentación, constantes de compilación. */
    interface DEFAULTS {
        String TITULO = "Iniciar sesión";
        String ETIQUETA_ENVIAR = "Ingresar";
    }
}
