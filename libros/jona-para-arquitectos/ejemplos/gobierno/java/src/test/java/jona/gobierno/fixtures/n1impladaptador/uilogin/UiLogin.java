package jona.gobierno.fixtures.n1impladaptador.uilogin;

public final class UiLogin {
    private UiLogin() { }

    public static Object crear() {
        UiLoginView vista = new UiLoginView();
        new UiLoginImpl(vista).enviar("");
        return vista;
    }
}
