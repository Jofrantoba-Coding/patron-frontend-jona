package jona.ejemplo.uilogin;

import java.util.function.Consumer;
import javax.swing.JComponent;
import jona.ejemplo.servicios.InterAuthService;
import jona.ejemplo.servicios.Sesion;

/** Entrada: lo único público de la unidad (N4). Compone la Implementación con la vista. */
public final class UiLogin {
    private UiLogin() { }

    public static JComponent crear(InterAuthService servicio, Consumer<Sesion> alAutenticar) {
        UiLoginImpl impl = new UiLoginImpl(servicio, alAutenticar);
        UiLoginView vista = new UiLoginView(impl);
        impl.conectar(vista);
        return vista;
    }
}
