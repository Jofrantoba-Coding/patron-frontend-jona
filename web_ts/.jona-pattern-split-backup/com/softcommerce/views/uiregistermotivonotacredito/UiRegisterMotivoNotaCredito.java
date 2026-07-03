package com.softcommerce.views.uiregistermotivonotacredito;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanMotivoNota;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CComboBox;
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
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.List;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.rn_MotivoNotaCredito;

public class UiRegisterMotivoNotaCredito extends JHDialog implements InterUiRegisterMotivoNotaCredito, ActionListener, ItemListener, KeyListener, FocusListener {

    private static final long serialVersionUID = 1L;
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_idempresa;
    private CComboBox cbo_idfamilia;
    private Usuario usuario;

    public UiRegisterMotivoNotaCredito(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterMotivoNotaCredito(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        Gif gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Motivo", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 11), Color.BLACK);

        JPanel pnl_SUB_FAMILIA = new JPanel();
        pnl_SUB_FAMILIA.setLayout(null);
        pnl_SUB_FAMILIA.setBackground(new Color(245, 245, 245));
        pnl_SUB_FAMILIA.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 80, 20);
        pnl_SUB_FAMILIA.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setBounds(125, 45, 80, 20);
        txt_Codigo.addKeyListener(this);
        pnl_SUB_FAMILIA.add(txt_Codigo);

        CLabel lbl_Familia = new CLabel("Tipo");
        lbl_Familia.setBounds(35, 80, 80, 20);
        pnl_SUB_FAMILIA.add(lbl_Familia);

        cbo_idfamilia = new CComboBox();
        cbo_idfamilia.setBounds(125, 80, 180, 20);
        cbo_idfamilia.addKeyListener(this);
        pnl_SUB_FAMILIA.add(cbo_idfamilia);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 115, 80, 20);
        pnl_SUB_FAMILIA.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(125, 115, 220, 20);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        pnl_SUB_FAMILIA.add(txt_Descripcion);

        pnl_SUB_FAMILIA.setBounds(20, 20, 470, 180);
        pnl_dialog.add(pnl_SUB_FAMILIA);

        txt_idempresa = new JTextField();

        setTitleName("Motivo");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(510, 285));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo() {
        loadFamilia();
    }

    public void loadFamilia() {
        cbo_idfamilia.addItem("--- Seleccione un Tipo ---");
        cbo_idfamilia.addItem("NOTA CREDITO COMPRA");
        cbo_idfamilia.addItem("NOTA CREDITO VENTA");
        cbo_idfamilia.addItem("NOTA DEBITO VENTA");
        cbo_idfamilia.setSelectedIndex(0);
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        cbo_idfamilia.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");
        txt_idempresa.setText(usuario.getCodempresa());
        cbo_idfamilia.setSelectedIndex(0);

        cbo_idfamilia.requestFocus();
    }

    @Override
    public String executeInsert() {
        rn_MotivoNotaCredito regla_MotivoNotaCredito = new rn_MotivoNotaCredito(path);

        BeanMotivoNota mnc = new BeanMotivoNota();
        mnc.setDescripcion(txt_Descripcion.getText().trim());
        mnc.setId_usuario(usuario.getId_usuario());
        mnc.setFlag(cbo_idfamilia.getSelectedIndex() > 0 ? (cbo_idfamilia.getSelectedItem().equals("NOTA CREDITO COMPRA") ? "P" : (cbo_idfamilia.getSelectedItem().equals("NOTA CREDITO VENTA") ? "C" : "Y")) : "");

        return regla_MotivoNotaCredito.insertar(mnc);
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (txt_Descripcion == e.getSource()) {
            txt_Descripcion.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cbo_idfamilia) {
                txt_Descripcion.requestFocus();
            }

            if (e.getSource() == txt_Descripcion) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        cbo_idfamilia.setBorder(txt.getBorder());

        if (cbo_idfamilia.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una MotivoNotaCredito, debes " + "especificar su Familia.", "Datos incompletos de MotivoNotaCredito", JOptionPane.CANCEL_OPTION);
            cbo_idfamilia.setBorder(new LineBorder(Color.RED));
            cbo_idfamilia.requestFocus();

            return false;
        }

        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una MotivoNotaCredito , debes " + "especificar su Descripcion.", "Datos incompletos de MotivoNotaCredito", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        BeanMotivoNota s = new BeanMotivoNota();
        s.setId_motivo(rowSelection.getSelectedValue(1).toString());

        rn_MotivoNotaCredito regla = new rn_MotivoNotaCredito(path);

        List<BeanMotivoNota> MotivoNotaCredito = regla.listar(s);

        if (MotivoNotaCredito.isEmpty()) {
            return false;
        } else {
            BeanMotivoNota m = MotivoNotaCredito.get(0);

            txt_Codigo.setText(mode == CLONE ? "" : m.getId_motivo());
            txt_Descripcion.setText(m.getDescripcion());
            cbo_idfamilia.setSelectedItem(m.getFlag().trim());
        }

        return true;
    }

    @Override
    public String executeUpdate() {
        rn_MotivoNotaCredito regla_MotivoNotaCredito = new rn_MotivoNotaCredito(path);

        BeanMotivoNota mnc = new BeanMotivoNota();
        mnc.setId_motivo(txt_Codigo.getText().trim());
        mnc.setDescripcion(txt_Descripcion.getText().trim());
        mnc.setId_usuario(usuario.getId_usuario());
        mnc.setFlag(cbo_idfamilia.getSelectedIndex() > 0 ? (cbo_idfamilia.getSelectedItem().equals("NOTA CREDITO COMPRA") ? "P" : (cbo_idfamilia.getSelectedItem().equals("NOTA CREDITO VENTA") ? "C" : "Y")) : "");

        return regla_MotivoNotaCredito.modificar(mnc);
    }

    @Override
    public boolean executeDelete() {
        rn_MotivoNotaCredito regla_MotivoNotaCredito = new rn_MotivoNotaCredito(path);

        BeanMotivoNota mnc = new BeanMotivoNota();
        mnc.setId_motivo(txt_Codigo.getText().trim());
        mnc.setDescripcion(txt_Descripcion.getText().trim());
        mnc.setId_usuario(usuario.getId_usuario());

        return regla_MotivoNotaCredito.eliminar(mnc);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbo_idfamilia.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    public void prepareRegister() {
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

    public boolean executeDetail() {
        return true;
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
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    public boolean showConfirmDelete() {
        return true;
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    public void addRow(String[] row) {
    }

    public void addRow(Object[] reg) {
    }

    public void loadInicio() {
    }

    public void showSearchDialog() {
    }

    public void loadInicioUDD() {
    }

    public void loadInicioInsert() {
    }

    public void addRow(Object ob, int index) {
    }

    public void addRow(Object ob, int index, int cantidad) {
    }

    public void addRow(Object ob, int index, int cantidad, double participacion) {
    }

    public void removeRow(Object ob, int opcion) {
    }

    public void addRow(Object ob, int cantidad, double participacion) {
    }

    public void addDataRow(Object ob, int cantidad, double participacion) {
    }

    public void updateRow(Object ob, int opcion) {
    }

    public void addRow(Object ob) {
    }

    public void loadInicioUpdate() {
    }

    public void loadInicioBeforeDetail() {
    }

    public void loadInicioAfterDetail() {
    }

    public void loadInicioDelete() {
    }

    public void addRow(Object ob, Component comp) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    public void addRow(Object[] reg, int opcion) {
    }

    public void addRow(Object reg[], String opcion) {
    }

    public void removeRow(Object reg[], String opcion) {
    }

    public void updateRow(Object reg[], String opcion) {
    }

    public void addRow(Object ob, String opcion) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    public void removeRow(Object ob, String opcion) {
    }

    public void updateRow(Object ob, String opcion) {
    }

    public void addRow(Object[] ob, Component comp, int modo) {
    }

    public void removeRow(Object ob, Component comp, int modo) {
    }

    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    @Override
    public boolean executeAnular() {
        return true;
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }
}
