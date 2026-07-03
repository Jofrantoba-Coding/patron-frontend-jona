/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.gui;

import com.softcommerce.comboboxmodel.ComboModelPadron;
import com.softcommerce.entity.Anexo;
import com.softcommerce.entity.PadronProveedor;
import com.softcommerce.entity.Padrones;
import com.softcommerce.formularios.RegisterProveedor;
import com.softcommerce.logic.LogicPadronProveedor;
import com.softcommerce.logic.LogicPadrones;
import com.softcommerce.util.Propiedad;
import com.toedter.calendar.JDateChooser;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.*;

/**
 *
 * @author root
 */
public class FormConfigPadronProveedor extends JPanel {

    private JLabel lblId;
    private JTextField txtid;
    private JLabel lblFechaInicio;
    private JDateChooser dc_fechainicio;
    private JLabel lblTipoOper;
    private JComboBox cboTipoOper;
    private JButton btnProcess;
    private ComboModelPadron cboModelPadron;
    private String codigoCliente;
    private RegisterProveedor register;

    public FormConfigPadronProveedor(String paramCodigoItem,RegisterProveedor paramregister) {
        register=paramregister;
        codigoCliente = paramCodigoItem;
        initComponents();
    }

    private void initComponents() {
        try {
            Propiedad p=new Propiedad();
        LogicPadrones lp=new LogicPadrones(p.getDbSys());
        ArrayList<Padrones> padrones=lp.listPadrones();
        padrones.remove(0);
            cboModelPadron = new ComboModelPadron(padrones);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(FormConfigPadronProveedor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            Logger.getLogger(FormConfigPadronProveedor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            Logger.getLogger(FormConfigPadronProveedor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(FormConfigPadronProveedor.class.getName()).log(Level.SEVERE, null, ex);
        }
        lblId = new JLabel("Codigo Anexo");
        txtid = new JTextField();
        txtid.setText(codigoCliente);
        txtid.setEnabled(false);
        lblFechaInicio = new JLabel("Fecha Inicio");
        dc_fechainicio = new JDateChooser(new java.util.Date());
        lblTipoOper = new JLabel("Padron");
        cboTipoOper = new JComboBox();
        cboTipoOper.setModel(cboModelPadron);
        btnProcess = new JButton("Guardar");
        GridBagConstraints gbc = new GridBagConstraints();
        this.setLayout(new GridBagLayout());
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.add(lblId, gbc);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.add(txtid, gbc);
        txtid.setColumns(10);
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.add(lblTipoOper, gbc);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.add(cboTipoOper, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.add(lblFechaInicio, gbc);
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.add(dc_fechainicio, gbc);
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.add(btnProcess, gbc);
        btnProcess.addActionListener(actionListener);
    }
    ActionListener actionListener = new ActionListener() {

        @Override
        public void actionPerformed(ActionEvent ae) {
            try {
                Propiedad p = new Propiedad();
                LogicPadronProveedor lci = new LogicPadronProveedor(p.getDbSys());
                Propiedad p2 = new Propiedad();
                LogicPadronProveedor lci2 = new LogicPadronProveedor(p2.getDbSys());
                PadronProveedor bean = new PadronProveedor();
                java.util.Date fechaini = dc_fechainicio.getDate();
                java.sql.Date ini = new java.sql.Date(fechaini.getTime());
                bean.setIdPadronProveedor(null);
                bean.setFechaIni(ini);
                bean.setEstado(true);
                Anexo anex=new Anexo();
                anex.setIdAnexo(codigoCliente);
                bean.setAnexo(anex);
                bean.setPadrones(((ComboModelPadron)cboTipoOper.getModel()).getElement(cboTipoOper.getSelectedIndex()));
                bean.setTipoOperacion("I");
                String msg=lci.mantPadronProveedor(bean);
                JOptionPane.showMessageDialog(null, msg);  
                register.getFormConfigPadron().getTableModelConfigPadron().setData(lci2.listPadronProveedor(codigoCliente));
                register.getFormConfigPadron().getTableModelConfigPadron().fireTableDataChanged();
            } catch (ArrayIndexOutOfBoundsException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.fillInStackTrace()+"\n"+"Seleccione un padrón");
            }catch (ClassNotFoundException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (InstantiationException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (IllegalAccessException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (Exception ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            }
        }
    };
}
