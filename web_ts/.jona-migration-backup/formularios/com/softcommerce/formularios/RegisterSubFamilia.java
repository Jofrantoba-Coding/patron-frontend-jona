package com.softcommerce.formularios;

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

public class RegisterSubFamilia
        extends JHDialog implements ActionListener, ItemListener, KeyListener, FocusListener {

    private JTextField txtCodigo;
    private JTextField txtDescripcion;
    private JComboBox cboFamilia;
    private JButton btnNuevoFamilia;
    private JComboBox cboSunat;
    private final Usuario usuario;
    private final Logger logger = Logger.getLogger(RegisterSubFamilia.class);

    public RegisterSubFamilia(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public RegisterSubFamilia(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
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

    private JPanel getPnlSubFamilia() {
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

    private BeanSubFamilia getSubFamilia() {
        BeanSubFamilia subFamilia = new BeanSubFamilia();
        subFamilia.setBeanFamilia((BeanFamilia) LoadComboItem.getObjectCombo(cboFamilia));
        subFamilia.setIdSubFamilia(txtCodigo.getText().trim());
        subFamilia.setDescripcion(txtDescripcion.getText().trim());
        subFamilia.setSubFamiliaSunat(new SubFamiliaSunat(LoadComboItem.getIdComboNull(cboSunat)));
        return subFamilia;
    }

    @Override
    public void loadCombo() {
        try {
            LoadComboItem.loadComboFamilia(path, cboFamilia, usuario);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());
        cboFamilia.setBorder(txt.getBorder());

        txtCodigo.setText("");
        txtDescripcion.setText("");
        cboFamilia.setSelectedIndex(0);

        cboFamilia.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            RnSubFamilia regla = new RnSubFamilia(path);
            return regla.mantSubFamilia(this.getSubFamilia(), usuario.getCodempresa(), OperacionBDEnum.INSERTAR);
        } catch (Exception e) {
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
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());
        cboFamilia.setBorder(txt.getBorder());

        if (cboFamilia.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una SubFamilia, debes " + "especificar su Familia.", "Datos incompletos de SubFamilia", JOptionPane.CANCEL_OPTION);
            cboFamilia.setBorder(new LineBorder(Color.RED));
            cboFamilia.requestFocus();

            return false;
        }

        if (txtDescripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una SubFamilia , debes " + "especificar su Descripcion.", "Datos incompletos de SubFamilia", JOptionPane.CANCEL_OPTION);
            txtDescripcion.setBorder(new LineBorder(Color.RED));
            txtDescripcion.requestFocus();

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            BeanSubFamilia s = new BeanSubFamilia();
            s.setIdSubFamilia(rowSelection.getSelectedValue(1).toString());
            BeanFamilia beanFamily = new BeanFamilia();
            beanFamily.setIdFamilia(rowSelection.getSelectedValue(4).toString());
            s.setBeanFamilia(beanFamily);
            RnSubFamilia regla = new RnSubFamilia(path);
            List<BeanSubFamilia> subfamilia = regla.listar(s);
            if (subfamilia.isEmpty()) {
                return false;
            }
            BeanSubFamilia m = subfamilia.get(0);
            txtCodigo.setText(mode == CLONE ? "" : m.getIdSubFamilia());
            txtDescripcion.setText(m.getDescripcion());
            LoadComboItem.setComboFamiliaItem(m.getBeanFamilia().getIdFamilia(), cboFamilia);
            LoadComboItem.setComboItem(m.getCodigoSubFamiliaSunat(), cboSunat);
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnSubFamilia regla = new RnSubFamilia(path);
            return regla.mantSubFamilia(this.getSubFamilia(), usuario.getCodempresa(), OperacionBDEnum.ACTUALIZAR);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnSubFamilia regla = new RnSubFamilia(path);
            regla.mantSubFamilia(this.getSubFamilia(), usuario.getCodempresa(), OperacionBDEnum.ELIMINAR);
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
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

    private void loadSubFamiliaSunat() throws Exception {
        try {
            logger.debug("loadSubFamiliaSunat()");
            BeanFamilia familia = (BeanFamilia) LoadComboItem.getObjectCombo(cboFamilia);
            cboSunat.removeAllItems();
            if (familia == null) {
                return;
            }
            String codigoFamiliaSunat = familia.getCodigoFamiliaSunat();
            if (codigoFamiliaSunat == null) {
                return;
            }
            LoadComboItem.loadComboSubFamiliaSunat(path, cboSunat, codigoFamiliaSunat);
        } catch (Exception e) {
            throw e;
        }
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
        return true;
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
