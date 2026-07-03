/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformclientecredito;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ClienteCredito;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.math.BigDecimal;
import javax.swing.BorderFactory;
import javax.swing.JButton;
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
public class UiFormClienteCredito extends JDialog implements InterUiFormClienteCredito, ActionListener{
    
    private JHDialog dialog;
    private Component comp;
    private JPanel pnlContenedor;
    private JPanel pnlForm;
    private JPanel pnlAccion;
    private JButton btnProccess;
    private boolean swTemp;
    private JTextField txtMotivo;
    private JTextField txtMonto;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;

    public UiFormClienteCredito(JHDialog arg0,Component comp,boolean sw){
        super(arg0);
        this.dialog=arg0;
        this.comp=comp;
        this.swTemp=sw;
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
        
        JLabel lblMotivo=new JLabel("Motivo");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblMotivo,gbc);
        
        txtMotivo=new JTextField();
        txtMotivo.setDocument(new UpperCaseDocument(50));
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtMotivo,gbc);
        
        JLabel lblMonto=new JLabel("Monto");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblMonto,gbc);
        
        txtMonto=new JTextField();
        txtMonto.setDocument(new DoubleDocument());
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtMonto,gbc);
        
        JLabel lblFechaIni=new JLabel("F Inicio");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblFechaIni,gbc);
        
        dc_fechainicio = new JDateChooser(new java.util.Date());
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(dc_fechainicio,gbc);
        
        JLabel lblFechaFin=new JLabel("F Fin");
        lblFechaFin.setVisible(swTemp);
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblFechaFin,gbc);
        
        dc_fechafin = new JDateChooser(new java.util.Date());
        dc_fechafin.setVisible(swTemp);
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(dc_fechafin,gbc);
        
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
    }
    
    private void initStyle(){
        pnlForm.setBorder(BorderFactory.createEtchedBorder());
        pnlAccion.setBorder(BorderFactory.createEtchedBorder());
    }
    
    private void initListener(){
        btnProccess.addActionListener(this);
    }
    
    private boolean validarData(){
        if (txtMotivo.getText().trim().length()==0){
            JOptionPane.showMessageDialog(this, "Ingrese Motivo");
            txtMotivo.setBorder(new LineBorder(Color.RED));
            txtMotivo.requestFocus();
            return false;
        }
        if (txtMonto.getText().trim().length()==0){
            JOptionPane.showMessageDialog(this, "Ingrese Monto");
            txtMonto.setBorder(new LineBorder(Color.RED));
            txtMonto.requestFocus();
            return false;
        }
        if (swTemp){
            //validar Fechas
        }
        return true;
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource()==btnProccess){
            if (!validarData()){
                return;
            }
            ClienteCredito beanClienteCredito=new ClienteCredito();
            beanClienteCredito.setMotivo(txtMotivo.getText().trim());
            beanClienteCredito.setMonto(new BigDecimal(txtMonto.getText().trim()));
            java.util.Date fechaini = dc_fechainicio.getDate();
            java.sql.Date ini = new java.sql.Date(fechaini.getTime());
            beanClienteCredito.setFecha_inicio(ini);
            beanClienteCredito.setFlagTemporal("N");
            if (swTemp){
                beanClienteCredito.setFlagTemporal("S");
                java.util.Date fechafin = dc_fechainicio.getDate();
                java.sql.Date fin = new java.sql.Date(fechafin.getTime());
                beanClienteCredito.setFecha_fin(fin);
            }
            beanClienteCredito.setEstado("A");
            beanClienteCredito.setOperacion("I");
            dialog.setValueSearch(beanClienteCredito, comp);
            dispose();
        }
    }
    
}
