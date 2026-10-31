package com.example.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/**
 * La misma suite de contrato contra AuthServiceHttp y el servidor mock en ejecución.
 * Arranca ../mock-server con node en un puerto libre; si node no está disponible, se omite.
 * Con la variable CONTRATO_API_URL, corre contra ese backend en lugar del mock.
 */
class AuthServiceHttpTest extends AuthServiceContract {
    private static final Pattern URL = Pattern.compile("http://127\\.0\\.0\\.1:\\d+");
    private static Process mockServer;
    private static String baseUrl;

    @BeforeAll
    static void startMockServer() throws IOException {
        String external = System.getenv("CONTRATO_API_URL");
        if (external != null && !external.isBlank()) {
            baseUrl = external;
            return;
        }
        assumeTrue(nodeAvailable(), "node no está en el PATH: se omiten las pruebas contra el servidor mock");
        ProcessBuilder builder = new ProcessBuilder("node", System.getProperty("mock.server.script"));
        builder.environment().put("PORT", "0");
        builder.redirectErrorStream(true);
        mockServer = builder.start();
        BufferedReader output = new BufferedReader(
            new InputStreamReader(mockServer.getInputStream(), StandardCharsets.UTF_8));
        for (String line = output.readLine(); line != null; line = output.readLine()) {
            Matcher match = URL.matcher(line);
            if (match.find()) {
                baseUrl = match.group();
                return;
            }
        }
        throw new IllegalStateException("El servidor mock terminó sin imprimir su URL");
    }

    @AfterAll
    static void stopMockServer() {
        if (mockServer != null) {
            mockServer.destroy();
        }
    }

    private static boolean nodeAvailable() {
        try {
            return new ProcessBuilder("node", "--version").start().waitFor() == 0;
        } catch (IOException e) {
            return false;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    @Override
    protected InterAuthService service() {
        return new AuthServiceHttp(baseUrl);
    }

    @Test
    void traduceUn500DelServidorAAuthException() {
        assumeTrue(mockServer != null, "el escenario errorServidor solo existe en el servidor mock");
        InterAuthService service = new AuthServiceHttp(baseUrl, Map.of("X-Mock-Scenario", "errorServidor"));

        AuthException error = assertThrows(AuthException.class, () -> service.login("ana@ejemplo.com", "secreta123"));

        assertEquals(500, error.getStatus());
        assertEquals("INTERNAL_ERROR", error.getCode());
    }

    @Test
    void traduceUnFalloDeRedAAuthExceptionConEstado0() {
        InterAuthService service = new AuthServiceHttp("http://127.0.0.1:1");

        AuthException error = assertThrows(AuthException.class, () -> service.login("ana@ejemplo.com", "secreta123"));

        assertEquals(0, error.getStatus());
        assertEquals("NETWORK_ERROR", error.getCode());
    }
}
