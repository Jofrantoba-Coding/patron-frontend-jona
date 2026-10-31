package jona.gobierno.fixtures.n3vistaadaptador.uilogin;

import jona.gobierno.fixtures.n3vistaadaptador.servicios.InterAuthService;

public final class UiLogin {
    private UiLogin() { }

    public static Object crear(InterAuthService servicio) {
        UiLoginView vista = new UiLoginView();
        new UiLoginImpl(servicio, vista).enviar("");
        return vista;
    }
}
