package jona.ejemplo.uilogin;

import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import javax.swing.SwingUtilities;
import jona.ejemplo.servicios.AuthException;
import jona.ejemplo.servicios.InterAuthService;
import jona.ejemplo.servicios.Sesion;

/** Implementación: comportamiento y efectos. Recibe el servicio tipado por su contrato (N1). */
class UiLoginImpl implements InterUiLogin.Eventos {
    private final InterAuthService servicio;
    private final Consumer<Sesion> alAutenticar;
    private InterUiLogin vista;

    UiLoginImpl(InterAuthService servicio, Consumer<Sesion> alAutenticar) {
        this.servicio = servicio;
        this.alAutenticar = alAutenticar;
    }

    void conectar(InterUiLogin vista) {
        this.vista = vista;
    }

    @Override
    public void onEnviar(String correo, String clave) {
        if (correo.isEmpty() || clave.isEmpty()) {
            vista.mostrarError("Ingrese su correo y su contraseña.");
            return;
        }
        vista.setEnviando(true);
        CompletableFuture.runAsync(() -> {   // fuera del hilo de la interfaz: un efecto, por eso vive aquí
            try {
                Sesion sesion = servicio.login(correo, clave);
                SwingUtilities.invokeLater(() -> alAutenticar.accept(sesion));
            } catch (AuthException e) {
                SwingUtilities.invokeLater(() -> vista.mostrarError(e.getMessage()));
            } finally {
                SwingUtilities.invokeLater(() -> vista.setEnviando(false));
            }
        });
    }
}
