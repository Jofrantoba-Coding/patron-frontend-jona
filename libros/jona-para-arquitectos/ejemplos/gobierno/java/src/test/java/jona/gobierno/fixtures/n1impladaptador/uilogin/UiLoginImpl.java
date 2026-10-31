package jona.gobierno.fixtures.n1impladaptador.uilogin;

import jona.gobierno.fixtures.n1impladaptador.servicios.AuthServiceHttp;

public class UiLoginImpl {
    private final AuthServiceHttp servicio = new AuthServiceHttp();
    private final InterUiLogin vista;

    public UiLoginImpl(InterUiLogin vista) { this.vista = vista; }

    public void enviar(String correo) { vista.mostrar(servicio.login(correo)); }
}
