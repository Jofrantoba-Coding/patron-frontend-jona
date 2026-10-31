package jona.gobierno.fixtures.n4importaimpl;

public final class App {
    private App() { }

    public static Object iniciar() {
        return new jona.gobierno.fixtures.n4importaimpl.uilogin.UiLoginImpl(correo -> correo, null);
    }
}
