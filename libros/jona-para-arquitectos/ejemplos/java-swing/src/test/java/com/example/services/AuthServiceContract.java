package com.example.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

/**
 * Casos que toda implementación de InterAuthService debe cumplir (paridad de doble fuente).
 * Son los mismos casos que web-react/src/services/authServiceContract.ts.
 */
abstract class AuthServiceContract {

    /** Construye la implementación bajo prueba. */
    protected abstract InterAuthService service();

    @Test
    void devuelveElTokenYElUsuarioConCredencialesValidas() throws AuthException {
        LoginResult result = service().login("ana@ejemplo.com", "secreta123");

        assertEquals(new LoginUser(1, "ana@ejemplo.com", "Ana Torres"), result.user());
        assertNotNull(result.token());
        assertTrue(result.token().length() > 0);
    }

    @ParameterizedTest(name = "rechaza {0} con AuthException y un traceId")
    @CsvSource({
        "una clave incorrecta,   ana@ejemplo.com,       otra,       401, INVALID_CREDENTIALS",
        "un usuario desconocido, nadie@ejemplo.com,     secreta123, 401, INVALID_CREDENTIALS",
        "un usuario bloqueado,   bloqueado@ejemplo.com, secreta123, 403, USER_DISABLED",
    })
    void rechazaConAuthException(String name, String email, String password, int status, String code) {
        AuthException error = assertThrows(AuthException.class, () -> service().login(email, password));

        assertEquals(status, error.getStatus());
        assertEquals(code, error.getCode());
        assertEquals(List.of(), error.getDetails());
        assertFalse(error.getMessage().isEmpty());
        assertFalse(error.getTraceId().isEmpty());
    }

    @Test
    void rechazaCamposVaciosCon422YUnDetallePorCampo() {
        AuthException error = assertThrows(AuthException.class, () -> service().login("", ""));

        assertEquals(422, error.getStatus());
        assertEquals("VALIDATION_ERROR", error.getCode());
        assertEquals(List.of("usuario", "clave"),
            error.getDetails().stream().map(AuthException.Detail::field).toList());
    }
}
