/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterclasifcliente;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ClasifCliente;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.rn_ClasifCliente;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import javax.swing.BorderFactory;
import javax.swing.JCheckBox;
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
public class UiRegisterClasifCliente extends JHDialog implements InterUiRegisterClasifCliente, ActionListener, ItemListener, KeyListener,FocusListener{

    private Usuario usuario;
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JCheckBox chkEstado;
    
    public UiRegisterClasifCliente(Frame arg0,Usuario usuario){
        super(arg0,true);
        this.usuario = usuario;
	inicialize();
    }
    
    private void inicialize(){
        JPanel pnl_dialog= new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245,245,245));
        Border border =  BorderFactory.createTitledBorder(null,"Datos de Clasificacion Cliente", TitledBorder.LEFT,TitledBorder.DEFAULT_POSITION,new Font("Comic Sans MS",0,12),Color.BLACK);
        JPanel pnlClasifCliente= new JPanel();
        pnlClasifCliente.setLayout(null);
        pnlClasifCliente.setBackground(new Color(245,245,245));
        pnlClasifCliente.setBorder(border);
        
        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35,30,80,20);
        pnlClasifCliente.add(lbl_Codigo);
        
        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
	txt_Codigo.setBounds(125,30,120,20);
        pnlClasifCliente.add(txt_Codigo);
        
        CLabel lbl_Descripcion = new CLabel("Descripción");
	lbl_Descripcion.setBounds(35,60,80,20);
        pnlClasifCliente.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
	txt_Descripcion.setBounds(125,60,150,20);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        pnlClasifCliente.add(txt_Descripcion);
        
        chkEstado=new JCheckBox("Activo");
        chkEstado.setBounds(125,90,150,20);
        pnlClasifCliente.add(chkEstado);
        
        pnlClasifCliente.setBounds(20,20,460,150);
        pnl_dialog.add(pnlClasifCliente);
        
        setTitleName("Clasificacion Cliente");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500,255));
	ComponentToolKit.centerComponentPosicion(this);
    }
    
    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        if (txt_Descripcion.getText().trim().length() == 0){
            JOptionPane.showMessageDialog(this,"Para " + namemode + " una Clasif Cliente, debes especificar su Descripcion.","Datos incompletos de Clasif Cliente",JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }
        return true;
    }

    @Override
    public void showMessagePrint(String codigo) {}

    @Override
    public void setRegisterEnabled(boolean flag) {}

    @Override
    public void setRegisterEditable(boolean flag) {
        txt_Descripcion.setEditable(flag);
        chkEstado.setEnabled(flag);
    }

    @Override
    public void loadCombo() {}

    @Override
    public void newRegister() {
        chkEstado.setSelected(true);
        chkEstado.setEnabled(false);
        txt_Descripcion.requestFocus();
    }

    @Override
    public boolean loadRegister() {
        try{
            ClasifCliente beanClasifCliente=new ClasifCliente();
            beanClasifCliente.setId_clasif_cliente(Integer.parseInt(rowSelection.getSelectedValue(1).toString()));
            rn_ClasifCliente regla=new rn_ClasifCliente(path);
            beanClasifCliente=regla.beanClasifCliente(Integer.parseInt(rowSelection.getSelectedValue(1).toString()));
            txt_Codigo.setText(String.valueOf(beanClasifCliente.getId_clasif_cliente()));
            txt_Descripcion.setText(beanClasifCliente.getDescripcion());
            chkEstado.setSelected(beanClasifCliente.getEstado().equals("A")?true:false);
            return true;
        }catch(Exception e){
            JOptionPane.showMessageDialog(this,"Error: " + e.getMessage(),"Motivo Descuento",JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {}

    @Override
    public void showMessageSuccessfulInsert() {}

    @Override
    public void showMessageSuccessfulUpdate() {}

    @Override
    public void showMessageSuccessfulDelete() {}

    @Override
    public void showMessageErrorDelete() {}

    @Override
    public void showMessageErrorUpdate() {}

    @Override
    public void showMessageErrorInsert() {}

    @Override
    public String executeInsert() {
        try{
            rn_ClasifCliente logicClasifCliente = new rn_ClasifCliente(path);
            ClasifCliente beanClasifCliente=new ClasifCliente();
            beanClasifCliente.setId_clasif_cliente(0);
            beanClasifCliente.setDescripcion(txt_Descripcion.getText().trim());
            beanClasifCliente.setId_usuario(usuario.getId_usuario());
            beanClasifCliente.setEstado(chkEstado.isSelected()?"A":"D");
            String rpta="";
            rpta=logicClasifCliente.mantClasifCliente(beanClasifCliente, "I");
            if (!rpta.equals("INSERTADO")){
                throw new Exception(rpta);
            }
            return rpta;
        }catch(Exception e){
            JOptionPane.showMessageDialog(this,"Error: " + e.getMessage(),"Motivo Descuento",JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try{
            rn_ClasifCliente logicClasifCliente = new rn_ClasifCliente(path);
            ClasifCliente beanClasifCliente=new ClasifCliente();
            beanClasifCliente.setId_clasif_cliente(Integer.parseInt(txt_Codigo.getText().trim()));
            beanClasifCliente.setDescripcion(txt_Descripcion.getText().trim());
            beanClasifCliente.setId_usuario(usuario.getId_usuario());
            beanClasifCliente.setEstado(chkEstado.isSelected()?"A":"D");
            String rpta="";
            rpta=logicClasifCliente.mantClasifCliente(beanClasifCliente, "A");
            if (!rpta.equals("ACTUALIZADO")){
                throw new Exception(rpta);
            }
            return rpta;
        }catch(Exception e){
            JOptionPane.showMessageDialog(this,"Error: " + e.getMessage(),"Motivo Descuento",JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try{
            rn_ClasifCliente logicClasifCliente = new rn_ClasifCliente(path);
            ClasifCliente beanClasifCliente=new ClasifCliente();
            beanClasifCliente.setId_clasif_cliente(Integer.parseInt(txt_Codigo.getText().trim()));
            beanClasifCliente.setDescripcion(txt_Descripcion.getText().trim());
            beanClasifCliente.setId_usuario(usuario.getId_usuario());
            beanClasifCliente.setEstado(chkEstado.isSelected()?"A":"D");
            String rpta="";
            rpta=logicClasifCliente.mantClasifCliente(beanClasifCliente, "E");
            if (!rpta.equals("ELIMINADO")){
                throw new Exception(rpta);
            }
            return true;
        }catch(Exception e){
            JOptionPane.showMessageDialog(this,"Error: " + e.getMessage(),"Motivo Descuento",JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {}

    @Override
    public void itemStateChanged(ItemEvent e) {}

    @Override
    public void keyTyped(KeyEvent e) {}

    @Override
    public void keyPressed(KeyEvent e) {
        if(e.getKeyCode() == KeyEvent.VK_ESCAPE)
            dispose();
        if(e.getKeyChar()=='\n'){
            if(e.getSource() == txt_Descripcion)
                setFocusAndClick();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {}

    @Override
    public void focusGained(FocusEvent e) {
        if(txt_Descripcion == e.getSource()){
            txt_Descripcion.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {}
    
}
