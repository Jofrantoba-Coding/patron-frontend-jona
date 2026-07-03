/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.ClienteCuenta;
import com.softcommerce.beans.TablaDetalleSunat;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.reglasnegocio.RnTablaDetalleSunat;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;

/**
 *
 * @author Team Develtrex
 */
public class FormClienteCuenta extends JDialog implements ActionListener{

    private JHDialog dialog;
    private Component comp;
    private java.net.URL path;
    private JPanel pnlContenedor;
    private JPanel pnlForm;
    private JPanel pnlAccion;
    private JButton btnProccess;
    private JComboBox cbo_Banco;
    private List<TablaDetalleSunat> xBanco;
    private JTextField txtDescripcion;
    private JTextField txtNumCuenta;
    
    public FormClienteCuenta(JHDialog arg0,java.net.URL path,Component comp){
        super(arg0);
        this.dialog=arg0;
        this.comp=comp;
        this.path=path;
        initComponents();
        initStyle();
        initListener();
        this.pack();
        this.setVisible(true);
    }
    
    private void initComponents(){
        setTitle("Agregar Cuenta");
        pnlContenedor=new JPanel();
        pnlContenedor.setLayout(new BorderLayout());
        pnlForm=new JPanel();
        pnlAccion=new JPanel();
        pnlAccion.setLayout(new BorderLayout());
        this.pnlForm.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        
        JLabel lblBanco=new JLabel("Banco");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblBanco,gbc);
        
        cbo_Banco=new JComboBox();
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(cbo_Banco,gbc);
        
        JLabel lblDescipcion=new JLabel("Nombre");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblDescipcion,gbc);
        
        txtDescripcion=new JTextField();
        txtDescripcion.setEnabled(false);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtDescripcion,gbc);
        
        JLabel lblCuenta=new JLabel("Cuenta");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblCuenta,gbc);
        
        txtNumCuenta=new JTextField();
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtNumCuenta,gbc);
        
        btnProccess=new JButton("Guardar");
        this.pnlAccion.add(btnProccess);
        
        pnlContenedor.add(pnlForm,BorderLayout.CENTER);
        pnlContenedor.add(pnlAccion,BorderLayout.SOUTH);
        this.setLayout(new BorderLayout());
        this.getContentPane().add(pnlContenedor);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setMinimumSize(new Dimension(250,150));
        ComponentToolKit.centerComponentPosicion(this);
        setModal(true);
        loadBanco();
    }
    
    private void initStyle(){
        pnlForm.setBorder(BorderFactory.createEtchedBorder());
        pnlAccion.setBorder(BorderFactory.createEtchedBorder());
    }
    
    private void initListener(){
        btnProccess.addActionListener(this);
        cbo_Banco.addActionListener(this);
    }
    
    private void loadBanco(){
        try {
            RnCliente logic=new RnCliente(path);
            RnTablaDetalleSunat rn_DetalleSunat=new RnTablaDetalleSunat(path);
            if (xBanco != null) {
                xBanco.clear();
            } else {
                xBanco = new ArrayList<TablaDetalleSunat>();   
            }
            xBanco.addAll(rn_DetalleSunat.listarDetalleSunat(3));
            cbo_Banco.removeAllItems();
            cbo_Banco.addItem("--- Seleccione un Banco ---");

            for (int i = 0; i < xBanco.size(); i++) {
                cbo_Banco.addItem(xBanco.get(i).getDescripcion());
            }

            cbo_Banco.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }
    
    private boolean validarData(){
        if (cbo_Banco.getSelectedIndex()==0){
            JOptionPane.showMessageDialog(this, "Seleccione Banco");
            cbo_Banco.setBorder(new LineBorder(Color.RED));
            cbo_Banco.requestFocus();
            return false;
        }
        if (txtDescripcion.getText().trim().length()==0){
            JOptionPane.showMessageDialog(this, "Ingrese Nombre de Banco");
            txtDescripcion.setBorder(new LineBorder(Color.RED));
            txtDescripcion.requestFocus();
            return false;
        }
        if (txtNumCuenta.getText().trim().length()==0){
            JOptionPane.showMessageDialog(this, "Ingrese Numero de Cuenta");
            txtNumCuenta.setBorder(new LineBorder(Color.RED));
            txtNumCuenta.requestFocus();
            return false;
        }
        return true;
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_Banco==e.getSource()){
            if (cbo_Banco.getItemCount() > 0) {
                if (cbo_Banco.getSelectedIndex() == 0) {
                    txtDescripcion.setEnabled(false);
                    txtDescripcion.setText("");
                }else{
                    if (xBanco.get(cbo_Banco.getSelectedIndex() - 1).getIdDetalleSunat()==58){
                        txtDescripcion.setEnabled(true);
                        txtDescripcion.setText("");
                    }else{
                        txtDescripcion.setEnabled(false);
                        txtDescripcion.setText(cbo_Banco.getSelectedItem().toString());
                    }
                }
            }
        }
        if (e.getSource()==btnProccess){
            if (!validarData()){
                return;
            }
            ClienteCuenta beanClienteCuenta=new ClienteCuenta();
            beanClienteCuenta.setId_cuenta(xBanco.get(cbo_Banco.getSelectedIndex() - 1).getIdDetalleSunat());
            beanClienteCuenta.setDescr_cuenta(txtDescripcion.getText().trim());
            beanClienteCuenta.setNum_cuenta(txtNumCuenta.getText().trim());
            beanClienteCuenta.setEstado("A");
            beanClienteCuenta.setOperacion("I");
            dialog.setValueSearch(beanClienteCuenta, comp);
            dispose();
        }
    }
    
}
