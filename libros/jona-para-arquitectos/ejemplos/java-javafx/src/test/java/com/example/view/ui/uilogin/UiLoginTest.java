package com.example.view.ui.uilogin;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.example.navigation.Navigator;
import com.example.services.AuthException;
import com.example.services.AuthServiceFake;
import com.example.services.InterAuthService;
import com.example.services.LoginResult;
import com.example.services.LoginUser;
import java.lang.reflect.Field;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.FutureTask;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;
import javafx.application.Platform;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/**
 * Pruebas sin pantalla: JavaFX arranca sobre Monocle Headless (ver pom.xml), así que la Plantilla
 * y la Implementación se crean y se ejercitan de verdad, incluido el Task fuera del hilo de JavaFX.
 */
class UiLoginTest {
    private static final LoginResult ANA = new LoginResult("t-1", new LoginUser(1, "ana@ejemplo.com", "Ana Torres"));

    @BeforeAll
    static void startToolkit() throws InterruptedException {
        CountDownLatch started = new CountDownLatch(1);
        try {
            Platform.startup(started::countDown);
        } catch (IllegalStateException alreadyStarted) {
            started.countDown();
        }
        assertTrue(started.await(10, TimeUnit.SECONDS), "JavaFX no arrancó");
    }

    /** Ejecuta en el hilo de JavaFX y espera el resultado. */
    private static <T> T onFx(Callable<T> action) throws Exception {
        FutureTask<T> task = new FutureTask<>(action);
        Platform.runLater(task);
        return task.get(10, TimeUnit.SECONDS);
    }

    private static void waitUntil(Callable<Boolean> condition) throws Exception {
        long deadline = System.currentTimeMillis() + 10_000;
        while (!onFx(condition)) {
            if (System.currentTimeMillis() > deadline) throw new AssertionError("La condición no se cumplió a tiempo");
            Thread.sleep(10);
        }
    }

    private static void submit(UiLogin ui, String email, String password) throws Exception {
        onFx(() -> {
            ((TextField) ui.lookup("#txtEmail")).setText(email);
            ((TextField) ui.lookup("#txtPassword")).setText(password);
            ((Button) ui.lookup("#btnLogin")).fire();
            return null;
        });
    }

    private static Supplier<String> message(UiLogin ui) {
        return () -> ((Label) ui.lookup("#lblMessage")).getText();
    }

    private static String messageNow(UiLogin ui) throws Exception {
        return onFx(() -> message(ui).get());
    }

    /** Navegador que registra las sesiones abiertas. */
    private static final class RecordingNavigator implements Navigator {
        final List<LoginResult> homes = new CopyOnWriteArrayList<>();
        @Override public void openHome(LoginResult session) { homes.add(session); }
        @Override public void openCreateAccount() { }
        @Override public void openRecoverPassword() { }
    }

    /** Servicio que espera hasta que la prueba lo libere. */
    private static final class GatedService implements InterAuthService {
        final CountDownLatch gate = new CountDownLatch(1);
        final AtomicInteger calls = new AtomicInteger();

        @Override public LoginResult login(String email, String password) throws AuthException {
            calls.incrementAndGet();
            try {
                gate.await(10, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return ANA;
        }
    }

    private static AuthException error(int status, String code) {
        return new AuthException(status, code, "x", List.of(), "t");
    }

    @Test
    void laPlantillaPideLosDatosFaltantes() throws Exception {
        UiLogin ui = onFx(UiLogin::new);

        submit(ui, "ana@ejemplo.com", "");

        assertEquals("Ingrese su correo y su contraseña.", messageNow(ui));
    }

    @Test
    void laPlantillaConDatosCompletosNoLlamaANingunSistema() throws Exception {
        UiLogin ui = onFx(UiLogin::new);

        submit(ui, "ana@ejemplo.com", "secreta123");

        assertEquals("Datos completos (sin integración).", messageNow(ui));
    }

    @Test
    void laImplementacionIniciaSesionYNavegaAlInicio() throws Exception {
        RecordingNavigator navigator = new RecordingNavigator();
        UiLoginImpl ui = onFx(() -> new UiLoginImpl(new AuthServiceFake(), navigator));

        submit(ui, "ana@ejemplo.com", "secreta123");

        waitUntil(() -> !navigator.homes.isEmpty());
        assertEquals("Ana Torres", navigator.homes.get(0).user().nombre());
    }

    @Test
    void laImplementacionInformaCredencialesInvalidasYUsuarioBloqueado() throws Exception {
        UiLoginImpl ui = onFx(() -> new UiLoginImpl(new AuthServiceFake(), new RecordingNavigator()));

        submit(ui, "ana@ejemplo.com", "otra");
        waitUntil(() -> message(ui).get().equals("Correo o contraseña incorrectos."));

        submit(ui, "bloqueado@ejemplo.com", "secreta123");
        waitUntil(() -> message(ui).get().equals("Su usuario está bloqueado. Contacte al administrador."));
    }

    @Test
    void laImplementacionInformaUnErrorDelServidor() throws Exception {
        InterAuthService failing = (email, password) -> { throw error(500, "INTERNAL_ERROR"); };
        UiLoginImpl ui = onFx(() -> new UiLoginImpl(failing, new RecordingNavigator()));

        submit(ui, "ana@ejemplo.com", "secreta123");

        waitUntil(() -> message(ui).get().equals("No se pudo iniciar sesión. Intente de nuevo."));
    }

    @Test
    void evitaElDobleEnvioMientrasLaPeticionEstaEnCurso() throws Exception {
        GatedService service = new GatedService();
        RecordingNavigator navigator = new RecordingNavigator();
        UiLoginImpl ui = onFx(() -> new UiLoginImpl(service, navigator));

        onFx(() -> {
            ui.login("ana@ejemplo.com", "secreta123");
            ui.login("ana@ejemplo.com", "secreta123");
            return null;
        });

        assertTrue(onFx(() -> ui.lookup("#btnLogin").isDisabled()));
        service.gate.countDown();
        waitUntil(() -> !navigator.homes.isEmpty());
        assertEquals(1, service.calls.get());
        assertFalse(onFx(() -> ui.lookup("#btnLogin").isDisabled()));
    }

    @Test
    void limpiaElErrorAnteriorAlReintentar() throws Exception {
        CountDownLatch gate = new CountDownLatch(1);
        AtomicInteger calls = new AtomicInteger();
        InterAuthService failThenWait = (email, password) -> {
            if (calls.incrementAndGet() == 1) throw error(401, "INVALID_CREDENTIALS");
            try {
                gate.await(10, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return ANA;
        };
        UiLoginImpl ui = onFx(() -> new UiLoginImpl(failThenWait, new RecordingNavigator()));
        submit(ui, "ana@ejemplo.com", "otra");
        waitUntil(() -> message(ui).get().equals("Correo o contraseña incorrectos."));

        submit(ui, "ana@ejemplo.com", "secreta123");

        assertEquals("", messageNow(ui));
        gate.countDown();
    }

    @Test
    void laImplementacionTraduceElErrorDelServicioAUnMensaje() {
        assertEquals("Correo o contraseña incorrectos.", UiLoginImpl.messageFor(error(401, "INVALID_CREDENTIALS")));
        assertEquals("No se pudo iniciar sesión. Intente de nuevo.", UiLoginImpl.messageFor(new RuntimeException()));
    }

    @Test
    void formaClasicaContratoPlantillaEImplementacion() throws NoSuchMethodException {
        assertEquals(VBox.class, UiLogin.class.getSuperclass());
        assertTrue(List.of(UiLogin.class.getInterfaces()).contains(InterUiLogin.class));
        assertEquals(UiLogin.class, UiLoginImpl.class.getSuperclass());
        UiLoginImpl.class.getConstructor(InterAuthService.class, Navigator.class);
        for (Field field : UiLogin.class.getDeclaredFields()) {
            String type = field.getType().getName();
            assertFalse(type.startsWith("com.example.services") || type.startsWith("com.example.navigation"),
                () -> "N3: la Plantilla declara " + field.getName() + " de tipo " + type);
        }
    }
}
