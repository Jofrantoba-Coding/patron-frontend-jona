package com.softcommerce.formularios;

import com.softcommerce.beans.ClienteDireccion;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.beans.Zona;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.Util;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.net.URL;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import org.apache.log4j.Logger;

public class FormClienteDireccion
        extends JDialog
        implements ActionListener, FocusListener, ItemListener {

    private final URL path;
    private JButton btnProcess;
    public Boolean swRegistro;
    private JComboBox cboDepartamento;
    private JComboBox cboProvincia;
    private JComboBox cboDistrito;
    private JComboBox cboZona;
    private JTextField txtDireccion;
    private final JHDialog dialog;
    private final Component comp;
    private final Logger logger = Logger.getLogger(FormClienteDireccion.class);

    public FormClienteDireccion(JHDialog arg0, URL path, Component comp) {
        super(arg0);
        this.dialog = arg0;
        this.path = path;
        this.comp = comp;
        initialize();
    }

    private void initialize() {
        swRegistro = false;
        setTitle("Agregar Direccion");
        setBackground(new Color(245, 245, 245));
        setContentPane(this.getPnl());
        setModal(true);
        this.initListener();
        loadDepartamento();

        setSize(400, 250);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);
    }

    private JPanel getPnl() {
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.setLayout(new GridBagLayout());
        CLabel lbl_Departamento = new CLabel("Departamento");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Departamento, gbc);

        cboDepartamento = new JComboBox();
        gbc.gridx = 1;
        pnl.add(cboDepartamento, gbc);

        CLabel lbl_Provincia = new CLabel("Provincia");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnl.add(lbl_Provincia, gbc);
        cboProvincia = new JComboBox();
        cboProvincia.setEnabled(false);
        gbc.gridx = 1;
        pnl.add(cboProvincia, gbc);

        CLabel lbl_Distrito = new CLabel("Distrito");
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnl.add(lbl_Distrito, gbc);
        cboDistrito = new JComboBox();
        cboDistrito.setEnabled(false);
        gbc.gridx = 1;
        pnl.add(cboDistrito, gbc);

        CLabel lbl_Zona = new CLabel("Zona");
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnl.add(lbl_Zona, gbc);
        cboZona = new JComboBox();
        cboZona.setEnabled(false);
        gbc.gridx = 1;
        pnl.add(cboZona, gbc);

        CLabel lblDireccion = new CLabel("Direccion");
        gbc.gridx = 0;
        gbc.gridy = 4;
        pnl.add(lblDireccion, gbc);
        txtDireccion = new JTextField();
        txtDireccion.setDocument(new UpperCaseDocument());
        txtDireccion.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 1;
        pnl.add(txtDireccion, gbc);
        btnProcess = new JButton("Agregar");
        gbc.gridy = 5;
        pnl.add(btnProcess, gbc);
        return pnl;
    }

    private void initListener() {
        btnProcess.addActionListener(this);
        cboDepartamento.addItemListener(this);
        cboProvincia.addItemListener(this);
        cboDistrito.addItemListener(this);
    }

    private void loadDepartamento() {
        try {
            LoadCombo.loadUbigeo(cboDepartamento, "", !Constans.IS_DIRECCION_CLIENTE, path);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    private void changeDepartamento() throws Exception {
        try {
            String idUbigeo = LoadComboItem.getIdCombo(cboDepartamento);
            cboProvincia.removeAllItems();
            if (Util.isBlank(idUbigeo)) {
                cboProvincia.setEnabled(false);
                return;
            }
            cboProvincia.setEnabled(true);
            LoadCombo.loadUbigeo(cboProvincia, idUbigeo, !Constans.IS_DIRECCION_CLIENTE, path);
        } catch (Exception e) {
            throw e;
        }
    }

    private void changeProvincia() throws Exception {
        try {
            String idUbigeo = LoadComboItem.getIdCombo(cboProvincia);
            cboDistrito.removeAllItems();
            if (Util.isBlank(idUbigeo)) {
                cboDistrito.setEnabled(false);
                return;
            }
            cboDistrito.setEnabled(true);
            LoadCombo.loadUbigeo(cboDistrito, idUbigeo, !Constans.IS_DIRECCION_CLIENTE, path);
        } catch (Exception e) {
            throw e;
        }
    }

    private void changeDistrito() throws Exception {
        try {
            String idUbigeo = LoadComboItem.getIdCombo(cboDistrito);
            cboZona.removeAllItems();
            if (Util.isBlank(idUbigeo)) {
                cboZona.setEnabled(false);
                return;
            }
            cboZona.setEnabled(true);
            LoadCombo.loadZona(idUbigeo, cboZona, path);
        } catch (Exception e) {
            throw e;
        }
    }

    private Boolean validarData() {
        if (cboDepartamento.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Debes Seleccionar un Departamento.", "Datos incompletos ", JOptionPane.CANCEL_OPTION);
            cboDepartamento.setBorder(new LineBorder(Color.RED));
            cboDepartamento.requestFocus();
            return false;
        }
        if (cboProvincia.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Debes Seleccionar una Provincia.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            cboProvincia.setBorder(new LineBorder(Color.RED));
            cboProvincia.requestFocus();
            return false;
        }
        if (cboDistrito.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Debes Seleccionar un Almacen.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            cboDistrito.setBorder(new LineBorder(Color.RED));
            cboDistrito.requestFocus();
            return false;
        }
        if (!Constans.IS_DIRECCION_CLIENTE && cboZona.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Debes Seleccionar una Zona.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            cboZona.setBorder(new LineBorder(Color.RED));
            cboZona.requestFocus();
            return false;
        }
        if (txtDireccion.getText().length() == 0) {
            JOptionPane.showMessageDialog(this, "Debes Ingresar Direccion.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txtDireccion.setBorder(new LineBorder(Color.RED));
            txtDireccion.requestFocus();
            return false;
        }
        return true;
    }

    private Ubigeo getUbigeo() {
        Ubigeo ubigeo = new Ubigeo();
        ubigeo.setCodigo(LoadComboItem.getIdCombo(cboDistrito));
        ubigeo.setDescripcion(cboDistrito.getSelectedItem().toString());
        return ubigeo;
    }

    private ClienteDireccion getClienteDireccion() {
        ClienteDireccion beanClienteDireccion = new ClienteDireccion();
        beanClienteDireccion.setEstado("A");
        Zona beanZona = new Zona();
        Integer idZona = Util.getNumberInteger(LoadComboItem.getIdCombo(cboZona));
        beanZona.setId_zona(idZona);
        beanZona.setDescripcion(idZona > 0 ? cboZona.getSelectedItem().toString() : "");
        beanClienteDireccion.setBeanZona(beanZona);
        beanClienteDireccion.setUbigeo(this.getUbigeo());
        beanClienteDireccion.setDireccion(txtDireccion.getText().trim());
        beanClienteDireccion.setOperacion("I");
        return beanClienteDireccion;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (btnProcess == e.getSource()) {
            if (!validarData()) {
                return;
            }
            dialog.setValueSearch(this.getClienteDireccion(), comp);
            dispose();
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(cboDepartamento)) {
                this.changeDepartamento();
            }
            if (e.getSource().equals(cboProvincia)) {
                this.changeProvincia();
            }
            if (e.getSource().equals(cboDistrito)) {
                this.changeDistrito();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

}
