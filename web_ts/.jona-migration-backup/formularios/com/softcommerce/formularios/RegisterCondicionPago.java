package com.softcommerce.formularios;

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

public class RegisterCondicionPago extends JHDialog implements ActionListener, ItemListener, KeyListener, FocusListener {

    private static final long serialVersionUID = 1L;
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_DiasPago;
    private CRadioButton rb_credito;
    private CRadioButton rb_contado;
    private CRadioButton rb_operacionbancaria;
    private CRadioButton rb_tarjeta;
    private CRadioButton rb_TipoPagoNinguno;
    private ButtonGroup bg_TipoPago;
    String codigo;
    private Usuario usuario;

    public RegisterCondicionPago(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public RegisterCondicionPago(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
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
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_DiasPago.setBorder(txt.getBorder());
        rb_contado.setForeground(txt.getForeground());
        rb_operacionbancaria.setForeground(txt.getForeground());
        rb_tarjeta.setForeground(txt.getForeground());
        rb_credito.setForeground(txt.getForeground());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");
        txt_DiasPago.setText("");
        rb_TipoPagoNinguno.setSelected(true);

        //if(mode == DETAIL)
        //  setVisiblePreviusAndNext(false);

        txt_Descripcion.requestFocus();
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
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_DiasPago.setBorder(txt.getBorder());
        rb_credito.setForeground(txt.getForeground());
        rb_contado.setForeground(txt.getForeground());
        rb_operacionbancaria.setForeground(txt.getForeground());
        rb_tarjeta.setForeground(txt.getForeground());


        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + this.namemode + " una Condición de Pago, debes " + "especificar su Descripción.", "Datos incompletos de Condición de Pago", 2);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
        }

        if (txt_DiasPago.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + this.namemode + " una Condición de Pago, debes " + "especificar sus Dias de Pago.", "Datos incompletos de Condición de Pago", 2);
            this.txt_DiasPago.setBorder(new LineBorder(Color.RED));
            txt_DiasPago.requestFocus();

            return false;
        }

        if (!rb_contado.isSelected() && !rb_credito.isSelected() && !rb_tarjeta.isSelected() && !rb_operacionbancaria.isSelected()) {
            JOptionPane.showMessageDialog(this, "Para " + this.namemode + " una Condición de Pago, debes " + "especificar su Tipo de Pago.", "Datos incompletos de Condición de Pago", 2);
            this.rb_contado.setForeground(Color.red);
            this.rb_credito.setForeground(Color.red);
            this.rb_operacionbancaria.setForeground(Color.red);
            this.rb_tarjeta.setForeground(Color.red);
            rb_credito.requestFocus();

            return false;
        }

        return true;
    }

    public String executeUpdate() {
        rn_CondicionPago regla = new rn_CondicionPago(path);

        return regla.modificar(
                codigo, txt_Descripcion.getText().toString().trim(), (!txt_DiasPago.getText().toString().trim().equals("")) ? Integer.valueOf(txt_DiasPago.getText().toString().trim()) : 0, rb_contado.isSelected() ? "CO" : (rb_operacionbancaria.isSelected() ? "OB" : (rb_tarjeta.isSelected() ? "TA" : "CR")), usuario.getId_usuario());
    }

    public boolean executeDelete() {
        rn_CondicionPago regla = new rn_CondicionPago(path);

        return regla.eliminar(
                codigo, usuario.getId_usuario());
    }

    public String executeInsert() {
        BeanCondicionPago cp = new BeanCondicionPago();
        cp.setDescripcion(txt_Descripcion.getText().toString().trim());
        cp.setTipo(rb_contado.isSelected() ? "CO" : (rb_operacionbancaria.isSelected() ? "OB" : (rb_tarjeta.isSelected() ? "TA" : "CR")));
        cp.setDiaspago((!txt_DiasPago.getText().toString().trim().equals("")) ? Integer.valueOf(txt_DiasPago.getText().toString().trim()) : 0);
        cp.setIdUsuario(usuario.getId_usuario());

        rn_CondicionPago regla = new rn_CondicionPago(path);

        return regla.insertar(cp);
    }

    public void prepareRegister() {
        codigo = txt_Codigo.getText().trim();

        if (mode != DELETE) {
        }
    }

    public boolean loadRegister() {
        rn_CondicionPago regla = new rn_CondicionPago(path);

        codigo = rowSelection.getSelectedValue(1).toString();

        Vector<BeanCondicionPago> reg = regla.listar(codigo, "", -1, "");

        if (reg.size() == 0) {
            return false;
        } else {
            if (mode != CLONE) {
                txt_Codigo.setText(reg.get(0).getIdTipoDoc());
            }

            txt_Descripcion.setText(reg.get(0).getDescripcion());
            txt_DiasPago.setText(String.valueOf(reg.get(0).getDiaspago()));
            if (reg.get(0).getTipo().equals("CONTADO")) {
                rb_contado.setSelected(true);
            } else {
                rb_credito.setSelected(true);
            }
        }

        return true;
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
    public boolean executeAnular() {
        return true;
    }

    @Override
    public boolean executeSelect() {
        return true;
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