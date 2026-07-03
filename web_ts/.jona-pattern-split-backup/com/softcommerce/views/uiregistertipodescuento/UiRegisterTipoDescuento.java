/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistertipodescuento;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.TipoDescuento;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.rn_TipoDescuento;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dialog;
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
public class UiRegisterTipoDescuento extends JHDialog implements InterUiRegisterTipoDescuento, ActionListener, ItemListener, KeyListener,FocusListener{
    
    private Usuario usuario;
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_Abrev;
    
    public UiRegisterTipoDescuento(Frame arg0,Usuario usuario){
        super(arg0,true);
        this.usuario = usuario;
	inicialize();
    }
    
    public UiRegisterTipoDescuento(Dialog arg0,Usuario usuario){
        super(arg0);
        this.usuario = usuario;
	inicialize();
    }
    
    private void inicialize(){
        JPanel pnl_dialog= new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245,245,245));
        Border border =  BorderFactory.createTitledBorder(null,"Datos de Tipo Descuento", TitledBorder.LEFT,TitledBorder.DEFAULT_POSITION,new Font("Comic Sans MS",0,12),Color.BLACK);
        JPanel pnlMotivoDescuento= new JPanel();
        pnlMotivoDescuento.setLayout(null);
        pnlMotivoDescuento.setBackground(new Color(245,245,245));
        pnlMotivoDescuento.setBorder(border);
        
        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35,30,80,20);
        pnlMotivoDescuento.add(lbl_Codigo);
        
        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
	txt_Codigo.setBounds(125,30,120,20);
        pnlMotivoDescuento.add(txt_Codigo);
        
        CLabel lbl_Descripcion = new CLabel("Descripción");
	lbl_Descripcion.setBounds(35,60,80,20);
        pnlMotivoDescuento.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
	txt_Descripcion.setBounds(125,60,150,20);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        pnlMotivoDescuento.add(txt_Descripcion);
        
        CLabel lbl_Abrev = new CLabel("Abrev");
	lbl_Abrev.setBounds(35,90,80,20);
        pnlMotivoDescuento.add(lbl_Abrev);

        txt_Abrev = new JTextField();
	txt_Abrev.setBounds(125,90,70,20);
        txt_Abrev.setDocument(new UpperCaseNumberDocument(5));
        txt_Abrev.addKeyListener(this);
        txt_Abrev.addFocusListener(this);
        pnlMotivoDescuento.add(txt_Abrev);
        
        pnlMotivoDescuento.setBounds(20,20,460,150);
        pnl_dialog.add(pnlMotivoDescuento);
        
        setTitleName("Tipo Descuento");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500,255));
	ComponentToolKit.centerComponentPosicion(this);
    }
    
    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        if (txt_Descripcion.getText().trim().length() == 0){
            JOptionPane.showMessageDialog(this,"Para " + namemode + " un Tipo Descuento, debes especificar su Descripcion.","Datos incompletos de Motivo Descuento",JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }
        if (txt_Abrev.getText().trim().length() == 0){
            JOptionPane.showMessageDialog(this,"Para " + namemode + " un Tipo Descuento, debes especificar su Descripcion.","Datos incompletos de Motivo Descuento",JOptionPane.CANCEL_OPTION);
            txt_Abrev.setBorder(new LineBorder(Color.RED));
            txt_Abrev.requestFocus();
            return false;
        }
        return true;
    }

    @Override
    public void showMessagePrint(String codigo) {}

    @Override
    public void setRegisterEnabled(boolean flag) {
        
    }

    @Override
    public void setRegisterEditable(boolean flag) {
        txt_Descripcion.setEditable(flag);
        txt_Abrev.setEditable(flag);
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
        txt_Descripcion.requestFocus();
    }

    @Override
    public boolean loadRegister() {
        try{
            TipoDescuento beanTipoDescuento=new TipoDescuento();
            //beanMotivoDescuento.setId_motivo_descuento(Integer.parseInt(rowSelection.getSelectedValue(1).toString()));
            rn_TipoDescuento regla=new rn_TipoDescuento(path);
            beanTipoDescuento=regla.beanTipoDescuento(Integer.parseInt(rowSelection.getSelectedValue(1).toString()));
            txt_Codigo.setText(String.valueOf(beanTipoDescuento.getId_tipo_descuento()));
            txt_Descripcion.setText(beanTipoDescuento.getDescripcion());
            txt_Abrev.setText(beanTipoDescuento.getAbrev());
            return true;
        }catch(Exception e){
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
            rn_TipoDescuento logicTipoDescuento = new rn_TipoDescuento(path);
            TipoDescuento beanTipoDescuento=new TipoDescuento();
            beanTipoDescuento.setId_tipo_descuento(0);
            beanTipoDescuento.setDescripcion(txt_Descripcion.getText().trim());
            beanTipoDescuento.setAbrev(txt_Abrev.getText().trim());
            String rpta="";
            rpta=logicTipoDescuento.mantTipoDescuento(beanTipoDescuento, "I");
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
            rn_TipoDescuento logicTipoDescuento = new rn_TipoDescuento(path);
            TipoDescuento beanTipoDescuento=new TipoDescuento();
            beanTipoDescuento.setId_tipo_descuento(Integer.parseInt(txt_Codigo.getText().trim()));
            beanTipoDescuento.setDescripcion(txt_Descripcion.getText().trim());
            beanTipoDescuento.setAbrev(txt_Abrev.getText().trim());
            String rpta="";
            rpta=logicTipoDescuento.mantTipoDescuento(beanTipoDescuento, "A");
            if (!rpta.equals("ACTUALIZADO")){
                throw new Exception(rpta);
            }
            return rpta;
        }catch(Exception e){
            JOptionPane.showMessageDialog(this,"Error: " + e.getMessage(),"Tipo Descuento",JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try{
            rn_TipoDescuento logicTipoDescuento = new rn_TipoDescuento(path);
            TipoDescuento beanTipoDescuento=new TipoDescuento();
            beanTipoDescuento.setId_tipo_descuento(Integer.parseInt(txt_Codigo.getText().trim()));
            beanTipoDescuento.setDescripcion(txt_Descripcion.getText().trim());
            beanTipoDescuento.setAbrev(txt_Abrev.getText().trim());
            String rpta="";
            rpta=logicTipoDescuento.mantTipoDescuento(beanTipoDescuento, "E");
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
    public boolean executeSelect() {return false;}

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
    public void focusGained(FocusEvent e){
        if(txt_Descripcion == e.getSource()){
            txt_Descripcion.selectAll();
        }
        if(txt_Abrev == e.getSource()){
            txt_Abrev.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {}
    
}
