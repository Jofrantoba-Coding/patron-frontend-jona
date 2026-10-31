package jona.ejemplo.servicios;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/** Adaptador HTTP: el único lugar del ejemplo que habla con la red. */
public class AuthServiceHttp implements InterAuthService {
    private final HttpClient cliente = HttpClient.newHttpClient();
    private final String baseUrl;

    public AuthServiceHttp(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    @Override
    public Sesion login(String correo, String clave) throws AuthException {
        String cuerpo = "{\"usuario\":\"" + correo + "\",\"clave\":\"" + clave + "\"}";
        HttpRequest peticion = HttpRequest.newBuilder(URI.create(baseUrl + "/auth/login"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(cuerpo))
            .build();
        try {
            HttpResponse<String> respuesta = cliente.send(peticion, HttpResponse.BodyHandlers.ofString());
            if (respuesta.statusCode() != 200) throw new AuthException("El servidor respondió " + respuesta.statusCode() + ".");
            return new Sesion(respuesta.body(), correo);
        } catch (IOException e) {
            throw new AuthException("No se pudo conectar con el servidor.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AuthException("Petición interrumpida.");
        }
    }
}
