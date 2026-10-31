package jona.gobierno.fixtures.deuda.legado;

public final class App {
    private App() { }

    public static Object iniciar() {
        return new jona.gobierno.fixtures.deuda.legado.uilogin.UiLoginImpl(correo -> correo, null);
    }
}
