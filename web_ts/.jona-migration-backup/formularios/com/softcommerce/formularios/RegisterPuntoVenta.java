package com.softcommerce.formularios;

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

public class RegisterPuntoVenta extends JHDialog implements ActionListener, ItemListener, KeyListener, FocusListener, Register {

    private JTextField txt_Codigo;
    private CComboBox cb_CodLocalidad;
    private JTextField txt_Telefono;
    private JTextField txt_Descripcion;
    private JTextField txt_Direccion;
    private JTextField txt_estado;
    private JComboBox cb_Departamento;
    private JComboBox cb_Provincia;
    private JComboBox cb_Distrito;
    private List<Ubigeo> xdepartamento;
    private List<Ubigeo> xdistrito;
    private List<Ubigeo> xprovincia;
    private List<Localidad> xlocalidad;
    private JComboBox cb_Empresa;
    private List<Empresa> xempresa;
    private Usuario usuario;

    public RegisterPuntoVenta(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public RegisterPuntoVenta(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
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
        loadEmpresa();
        loadDepartamento();
    }

    public void loadEmpresa() {
        try {
            RnEmpresa regla_Empresa = new RnEmpresa(path);
            if (xempresa != null) {
                xempresa.clear();
            } else {
                xempresa = new ArrayList<Empresa>();
            }
            xempresa.addAll(regla_Empresa.listarEmpresa(""));
            cb_Empresa.removeAllItems();
            cb_Empresa.addItem("--- Seleccione una Empresa ---");

            for (int i = 0; i < xempresa.size(); i++) {
                cb_Empresa.addItem(xempresa.get(i).getNombre());
            }
            cb_Empresa.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadDepartamento() {
        try {

            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xdepartamento != null) {
                xdepartamento.clear();
            } else {
                xdepartamento = new ArrayList<Ubigeo>();
            }

            xdepartamento.addAll(regla_Ubigeo.listarGeneral());

            cb_Departamento.removeAllItems();
            cb_Departamento.addItem("--- Seleccione un Departamento ---");

            for (int i = 0; i < xdepartamento.size(); i++) {
                cb_Departamento.addItem(xdepartamento.get(i).getDescripcion());
            }

            cb_Departamento.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadDistrito(String xcoddis) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xdistrito != null) {
                xdistrito.clear();
            } else {
                xdistrito = new ArrayList<Ubigeo>();
            }

            xdistrito.addAll(regla_Ubigeo.listar(xcoddis, ""));

            cb_Distrito.removeAllItems();
            cb_Distrito.addItem("--- Seleccione una Distrito ---");

            for (int i = 0; i < xdistrito.size(); i++) {
                cb_Distrito.addItem(xdistrito.get(i).getDescripcion());
            }

            cb_Distrito.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadProvincia(String xcoddep) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xprovincia != null) {
                xprovincia.clear();
            } else {
                xprovincia = new ArrayList<Ubigeo>();
            }

            xprovincia.addAll(regla_Ubigeo.listar(xcoddep, ""));

            cb_Provincia.removeAllItems();
            cb_Provincia.addItem("--- Seleccione una Provincia ---");

            for (int i = 0; i < xprovincia.size(); i++) {
                cb_Provincia.addItem(xprovincia.get(i).getDescripcion());
            }

            cb_Provincia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (xlocalidad != null) {
                xlocalidad.clear();
            } else {
                xlocalidad = new ArrayList<Localidad>();
            }

            xlocalidad.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cb_CodLocalidad.removeAllItems();
            cb_CodLocalidad.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < xlocalidad.size(); i++) {
                cb_CodLocalidad.addItem(xlocalidad.get(i).getDescripcion());
            }

            cb_CodLocalidad.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Direccion.setBorder(txt.getBorder());
        cb_Departamento.setBorder(txt.getBorder());
        cb_Distrito.setBorder(txt.getBorder());
        txt_Telefono.setBorder(txt.getBorder());
        cb_CodLocalidad.setBorder(txt.getBorder());
        cb_Provincia.setBorder(txt.getBorder());
        cb_Empresa.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_estado.setText("");
        txt_Descripcion.setText("");
        txt_Direccion.setText("");
        txt_Telefono.setText("");
        txt_estado.setText("A");
        cb_Empresa.setSelectedIndex(0);
        cb_Departamento.setSelectedIndex(0);

        cb_Empresa.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            RnPuntoVenta regla = new RnPuntoVenta(path);
            return regla.insertar(
                    xlocalidad.get(cb_CodLocalidad.getSelectedIndex() - 1).getId_localidad(), txt_Descripcion.getText().trim(), txt_Direccion.getText().trim(), xdistrito.get(cb_Distrito.getSelectedIndex() - 1).getCodigo(), txt_Telefono.getText().trim(), txt_estado.getText().trim(), usuario.getId_usuario(), "");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
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
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Direccion.setBorder(txt.getBorder());
        cb_Departamento.setBorder(txt.getBorder());
        cb_Distrito.setBorder(txt.getBorder());
        txt_Telefono.setBorder(txt.getBorder());
        cb_CodLocalidad.setBorder(txt.getBorder());
        cb_Provincia.setBorder(txt.getBorder());
        cb_Empresa.setBorder(txt.getBorder());

        if (cb_Empresa.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Localidad, debes " + "especificar su Empresa.", "Datos incompletos de Localidad", JOptionPane.CANCEL_OPTION);
            cb_Empresa.setBorder(new LineBorder(Color.RED));
            cb_Empresa.requestFocus();

            return false;
        }

        if (cb_CodLocalidad.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Punto de Venta, debes " + "especificar su Localidad.", "Datos incompletos de Punto de Venta", JOptionPane.CANCEL_OPTION);
            cb_CodLocalidad.setBorder(new LineBorder(Color.RED));
            cb_CodLocalidad.requestFocus();
            return false;
        }

        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Punto de Venta, debes " + "especificar su Descripción.", "Datos incompletos de Punto de Venta", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }

        if (txt_Direccion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Punto de Venta, debes " + "especificar su Dirección.", "Datos incompletos de Punto de Venta", JOptionPane.CANCEL_OPTION);
            txt_Direccion.setBorder(new LineBorder(Color.RED));
            txt_Direccion.requestFocus();
            return false;
        }

        if (txt_Telefono.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Punto de Venta, debes " + "especificar su Telefono.", "Datos incompletos de Punto de Venta", JOptionPane.CANCEL_OPTION);
            txt_Telefono.setBorder(new LineBorder(Color.RED));
            txt_Telefono.requestFocus();
            return false;
        }

        if (cb_Departamento.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Punto de Venta, debes " + "especificar su Departamento.", "Datos incompletos de Punto de Venta", JOptionPane.CANCEL_OPTION);
            cb_Departamento.setBorder(new LineBorder(Color.RED));
            cb_Departamento.requestFocus();
            return false;
        }

        if (cb_Provincia.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Punto de Venta, debes " + "especificar su Provincia.", "Datos incompletos de Punto de Venta", JOptionPane.CANCEL_OPTION);
            cb_Provincia.setBorder(new LineBorder(Color.RED));
            cb_Provincia.requestFocus();
            return false;
        }

        if (cb_Distrito.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Punto de Venta, debes " + "especificar su Distrito.", "Datos incompletos de Punto de Venta", JOptionPane.CANCEL_OPTION);
            cb_Distrito.setBorder(new LineBorder(Color.RED));
            cb_Distrito.requestFocus();

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            RnPuntoVenta regla = new RnPuntoVenta(path);
            List<PuntoVenta> reg = regla.listar("", rowSelection.getSelectedValue(1).toString(), "", "", "", "", "", "");
            if (reg.isEmpty()) {
                return false;
            } else {
                PuntoVenta puntoventa = reg.get(0);

                txt_Codigo.setText(mode == CLONE ? "" : puntoventa.getId_punto_venta());
                txt_estado.setText(puntoventa.getEstado());
                cargarEmpresa(puntoventa.getId_empresa());
                cargarLocalidad(puntoventa.getId_localidad());
                txt_Descripcion.setText(puntoventa.getDescripcion_puntoventa());
                txt_Direccion.setText(puntoventa.getDireccion_puntoventa());
                txt_Telefono.setText(puntoventa.getTelefono());
                cb_Departamento.setSelectedItem(puntoventa.getDepartamento());
                cb_Provincia.setSelectedItem(puntoventa.getProvincia());
                cb_Distrito.setSelectedItem(puntoventa.getDistrito());
            }
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void cargarEmpresa(String codEmpresa) {
        if (xempresa != null && !codEmpresa.equals("")) {
            for (int i = 0; i < xempresa.size(); i++) {
                if (xempresa.get(i).getId_empresa().equals(codEmpresa)) {
                    cb_Empresa.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarLocalidad(String codLocalidad) {
        if (xlocalidad != null && !codLocalidad.equals("")) {
            for (int i = 0; i < xlocalidad.size(); i++) {
                if (xlocalidad.get(i).getId_localidad().equals(codLocalidad)) {
                    cb_CodLocalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnPuntoVenta regla = new RnPuntoVenta(path);
            return regla.modificar(
                    txt_Codigo.getText().trim(), xlocalidad.get(cb_CodLocalidad.getSelectedIndex() - 1).getId_localidad(), txt_Descripcion.getText().trim(), txt_Direccion.getText().trim(), xdistrito.get(cb_Distrito.getSelectedIndex() - 1).getCodigo(), txt_Telefono.getText().trim(), txt_estado.getText().trim(), usuario.getId_usuario(), "");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnPuntoVenta regla = new RnPuntoVenta(path);
            return regla.eliminar(txt_Codigo.getText().trim(), usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
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

    public boolean showConfirmDelete() {
        return true;
    }

    public void setParametersRegister(ArrayList data, String[] columnNames) {
    }

    @Override
    public boolean executeSelect() {
        return true;
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
        return true;
    }

    public void prepareRegister() {
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }
}
