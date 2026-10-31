package com.example.view.ui.uilogin;

/** Contrato de UI, estilo capacidades (el del artículo de 2024). */
public interface InterUiLogin {
    void login(String email, String password);
    void goToCreateAccount();
    void goToRecoverPassword();
    boolean isValidData(String email, String password);
}
