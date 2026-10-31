package jona.gobierno.fixtures.n2metodoestatico.uilogin;

public interface InterUiLogin {
    void mostrar(String texto);

    static String normalizar(String correo) { return correo.trim().toLowerCase(); }

    interface DEFAULTS {
        String TITULO = "Iniciar sesión";
    }
}
