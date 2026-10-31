package jona.gobierno.fixtures.n3contratoadaptador.uilogin;

import jona.gobierno.fixtures.n3contratoadaptador.servicios.InterAuthService;

public class UiLoginImpl {
    private final InterAuthService servicio;
    private final InterUiLogin vista;

    public UiLoginImpl(InterAuthService servicio, InterUiLogin vista) {
        this.servicio = servicio;
        this.vista = vista;
    }

    public void enviar(String correo) { vista.mostrar(servicio.login(correo)); }
}
