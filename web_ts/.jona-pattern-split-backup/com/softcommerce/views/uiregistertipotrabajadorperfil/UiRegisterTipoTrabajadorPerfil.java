/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistertipotrabajadorperfil;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.BeanTipoTrabajadorPerfil;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.reglasnegocio.RnTipoTrabajadorPerfil;
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
public class UiRegisterTipoTrabajadorPerfil extends JHDialog implements InterUiRegisterTipoTrabajadorPerfil, ActionListener, ItemListener, KeyListener, FocusListener {

    private Usuario usuario;
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JComboBox cbo_TipoTrabajador;
    private List<BeanTipoTrabajador> xTipoTrabajador;

    public UiRegisterTipoTrabajadorPerfil(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Perfil", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
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

        CLabel lbl_TipoTrabajador = new CLabel("Tipo Trabajador");
        lbl_TipoTrabajador.setBounds(35, 90, 100, 20);
        pnlZona.add(lbl_TipoTrabajador);

        cbo_TipoTrabajador = new JComboBox();
        //cbo_TipoTrabajador.addActionListener(this);
        //cbo_TipoTrabajador.addKeyListener(this);
        cbo_TipoTrabajador.setBounds(125, 90, 200, 20);
        pnlZona.add(cbo_TipoTrabajador);

        pnlZona.setBounds(20, 20, 460, 210);
        pnl_dialog.add(pnlZona);

        setTitleName("Sistema");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 315));
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void loadTipoTrabajador() {
        try {
            RnTipoTrabajador regla_Tipo = new RnTipoTrabajador(path);
            if (xTipoTrabajador != null) {
                xTipoTrabajador.clear();
            } else {
                xTipoTrabajador = new ArrayList<BeanTipoTrabajador>();
            }

            xTipoTrabajador.addAll(regla_Tipo.listarTipoTrabajador("", "A"));
            cbo_TipoTrabajador.removeAllItems();
            cbo_TipoTrabajador.addItem("--- Seleccione ---");

            for (int i = 0; i < xTipoTrabajador.size(); i++) {
                cbo_TipoTrabajador.addItem(xTipoTrabajador.get(i).getDescripcion());
            }

            cbo_TipoTrabajador.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una , debes especificar su Descripcion.", "Datos incompletos de Zona", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }
        if (cbo_TipoTrabajador.getSelectedIndex() < 1) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Zona, debes Seleccionar un Departamento.", "Datos incompletos de Zona", JOptionPane.CANCEL_OPTION);
            cbo_TipoTrabajador.setBorder(new LineBorder(Color.RED));
            cbo_TipoTrabajador.requestFocus();
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
        //chkEstado.setEnabled(flag);
        cbo_TipoTrabajador.setEnabled(flag);
    }

    @Override
    public void loadCombo() {
        loadTipoTrabajador();
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        //chkEstado.setSelected(true);
        //chkEstado.setEnabled(false);
        cbo_TipoTrabajador.setBorder(txt.getBorder());
        txt_Descripcion.requestFocus();
    }

    @Override
    public boolean loadRegister() {
        try {
            BeanTipoTrabajadorPerfil beanPerfil = new BeanTipoTrabajadorPerfil();
            beanPerfil.setId_tipo_perfil(Integer.parseInt(rowSelection.getSelectedValue(1).toString()));
            RnTipoTrabajadorPerfil regla = new RnTipoTrabajadorPerfil(path);
            beanPerfil = regla.beanTipoPerfil(Integer.parseInt(rowSelection.getSelectedValue(1).toString()));
            txt_Codigo.setText(String.valueOf(beanPerfil.getId_tipo_perfil()));
            txt_Descripcion.setText(beanPerfil.getDescripcion());
            //chkEstado.setSelected(beanZona.getEstado().equals("A") ? true : false);
            cbo_TipoTrabajador.setSelectedItem(beanPerfil.getBeanTipoTrabajador().getDescripcion());
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
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
            RnTipoTrabajadorPerfil logicPerfil = new RnTipoTrabajadorPerfil(path);
            BeanTipoTrabajadorPerfil beanPerfil = new BeanTipoTrabajadorPerfil();
            BeanTipoTrabajador beanTipoTrabajador = new BeanTipoTrabajador();
            beanPerfil.setId_tipo_perfil(0);
            beanPerfil.setDescripcion(txt_Descripcion.getText().trim());
            beanPerfil.setId_usuario(usuario.getId_usuario());
            //beanZona.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanTipoTrabajador.setId_tipo_trabajador((cbo_TipoTrabajador.getSelectedIndex() > 0) ? xTipoTrabajador.get(cbo_TipoTrabajador.getSelectedIndex() - 1).getId_tipo_trabajador() : "");
            beanPerfil.setBeanTipoTrabajador(beanTipoTrabajador);
            String rpta = "";
            rpta = logicPerfil.mantTipoTrabajadorPerfil(beanPerfil, "I");
            /*if (!rpta.equals("INSERTADO")) {
             throw new Exception(rpta);
             }*/
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Motivo Descuento", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnTipoTrabajadorPerfil logicPerfil = new RnTipoTrabajadorPerfil(path);
            BeanTipoTrabajadorPerfil beanPerfil = new BeanTipoTrabajadorPerfil();
            BeanTipoTrabajador beanTipoTrabajador = new BeanTipoTrabajador();
            beanPerfil.setId_tipo_perfil(Integer.parseInt(txt_Codigo.getText().trim()));
            beanPerfil.setDescripcion(txt_Descripcion.getText().trim());
            beanPerfil.setId_usuario(usuario.getId_usuario());
            //beanZona.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanTipoTrabajador.setId_tipo_trabajador((cbo_TipoTrabajador.getSelectedIndex() > 0) ? xTipoTrabajador.get(cbo_TipoTrabajador.getSelectedIndex() - 1).getId_tipo_trabajador() : "");
            beanPerfil.setBeanTipoTrabajador(beanTipoTrabajador);
            String rpta = "";
            rpta = logicPerfil.mantTipoTrabajadorPerfil(beanPerfil, "A");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnTipoTrabajadorPerfil logicPerfil = new RnTipoTrabajadorPerfil(path);
            BeanTipoTrabajadorPerfil beanPerfil = new BeanTipoTrabajadorPerfil();
            BeanTipoTrabajador beanTipoTrabajador = new BeanTipoTrabajador();
            beanPerfil.setId_tipo_perfil(Integer.parseInt(txt_Codigo.getText().trim()));
            beanPerfil.setDescripcion(txt_Descripcion.getText().trim());
            beanPerfil.setId_usuario(usuario.getId_usuario());
            //beanZona.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanTipoTrabajador.setId_tipo_trabajador((cbo_TipoTrabajador.getSelectedIndex() > 0) ? xTipoTrabajador.get(cbo_TipoTrabajador.getSelectedIndex() - 1).getId_tipo_trabajador() : "");
            beanPerfil.setBeanTipoTrabajador(beanTipoTrabajador);
            String rpta = "";
            rpta = logicPerfil.mantTipoTrabajadorPerfil(beanPerfil, "E");
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
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
