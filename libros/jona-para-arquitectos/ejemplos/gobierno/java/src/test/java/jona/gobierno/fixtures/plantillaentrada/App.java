package jona.gobierno.fixtures.plantillaentrada;

public final class App {
    private App() { }

    public static Object iniciar() {
        return new jona.gobierno.fixtures.plantillaentrada.uilogin.UiLoginImpl();
    }
}
