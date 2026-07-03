/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterzona;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.beans.Zona;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnUbigeo;
import com.softcommerce.reglasnegocio.RnZona;
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
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
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
public class UiRegisterZona extends JHDialog implements InterUiRegisterZona, ActionListener, ItemListener, KeyListener, FocusListener {

    protected Usuario usuario;
    protected JTextField txt_Codigo;
    protected JTextField txt_Descripcion;
    protected JComboBox cb_Departamento;
    protected List<Ubigeo> xdepartamento;
    protected JComboBox cb_Provincia;
    protected List<Ubigeo> xprovincia;
    protected JComboBox cb_Distrito;
    protected List<Ubigeo> xdistrito;
    protected JCheckBox chkEstado;

    public UiRegisterZona(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Zona", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        JPanel pnlZona = new JPanel();
        pnlZona.setLayout(null);
        pnlZona.setBackground(new Color(245, 245, 245));
        pnlZona.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 30, 80, 20);
        pnlZona.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setBounds(125, 30, 120, 20);
        pnlZona.add(txt_Codigo);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 60, 80, 20);
        pnlZona.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(125, 60, 150, 20);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        pnlZona.add(txt_Descripcion);

        CLabel lbl_Departamento = new CLabel("Departamento");
        lbl_Departamento.setBounds(35, 90, 100, 20);
        pnlZona.add(lbl_Departamento);

        cb_Departamento = new JComboBox();
        cb_Departamento.addActionListener(this);
        cb_Departamento.addKeyListener(this);
        cb_Departamento.setBounds(125, 90, 200, 20);
        pnlZona.add(cb_Departamento);
        
        CLabel lbl_Provincia = new CLabel("Provincia");
        lbl_Provincia.setBounds(35,120,100,20);
        pnlZona.add(lbl_Provincia);
        
        cb_Provincia = new JComboBox();
        cb_Provincia.addActionListener(this);
        cb_Provincia.setBounds(125,120,180,20);
        cb_Provincia.addKeyListener(this);
        cb_Provincia.setEnabled(false);
        pnlZona.add(cb_Provincia);
        
        CLabel lbl_Distrito = new CLabel("Distrito");
        lbl_Distrito.setBounds(35,150,100,20);
        pnlZona.add(lbl_Distrito);
        
        cb_Distrito = new JComboBox();
        cb_Distrito.addActionListener(this);
        cb_Distrito.setBounds(125,150,180,20);
        cb_Distrito.addKeyListener(this);
        cb_Distrito.setEnabled(false);
        pnlZona.add(cb_Distrito);

        chkEstado = new JCheckBox("Activo");
        chkEstado.setBounds(125, 180, 150, 20);
        pnlZona.add(chkEstado);

        pnlZona.setBounds(20, 20, 460, 210);
        pnl_dialog.add(pnlZona);

        setTitleName("Zona");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 315));
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void loadDepartamento() {
    }

    protected void loadProvincia(String xcoddep) {
    }

    protected void loadDistrito(String xcoddis) {
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {
    }

    @Override
    public void setRegisterEditable(boolean flag) {
        txt_Descripcion.setEditable(flag);
        chkEstado.setEnabled(flag);
        cb_Departamento.setEnabled(flag);
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
    public void actionPerformed(ActionEvent e) {
        if (cb_Departamento == e.getSource()) {
            if (cb_Departamento.getItemCount() > 0) {
                if (cb_Departamento.getSelectedIndex() == 0) {
                    cb_Distrito.removeAllItems();
                    cb_Provincia.removeAllItems();
                    cb_Provincia.setEnabled(false);
                    cb_Distrito.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cb_Provincia.setEnabled(true);
                    }
                    loadProvincia(xdepartamento.get(cb_Departamento.getSelectedIndex() - 1).getCodigo());
                }
            }
        }

        if (cb_Provincia == e.getSource()) {
            if (cb_Provincia.getItemCount() > 0) {
                if (cb_Provincia.getSelectedIndex() == 0) {
                    cb_Distrito.removeAllItems();
                    cb_Distrito.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cb_Distrito.setEnabled(true);
                    }
                    loadDistrito(xprovincia.get(cb_Provincia.getSelectedIndex() - 1).getCodigo());
                }
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_Descripcion) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (txt_Descripcion == e.getSource()) {
            txt_Descripcion.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}
