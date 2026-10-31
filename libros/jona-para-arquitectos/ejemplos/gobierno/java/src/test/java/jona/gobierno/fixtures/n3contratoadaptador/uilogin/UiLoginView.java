package jona.gobierno.fixtures.n3contratoadaptador.uilogin;

public class UiLoginView implements InterUiLogin {
    String texto = DEFAULTS.TITULO;

    @Override public jona.gobierno.fixtures.n3contratoadaptador.servicios.AuthServiceHttp servicio() { return null; }

    @Override public void mostrar(String texto) { this.texto = texto; }
}
