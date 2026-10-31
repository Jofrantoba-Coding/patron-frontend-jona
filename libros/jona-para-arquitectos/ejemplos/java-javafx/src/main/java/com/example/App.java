package com.example;

import com.example.navigation.Navigator;
import com.example.services.AuthServiceFake;
import com.example.services.AuthServiceHttp;
import com.example.services.InterAuthService;
import com.example.services.LoginResult;
import com.example.view.ui.uilogin.UiLogin;
import com.example.view.ui.uilogin.UiLoginImpl;
import java.util.List;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.stage.Stage;

/**
 * Raíz de composición. Sin argumentos usa AuthServiceHttp contra el servidor mock (http://127.0.0.1:4010);
 * con una URL, contra esa URL; con {@code --fake}, el servicio falso; con {@code --plantilla}, la Plantilla sola.
 */
public class App extends Application {

    @Override
    public void start(Stage stage) {
        List<String> args = getParameters().getRaw();
        String mode = args.isEmpty() ? "http://127.0.0.1:4010" : args.get(0);
        UiLogin root;
        if (mode.equals("--plantilla")) {
            root = new UiLogin();
        } else {
            InterAuthService auth = mode.equals("--fake") ? new AuthServiceFake() : new AuthServiceHttp(mode);
            root = new UiLoginImpl(auth, new AlertNavigator());   // la aplicación solo conoce la entrada
        }
        stage.setTitle("Iniciar sesión");
        stage.setScene(new Scene(root, 320, 300));
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }

    /** Navegación mínima del ejemplo: muestra un mensaje en lugar de abrir otra pantalla. */
    private static final class AlertNavigator implements Navigator {
        @Override public void openHome(LoginResult session) { show("Hola, " + session.user().nombre()); }
        @Override public void openCreateAccount() { show("Aquí se abriría la pantalla para crear una cuenta."); }
        @Override public void openRecoverPassword() { show("Aquí se abriría la pantalla para recuperar la contraseña."); }

        private static void show(String text) {
            new Alert(Alert.AlertType.INFORMATION, text).showAndWait();
        }
    }
}
