package com.example.services;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** Adaptador: implementa el contrato de servicio contra el contrato de API (POST /auth/login). */
public class AuthServiceHttp implements InterAuthService {
    private final HttpClient client = HttpClient.newHttpClient();
    private final String baseUrl;
    private final Map<String, String> headers;

    /** La URL base es la única diferencia entre el servidor mock y el backend real. */
    public AuthServiceHttp(String baseUrl) {
        this(baseUrl, Map.of());
    }

    /** Con cabeceras adicionales en cada petición (por ejemplo, X-Mock-Scenario en pruebas). */
    public AuthServiceHttp(String baseUrl, Map<String, String> headers) {
        this.baseUrl = baseUrl;
        this.headers = Map.copyOf(headers);
    }

    @Override
    public LoginResult login(String email, String password) throws AuthException {
        String correlationId = UUID.randomUUID().toString();
        // El contrato de API nombra los campos usuario y clave; el adaptador traduce.
        String body = new JSONObject().put("usuario", email).put("clave", password).toString();
        HttpRequest.Builder request = HttpRequest.newBuilder(URI.create(baseUrl + "/auth/login"))
            .header("Content-Type", "application/json")
            .header("X-Correlation-Id", correlationId)
            .POST(HttpRequest.BodyPublishers.ofString(body));
        headers.forEach(request::header);

        HttpResponse<String> response;
        try {
            response = client.send(request.build(), HttpResponse.BodyHandlers.ofString());
        } catch (IOException e) {
            throw networkError(correlationId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw networkError(correlationId);
        }

        if (response.statusCode() != 200) {
            throw toAuthException(response.statusCode(), response.body(), correlationId);
        }
        return toLoginResult(response.statusCode(), response.body(), correlationId);
    }

    /** Un 200 cuyo cuerpo no cumple el contrato de API también es una AuthException, nunca una JSONException. */
    private static LoginResult toLoginResult(int status, String body, String correlationId) throws AuthException {
        try {
            JSONObject json = new JSONObject(body);
            JSONObject user = json.getJSONObject("user");
            String token = json.getString("token");
            if (!token.isEmpty() && user.get("id") instanceof Integer id) {
                return new LoginResult(token, new LoginUser(id, user.getString("usuario"), user.getString("nombre")));
            }
        } catch (JSONException e) {
            // Cae a la respuesta inválida.
        }
        throw new AuthException(status, "INVALID_RESPONSE", "La respuesta del servidor no es válida.", List.of(), correlationId);
    }

    private static AuthException networkError(String traceId) {
        return new AuthException(0, "NETWORK_ERROR", "No se pudo conectar con el servidor.", List.of(), traceId);
    }

    private static AuthException toAuthException(int status, String body, String fallbackTraceId) {
        try {
            JSONObject json = new JSONObject(body);
            List<AuthException.Detail> details = new ArrayList<>();
            JSONArray array = json.optJSONArray("details", new JSONArray());
            for (int i = 0; i < array.length(); i++) {
                JSONObject detail = array.getJSONObject(i);
                details.add(new AuthException.Detail(detail.getString("field"), detail.getString("message")));
            }
            return new AuthException(status, json.getString("code"), json.getString("message"), details,
                json.optString("traceId", fallbackTraceId));
        } catch (JSONException e) {
            return new AuthException(status, "HTTP_ERROR", "La petición falló con estado " + status + ".",
                List.of(), fallbackTraceId);
        }
    }
}
