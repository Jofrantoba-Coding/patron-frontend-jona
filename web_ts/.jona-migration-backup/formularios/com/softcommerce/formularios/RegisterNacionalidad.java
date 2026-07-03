package com.softcommerce.formularios;

import com.softcommerce.beans.Nacionalidad;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import javax.swing.JPanel;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Frame;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnNacionalidad;
import com.softcommerce.util.ExceptionHandler;
import org.apache.log4j.Logger;

public class RegisterNacionalidad
        extends JHDialog implements KeyListener, FocusListener {

    private JTextField txtCodigo;
    private JTextField txtDescripcion;
    private final Usuario usuario;
    private final Logger logger = Logger.getLogger(RegisterNacionalidad.class);

    public RegisterNacionalidad(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Nacionalidad", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        JPanel pnlFamilia = new JPanel();
        pnlFamilia.setLayout(null);
        pnlFamilia.setBackground(new Color(245, 245, 245));
        pnlFamilia.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 80, 20);
        pnlFamilia.add(lbl_Codigo);

        txtCodigo = new JTextField();
        txtCodigo.setEditable(false);
        txtCodigo.setBounds(125, 45, 120, 20);
        pnlFamilia.add(txtCodigo);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 80, 80, 20);
        pnlFamilia.add(lbl_Descripcion);

        txtDescripcion = new JTextField();
        txtDescripcion.setBounds(125, 80, 150, 20);
        txtDescripcion.setDocument(new UpperCaseNumberDocument(100));
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        pnlFamilia.add(txtDescripcion);

        pnlFamilia.setBounds(20, 20, 460, 120);
        pnl_dialog.add(pnlFamilia);

        setTitleName("Nacionalidad");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 225));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo() {

    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());

        txtCodigo.setText("");
        txtDescripcion.setText("");

        txtDescripcion.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            (new RnNacionalidad(path)).insertNacionalidad(txtDescripcion.getText().trim(), usuario.getId_usuario());
            return "OK";
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (txtDescripcion == e.getSource()) {
            txtDescripcion.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtDescripcion) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());

        if (txtDescripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Nacionalidad, debes especificar su Descripcion.", "Datos incompletos de Nacionalidad", JOptionPane.CANCEL_OPTION);
            txtDescripcion.setBorder(new LineBorder(Color.RED));
            txtDescripcion.requestFocus();

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            Nacionalidad nacionalidad = (new RnNacionalidad(path)).getNacionalidad(rowSelection.getSelectedValue(1).toString());
            if (nacionalidad == null) {
                return false;
            }
            txtCodigo.setText(nacionalidad.getCodigo());
            txtDescripcion.setText(nacionalidad.getDescripcion());
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public String executeUpdate() {
        try {
            (new RnNacionalidad(path)).updateNacionalidad(txtCodigo.getText().trim(),
                    txtDescripcion.getText().trim(), usuario.getId_usuario());
            return "OK";
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            (new RnNacionalidad(path)).deleteNacionalidad(txtCodigo.getText().trim());
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {

    }

    @Override
    public void setRegisterEditable(boolean e) {
        txtDescripcion.setEditable(e);
    }

    @Override
    public void focusLost(FocusEvent e) {

    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public boolean executeAnular() {
        return true;
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }
}
