package jona.gobierno.fixtures.n3entradahilo.uilogin;

public class UiLoginView implements InterUiLogin {
    String texto = DEFAULTS.TITULO;

    @Override public void mostrar(String texto) { this.texto = texto; }
}
