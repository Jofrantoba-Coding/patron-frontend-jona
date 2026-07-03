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
    private CComboBox cbo_idlocalidad;
    private CComboBox cbo_idpuntoventa;
    private CComboBox cbo_idtipodocumento;   
    private JTextField txt_Codigo;
    private JTextField txt_Serie;
    private JTextField txt_Correlativo;
    private ButtonGroup bg_grupoA;
    private CRadioButton rb_activo;
    private CRadioButton rb_inactivo;
    private ButtonGroup bg_grupoB;
    private CRadioButton rb_imprimible;
    private CRadioButton rb_noImprimible;
    private List<PuntoVenta> xpuntoventa;
    private List<Localidad> xlocali;
    private List<BeanTipoDocVenta> xtipodocumento;
    private String codtipodocumento;
    private String serie;
    private String codpuntoventa;
    private Usuario usuario;

    //Caja Registradora
    private CLabel lblNumeroAutorizacion;
    private CLabel lblCodigoMaquina;
    private JTextField txtNumeroAutorizacion;
    private JTextField txtCodigoMaquina;

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

    private void inicialize() {

        setTitleName("Correlativo");
        //setRegister(pnlPrinc);
        getContentPane().add(this.getPnlPrincipal());
        //setMinimumSize(new Dimension(425, 540));
        //this.setResizable(true);
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private JPanel getPnlPrincipal() {
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
        loadLocalidad(usuario.getCodempresa());
        loadTipoDocumento();
        this.pack();
    }

    public void loadTipoDocumento() {
        try {
            RnTipoDocVenta regla_TipoDoc = new RnTipoDocVenta(path);
            if (xtipodocumento != null) {
                xtipodocumento.clear();
            } else {
                xtipodocumento = new ArrayList<BeanTipoDocVenta>();
            }
            xtipodocumento.addAll(regla_TipoDoc.listarTipoDocVenta("", "", "", "A", "", "", ""));
            cbo_idtipodocumento.removeAllItems();
            cbo_idtipodocumento.addItem("--- Seleccione Tipo de Documento ---");

            for (int i = 0; i < xtipodocumento.size(); i++) {
                cbo_idtipodocumento.addItem(xtipodocumento.get(i).getDescripcion());
            }

            cbo_idtipodocumento.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        cbo_idtipodocumento.setBorder(txt.getBorder());
        txt_Serie.setBorder(txt.getBorder());
        rb_activo.setForeground(txt.getForeground());
        rb_inactivo.setForeground(txt.getForeground());
        txt_Correlativo.setBorder(txt.getBorder());
        cbo_idpuntoventa.setBorder(txt.getBorder());
        cbo_idlocalidad.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_Serie.setText("");
        txt_Correlativo.setText("");
        rb_activo.setSelected(true);
        rb_imprimible.setSelected(true);
        cbo_idlocalidad.setSelectedIndex(0);
        cbo_idtipodocumento.setSelectedIndex(0);
        cbo_idtipodocumento.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            return this.mantCorrelativo(OperacionBDEnum.INSERTAR);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            e.printStackTrace();
            return "";
        }
    }

    private Correlativo getCorrelativo() {
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

    private String getNumeroAutorizacion(boolean isTicket) {
        if (!isTicket) {
            return "";
        }
        return txtNumeroAutorizacion.getText().trim();
    }

    private String getCodigoMaquina(boolean isTicket) {
        if (!isTicket) {
            return "";
        }
        return txtCodigoMaquina.getText().trim();
    }

    private String getCondicionPago() {
        return "N";
    }

    private String getNumInicial() {
        return "0000000001";
    }

    private String getNumFinal() {
        return "9999999999";
    }

    private Integer getLineasImpresion() {
        return 12;
    }

    private String getIdPuntoVenta() {
        if (cbo_idpuntoventa.getSelectedIndex() > 0) {
            return xpuntoventa.get(cbo_idpuntoventa.getSelectedIndex() - 1).getId_punto_venta();
        }
        return "";
    }

    private String getIdTipoDoc() {
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
        try {
            JTextField txt = new JTextField();
            cbo_idtipodocumento.setBorder(txt.getBorder());
            txt_Serie.setBorder(txt.getBorder());
            rb_activo.setForeground(txt.getForeground());
            rb_inactivo.setForeground(txt.getForeground());
            txt_Correlativo.setBorder(txt.getBorder());
            cbo_idpuntoventa.setBorder(txt.getBorder());
            cbo_idlocalidad.setBorder(txt.getBorder());

            if (cbo_idtipodocumento.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Tipo de Documento.", "Datos incompletos del Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_idtipodocumento.setBorder(new LineBorder(Color.RED));
                cbo_idtipodocumento.requestFocus();

                return false;
            }

            if (txt_Serie.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Serie.", "Datos incompletos del Correlativo", JOptionPane.INFORMATION_MESSAGE);
                txt_Serie.setBorder(new LineBorder(Color.RED));
                txt_Serie.requestFocus();

                return false;
            }
            if (txt_Correlativo.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Correlativo.", "Datos incompletos de Correlativo", JOptionPane.INFORMATION_MESSAGE);
                txt_Correlativo.setBorder(new LineBorder(Color.RED));
                txt_Correlativo.requestFocus();

                return false;
            }
            if (!rb_activo.isSelected() && !rb_inactivo.isSelected()) {
                JOptionPane.showMessageDialog(this, "Para " + this.namemode + " " + "un Correlativo, debes " + "especificar su Estado.", "Datos incompletos del Correlativo", JOptionPane.INFORMATION_MESSAGE);
                this.rb_activo.setForeground(Color.red);
                this.rb_inactivo.setForeground(Color.red);
                rb_activo.requestFocus();

                return false;
            }

            if (cbo_idlocalidad.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar la Localidad.", "Datos incompletos de Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_idlocalidad.setBorder(new LineBorder(Color.RED));
                cbo_idlocalidad.requestFocus();

                return false;
            }

            if (cbo_idpuntoventa.getSelectedIndex() == 0) {
                JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Punto de Venta.", "Datos incompletos de Correlativo", JOptionPane.INFORMATION_MESSAGE);
                cbo_idpuntoventa.setBorder(new LineBorder(Color.RED));
                cbo_idpuntoventa.requestFocus();

                return false;
            }
            String idPuntoVenta = this.getIdPuntoVenta();
            String idTipoDoc = this.getIdTipoDoc();
            RnCorrelativo reg = new RnCorrelativo(path);
            boolean flag = reg.getExisteSerieCorrelativo(
                    idPuntoVenta, idTipoDoc, txt_Serie.getText().trim()
            ).equals("S");

            if (((mode == INSERT) && flag)
                    || ((mode == UPDATE) && flag
                    && !(idPuntoVenta.equals(codpuntoventa)
                    && idTipoDoc.equals(codtipodocumento)
                    && txt_Serie.getText().trim().equals(serie)))) {
                JOptionPane.showMessageDialog(this, "Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.", "Datos incompletos de Correlativo", JOptionPane.INFORMATION_MESSAGE);
                txt_Serie.setBorder(new LineBorder(Color.RED));
                txt_Serie.requestFocus();

                return false;
            }

            return this.isValidTicket();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    private boolean isValidTicket() {
        if (!isTicket(this.getIdTipoDoc())) {
            return true;
        }
        if (txtNumeroAutorizacion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Numero de Autorizacion.",
                    "Datos incompletos de Correlativo", JOptionPane.INFORMATION_MESSAGE);
            txtNumeroAutorizacion.requestFocus();
            return false;
        }
        if (txtCodigoMaquina.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Codigo de Maquina.",
                    "Datos incompletos de Correlativo", JOptionPane.INFORMATION_MESSAGE);
            txtCodigoMaquina.requestFocus();
            return false;
        }
        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            RnCorrelativo regla = new RnCorrelativo(path);
            Correlativo co = regla.getBeanCorrelativo(rowSelection.getSelectedValue(1).toString());
            if (co == null) {
                return false;
            }
            codpuntoventa = co.getIdPuntoVenta().trim();
            codtipodocumento = co.getIdTipoDoc().trim();
            serie = co.getSerie().trim();
            txt_Codigo.setText(mode == CLONE ? "" : co.getIdCorrelativo());
            cargarTipoDocumento(co.getIdTipoDoc());
            cargarLocalidad(co.getIdLocalidad());
            cargarPuntoVenta(co.getIdPuntoVenta());
            txt_Serie.setText(co.getSerie());
            txt_Correlativo.setText(co.getCorrelativo());
            rb_activo.setSelected(co.getEstadoVigente().equals("A"));            
            rb_inactivo.setSelected(!co.getEstadoVigente().equals("A"));
            rb_imprimible.setSelected(co.getLineaImpresion()>0);
            rb_noImprimible.setSelected(co.getLineaImpresion()<1);
            txtNumeroAutorizacion.setText(co.getNumeroAutorizacion());
            txtCodigoMaquina.setText(co.getCodigoMaquina());
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
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
        if (xtipodocumento != null && !tipoDocumento.equals("")) {
            for (int i = 0; i < xtipodocumento.size(); i++) {
                if (xtipodocumento.get(i).getIdTipoDoc().equals(tipoDocumento)) {
                    cbo_idtipodocumento.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    @Override
    public String executeUpdate() {
        try {
            return this.mantCorrelativo(OperacionBDEnum.ACTUALIZAR);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    private String mantCorrelativo(OperacionBDEnum operacionEnum) throws Exception {
        try {
            RnCorrelativo regla = new RnCorrelativo(path);
            return regla.mantCorrelativo(this.getCorrelativo(), usuario.getId_usuario(), operacionEnum);
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            this.mantCorrelativo(OperacionBDEnum.ELIMINAR);
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private void changeLocalidad() {
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

    private void changeTipoDocVenta() {
        this.showDataTicket(this.isTicket(this.getIdTipoDoc()));
    }

    private boolean isTicket(String idTipoDoc) {
        return TipoDocVentaEnum.TICKET.getValue().equals(idTipoDoc);
    }

    private void showDataTicket(boolean isTicket) {
        lblCodigoMaquina.setVisible(isTicket);
        lblNumeroAutorizacion.setVisible(isTicket);
        txtCodigoMaquina.setVisible(isTicket);
        txtNumeroAutorizacion.setVisible(isTicket);
        this.pack();
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
        return;
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorDelete() {
        return;
    }

    public boolean showConfirmDelete() {
        return true;
    }

    @Override
    public boolean executeSelect() {
        return true;
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
        return true;
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }
}
