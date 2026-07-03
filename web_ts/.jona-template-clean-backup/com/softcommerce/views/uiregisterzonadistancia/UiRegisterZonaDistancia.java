/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterzonadistancia;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.beans.Zona;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.ZonaDistancia;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.JHDialog;
//import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnUbigeo;
import com.softcommerce.reglasnegocio.RnZona;
import com.softcommerce.reglasnegocio.rn_ZonaDistancia;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
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
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiRegisterZonaDistancia extends JHDialog implements InterUiRegisterZonaDistancia, ActionListener, ItemListener, KeyListener, FocusListener {

    protected Usuario usuario;
    protected JTextField txt_Codigo;
    //private JTextField txt_Descripcion;
    protected JComboBox cbo_Departamento;
    protected List<Ubigeo> xDepartamento;
    protected JComboBox cbo_Provincia;
    protected List<Ubigeo> xProvincia;
    protected JComboBox cbo_Distrito;
    protected List<Ubigeo> xDistrito;
    protected JComboBox cbo_Zona;
    protected List<Zona> xZona;
    protected JComboBox cbo_Localidad;
    protected List<Localidad> xLocalidad;
    protected JComboBox cbo_PuntoVenta;
    protected List<PuntoVenta> xPuntoVenta;
    protected JComboBox cbo_Almacen;
    protected List<Almacen> xAlmacen;
    protected JTextField txt_distancia;
    protected JCheckBox chkEstado;

    public UiRegisterZonaDistancia(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Zona Distancia", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        JPanel pnlZona = new JPanel();
        pnlZona.setLayout(null);
        pnlZona.setBackground(new Color(245, 245, 245));
        pnlZona.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 30, 80, 20);
        pnlZona.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setBounds(125, 30, 120, 20);
        pnlZona.add(txt_Codigo);

        CLabel lbl_Departamento = new CLabel("Departamento");
        lbl_Departamento.setBounds(35, 60, 100, 20);
        pnlZona.add(lbl_Departamento);

        cbo_Departamento = new JComboBox();
        cbo_Departamento.addActionListener(this);
        cbo_Departamento.addKeyListener(this);
        cbo_Departamento.setBounds(125, 60, 200, 20);
        pnlZona.add(cbo_Departamento);

        CLabel lbl_Provincia = new CLabel("Provincia");
        lbl_Provincia.setBounds(35, 90, 100, 20);
        pnlZona.add(lbl_Provincia);

        cbo_Provincia = new JComboBox();
        cbo_Provincia.addActionListener(this);
        cbo_Provincia.setBounds(125, 90, 180, 20);
        cbo_Provincia.addKeyListener(this);
        cbo_Provincia.setEnabled(false);
        pnlZona.add(cbo_Provincia);

        CLabel lbl_Distrito = new CLabel("Distrito");
        lbl_Distrito.setBounds(35, 120, 100, 20);
        pnlZona.add(lbl_Distrito);

        cbo_Distrito = new JComboBox();
        cbo_Distrito.addActionListener(this);
        cbo_Distrito.setBounds(125, 120, 180, 20);
        cbo_Distrito.addKeyListener(this);
        cbo_Distrito.setEnabled(false);
        pnlZona.add(cbo_Distrito);

        CLabel lbl_Zona = new CLabel("Zona");
        lbl_Zona.setBounds(35, 150, 100, 20);
        pnlZona.add(lbl_Zona);

        cbo_Zona = new JComboBox();
        cbo_Zona.addActionListener(this);
        cbo_Zona.setBounds(125, 150, 180, 20);
        cbo_Zona.addKeyListener(this);
        cbo_Zona.setEnabled(false);
        pnlZona.add(cbo_Zona);

        JLabel lbl_Localidad = new JLabel("Localidad");
        lbl_Localidad.setFont(new Font("Verdana", 0, 11));
        lbl_Localidad.setBounds(35, 180, 100, 20);
        pnlZona.add(lbl_Localidad);

        cbo_Localidad = new JComboBox();
        cbo_Localidad.addActionListener(this);
        cbo_Localidad.setBounds(125, 180, 180, 20);
        cbo_Localidad.addKeyListener(this);
        pnlZona.add(cbo_Localidad);

        JLabel lbl_ptovta = new JLabel("Pto Venta");
        lbl_ptovta.setFont(new Font("Verdana", 0, 11));
        lbl_ptovta.setBounds(35, 210, 100, 20);
        pnlZona.add(lbl_ptovta);

        cbo_PuntoVenta = new JComboBox();
        cbo_PuntoVenta.addActionListener(this);
        cbo_PuntoVenta.setBounds(125, 210, 180, 20);
        cbo_PuntoVenta.addKeyListener(this);
        cbo_PuntoVenta.setEnabled(false);
        pnlZona.add(cbo_PuntoVenta);

        JLabel lbl_Almacen = new JLabel("Almacen");
        lbl_Almacen.setFont(new Font("Verdana", 0, 11));
        lbl_Almacen.setBounds(35, 240, 100, 20);
        pnlZona.add(lbl_Almacen);

        cbo_Almacen = new JComboBox();
        cbo_Almacen.addActionListener(this);
        cbo_Almacen.setBounds(125, 240, 180, 20);
        cbo_Almacen.addKeyListener(this);
        cbo_Almacen.setEnabled(false);
        pnlZona.add(cbo_Almacen);

        JLabel lbl_distancia = new JLabel("Distancia(Km)");
        lbl_distancia.setBounds(35, 270, 100, 20);
        lbl_distancia.setFont(new Font("Verdana", 0, 11));
        pnlZona.add(lbl_distancia);

        txt_distancia = new JTextField();
        txt_distancia.setBounds(125, 270, 100, 20);
        txt_distancia.addKeyListener(this);
        //txt_distancia.addFocusListener(this);
        txt_distancia.setDocument(new DoubleDocument());
        txt_distancia.setFont(new Font("Verdana", 0, 11));
        pnlZona.add(txt_distancia);

        chkEstado = new JCheckBox("Activo");
        chkEstado.setBounds(125, 300, 150, 20);
        pnlZona.add(chkEstado);

        pnlZona.setBounds(20, 20, 460, 330);
        pnl_dialog.add(pnlZona);

        setTitleName("Zona Distancia");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 435));
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void loadDepartamento() {
    }

    protected void loadProvincia(String xcoddep) {
    }

    protected void loadDistrito(String xcoddis) {
    }

    protected void loadZona(String id_ubigeo) {
    }

    protected void loadLocalidad(String xcodEmpres) {
    }

    protected void loadPuntoVenta(String xcodLocalidad) {
    }

    protected void loadAlmacen(String xcodPtoVta) {
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {
    }

    @Override
    public void setRegisterEditable(boolean flag) {
        //txt_Descripcion.setEditable(flag);
        chkEstado.setEnabled(flag);
        cbo_Departamento.setEnabled(flag);
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
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
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeInsert() {
        return null;
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
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_Departamento == e.getSource()) {
            if (cbo_Departamento.getItemCount() > 0) {
                if (cbo_Departamento.getSelectedIndex() == 0) {
                    cbo_Distrito.removeAllItems();
                    cbo_Provincia.removeAllItems();
                    cbo_Zona.removeAllItems();
                    cbo_Provincia.setEnabled(false);
                    cbo_Distrito.setEnabled(false);
                    cbo_Zona.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_Provincia.setEnabled(true);
                    }
                    loadProvincia(xDepartamento.get(cbo_Departamento.getSelectedIndex() - 1).getCodigo());
                }
            }
        }

        if (cbo_Provincia == e.getSource()) {
            if (cbo_Provincia.getItemCount() > 0) {
                if (cbo_Provincia.getSelectedIndex() == 0) {
                    cbo_Distrito.removeAllItems();
                    cbo_Distrito.setEnabled(false);
                    cbo_Zona.removeAllItems();
                    cbo_Zona.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_Distrito.setEnabled(true);
                    }

                    loadDistrito(xProvincia.get(cbo_Provincia.getSelectedIndex() - 1).getCodigo());
                }
            }
        }

        if (cbo_Distrito == e.getSource()) {
            if (cbo_Distrito.getItemCount() > 0) {
                if (cbo_Distrito.getSelectedIndex() == 0) {
                    cbo_Zona.removeAllItems();
                    cbo_Zona.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_Zona.setEnabled(true);
                    }

                    loadZona(xDistrito.get(cbo_Distrito.getSelectedIndex() - 1).getCodigo());
                }
            }
        }
        if (cbo_Localidad == e.getSource()) {
            if (cbo_Localidad.getItemCount() > 0) {
                if (cbo_Localidad.getSelectedIndex() == 0) {
                    cbo_PuntoVenta.removeAllItems();
                    cbo_PuntoVenta.setEnabled(false);
                    cbo_Almacen.removeAllItems();
                    cbo_Almacen.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_PuntoVenta.setEnabled(true);
                    }

                    loadPuntoVenta(xLocalidad.get(cbo_Localidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cbo_PuntoVenta == e.getSource()) {
            if (cbo_PuntoVenta.getItemCount() > 0) {
                if (cbo_PuntoVenta.getSelectedIndex() == 0) {
                    cbo_Almacen.removeAllItems();
                    cbo_Almacen.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_Almacen.setEnabled(true);
                    }

                    loadAlmacen(xPuntoVenta.get(cbo_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta());
                }
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
        if (e.getKeyChar() == '\n') {
            /*if (e.getSource() == txt_Descripcion) {
             setFocusAndClick();
             }*/
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        /*if (txt_Descripcion == e.getSource()) {
         txt_Descripcion.selectAll();
         }*/
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}
