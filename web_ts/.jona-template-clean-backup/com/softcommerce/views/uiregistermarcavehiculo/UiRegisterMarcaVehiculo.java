/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistermarcavehiculo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanMarcaVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnMarcaVehiculo;
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
public class UiRegisterMarcaVehiculo extends JHDialog implements InterUiRegisterMarcaVehiculo, ActionListener, ItemListener, KeyListener, FocusListener {

    protected Usuario usuario;
    protected JTextField txt_Codigo;
    protected JTextField txt_Descripcion;
    protected JCheckBox chkEstado;
    protected BeanMarcaVehiculo beanMarcaVehiculo;

    public UiRegisterMarcaVehiculo(Frame arg0, Usuario usuario, BeanMarcaVehiculo wMarcaVehiculo) {
        super(arg0, true);
        this.usuario = usuario;
        this.beanMarcaVehiculo = wMarcaVehiculo;
        inicialize();
        initListener();
    }

    protected void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Marca Vehiculo", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
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

        setTitleName("Marca Vehiculo");
        getContentPane().add(pnl_dialog);
        setMinimumSize(new Dimension(400, 250));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void initListener() {
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
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
