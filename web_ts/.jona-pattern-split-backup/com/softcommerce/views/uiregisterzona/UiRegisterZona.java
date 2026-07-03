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

    private Usuario usuario;
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JComboBox cb_Departamento;
    private List<Ubigeo> xdepartamento;
    private JComboBox cb_Provincia;
    private List<Ubigeo> xprovincia;
    private JComboBox cb_Distrito;
    private List<Ubigeo> xdistrito;
    private JCheckBox chkEstado;

    public UiRegisterZona(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
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

    private void loadDepartamento() {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);
            if (xdepartamento != null) {
                xdepartamento.clear();
            } else {
                xdepartamento = new ArrayList<Ubigeo>();
            }

            xdepartamento.addAll(regla_Ubigeo.listar(""));
            cb_Departamento.removeAllItems();
            cb_Departamento.addItem("--- Seleccione un Departamento ---");

            for (int i = 0; i < xdepartamento.size(); i++) {
                cb_Departamento.addItem(xdepartamento.get(i).getDescripcion());
            }

            cb_Departamento.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Zona", JOptionPane.OK_OPTION);
        }
    }

    private void loadProvincia(String xcoddep) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xprovincia != null) {
                xprovincia.clear();
            } else {
                xprovincia = new ArrayList<Ubigeo>();
            }

            xprovincia.addAll(regla_Ubigeo.listar(xcoddep));

            cb_Provincia.removeAllItems();
            cb_Provincia.addItem("--- Seleccione una Provincia ---");


            for (int i = 0; i < xprovincia.size(); i++) {
                cb_Provincia.addItem(xprovincia.get(i).getDescripcion());
            }

            cb_Provincia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Zona", JOptionPane.OK_OPTION);
        }
    }

    private void loadDistrito(String xcoddis) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xdistrito != null) {
                xdistrito.clear();
            } else {
                xdistrito = new ArrayList<Ubigeo>();
            }

            xdistrito.addAll(regla_Ubigeo.listar(xcoddis));

            cb_Distrito.removeAllItems();
            cb_Distrito.addItem("--- Seleccione una Distrito ---");

            for (int i = 0; i < xdistrito.size(); i++) {
                cb_Distrito.addItem(xdistrito.get(i).getDescripcion());
            }

            cb_Distrito.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Zona", JOptionPane.OK_OPTION);
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Zona, debes especificar su Descripcion.", "Datos incompletos de Zona", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }
        if (cb_Departamento.getSelectedIndex()<1){
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Zona, debes Seleccionar un Departamento.", "Datos incompletos de Zona", JOptionPane.CANCEL_OPTION);
            cb_Departamento.setBorder(new LineBorder(Color.RED));
            cb_Departamento.requestFocus();
            return false;
        }
        if (cb_Provincia.getSelectedIndex()<1){
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Zona, debes Seleccionar una Provincia.", "Datos incompletos de Zona", JOptionPane.CANCEL_OPTION);
            cb_Provincia.setBorder(new LineBorder(Color.RED));
            cb_Provincia.requestFocus();
            return false;
        }
        if (cb_Distrito.getSelectedIndex()<1){
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Zona, debes Seleccionar un Almacen.", "Datos incompletos de Zona", JOptionPane.CANCEL_OPTION);
            cb_Distrito.setBorder(new LineBorder(Color.RED));
            cb_Distrito.requestFocus();
            return false;
        }
        return true;
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
        loadDepartamento();
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        chkEstado.setSelected(true);
        chkEstado.setEnabled(false);
        cb_Departamento.setBorder(txt.getBorder());
        cb_Distrito.setBorder(txt.getBorder());
        cb_Provincia.setBorder(txt.getBorder());
        txt_Descripcion.requestFocus();
    }

    @Override
    public boolean loadRegister() {
        try {
            Zona beanZona = new Zona();
            beanZona.setId_zona(Integer.parseInt(rowSelection.getSelectedValue(1).toString()));
            RnZona regla = new RnZona(path);
            beanZona = regla.beanZona(Integer.parseInt(rowSelection.getSelectedValue(1).toString()));
            txt_Codigo.setText(String.valueOf(beanZona.getId_zona()));
            txt_Descripcion.setText(beanZona.getDescripcion());
            chkEstado.setSelected(beanZona.getEstado().equals("A") ? true : false);
            cb_Departamento.setSelectedItem(beanZona.getDescr_departamento());
            cb_Provincia.setSelectedItem(beanZona.getDescr_provincia());
            cb_Distrito.setSelectedItem(beanZona.getDescr_distrito());
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Zona", JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
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
        try {
            RnZona logicZona = new RnZona(path);
            Zona beanZona = new Zona();
            beanZona.setId_zona(0);
            beanZona.setDescripcion(txt_Descripcion.getText().trim());
            beanZona.setId_usuario(usuario.getId_usuario());
            beanZona.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanZona.setId_distrito((cb_Distrito.getSelectedIndex()>0)?xdistrito.get(cb_Distrito.getSelectedIndex()-1).getCodigo():"");
            String rpta = "";
            rpta = logicZona.mantZona(beanZona, "I");
            if (!rpta.equals("INSERTADO")) {
                throw new Exception(rpta);
            }
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Motivo Descuento", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnZona logicZona = new RnZona(path);
            Zona beanZona = new Zona();
            beanZona.setId_zona(Integer.parseInt(txt_Codigo.getText().trim()));
            beanZona.setDescripcion(txt_Descripcion.getText().trim());
            beanZona.setId_usuario(usuario.getId_usuario());
            beanZona.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanZona.setId_distrito((cb_Distrito.getSelectedIndex()>0)?xdistrito.get(cb_Distrito.getSelectedIndex()-1).getCodigo():"");
            String rpta = "";
            rpta = logicZona.mantZona(beanZona, "A");
            if (!rpta.equals("ACTUALIZADO")) {
                throw new Exception(rpta);
            }
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Zona", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnZona logicZona = new RnZona(path);
            Zona beanZona = new Zona();
            beanZona.setId_zona(Integer.parseInt(txt_Codigo.getText().trim()));
            beanZona.setDescripcion(txt_Descripcion.getText().trim());
            beanZona.setId_usuario(usuario.getId_usuario());
            beanZona.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanZona.setId_distrito((cb_Distrito.getSelectedIndex()>0)?xdistrito.get(cb_Distrito.getSelectedIndex()-1).getCodigo():"");
            String rpta = "";
            rpta = logicZona.mantZona(beanZona, "E");
            if (!rpta.equals("ELIMINADO")) {
                throw new Exception(rpta);
            }
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Zona", JOptionPane.OK_OPTION);
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
