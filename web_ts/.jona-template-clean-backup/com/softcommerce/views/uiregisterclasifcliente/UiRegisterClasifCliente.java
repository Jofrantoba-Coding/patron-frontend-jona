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

    protected Usuario usuario;
    protected JTextField txt_Codigo;
    protected JTextField txt_Descripcion;
    protected JCheckBox chkEstado;
    
    public UiRegisterClasifCliente(Frame arg0,Usuario usuario){
        super(arg0,true);
        this.usuario = usuario;
	inicialize();
    }
    
    protected void inicialize(){
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
        return false;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {}

    @Override
    public void setRegisterEditable(boolean flag) {
        txt_Descripcion.setEditable(flag);
        chkEstado.setEnabled(flag);
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeDelete() {
        return false;
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
