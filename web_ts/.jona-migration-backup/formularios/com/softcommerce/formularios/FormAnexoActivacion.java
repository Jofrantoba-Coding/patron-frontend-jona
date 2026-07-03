/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
//import com.softcommerce.iconos.Gif;
import com.toedter.calendar.JDateChooser;
import java.awt.Color;
//import java.awt.Component;
//import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
//import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
//import javax.swing.border.Border;
//import javax.swing.border.TitledBorder;

/**
 *
 * @author Team Develtrex
 */
public class FormAnexoActivacion extends JDialog implements ActionListener{

    private java.net.URL path;
    private String tipo;
    private String tipo_anexo;
    private JLabel lblFechaInicio;
    private JLabel lblMotivo;
    private JDateChooser dc_fechainicio;
    private JTextField txtMotivo;
    private JButton btnProcess;
    public Boolean swRegistro;
    
    public FormAnexoActivacion(JHDialog arg0,java.net.URL path,String tipo,String tipoAnexo){
        super(arg0);
        this.path = path;
        this.tipo=tipo;
        this.tipo_anexo=tipoAnexo;
        initialize();
    }
    
    private void initialize(){
        //Gif gif = new Gif();
        swRegistro=false;
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243,248,252));
        pnl.setOpaque(false);
        pnl.setLayout(null);
        setTitle((tipo.equals("A")?"Activar ":"Desactivar ")+ tipo_anexo);
        setBackground(new Color(245,245,245));
	setContentPane(pnl);
	setModal(true);
	setResizable(false);
        //Border border = BorderFactory.createTitledBorder(null, "Datos", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        //pnl.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.setLayout(new GridBagLayout());
        lblFechaInicio = new JLabel((tipo.equals("A")?"Fecha Inicio":"Fecha Fin"));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lblFechaInicio, gbc);
        dc_fechainicio = new JDateChooser(new java.util.Date());
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(dc_fechainicio, gbc);
        lblMotivo = new JLabel("Motivo de " + (tipo.equals("A")?"Activacion":"Desactivacion"));
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lblMotivo, gbc);
        txtMotivo = new JTextField();
        txtMotivo.setDocument(new UpperCaseNumberDocument(100));
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(txtMotivo, gbc);
        btnProcess = new JButton((tipo.equals("A")?"Activar":"Desactivar"));
        btnProcess.addActionListener(this);
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth=2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(btnProcess, gbc);
	setSize(300,200);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);
    }

    public JDateChooser getDc_fechainicio() {
        return dc_fechainicio;
    }

    public JTextField getTxtMotivo() {
        return txtMotivo;
    }
    
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if(e.getSource() == btnProcess){
            if (txtMotivo.getText().trim().length()==0){
                JOptionPane.showMessageDialog(null, "Ingrese Motivo");
                return ;
            }
            swRegistro=true;
            dispose();
        }
    }
    
}
