/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformitemcaracteristica;


import com.softcommerce.formularios.*;
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
public class UiFormItemCaracteristica extends JDialog implements InterUiFormItemCaracteristica, ActionListener {

    protected java.net.URL path;
    protected JButton btnProcess;
    public Boolean swRegistro;
    protected JComboBox cbo_Caracteristica;
    protected List<CaracteristicaItem> xCaracteristica;
    protected JDateChooser dc_fechainicio;
    protected JHDialog dialog;
    protected Component comp;
    protected JTextField txtValor;
    //private RegisterClienteNuevo register;

    public UiFormItemCaracteristica(JHDialog arg0, java.net.URL path, Component comp) {
        super(arg0);
        this.dialog = arg0;
        this.path = path;
        this.comp = comp;
        //this.register=register;
        initialize();
    }

    protected void initialize() {
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

    protected void loadCaracteritica() {
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
