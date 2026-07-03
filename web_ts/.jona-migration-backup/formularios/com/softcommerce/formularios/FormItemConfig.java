/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.ConfigItem;
import com.softcommerce.entity.ClaseOperacion;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
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
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.border.LineBorder;

/**
 *
 * @author Team Develtrex
 */
public class FormItemConfig extends JDialog implements ActionListener {

    private java.net.URL path;
    private JButton btnProcess;
    public Boolean swRegistro;
    private JComboBox cbo_ClaseOperacion;
    private List<ClaseOperacion> xClaseOperacion;
    private JDateChooser dc_fechainicio;
    private JHDialog dialog;
    private Component comp;

    public FormItemConfig(JHDialog arg0, java.net.URL path, Component comp) {
        super(arg0);
        this.dialog = arg0;
        this.path = path;
        this.comp = comp;
        //this.register=register;
        initialize();
    }

    private void initialize() {
        swRegistro = false;
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);
        setTitle("Agregar Caracteristica");
        setBackground(new Color(245, 245, 245));
        setContentPane(pnl);
        setModal(true);
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.setLayout(new GridBagLayout());
        CLabel lbl_Departamento = new CLabel("Clase Operacion");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Departamento, gbc);

        cbo_ClaseOperacion = new JComboBox();
        cbo_ClaseOperacion.addActionListener(this);
        //cbo_Padron.setModel(cboModelPadron);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_ClaseOperacion, gbc);

        CLabel lbl_Fecha = new CLabel("Fecha Inicio");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Fecha, gbc);
        dc_fechainicio = new JDateChooser(new java.util.Date());
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(dc_fechainicio, gbc);

        btnProcess = new JButton("Activar");
        btnProcess.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(btnProcess, gbc);
        loadClaseOperacion();
        setSize(350, 200);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);

    }

    private void loadClaseOperacion() {
        try {
            if (xClaseOperacion != null) {
                xClaseOperacion.clear();
            } else {
                xClaseOperacion = new ArrayList<ClaseOperacion>();
            }
            ClaseOperacion bean1 = new ClaseOperacion();
            bean1.setIdClaseOperacion("001");
            bean1.setDescrpcion("COMPRAS");
            ClaseOperacion bean2 = new ClaseOperacion();
            bean2.setIdClaseOperacion("002");
            bean2.setDescrpcion("VENTAS");
            xClaseOperacion.add(bean1);
            xClaseOperacion.add(bean2);
            //xConfigItem.addAll(logicCaracteristicaItem.listarCaracteristicaItem());

            cbo_ClaseOperacion.removeAllItems();
            for (int i = 0; i < xClaseOperacion.size(); i++) {
                cbo_ClaseOperacion.addItem(xClaseOperacion.get(i).getDescrpcion());
            }

            cbo_ClaseOperacion.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean verificarValido() {
        if (cbo_ClaseOperacion.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione caracteristica");
            cbo_ClaseOperacion.setBorder(new LineBorder(Color.RED));
            cbo_ClaseOperacion.requestFocus();
            return false;
        }
        //Verificar Si no hay Ningun Dato
        if (((RegisterItem) dialog).modeltableConfigItem.getRowCount() > 0) {
            //String idcaracteri = ((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron();
            String id_clase_operacion = xClaseOperacion.get(cbo_ClaseOperacion.getSelectedIndex()).getIdClaseOperacion();
            System.out.println(id_clase_operacion);
            for (int i = 0; i < ((RegisterItem) dialog).modeltableConfigItem.getRowCount(); i++) {
                ConfigItem beanConfigItem = ((RegisterItem) dialog).modeltableConfigItem.getConfigItem(i);
                if (beanConfigItem.getIdClaseOperacion().equals(id_clase_operacion) && beanConfigItem.getEstado().equals("A")) {
                    JOptionPane.showMessageDialog(this, "configuracion ya se Encuentra Activado");
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
            ConfigItem beanConfigItem = new ConfigItem();
            //beanCaracteristicaItemDetalle.setId_padron(((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron());
            java.util.Date fechaini = dc_fechainicio.getDate();
            java.sql.Date ini = new java.sql.Date(fechaini.getTime());
            beanConfigItem.setIdClaseOperacion(xClaseOperacion.get(cbo_ClaseOperacion.getSelectedIndex()).getIdClaseOperacion());
            beanConfigItem.setClaseOperacion(xClaseOperacion.get(cbo_ClaseOperacion.getSelectedIndex()).getDescrpcion());
            beanConfigItem.setFechaIni(ini);
            beanConfigItem.setEstado("A");
            beanConfigItem.setOperacion("I");
            dialog.setValueSearch(beanConfigItem, comp);
            dispose();
        }
    }
}
