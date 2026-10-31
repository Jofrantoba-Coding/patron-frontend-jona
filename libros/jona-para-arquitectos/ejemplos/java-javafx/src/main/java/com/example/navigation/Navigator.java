package com.example.navigation;

import com.example.services.LoginResult;

/** Navegación: un efecto externo que solo usa la Implementación (N3). */
public interface Navigator {
    void openHome(LoginResult session);
    void openCreateAccount();
    void openRecoverPassword();
}
