package com.example.view.ui.uilogin;

import com.example.navigation.Navigator;
import com.example.services.AuthException;
import com.example.services.InterAuthService;
import com.example.services.LoginResult;
import javafx.concurrent.Task;

/** Implementación y entrada: reemplaza las capacidades que necesitan integración. */
public class UiLoginImpl extends UiLogin {
    private final InterAuthService auth;
    private final Navigator navigator;
    private boolean busy;

    public UiLoginImpl(InterAuthService auth, Navigator navigator) {
        this.auth = auth;
        this.navigator = navigator;
    }

    @Override public void login(String email, String password) {
        if (!isValidData(email, password)) { showMissingDataError(); return; }
        if (busy) return;                                    // evita el doble envío
        busy = true;
        setBusy(true);
        showMessage("");                                     // limpia el error del intento anterior
        Task<LoginResult> task = new Task<>() {
            @Override protected LoginResult call() throws AuthException {
                return auth.login(email, password);          // fuera del hilo de JavaFX
            }
        };
        task.setOnSucceeded(e -> { done(); navigator.openHome(task.getValue()); });
        task.setOnFailed(e -> { done(); showMessage(messageFor(task.getException())); });
        Thread worker = new Thread(task);
        worker.setDaemon(true);
        worker.start();
    }

    @Override public void goToCreateAccount() { navigator.openCreateAccount(); }
    @Override public void goToRecoverPassword() { navigator.openRecoverPassword(); }

    private void done() {
        busy = false;
        setBusy(false);
    }

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
