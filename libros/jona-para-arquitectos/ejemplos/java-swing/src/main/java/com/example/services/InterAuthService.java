package com.example.services;

/** Contrato de servicio (puerto). Toda falla se informa con AuthException. */
public interface InterAuthService {
    /** Devuelve el token y el usuario. */
    LoginResult login(String email, String password) throws AuthException;
}
