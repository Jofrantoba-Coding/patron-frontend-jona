package com.softcommerce.views.uiregistertipomovinventario;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ClasifInventario;
import com.softcommerce.beans.TablaDetalleSunat;
import com.softcommerce.beans.TablaSunat;
import com.softcommerce.beans.TipoMovInventario;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import java.awt.event.FocusEvent;
import java.util.ArrayList;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
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
import java.awt.event.FocusListener;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.rn_ClasifInventario;
import com.softcommerce.reglasnegocio.RnTablaDetalleSunat;
import com.softcommerce.reglasnegocio.RnTipoMovInventario;
import javax.swing.JLabel;

public class UiRegisterTipoMovInventario extends JHDialog implements InterUiRegisterTipoMovInventario, ActionListener, ItemListener, KeyListener, FocusListener {

    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_Abrev;
    private Usuario usuario = new Usuario();
    private JComboBox cbo_tipo;
    private JComboBox cbo_clasif;
    private List<ClasifInventario> x_clasif;
    private JComboBox cboTablaSunat;
    private List<TablaSunat> xTablaSunat;
    private JComboBox cboTablaDetalleSunat;
    private List<TablaDetalleSunat> xTablaDetalleSunat;
    private JCheckBox chk_habing;

    public UiRegisterTipoMovInventario(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterTipoMovInventario(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Tipo de Movimiento", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        JPanel pnlTipoMovInven = new JPanel();
        pnlTipoMovInven.setLayout(null);
        pnlTipoMovInven.setBorder(border);
        pnlTipoMovInven.setBackground(new Color(245, 245, 245));

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 30, 120, 20);
        pnlTipoMovInven.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setBounds(165, 30, 80, 20);
        pnlTipoMovInven.add(txt_Codigo);

        CLabel lbl_tipo = new CLabel("Tipo");
        lbl_tipo.setBounds(35, 60, 120, 20);
        pnlTipoMovInven.add(lbl_tipo);

        cbo_tipo = new JComboBox();
        cbo_tipo.addKeyListener(this);
        cbo_tipo.addActionListener(this);
        cbo_tipo.setBounds(165, 60, 40, 20);
        pnlTipoMovInven.add(cbo_tipo);

        CLabel lbl_clasif = new CLabel("Clasificacion");
        lbl_clasif.setBounds(35, 90, 120, 20);
        pnlTipoMovInven.add(lbl_clasif);

        cbo_clasif = new JComboBox();
        cbo_clasif.addKeyListener(this);
        cbo_clasif.addActionListener(this);
        cbo_clasif.setBounds(165, 90, 220, 20);
        pnlTipoMovInven.add(cbo_clasif);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35, 120, 120, 20);
        pnlTipoMovInven.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(165, 120, 250, 20);
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addFocusListener(this);
        pnlTipoMovInven.add(txt_Descripcion);

        CLabel lbl_Abrev = new CLabel("Abreviatura");
        lbl_Abrev.setBounds(35, 150, 120, 20);
        pnlTipoMovInven.add(lbl_Abrev);

        txt_Abrev = new JTextField();
        txt_Abrev.setBounds(165, 150, 120, 20);
        txt_Abrev.addKeyListener(this);
        txt_Abrev.setDocument(new UpperCaseNumberDocument(100));
        txt_Abrev.addFocusListener(this);
        pnlTipoMovInven.add(txt_Abrev);

        JLabel lblTablaSunat = new JLabel("Tabla Sunat");
        lblTablaSunat.setBounds(35, 180, 120, 20);
        pnlTipoMovInven.add(lblTablaSunat);

        cboTablaSunat = new JComboBox();
        cboTablaSunat.addActionListener(this);
        cboTablaSunat.addKeyListener(this);
        cboTablaSunat.setBounds(165, 180, 250, 20);
        pnlTipoMovInven.add(cboTablaSunat);

        JLabel lblTablaDetalleSunat = new JLabel("Codigo Sunat");
        lblTablaDetalleSunat.setBounds(35, 210, 120, 20);
        pnlTipoMovInven.add(lblTablaDetalleSunat);

        cboTablaDetalleSunat = new JComboBox();
        cboTablaDetalleSunat.setBounds(165, 210, 200, 20);
        cboTablaDetalleSunat.setEnabled(false);
        pnlTipoMovInven.add(cboTablaDetalleSunat);

        chk_habing = new JCheckBox("Hab Ingreso");
        chk_habing.setBounds(165, 240, 100, 20);
        chk_habing.addKeyListener(this);
        chk_habing.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_habing.addFocusListener(this);
        chk_habing.addItemListener(this);
        chk_habing.setOpaque(false);
        pnlTipoMovInven.add(chk_habing);

        pnlTipoMovInven.setBounds(25, 25, 450, 270);
        pnl_dialog.add(pnlTipoMovInven);

        setTitleName("Tipo de Movimiento de Inventario");
        setRegister(pnl_dialog);
        setSize(new Dimension(515, 380));
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void loadTablaSunat() {
        try {
            RnTablaDetalleSunat logicTabla = new RnTablaDetalleSunat(path);
            if (xTablaSunat != null) {
                xTablaSunat.clear();
            } else {
                xTablaSunat = new ArrayList<TablaSunat>();
            }

            xTablaSunat.addAll(logicTabla.listarTablaSunat());
            cboTablaSunat.removeAllItems();
            cboTablaSunat.addItem("--- Seleccione ---");

            for (int i = 0; i < xTablaSunat.size(); i++) {
                cboTablaSunat.addItem(xTablaSunat.get(i).getNombre() + " - " + xTablaSunat.get(i).getDescripcion());
            }

            cboTablaSunat.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    private void loadTablaDetalleSunat(int id_tabla_sunat) {
        try {
            RnTablaDetalleSunat logicTabla = new RnTablaDetalleSunat(path);

            if (xTablaDetalleSunat != null) {
                xTablaDetalleSunat.clear();
            } else {
                xTablaDetalleSunat = new ArrayList<TablaDetalleSunat>();
            }

            xTablaDetalleSunat.addAll(logicTabla.listarDetalleSunat(id_tabla_sunat));

            cboTablaDetalleSunat.removeAllItems();
            cboTablaDetalleSunat.addItem("--- Seleccione ---");


            for (int i = 0; i < xTablaDetalleSunat.size(); i++) {
                cboTablaDetalleSunat.addItem(xTablaDetalleSunat.get(i).getDescripcion());
            }

            cboTablaDetalleSunat.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }

    @Override
    public void loadCombo() {
        loadTipo();
        loadTablaSunat();
    }

    public void loadTipo() {
        cbo_tipo.addItem("E");
        cbo_tipo.addItem("S");
    }

    public void loadClasificacion(String tipo) {
        rn_ClasifInventario regla_Ubigeo = new rn_ClasifInventario(path);

        if (x_clasif != null) {
            x_clasif.clear();
        } else {
            x_clasif = new ArrayList<ClasifInventario>();
        }

        x_clasif.addAll(regla_Ubigeo.listar("", "", "", tipo));

        cbo_clasif.removeAllItems();

        for (int i = 0; i < x_clasif.size(); i++) {
            cbo_clasif.addItem(x_clasif.get(i).getDescripcion());
        }

        cbo_clasif.setSelectedIndex(0);
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Abrev.setBorder(txt.getBorder());
        cbo_tipo.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");
        txt_Abrev.setText("");
        cbo_tipo.setSelectedItem("E");
        chk_habing.setSelected(false);

        txt_Descripcion.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            RnTipoMovInventario logicTipoMov = new RnTipoMovInventario(path);
            TipoMovInventario beanTipoMovInventario = new TipoMovInventario();
            TablaDetalleSunat beanTablaDetalleSunat = new TablaDetalleSunat();
            beanTipoMovInventario.setIdTipoMov("");
            beanTipoMovInventario.setDescripcion(txt_Descripcion.getText().trim());
            beanTipoMovInventario.setAbrev(txt_Abrev.getText().trim());
            beanTipoMovInventario.setTipo(cbo_tipo.getSelectedItem().toString().trim());
            beanTipoMovInventario.setUsuario(usuario.getId_usuario());
            beanTipoMovInventario.setHabNi(chk_habing.isSelected() ? "S" : "N");
            beanTipoMovInventario.setIdClasifInventario(x_clasif.get(cbo_clasif.getSelectedIndex()).getid_clasif_inventario());
            beanTablaDetalleSunat.setIdDetalleSunat(cboTablaDetalleSunat.getSelectedIndex() > 0 ? xTablaDetalleSunat.get(cboTablaDetalleSunat.getSelectedIndex() - 1).getIdDetalleSunat() : 0);
            beanTipoMovInventario.setBeanDetalleSunat(beanTablaDetalleSunat);
            beanTipoMovInventario.setEstado("A");
            String rpta = "";
            rpta = logicTipoMov.manTipoMovInventario(beanTipoMovInventario, "I");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_Abrev) {
            txt_Abrev.requestFocus();
        }

        if (e.getSource() == txt_Descripcion) {
            txt_Descripcion.requestFocus();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cbo_tipo) {
                txt_Descripcion.requestFocus();
            }

            if (e.getSource() == txt_Descripcion) {
                txt_Abrev.requestFocus();
            }

            if (e.getSource() == txt_Abrev) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Abrev.setBorder(txt.getBorder());
        cbo_tipo.setBorder(txt.getBorder());

        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Tipo de Movimiento de Inventario, debes especificar su Descripcion.", "Datos incompletos de Tipo de Movimiento de Inventario", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
        }

        if (txt_Abrev.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + this.namemode + " un Tipo de Movimiento de Inventario, debes " + "especificar su Abreviatura.", "Datos incompletos de Tipo de Movimiento de Inventario", 2);
            txt_Abrev.setBorder(new LineBorder(Color.RED));
            txt_Abrev.requestFocus();

            return false;
        }

        return true;

    }

    @Override
    public boolean loadRegister() {
        try {
            RnTipoMovInventario regla = new RnTipoMovInventario(path);

            List<TipoMovInventario> reg = regla.listar(new TipoMovInventario(rowSelection.getSelectedValue(1).toString()));

            if (reg.isEmpty()) {
                return false;
            } else {
                txt_Codigo.setText(mode == CLONE ? "" : reg.get(0).getIdTipoMov());
                txt_Descripcion.setText(reg.get(0).getDescripcion());
                txt_Abrev.setText(reg.get(0).getAbrev());
                cbo_tipo.setSelectedItem((reg.get(0).getTipo().equals("ENTRADA")) ? "E" : "S");
                cargarClasificacion(reg.get(0).getIdClasifInventario());
                chk_habing.setSelected(reg.get(0).getHabNi().equals("S") ? true : false);
                for (int i = 0; i < xTablaSunat.size(); i++) {
                    if (xTablaSunat.get(i).getId_tabla_sunat() == reg.get(0).getBeanDetalleSunat().getIdTablaSunat()) {
                        cboTablaSunat.setSelectedIndex(i + 1);
                    }
                }
                if (xTablaDetalleSunat != null) {
                    for (int i = 0; i < xTablaDetalleSunat.size(); i++) {
                        if (xTablaDetalleSunat.get(i).getIdDetalleSunat() == reg.get(0).getBeanDetalleSunat().getIdDetalleSunat()) {
                            cboTablaDetalleSunat.setSelectedIndex(i + 1);
                        }
                    }
                }
            }

            return true;
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage());
            return false;
        }
    }

    public void cargarClasificacion(String codEmpresa) {
        if (x_clasif != null && !codEmpresa.equals("")) {
            for (int i = 0; i < x_clasif.size(); i++) {
                if (x_clasif.get(i).getid_clasif_inventario().equals(codEmpresa)) {
                    cbo_clasif.setSelectedIndex(i);
                    break;
                }
            }
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnTipoMovInventario logicTipoMov = new RnTipoMovInventario(path);
            TipoMovInventario beanTipoMovInventario = new TipoMovInventario();
            TablaDetalleSunat beanTablaDetalleSunat = new TablaDetalleSunat();
            beanTipoMovInventario.setIdTipoMov(txt_Codigo.getText().trim());
            beanTipoMovInventario.setDescripcion(txt_Descripcion.getText().trim());
            beanTipoMovInventario.setAbrev(txt_Abrev.getText().trim());
            beanTipoMovInventario.setTipo(cbo_tipo.getSelectedItem().toString().trim());
            beanTipoMovInventario.setUsuario(usuario.getId_usuario());
            beanTipoMovInventario.setHabNi(chk_habing.isSelected() ? "S" : "N");
            beanTipoMovInventario.setIdClasifInventario(x_clasif.get(cbo_clasif.getSelectedIndex()).getid_clasif_inventario());
            beanTablaDetalleSunat.setIdDetalleSunat(cboTablaDetalleSunat.getSelectedIndex() > 0 ? xTablaDetalleSunat.get(cboTablaDetalleSunat.getSelectedIndex() - 1).getIdDetalleSunat() : 0);
            beanTipoMovInventario.setBeanDetalleSunat(beanTablaDetalleSunat);
            beanTipoMovInventario.setEstado("A");
            String rpta = "";
            rpta = logicTipoMov.manTipoMovInventario(beanTipoMovInventario, "A");
            return rpta;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnTipoMovInventario logicTipoMov = new RnTipoMovInventario(path);
            TipoMovInventario beanTipoMovInventario = new TipoMovInventario();
            TablaDetalleSunat beanTablaDetalleSunat = new TablaDetalleSunat();
            beanTipoMovInventario.setIdTipoMov(txt_Codigo.getText().trim());
            beanTipoMovInventario.setDescripcion(txt_Descripcion.getText().trim());
            beanTipoMovInventario.setAbrev(txt_Abrev.getText().trim());
            beanTipoMovInventario.setHabNi(chk_habing.isSelected() ? "S" : "N");
            beanTipoMovInventario.setTipo(cbo_tipo.getSelectedItem().toString().trim());
            beanTipoMovInventario.setUsuario(usuario.getId_usuario());
            beanTipoMovInventario.setIdClasifInventario(x_clasif.get(cbo_clasif.getSelectedIndex()).getid_clasif_inventario());
            beanTablaDetalleSunat.setIdDetalleSunat(cboTablaDetalleSunat.getSelectedIndex() > 0 ? xTablaDetalleSunat.get(cboTablaDetalleSunat.getSelectedIndex() - 1).getIdDetalleSunat() : 0);
            beanTipoMovInventario.setBeanDetalleSunat(beanTablaDetalleSunat);
            beanTipoMovInventario.setEstado("A");
            String rpta = "";
            rpta = logicTipoMov.manTipoMovInventario(beanTipoMovInventario, "E");
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        cbo_tipo.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
        txt_Abrev.setEditable(e);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_tipo == e.getSource()) {
            if (cbo_tipo.getItemCount() > 0) {
                if (cbo_tipo.getSelectedIndex() >= 0) {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbo_clasif.setEnabled(true);
                    }

                    loadClasificacion(cbo_tipo.getSelectedItem().toString().trim());
                }
            }
        }
        if (cboTablaSunat == e.getSource()) {
            if (cboTablaSunat.getItemCount() > 0) {
                if (cboTablaSunat.getSelectedIndex() == 0) {
                    cboTablaDetalleSunat.removeAllItems();
                    cboTablaDetalleSunat.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cboTablaDetalleSunat.setEnabled(true);
                    }
                    loadTablaDetalleSunat(xTablaSunat.get(cboTablaSunat.getSelectedIndex() - 1).getId_tabla_sunat());
                }
            }
        }
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

    public ArrayList getDataTable() {
        return null;
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

    public void removeRow(Object ob, String opcion) {
    }

    public void updateRow(Object ob, String opcion) {
    }

    public void addRow(Object[] ob, Component comp, int modo) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    public void removeRow(Object ob, Component comp, int modo) {
    }

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
    public boolean loadRegister(Object o) {
        return true;
    }
}