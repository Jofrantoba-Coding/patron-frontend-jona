/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.ItemPercepcion;
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
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JPanel;

/**
 *
 * @author Team Develtrex
 */
public class FormItemPercepcion extends JDialog implements ActionListener {

    private java.net.URL path;
    private JButton btnProcess;
    private boolean swRegistro;
    private JDateChooser dc_fecha;
    private JHDialog dialog;
    private Component comp;
    private int id_item_percepcion;

    public FormItemPercepcion(JHDialog arg0, java.net.URL path, Component comp, boolean sw, int id_item_percepcion) {
        super(arg0);
        this.dialog = arg0;
        this.path = path;
        this.comp = comp;
        this.swRegistro = sw;
        this.id_item_percepcion = id_item_percepcion;
        //this.register=register;
        initialize();
    }

    private void initialize() {
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);
        setTitle(swRegistro ? "Activar Percepcion" : "Desactivar Percepcion");
        setBackground(new Color(245, 245, 245));
        setContentPane(pnl);
        setModal(true);
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.setLayout(new GridBagLayout());

        CLabel lbl_Fecha = new CLabel(swRegistro ? "Fecha Inicio" : "Fecha Fin");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Fecha, gbc);
        dc_fecha = new JDateChooser(new java.util.Date());
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(dc_fecha, gbc);

        btnProcess = new JButton(swRegistro ? "Activar" : "Desactivar");
        btnProcess.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(btnProcess, gbc);
        setSize(300, 150);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);

    }

    private boolean verificarValido() {
        //Verificar Si no hay Ningun Dato
        if (((RegisterItem) dialog).modeltableItemPercepcion.getRowCount() > 0) {
            if (swRegistro) {
                java.util.Date fechaini = dc_fecha.getDate();
                java.sql.Date ini = new java.sql.Date(fechaini.getTime());
                /*if (((RegisterItemNuevo) dialog).modeltableItemPercepcion.getItemPercepcion(((RegisterItemNuevo) dialog).modeltableItemPercepcion.getRowCount()-1).getFecha_fin()>=ini){
                    
                 }*/
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
            ItemPercepcion beanItemPercepcion = new ItemPercepcion();
            java.util.Date fecha = dc_fecha.getDate();
            java.sql.Date fcha = new java.sql.Date(fecha.getTime());
            beanItemPercepcion.setIdItemPercepcion(id_item_percepcion);
            if (swRegistro) {
                beanItemPercepcion.setFechaIni(fcha);
                beanItemPercepcion.setEstado("A");
                beanItemPercepcion.setOperacion("I");
            } else {
                beanItemPercepcion.setFechaFin(fcha);
                beanItemPercepcion.setEstado("D");
                beanItemPercepcion.setOperacion("A");
            }
            dialog.setValueSearch(beanItemPercepcion, comp);
            dispose();
        }
    }
}
