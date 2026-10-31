package jona.gobierno.fixtures.n2contratoclase.uilogin;

import jona.gobierno.fixtures.n2contratoclase.servicios.InterAuthService;

public class UiLoginImpl {
    private final InterAuthService servicio;
    private final InterUiLogin vista;

    public UiLoginImpl(InterAuthService servicio, InterUiLogin vista) {
        this.servicio = servicio;
        this.vista = vista;
    }

    public void enviar(String correo) { vista.mostrar(servicio.login(correo)); }
}
