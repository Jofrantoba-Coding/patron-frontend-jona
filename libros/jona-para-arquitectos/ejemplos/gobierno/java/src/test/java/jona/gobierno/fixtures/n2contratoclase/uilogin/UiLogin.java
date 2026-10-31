package jona.gobierno.fixtures.n2contratoclase.uilogin;

import jona.gobierno.fixtures.n2contratoclase.servicios.InterAuthService;

public final class UiLogin {
    private UiLogin() { }

    public static Object crear(InterAuthService servicio) {
        UiLoginView vista = new UiLoginView();
        new UiLoginImpl(servicio, vista).enviar("");
        return vista;
    }
}
