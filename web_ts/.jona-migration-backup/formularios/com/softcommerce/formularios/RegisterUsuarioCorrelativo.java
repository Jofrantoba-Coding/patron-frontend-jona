/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

/**
 *
 * @author Ibrahim
 */
import com.softcommerce.beans.Correlativo;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.general.controles.CComboBox;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
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
import com.softcommerce.iconos.Gif;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JTextField;
import javax.swing.JOptionPane;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnUsuario;
import javax.swing.JCheckBox;

public class RegisterUsuarioCorrelativo extends JHDialog implements ActionListener, ItemListener, KeyListener, FocusListener {

    private static final long serialVersionUID = 1L;
    private JComboBox cbo_idlocalidad;
    private JComboBox cbo_idpuntoventa;
    private JComboBox cbo_serie;
    private JCheckBox chkHabilitar;
    private JComboBox cbo_idtipodocumento;
    private JTextField txt_Codigo;
    private CComboBox cbo_idusuario;
    private List<Usuario> xUsuario;
    private List<Correlativo> x_serie;
    private List<PuntoVenta> xpuntoventa;
    private Usuario usuario;
    private List<Localidad> xlocali;
    private List<BeanTipoDocVenta> x_idtipodocumento;
    private String id_correlativo;
    private String id_usuario;

    public RegisterUsuarioCorrelativo(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public RegisterUsuarioCorrelativo(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        Gif gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Correlativo para Usuario", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 11), Color.BLACK);

        JPanel pnl_UsuarioCorrelativo = new JPanel();
        pnl_UsuarioCorrelativo.setLayout(null);
        pnl_UsuarioCorrelativo.setBackground(new Color(245, 245, 245));
        pnl_UsuarioCorrelativo.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(30, 35, 80, 20);
        pnl_UsuarioCorrelativo.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setBounds(110, 35, 80, 20);
        txt_Codigo.setEditable(false);
        txt_Codigo.addKeyListener(this);
        pnl_UsuarioCorrelativo.add(txt_Codigo);

        CLabel lbl_usuario = new CLabel("Usuario:");
        lbl_usuario.setBounds(30, 70, 80, 20);
        pnl_UsuarioCorrelativo.add(lbl_usuario);

        cbo_idusuario = new CComboBox();
        cbo_idusuario.setBounds(110, 70, 180, 20);
        cbo_idusuario.addKeyListener(this);
        pnl_UsuarioCorrelativo.add(cbo_idusuario);

        CLabel lbl_Localidad = new CLabel("Localidad");
        lbl_Localidad.setBounds(30, 105, 50, 20);
        pnl_UsuarioCorrelativo.add(lbl_Localidad);

        cbo_idlocalidad = new JComboBox();
        cbo_idlocalidad.setBounds(110, 105, 205, 20);
        cbo_idlocalidad.addActionListener(this);
        cbo_idlocalidad.addKeyListener(this);
        pnl_UsuarioCorrelativo.add(cbo_idlocalidad);

        CLabel lbl_LocalDespacho = new CLabel("P Venta");
        lbl_LocalDespacho.setBounds(30, 140, 80, 20);
        pnl_UsuarioCorrelativo.add(lbl_LocalDespacho);

        cbo_idpuntoventa = new JComboBox();
        cbo_idpuntoventa.setBounds(110, 140, 205, 20);
        cbo_idpuntoventa.addActionListener(this);
        cbo_idpuntoventa.setEnabled(false);
        cbo_idpuntoventa.addKeyListener(this);
        pnl_UsuarioCorrelativo.add(cbo_idpuntoventa);

        CLabel lbl_TipoDocumento = new CLabel("T Documento");
        lbl_TipoDocumento.setBounds(30, 175, 90, 20);
        pnl_UsuarioCorrelativo.add(lbl_TipoDocumento);

        cbo_idtipodocumento = new CComboBox();
        cbo_idtipodocumento.setBounds(110, 175, 225, 20);
        cbo_idtipodocumento.addKeyListener(this);
        cbo_idtipodocumento.addActionListener(this);
        pnl_UsuarioCorrelativo.add(cbo_idtipodocumento);

        CLabel lbl_serie = new CLabel("Serie");
        lbl_serie.setBounds(30, 210, 90, 20);
        pnl_UsuarioCorrelativo.add(lbl_serie);

        cbo_serie = new CComboBox();
        cbo_serie.setBounds(110, 210, 205, 20);
        cbo_serie.addKeyListener(this);
        cbo_serie.addActionListener(this);
        pnl_UsuarioCorrelativo.add(cbo_serie);
        //habiliatr correlativo
        CLabel lblHabilitar = new CLabel("Habilitar");
        lblHabilitar.setBounds(30, 245, 90, 20);
        pnl_UsuarioCorrelativo.add(lblHabilitar);

        chkHabilitar = new JCheckBox();
        chkHabilitar.setBounds(110, 245, 205, 20);
        chkHabilitar.addKeyListener(this);
        chkHabilitar.addActionListener(this);
        chkHabilitar.setSelected(true);
        pnl_UsuarioCorrelativo.add(chkHabilitar);

        pnl_UsuarioCorrelativo.setBounds(20, 20, 360, 290);
        pnl_dialog.add(pnl_UsuarioCorrelativo);

        setTitleName("Correlativo de Usuario");
        setRegister(pnl_dialog);
        setSize(new Dimension(400, 415));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo() {
        loadUsuario();
        loadLocalidad(usuario.getCodempresa());
    }

    public void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (xlocali != null) {
                xlocali.clear();
            } else {
                xlocali = new ArrayList<Localidad>();
            }

            xlocali.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cbo_idlocalidad.removeAllItems();
            cbo_idlocalidad.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < xlocali.size(); i++) {
                cbo_idlocalidad.addItem(xlocali.get(i).getDescripcion());
            }

            cbo_idlocalidad.setSelectedIndex(0);
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
                xpuntoventa = new ArrayList<PuntoVenta>();
            }

            xpuntoventa.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cbo_idpuntoventa.removeAllItems();
            cbo_idpuntoventa.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xpuntoventa.size(); i++) {
                cbo_idpuntoventa.addItem(xpuntoventa.get(i).getDescripcion_puntoventa());
            }

            cbo_idpuntoventa.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadTipoDoc(String xcodpuntoventa) {
        try {
            RnCorrelativo regla_Correlativo = new RnCorrelativo(path);

            if (x_idtipodocumento != null) {
                x_idtipodocumento.clear();
            } else {
                x_idtipodocumento = new ArrayList<BeanTipoDocVenta>();
            }

            x_idtipodocumento.addAll(regla_Correlativo.listar(xcodpuntoventa));

            cbo_idtipodocumento.removeAllItems();
            cbo_idtipodocumento.addItem("--- Seleccione ---");

            for (int i = 0; i < x_idtipodocumento.size(); i++) {
                cbo_idtipodocumento.addItem(x_idtipodocumento.get(i).getDescripcion());
            }

            cbo_idtipodocumento.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadCorrelativo(String id_puntoventa, String id_tipodoc) {
        try {
            RnCorrelativo regla_Correlativo = new RnCorrelativo(path);
            if (x_serie != null) {
                x_serie.clear();
            } else {
                x_serie = new ArrayList<Correlativo>();
            }
            x_serie.addAll(regla_Correlativo.listar(id_puntoventa, id_tipodoc, "A"));
            cbo_serie.removeAllItems();
            cbo_serie.addItem("--- Seleccione Serie ---");

            for (int i = 0; i < x_serie.size(); i++) {
                cbo_serie.addItem(x_serie.get(i).getSerie());
            }

            cbo_serie.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadUsuario() {
        try {
            RnUsuario regla_Usuario = new RnUsuario(path);

            if (xUsuario != null) {
                xUsuario.clear();
            } else {
                xUsuario = new ArrayList<Usuario>();
            }

            xUsuario.addAll(regla_Usuario.listarGeneral());

            cbo_idusuario.removeAllItems();
            cbo_idusuario.addItem("--- Seleccione un Usuario---");

            for (int i = 0; i < xUsuario.size(); i++) {
                cbo_idusuario.addItem(xUsuario.get(i).getNombre());
            }

            cbo_idusuario.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        cbo_idusuario.setBorder(txt.getBorder());
        cbo_idlocalidad.setBorder(txt.getBorder());
        cbo_idpuntoventa.setBorder(txt.getBorder());
        cbo_idtipodocumento.setBorder(txt.getBorder());
        cbo_serie.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        cbo_idusuario.setSelectedIndex(0);
        cbo_idlocalidad.setSelectedIndex(0);
        cbo_idusuario.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            RnCorrelativo regla_UsuarioCorrelativo = new RnCorrelativo(path);
            return regla_UsuarioCorrelativo.insertar(
                    cbo_idusuario.getSelectedIndex() > 0 ? xUsuario.get(cbo_idusuario.getSelectedIndex() - 1).getId_usuario() : "", cbo_serie.getSelectedIndex() > 0 ? x_serie.get(cbo_serie.getSelectedIndex() - 1).getIdCorrelativo() : "", "", usuario.getCodempresa(), usuario.getId_usuario(),
                    (chkHabilitar.isSelected() ? "S" : "N"));
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cbo_idusuario) {
                cbo_idlocalidad.requestFocus();
            }

            if (e.getSource() == cbo_idlocalidad) {
                if (cbo_idpuntoventa.isEnabled()) {
                    cbo_idpuntoventa.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cbo_idpuntoventa) {
                if (cbo_idtipodocumento.isEnabled()) {
                    cbo_idtipodocumento.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cbo_idtipodocumento) {
                if (cbo_serie.isEnabled()) {
                    cbo_serie.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cbo_serie) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        try {
            JTextField txt = new JTextField();
            cbo_idusuario.setBorder(txt.getBorder());
            cbo_idlocalidad.setBorder(txt.getBorder());
            cbo_idpuntoventa.setBorder(txt.getBorder());
            cbo_idtipodocumento.setBorder(txt.getBorder());
            cbo_serie.setBorder(txt.getBorder());

            if (cbo_idusuario.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " una Asignasion de Usuario - Correlativo, debes " + "especificar el Usuario.", "Datos incompletos de Asignacion Usuario - Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_idusuario.setBorder(new LineBorder(Color.RED));
                cbo_idusuario.requestFocus();

                return false;
            }

            if (cbo_idlocalidad.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " una Asignasion de Usuario - Correlativo, debes " + "especificar la Localidad.", "Datos incompletos de Asignacion Usuario - Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_idlocalidad.setBorder(new LineBorder(Color.RED));
                cbo_idlocalidad.requestFocus();

                return false;
            }

            if (cbo_idpuntoventa.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " una Asignasion de Usuario - Correlativo, debes " + "especificar el Punto de Venta.", "Datos incompletos de Asignacion Usuario - Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_idpuntoventa.setBorder(new LineBorder(Color.RED));
                cbo_idpuntoventa.requestFocus();

                return false;
            }

            if (cbo_idtipodocumento.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " una Asignasion de Usuario - Correlativo, debes " + "especificar el Tipo de documento.", "Datos incompletos de Asignacion Usuario - Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_idtipodocumento.setBorder(new LineBorder(Color.RED));
                cbo_idtipodocumento.requestFocus();

                return false;
            }

            if (cbo_serie.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " una Asignasion de Usuario - Correlativo, debes " + "especificar su serie.", "Datos incompletos de Asignacion Usuario - Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_serie.setBorder(new LineBorder(Color.RED));
                cbo_serie.requestFocus();

                return false;
            }

            RnCorrelativo reg = new RnCorrelativo(path);
            boolean flag = reg.getExisteUsuarioCorrelativo(xUsuario.get(cbo_idusuario.getSelectedIndex() - 1).getId_usuario(), x_serie.get(cbo_serie.getSelectedIndex() - 1).getIdCorrelativo()).equals("S");

            if (((mode == INSERT) && flag)
                    || ((mode == UPDATE) && flag && !(xUsuario.get(cbo_idusuario.getSelectedIndex() - 1).getId_usuario().equals(id_usuario) && x_serie.get(cbo_serie.getSelectedIndex() - 1).getIdCorrelativo().equals(id_correlativo)))) {
                JOptionPane.showMessageDialog(this, "Ya existe una asignacion del documento con la serie elegida al mismo usuario, por favor elija otra serie u otro usuario disponible.", "Datos incompletos de Asignacion Usuario - Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_serie.setBorder(new LineBorder(Color.RED));
                cbo_serie.requestFocus();

                return false;
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public boolean loadRegister() {
        try {
            RnCorrelativo regla = new RnCorrelativo(path);

            List<UsuarioCorrelativo> reg = regla.listarUsuarioCorrelativo(rowSelection.getSelectedValue(1).toString(), "", "", "", "", "", "", "");

            if (reg.isEmpty()) {
                return false;
            } else {
                UsuarioCorrelativo co = reg.get(0);

                id_usuario = co.getIdUsuario();
                id_correlativo = co.getIdCorrelativo();
                txt_Codigo.setText(mode == CLONE ? "" : co.getIdUsuarioCorrelativo());
                cargarUsuario(co.getIdUsuario());
                cargarLocalidad(co.getIdLocalidad());
                cargarPuntoVenta(co.getIdPuntoVenta());
                cargarTipoDocumento(co.getIdTipoDoc());
                cargarSerie(co.getSerie());
                chkHabilitar.setSelected((co.getHabilitar().equals("S") ? true : false));
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void cargarUsuario(String xCodUsuario) {
        if (xUsuario != null && !xCodUsuario.equals("")) {
            for (int i = 0; i < xUsuario.size(); i++) {
                if (xUsuario.get(i).getId_usuario().equals(xCodUsuario)) {
                    cbo_idusuario.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarLocalidad(String codLocalidad) {
        if (xlocali != null && !codLocalidad.equals("")) {
            for (int i = 0; i < xlocali.size(); i++) {
                if (xlocali.get(i).getId_localidad().equals(codLocalidad)) {
                    cbo_idlocalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
        if (xpuntoventa != null && !codPuntoVenta.equals("")) {
            for (int i = 0; i < xpuntoventa.size(); i++) {
                if (xpuntoventa.get(i).getId_punto_venta().equals(codPuntoVenta)) {
                    cbo_idpuntoventa.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarTipoDocumento(String tipoDocumento) {
        if (x_idtipodocumento != null && !tipoDocumento.equals("")) {
            for (int i = 0; i < x_idtipodocumento.size(); i++) {
                if (x_idtipodocumento.get(i).getIdTipoDoc().equals(tipoDocumento)) {
                    cbo_idtipodocumento.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarSerie(String serie) {
        if (x_serie != null && !serie.equals("")) {
            for (int i = 0; i < x_serie.size(); i++) {
                if (x_serie.get(i).getSerie().equals(serie)) {
                    cbo_serie.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnCorrelativo regla_UsuarioCorrelativo = new RnCorrelativo(path);
            return regla_UsuarioCorrelativo.modificar(
                    txt_Codigo.getText().trim(), cbo_idusuario.getSelectedIndex() > 0 ? xUsuario.get(cbo_idusuario.getSelectedIndex() - 1).getId_usuario() : "", cbo_serie.getSelectedIndex() > 0 ? x_serie.get(cbo_serie.getSelectedIndex() - 1).getIdCorrelativo() : "", "", usuario.getCodempresa(), usuario.getId_usuario(),
                    (chkHabilitar.isSelected() ? "S" : "N"));
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnCorrelativo regla_UsuarioCorrelativo = new RnCorrelativo(path);

            return regla_UsuarioCorrelativo.eliminarUsuarioCorrelativo(txt_Codigo.getText().trim(), usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_idlocalidad == e.getSource()) {
            if (cbo_idlocalidad.getItemCount() > 0) {
                if (cbo_idlocalidad.getSelectedIndex() == 0) {
                    cbo_idpuntoventa.removeAllItems();
                    cbo_idpuntoventa.setEnabled(false);
                    cbo_idtipodocumento.removeAllItems();
                    cbo_idtipodocumento.setEnabled(false);
                    cbo_serie.removeAllItems();
                    cbo_serie.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_idpuntoventa.setEnabled(true);
                    }

                    loadPuntoVenta(xlocali.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cbo_idpuntoventa == e.getSource()) {
            if (cbo_idpuntoventa.getItemCount() > 0) {
                if (cbo_idpuntoventa.getSelectedIndex() == 0) {
                    cbo_idtipodocumento.removeAllItems();
                    cbo_idtipodocumento.setEnabled(false);
                    cbo_serie.removeAllItems();
                    cbo_serie.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_idtipodocumento.setEnabled(true);
                    }

                    loadTipoDoc(xpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta());
                }
            }
        }

        if (cbo_idtipodocumento == e.getSource()) {
            if (cbo_idtipodocumento.getItemCount() > 0) {
                if (cbo_idtipodocumento.getSelectedIndex() == 0) {
                    cbo_serie.removeAllItems();
                    cbo_serie.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_serie.setEnabled(true);
                    }

                    loadCorrelativo(xpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta(), x_idtipodocumento.get(cbo_idtipodocumento.getSelectedIndex() - 1).getIdTipoDoc());
                }
            }
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbo_idlocalidad.setEnabled(e);
        cbo_idusuario.setEnabled(e);
        cbo_serie.setEnabled(e);
        cbo_idtipodocumento.setEnabled(e);
        cbo_idpuntoventa.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    public void prepareRegister() {
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

    @Override
    public boolean executeSelect() {
        return true;
    }

    public void addRow(String[] row) {
    }

    public void addRow(Object[] reg) {
    }

    public void loadInicio() {
    }

    public void showSearchDialog() {
    }

    public void loadInicioUDD() {
    }

    public void loadInicioInsert() {
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

    public void addRow(Object ob) {
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

    public void addRow(Object reg[], String opcion) {
    }

    public void removeRow(Object reg[], String opcion) {
    }

    public void updateRow(Object reg[], String opcion) {
    }

    @Override
    public void showMessagePrint(String codigo) {
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
    public boolean loadRegister(Object o) {
        return true;
    }

    @Override
    public boolean executeAnular() {
        return true;
    }
}
