package com.example.view.ui.uilogin;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;

/** Plantilla: construye la interfaz, conecta los controles con el contrato y da un comportamiento por defecto. */
public class UiLogin extends VBox implements InterUiLogin {
    private final TextField txtEmail = new TextField();
    private final PasswordField txtPassword = new PasswordField();
    private final Label lblMessage = new Label();
    private final Button btnLogin = new Button("Ingresar");
    private final Button btnCreateAccount = new Button("Crear cuenta");
    private final Button btnRecoverPassword = new Button("Recuperar contraseña");

    public UiLogin() {
        super(8);
        buildLayout();
        btnLogin.setOnAction(e -> login(txtEmail.getText(), txtPassword.getText()));
        btnCreateAccount.setOnAction(e -> goToCreateAccount());
        btnRecoverPassword.setOnAction(e -> goToRecoverPassword());
    }

    // Comportamiento por defecto: valida y no llama a ningún sistema.
    @Override public void login(String email, String password) {
        if (!isValidData(email, password)) { showMissingDataError(); return; }
        showMessage("Datos completos (sin integración).");
    }
    @Override public void goToCreateAccount() { showMessage("Crear cuenta (sin integración)."); }
    @Override public void goToRecoverPassword() { showMessage("Recuperar contraseña (sin integración)."); }
    @Override public boolean isValidData(String email, String password) {
        return !email.isEmpty() && !password.isEmpty();
    }

    // Operaciones de presentación que la Implementación invoca.
    protected void showMessage(String message) { lblMessage.setText(message); }
    protected void showMissingDataError() { showMessage("Ingrese su correo y su contraseña."); }
    protected void setBusy(boolean busy) {
        txtEmail.setDisable(busy);
        txtPassword.setDisable(busy);
        btnLogin.setDisable(busy);
    }

    private void buildLayout() {
        // Los identificadores permiten encontrar los controles en las pruebas (lookup) sin exponerlos.
        txtEmail.setId("txtEmail");
        txtEmail.setPromptText("Correo");
        txtPassword.setId("txtPassword");
        txtPassword.setPromptText("Contraseña");
        lblMessage.setId("lblMessage");
        btnLogin.setId("btnLogin");
        btnLogin.setDefaultButton(true);
        setPadding(new Insets(16));
        getChildren().addAll(new Label("Iniciar sesión"), txtEmail, txtPassword, lblMessage,
            btnLogin, btnCreateAccount, btnRecoverPassword);
    }
}
