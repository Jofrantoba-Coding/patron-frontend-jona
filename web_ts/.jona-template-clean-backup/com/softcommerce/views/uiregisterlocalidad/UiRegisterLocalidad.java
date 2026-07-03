package com.softcommerce.views.uiregisterlocalidad;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Empresa;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
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
import com.softcommerce.reglasnegocio.RnUbigeo;

public class UiRegisterLocalidad extends JHDialog implements InterUiRegisterLocalidad, ActionListener, ItemListener, KeyListener, FocusListener {

    protected JTextField txt_Codigo;
    protected JTextField txt_Descripcion;
    protected JTextField txt_Direccion;
    protected JTextField txt_CodEmpresa;
    protected JComboBox cb_Departamento;
    protected List<Ubigeo> xdepartamento;
    protected JComboBox cb_Provincia;
    protected List<Ubigeo> xprovincia;
    protected JComboBox cb_Distrito;
    protected List<Ubigeo> xdistrito;
    protected Usuario usuario;
    protected JComboBox cb_Empresa;
    protected List<Empresa> xempresa;

    public UiRegisterLocalidad(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterLocalidad(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Localidad", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);

        JPanel pnlAlmacen = new JPanel();
        pnlAlmacen.setBorder(border);
        pnlAlmacen.setLayout(null);
        pnlAlmacen.setBackground(new Color(245, 245, 245));

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 100, 20);
        pnlAlmacen.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setBounds(130, 45, 100, 20);
        pnlAlmacen.add(txt_Codigo);

        CLabel lbl_Empresa = new CLabel("Empresa");
        lbl_Empresa.setBounds(35, 80, 100, 20);
        pnlAlmacen.add(lbl_Empresa);

        cb_Empresa = new JComboBox();
        cb_Empresa.addKeyListener(this);
        cb_Empresa.setBounds(130, 80, 210, 20);
        pnlAlmacen.add(cb_Empresa);

        txt_CodEmpresa = new JTextField();
        txt_CodEmpresa.setBounds(0, 0, 0, 0);
        txt_CodEmpresa.setVisible(false);
        pnlAlmacen.add(txt_CodEmpresa);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 115, 100, 20);
        pnlAlmacen.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(130, 115, 200, 20);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        pnlAlmacen.add(txt_Descripcion);

        CLabel lbl_Direccion = new CLabel("Dirección");
        lbl_Direccion.setBounds(35, 150, 100, 20);
        pnlAlmacen.add(lbl_Direccion);

        txt_Direccion = new JTextField();
        txt_Direccion.addFocusListener(this);
        txt_Direccion.setBounds(130, 150, 250, 20);
        txt_Direccion.setDocument(new UpperCaseNumberDocument(100));
        txt_Direccion.addKeyListener(this);
        pnlAlmacen.add(txt_Direccion);

        CLabel lbl_Departamento = new CLabel("Departamento");
        lbl_Departamento.setBounds(35, 185, 100, 20);
        pnlAlmacen.add(lbl_Departamento);

        cb_Departamento = new JComboBox();
        cb_Departamento.addActionListener(this);
        cb_Departamento.addKeyListener(this);
        cb_Departamento.setBounds(130, 185, 200, 20);
        pnlAlmacen.add(cb_Departamento);

        CLabel lbl_Provincia = new CLabel("Provincia");
        lbl_Provincia.setBounds(35, 220, 100, 20);
        pnlAlmacen.add(lbl_Provincia);

        cb_Provincia = new JComboBox();
        cb_Provincia.addActionListener(this);
        cb_Provincia.setBounds(130, 220, 180, 20);
        cb_Provincia.addKeyListener(this);
        cb_Provincia.setEnabled(false);
        pnlAlmacen.add(cb_Provincia);

        CLabel lbl_Distrito = new CLabel("Distrito");
        lbl_Distrito.setBounds(35, 255, 100, 20);
        pnlAlmacen.add(lbl_Distrito);

        cb_Distrito = new JComboBox();
        cb_Distrito.addActionListener(this);
        cb_Distrito.setBounds(130, 255, 180, 20);
        cb_Distrito.addKeyListener(this);
        cb_Distrito.setEnabled(false);
        pnlAlmacen.add(cb_Distrito);

        pnlAlmacen.setBounds(20, 20, 460, 320);
        pnl_dialog.add(pnlAlmacen);

        setTitleName("Localidad");
        setRegister(pnl_dialog);
        setSize(new Dimension(500, 430));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo() {
    }

    public void loadEmpresa() throws Exception {
    }

    public void loadDepartamento() throws Exception {
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
        if (e.getSource() == txt_Descripcion) {
            txt_Descripcion.selectAll();
        }

        if (e.getSource() == txt_Direccion) {
            txt_Direccion.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cb_Empresa) {
                txt_Descripcion.requestFocus();
            }

            if (e.getSource() == txt_Descripcion) {
                txt_Direccion.requestFocus();
            }

            if (e.getSource() == txt_Direccion) {
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
        cb_Empresa.setEnabled(e);
        cb_Distrito.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
        txt_Direccion.setEditable(e);
    }

    public void prepareRegister() {
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

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    public void addRow(Object[] reg, int opcion) {
    }

    @Override
    public void showMessagePrint(String codigo) {
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

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }
}
