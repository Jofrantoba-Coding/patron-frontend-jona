package com.softcommerce.views.uiregisteraduana;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Aduana;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.LimitDocument;
import java.awt.Component;
import com.softcommerce.general.controles.AbstractRegister;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Dialog;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.Vector;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.rn_Aduana;

public class UiRegisterAduana 
        extends AbstractRegister implements InterUiRegisterAduana, ActionListener, ItemListener, KeyListener, FocusListener {

    protected JTextField txt_Codigo;
    protected JTextField txt_Descripcion;
    protected String codigo;
    protected String descripcion;
    protected final Usuario usuario;

    public UiRegisterAduana(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterAduana(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public void inicialize() {

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Aduana", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        JPanel pnlAduana = new JPanel();
        pnlAduana.setLayout(null);
        pnlAduana.setBackground(new Color(245, 245, 245));
        pnlAduana.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 80, 20);
        pnlAduana.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setBounds(125, 45, 120, 20);
        txt_Codigo.setEditable(false);
        pnlAduana.add(txt_Codigo);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 80, 80, 20);
        pnlAduana.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(125, 80, 260, 20);
        txt_Descripcion.setDocument(new LimitDocument(100));
        txt_Descripcion.addFocusListener(this);
        txt_Descripcion.addKeyListener(this);
        pnlAduana.add(txt_Descripcion);

        pnlAduana.setBounds(20, 20, 460, 130);
        pnl_dialog.add(pnlAduana);

        setTitleName("Aduana");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 235));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            setVisible(false);
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_Descripcion) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public void newRegister() {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
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
    public String executeInsert() {
        return null;
    }

    @Override
    public void prepareRegister() {
        codigo = txt_Codigo.getText().trim();

        descripcion = txt_Descripcion.getText().trim();
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (txt_Descripcion == e.getSource()) {
            txt_Descripcion.selectAll();
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
    }

    @Override
    public boolean executeDetail() {
        return false;
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

    @Override
    public boolean showConfirmDelete() {
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
    public void loadCombo() {
    }

    public void setParametersRegister(ArrayList data, String[] columnNames) {
    }

    @Override
    public void showSearchDialog() {
    }

    public void updateRow(Object ob, int opcion) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public ArrayList getDataTable() {
        return null;
    }

    @Override
    public void addRow(Object[] ob, Component comp, int modo) {
    }

    @Override
    public void removeRow(Object ob, Component comp, int modo) {
    }

    @Override
    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }
}
