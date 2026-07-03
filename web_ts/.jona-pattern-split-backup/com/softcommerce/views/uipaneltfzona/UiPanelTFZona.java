/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfzona;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.ZonaTableModel;
import com.softcommerce.reglasnegocio.RnUbigeo;
import com.softcommerce.reglasnegocio.RnZona;
import com.softcommerce.util.ExportExcel;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
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
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiPanelTFZona extends JHInternalFrame implements InterUiPanelTFZona, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener{

    public CTable table;
    public ZonaTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    private JFrame frame;
    private Usuario usuario;
    private JScrollPane scroll;
    private JTextField txt_codigo;
    private JTextField txt_descripcion;
    private List<Ubigeo> xDepartamento;
    private JComboBox cbo_Departamento;
    private List<Ubigeo> xProvincia;
    private JComboBox cbo_Provincia;
    private List<Ubigeo> xDistrito;
    private JComboBox cbo_Distrito;
    
    public UiPanelTFZona(String title, JFrame frame, Usuario usuario) {
        super(title, true, true, true,false, false, true, true, false, false, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }
    public UiPanelTFZona(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }
    
    private void inicialize() {
        modeltable = new ZonaTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        table.setNoVisibleColumn(3);
        table.setNoVisibleColumn(5);
        table.setNoVisibleColumn(7);
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);
        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));
        JPanel panel = getPanelFilter();
        //panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.NORTH);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);
    }
    
    private void addGrid(JPanel pnl,GridBagConstraints gbc, int x, int y, JComponent component) {
        gbc.gridx = x;
        gbc.gridy = y;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(component, gbc);
    }
    
    private JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        
        pnlp.setLayout(new GridBagLayout());
        
        GridBagConstraints gbc= new GridBagConstraints();
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;     
        JToolBar tool1= new JToolBar();
        tool1.setFloatable(false);

        JToolBar tool2= new JToolBar();
        tool2.setFloatable(false);

        JLabel lbl_idMotivoDescuento = new JLabel("  Código ");
        //lbl_idMotivoDescuento.setBounds(15, 25, 40, 20);
        lbl_idMotivoDescuento.setFont(new Font("Verdana", 0, 11));
        tool1.add(lbl_idMotivoDescuento);

        txt_codigo = new JTextField();
        txt_codigo.setColumns(10);
        //txt_codigo.setBounds(100, 25, 90, 20);
        txt_codigo.addKeyListener(this);
        txt_codigo.setDocument(new IntegerDocument(6));
        txt_codigo.addFocusListener(this);
        txt_codigo.setFont(new Font("Garamond", 0, 14));
        tool1.add(txt_codigo);

        JLabel lblDescripcion = new JLabel("  Desc. ");
        lblDescripcion.setFont(new Font("Verdana", 0, 11));
        //lblDescripcion.setBounds(210, 25, 35, 20);
        tool1.add(lblDescripcion);

        txt_descripcion = new JTextField();
        txt_descripcion.setColumns(20);
        //txt_descripcion.setBounds(245, 25, 360, 20);
        txt_descripcion.addFocusListener(this);
        txt_descripcion.setFont(new Font("Garamond", 0, 14));
        txt_descripcion.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcion.addKeyListener(this);
        tool1.add(txt_descripcion);
        
        JLabel lbl_Departamento = new JLabel("  Departamento ");
        lbl_Departamento.setFont(new Font("Verdana", 0, 11));
        //lbl_Departamento.setBounds(15, 55, 100, 20);
        tool2.add(lbl_Departamento);
        
        cbo_Departamento = new JComboBox();
        cbo_Departamento.addActionListener(this);
        cbo_Departamento.addKeyListener(this);
        //cbo_Departamento.setBounds(100, 55, 200, 20);
        tool2.add(cbo_Departamento);
        
        JLabel lbl_Provincia = new JLabel("  Provincia ");
        lbl_Provincia.setFont(new Font("Verdana", 0, 11));
        //lbl_Provincia.setBounds(320, 55, 100, 20);
        tool2.add(lbl_Provincia);
        
        cbo_Provincia = new JComboBox();
        cbo_Provincia.addActionListener(this);
        //cbo_Provincia.setBounds(385,55,180,20);
        cbo_Provincia.addKeyListener(this);
        cbo_Provincia.setEnabled(false);
        tool2.add(cbo_Provincia);
        
        JLabel lbl_Distrito = new JLabel("  Distrito ");
        lbl_Distrito.setFont(new Font("Verdana", 0, 11));
        //lbl_Distrito.setBounds(600, 55, 100, 20);
        tool2.add(lbl_Distrito);
        
        cbo_Distrito = new JComboBox();
        cbo_Distrito.addActionListener(this);
        //cbo_Distrito.setBounds(655,55,180,20);
        cbo_Distrito.addKeyListener(this);
        cbo_Distrito.setEnabled(false);
        tool2.add(cbo_Distrito);
        addGrid(pnlp, gbc, 0, 0, tool1);
        addGrid(pnlp, gbc, 0, 1, tool2);
        return pnlp;
    }
    
    public void cargarTabla() {
        try {
            RnZona regla = new RnZona(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            modeltable.agregarVectorZona(regla.listar(0,""));
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this,"Error: " + e.getMessage(),"Sistema",JOptionPane.OK_OPTION);
        }
    }
    
    private RowFilter getFilter() {
        List filters = new ArrayList();

        if (txt_codigo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_codigo.getText().trim() + ".*", 1));
        }

        if (txt_descripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcion.getText().trim() + ".*", 2));
        }
        
        if (cbo_Departamento.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xDepartamento.get(cbo_Departamento.getSelectedIndex() - 1).getCodigo() + ".*", 3));
        }
        
        if (cbo_Provincia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xProvincia.get(cbo_Provincia.getSelectedIndex() - 1).getCodigo() + ".*", 5));
        }
        
        if (cbo_Distrito.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xDistrito.get(cbo_Distrito.getSelectedIndex() - 1).getCodigo() + ".*", 7));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }
    
    public void cargarFiltro(){
        loadDepartamento();
    }
    
    private void loadDepartamento() {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);
            if (xDepartamento != null) {
                xDepartamento.clear();
            } else {
                xDepartamento = new ArrayList<Ubigeo>();
            }

            xDepartamento.addAll(regla_Ubigeo.listarZona(""));
            cbo_Departamento.removeAllItems();
            cbo_Departamento.addItem("--- Seleccione un Departamento ---");

            for (int i = 0; i < xDepartamento.size(); i++) {
                cbo_Departamento.addItem(xDepartamento.get(i).getDescripcion());
            }

            cbo_Departamento.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }
    
    private void loadProvincia(String xcoddep) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xProvincia != null) {
                xProvincia.clear();
            } else {
                xProvincia = new ArrayList<Ubigeo>();
            }

            xProvincia.addAll(regla_Ubigeo.listarZona(xcoddep));

            cbo_Provincia.removeAllItems();
            cbo_Provincia.addItem("--- Seleccione una Provincia ---");


            for (int i = 0; i < xProvincia.size(); i++) {
                cbo_Provincia.addItem(xProvincia.get(i).getDescripcion());
            }

            cbo_Provincia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }
    
    private void loadDistrito(String xcoddis) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);

            if (xDistrito != null) {
                xDistrito.clear();
            } else {
                xDistrito = new ArrayList<Ubigeo>();
            }

            xDistrito.addAll(regla_Ubigeo.listarZona(xcoddis));

            cbo_Distrito.removeAllItems();
            cbo_Distrito.addItem("--- Seleccione una Distrito ---");

            for (int i = 0; i < xDistrito.size(); i++) {
                cbo_Distrito.addItem(xDistrito.get(i).getDescripcion());
            }

            cbo_Distrito.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
        }
    }
    
    private void filtrar(){
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if(table.getRowCount()>0)
            table.setRowSelectionInterval(0,0);
    }
    
    private void setScrollValueView(int row){
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {}

    @Override
    public void controlAdd() {
        try {
            setCursor(new Cursor(Cursor.WAIT_CURSOR));
            RegisterZona register = new RegisterZona(frame, usuario);
            register.setPath(path);
            register.setRowSelection(this);
            register.setView(this);
            register.setModeRegister(Register.INSERT);
            register.setVisible(true);
            setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    @Override
    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0)
            return;
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterZona register = new RegisterZona(frame,usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);

        if(register.setModeRegister(Register.UPDATE))
            register.setVisible(true);
        else{
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlEliminate() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0)
            return;
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterZona register = new RegisterZona(frame,usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        if(register.setModeRegister(Register.DELETE))
            register.setVisible(true);
        else{
            controlRefresh();
            register.dispose();
        }
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlNullify() {}

    @Override
    public void controlClone() {}

    @Override
    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0)
            return;
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterZona register = new RegisterZona(frame,usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        if(register.setModeRegister(Register.DETAIL))
            register.setVisible(true);
        else{
            controlRefresh();
            register.dispose();
        }
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlSearch() {}

    @Override
    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Zona");
        ExportExcel.exportar(table, parameters);
    }

    @Override
    public void controlPrint(boolean view) {}

    @Override
    public void controlClose() {
        dispose();
        doDefaultCloseAction();
    }

    @Override
    public void controlRefresh() {
        cargarTabla();
    }

    @Override
    public void refreshTitleName() {}

    @Override
    public void selectFirstRow() {
        if (table.getRowCount() > 0){
            table.setRowSelectionInterval(0,0);
            setScrollValueView(0);
        }
    }

    @Override
    public void selectPreviusRow() {}

    @Override
    public void selectNextRow() {}

    @Override
    public void selectLastRow() {
        if (table.getRowCount() > 0){
            int rowCount = table.getRowCount() - 1;
            table.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    @Override
    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    @Override
    public int getRowCount() {
        return table.getRowCount();
    }

    @Override
    public void selectFirstPage() {}

    @Override
    public void selectPreviusPage() {}

    @Override
    public void selectNextPage() {}

    @Override
    public void selectLastPage() {}

    @Override
    public int getSelectedPage() {
        return 0;
    }

    @Override
    public int getPageCount() {
        return 0;
    }

    @Override
    public void setSelectedRow(int row) {
        if (row >= 0){
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
	}
    }

    @Override
    public void setSelectedRow(String clave, int column) {}

    @Override
    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return  modeltable.getValueAt(realRowIndex, column);
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        if(!e.getValueIsAdjusting())
            refresh();
    }

    @Override
    public void windowOpened(WindowEvent e) {}

    @Override
    public void windowClosing(WindowEvent e) {}

    @Override
    public void windowClosed(WindowEvent e) {}

    @Override
    public void windowIconified(WindowEvent e) {}

    @Override
    public void windowDeiconified(WindowEvent e) {}

    @Override
    public void windowActivated(WindowEvent e) {}

    @Override
    public void windowDeactivated(WindowEvent e) {}

    @Override
    public void focusGained(FocusEvent e) {
        if(e.getSource() == txt_descripcion)
            txt_descripcion.selectAll();

        if(e.getSource() == txt_codigo)
            txt_codigo.selectAll();
    }

    @Override
    public void focusLost(FocusEvent e) {}

    @Override
    public void keyTyped(KeyEvent e) {}

    @Override
    public void keyPressed(KeyEvent e) {
        if(e.getKeyChar() == '\n'){
            if(e.getSource() == txt_codigo)
                txt_descripcion.requestFocus();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if(e.getKeyChar()!='\n'){
            if((e.getSource() == txt_descripcion)||
                (e.getSource() == txt_codigo))
                    filtrar();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_Departamento == e.getSource()) {
            if (cbo_Departamento.getItemCount() > 0) {
                if (cbo_Departamento.getSelectedIndex() >= 0) {
                    if (cbo_Departamento.getSelectedIndex() == 0) {
                        cbo_Provincia.removeAllItems();
                        cbo_Distrito.removeAllItems();
                        cbo_Provincia.setEnabled(false);
                        cbo_Distrito.setEnabled(false);
                    } else {
                        cbo_Provincia.setEnabled(true);
                        loadProvincia(xDepartamento.get(cbo_Departamento.getSelectedIndex() - 1).getCodigo());
                    }
                    filtrar();
                }
            }
        }
        if (cbo_Provincia == e.getSource()) {
            if (cbo_Provincia.getItemCount() > 0) {
                if (cbo_Provincia.getSelectedIndex() >= 0) {
                    if (cbo_Provincia.getSelectedIndex() ==0) {
                        cbo_Distrito.removeAllItems();
                        cbo_Distrito.setEnabled(false);
                    } else {
                        cbo_Distrito.setEnabled(true);
                        loadDistrito(xProvincia.get(cbo_Provincia.getSelectedIndex() - 1).getCodigo());
                    }
                    filtrar();
                }
            }
        }
        if (e.getSource() == cbo_Distrito) {
            if (cbo_Distrito.getItemCount() > 0) {
                if (cbo_Distrito.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {}
    
}
