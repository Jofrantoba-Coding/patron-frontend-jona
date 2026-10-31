package com.example.view.ui.uilogin;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.example.navigation.Navigator;
import com.example.services.AuthException;
import com.example.services.InterAuthService;
import java.awt.GraphicsEnvironment;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import javax.swing.JDialog;
import org.junit.jupiter.api.Test;

/**
 * Pruebas sin ventanas. En modo headless no se puede crear un JDialog (HeadlessException),
 * así que se prueban las reglas puras de la Plantilla y de la Implementación, y la estructura
 * de la forma clásica.
 */
class UiLoginTest {

    private static AuthException error(int status, String code) {
        return new AuthException(status, code, "x", List.of(), "t");
    }

    @Test
    void lasPruebasCorrenEnModoHeadless() {
        assertTrue(GraphicsEnvironment.isHeadless());
    }

    @Test
    void laPlantillaExigeCorreoYContrasena() {
        assertTrue(UiLogin.hasRequiredData("ana@ejemplo.com", "secreta123"));
        assertFalse(UiLogin.hasRequiredData("", "secreta123"));
        assertFalse(UiLogin.hasRequiredData("ana@ejemplo.com", ""));
    }

    @Test
    void laImplementacionTraduceElErrorDelServicioAUnMensaje() {
        assertEquals("Correo o contraseña incorrectos.", UiLoginImpl.messageFor(error(401, "INVALID_CREDENTIALS")));
        assertEquals("Su usuario está bloqueado. Contacte al administrador.",
            UiLoginImpl.messageFor(error(403, "USER_DISABLED")));
        assertEquals("No se pudo iniciar sesión. Intente de nuevo.",
            UiLoginImpl.messageFor(error(500, "INTERNAL_ERROR")));
        assertEquals("No se pudo iniciar sesión. Intente de nuevo.", UiLoginImpl.messageFor(new RuntimeException()));
    }

    @Test
    void formaClasicaContratoPlantillaEImplementacion() throws NoSuchMethodException {
        assertTrue(InterUiLogin.class.isInterface());
        assertEquals(JDialog.class, UiLogin.class.getSuperclass());
        assertTrue(Arrays.asList(UiLogin.class.getInterfaces()).contains(InterUiLogin.class));
        assertEquals(UiLogin.class, UiLoginImpl.class.getSuperclass());
        // Punto de sustitución 2: el servicio y la navegación llegan por el constructor.
        UiLoginImpl.class.getConstructor(InterAuthService.class, Navigator.class);
    }

    @Test
    void laPlantillaNoConoceServiciosNiNavegacion() {
        for (Field field : UiLogin.class.getDeclaredFields()) {
            String type = field.getType().getName();
            assertFalse(type.startsWith("com.example.services") || type.startsWith("com.example.navigation"),
                () -> "N3: la Plantilla declara " + field.getName() + " de tipo " + type);
        }
    }
}
