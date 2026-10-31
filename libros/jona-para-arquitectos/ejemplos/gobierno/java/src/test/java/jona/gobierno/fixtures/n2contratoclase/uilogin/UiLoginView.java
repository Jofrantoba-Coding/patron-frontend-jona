package jona.gobierno.fixtures.n2contratoclase.uilogin;

public class UiLoginView extends InterUiLogin {
    String texto = DEFAULTS.TITULO;

    @Override public void mostrar(String texto) { this.texto = texto; }
}
