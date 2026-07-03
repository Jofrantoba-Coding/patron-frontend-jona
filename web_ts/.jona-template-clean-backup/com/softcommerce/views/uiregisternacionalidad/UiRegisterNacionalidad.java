package com.softcommerce.views.uiregisternacionalidad;


import com.softcommerce.formularios.*;
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

public class UiRegisterNacionalidad
        extends JHDialog implements InterUiRegisterNacionalidad, KeyListener, FocusListener {

    protected JTextField txtCodigo;
    protected JTextField txtDescripcion;
    protected final Usuario usuario;
    protected final Logger logger = Logger.getLogger(UiRegisterNacionalidad.class);

    public UiRegisterNacionalidad(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
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
    }

    @Override
    public String executeInsert() {
        return null;
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
        return false;
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeDelete() {
        return false;
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
        return false;
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
        return false;
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }
}
