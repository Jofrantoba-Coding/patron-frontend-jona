package com.softcommerce.views.uiregistermarca;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
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
import java.awt.Dialog;
import java.awt.Font;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnMarca;

public class UiRegisterMarca extends JHDialog implements InterUiRegisterMarca, ActionListener, ItemListener, KeyListener, FocusListener {

    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_idempresa;
    private Usuario usuario;

    public UiRegisterMarca(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterMarca(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Marca", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        JPanel pnlFamilia = new JPanel();
        pnlFamilia.setLayout(null);
        pnlFamilia.setBackground(new Color(245, 245, 245));
        pnlFamilia.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 80, 20);
        pnlFamilia.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setBounds(125, 45, 120, 20);
        pnlFamilia.add(txt_Codigo);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 80, 80, 20);
        pnlFamilia.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(125, 80, 150, 20);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        pnlFamilia.add(txt_Descripcion);

        pnlFamilia.setBounds(20, 20, 460, 120);
        pnl_dialog.add(pnlFamilia);

        txt_idempresa = new JTextField();

        setTitleName("Marca");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 225));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");
        txt_idempresa.setText(usuario.getCodempresa());

        txt_Descripcion.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            RnMarca regla = new RnMarca(path);
            return regla.insertar(txt_Descripcion.getText().trim(), usuario.getId_usuario(), txt_idempresa.getText().trim());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
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
            if (e.getSource() == txt_Descripcion) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());

        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Familia, debes especificar su Descripcion.", "Datos incompletos de Familia", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            RnMarca regla = new RnMarca(path);
            List<BeanMarca> familia = regla.listar(rowSelection.getSelectedValue(1).toString(), "", usuario.getCodempresa());

            if (familia.isEmpty()) {
                return false;
            } else {
                txt_Codigo.setText(mode == CLONE ? "" : familia.get(0).getIdMarca());
                txt_Descripcion.setText(familia.get(0).getDescripcion());
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnMarca regla = new RnMarca(path);
            return regla.modificar(txt_Codigo.getText().trim(), txt_Descripcion.getText().trim(), usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnMarca regla = new RnMarca(path);
            return regla.eliminar(txt_Codigo.getText().trim(), usuario.getId_usuario());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
    }

    @Override
    public void setRegisterEnabled(boolean e) {
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

    @Override
    public void showMessagePrint(String codigo) {
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

    public void addRow(Object[] reg) {
    }

    public void setParametersRegister(ArrayList data, String[] columnNames) {
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

    public ArrayList getDataTable() {
        return null;
    }

    public void addRow(Object reg[], String opcion) {
    }

    public void removeRow(Object reg[], String opcion) {
    }

    public void updateRow(Object reg[], String opcion) {
    }

    public void addRow(Object ob, String opcion) {
    }

    public void removeRow(Object ob, String opcion) {
    }

    public void updateRow(Object ob, String opcion) {
    }

    public void removeRow(Object ob, Component comp, int modo) {
    }

    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    public void addRow(Object[] ob, Component comp, int modo) {
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