package com.softcommerce.views.uiregistercondicionpago;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanCondicionPago;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import java.awt.event.FocusEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
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
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.Vector;
import javax.swing.ButtonGroup;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.rn_CondicionPago;

public class UiRegisterCondicionPago extends JHDialog implements InterUiRegisterCondicionPago, ActionListener, ItemListener, KeyListener, FocusListener {

    private static final long serialVersionUID = 1L;
    protected JTextField txt_Codigo;
    protected JTextField txt_Descripcion;
    protected JTextField txt_DiasPago;
    protected CRadioButton rb_credito;
    protected CRadioButton rb_contado;
    protected CRadioButton rb_operacionbancaria;
    protected CRadioButton rb_tarjeta;
    protected CRadioButton rb_TipoPagoNinguno;
    protected ButtonGroup bg_TipoPago;
    String codigo;
    protected Usuario usuario;

    public UiRegisterCondicionPago(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterCondicionPago(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Condición de Pago", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 0, 13), Color.BLACK);

        JPanel pnl_CondicionPago = new JPanel();
        pnl_CondicionPago.setLayout(null);
        pnl_CondicionPago.setBackground(new Color(245, 245, 245));
        pnl_CondicionPago.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 120, 20);
        pnl_CondicionPago.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setBounds(165, 45, 100, 20);
        txt_Codigo.setEditable(false);
        pnl_CondicionPago.add(txt_Codigo);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 80, 120, 20);
        pnl_CondicionPago.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(165, 80, 200, 20);
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(255));
        txt_Descripcion.addFocusListener(this);
        pnl_CondicionPago.add(txt_Descripcion);

        CLabel lbl_DiasPago = new CLabel("Dias de Pago");
        lbl_DiasPago.setBounds(35, 115, 120, 20);
        pnl_CondicionPago.add(lbl_DiasPago);

        txt_DiasPago = new JTextField();
        txt_DiasPago.setBounds(165, 115, 120, 20);
        txt_DiasPago.addKeyListener(this);
        txt_DiasPago.setDocument(new IntegerDocument(2));
        txt_DiasPago.addFocusListener(this);
        pnl_CondicionPago.add(txt_DiasPago);

        CLabel lbl_TipoPago = new CLabel("Tipo de Pago");
        lbl_TipoPago.setBounds(35, 150, 120, 20);
        pnl_CondicionPago.add(lbl_TipoPago);

        rb_credito = new CRadioButton("CR");
        rb_credito.setToolTipText("Crédito");
        rb_credito.setBounds(165, 150, 50, 20);
        rb_credito.addKeyListener(this);
        pnl_CondicionPago.add(rb_credito);

        rb_contado = new CRadioButton("CO");
        rb_contado.setToolTipText("Contado");
        rb_contado.setBounds(215, 150, 50, 20);
        rb_contado.addKeyListener(this);
        pnl_CondicionPago.add(rb_contado);

        rb_operacionbancaria = new CRadioButton("OB");
        rb_operacionbancaria.setToolTipText("Operación Bancaria");
        rb_operacionbancaria.setBounds(265, 150, 50, 20);
        rb_operacionbancaria.addKeyListener(this);
        pnl_CondicionPago.add(rb_operacionbancaria);

        rb_tarjeta = new CRadioButton("TA");
        rb_tarjeta.setToolTipText("Tarjeta");
        rb_tarjeta.setBounds(315, 150, 50, 20);
        rb_tarjeta.addKeyListener(this);
        pnl_CondicionPago.add(rb_tarjeta);

        rb_TipoPagoNinguno = new CRadioButton();
        rb_TipoPagoNinguno.addKeyListener(this);

        bg_TipoPago = new ButtonGroup();
        bg_TipoPago.add(rb_credito);
        bg_TipoPago.add(rb_contado);
        bg_TipoPago.add(rb_operacionbancaria);
        bg_TipoPago.add(rb_tarjeta);
        bg_TipoPago.add(rb_TipoPagoNinguno);

        pnl_CondicionPago.setBounds(25, 25, 445, 190);
        pnl_dialog.add(pnl_CondicionPago);

        setTitleName("Condicion de Pago");
        setRegister(pnl_dialog);
        setSize(new Dimension(500, 300));
        ComponentToolKit.centerComponentPosicion(this);
    }

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            setVisible(false);
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_Descripcion) {
                txt_DiasPago.requestFocus();
            }

            if (e.getSource() == txt_DiasPago) {
                rb_contado.requestFocus();
            }

            if (e.getSource() == rb_contado) {
                rb_credito.requestFocus();
            }

            if (e.getSource() == rb_credito) {
                rb_operacionbancaria.requestFocus();
            }

            if (e.getSource() == rb_operacionbancaria) {
                rb_tarjeta.requestFocus();
            }
        } else if (e.getKeyChar() == KeyEvent.VK_SPACE) {
            if (e.getSource() == rb_contado) {
                rb_contado.setSelected(true);
                setFocusAndClick();
            }

            if (e.getSource() == rb_credito) {
                rb_credito.setSelected(true);
                setFocusAndClick();
            }

            if (e.getSource() == rb_tarjeta) {
                rb_tarjeta.setSelected(true);
                setFocusAndClick();
            }

            if (e.getSource() == rb_operacionbancaria) {
                rb_operacionbancaria.setSelected(true);
                setFocusAndClick();
            }
        }
    }

    public void newRegister() {
    }

    public void setRegisterEnabled(boolean e) {
        rb_operacionbancaria.setEnabled(e);
        rb_tarjeta.setEnabled(e);
        rb_contado.setEnabled(e);
        rb_credito.setEnabled(e);
    }

    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
        txt_DiasPago.setEditable(e);
    }

    public boolean isRegisterValid() {
        return false;
    }

    public String executeUpdate() {
        return null;
    }

    public boolean executeDelete() {
        return false;
    }

    public String executeInsert() {
        return null;
    }

    public void prepareRegister() {
        codigo = txt_Codigo.getText().trim();

        if (mode != DELETE) {
        }
    }

    public boolean loadRegister() {
        return false;
    }

    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_Descripcion) {
            txt_Descripcion.selectAll();
        }

        if (e.getSource() == txt_DiasPago) {
            txt_DiasPago.selectAll();
        }
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void loadCombo() {
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
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}