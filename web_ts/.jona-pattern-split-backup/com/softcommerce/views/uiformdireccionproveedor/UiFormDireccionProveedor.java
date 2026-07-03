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

    private java.net.URL path;
    private JButton btnProcess;
    public Boolean swRegistro;
    private JComboBox cbo_Departamento;
    private List<Ubigeo> xDepartamento;
    private JComboBox cbo_Provincia;
    private List<Ubigeo> xProvincia;
    private JComboBox cbo_Distrito;
    private List<Ubigeo> xDistrito;
    private JTextField txt_Direccion;
    private JHDialog dialog;
    private Component comp;
    private Anexo objAnexo;
    
    public UiFormDireccionProveedor(JHDialog arg0,java.net.URL path,Component comp){
        super(arg0);
        this.dialog=arg0;
        this.path = path;
        this.comp=comp;
        initialize();        
    }
    
    private void setAnexo(Anexo anexo){
        objAnexo = anexo;
    }
    private void initialize(){
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
    
    private void loadDepartamento() {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);
            if (xDepartamento != null) {
                xDepartamento.clear();
            } else {
                xDepartamento = new ArrayList<Ubigeo>();
            }

            xDepartamento.addAll(regla_Ubigeo.listarZona(""));
            cbo_Departamento.removeAllItems();
            cbo_Departamento.addItem("--- Seleccione un Departamento ---");

            for (int i = 0; i < xDepartamento.size(); i++) {
                cbo_Departamento.addItem(xDepartamento.get(i).getDescripcion());
            }

            cbo_Departamento.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    private void loadProvincia(String xcoddep) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xProvincia != null) {
                xProvincia.clear();
            } else {
                xProvincia = new ArrayList<Ubigeo>();
            }

            xProvincia.addAll(regla_Ubigeo.listarZona(xcoddep));

            cbo_Provincia.removeAllItems();
            cbo_Provincia.addItem("--- Seleccione una Provincia ---");


            for (int i = 0; i < xProvincia.size(); i++) {
                cbo_Provincia.addItem(xProvincia.get(i).getDescripcion());
            }

            cbo_Provincia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Zona Distancia", JOptionPane.OK_OPTION);
        }
    }

    private void loadDistrito(String xcoddis) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xDistrito != null) {
                xDistrito.clear();
            } else {
                xDistrito = new ArrayList<Ubigeo>();
            }

            xDistrito.addAll(regla_Ubigeo.listarZona(xcoddis));

            cbo_Distrito.removeAllItems();
            cbo_Distrito.addItem("--- Seleccione una Distrito ---");

            for (int i = 0; i < xDistrito.size(); i++) {
                cbo_Distrito.addItem(xDistrito.get(i).getDescripcion());
            }

            cbo_Distrito.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Cliente Direccion", JOptionPane.OK_OPTION);
        }
    }        
    
    private Boolean validarData(){
        if (cbo_Departamento.getSelectedIndex()<1){
            JOptionPane.showMessageDialog(this, "Debes Seleccionar un Departamento.", "Datos incompletos ", JOptionPane.CANCEL_OPTION);
            cbo_Departamento.setBorder(new LineBorder(Color.RED));
            cbo_Departamento.requestFocus();
            return false;
        }
        if (cbo_Provincia.getSelectedIndex()<1){
            JOptionPane.showMessageDialog(this, "Debes Seleccionar una Provincia.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            cbo_Provincia.setBorder(new LineBorder(Color.RED));
            cbo_Provincia.requestFocus();
            return false;
        }
        if (cbo_Distrito.getSelectedIndex()<1){
            JOptionPane.showMessageDialog(this, "Debes Seleccionar un Almacen.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            cbo_Distrito.setBorder(new LineBorder(Color.RED));
            cbo_Distrito.requestFocus();
            return false;
        }
        
        if (txt_Direccion.getText().length()==0){
            JOptionPane.showMessageDialog(this, "Debes Ingresar Direccion.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txt_Direccion.setBorder(new LineBorder(Color.RED));
            txt_Direccion.requestFocus();
            return false;
        }
        return true;
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
