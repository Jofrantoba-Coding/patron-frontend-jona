package com.example.view.ui.uilogin;

import java.awt.GridLayout;
import javax.swing.*;

/** Plantilla: construye la ventana, conecta los controles con el contrato y da un comportamiento por defecto. */
public class UiLogin extends JDialog implements InterUiLogin {
    private final JTextField txtEmail = new JTextField(20);
    private final JPasswordField txtPassword = new JPasswordField(20);
    private final JLabel lblMessage = new JLabel(" ");
    private final JButton btnLogin = new JButton("Ingresar");
    private final JButton btnCreateAccount = new JButton("Crear cuenta");
    private final JButton btnRecoverPassword = new JButton("Recuperar contraseña");

    public UiLogin() {
        setTitle("Iniciar sesión");
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        buildLayout();
        btnLogin.addActionListener(e ->
            login(txtEmail.getText(), new String(txtPassword.getPassword())));
        btnCreateAccount.addActionListener(e -> goToCreateAccount());
        btnRecoverPassword.addActionListener(e -> goToRecoverPassword());
    }

    // Comportamiento por defecto: valida y no llama a ningún sistema.
    @Override public void login(String email, String password) {
        if (!isValidData(email, password)) { showMissingDataError(); return; }
        showMessage("Datos completos (sin integración).");
    }
    @Override public void goToCreateAccount() { showMessage("Crear cuenta (sin integración)."); }
    @Override public void goToRecoverPassword() { showMessage("Recuperar contraseña (sin integración)."); }
    @Override public boolean isValidData(String email, String password) {
        return hasRequiredData(email, password);
    }

    /** Regla pura: se prueba sin crear la ventana. */
    static boolean hasRequiredData(String email, String password) {
        return !email.isEmpty() && !password.isEmpty();
    }

    // Operaciones de presentación que la Implementación invoca.
    protected void showMessage(String message) { lblMessage.setText(message); }
    protected void showMissingDataError() { showMessage("Ingrese su correo y su contraseña."); }
    protected void setBusy(boolean busy) {
        txtEmail.setEnabled(!busy);
        txtPassword.setEnabled(!busy);
        btnLogin.setEnabled(!busy);
    }

    private void buildLayout() {
        JPanel panel = new JPanel(new GridLayout(0, 1, 4, 4));
        panel.setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));
        panel.add(new JLabel("Correo"));
        panel.add(txtEmail);
        panel.add(new JLabel("Contraseña"));
        panel.add(txtPassword);
        panel.add(lblMessage);
        panel.add(btnLogin);
        panel.add(btnCreateAccount);
        panel.add(btnRecoverPassword);
        setContentPane(panel);
        getRootPane().setDefaultButton(btnLogin);
        pack();
        setLocationRelativeTo(null);
    }
}
