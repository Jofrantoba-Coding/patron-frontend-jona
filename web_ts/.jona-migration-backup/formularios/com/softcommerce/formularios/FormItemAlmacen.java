/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

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
public class FormItemAlmacen extends JDialog implements ActionListener {

    private java.net.URL path;
    private JButton btnProcess;
    public Boolean swRegistro;
    private JComboBox cbo_Localidad;
    private List<Localidad> xLocalidad;
    private JComboBox cbo_PuntoVenta;
    private List<PuntoVenta> xPuntoVenta;
    private JComboBox cbo_Almacen;
    private List<Almacen> xAlmacen;
    private JComboBox cbo_Proceso;
    private JDateChooser dc_fechainicio;
    private JHDialog dialog;
    private Component comp;
    private Usuario usuario;

    public FormItemAlmacen(JHDialog arg0, java.net.URL path, Component comp, Usuario usuario) {
        super(arg0);
        this.dialog = arg0;
        this.path = path;
        this.comp = comp;
        this.usuario = usuario;
        //this.register=register;
        initialize();
    }

    private void initialize() {
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

    private void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (xLocalidad != null) {
                xLocalidad.clear();
            } else {
                xLocalidad = new ArrayList<Localidad>();
            }

            xLocalidad.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cbo_Localidad.removeAllItems();
            cbo_Localidad.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < xLocalidad.size(); i++) {
                cbo_Localidad.addItem(xLocalidad.get(i).getDescripcion());
            }

            cbo_Localidad.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xPuntoVenta != null) {
                xPuntoVenta.clear();
            } else {
                xPuntoVenta = new ArrayList<PuntoVenta>();
            }

            xPuntoVenta.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cbo_PuntoVenta.removeAllItems();
            cbo_PuntoVenta.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xPuntoVenta.size(); i++) {
                cbo_PuntoVenta.addItem(xPuntoVenta.get(i).getDescripcion_puntoventa());
            }

            cbo_PuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadAlmacen(String xcodPtoVta) {
        try {
            RnAlmacen regla_Almacen = new RnAlmacen(path);

            if (xAlmacen != null) {
                xAlmacen.clear();
            } else {
                xAlmacen = new ArrayList<Almacen>();
            }

            xAlmacen.addAll(regla_Almacen.listar("", "", xcodPtoVta));

            cbo_Almacen.removeAllItems();
            cbo_Almacen.addItem("--- Seleccione un Almacen ---");

            for (int i = 0; i < xAlmacen.size(); i++) {
                cbo_Almacen.addItem(xAlmacen.get(i).getDescripcion());
            }

            cbo_Almacen.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean verificarValido() {
        if (cbo_Localidad.getSelectedIndex() <= 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Localidad");
            cbo_Localidad.setBorder(new LineBorder(Color.RED));
            cbo_Localidad.requestFocus();
            return false;
        }
        if (cbo_PuntoVenta.getSelectedIndex() <= 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Punto de Venta");
            cbo_PuntoVenta.setBorder(new LineBorder(Color.RED));
            cbo_PuntoVenta.requestFocus();
            return false;
        }
        if (cbo_Almacen.getSelectedIndex() <= 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Almacen");
            cbo_Almacen.setBorder(new LineBorder(Color.RED));
            cbo_Almacen.requestFocus();
            return false;
        }
        if (cbo_Proceso.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Proceso");
            cbo_Proceso.setBorder(new LineBorder(Color.RED));
            cbo_Proceso.requestFocus();
            return false;
        }
        //Verificar Si no hay Ningun Dato
        if (((RegisterItem) dialog).modeltableConfigItemAlmacen.getRowCount() > 0) {
            //String idcaracteri = ((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron();
            String id_almacen = xAlmacen.get(cbo_Almacen.getSelectedIndex() - 1).getIdAlmacen();
            String proceso = cbo_Proceso.getSelectedItem().toString().trim();
            for (int i = 0; i < ((RegisterItem) dialog).modeltableConfigItemAlmacen.getRowCount(); i++) {
                ConfigItemAlmacen beanConfigItemAlmacen = ((RegisterItem) dialog).modeltableConfigItemAlmacen.getConfigItemAlmacen(i);
                if (beanConfigItemAlmacen.getIdAlmacen().equals(id_almacen) && beanConfigItemAlmacen.getProceso().equals(proceso) && beanConfigItemAlmacen.getEstado().equals("A")) {
                    JOptionPane.showMessageDialog(this, "Almacen ya se Encuentra Activado");
                    return false;
                }
            }
        }
        return true;
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
