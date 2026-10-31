package com.example;

import com.example.navigation.Navigator;
import com.example.services.AuthServiceFake;
import com.example.services.AuthServiceHttp;
import com.example.services.InterAuthService;
import com.example.services.LoginResult;
import com.example.view.ui.uilogin.UiLogin;
import com.example.view.ui.uilogin.UiLoginImpl;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;

/**
 * Raíz de composición. Elige uno de los tres puntos de sustitución:
 * <ul>
 *   <li>sin argumentos: AuthServiceHttp contra el servidor mock (http://127.0.0.1:4010), el modo por defecto;</li>
 *   <li>una URL: AuthServiceHttp contra esa URL (por ejemplo, el backend real);</li>
 *   <li>{@code --fake}: el servicio falso en memoria;</li>
 *   <li>{@code --plantilla}: la Plantilla sola, sin integración.</li>
 * </ul>
 */
public final class App {
    private App() { }

    public static void main(String[] args) {
        String mode = args.length > 0 ? args[0] : "http://127.0.0.1:4010";
        SwingUtilities.invokeLater(() -> {
            if (mode.equals("--plantilla")) {
                new UiLogin().setVisible(true);
                return;
            }
            InterAuthService auth = mode.equals("--fake") ? new AuthServiceFake() : new AuthServiceHttp(mode);
            new UiLoginImpl(auth, new DialogNavigator()).setVisible(true);   // la aplicación solo conoce la entrada
        });
    }

    /** Navegación mínima del ejemplo: muestra un mensaje en lugar de abrir otra ventana. */
    private static final class DialogNavigator implements Navigator {
        @Override public void openHome(LoginResult session) {
            JOptionPane.showMessageDialog(null, "Hola, " + session.user().nombre());
        }
        @Override public void openCreateAccount() {
            JOptionPane.showMessageDialog(null, "Aquí se abriría la ventana para crear una cuenta.");
        }
        @Override public void openRecoverPassword() {
            JOptionPane.showMessageDialog(null, "Aquí se abriría la ventana para recuperar la contraseña.");
        }
    }
}
