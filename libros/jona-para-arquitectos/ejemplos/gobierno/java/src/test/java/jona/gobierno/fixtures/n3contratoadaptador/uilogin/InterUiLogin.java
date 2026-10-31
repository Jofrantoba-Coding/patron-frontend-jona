package jona.gobierno.fixtures.n3contratoadaptador.uilogin;

public interface InterUiLogin {
    void mostrar(String texto);

    jona.gobierno.fixtures.n3contratoadaptador.servicios.AuthServiceHttp servicio();

    interface DEFAULTS {
        String TITULO = "Iniciar sesión";
    }
}
