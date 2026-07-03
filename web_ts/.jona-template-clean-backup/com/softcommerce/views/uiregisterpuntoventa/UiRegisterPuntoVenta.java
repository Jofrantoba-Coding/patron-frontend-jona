package com.softcommerce.views.uiregisterpuntoventa;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Empresa;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
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
import java.awt.Dialog;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnEmpresa;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnUbigeo;

public class UiRegisterPuntoVenta extends JHDialog implements InterUiRegisterPuntoVenta, ActionListener, ItemListener, KeyListener, FocusListener, Register {

    protected JTextField txt_Codigo;
    protected CComboBox cb_CodLocalidad;
    protected JTextField txt_Telefono;
    protected JTextField txt_Descripcion;
    protected JTextField txt_Direccion;
    protected JTextField txt_estado;
    protected JComboBox cb_Departamento;
    protected JComboBox cb_Provincia;
    protected JComboBox cb_Distrito;
    protected List<Ubigeo> xdepartamento;
    protected List<Ubigeo> xdistrito;
    protected List<Ubigeo> xprovincia;
    protected List<Localidad> xlocalidad;
    protected JComboBox cb_Empresa;
    protected List<Empresa> xempresa;
    protected Usuario usuario;

    public UiRegisterPuntoVenta(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterPuntoVenta(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Punto de Venta", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);

        JPanel pnl_PUNTO_VENTA = new JPanel();
        pnl_PUNTO_VENTA.setBorder(border);
        pnl_PUNTO_VENTA.setLayout(null);
        pnl_PUNTO_VENTA.setBackground(new Color(245, 245, 245));

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 100, 20);
        pnl_PUNTO_VENTA.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setBounds(130, 45, 100, 20);
        txt_Codigo.setEditable(false);
        pnl_PUNTO_VENTA.add(txt_Codigo);

        CLabel lbl_Empresa = new CLabel("Empresa");
        lbl_Empresa.setBounds(35, 80, 100, 20);
        pnl_PUNTO_VENTA.add(lbl_Empresa);

        cb_Empresa = new JComboBox();
        cb_Empresa.addKeyListener(this);
        cb_Empresa.addActionListener(this);
        cb_Empresa.setBounds(130, 80, 210, 20);
        pnl_PUNTO_VENTA.add(cb_Empresa);

        txt_estado = new JTextField();
        txt_estado.setBounds(0, 0, 0, 0);
        pnl_PUNTO_VENTA.add(txt_estado);

        CLabel lbl_CodLocalidad = new CLabel("Localidad");
        lbl_CodLocalidad.setBounds(35, 115, 82, 20);
        pnl_PUNTO_VENTA.add(lbl_CodLocalidad);

        cb_CodLocalidad = new CComboBox();
        cb_CodLocalidad.setBounds(130, 115, 185, 20);
        cb_CodLocalidad.addActionListener(this);
        cb_CodLocalidad.setEnabled(false);
        cb_CodLocalidad.addKeyListener(this);
        pnl_PUNTO_VENTA.add(cb_CodLocalidad);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 150, 100, 20);
        pnl_PUNTO_VENTA.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(130, 150, 200, 20);
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addFocusListener(this);
        pnl_PUNTO_VENTA.add(txt_Descripcion);

        CLabel lbl_Direccion = new CLabel("Dirección");
        lbl_Direccion.setBounds(35, 185, 100, 20);
        pnl_PUNTO_VENTA.add(lbl_Direccion);

        txt_Direccion = new JTextField();
        txt_Direccion.setBounds(130, 185, 250, 20);
        txt_Direccion.addKeyListener(this);
        txt_Direccion.setDocument(new UpperCaseNumberDocument(100));
        txt_Direccion.addFocusListener(this);
        pnl_PUNTO_VENTA.add(txt_Direccion);

        CLabel lbl_Telefono = new CLabel("Teléfono");
        lbl_Telefono.setBounds(35, 220, 60, 20);
        pnl_PUNTO_VENTA.add(lbl_Telefono);

        txt_Telefono = new JTextField();
        txt_Telefono.setBounds(130, 220, 100, 20);
        txt_Telefono.addKeyListener(this);        
        txt_Telefono.addFocusListener(this);
        pnl_PUNTO_VENTA.add(txt_Telefono);

        CLabel lbl_Departamento = new CLabel("Departamento");
        lbl_Departamento.setBounds(35, 255, 100, 20);
        pnl_PUNTO_VENTA.add(lbl_Departamento);

        cb_Departamento = new JComboBox();
        cb_Departamento.addActionListener(this);
        cb_Departamento.addKeyListener(this);
        cb_Departamento.setBounds(130, 255, 200, 20);
        pnl_PUNTO_VENTA.add(cb_Departamento);

        CLabel lbl_Provincia = new CLabel("Provincia");
        lbl_Provincia.setBounds(35, 290, 100, 20);
        pnl_PUNTO_VENTA.add(lbl_Provincia);

        cb_Provincia = new JComboBox();
        cb_Provincia.addActionListener(this);
        cb_Provincia.setBounds(130, 290, 180, 20);
        cb_Provincia.addKeyListener(this);
        cb_Provincia.setEnabled(false);
        pnl_PUNTO_VENTA.add(cb_Provincia);

        CLabel lbl_Distrito = new CLabel("Distrito");
        lbl_Distrito.setBounds(35, 325, 100, 20);
        pnl_PUNTO_VENTA.add(lbl_Distrito);

        cb_Distrito = new JComboBox();
        cb_Distrito.addActionListener(this);
        cb_Distrito.setBounds(130, 325, 180, 20);
        cb_Distrito.addKeyListener(this);
        cb_Distrito.setEnabled(false);
        pnl_PUNTO_VENTA.add(cb_Distrito);

        pnl_PUNTO_VENTA.setBounds(20, 20, 460, 400);
        pnl_dialog.add(pnl_PUNTO_VENTA);

        setTitleName("Punto Venta");
        setRegister(pnl_dialog);
        setSize(new Dimension(500, 510));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo() {
    }

    public void loadEmpresa() {
    }

    public void loadDepartamento() {
    }

    public void loadDistrito(String xcoddis) {
    }

    public void loadProvincia(String xcoddep) {
    }

    public void loadLocalidad(String xcodEmpres) {
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
        if (e.getSource() == txt_Descripcion) {
            txt_Descripcion.selectAll();
        }

        if (e.getSource() == txt_Direccion) {
            txt_Direccion.selectAll();
        }

        if (e.getSource() == txt_Telefono) {
            txt_Telefono.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cb_Empresa) {
                if (cb_CodLocalidad.isEnabled()) {
                    cb_CodLocalidad.requestFocus();
                } else {
                    txt_Descripcion.requestFocus();
                }
            }

            if (e.getSource() == cb_CodLocalidad) {
                txt_Descripcion.requestFocus();
            }

            if (e.getSource() == txt_Descripcion) {
                txt_Direccion.requestFocus();
            }

            if (e.getSource() == txt_Direccion) {
                txt_Telefono.requestFocus();
            }

            if (e.getSource() == txt_Telefono) {
                cb_Departamento.requestFocus();
            }

            if (e.getSource() == cb_Departamento) {
                if (cb_Provincia.isEnabled()) {
                    cb_Provincia.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cb_Provincia) {
                if (cb_Distrito.isEnabled()) {
                    cb_Distrito.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cb_Distrito) {
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

    public void cargarEmpresa(String codEmpresa) {
    }

    public void cargarLocalidad(String codLocalidad) {
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
        if (cb_Empresa == e.getSource()) {
            if (cb_Empresa.getItemCount() > 0) {
                if (cb_Empresa.getSelectedIndex() == 0) {
                    cb_CodLocalidad.removeAllItems();
                    cb_CodLocalidad.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cb_CodLocalidad.setEnabled(true);
                    }

                    loadLocalidad(xempresa.get(cb_Empresa.getSelectedIndex() - 1).getId_empresa());
                }
            }
        }

        if (cb_Departamento == e.getSource()) {
            if (cb_Departamento.getItemCount() > 0) {
                if (cb_Departamento.getSelectedIndex() == 0) {
                    cb_Distrito.removeAllItems();
                    cb_Provincia.removeAllItems();
                    cb_Provincia.setEnabled(false);
                    cb_Distrito.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cb_Provincia.setEnabled(true);
                    }

                    loadProvincia(xdepartamento.get(cb_Departamento.getSelectedIndex() - 1).getCodigo());
                }
            }
        }

        if (cb_Provincia == e.getSource()) {
            if (cb_Provincia.getItemCount() > 0) {
                if (cb_Provincia.getSelectedIndex() == 0) {
                    cb_Distrito.removeAllItems();
                    cb_Distrito.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cb_Distrito.setEnabled(true);
                    }

                    loadDistrito(xprovincia.get(cb_Provincia.getSelectedIndex() - 1).getCodigo());
                }
            }
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cb_Departamento.setEnabled(e);
        cb_Provincia.setEnabled(e);
        cb_Distrito.setEnabled(e);
        cb_Empresa.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
        txt_Direccion.setEditable(e);
        txt_Telefono.setEditable(e);
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    public void addRow(String[] reg) {
    }

    public void addRow(Object[] reg) {
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

    public boolean showConfirmDelete() {
        return false;
    }

    public void setParametersRegister(ArrayList data, String[] columnNames) {
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

    public void loadInicio() {
    }

    public void showSearchDialog() {
    }

    public void loadInicioUDD() {
    }

    public void loadInicioInsert() {
    }

    public void addRow(Object ob) {
    }

    public void addRow(Object ob, int index) {
    }

    public void addRow(Object ob, int index, int cantidad) {
    }

    public void addRow(Object ob, int index, int cantidad, double participacion) {
    }

    public void removeRow(Object ob, int opcion) {
    }

    public void addRow(Object ob, int cantidad, double participacion) {
    }

    public void addDataRow(Object ob, int cantidad, double participacion) {
    }

    public void updateRow(Object ob, int opcion) {
    }

    public void loadInicioUpdate() {
    }

    public void loadInicioBeforeDetail() {
    }

    public void loadInicioAfterDetail() {
    }

    public void loadInicioDelete() {
    }

    public void addRow(Object ob, Component comp) {
    }

    public void addRow(Object[] reg, int opcion) {
    }

    public ArrayList getDataTable() {
        return null;
    }

    public void addRow(Object reg[], String opcion) {
    }

    public void removeRow(Object reg[], String opcion) {
    }

    public void updateRow(Object reg[], String opcion) {
    }

    public void addRow(Object ob, String opcion) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    public void removeRow(Object ob, String opcion) {
    }

    public void updateRow(Object ob, String opcion) {
    }

    public void addRow(Object[] ob, Component comp, int modo) {
    }

    public void removeRow(Object ob, Component comp, int modo) {
    }

    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    public void prepareRegister() {
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }
}
