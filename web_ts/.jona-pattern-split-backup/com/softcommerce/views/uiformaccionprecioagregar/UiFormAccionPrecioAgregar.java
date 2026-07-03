/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformaccionprecioagregar;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.AccionPrecio;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
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
public class UiFormAccionPrecioAgregar extends JDialog implements InterUiFormAccionPrecioAgregar, ActionListener {

    private java.net.URL path;
    private JButton btnAceptar;
    public boolean swRegistro;
    private JDateChooser dcFecha;
    private Component comp;
    private JTextField txtPrecio;
    private JDialog dialogPadre;
    private AccionPrecio objAccionPrecio;

    public UiFormAccionPrecioAgregar(JDialog arg0, java.net.URL path, Component comp, boolean swReg) {
        super(arg0);
        this.dialogPadre = arg0;
        this.path = path;
        this.comp = comp;
        this.swRegistro = swReg;
        initialize();
    }

    public UiFormAccionPrecioAgregar(JDialog arg0, java.net.URL path, Component comp, boolean swReg, AccionPrecio objAccionPrecio) {
        super(arg0);
        this.dialogPadre = arg0;
        this.path = path;
        this.comp = comp;
        this.swRegistro = swReg;
        this.objAccionPrecio = objAccionPrecio;
        initialize();
    }

    private void initialize() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        setContentPane(pnl);
        setTitle((swRegistro ? "Activar" : "Desactivar") + " Precio");
        setModal(true);
        GridBagConstraints gbc = new GridBagConstraints();
        JLabel lblPrecio = new JLabel("Precio");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnl.add(lblPrecio, gbc);
        txtPrecio = new JTextField();
        txtPrecio.setDocument(new DoubleDocument());
        gbc.gridx = 1;
        txtPrecio.setEnabled(swRegistro);
        if (!swRegistro) {
            txtPrecio.setText(objAccionPrecio.getPrecio().toString());
        }
        pnl.add(txtPrecio, gbc);
        JLabel lblFecha = new JLabel("Fecha " + (swRegistro ? "Inicio" : "Fin"));
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnl.add(lblFecha, gbc);
        dcFecha = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFecha.setDate(new java.util.Date());
        gbc.gridx = 1;
        pnl.add(dcFecha, gbc);
        btnAceptar = new JButton(swRegistro ? "Activar" : "Desactivar");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 2;
        pnl.add(btnAceptar, gbc);
        pack();
        ComponentToolKit.centerComponentPosicion(this);
        btnAceptar.addActionListener(this);
        setVisible(true);
    }

    private boolean verificarValido() {
        if (txtPrecio.getText().length() == 0) {
            JOptionPane.showMessageDialog(this, "Ingrese Precio");
            txtPrecio.setBorder(new LineBorder(Color.RED));
            txtPrecio.requestFocus();
            return false;
        }
        if (swRegistro){
        }else{
            java.util.Date fechaini = dcFecha.getDate();
            java.sql.Date fecha = new java.sql.Date(fechaini.getTime());
            if (!fecha.after(objAccionPrecio.getFechaIni())){
                JOptionPane.showMessageDialog(this, "Fecha es menor a fecha inicial");
            }
        }
        //Verificar Si no hay Ningun Dato
        if (((FormAccionSocio) dialogPadre).modeltableAccionPrecio.getRowCount() > 0) {
            /*int id_caracteristica=xCaracteristica.get(cbo_Caracteristica.getSelectedIndex()).getId_caracteristica();
             for (int i = 0; i < ((RegisterItemNuevo) dialog).modeltableCaracteristica.getRowCount(); i++) {
             CaracteristicaItemDetalle beanCaracteristicaItemDetalle = ((RegisterItemNuevo) dialog).modeltableCaracteristica.getCaracteristicaItemDetalle(i);
             if (beanCaracteristicaItemDetalle.getBeanCaracteristicaItem().getId_caracteristica()==id_caracteristica && beanCaracteristicaItemDetalle.getEstado().equals("A")) {
             JOptionPane.showMessageDialog(this, "Caracteristica ya se Encuentra Activado");
             return false;
             }
             }*/
        }
        return true;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnAceptar) {
            if (!verificarValido()) {
                return;
            }
            AccionPrecio beanAccionPrecio = new AccionPrecio();
            beanAccionPrecio.setEstado(swRegistro ? "A" : "D");
            java.util.Date fechaini = dcFecha.getDate();
            java.sql.Date fecha = new java.sql.Date(fechaini.getTime());
            if (swRegistro) {
                beanAccionPrecio.setFechaIni(fecha);
                beanAccionPrecio.setPrecio(new BigDecimal(txtPrecio.getText().trim()));
                beanAccionPrecio.setOperacion("I");
            }else{
                beanAccionPrecio.setFechaFin(fecha);
                beanAccionPrecio.setOperacion("A");
            }
            ((FormAccionSocio) dialogPadre).setValueSearch(beanAccionPrecio, comp);
            dispose();
        }
    }
}
