/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregisterturno;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanTurno;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.reglasnegocio.RnTurno;
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
import javax.swing.JComboBox;
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
public class UiRegisterTurno extends JHDialog implements InterUiRegisterTurno, ActionListener, ItemListener, KeyListener, FocusListener {

    private Usuario usuario;
    private JTextField txt_Codigo;
    private JTextField txt_Hora;
    private JTextField txt_Minuto;
    private JComboBox cboTipo;
    private JCheckBox chkEstado;
    private BeanTurno beanTurno;

    public UiRegisterTurno(Frame arg0, Usuario usuario, BeanTurno wTurno) {
        super(arg0, true);
        this.usuario = usuario;
        this.beanTurno = wTurno;
        inicialize();
        initListener();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Turno", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
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
        txt_Codigo.setColumns(2);
        gbc.insets = new Insets(2, 2, 2, 0);
        pnlPromocion.add(txt_Codigo, gbc);

        JLabel lbl_Descripcion = new JLabel("Turno");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlPromocion.add(lbl_Descripcion, gbc);

        txt_Hora = new JTextField();
        gbc.gridx = 1;
        txt_Hora.setDocument(new IntegerDocument(2));
        txt_Hora.setColumns(2);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlPromocion.add(txt_Hora, gbc);
        txt_Hora.setHorizontalAlignment(JTextField.RIGHT);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lbl = new JLabel(":");
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 2;
        pnlPromocion.add(lbl, gbc);


        txt_Minuto = new JTextField();
        gbc.gridx = 3;
        txt_Minuto.setDocument(new IntegerDocument(2));
        txt_Minuto.setColumns(2);
        pnlPromocion.add(txt_Minuto, gbc);

        cboTipo = new JComboBox();
        gbc.gridx = 4;
        cboTipo.addItem("AM");
        cboTipo.addItem("PM");
        pnlPromocion.add(cboTipo, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridy = 2;
        gbc.gridx = 1;

        chkEstado = new JCheckBox("Estado");
        gbc.gridwidth = 3;
        pnlPromocion.add(chkEstado, gbc);

        pnl_dialog.add(pnlPromocion, BorderLayout.CENTER);

        setTitleName("Turno");
        getContentPane().add(pnl_dialog);
        setMinimumSize(new Dimension(300, 200));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        txt_Hora.addKeyListener(this);
        txt_Hora.addFocusListener(this);
        txt_Minuto.addKeyListener(this);
        txt_Minuto.addFocusListener(this);
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Hora.setBorder(txt.getBorder());
        txt_Minuto.setBorder(txt.getBorder());
        if (txt_Hora.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " , debes especificar su Hora.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txt_Hora.setBorder(new LineBorder(Color.RED));
            txt_Hora.requestFocus();
            return false;
        }
        if (txt_Minuto.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " , debes especificar su Minutos.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txt_Minuto.setBorder(new LineBorder(Color.RED));
            txt_Minuto.requestFocus();
            return false;
        }
        if (Integer.parseInt(txt_Hora.getText().toString()) > 12) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " , debes Insertar Hora Correcto.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txt_Hora.setBorder(new LineBorder(Color.RED));
            txt_Hora.requestFocus();
            return false;
        }
        if (Integer.parseInt(txt_Minuto.getText().toString()) > 59) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " , debes Insertar Minutos Correcto.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txt_Minuto.setBorder(new LineBorder(Color.RED));
            txt_Minuto.requestFocus();
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
        txt_Hora.setEditable(flag);
        txt_Minuto.setEditable(flag);
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
        txt_Hora.requestFocus();
        chkEstado.setSelected(true);
        chkEstado.setEnabled(false);
    }

    @Override
    public boolean loadRegister() {
        try {
            if (beanTurno != null) {
                txt_Codigo.setText(String.valueOf(beanTurno.getId_turno()));
                txt_Hora.setText(beanTurno.getHora());
                txt_Minuto.setText(beanTurno.getMinuto());
                cboTipo.setSelectedItem(beanTurno.getTipo());
                chkEstado.setSelected(beanTurno.getEstado().equals("A"));
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
            RnTurno logic = new RnTurno(path);
            BeanTurno bean = new BeanTurno();
            bean.setHora(txt_Hora.getText().trim());
            bean.setMinuto(txt_Minuto.getText().trim());
            bean.setTipo(cboTipo.getSelectedItem().toString());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            return logic.mantTurno(bean, "I");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnTurno logic = new RnTurno(path);
            BeanTurno bean = new BeanTurno();
            bean.setId_turno(Integer.parseInt(txt_Codigo.getText().trim()));
            bean.setHora(txt_Hora.getText().trim());
            bean.setMinuto(txt_Minuto.getText().trim());
            bean.setTipo(cboTipo.getSelectedItem().toString());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            return logic.mantTurno(bean, "A");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnTurno logic = new RnTurno(path);
            BeanTurno bean = new BeanTurno();
            bean.setId_turno(Integer.parseInt(txt_Codigo.getText().trim()));
            bean.setHora(txt_Hora.getText().trim());
            bean.setMinuto(txt_Minuto.getText().trim());
            bean.setTipo(cboTipo.getSelectedItem().toString());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            String rpta = "";
            rpta = logic.mantTurno(bean, "E");
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
            if (e.getSource() == txt_Hora) {
                setFocusAndClick();
            }
            if (e.getSource() == txt_Minuto) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (txt_Hora == e.getSource()) {
            txt_Hora.selectAll();
        }
        if (txt_Minuto == e.getSource()) {
            txt_Minuto.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txt_Hora)) {
            String cad = "";
            for (int i = 2; i > txt_Hora.getText().length(); i--) {
                cad += "0";
            }
            txt_Hora.setText(cad + txt_Hora.getText());
        }
        if (e.getSource().equals(txt_Minuto)) {
            String cad = "";
            for (int i = 2; i > txt_Minuto.getText().length(); i--) {
                cad += "0";
            }
            txt_Minuto.setText(cad + txt_Minuto.getText());
        }
    }
}
