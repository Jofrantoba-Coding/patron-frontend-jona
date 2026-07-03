/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformitemalmacen;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.ConfigItemAlmacen;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.toedter.calendar.JDateChooser;
import java.awt.Color;
import java.awt.Component;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiFormItemAlmacen extends JDialog implements InterUiFormItemAlmacen, ActionListener {

    protected java.net.URL path;
    protected JButton btnProcess;
    public Boolean swRegistro;
    protected JComboBox cbo_Localidad;
    protected List<Localidad> xLocalidad;
    protected JComboBox cbo_PuntoVenta;
    protected List<PuntoVenta> xPuntoVenta;
    protected JComboBox cbo_Almacen;
    protected List<Almacen> xAlmacen;
    protected JComboBox cbo_Proceso;
    protected JDateChooser dc_fechainicio;
    protected JHDialog dialog;
    protected Component comp;
    protected Usuario usuario;

    public UiFormItemAlmacen(JHDialog arg0, java.net.URL path, Component comp, Usuario usuario) {
        super(arg0);
        this.dialog = arg0;
        this.path = path;
        this.comp = comp;
        this.usuario = usuario;
        //this.register=register;
        initialize();
    }

    protected void initialize() {
        swRegistro = false;
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);
        setTitle("Agregar Almacen");
        setBackground(new Color(245, 245, 245));
        setContentPane(pnl);
        setModal(true);
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.setLayout(new GridBagLayout());
        CLabel lbl_Localidad = new CLabel("Localidad");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Localidad, gbc);

        cbo_Localidad = new JComboBox();
        cbo_Localidad.addActionListener(this);
        //cbo_Padron.setModel(cboModelPadron);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Localidad, gbc);

        JLabel lblPuntoVenta = new JLabel("Pto Venta");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lblPuntoVenta, gbc);

        cbo_PuntoVenta = new JComboBox();
        cbo_PuntoVenta.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_PuntoVenta, gbc);

        JLabel lblAlmacen = new JLabel("Almacen");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lblAlmacen, gbc);

        cbo_Almacen = new JComboBox();
        cbo_Almacen.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Almacen, gbc);

        JLabel lblProceso = new JLabel("Proceso");
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lblProceso, gbc);

        cbo_Proceso = new JComboBox();
        cbo_Proceso.addItem("VENTA");
        cbo_Proceso.addItem("DESPACHO");
        cbo_Proceso.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Proceso, gbc);

        CLabel lbl_Fecha = new CLabel("Fecha Inicio");
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Fecha, gbc);
        dc_fechainicio = new JDateChooser(new java.util.Date());
        gbc.gridx = 1;
        gbc.gridy = 4;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(dc_fechainicio, gbc);

        btnProcess = new JButton("Activar");
        btnProcess.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 5;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(btnProcess, gbc);
        loadLocalidad(usuario.getCodempresa());
        setSize(400, 250);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);

    }

    protected void loadLocalidad(String xcodEmpres) {
    }

    protected void loadPuntoVenta(String xcodLocalidad) {
    }

    protected void loadAlmacen(String xcodPtoVta) {
    }

    protected boolean verificarValido() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnProcess) {
            if (!verificarValido()) {
                return;
            }
            //
            ConfigItemAlmacen beanConfigItemAlmacen = new ConfigItemAlmacen();
            //beanCaracteristicaItemDetalle.setId_padron(((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron());
            //beanCaracteristicaItemDetalle.setBeanCaracteristicaItem(xCaracteristica.get(cbo_Caracteristica.getSelectedIndex()));
            beanConfigItemAlmacen.setIdAlmacen(xAlmacen.get(cbo_Almacen.getSelectedIndex() - 1).getIdAlmacen());
            beanConfigItemAlmacen.setAlmacen(cbo_Almacen.getSelectedItem().toString().trim());
            beanConfigItemAlmacen.setProceso(cbo_Proceso.getSelectedItem().toString().trim());
            java.util.Date fechaini = dc_fechainicio.getDate();
            java.sql.Date ini = new java.sql.Date(fechaini.getTime());
            beanConfigItemAlmacen.setFechaIni(ini);
            beanConfigItemAlmacen.setEstado("A");
            beanConfigItemAlmacen.setOperacion("I");
            //beanCaracteristicaItemDetalle.setValor(new BigDecimal(txtValor.getText()));
            dialog.setValueSearch(beanConfigItemAlmacen, comp);
            dispose();
        }

        if (cbo_Localidad == e.getSource()) {
            if (cbo_Localidad.getItemCount() > 0) {
                if (cbo_Localidad.getSelectedIndex() == 0) {
                    cbo_PuntoVenta.removeAllItems();
                    cbo_PuntoVenta.setEnabled(false);
                    cbo_Almacen.removeAllItems();
                    cbo_Almacen.setEnabled(false);
                } else {
                    cbo_PuntoVenta.setEnabled(true);
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
                    cbo_Almacen.setEnabled(true);
                    loadAlmacen(xPuntoVenta.get(cbo_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta());
                }
            }
        }
    }
}
