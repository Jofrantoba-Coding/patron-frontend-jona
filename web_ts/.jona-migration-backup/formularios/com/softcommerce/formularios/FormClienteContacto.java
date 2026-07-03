/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.ClienteContacto;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;

/**
 *
 * @author Team Develtrex
 */
public class FormClienteContacto extends JDialog implements ActionListener{

    private JHDialog dialog;
    private Component comp;
    private JPanel pnlContenedor;
    private JPanel pnlForm;
    private JPanel pnlAccion;
    private JTextField txtPaterno;
    private JTextField txtMaterno;
    private JTextField txtNombre;
    private JTextField txtCorreo;
    private JTextField txtTelef;
    private JTextField txtCelular;
    private JButton btnProccess;
    
    public FormClienteContacto(JHDialog arg0,Component comp){
        super(arg0);
        this.dialog=arg0;
        this.comp=comp;
        initComponents();
        initStyle();
        initListener();
        this.pack();
        this.setVisible(true);
    }
    
    private void initComponents(){
        setTitle("Agregar Contacto");
        pnlContenedor=new JPanel();
        pnlContenedor.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Datos de Zona", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlForm=new JPanel();
        pnlForm.setBorder(border);
        pnlAccion=new JPanel();
        pnlAccion.setLayout(new BorderLayout());
        this.pnlForm.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        JLabel lblPaterno=new JLabel("Paterno");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblPaterno,gbc);
        
        txtPaterno=new JTextField();
        txtPaterno.setColumns(10);
        txtPaterno.setDocument(new UpperCaseDocument(50));
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtPaterno,gbc);
        
        JLabel lblMaterno=new JLabel("Materno");
        gbc.gridx = 2;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblMaterno,gbc);
        
        txtMaterno=new JTextField();
        txtMaterno.setColumns(10);
        txtMaterno.setDocument(new UpperCaseDocument(50));
        gbc.gridx = 3;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtMaterno,gbc);
        
        JLabel lblNombre=new JLabel("Nombres");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblNombre,gbc);
        
        txtNombre=new JTextField();
        //txtNombre.setColumns(50);
        txtNombre.setDocument(new UpperCaseDocument(50));
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.gridwidth=3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtNombre,gbc);
        
        JLabel lblCorreo=new JLabel("Correo");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth=1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblCorreo,gbc);
        
        txtCorreo=new JTextField();
        //txtNombre.setColumns(10);
        //txtCorreo.setDocument(new UpperCaseDocument(50));
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.gridwidth=3;
        //gbc.gridwidth=3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtCorreo,gbc);
        
        JLabel lblTelef=new JLabel("Telef");
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.gridwidth=1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblTelef,gbc);
        
        txtTelef=new JTextField();
        gbc.gridwidth=1;
        txtTelef.setDocument(new IntegerDocument(15));
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtTelef,gbc);
        
        JLabel lblCelular=new JLabel("Celular");
        gbc.gridwidth=1;
        gbc.gridx = 2;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(lblCelular,gbc);
        
        txtCelular=new JTextField();
        txtCelular.setDocument(new IntegerDocument(15));
        gbc.gridx = 3;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        this.pnlForm.add(txtCelular,gbc);
        
        btnProccess=new JButton("Guardar");
        this.pnlAccion.add(btnProccess);
        
        pnlContenedor.add(pnlForm,BorderLayout.CENTER);
        pnlContenedor.add(pnlAccion,BorderLayout.SOUTH);
        this.setLayout(new BorderLayout());
        this.getContentPane().add(pnlContenedor);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setMinimumSize(new Dimension(400,150));
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
        if (txtPaterno.getText().trim().length()==0){
            JOptionPane.showMessageDialog(this, "Ingrese Apellido Paterno");
            txtPaterno.setBorder(new LineBorder(Color.RED));
            txtPaterno.requestFocus();
            return false;
        }
        if (txtMaterno.getText().trim().length()==0){
            JOptionPane.showMessageDialog(this, "Ingrese Apellido Materno");
            txtMaterno.setBorder(new LineBorder(Color.RED));
            txtMaterno.requestFocus();
            return false;
        }
        if (txtNombre.getText().trim().length()==0){
            JOptionPane.showMessageDialog(this, "Ingrese Nombres");
            txtNombre.setBorder(new LineBorder(Color.RED));
            txtNombre.requestFocus();
            return false;
        }
        return true;
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource()==btnProccess){
            if (!validarData()){
                return;
            }
            ClienteContacto beanClienteContacto=new ClienteContacto();
            beanClienteContacto.setPaterno(txtPaterno.getText().trim());
            beanClienteContacto.setMaterno(txtMaterno.getText().trim());
            beanClienteContacto.setNombre(txtNombre.getText().trim());
            beanClienteContacto.setCorreo(txtCorreo.getText().trim());
            beanClienteContacto.setCelular(txtCelular.getText().trim());
            beanClienteContacto.setTelefono(txtTelef.getText().trim());
            beanClienteContacto.setEstado("A");
            beanClienteContacto.setOperacion("I");
            dialog.setValueSearch(beanClienteContacto, comp);
            dispose();
        }
    }
    
}
