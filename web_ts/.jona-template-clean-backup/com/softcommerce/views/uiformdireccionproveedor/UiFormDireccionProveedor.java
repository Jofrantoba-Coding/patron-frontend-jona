/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformdireccionproveedor;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.ProveedorDireccion;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.logic.LogicDireccionProveedor;
import com.softcommerce.reglasnegocio.RnUbigeo;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
//import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
//import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
//import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
//import javax.swing.border.Border;
//import javax.swing.border.TitledBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiFormDireccionProveedor extends JDialog implements InterUiFormDireccionProveedor, ActionListener{

    protected java.net.URL path;
    protected JButton btnProcess;
    public Boolean swRegistro;
    protected JComboBox cbo_Departamento;
    protected List<Ubigeo> xDepartamento;
    protected JComboBox cbo_Provincia;
    protected List<Ubigeo> xProvincia;
    protected JComboBox cbo_Distrito;
    protected List<Ubigeo> xDistrito;
    protected JTextField txt_Direccion;
    protected JHDialog dialog;
    protected Component comp;
    protected Anexo objAnexo;
    
    public UiFormDireccionProveedor(JHDialog arg0,java.net.URL path,Component comp){
        super(arg0);
        this.dialog=arg0;
        this.path = path;
        this.comp=comp;
        initialize();        
    }
    
    protected void setAnexo(Anexo anexo){
        objAnexo = anexo;
    }
    protected void initialize(){
        swRegistro=false;
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243,248,252));
        pnl.setOpaque(false);
        pnl.setLayout(null);
        setTitle("Agregar Direccion");
        setBackground(new Color(245,245,245));
	setContentPane(pnl);
	setModal(true);
	//setResizable(false);
        GridBagConstraints gbc = new GridBagConstraints();
        pnl.setLayout(new GridBagLayout());
        CLabel lbl_Departamento = new CLabel("Departamento");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Departamento, gbc);
        
        cbo_Departamento = new JComboBox();
        cbo_Departamento.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Departamento, gbc);
        
        CLabel lbl_Provincia = new CLabel("Provincia");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Provincia, gbc);
        cbo_Provincia = new JComboBox();
        cbo_Provincia.addActionListener(this);
        cbo_Provincia.setEnabled(false);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Provincia, gbc);
        
        CLabel lbl_Distrito = new CLabel("Distrito");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Distrito, gbc);
        cbo_Distrito = new JComboBox();
        cbo_Distrito.addActionListener(this);
        cbo_Distrito.setEnabled(false);
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(cbo_Distrito, gbc);
        
        
        CLabel lbl_Direccion = new CLabel("Direccion");
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(lbl_Direccion, gbc);
        txt_Direccion = new JTextField();
        txt_Direccion.setDocument(new UpperCaseDocument());
        txt_Direccion.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(txt_Direccion, gbc);
        btnProcess = new JButton("Agregar");
        btnProcess.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 5;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(btnProcess, gbc);
        loadDepartamento();
        
        setSize(400,250);
        ComponentToolKit.centerComponentPosicion(this);
        setVisible(true);
    }
    
    protected void loadDepartamento() {
    }

    protected void loadProvincia(String xcoddep) {
    }

    protected void loadDistrito(String xcoddis) {
    }        
    
    protected Boolean validarData() {
        return null;
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_Departamento == e.getSource()) {
            if (cbo_Departamento.getItemCount() > 0) {
                if (cbo_Departamento.getSelectedIndex() == 0) {
                    cbo_Distrito.removeAllItems();
                    cbo_Provincia.removeAllItems();
                    
                    cbo_Provincia.setEnabled(false);
                    cbo_Distrito.setEnabled(false);                    
                } else {
                    cbo_Provincia.setEnabled(true);
                    loadProvincia(xDepartamento.get(cbo_Departamento.getSelectedIndex() - 1).getCodigo());
                }
            }
        }

        if (cbo_Provincia == e.getSource()) {
            if (cbo_Provincia.getItemCount() > 0) {
                if (cbo_Provincia.getSelectedIndex() == 0) {
                    cbo_Distrito.removeAllItems();
                    cbo_Distrito.setEnabled(false);
                } else {
                    cbo_Distrito.setEnabled(true);
                    loadDistrito(xProvincia.get(cbo_Provincia.getSelectedIndex() - 1).getCodigo());
                }
            }
        }
        
      
        if (btnProcess == e.getSource()) {
            if (!validarData()){
                return;
            }
            LogicDireccionProveedor logica = new LogicDireccionProveedor(path);
            
            ProveedorDireccion beanProveedorDireccion=new ProveedorDireccion();
            beanProveedorDireccion.setEstado(true);
            beanProveedorDireccion.setDireccion(txt_Direccion.getText().trim());
            beanProveedorDireccion.setOperacion("I");    
            int i = cbo_Distrito.getSelectedIndex();
            beanProveedorDireccion.setIdUbigeo(xDistrito.get(i-1).getCodigo());
                      
            dialog.setValueSearch(beanProveedorDireccion, comp);
            dispose();
            
        }
    }
    
}
