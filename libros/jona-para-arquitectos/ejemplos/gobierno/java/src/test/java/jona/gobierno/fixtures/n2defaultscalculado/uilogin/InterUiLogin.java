package jona.gobierno.fixtures.n2defaultscalculado.uilogin;

public interface InterUiLogin {
    void mostrar(String texto);

    interface DEFAULTS {
        String TITULO = System.getProperty("titulo", "Iniciar sesión");
    }
}
