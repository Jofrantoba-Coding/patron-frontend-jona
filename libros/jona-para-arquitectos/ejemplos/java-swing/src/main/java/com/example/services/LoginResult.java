package com.example.services;

/** Tipo de dominio que devuelve el inicio de sesión. */
public record LoginResult(String token, LoginUser user) {
}
