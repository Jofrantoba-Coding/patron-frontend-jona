package jona.ejemplo.boton;

import javax.swing.JComponent;

/** Entrada: aplica los DEFAULTS y pinta la vista. Sin servicios, la unidad no necesita Implementación. */
public final class Boton {
    private Boton() { }

    public static JComponent crear(String texto, InterBoton.Eventos eventos) {
        return new BotonView(texto, InterBoton.DEFAULTS.VARIANTE, eventos);
    }
}
