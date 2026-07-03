package com.softcommerce.views.uiregistercolor;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanColor;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
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
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Color;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import com.softcommerce.reglasnegocio.RnColor;
import java.util.List;

public class UiRegisterColor extends AbstractRegister implements InterUiRegisterColor, ActionListener, ItemListener, KeyListener, FocusListener {

    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private Usuario usuario;
    private String codigo;
    private String descripcion;

    public UiRegisterColor(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterColor(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Color", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

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

        setTitleName("Color");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 225));
        ComponentToolKit.centerComponentPosicion(this);
    }

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

    public void newRegister() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");

        if (mode == DETAIL) {
            setVisiblePreviusAndNext(false);
        }

        txt_Descripcion.requestFocus();
    }

    public boolean loadRegister() {
        try {
            RnColor regla = new RnColor(path);

            codigo = rowSelection.getSelectedValue(1).toString();

            List<BeanColor> reg = regla.listar(codigo, "", usuario.getCodempresa());

            if (reg.size() == 0) {
                return false;
            } else {
                BeanColor color = reg.get(0);

                if (mode != CLONE) {
                    txt_Codigo.setText(color.getIdColor());
                }

                txt_Descripcion.setText(color.getDescripcion());
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
    }

    public String executeUpdate() {
        try {
            RnColor regla = new RnColor(path);
            return regla.modificar(codigo, descripcion, usuario.getId_usuario(),usuario.getCodempresa());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    public boolean executeDelete() {
        try {
            RnColor regla = new RnColor(path);
            return regla.eliminar(codigo, usuario.getId_usuario(),usuario.getCodempresa());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public String executeInsert() {
        try {
            RnColor regla = new RnColor(path);
            return regla.insertar(descripcion, usuario.getId_usuario(), usuario.getCodempresa());
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    public void prepareRegister() {
        codigo = txt_Codigo.getText().trim();

        if (mode != DELETE) {
            descripcion = txt_Descripcion.getText().trim();
        }
    }

    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());

        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + nameMode + " un Color, debes especificar su Descripcion.", "Datos incompletos de Color", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
        }

        return true;
    }

    public void focusGained(FocusEvent e) {
        if (txt_Descripcion == e.getSource()) {
            txt_Descripcion.selectAll();
        }
    }

    public void setRegisterEnabled(boolean e) {
    }

    public boolean executeDetail() {
        return true;
    }

    public void showMessageSuccessfulInsert() {
    }

    public void showMessageSuccessfulUpdate() {
    }

    public void showMessageSuccessfulDelete() {
    }

    public void showMessageErrorInsert() {
    }

    public void showMessageErrorUpdate() {
    }

    public void showMessageErrorDelete() {
    }

    public boolean showConfirmDelete() {
        return true;
    }

    public boolean executeSelect() {
        return true;
    }

    public void addRow(String[] row) {
    }

    public void actionPerformed(ActionEvent e) {
    }

    public void itemStateChanged(ItemEvent e) {
    }

    public void keyTyped(KeyEvent e) {
    }

    public void keyReleased(KeyEvent e) {
    }

    public void loadCombo() {
    }

    public void addRow(Usuario reg) {
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

    public void setValueSearch(Object valor, Component comp) {
    }

    public void addRow(Usuario reg, int opcion) {
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

    public void showMessagePrint(String codigo) {
    }

    public void removeRow(Object ob, Component comp, int modo) {
    }

    public void updateRow(Usuario ob, Component comp, int modo) {
    }

    public void addRow(Usuario ob, Component comp, int modo) {
    }

    public void focusLost(FocusEvent e) {
    }

    public void addRow(Object[] ob, Component comp, int modo) {
    }

    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    public boolean executeAnular() {
        return true;
    }
}