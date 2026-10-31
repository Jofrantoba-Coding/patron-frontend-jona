package jona.gobierno.fixtures.n2metododefault.uilogin;

public interface InterUiLogin {
    void mostrar(String texto);

    default boolean esCorreoValido(String correo) { return correo.contains("@"); }

    interface DEFAULTS {
        String TITULO = "Iniciar sesión";
    }
}
