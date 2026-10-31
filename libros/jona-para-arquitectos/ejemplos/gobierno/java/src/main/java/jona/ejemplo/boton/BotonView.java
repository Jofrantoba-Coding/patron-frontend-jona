package jona.ejemplo.boton;

import javax.swing.JButton;

/** Vista: render puro. */
class BotonView extends JButton {
    BotonView(String texto, String variante, InterBoton.Eventos eventos) {
        super(texto);
        putClientProperty("variante", variante);
        addActionListener(e -> eventos.onClick());
    }
}
