package jona.gobierno.fixtures.n4importaimpl.uilogin;

import jona.gobierno.fixtures.n4importaimpl.servicios.InterAuthService;

public final class UiLogin {
    private UiLogin() { }

    public static Object crear(InterAuthService servicio) {
        UiLoginView vista = new UiLoginView();
        new UiLoginImpl(servicio, vista).enviar("");
        return vista;
    }
}
