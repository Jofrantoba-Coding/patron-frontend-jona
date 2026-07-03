/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.softcommerce.views.uiregistercierreaperturafacturacion;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.CierreFacturacion;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JMonthChooser;
import com.toedter.calendar.JYearChooser;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import java.awt.Component;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import com.softcommerce.general.controles.CLabel;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.Date;
import java.util.List;
import javax.swing.JTextField;
import com.softcommerce.reglasnegocio.rn_CierreFacturacion;


public class UiRegisterCierreAperturaFacturacion  extends JHDialog implements InterUiRegisterCierreAperturaFacturacion, ActionListener, ItemListener, KeyListener,FocusListener
{
    private CComboBox cbo_idtipodocumento;

    private JYearChooser jyc_anio;

    private JMonthChooser jmc_mes;
    
    private JTextField txt_Codigo;    
    private JTextField txt_idempresa;   

    private Usuario usuario;

    public UiRegisterCierreAperturaFacturacion(Frame arg0,Usuario usuario)
    {
        super(arg0);
        this.usuario = usuario;
	inicialize();
    }

    public UiRegisterCierreAperturaFacturacion(Dialog arg0,Usuario usuario)
    {
        super(arg0);
        this.usuario = usuario;
	inicialize();
    }

    private void inicialize()
    {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
	pnl_dialog.setBackground(new Color(245,245,245));

        Border border =  BorderFactory.createTitledBorder(null," Datos de Cierre/Apertura de Caja ", TitledBorder.LEFT,TitledBorder.DEFAULT_POSITION,new Font("Verdana",0,13),Color.BLACK);

        JPanel pnl_Correlativo = new JPanel();
        pnl_Correlativo.setBackground(new Color(245,245,245));
        pnl_Correlativo.setBorder(border);
        pnl_Correlativo.setLayout(null);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35,45,40,20);
        pnl_Correlativo.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
	txt_Codigo.setBounds(100,45,90,20);
        pnl_Correlativo.add(txt_Codigo);

        CLabel lbl_TipoDocumento = new CLabel("Tipo");
        lbl_TipoDocumento.setBounds(35,80,90,20);
        pnl_Correlativo.add(lbl_TipoDocumento);

        cbo_idtipodocumento = new CComboBox();
        cbo_idtipodocumento.setBounds(100,80,110,20);
        cbo_idtipodocumento.addKeyListener(this);
        cbo_idtipodocumento.addActionListener(this);        
        pnl_Correlativo.add(cbo_idtipodocumento);

        CLabel lbl_anio = new CLabel("Año");
        lbl_anio.setBounds(35,115,90,20);
        pnl_Correlativo.add(lbl_anio);

        jyc_anio = new JYearChooser();
        jyc_anio.setBounds(100, 115, 60, 20);
        jyc_anio.addKeyListener(this);
        pnl_Correlativo.add(jyc_anio);       

        CLabel lbl_mes = new CLabel("Mes");
        lbl_mes.setBounds(35,150,90,20);
        pnl_Correlativo.add(lbl_mes);

        jmc_mes = new JMonthChooser();
        jmc_mes.setBounds(100, 150, 120, 25);
        jmc_mes.addKeyListener(this);
        pnl_Correlativo.add(jmc_mes);

        txt_idempresa = new JTextField();
        
        pnl_Correlativo.setBounds(25,25,270,200);
        pnl_dialog.add(pnl_Correlativo);

        setTitleName("Cierre/Apertura de Caja");
        setRegister(pnl_dialog);
        setSize(new Dimension(320,310));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo()
    {
        loadTipo();
    }

    public void loadTipo()
    {
        cbo_idtipodocumento.addItem("CIERRE");
        cbo_idtipodocumento.addItem("APERTURA");
        cbo_idtipodocumento.setSelectedIndex(0);
    }  

    @Override
    public void newRegister()
    {
        JTextField txt = new JTextField();
        cbo_idtipodocumento.setBorder(txt.getBorder());
        jmc_mes.setBorder(jmc_mes.getBorder());
        jyc_anio.setBorder(jyc_anio.getBorder());

        txt_idempresa.setText(usuario.getCodempresa());
        cbo_idtipodocumento.setSelectedItem("CIERRE");
        jmc_mes.setMonth(new Date().getMonth());
        jyc_anio.setYear(1900 + new Date().getYear());

        jyc_anio.requestFocus();
    }

    @Override
    public String executeInsert()
    {
        CierreFacturacion c = new CierreFacturacion();
        c.setId_empresa(txt_idempresa.getText().trim());
        c.setAnio(String.valueOf(jyc_anio.getYear()));
        c.setId_usuario(usuario.getId_usuario());
        c.setMes(String.valueOf(jmc_mes.getMonth()+1));
        c.setTipo(cbo_idtipodocumento.getSelectedItem().toString().trim().equals("CIERRE")?"CF":"AF");
        
        rn_CierreFacturacion regla = new rn_CierreFacturacion(path);

        return regla.insertar(c);
    }

    @Override
    public void focusGained(FocusEvent e)
    {
        
    }

    @Override
    public void keyPressed(KeyEvent e)
    {
        if(e.getKeyCode() == KeyEvent.VK_ESCAPE)
            dispose();

        if(e.getKeyChar() == '\n')
        {
            if(e.getSource() == cbo_idtipodocumento)
                jyc_anio.requestFocus();

            if(e.getSource() == jyc_anio)
                jmc_mes.requestFocus();

            if(e.getSource() == jmc_mes)
                setFocusAndClick();
        }
    }

    @Override
    public boolean isRegisterValid()
    {
        /*JTextField txt = new JTextField();
        cbo_idtipodocumento.setBorder(txt.getBorder());
        txt_NumInicial.setBorder(txt.getBorder());
        rb_Activo.setForeground(txt.getForeground());
        rb_Inactivo.setForeground(txt.getForeground());
        txt_NumFinal.setBorder(txt.getBorder());
        txt_Correlativo.setBorder(txt.getBorder());
        txt_LineasImpresion.setBorder(txt.getBorder());
        cbo_idpuntoventa.setBorder(txt.getBorder());
        cbo_idlocalidad.setBorder(txt.getBorder());

        if (cbo_idtipodocumento.getSelectedIndex() == 0)
        {
            JOptionPane.showMessageDialog(this,"Para " + namemode + " un Correlativo, debes " +"especificar su Tipo de Documento.","Datos incompletos del Correlativo",JOptionPane.INFORMATION_MESSAGE);
            cbo_idtipodocumento.setBorder(new LineBorder(Color.RED));
            cbo_idtipodocumento.requestFocus();

            return false;
        }

        if (txt_NumInicial.getText().trim().length() == 0)
        {
            JOptionPane.showMessageDialog(this,"Para " + namemode + " un Correlativo, debes " +"especificar su Número Inicial.","Datos incompletos del Correlativo",JOptionPane.INFORMATION_MESSAGE);
            txt_NumInicial.setBorder(new LineBorder(Color.RED));
            txt_NumInicial.requestFocus();

            return false;
	}

        if (txt_NumFinal.getText().trim().length() == 0)
        {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Número Final.","Datos incompletos de Correlativo",JOptionPane.INFORMATION_MESSAGE);
            txt_NumFinal.setBorder(new LineBorder(Color.RED));
            txt_NumFinal.requestFocus();

            return false;
	}

        if (txt_Correlativo.getText().trim().length() == 0)
        {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Correlativo.","Datos incompletos de Correlativo",JOptionPane.INFORMATION_MESSAGE);
            txt_Correlativo.setBorder(new LineBorder(Color.RED));
            txt_Correlativo.requestFocus();

            return false;
	}


        if (txt_LineasImpresion.getText().trim().length() == 0)
        {
            JOptionPane.showMessageDialog(this,"Para " + namemode + " un Correlativo, debes " +"especificar sus Líneas de Impresión.","Datos incompletos de Correlativo",JOptionPane.INFORMATION_MESSAGE);
            txt_LineasImpresion.setBorder(new LineBorder(Color.RED));
            txt_LineasImpresion.requestFocus();

            return false;
        }

        if (!rb_Activo.isSelected() && !rb_Inactivo.isSelected())
        {
            JOptionPane.showMessageDialog(this, "Para " + this.namemode + " " + "un Correlativo, debes " +"especificar su Estado.","Datos incompletos del Correlativo",JOptionPane.INFORMATION_MESSAGE);
            this.rb_Activo.setForeground(Color.red);
            this.rb_Inactivo.setForeground(Color.red);
            rb_Activo.requestFocus();

            return false;
        }

        if (cbo_idlocalidad.getSelectedIndex() == 0)
        {
            JOptionPane.showMessageDialog(this,"Para " + namemode + " un Correlativo, debes " + "especificar la Localidad.","Datos incompletos de Correlativo",JOptionPane.INFORMATION_MESSAGE);
            cbo_idlocalidad.setBorder(new LineBorder(Color.RED));
            cbo_idlocalidad.requestFocus();

            return false;
	}

        if (cbo_idpuntoventa.getSelectedIndex() == 0)
        {
            JOptionPane.showMessageDialog(this,"Para " + namemode + " un Correlativo, debes " + "especificar su Punto de Venta.","Datos incompletos de Correlativo",JOptionPane.INFORMATION_MESSAGE);
            cbo_idpuntoventa.setBorder(new LineBorder(Color.RED));
            cbo_idpuntoventa.requestFocus();

            return false;
	}

        /*rn_CierreFacturacion reg = new rn_CierreFacturacion();
        boolean flag = reg.getExisteSerieCorrelativo(xpuntoventa.get(cbo_idpuntoventa.getSelectedIndex()-1).getId_punto_venta(),xtipodocumento.get(cbo_idtipodocumento.getSelectedIndex()-1).getCodigo(),txt_Serie.getText().trim()).equals("S");

        if(((mode==INSERT)&& flag)
            || ((mode==UPDATE) && flag && !(xpuntoventa.get(cbo_idpuntoventa.getSelectedIndex()-1).getId_punto_venta().equals(codpuntoventa) && xtipodocumento.get(cbo_idtipodocumento.getSelectedIndex()-1).getCodigo().equals(codtipodocumento) && txt_Serie.getText().trim().equals(serie))))
        {
            JOptionPane.showMessageDialog(this,"Ya existe una asignacion de la serie al mismo tipo de documento, por favor digite otra serie.","Datos incompletos de Correlativo",JOptionPane.INFORMATION_MESSAGE);
            txt_Serie.setBorder(new LineBorder(Color.RED));
            txt_Serie.requestFocus();

            return false;
        }*/

        return true;
    }

    @Override
    public boolean loadRegister()
    {
        CierreFacturacion c = new CierreFacturacion();
        c.setId_cierre_fact(rowSelection.getSelectedValue(1).toString());

        rn_CierreFacturacion regla = new rn_CierreFacturacion(path);
        List<CierreFacturacion> reg = regla.listar(c);

        if(reg.isEmpty())

            return false;

        else
        {
            CierreFacturacion co = reg.get(0);

            txt_Codigo.setText(mode==CLONE?"":co.getId_cierre_fact());
            cbo_idtipodocumento.setSelectedItem(co.getTipo().trim().equals("AF")?"APERTURA":"CIERRE");
            jyc_anio.setYear(Integer.valueOf(co.getAnio()).intValue());
            jmc_mes.setMonth(Integer.valueOf(co.getMes().trim()).intValue()-1);
            txt_idempresa.setText(co.getId_empresa());
        }

        return true;
    }

    @Override
    public String executeUpdate()
    {
        CierreFacturacion c = new CierreFacturacion();
        c.setId_cierre_fact(txt_Codigo.getText().trim());
        c.setId_empresa(txt_idempresa.getText().trim());
        c.setAnio(String.valueOf(jyc_anio.getYear()));
        c.setId_usuario(usuario.getId_usuario());
        c.setMes(String.valueOf(jmc_mes.getMonth()+1));
        c.setTipo(cbo_idtipodocumento.getSelectedItem().toString().trim().equals("CIERRE")?"CF":"AF");

        rn_CierreFacturacion regla = new rn_CierreFacturacion(path);

        return regla.modificar(c);
    }

    @Override
    public boolean executeDelete()
    {
        CierreFacturacion c = new CierreFacturacion();
        c.setId_empresa(txt_idempresa.getText().trim());
        c.setAnio(String.valueOf(jyc_anio.getYear()));
        c.setMes(String.valueOf(jmc_mes.getMonth()+1));
        c.setId_usuario(usuario.getId_usuario());

        rn_CierreFacturacion regla = new rn_CierreFacturacion(path);

        return regla.eliminar(c);
    }

    @Override
    public void actionPerformed(ActionEvent e)
    {
         
    }

    @Override
    public void setRegisterEnabled(boolean e)
    {
        cbo_idtipodocumento.setEnabled(e);
        jyc_anio.setEnabled(e);
        jmc_mes.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e)
    {
      
    }

    @Override
    public void focusLost(FocusEvent e)
    {

    }

    @Override
    public void showMessagePrint(String codigo) {}
    @Override
    public boolean loadRegister(Object o) {return true;}
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
    public boolean executeAnular() {return true;}
    @Override
    public boolean executeSelect() {return true;}
    @Override
    public void itemStateChanged(ItemEvent e) {}
    @Override
    public void keyTyped(KeyEvent e) {}
    @Override
    public void keyReleased(KeyEvent e) {}
}