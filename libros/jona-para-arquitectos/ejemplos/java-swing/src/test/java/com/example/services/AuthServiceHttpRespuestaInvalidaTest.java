package com.example.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Stream;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

/**
 * Un 200 cuyo cuerpo no cumple el contrato de API también es una AuthException (INVALID_RESPONSE),
 * nunca una excepción del analizador de JSON. Usa un servidor HTTP mínimo del JDK que responde lo que la prueba indica.
 */
class AuthServiceHttpRespuestaInvalidaTest {
    private final List<String> correlationIds = new CopyOnWriteArrayList<>();
    private HttpServer server;
    private volatile String responseBody;

    @BeforeEach
    void startServer() throws IOException {
        server = HttpServer.create(new InetSocketAddress(InetAddress.getLoopbackAddress(), 0), 0);
        server.createContext("/auth/login", exchange -> {
            correlationIds.add(exchange.getRequestHeaders().getFirst("X-Correlation-Id"));
            byte[] bytes = responseBody.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length == 0 ? -1 : bytes.length);
            try (OutputStream out = exchange.getResponseBody()) {
                out.write(bytes);
            }
        });
        server.start();
    }

    @AfterEach
    void stopServer() {
        server.stop(0);
    }

    static Stream<Arguments> cuerposInvalidos() {
        return Stream.of(
            Arguments.of("un cuerpo que no es JSON", "esto no es JSON"),
            Arguments.of("un cuerpo vacío", ""),
            Arguments.of("un objeto vacío", "{}"),
            Arguments.of("un cuerpo sin token", "{\"user\":{\"id\":1,\"usuario\":\"ana@ejemplo.com\",\"nombre\":\"Ana Torres\"}}"),
            Arguments.of("un token vacío", "{\"token\":\"\",\"user\":{\"id\":1,\"usuario\":\"ana@ejemplo.com\",\"nombre\":\"Ana Torres\"}}"),
            Arguments.of("un usuario incompleto", "{\"token\":\"t-1\",\"user\":{\"id\":\"1\",\"usuario\":\"ana@ejemplo.com\"}}"));
    }

    @ParameterizedTest(name = "rechaza {0} con AuthException INVALID_RESPONSE")
    @MethodSource("cuerposInvalidos")
    void rechazaUnCuerpoQueNoCumpleElContrato(String name, String body) {
        responseBody = body;
        InterAuthService service = new AuthServiceHttp("http://127.0.0.1:" + server.getAddress().getPort());

        AuthException error = assertThrows(AuthException.class, () -> service.login("ana@ejemplo.com", "secreta123"));

        assertEquals(200, error.getStatus());
        assertEquals("INVALID_RESPONSE", error.getCode());
        assertEquals("La respuesta del servidor no es válida.", error.getMessage());
        assertEquals(List.of(), error.getDetails());
        assertEquals(correlationIds.get(0), error.getTraceId());
    }
}
