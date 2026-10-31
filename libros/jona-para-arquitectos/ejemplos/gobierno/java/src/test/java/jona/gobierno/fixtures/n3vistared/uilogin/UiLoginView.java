package jona.gobierno.fixtures.n3vistared.uilogin;

public class UiLoginView implements InterUiLogin {
    String texto = DEFAULTS.TITULO;

    public void registrarVisita() {
        java.net.http.HttpClient.newHttpClient();
    }

    @Override public void mostrar(String texto) { this.texto = texto; }
}
