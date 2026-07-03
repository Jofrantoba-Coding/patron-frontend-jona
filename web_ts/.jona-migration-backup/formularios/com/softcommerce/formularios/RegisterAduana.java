package com.softcommerce.formularios;

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

public class RegisterAduana 
        extends AbstractRegister implements ActionListener, ItemListener, KeyListener, FocusListener {

    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private String codigo;
    private String descripcion;
    private final Usuario usuario;

    public RegisterAduana(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public RegisterAduana(Dialog arg0, Usuario usuario) {
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
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");

        txt_Descripcion.requestFocus();
    }

    @Override
    public boolean loadRegister() {
        try {
            rn_Aduana regla = new rn_Aduana(path);

            codigo = rowSelection.getSelectedValue(1).toString();

            Vector<Aduana> reg = regla.listar(codigo, "");

            if (reg.size() == 0) {
                return false;
            } else {
                txt_Codigo.setText(reg.get(0).getCodigo().trim());
                txt_Descripcion.setText(reg.get(0).getDescripcion().trim());
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
    }

    @Override
    public String executeUpdate() {
        try {
            rn_Aduana regla = new rn_Aduana(path);
            return regla.modificar(codigo, descripcion, usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            rn_Aduana regla = new rn_Aduana(path);
            return regla.eliminar(codigo, usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public String executeInsert() {
        try {
            rn_Aduana regla = new rn_Aduana(path);
            return regla.insertar(descripcion, usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public void prepareRegister() {
        codigo = txt_Codigo.getText().trim();

        descripcion = txt_Descripcion.getText().trim();
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());

        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + nameMode + " un Aduana, debes especificar su Descripcion.", "Datos incompletos de Aduana", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
        }

        return true;
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

    @Override
    public boolean showConfirmDelete() {
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
        return true;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }
}
