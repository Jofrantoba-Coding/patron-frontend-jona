package jona.gobierno.fixtures.n3vistaadaptador.uilogin;

public class UiLoginView implements InterUiLogin {
    String texto = DEFAULTS.TITULO;

    private final jona.gobierno.fixtures.n3vistaadaptador.servicios.AuthServiceHttp servicio = new jona.gobierno.fixtures.n3vistaadaptador.servicios.AuthServiceHttp();

    public void enviar(String correo) { mostrar(servicio.login(correo)); }

    @Override public void mostrar(String texto) { this.texto = texto; }
}
