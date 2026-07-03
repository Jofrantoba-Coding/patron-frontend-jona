/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformitemconfigcuenta;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ConfigItemCuenta;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.entity.ClaseOperacion;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.util.Constans;
import com.softcommerce.util.combo.LoadCombo;
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
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiFormItemConfigCuenta 
        extends JDialog 
        implements InterUiFormItemConfigCuenta, ActionListener {

    protected java.net.URL path;
    protected JButton btnProcess;
    public Boolean swRegistro;
    protected JComboBox cbo_ClaseOperacion;
    protected List<ClaseOperacion> xClaseOperacion;
    protected JComboBox cbo_Moneda;
    protected List<BeanMoneda> xMoneda=new ArrayList<BeanMoneda>();
    protected JDateChooser dc_fechainicio;
    protected JHDialog dialog;
    protected Component comp;
    protected JTextField txtCuenta;
    protected JCheckBox chkTransito;
    //private JCheckBox chkTransito;

    public UiFormItemConfigCuenta(JHDialog arg0, java.net.URL path, Component comp) {
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
        setTitle("Agregar Cuenta");
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

        CLabel lbl_Moneda = new CLabel("Moneda");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Moneda, gbc);

        cbo_Moneda = new JComboBox();
        cbo_Moneda.addActionListener(this);
        //cbo_Padron.setModel(cboModelPadron);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Moneda, gbc);

        //
        CLabel lbl_Cuenta = new CLabel("Cuenta");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Cuenta, gbc);

        txtCuenta = new JTextField();
        txtCuenta.setDocument(new IntegerDocument(6));
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(txtCuenta, gbc);
        
        chkTransito = new JCheckBox("Transito");
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(chkTransito, gbc);

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
        loadClaseOperacion();
        loadMoneda();
        setSize(350, 250);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);

    }

    protected void loadClaseOperacion() {
    }

    protected void loadMoneda() {
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
            ConfigItemCuenta beanConfigItemCuenta = new ConfigItemCuenta();
            //beanCaracteristicaItemDetalle.setId_padron(((ComboModelPadron) cbo_Padron.getModel()).getElement(cbo_Padron.getSelectedIndex()).getIdPadron());
            java.util.Date fechaini = dc_fechainicio.getDate();
            java.sql.Date ini = new java.sql.Date(fechaini.getTime());
            beanConfigItemCuenta.setIdClaseOperacion(xClaseOperacion.get(cbo_ClaseOperacion.getSelectedIndex()).getIdClaseOperacion());
            beanConfigItemCuenta.setClaseOperacion(xClaseOperacion.get(cbo_ClaseOperacion.getSelectedIndex()).getDescrpcion());
            beanConfigItemCuenta.setIdMoneda(xMoneda.get(cbo_Moneda.getSelectedIndex()-1).getIdMoneda());
            beanConfigItemCuenta.setMoneda(xMoneda.get(cbo_Moneda.getSelectedIndex()-1).getAbreviatura());
            beanConfigItemCuenta.setCuenta(txtCuenta.getText().trim());
            beanConfigItemCuenta.setFlagTransito(chkTransito.isSelected()?"S":"N");
            beanConfigItemCuenta.setFechaIni(ini);
            beanConfigItemCuenta.setEstado("A");
            beanConfigItemCuenta.setOperacion("I");
            dialog.setValueSearch(beanConfigItemCuenta, comp);
            dispose();
        }
        if (e.getSource()==cbo_ClaseOperacion){
            if (cbo_ClaseOperacion.getSelectedIndex()>=0){
                //chkTransito.setVisible(xClaseOperacion.get(cbo_ClaseOperacion.getSelectedIndex()).getIdClaseOperacion().equals("001"));
                if (xClaseOperacion.get(cbo_ClaseOperacion.getSelectedIndex()).getIdClaseOperacion().equals("001")){
                    chkTransito.setVisible(true);
                }else{
                    chkTransito.setVisible(false);
                    chkTransito.setSelected(false);
                }
            }
        }
    }
    
}
