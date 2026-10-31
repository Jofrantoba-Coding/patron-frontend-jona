package com.example.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Servicio falso en memoria (punto de sustitución 2), con los datos de prueba del contrato de API. */
public class AuthServiceFake implements InterAuthService {
    private record User(int id, String clave, String nombre, boolean bloqueado) { }

    private static final Map<String, User> USERS = Map.of(
        "ana@ejemplo.com", new User(1, "secreta123", "Ana Torres", false),
        "bloqueado@ejemplo.com", new User(2, "secreta123", "Usuario Bloqueado", true));

    private int requests;

    @Override
    public LoginResult login(String email, String password) throws AuthException {
        String traceId = "fake-" + (++requests);
        List<AuthException.Detail> details = new ArrayList<>();
        if (email.isEmpty()) details.add(new AuthException.Detail("usuario", "Es obligatorio."));
        if (password.isEmpty()) details.add(new AuthException.Detail("clave", "Es obligatorio."));
        if (!details.isEmpty()) {
            throw new AuthException(422, "VALIDATION_ERROR", "La petición no es válida.", details, traceId);
        }

        User user = USERS.get(email);
        if (user == null || !user.clave().equals(password)) {
            throw new AuthException(401, "INVALID_CREDENTIALS", "Usuario o clave incorrectos.", List.of(), traceId);
        }
        if (user.bloqueado()) {
            throw new AuthException(403, "USER_DISABLED", "El usuario está bloqueado.", List.of(), traceId);
        }
        return new LoginResult("fake-token-" + user.id() + "-" + requests, new LoginUser(user.id(), email, user.nombre()));
    }
}
