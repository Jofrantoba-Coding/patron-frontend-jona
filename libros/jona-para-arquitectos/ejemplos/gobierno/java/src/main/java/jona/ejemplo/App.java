package jona.ejemplo;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.SwingUtilities;
import jona.ejemplo.boton.Boton;
import jona.ejemplo.servicios.AuthServiceFake;
import jona.ejemplo.servicios.AuthServiceHttp;
import jona.ejemplo.servicios.InterAuthService;
import jona.ejemplo.uilogin.UiLogin;

/** Raíz de composición: el único lugar que elige un adaptador. Solo conoce las entradas (N4). */
public final class App {
    private App() { }

    public static void main(String[] args) {
        InterAuthService servicio = args.length > 0 && args[0].equals("--fake")
            ? new AuthServiceFake()
            : new AuthServiceHttp("http://127.0.0.1:4010");
        SwingUtilities.invokeLater(() -> {
            JFrame ventana = new JFrame("JONA");
            ventana.setContentPane(UiLogin.crear(servicio, sesion -> {
                ventana.setContentPane(new JLabel("Hola, " + sesion.nombre()));
                ventana.add(Boton.crear("Cerrar sesión", ventana::dispose));
                ventana.revalidate();
            }));
            ventana.pack();
            ventana.setVisible(true);
        });
    }
}
