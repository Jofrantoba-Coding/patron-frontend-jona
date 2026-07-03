/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterusuariocorrelativo;


import com.softcommerce.formularios.*;
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

public class UiRegisterUsuarioCorrelativo extends JHDialog implements InterUiRegisterUsuarioCorrelativo, ActionListener, ItemListener, KeyListener, FocusListener {

    private static final long serialVersionUID = 1L;
    protected JComboBox cbo_idlocalidad;
    protected JComboBox cbo_idpuntoventa;
    protected JComboBox cbo_serie;
    protected JCheckBox chkHabilitar;
    protected JComboBox cbo_idtipodocumento;
    protected JTextField txt_Codigo;
    protected CComboBox cbo_idusuario;
    protected List<Usuario> xUsuario;
    protected List<Correlativo> x_serie;
    protected List<PuntoVenta> xpuntoventa;
    protected Usuario usuario;
    protected List<Localidad> xlocali;
    protected List<BeanTipoDocVenta> x_idtipodocumento;
    protected String id_correlativo;
    protected String id_usuario;

    public UiRegisterUsuarioCorrelativo(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterUsuarioCorrelativo(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
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
    }

    public void loadLocalidad(String xcodEmpres) {
    }

    public void loadPuntoVenta(String xcodLocalidad) {
    }

    public void loadTipoDoc(String xcodpuntoventa) {
    }

    public void loadCorrelativo(String id_puntoventa, String id_tipodoc) {
    }

    public void loadUsuario() {
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
        return false;
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    public void cargarUsuario(String xCodUsuario) {
    }

    public void cargarLocalidad(String codLocalidad) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
    }

    public void cargarTipoDocumento(String tipoDocumento) {
    }

    public void cargarSerie(String serie) {
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

    @Override
    public boolean executeSelect() {
        return false;
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
        return false;
    }

    @Override
    public boolean executeAnular() {
        return false;
    }
}
