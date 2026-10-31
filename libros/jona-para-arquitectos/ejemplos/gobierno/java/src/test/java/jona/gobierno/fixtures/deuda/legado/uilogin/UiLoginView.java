package jona.gobierno.fixtures.deuda.legado.uilogin;

public class UiLoginView implements InterUiLogin {
    String texto = DEFAULTS.TITULO;

    private final java.util.Timer temporizador = new java.util.Timer();

    @Override public void mostrar(String texto) { this.texto = texto; }
}
