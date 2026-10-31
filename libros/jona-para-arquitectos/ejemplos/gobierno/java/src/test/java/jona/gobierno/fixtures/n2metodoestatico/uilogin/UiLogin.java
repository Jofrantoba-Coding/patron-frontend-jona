package jona.gobierno.fixtures.n2metodoestatico.uilogin;

import jona.gobierno.fixtures.n2metodoestatico.servicios.InterAuthService;

public final class UiLogin {
    private UiLogin() { }

    public static Object crear(InterAuthService servicio) {
        UiLoginView vista = new UiLoginView();
        new UiLoginImpl(servicio, vista).enviar("");
        return vista;
    }
}
