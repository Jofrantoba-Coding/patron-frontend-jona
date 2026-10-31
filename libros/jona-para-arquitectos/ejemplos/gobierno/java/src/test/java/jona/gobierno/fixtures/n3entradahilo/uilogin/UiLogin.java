package jona.gobierno.fixtures.n3entradahilo.uilogin;

import jona.gobierno.fixtures.n3entradahilo.servicios.InterAuthService;

public final class UiLogin {
    private UiLogin() { }

    public static Object crear(InterAuthService servicio) {
        UiLoginView vista = new UiLoginView();
        new UiLoginImpl(servicio, vista).enviar("");
        new Thread(() -> vista.mostrar("listo")).start();
        return vista;
    }
}
