/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistercorrelativo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Correlativo;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.OperacionBDEnum;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.util.FormatObject;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dialog;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.ButtonGroup;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;

public class UiRegisterCorrelativo
        extends JHDialog
        implements InterUiRegisterCorrelativo, ActionListener, ItemListener, KeyListener, FocusListener {

    private static final long serialVersionUID = 1L;
    protected CComboBox cbo_idlocalidad;
    protected CComboBox cbo_idpuntoventa;
    protected CComboBox cbo_idtipodocumento;   
    protected JTextField txt_Codigo;
    protected JTextField txt_Serie;
    protected JTextField txt_Correlativo;
    protected ButtonGroup bg_grupoA;
    protected CRadioButton rb_activo;
    protected CRadioButton rb_inactivo;
    protected ButtonGroup bg_grupoB;
    protected CRadioButton rb_imprimible;
    protected CRadioButton rb_noImprimible;
    protected List<PuntoVenta> xpuntoventa;
    protected List<Localidad> xlocali;
    protected List<BeanTipoDocVenta> xtipodocumento;
    protected String codtipodocumento;
    protected String serie;
    protected String codpuntoventa;
    protected Usuario usuario;

    //Caja Registradora
    protected CLabel lblNumeroAutorizacion;
    protected CLabel lblCodigoMaquina;
    protected JTextField txtNumeroAutorizacion;
    protected JTextField txtCodigoMaquina;

    public UiRegisterCorrelativo(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterCorrelativo(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {

        setTitleName("Correlativo");
        //setRegister(pnlPrinc);
        getContentPane().add(this.getPnlPrincipal());
        //setMinimumSize(new Dimension(425, 540));
        //this.setResizable(true);
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected JPanel getPnlPrincipal() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, " Datos de Correlativo ", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 0, 13), Color.BLACK);

        JPanel pnl_Correlativo = new JPanel();
        pnl_Correlativo.setBackground(new Color(245, 245, 245));
        pnl_Correlativo.setBorder(border);
        pnl_Correlativo.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);

        CLabel lbl_Codigo = new CLabel("Código");
        pnl_Correlativo.add(lbl_Codigo, gbc);

        gbc.gridx = 1;
        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setColumns(8);
        pnl_Correlativo.add(txt_Codigo, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        CLabel lbl_TipoDocumento = new CLabel("Tipo Documento");
        pnl_Correlativo.add(lbl_TipoDocumento, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        cbo_idtipodocumento = new CComboBox();
        cbo_idtipodocumento.addKeyListener(this);
        cbo_idtipodocumento.addActionListener(this);
        pnl_Correlativo.add(cbo_idtipodocumento, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 2;
        CLabel lbl_Serie = new CLabel("Serie");
        pnl_Correlativo.add(lbl_Serie, gbc);

        gbc.gridx = 1;
        txt_Serie = new JTextField();
        txt_Serie.addKeyListener(this);
        FormatObject.formatJTextFieldSerie(txt_Serie);
        txt_Serie.addFocusListener(this);
        txt_Serie.setColumns(8);
        pnl_Correlativo.add(txt_Serie, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        CLabel lbl_Correlativo = new CLabel("Correlativo");
        pnl_Correlativo.add(lbl_Correlativo, gbc);

        gbc.gridx = 1;
        txt_Correlativo = new JTextField();
        txt_Correlativo.addKeyListener(this);
        txt_Correlativo.setDocument(new IntegerDocument(10));
        txt_Correlativo.addFocusListener(this);
        txt_Correlativo.setColumns(8);
        pnl_Correlativo.add(txt_Correlativo, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        CLabel lbl_EstadoVigente = new CLabel("Estado");
        pnl_Correlativo.add(lbl_EstadoVigente, gbc);

        gbc.gridx = 1;
        rb_activo = new CRadioButton("Activo");
        rb_activo.addKeyListener(this);
        pnl_Correlativo.add(rb_activo, gbc);

        gbc.gridx = 2;
        rb_inactivo = new CRadioButton("Inactivo");
        rb_inactivo.addKeyListener(this);
        pnl_Correlativo.add(rb_inactivo, gbc);

        bg_grupoA = new ButtonGroup();
        bg_grupoA.add(rb_activo);
        bg_grupoA.add(rb_inactivo);

        gbc.gridx = 0;
        gbc.gridy = 5;
        CLabel lbl_Localidad = new CLabel("Localidad");
        pnl_Correlativo.add(lbl_Localidad, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        cbo_idlocalidad = new CComboBox();
        cbo_idlocalidad.addActionListener(this);
        cbo_idlocalidad.setEnabled(false);
        cbo_idlocalidad.addKeyListener(this);
        pnl_Correlativo.add(cbo_idlocalidad, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 6;
        CLabel lbl_LocalDespacho = new CLabel("Punto de Venta");
        pnl_Correlativo.add(lbl_LocalDespacho, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        cbo_idpuntoventa = new CComboBox();
        cbo_idpuntoventa.addActionListener(this);
        cbo_idpuntoventa.setEnabled(false);
        cbo_idpuntoventa.addKeyListener(this);
        pnl_Correlativo.add(cbo_idpuntoventa, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 7;
        lblNumeroAutorizacion = new CLabel("Nro Autorizacion");
        pnl_Correlativo.add(lblNumeroAutorizacion, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtNumeroAutorizacion = new JTextField("");
        txtNumeroAutorizacion.setColumns(16);
        txtNumeroAutorizacion.setDocument(new UpperCaseNumberDocument(50));
        pnl_Correlativo.add(txtNumeroAutorizacion, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 8;
        lblCodigoMaquina = new CLabel("Codigo Maquina");
        pnl_Correlativo.add(lblCodigoMaquina, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtCodigoMaquina = new JTextField("");
        txtCodigoMaquina.setColumns(16);
        txtCodigoMaquina.setDocument(new UpperCaseNumberDocument(50));
        pnl_Correlativo.add(txtCodigoMaquina, gbc);
        gbc.gridwidth = 1;
        
        gbc.gridx = 0;
        gbc.gridy = 9;
        CLabel lbl_SeImprime = new CLabel("Se imprime");
        pnl_Correlativo.add(lbl_SeImprime, gbc);

        gbc.gridx = 1;
        rb_imprimible = new CRadioButton("Si");
        rb_imprimible.addKeyListener(this);
        pnl_Correlativo.add(rb_imprimible, gbc);

        gbc.gridx = 2;
        rb_noImprimible = new CRadioButton("No");
        rb_noImprimible.addKeyListener(this);
        pnl_Correlativo.add(rb_noImprimible, gbc);

        bg_grupoB = new ButtonGroup();
        bg_grupoB.add(rb_imprimible);
        bg_grupoB.add(rb_noImprimible);
        

        pnl_dialog.add(pnl_Correlativo, BorderLayout.WEST);

        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.add(pnl_dialog, BorderLayout.NORTH);

        return pnlPrinc;
    }

    @Override
    public void loadCombo() {
    }

    public void loadTipoDocumento() {
    }

    public void loadLocalidad(String xcodEmpres) {
    }

    public void loadPuntoVenta(String xcodLocalidad) {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    protected Correlativo getCorrelativo() {
        Correlativo correlativo = new Correlativo();
        correlativo.setIdCorrelativo(txt_Codigo.getText().trim());
        correlativo.setIdPuntoVenta(this.getIdPuntoVenta());
        correlativo.setIdTipoDoc(this.getIdTipoDoc());
        correlativo.setSerie(txt_Serie.getText().trim());
        correlativo.setNumInicial(this.getNumInicial());
        correlativo.setNumFinal(this.getNumFinal());
        correlativo.setCorrelativo(txt_Correlativo.getText().trim());
        correlativo.setLineaImpresion(this.getLineasImpresion());
        correlativo.setEstadoVigente(rb_activo.isSelected() ? "A" : "I");
        correlativo.setLineaImpresion(rb_imprimible.isSelected() ? 12 : 0);
        correlativo.setFlagCondPago(this.getCondicionPago());
        boolean isTicket = this.isTicket(correlativo.getIdTipoDoc());
        correlativo.setNumeroAutorizacion(this.getNumeroAutorizacion(isTicket));
        correlativo.setCodigoMaquina(this.getCodigoMaquina(isTicket));
        return correlativo;
    }

    protected String getNumeroAutorizacion(boolean isTicket) {
        if (!isTicket) {
            return "";
        }
        return txtNumeroAutorizacion.getText().trim();
    }

    protected String getCodigoMaquina(boolean isTicket) {
        if (!isTicket) {
            return "";
        }
        return txtCodigoMaquina.getText().trim();
    }

    protected String getCondicionPago() {
        return "N";
    }

    protected String getNumInicial() {
        return "0000000001";
    }

    protected String getNumFinal() {
        return "9999999999";
    }

    protected Integer getLineasImpresion() {
        return 12;
    }

    protected String getIdPuntoVenta() {
        if (cbo_idpuntoventa.getSelectedIndex() > 0) {
            return xpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta();
        }
        return "";
    }

    protected String getIdTipoDoc() {
        if (cbo_idtipodocumento.getSelectedIndex() > 0) {
            return xtipodocumento.get(cbo_idtipodocumento.getSelectedIndex() - 1).getIdTipoDoc();
        }
        return "";
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_Correlativo) {
            txt_Correlativo.selectAll();
        }

        if (e.getSource() == txt_Serie) {
            txt_Serie.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cbo_idtipodocumento) {
                txt_Serie.requestFocus();
            }
            if (e.getSource() == txt_Serie) {
                txt_Correlativo.requestFocus();
            }
            if (e.getSource() == txt_Correlativo) {
                rb_activo.requestFocus();
            }

            if (e.getSource() == rb_activo) {
                rb_inactivo.requestFocus();
            }

            if (e.getSource() == rb_inactivo) {
                if (cbo_idlocalidad.isEnabled()) {
                    cbo_idlocalidad.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cbo_idlocalidad) {
                if (cbo_idpuntoventa.isEnabled()) {
                    cbo_idpuntoventa.requestFocus();
                } else {
                    setFocusAndClick();
                }
            }

            if (e.getSource() == cbo_idpuntoventa) {
                setFocusAndClick();
            }
        }

        if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            if (e.getSource() == rb_activo) {
                rb_activo.setSelected(true);
                cbo_idlocalidad.requestFocus();
            }

            if (e.getSource() == rb_inactivo) {
                rb_inactivo.setSelected(true);
                cbo_idlocalidad.requestFocus();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    protected boolean isValidTicket() {
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

    public void cargarTipoDocumento(String tipoDocumento) {
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    protected String mantCorrelativo(OperacionBDEnum operacionEnum) throws Exception {
        return null;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    protected void changeLocalidad() {
        if (cbo_idlocalidad.getItemCount() > 0) {
            if (cbo_idlocalidad.getSelectedIndex() == 0) {
                cbo_idpuntoventa.removeAllItems();
                cbo_idpuntoventa.setEnabled(false);
            } else {
                if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                    cbo_idpuntoventa.setEnabled(true);
                }
                loadPuntoVenta(xlocali.get(cbo_idlocalidad.getSelectedIndex() - 1).getId_localidad());
            }
        }
    }

    protected void changeTipoDocVenta() {
        this.showDataTicket(this.isTicket(this.getIdTipoDoc()));
    }

    protected boolean isTicket(String idTipoDoc) {
        return TipoDocVentaEnum.TICKET.getValue().equals(idTipoDoc);
    }

    protected void showDataTicket(boolean isTicket) {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_idlocalidad == e.getSource()) {
            this.changeLocalidad();
        }
        if (e.getSource().equals(cbo_idtipodocumento)) {
            this.changeTipoDocVenta();
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbo_idlocalidad.setEnabled(e);
        cbo_idpuntoventa.setEnabled(e);
        cbo_idtipodocumento.setEnabled(e);
        rb_activo.setEnabled(e);
        rb_inactivo.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_Serie.setEditable(e);
        txt_Correlativo.setEditable(e);
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txt_Serie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
        }
        if (e.getSource() == txt_Correlativo && txt_Correlativo.getText().trim().length() > 0) {
            String serieguia = "0000000000" + txt_Correlativo.getText();
            String nuevaserieguia = serieguia.substring(serieguia.length() - 10, serieguia.length());
            txt_Correlativo.setText(nuevaserieguia);
        }
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

    public void loadInicio() {
    }

    public void showSearchDialog() {
    }

    public void loadInicioInsert() {
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

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    public void addRow(Object ob, String opcion) {
    }

    public void removeRow(Object ob, String opcion) {
    }

    public void updateRow(Object ob, String opcion) {
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
