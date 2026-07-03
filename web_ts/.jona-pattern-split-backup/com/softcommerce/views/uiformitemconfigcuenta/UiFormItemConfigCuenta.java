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

    private java.net.URL path;
    private JButton btnProcess;
    public Boolean swRegistro;
    private JComboBox cbo_ClaseOperacion;
    private List<ClaseOperacion> xClaseOperacion;
    private JComboBox cbo_Moneda;
    private List<BeanMoneda> xMoneda=new ArrayList<BeanMoneda>();
    private JDateChooser dc_fechainicio;
    private JHDialog dialog;
    private Component comp;
    private JTextField txtCuenta;
    private JCheckBox chkTransito;
    //private JCheckBox chkTransito;

    public UiFormItemConfigCuenta(JHDialog arg0, java.net.URL path, Component comp) {
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

    private void loadMoneda() {
        try {
            LoadCombo.loadMoneda(path, xMoneda, cbo_Moneda,
                    Constans.ITEM_INIT_MONEDA, 0);
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
        if (cbo_Moneda.getSelectedIndex() < 0) {
            JOptionPane.showMessageDialog(this, "Seleccione Moneda");
            cbo_Moneda.setBorder(new LineBorder(Color.RED));
            cbo_Moneda.requestFocus();
            return false;
        }
        if (txtCuenta.getText().length() < 5) {
            JOptionPane.showMessageDialog(this, "Ingrese Cuenta Correctamente");
            txtCuenta.setBorder(new LineBorder(Color.RED));
            txtCuenta.requestFocus();
            return false;
        }
        //Verificar Si no hay Ningun Dato
        if (((RegisterItem) dialog).modeltableConfigItemCuenta.getRowCount() > 0) {
            String id_clase_operacion = xClaseOperacion.get(cbo_ClaseOperacion.getSelectedIndex()).getIdClaseOperacion();
            String id_moneda = xMoneda.get(cbo_Moneda.getSelectedIndex()-1).getIdMoneda();
            String flagPdu = chkTransito.isSelected()?"S":"N";
            for (int i = 0; i < ((RegisterItem) dialog).modeltableConfigItemCuenta.getRowCount(); i++) {
                ConfigItemCuenta beanConfigItemCuenta = ((RegisterItem) dialog).modeltableConfigItemCuenta.getConfigItemCuenta(i);
                if (beanConfigItemCuenta.getIdClaseOperacion().equals(id_clase_operacion) && beanConfigItemCuenta.getIdMoneda().equals(id_moneda) && beanConfigItemCuenta.getFlagTransito().equals(flagPdu) && beanConfigItemCuenta.getEstado().equals("A")) {
                    JOptionPane.showMessageDialog(this, "Cuenta ya se Encuentra Activado");
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
