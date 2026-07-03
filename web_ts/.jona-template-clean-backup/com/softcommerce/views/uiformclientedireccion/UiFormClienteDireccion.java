package com.softcommerce.views.uiformclientedireccion;


import com.softcommerce.formularios.*;
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

public class UiFormClienteDireccion
        extends JDialog
        implements InterUiFormClienteDireccion, ActionListener, FocusListener, ItemListener {

    protected final URL path;
    protected JButton btnProcess;
    public Boolean swRegistro;
    protected JComboBox cboDepartamento;
    protected JComboBox cboProvincia;
    protected JComboBox cboDistrito;
    protected JComboBox cboZona;
    protected JTextField txtDireccion;
    protected final JHDialog dialog;
    protected final Component comp;
    protected final Logger logger = Logger.getLogger(UiFormClienteDireccion.class);

    public UiFormClienteDireccion(JHDialog arg0, URL path, Component comp) {
        super(arg0);
        this.dialog = arg0;
        this.path = path;
        this.comp = comp;
        initialize();
    }

    protected void initialize() {
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

    protected JPanel getPnl() {
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

    protected void initListener() {
        btnProcess.addActionListener(this);
        cboDepartamento.addItemListener(this);
        cboProvincia.addItemListener(this);
        cboDistrito.addItemListener(this);
    }

    protected void loadDepartamento() {
    }

    protected void changeDepartamento() throws Exception {
    }

    protected void changeProvincia() throws Exception {
    }

    protected void changeDistrito() throws Exception {
    }

    protected Boolean validarData() {
        return null;
    }

    protected Ubigeo getUbigeo() {
        return null;
    }

    protected ClienteDireccion getClienteDireccion() {
        return null;
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
