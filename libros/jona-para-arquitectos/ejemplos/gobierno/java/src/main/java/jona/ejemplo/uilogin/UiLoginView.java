package jona.ejemplo.uilogin;

import java.awt.GridLayout;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;

/** Vista: solo pinta y avisa por el contrato. Visible solo dentro del paquete. */
class UiLoginView extends JPanel implements InterUiLogin {
    private final JTextField txtCorreo = new JTextField(20);
    private final JPasswordField txtClave = new JPasswordField(20);
    private final JLabel lblError = new JLabel(" ");
    private final JButton btnEnviar = new JButton(DEFAULTS.ETIQUETA_ENVIAR);

    UiLoginView(Eventos eventos) {
        super(new GridLayout(0, 1, 4, 4));
        add(new JLabel(DEFAULTS.TITULO));
        add(txtCorreo);
        add(txtClave);
        add(lblError);
        add(btnEnviar);
        btnEnviar.addActionListener(e -> eventos.onEnviar(txtCorreo.getText(), new String(txtClave.getPassword())));
    }

    @Override public void mostrarError(String mensaje) { lblError.setText(mensaje); }

    @Override public void setEnviando(boolean enviando) { btnEnviar.setEnabled(!enviando); }
}
