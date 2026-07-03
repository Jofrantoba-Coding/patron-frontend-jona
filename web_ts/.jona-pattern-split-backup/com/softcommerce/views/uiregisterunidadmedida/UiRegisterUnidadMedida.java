package com.softcommerce.views.uiregisterunidadmedida;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.TablaDetalleSunat;
import com.softcommerce.beans.TablaSunat;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.Magnitud;
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
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import com.softcommerce.general.controles.CLabel;
import static com.softcommerce.general.controles.Register.CLONE;
import static com.softcommerce.general.controles.Register.INSERT;
import static com.softcommerce.general.controles.Register.UPDATE;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnTablaDetalleSunat;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
import com.softcommerce.util.LayoutUtil;
import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.List;
import javax.swing.ButtonGroup;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JRadioButton;

public class UiRegisterUnidadMedida extends AbstractRegister implements InterUiRegisterUnidadMedida, ActionListener, ItemListener, KeyListener, FocusListener {

    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_Abrev;
    private Usuario usuario;
    private String codigo;
    private String descripcion;
    private String abreviatura;    
    private JComboBox cboTablaSunat;
    private List<TablaSunat> xTablaSunat;
    private JComboBox cboTablaDetalleSunat;
    private List<TablaDetalleSunat> xTablaDetalleSunat;
    private JPanel pnlPresentacion;
    private JComboBox cboMagnitud;
    private List<Magnitud> listaMagnitud;
    private JTextField txtFactorPresentacion;
    private JComboBox cboUnidadPresentacion;
    private List<BeanUnidadMedida> listaUnidadPresentacion;
    private ButtonGroup bgUnidadBp;
    private JRadioButton rbPresentacion;
    private JRadioButton rbUnidadBase;

    public UiRegisterUnidadMedida(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterUnidadMedida(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Unidad de Medida", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        
        GridBagConstraints gbc = LayoutUtil.getGbc();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.BOTH;
        
        JPanel pnlFamilia = new JPanel();        
        pnlFamilia.setLayout(new GridBagLayout());
        pnlFamilia.setBackground(new Color(245, 245, 245));
        pnlFamilia.setBorder(border);
                
        CLabel lbl_Codigo = new CLabel("Código");        
        gbc.gridx = 0;
        pnlFamilia.add(lbl_Codigo,gbc);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);            
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.BOTH;             
        pnlFamilia.add(txt_Codigo,gbc);           

        CLabel lbl_Descripcion = new CLabel("Descripción");        
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        pnlFamilia.add(lbl_Descripcion,gbc);

        txt_Descripcion = new JTextField();        
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);       
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.BOTH;
        pnlFamilia.add(txt_Descripcion,gbc);

        CLabel lbl_Abrev = new CLabel("Abreviatura");        
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        pnlFamilia.add(lbl_Abrev,gbc);

        txt_Abrev = new JTextField();        
        txt_Abrev.setDocument(new UpperCaseNumberDocument(100));
        txt_Abrev.addFocusListener(this);
        txt_Abrev.addKeyListener(this);
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.BOTH;
        pnlFamilia.add(txt_Abrev,gbc);

        JLabel lblTablaSunat = new JLabel("Tabla Sunat");        
        cboTablaSunat = new JComboBox();
        cboTablaSunat.addActionListener(this);
        cboTablaSunat.addKeyListener(this);         
        
        bgUnidadBp=new ButtonGroup();
        rbPresentacion=new JRadioButton("Presentación");
        rbPresentacion.setSelected(true);
        rbUnidadBase=new JRadioButton("Unidad Base");
        bgUnidadBp.add(rbUnidadBase);
        bgUnidadBp.add(rbPresentacion);
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        pnlFamilia.add(rbPresentacion,gbc);
                    
        gbc.gridx = 1;        
        gbc.gridwidth=2;
        gbc.fill = GridBagConstraints.BOTH;
        pnlFamilia.add(rbUnidadBase,gbc);
        
        pnlPresentacion=new JPanel();
        pnlPresentacion.setLayout(new FlowLayout(FlowLayout.LEFT));
        JLabel lblFp=new JLabel("FP");
        lblFp.setToolTipText("Factor de presentación");
        JLabel lblUp=new JLabel("UP");
        lblUp.setToolTipText("Unidad de presentación");
        txtFactorPresentacion=new JTextField();
        txtFactorPresentacion.setColumns(5);
        cboUnidadPresentacion=new JComboBox();
        pnlPresentacion.add(lblFp);
        pnlPresentacion.add(this.txtFactorPresentacion);
        pnlPresentacion.add(lblUp);
        pnlPresentacion.add(this.cboUnidadPresentacion);
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.gridwidth=2;
        gbc.fill = GridBagConstraints.BOTH;        
        pnlFamilia.add(pnlPresentacion,gbc);

        JLabel lblTablaDetalleSunat = new JLabel("Codigo Sunat");        
        gbc.gridx = 0;
        gbc.gridy = 5;
        gbc.gridwidth=1;
        gbc.fill = GridBagConstraints.BOTH;
        pnlFamilia.add(lblTablaDetalleSunat,gbc);

        cboTablaDetalleSunat = new JComboBox();        
        cboTablaDetalleSunat.setEnabled(false);
        gbc.gridx = 1;        
        gbc.fill = GridBagConstraints.BOTH;
        pnlFamilia.add(cboTablaDetalleSunat,gbc);
        
        pnl_dialog.add(pnlFamilia);

        setTitleName("Unidad de Medida");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 320));
        ComponentToolKit.centerComponentPosicion(this);
    }
    
    private void loadUnidadMedida() {
        try {
            RnUnidadMedida reglaUnidadMedida = new RnUnidadMedida(path);

            if (listaUnidadPresentacion != null) {
                listaUnidadPresentacion.clear();
            } else {
                listaUnidadPresentacion = new ArrayList<BeanUnidadMedida>();
            }

            listaUnidadPresentacion.addAll(reglaUnidadMedida.listar("", "", "", usuario.getCodempresa()));

            cboUnidadPresentacion.removeAllItems();                        

            cboUnidadPresentacion.addItem("--- Seleccione U.P. ---");            

            for (Integer i = 0; i < listaUnidadPresentacion.size(); i++) {
                cboUnidadPresentacion.addItem(listaUnidadPresentacion.get(i).getAbreviatura());                
            }

            cboUnidadPresentacion.setSelectedIndex(0);            
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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

            cboTablaSunat.setSelectedIndex(6);
            loadTablaDetalleSunat(xTablaSunat.get(cboTablaSunat.getSelectedIndex() - 1).getId_tabla_sunat());
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

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            setVisible(false);
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_Descripcion) {
                txt_Abrev.requestFocus();
            }
            if (e.getSource() == txt_Abrev) {
                setFocusAndClick();
            }
        }
    }

    public void newRegister() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Abrev.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");
        txt_Abrev.setText("");

        if (mode == DETAIL) {
            setVisiblePreviusAndNext(false);
        }

        txt_Descripcion.requestFocus();
    }

    public boolean loadRegister() {
        try {
            RnUnidadMedida regla = new RnUnidadMedida(path);

            codigo = rowSelection.getSelectedValue(1).toString();

            List<BeanUnidadMedida> reg = regla.listar(codigo, "", "", usuario.getCodempresa());

            if (reg.size() == 0) {
                return false;
            } else {
                BeanUnidadMedida unidadMedida = reg.get(0);

                if (mode != CLONE) {
                    txt_Codigo.setText(unidadMedida.getIdUm());
                }
                txt_Descripcion.setText(unidadMedida.getDescripcion());
                txt_Abrev.setText(unidadMedida.getAbreviatura());
                for (int i = 0; i < xTablaSunat.size(); i++) {
                    if (xTablaSunat.get(i).getId_tabla_sunat() == reg.get(0).getBeanTablaDetalleSunat().getIdTablaSunat()) {
                        cboTablaSunat.setSelectedIndex(i + 1);
                    }
                }
                if (xTablaDetalleSunat != null) {
                    for (int i = 0; i < xTablaDetalleSunat.size(); i++) {
                        if (xTablaDetalleSunat.get(i).getIdDetalleSunat() == reg.get(0).getBeanTablaDetalleSunat().getIdDetalleSunat()) {
                            cboTablaDetalleSunat.setSelectedIndex(i + 1);
                        }
                    }
                }
            }

            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void setRegisterEditable(boolean e) {
        txt_Descripcion.setEditable(e);
        txt_Abrev.setEditable(e);
    }

    public String executeUpdate() {
        try {
            RnUnidadMedida regla = new RnUnidadMedida(path);
            BeanUnidadMedida beanUnidadMedida = new BeanUnidadMedida();
            TablaDetalleSunat beanTablaDetalleSunat = new TablaDetalleSunat();
            beanUnidadMedida.setIdUm(txt_Codigo.getText().trim());
            beanUnidadMedida.setDescripcion(txt_Descripcion.getText().trim());
            beanUnidadMedida.setAbreviatura(txt_Abrev.getText().trim());
            beanUnidadMedida.setEstado("A");
            beanUnidadMedida.setIdUsuario(usuario.getId_usuario());
            beanTablaDetalleSunat.setIdDetalleSunat(cboTablaDetalleSunat.getSelectedIndex() > 0 ? xTablaDetalleSunat.get(cboTablaDetalleSunat.getSelectedIndex() - 1).getIdDetalleSunat() : 0);
            beanUnidadMedida.setBeanTablaDetalleSunat(beanTablaDetalleSunat);

            return regla.manUnidadMedida(beanUnidadMedida, "A");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    public String executeInsert() {
        try {
            RnUnidadMedida regla = new RnUnidadMedida(path);
            BeanUnidadMedida beanUnidadMedida = new BeanUnidadMedida();
            TablaDetalleSunat beanTablaDetalleSunat = new TablaDetalleSunat();
            beanUnidadMedida.setIdUm("");
            beanUnidadMedida.setDescripcion(txt_Descripcion.getText().trim());
            beanUnidadMedida.setAbreviatura(txt_Abrev.getText().trim());
            beanUnidadMedida.setEstado("A");
            beanUnidadMedida.setIdUsuario(usuario.getId_usuario());
            beanTablaDetalleSunat.setIdDetalleSunat(cboTablaDetalleSunat.getSelectedIndex() > 0 ? xTablaDetalleSunat.get(cboTablaDetalleSunat.getSelectedIndex() - 1).getIdDetalleSunat() : 0);
            beanUnidadMedida.setBeanTablaDetalleSunat(beanTablaDetalleSunat);

            return regla.manUnidadMedida(beanUnidadMedida, "I");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    public boolean executeDelete() {
        try {
            RnUnidadMedida regla = new RnUnidadMedida(path);
            BeanUnidadMedida beanUnidadMedida = new BeanUnidadMedida();
            TablaDetalleSunat beanTablaDetalleSunat = new TablaDetalleSunat();
            beanUnidadMedida.setIdUm(txt_Codigo.getText().trim());
            beanUnidadMedida.setDescripcion(txt_Descripcion.getText().trim());
            beanUnidadMedida.setAbreviatura(txt_Abrev.getText().trim());
            beanUnidadMedida.setEstado("A");
            beanUnidadMedida.setIdUsuario(usuario.getId_usuario());
            beanTablaDetalleSunat.setIdDetalleSunat(cboTablaDetalleSunat.getSelectedIndex() > 0 ? xTablaDetalleSunat.get(cboTablaDetalleSunat.getSelectedIndex() - 1).getIdDetalleSunat() : 0);
            beanUnidadMedida.setBeanTablaDetalleSunat(beanTablaDetalleSunat);
            String rpta = "";
            regla.manUnidadMedida(beanUnidadMedida, "E");
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    public void prepareRegister() {
        codigo = txt_Codigo.getText().trim();

        if (mode != DELETE) {
            descripcion = txt_Descripcion.getText().trim();
            abreviatura = txt_Abrev.getText().trim();
        }
    }

    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Abrev.setBorder(txt.getBorder());

        if (txt_Descripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + nameMode + " una Unidad de Medida, debes especificar su Descripcion.", "Datos incompletos de Unidad de Medida", JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
        }

        if (txt_Abrev.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + this.nameMode + " una Unidad de Medida, debes " + "especificar su Abreviatura.", "Datos incompletos de Unidad de MEdida", 2);
            txt_Abrev.setBorder(new LineBorder(Color.RED));
            txt_Abrev.requestFocus();

            return false;
        }

        return true;
    }

    public void focusGained(FocusEvent e) {
        if (txt_Descripcion == e.getSource()) {
            txt_Descripcion.selectAll();
        }

        if (txt_Abrev == e.getSource()) {
            txt_Abrev.selectAll();
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

    public void itemStateChanged(ItemEvent e) {
    }

    public void keyTyped(KeyEvent e) {
    }

    public void keyReleased(KeyEvent e) {
    }

    public void loadCombo() {
        loadTablaSunat();
        loadUnidadMedida();
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

    public void showMessagePrint(String codigo) {
    }

    public void focusLost(FocusEvent e) {
    }

    public boolean executeAnular() {
        return true;
    }
}
