/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistertipotrabajador;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
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
import javax.swing.JLabel;
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
public class UiRegisterTipoTrabajador extends JHDialog implements InterUiRegisterTipoTrabajador, ActionListener, ItemListener, KeyListener, FocusListener {

    private Usuario usuario;
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_Abrev;
    private JCheckBox chkEstado;
    private BeanTipoTrabajador beanTipoTrabajador;

    public UiRegisterTipoTrabajador(Frame arg0, Usuario usuario, BeanTipoTrabajador wTipoTrabajador) {
        super(arg0, true);
        this.usuario = usuario;
        this.beanTipoTrabajador = wTipoTrabajador;
        inicialize();
        initListener();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Tipo Trabajador", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        JPanel pnlPromocion = new JPanel();
        pnlPromocion.setLayout(new GridBagLayout());
        pnlPromocion.setBackground(new Color(245, 245, 245));
        pnlPromocion.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lbl_Codigo = new JLabel("Código");
        pnlPromocion.add(lbl_Codigo, gbc);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        gbc.gridx = 1;
        txt_Codigo.setColumns(5);
        pnlPromocion.add(txt_Codigo, gbc);

        JLabel lbl_Descripcion = new JLabel("Descripción");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlPromocion.add(lbl_Descripcion, gbc);

        txt_Descripcion = new JTextField();
        gbc.gridx = 1;
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.setColumns(20);
        pnlPromocion.add(txt_Descripcion, gbc);

        JLabel lbl_Abrev = new JLabel("Abrev");
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlPromocion.add(lbl_Abrev, gbc);

        txt_Abrev = new JTextField();
        gbc.gridx = 1;
        txt_Abrev.setDocument(new UpperCaseDocument(5));
        txt_Abrev.setColumns(5);
        pnlPromocion.add(txt_Abrev, gbc);

        gbc.gridy = 3;
        chkEstado = new JCheckBox("Activo");
        pnlPromocion.add(chkEstado, gbc);

        pnl_dialog.add(pnlPromocion, BorderLayout.CENTER);

        setTitleName("Tipo Trabajador");
        getContentPane().add(pnl_dialog);
        setMinimumSize(new Dimension(400, 250));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Abrev.setBorder(txt.getBorder());
        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + ", debes especificar su Descripcion.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
            return false;
        }
        if (txt_Abrev.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + ", debes especificar su Abrev.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txt_Abrev.setBorder(new LineBorder(Color.RED));
            txt_Abrev.requestFocus();
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
        txt_Abrev.setEditable(flag);
    }

    @Override
    public void loadCombo() {
        try {
            pack();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        txt_Descripcion.requestFocus();
        chkEstado.setSelected(true);
        chkEstado.setEnabled(false);
    }

    @Override
    public boolean loadRegister() {
        try {
            if (beanTipoTrabajador != null) {
                txt_Codigo.setText(beanTipoTrabajador.getId_tipo_trabajador());
                txt_Descripcion.setText(beanTipoTrabajador.getDescripcion());
                txt_Abrev.setText(beanTipoTrabajador.getAbreviatura().trim());
                chkEstado.setSelected(beanTipoTrabajador.getEstado().equals("A"));
            }
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
            RnTipoTrabajador logic = new RnTipoTrabajador(path);
            BeanTipoTrabajador bean = new BeanTipoTrabajador();
            bean.setDescripcion(txt_Descripcion.getText().trim());
            bean.setAbreviatura(txt_Abrev.getText().trim());
            bean.setId_usuario(usuario.getId_usuario());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            String rpta = "";
            rpta = logic.mantTipoTrabajador(bean, "I");
            return rpta;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnTipoTrabajador logic = new RnTipoTrabajador(path);
            BeanTipoTrabajador bean = new BeanTipoTrabajador();
            bean.setId_tipo_trabajador(txt_Codigo.getText().trim());
            bean.setDescripcion(txt_Descripcion.getText().trim());
            bean.setAbreviatura(txt_Abrev.getText().trim());
            bean.setId_usuario(usuario.getId_usuario());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            String rpta = "";
            rpta = logic.mantTipoTrabajador(bean, "A");
            return rpta;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnTipoTrabajador logic = new RnTipoTrabajador(path);
            BeanTipoTrabajador bean = new BeanTipoTrabajador();
            bean.setId_tipo_trabajador(txt_Codigo.getText().trim());
            bean.setDescripcion(txt_Descripcion.getText().trim());
            bean.setAbreviatura(txt_Abrev.getText().trim());
            bean.setId_usuario(usuario.getId_usuario());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            String rpta = "";
            rpta = logic.mantTipoTrabajador(bean, "E");
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
        try {
        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, ex.getMessage());
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
