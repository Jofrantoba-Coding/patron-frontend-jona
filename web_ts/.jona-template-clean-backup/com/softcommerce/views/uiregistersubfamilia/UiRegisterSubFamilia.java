package com.softcommerce.views.uiregistersubfamilia;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.Usuario;
import com.softcommerce.entity.SubFamiliaSunat;
import com.softcommerce.enums.OperacionBDEnum;
import com.softcommerce.general.controles.CComboBox;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.Register;
import java.awt.event.FocusEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import java.awt.Cursor;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.BorderLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import org.apache.log4j.Logger;

public class UiRegisterSubFamilia
        extends JHDialog implements InterUiRegisterSubFamilia, ActionListener, ItemListener, KeyListener, FocusListener {

    protected JTextField txtCodigo;
    protected JTextField txtDescripcion;
    protected JComboBox cboFamilia;
    protected JButton btnNuevoFamilia;
    protected JComboBox cboSunat;
    protected final Usuario usuario;
    protected final Logger logger = Logger.getLogger(UiRegisterSubFamilia.class);

    public UiRegisterSubFamilia(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterSubFamilia(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        JPanel pnlDialog = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, "Datos de Sub-Familia", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 11), Color.BLACK);
        pnlDialog.setBorder(border);
        pnlDialog.setLayout(new BorderLayout());
        pnlDialog.setBackground(new Color(245, 245, 245));
        pnlDialog.add(this.getPnlSubFamilia(), BorderLayout.CENTER);
        setTitleName("Sub-Familia");
        getContentPane().add(pnlDialog);
        setSize(new Dimension(510, 285));
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected JPanel getPnlSubFamilia() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.setBackground(new Color(245, 245, 245));
        Gif gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnl.setBackground(new Color(245, 245, 245));
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();

        CLabel lblCodigo = new CLabel("Código");
        pnl.add(lblCodigo, gbc);

        gbc.gridx = 1;
        txtCodigo = new JTextField();
        txtCodigo.setEditable(false);
        txtCodigo.addKeyListener(this);
        txtCodigo.setColumns(6);
        pnl.add(txtCodigo, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        CLabel lblFamilia = new CLabel("Familia");
        pnl.add(lblFamilia, gbc);

        gbc.gridx = 1;
        cboFamilia = new CComboBox();
        cboFamilia.addItemListener(this);
        pnl.add(cboFamilia, gbc);

        gbc.gridx = 2;
        btnNuevoFamilia = new JButton(gif.ADDORANGE);
        btnNuevoFamilia.setToolTipText("Nuevo Familia");
        btnNuevoFamilia.addActionListener(this);
        btnNuevoFamilia.addKeyListener(this);
        btnNuevoFamilia.setFocusPainted(false);
        pnl.add(btnNuevoFamilia, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        CLabel lblDescripcion = new CLabel("Descripción");
        pnl.add(lblDescripcion, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtDescripcion = new JTextField();
        txtDescripcion.setDocument(new UpperCaseNumberDocument(100));
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        txtDescripcion.setColumns(25);
        pnl.add(txtDescripcion, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblSunat = new JLabel("Codigo Sunat");
        pnl.add(lblSunat, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        cboSunat = new JComboBox();
        pnl.add(cboSunat, gbc);
        gbc.gridwidth = 1;
        return pnlPrinc;
    }

    protected BeanSubFamilia getSubFamilia() {
        return null;
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
            if (e.getSource() == cboFamilia) {
                txtDescripcion.requestFocus();
            }

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
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnNuevoFamilia) {
            setCursor(new Cursor(Cursor.WAIT_CURSOR));

            RegisterFamilia register = new RegisterFamilia(this, usuario);
            register.setModeRegister(Register.INSERT);
            register.setVisible(true);

            setCursor(new Cursor(Cursor.DEFAULT_CURSOR));

            String codigo = register.getResultado();

            if ((codigo != null) && !codigo.equals("")) {
                this.loadCombo();
                LoadComboItem.setComboFamiliaItem(codigo, cboFamilia);
            }
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cboFamilia.setEnabled(e);
        btnNuevoFamilia.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txtDescripcion.setEditable(e);
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    protected void loadSubFamiliaSunat() throws Exception {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(cboFamilia)) {
                this.loadSubFamiliaSunat();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    public boolean executeDetail() {
        return false;
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
