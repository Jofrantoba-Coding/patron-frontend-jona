package com.softcommerce.views.uiregisteralmacen;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Dialog;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnUbigeo;
import javax.swing.*;

public class UiRegisterAlmacen 
        extends JHDialog 
        implements InterUiRegisterAlmacen, ActionListener, ItemListener, KeyListener, FocusListener {

    protected JTextField txtCodigo;
    protected JTextField txtDescripcion;
    protected JTextField txtDireccion;
    protected JTextField txtCodEmpresa;
    protected JComboBox cboDepartamento;
    protected List<Ubigeo> xdepartamento;
    protected JComboBox cboProvincia;
    protected List<Ubigeo> xprovincia;
    protected JComboBox cboDistrito;
    protected List<Ubigeo> xdistrito;
    protected CComboBox cboCodLocalidad;
    protected List<Localidad> xlocalidad;
    protected final Usuario usuario;
    protected CComboBox cboPuntoVenta;
    protected List<PuntoVenta> xpuntoventa;
    protected JCheckBox chkDireccionamiento;
    protected JCheckBox chkDespacho;
    protected JCheckBox chkVenta;

    public UiRegisterAlmacen(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterAlmacen(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Almacen", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);

        JPanel pnlAlmacen = new JPanel();
        pnlAlmacen.setBorder(border);
        pnlAlmacen.setLayout(null);
        pnlAlmacen.setBackground(new Color(245, 245, 245));

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 100, 20);
        pnlAlmacen.add(lbl_Codigo);

        txtCodigo = new JTextField();
        txtCodigo.setEditable(false);
        txtCodigo.setBounds(130, 45, 100, 20);
        pnlAlmacen.add(txtCodigo);

        CLabel lbl_CodLocalidad = new CLabel("Localidad");
        lbl_CodLocalidad.setBounds(35, 80, 82, 20);
        pnlAlmacen.add(lbl_CodLocalidad);

        cboCodLocalidad = new CComboBox();
        cboCodLocalidad.setBounds(130, 80, 185, 20);
        cboCodLocalidad.addActionListener(this);
        cboCodLocalidad.setEnabled(false);
        cboCodLocalidad.addKeyListener(this);
        pnlAlmacen.add(cboCodLocalidad);

        CLabel lbl_CodPuntoVenta = new CLabel("Punto de Venta");
        lbl_CodPuntoVenta.setBounds(35, 115, 82, 20);
        pnlAlmacen.add(lbl_CodPuntoVenta);

        cboPuntoVenta = new CComboBox();
        cboPuntoVenta.setBounds(130, 115, 185, 20);
        cboPuntoVenta.addActionListener(this);
        cboPuntoVenta.setEnabled(false);
        cboPuntoVenta.addKeyListener(this);
        pnlAlmacen.add(cboPuntoVenta);

        txtCodEmpresa = new JTextField();
        txtCodEmpresa.setBounds(0, 0, 0, 0);
        txtCodEmpresa.setVisible(false);
        pnlAlmacen.add(txtCodEmpresa);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 150, 100, 20);
        pnlAlmacen.add(lbl_Descripcion);

        txtDescripcion = new JTextField();
        txtDescripcion.setBounds(130, 150, 200, 20);
        txtDescripcion.setDocument(new UpperCaseNumberDocument(100));
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        pnlAlmacen.add(txtDescripcion);

        CLabel lbl_Direccion = new CLabel("Dirección");
        lbl_Direccion.setBounds(35, 185, 100, 20);
        pnlAlmacen.add(lbl_Direccion);

        txtDireccion = new JTextField();
        txtDireccion.addFocusListener(this);
        txtDireccion.setBounds(130, 185, 250, 20);
        txtDireccion.setDocument(new UpperCaseNumberDocument(100));
        txtDireccion.addKeyListener(this);
        pnlAlmacen.add(txtDireccion);

        CLabel lbl_Departamento = new CLabel("Departamento");
        lbl_Departamento.setBounds(35, 220, 100, 20);
        pnlAlmacen.add(lbl_Departamento);

        cboDepartamento = new JComboBox();
        cboDepartamento.addActionListener(this);
        cboDepartamento.addKeyListener(this);
        cboDepartamento.setBounds(130, 220, 200, 20);
        pnlAlmacen.add(cboDepartamento);

        CLabel lbl_Provincia = new CLabel("Provincia");
        lbl_Provincia.setBounds(35, 255, 100, 20);
        pnlAlmacen.add(lbl_Provincia);

        cboProvincia = new JComboBox();
        cboProvincia.addActionListener(this);
        cboProvincia.setBounds(130, 255, 180, 20);
        cboProvincia.addKeyListener(this);
        cboProvincia.setEnabled(false);
        pnlAlmacen.add(cboProvincia);

        CLabel lbl_Distrito = new CLabel("Distrito");
        lbl_Distrito.setBounds(35, 290, 100, 20);
        pnlAlmacen.add(lbl_Distrito);

        cboDistrito = new JComboBox();
        cboDistrito.addActionListener(this);
        cboDistrito.setBounds(130, 290, 180, 20);
        cboDistrito.addKeyListener(this);
        cboDistrito.setEnabled(false);
        pnlAlmacen.add(cboDistrito);
        chkDireccionamiento = new JCheckBox("Direccionamiento Facturación");
        chkDireccionamiento.setBounds(35, 320, 250, 20);
        pnlAlmacen.add(chkDireccionamiento);

        chkDespacho = new JCheckBox("Habilitar Despacho");
        chkDespacho.setBounds(35, 355, 250, 20);
        pnlAlmacen.add(chkDespacho);
        chkVenta = new JCheckBox("Habilitar Venta");
        chkVenta.setBounds(35, 390, 250, 20);
        pnlAlmacen.add(chkVenta);

        pnlAlmacen.setBounds(20, 20, 460, 430);
        pnl_dialog.add(pnlAlmacen);

        setTitleName("Almacen");
        setRegister(pnl_dialog);
        setSize(new Dimension(500, 540));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo() {
    }

    public void loadDepartamento() {
    }

    public void loadLocalidad(String xcodEmpres) {
    }

    public void loadPuntoVenta(String xcodLocalidad) {
    }

    public void loadDistrito(String xcoddis) {
    }

    public void loadProvincia(String xcoddep) {
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
        if (e.getSource() == txtDescripcion) {
            txtDescripcion.selectAll();
        }

        if (e.getSource() == txtDireccion) {
            txtDireccion.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cboCodLocalidad) {
                if (cboPuntoVenta.isEnabled()) {
                    cboPuntoVenta.requestFocus();
                } else {
                    txtDescripcion.requestFocus();
                }
            }

            if (e.getSource() == cboPuntoVenta) {
                txtDescripcion.requestFocus();
            }

            if (e.getSource() == txtDescripcion) {
                txtDireccion.requestFocus();
            }

            if (e.getSource() == txtDireccion) {
                cboDepartamento.requestFocus();
            }

            if (e.getSource() == cboDepartamento) {
                if (cboProvincia.isEnabled()) {
                    cboProvincia.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cboProvincia) {
                if (cboDistrito.isEnabled()) {
                    cboDistrito.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cboDistrito) {
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

    public void cargarLocalidad(String codLocalidad) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
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
        if (cboCodLocalidad == e.getSource()) {
            if (cboCodLocalidad.getItemCount() > 0) {
                if (cboCodLocalidad.getSelectedIndex() == 0) {
                    cboPuntoVenta.removeAllItems();
                    cboPuntoVenta.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cboPuntoVenta.setEnabled(true);
                    }

                    loadPuntoVenta(xlocalidad.get(cboCodLocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cboDepartamento == e.getSource()) {
            if (cboDepartamento.getItemCount() > 0) {
                if (cboDepartamento.getSelectedIndex() == 0) {
                    cboDistrito.removeAllItems();
                    cboProvincia.removeAllItems();
                    cboProvincia.setEnabled(false);
                    cboDistrito.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cboProvincia.setEnabled(true);
                    }

                    loadProvincia(xdepartamento.get(cboDepartamento.getSelectedIndex() - 1).getCodigo());
                }
            }
        }

        if (cboProvincia == e.getSource()) {
            if (cboProvincia.getItemCount() > 0) {
                if (cboProvincia.getSelectedIndex() == 0) {
                    cboDistrito.removeAllItems();
                    cboDistrito.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cboDistrito.setEnabled(true);
                    }

                    loadDistrito(xprovincia.get(cboProvincia.getSelectedIndex() - 1).getCodigo());
                }
            }
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cboCodLocalidad.setEnabled(e);
        cboDepartamento.setEnabled(e);
        cboProvincia.setEnabled(e);
        cboDistrito.setEnabled(e);
        cboPuntoVenta.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txtDescripcion.setEditable(e);
        txtDireccion.setEditable(e);
    }

    public void prepareRegister() {
    }

    public void addRow(String[] reg) {
    }

    public void addRow(Usuario reg) {
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
    public void itemStateChanged(ItemEvent e) {
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
    public void focusLost(FocusEvent e) {
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
