/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformitemconfigdscto;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ConfigItemDscto;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.JHDialog;
import com.toedter.calendar.JDateChooser;
import java.awt.Color;
import java.awt.Component;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.math.BigDecimal;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiFormItemConfigDscto extends JDialog implements InterUiFormItemConfigDscto, ActionListener {

    private java.net.URL path;
    private JButton btnProcess;
    public Boolean swRegistro;
    private JDateChooser dc_fechainicio;
    private JHDialog dialog;
    private Component comp;
    private JTextField txtValor;
    //private RegisterClienteNuevo register;

    public UiFormItemConfigDscto(JHDialog arg0, java.net.URL path, Component comp) {
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
        setTitle("Agregar Descuento");
        setBackground(new Color(245, 245, 245));
        setContentPane(pnl);
        setModal(true);
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.setLayout(new GridBagLayout());

        JLabel lblValor = new JLabel("Dscto");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lblValor, gbc);

        txtValor = new JTextField();
        txtValor.setDocument(new DoubleDocument());
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(txtValor, gbc);

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
        setSize(350, 200);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);

    }

    private boolean verificarValido() {
        if (txtValor.getText().length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese Valor");
            txtValor.setBorder(new LineBorder(Color.RED));
            txtValor.requestFocus();
            return false;
        }
        //Verificar Si no hay Ningun Dato
        /*if (((RegisterItemNuevo) dialog).modeltableCaracteristica.getRowCount() > 0) {
         int id_caracteristica=xCaracteristica.get(cbo_Caracteristica.getSelectedIndex()).getId_caracteristica();
         for (int i = 0; i < ((RegisterItemNuevo) dialog).modeltableCaracteristica.getRowCount(); i++) {
         CaracteristicaItemDetalle beanCaracteristicaItemDetalle = ((RegisterItemNuevo) dialog).modeltableCaracteristica.getCaracteristicaItemDetalle(i);
         if (beanCaracteristicaItemDetalle.getBeanCaracteristicaItem().getId_caracteristica()==id_caracteristica && beanCaracteristicaItemDetalle.getEstado().equals("A")) {
         JOptionPane.showMessageDialog(this, "Caracteristica ya se Encuentra Activado");
         return false;
         }
         }
         }*/
        return true;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnProcess) {
            if (!verificarValido()) {
                return;
            }
            ConfigItemDscto beanConfigItemDscto = new ConfigItemDscto();
            java.util.Date fechaini = dc_fechainicio.getDate();
            java.sql.Date ini = new java.sql.Date(fechaini.getTime());
            beanConfigItemDscto.setFechaInicio(ini);
            beanConfigItemDscto.setEstado("A");
            beanConfigItemDscto.setOperacion("I");
            beanConfigItemDscto.setPorcentajeDscto(new BigDecimal(txtValor.getText()));
            dialog.setValueSearch(beanConfigItemDscto, comp);
            dispose();
        }
    }
}
