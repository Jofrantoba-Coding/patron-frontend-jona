/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.BeanModeloVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnModeloVehiculo;
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
public class RegisterModeloVehiculo extends JHDialog implements ActionListener, ItemListener, KeyListener, FocusListener {

    private Usuario usuario;
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JCheckBox chkEstado;
    private BeanModeloVehiculo beanModeloVehiculo;

    public RegisterModeloVehiculo(Frame arg0, Usuario usuario, BeanModeloVehiculo wModeloVehiculo) {
        super(arg0, true);
        this.usuario = usuario;
        this.beanModeloVehiculo = wModeloVehiculo;
        inicialize();
        initListener();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Modelo Vehiculo", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
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

        gbc.gridy = 2;

        chkEstado = new JCheckBox("Estado");
        pnlPromocion.add(chkEstado, gbc);

        pnl_dialog.add(pnlPromocion, BorderLayout.CENTER);

        setTitleName("Modelo Vehiculo");
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
        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " , debes especificar su Descripcion.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();
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
    }

    @Override
    public void loadCombo() {
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
            if (beanModeloVehiculo != null) {
                txt_Codigo.setText(beanModeloVehiculo.getId_modelo());
                txt_Descripcion.setText(beanModeloVehiculo.getDescripcion());
                chkEstado.setSelected(beanModeloVehiculo.getEstado().equals("A"));
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
            RnModeloVehiculo logic = new RnModeloVehiculo(path);
            BeanModeloVehiculo bean = new BeanModeloVehiculo();
            bean.setId_modelo(txt_Codigo.getText());
            bean.setDescripcion(txt_Descripcion.getText().trim());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            bean.setId_usuario(usuario.getId_usuario());
            bean.setId_empresa(usuario.getCodempresa());
            String rpta = "";
            rpta = logic.mantModeloVehiculo(bean, "I");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnModeloVehiculo logic = new RnModeloVehiculo(path);
            BeanModeloVehiculo bean = new BeanModeloVehiculo();
            bean.setId_modelo(txt_Codigo.getText());
            bean.setDescripcion(txt_Descripcion.getText().trim());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            bean.setId_usuario(usuario.getId_usuario());
            bean.setId_empresa(usuario.getCodempresa());
            String rpta = "";
            rpta = logic.mantModeloVehiculo(bean, "A");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnModeloVehiculo logic = new RnModeloVehiculo(path);
            BeanModeloVehiculo bean = new BeanModeloVehiculo();
            bean.setId_modelo(txt_Codigo.getText());
            bean.setDescripcion(txt_Descripcion.getText().trim());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            bean.setId_usuario(usuario.getId_usuario());
            bean.setId_empresa(usuario.getCodempresa());
            String rpta = "";
            rpta = logic.mantModeloVehiculo(bean, "E");
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
