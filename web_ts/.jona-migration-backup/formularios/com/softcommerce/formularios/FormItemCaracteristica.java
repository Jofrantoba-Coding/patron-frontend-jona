/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.CaracteristicaItem;
import com.softcommerce.beans.CaracteristicaItemDetalle;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.logic.LogicCaracteristicaItem;
import com.toedter.calendar.JDateChooser;
import java.awt.Color;
import java.awt.Component;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComboBox;
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
public class FormItemCaracteristica extends JDialog implements ActionListener {

    private java.net.URL path;
    private JButton btnProcess;
    public Boolean swRegistro;
    private JComboBox cbo_Caracteristica;
    private List<CaracteristicaItem> xCaracteristica;
    private JDateChooser dc_fechainicio;
    private JHDialog dialog;
    private Component comp;
    private JTextField txtValor;
    //private RegisterClienteNuevo register;

    public FormItemCaracteristica(JHDialog arg0, java.net.URL path, Component comp) {
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
        CLabel lbl_Departamento = new CLabel("Caracteristica");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Departamento, gbc);

        cbo_Caracteristica = new JComboBox();
        cbo_Caracteristica.addActionListener(this);
        //cbo_Padron.setModel(cboModelPadron);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Caracteristica, gbc);

        JLabel lblValor = new JLabel("Valor");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lblValor, gbc);

        txtValor = new JTextField();
        txtValor.setDocument(new DoubleDocument());
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(txtValor, gbc);

        CLabel lbl_Fecha = new CLabel("Fecha Inicio");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Fecha, gbc);
        dc_fechainicio = new JDateChooser(new java.util.Date());
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(dc_fechainicio, gbc);

        btnProcess = new JButton("Activar");
        btnProcess.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(btnProcess, gbc);
        loadCaracteritica();
        setSize(350, 200);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);

    }

    private void loadCaracteritica() {
        try {
            LogicCaracteristicaItem logicCaracteristicaItem = new LogicCaracteristicaItem(path);
            if (xCaracteristica != null) {
                xCaracteristica.clear();
            } else {
                xCaracteristica = new ArrayList<CaracteristicaItem>();
            }

            xCaracteristica.addAll(logicCaracteristicaItem.listarCaracteristicaItem());

            cbo_Caracteristica.removeAllItems();
            for (int i = 0; i < xCaracteristica.size(); i++) {
                cbo_Caracteristica.addItem(xCaracteristica.get(i).getDescripcion());
            }

            cbo_Caracteristica.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private boolean verificarValido() {
        if (cbo_Caracteristica.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione caracteristica");
            cbo_Caracteristica.setBorder(new LineBorder(Color.RED));
            cbo_Caracteristica.requestFocus();
            return false;
        }
        if (txtValor.getText().length()==0) {
            JOptionPane.showMessageDialog(this, "Ingrese Valor");
            txtValor.setBorder(new LineBorder(Color.RED));
            txtValor.requestFocus();
            return false;
        }
        //Verificar Si no hay Ningun Dato
        if (((RegisterItem) dialog).modeltableCaracteristica.getRowCount() > 0) {
            //String idcaracteri = ((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron();
            int id_caracteristica=xCaracteristica.get(cbo_Caracteristica.getSelectedIndex()).getId_caracteristica();
            //System.out.println(idPadron);
            //Verificar si no hay ningun Registro Activado
            //boolean swfecha=false;
            for (int i = 0; i < ((RegisterItem) dialog).modeltableCaracteristica.getRowCount(); i++) {
                CaracteristicaItemDetalle beanCaracteristicaItemDetalle = ((RegisterItem) dialog).modeltableCaracteristica.getCaracteristicaItemDetalle(i);
                if (beanCaracteristicaItemDetalle.getBeanCaracteristicaItem().getId_caracteristica()==id_caracteristica && beanCaracteristicaItemDetalle.getEstado().equals("A")) {
                    JOptionPane.showMessageDialog(this, "Caracteristica ya se Encuentra Activado");
                    return false;
                }
                /*if (beanClientePadron.getId_padron().equals(idPadron) && beanClientePadron.getEstado().equals("D")) {
                    java.util.Date fechaini = dc_fechainicio.getDate();
                    java.sql.Date ini = new java.sql.Date(fechaini.getTime());
                    System.out.println(ini.compareTo(beanClientePadron.getFecfin()));
                }*/
            }
        }
        //JOptionPane.showMessageDialog(this, ((ComboModelPadron)cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()));
        return true;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnProcess) {
            if (!verificarValido()) {
                return;
            }
            //
            CaracteristicaItemDetalle beanCaracteristicaItemDetalle = new CaracteristicaItemDetalle();
            //beanCaracteristicaItemDetalle.setId_padron(((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron());
            beanCaracteristicaItemDetalle.setBeanCaracteristicaItem(xCaracteristica.get(cbo_Caracteristica.getSelectedIndex()));
            java.util.Date fechaini = dc_fechainicio.getDate();
            java.sql.Date ini = new java.sql.Date(fechaini.getTime());
            beanCaracteristicaItemDetalle.setFechaInicio(ini);
            beanCaracteristicaItemDetalle.setEstado("A");
            beanCaracteristicaItemDetalle.setOperacion("I");
            beanCaracteristicaItemDetalle.setValor(new BigDecimal(txtValor.getText()));
            dialog.setValueSearch(beanCaracteristicaItemDetalle, comp);
            dispose();
        }
    }
}
