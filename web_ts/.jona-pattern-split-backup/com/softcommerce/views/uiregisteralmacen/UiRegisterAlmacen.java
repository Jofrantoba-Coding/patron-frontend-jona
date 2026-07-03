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

    private JTextField txtCodigo;
    private JTextField txtDescripcion;
    private JTextField txtDireccion;
    private JTextField txtCodEmpresa;
    private JComboBox cboDepartamento;
    private List<Ubigeo> xdepartamento;
    private JComboBox cboProvincia;
    private List<Ubigeo> xprovincia;
    private JComboBox cboDistrito;
    private List<Ubigeo> xdistrito;
    private CComboBox cboCodLocalidad;
    private List<Localidad> xlocalidad;
    private final Usuario usuario;
    private CComboBox cboPuntoVenta;
    private List<PuntoVenta> xpuntoventa;
    private JCheckBox chkDireccionamiento;
    private JCheckBox chkDespacho;
    private JCheckBox chkVenta;

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

    private void inicialize() {
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
        loadDepartamento();
        loadLocalidad(usuario.getCodempresa());
    }

    public void loadDepartamento() {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);
            if (xdepartamento != null) {
                xdepartamento.clear();
            } else {
                xdepartamento = new ArrayList();
            }
            xdepartamento.addAll(regla_Ubigeo.listarGeneral());
            cboDepartamento.removeAllItems();
            cboDepartamento.addItem("--- Seleccione un Departamento ---");
            for (int i = 0; i < xdepartamento.size(); i++) {
                cboDepartamento.addItem(xdepartamento.get(i).getDescripcion());
            }
            cboDepartamento.setSelectedIndex(0);
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
                xlocalidad = new ArrayList();
            }

            xlocalidad.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cboCodLocalidad.removeAllItems();
            cboCodLocalidad.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < xlocalidad.size(); i++) {
                cboCodLocalidad.addItem(xlocalidad.get(i).getDescripcion());
            }

            cboCodLocalidad.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xpuntoventa != null) {
                xpuntoventa.clear();
            } else {
                xpuntoventa = new ArrayList();
            }

            xpuntoventa.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cboPuntoVenta.removeAllItems();
            cboPuntoVenta.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xpuntoventa.size(); i++) {
                cboPuntoVenta.addItem(xpuntoventa.get(i).getDescripcion_puntoventa());
            }

            cboPuntoVenta.setSelectedIndex(0);
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
                xdistrito = new ArrayList();
            }

            xdistrito.addAll(regla_Ubigeo.listar(xcoddis, ""));

            cboDistrito.removeAllItems();
            cboDistrito.addItem("--- Seleccione una Distrito ---");

            for (int i = 0; i < xdistrito.size(); i++) {
                cboDistrito.addItem(xdistrito.get(i).getDescripcion());
            }

            cboDistrito.setSelectedIndex(0);
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
                xprovincia = new ArrayList();
            }
            xprovincia.addAll(regla_Ubigeo.listar(xcoddep, ""));

            cboProvincia.removeAllItems();
            cboProvincia.addItem("--- Seleccione una Provincia ---");

            for (int i = 0; i < xprovincia.size(); i++) {
                cboProvincia.addItem(xprovincia.get(i).getDescripcion());
            }

            cboProvincia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());
        txtDireccion.setBorder(txt.getBorder());
        cboDepartamento.setBorder(txt.getBorder());
        cboDistrito.setBorder(txt.getBorder());
        cboPuntoVenta.setBorder(txt.getBorder());
        cboCodLocalidad.setBorder(txt.getBorder());
        cboProvincia.setBorder(txt.getBorder());

        txtCodEmpresa.setText(usuario.getCodempresa());
        txtCodigo.setText("");
        txtDescripcion.setText("");
        txtDireccion.setText("");
        cboCodLocalidad.setSelectedIndex(0);
        cboDepartamento.setSelectedIndex(0);

        cboCodLocalidad.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            RnAlmacen regla = new RnAlmacen(path);
            return regla.insertar(txtCodEmpresa.getText().trim(), txtDescripcion.getText().trim(), txtDireccion.getText().trim(), (cboDistrito.getSelectedIndex() > 0) ? xdistrito.get(cboDistrito.getSelectedIndex() - 1).getCodigo() : "", usuario.getId_usuario(), (cboPuntoVenta.getSelectedIndex() > 0) ? xpuntoventa.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta() : "", chkDireccionamiento.isSelected(), xlocalidad.get(cboCodLocalidad.getSelectedIndex() - 1).getId_localidad(),
                    chkDespacho.isSelected() ? "S" : "N", chkVenta.isSelected() ? "S" : "N");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
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
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());
        txtDireccion.setBorder(txt.getBorder());
        cboDepartamento.setBorder(txt.getBorder());
        cboCodLocalidad.setBorder(txt.getBorder());
        cboPuntoVenta.setBorder(txt.getBorder());
        cboDistrito.setBorder(txt.getBorder());
        cboProvincia.setBorder(txt.getBorder());

        if (cboCodLocalidad.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Almacen, debes " + "especificar su Localidad.", "Datos incompletos de Almacen", JOptionPane.CANCEL_OPTION);
            cboCodLocalidad.setBorder(new LineBorder(Color.RED));
            cboCodLocalidad.requestFocus();
            return false;
        }

        if (cboPuntoVenta.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Almacen, debes " + "especificar su Punto de Venta.", "Datos incompletos de Almacen", JOptionPane.CANCEL_OPTION);
            cboPuntoVenta.setBorder(new LineBorder(Color.RED));
            cboPuntoVenta.requestFocus();
            return false;
        }

        if (txtDescripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Almacen, debes " + "especificar su Descripción.", "Datos incompletos de Almacen", JOptionPane.CANCEL_OPTION);
            txtDescripcion.setBorder(new LineBorder(Color.RED));
            txtDescripcion.requestFocus();

            return false;
        }

        if (txtDireccion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Almacen, debes " + "especificar su Dirección.", "Datos incompletos de Almacen", JOptionPane.CANCEL_OPTION);
            txtDireccion.setBorder(new LineBorder(Color.RED));
            txtDireccion.requestFocus();
            return false;
        }

        if (cboDepartamento.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Almacen, debes " + "especificar su Departamento.", "Datos incompletos de Almacen", JOptionPane.CANCEL_OPTION);
            cboDepartamento.setBorder(new LineBorder(Color.RED));
            cboDepartamento.requestFocus();
            return false;
        }

        if (cboProvincia.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Almacen, debes " + "especificar su Provincia.", "Datos incompletos de Almacen", JOptionPane.CANCEL_OPTION);
            cboProvincia.setBorder(new LineBorder(Color.RED));
            cboProvincia.requestFocus();

            return false;
        }

        if (cboDistrito.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Almacen, debes " + "especificar su Distrito.", "Datos incompletos de Almacen", JOptionPane.CANCEL_OPTION);
            cboDistrito.setBorder(new LineBorder(Color.RED));
            cboDistrito.requestFocus();

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            RnAlmacen regla = new RnAlmacen(path);
            List<Almacen> reg = regla.listar(rowSelection.getSelectedValue(1).toString(), "", "");
            if (reg.isEmpty()) {
                return false;
            } else {
                Almacen almacen = reg.get(0);
                txtCodigo.setText(mode == CLONE ? "" : almacen.getIdAlmacen());
                txtCodEmpresa.setText(almacen.getIdEmpresa());
                cargarLocalidad(almacen.getIdLocalidad().trim());
                cargarPuntoVenta(almacen.getIdPuntoVenta());
                txtDescripcion.setText(almacen.getDescripcion());
                txtDireccion.setText(almacen.getDireccion());
                cboDepartamento.setSelectedItem(almacen.getDepartamento());
                cboProvincia.setSelectedItem(almacen.getProvincia());
                cboDistrito.setSelectedItem(almacen.getDistrito());
                chkDireccionamiento.setSelected(almacen.isIsDireccionamiento());
                chkDespacho.setSelected(almacen.getFlagDespacho().equals("S"));
                chkVenta.setSelected(almacen.getFlagVenta().equals("S"));
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void cargarLocalidad(String codLocalidad) {
        if (xlocalidad != null && !codLocalidad.equals("")) {
            for (int i = 0; i < xlocalidad.size(); i++) {
                if (xlocalidad.get(i).getId_localidad().trim().equals(codLocalidad)) {
                    cboCodLocalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
        if (xpuntoventa != null && !codPuntoVenta.equals("")) {
            for (int i = 0; i < xpuntoventa.size(); i++) {
                if (xpuntoventa.get(i).getId_punto_venta().equals(codPuntoVenta)) {
                    cboPuntoVenta.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnAlmacen regla = new RnAlmacen(path);
            return regla.modificar(txtCodigo.getText().trim(), txtCodEmpresa.getText().trim(), txtDescripcion.getText().trim(), txtDireccion.getText().trim(), (cboDistrito.getSelectedIndex() > 0) ? xdistrito.get(cboDistrito.getSelectedIndex() - 1).getCodigo() : "", usuario.getId_usuario(), (cboPuntoVenta.getSelectedIndex() > 0) ? xpuntoventa.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta() : "", chkDireccionamiento.isSelected(),
                    chkDespacho.isSelected() ? "S" : "N", chkVenta.isSelected() ? "S" : "N");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnAlmacen regla = new RnAlmacen(path);
            return regla.eliminar(txtCodigo.getText().trim(), usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
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
        return true;
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }
}
