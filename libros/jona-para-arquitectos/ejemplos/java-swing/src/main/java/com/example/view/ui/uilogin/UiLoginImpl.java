package com.example.view.ui.uilogin;

import com.example.navigation.Navigator;
import com.example.services.AuthException;
import com.example.services.InterAuthService;
import com.example.services.LoginResult;
import java.util.concurrent.ExecutionException;
import javax.swing.SwingWorker;

/** Implementación y entrada: reemplaza las capacidades que necesitan integración. */
public class UiLoginImpl extends UiLogin {
    private final InterAuthService auth;
    private final Navigator navigator;

    public UiLoginImpl(InterAuthService auth, Navigator navigator) {
        this.auth = auth;
        this.navigator = navigator;
    }

    @Override
    public void login(String email, String password) {
        if (!isValidData(email, password)) {
            showMissingDataError();   // reutiliza la operación de la Plantilla
            return;
        }
        setBusy(true);                // el botón deshabilitado impide el doble envío
        showMessage(" ");             // limpia el error del intento anterior
        new SwingWorker<LoginResult, Void>() {
            @Override protected LoginResult doInBackground() throws AuthException {
                return auth.login(email, password);   // fuera del EDT
            }

            @Override protected void done() {         // de vuelta en el EDT
                setBusy(false);
                LoginResult session;
                try {
                    session = get();
                } catch (ExecutionException ex) {
                    showMessage(messageFor(ex.getCause()));
                    return;
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                    return;
                }
                navigator.openHome(session);
                dispose();
            }
        }.execute();
    }

    @Override public void goToCreateAccount() { navigator.openCreateAccount(); }
    @Override public void goToRecoverPassword() { navigator.openRecoverPassword(); }

    /** Traduce el error del servicio a un mensaje para el usuario. Regla pura. */
    static String messageFor(Throwable error) {
        String code = error instanceof AuthException authError ? authError.getCode() : "";
        return switch (code) {
            case "INVALID_CREDENTIALS" -> "Correo o contraseña incorrectos.";
            case "USER_DISABLED" -> "Su usuario está bloqueado. Contacte al administrador.";
            default -> "No se pudo iniciar sesión. Intente de nuevo.";
        };
    }
}
