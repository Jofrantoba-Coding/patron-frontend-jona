/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfproveedornuevo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.tablas.ProveedorTableModel;
import com.softcommerce.reglasnegocio.RnProveedor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;
import com.softcommerce.util.ExportExcel;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.HashMap;
import java.util.Map;
//import javax.swing.table.JTableHeader;
//import javax.swing.table.TableColumn;
//import javax.swing.table.TableColumnModel;

/**
 *
 * @author Team Develtrex
 */
public class UiPanelTFProveedorNuevo extends JHInternalFrame implements InterUiPanelTFProveedorNuevo, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener, MouseListener {
    
    public CTable tableProv;
    public ProveedorTableModel modeltableProv;
    public TableRowSorter modeloOrdenadoProv;
    private JScrollPane scrollProv;
    private JFrame frame;
    private Usuario usuario;
    private JTextField txt_codigo;
    private JTextField txt_numero;
    private JTextField txt_descripcion;
    private JCheckBox chk_percepcion;
    private JCheckBox chk_retencion;
    private JCheckBox chk_buen_contrib;
    
    public UiPanelTFProveedorNuevo(String title, JFrame frame, Usuario usuario) {
        super(title + " - UiPanelTFProveedorNuevo", true, true, true, false, false, true, true, false, true, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
        initListener();
    }
    
    public UiPanelTFProveedorNuevo(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
        initListener();
    }
    
    public UiPanelTFProveedorNuevo(String title, JFrame frame, Usuario usuario, boolean vendedor) {
        super(title + " - UiPanelTFProveedorNuevo", false, false, false, false, false, true, true, false, true, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
        initListener();
    }
    
    private void inicialize() {
        modeltableProv = new ProveedorTableModel();
        modeloOrdenadoProv = new TableRowSorter(modeltableProv);
        tableProv = new CTable();
        tableProv.setRowSorter(modeloOrdenadoProv);
        tableProv.setModel(modeltableProv);
        tableProv.setAllTableNoEditable();
        tableProv.setAllColumnNoResizable();
        tableProv.setRendererColumnZero();
        tableProv.setAllColumnPreferredWidth();
        tableProv.setNoVisibleColumn(2);
        tableProv.setNoVisibleColumn(4);
        tableProv.setNoVisibleColumn(5);
        tableProv.setNoVisibleColumn(6);
        tableProv.setNoVisibleColumn(7);
        tableProv.setNoVisibleColumn(8);
        scrollProv = new JScrollPane(tableProv);
        
        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));
        JPanel panel = getPanelFilter();
        //panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.NORTH);
        
        scrollProv.setPreferredSize(new Dimension(1200, 200));
        pnlaux.add(scrollProv, BorderLayout.CENTER);
        tableProv.setColumnMinWidth(2, 350);
        tableProv.setColumnMaxWidth(2, 350);
        tableProv.setColumnMinWidth(4, 350);
        tableProv.setColumnMaxWidth(4, 350);
        setTable(pnlaux);
    }
    
    private void initListener() {
        txt_codigo.addKeyListener(this);
        txt_codigo.addFocusListener(this);
        txt_numero.addKeyListener(this);
        txt_numero.addFocusListener(this);
        txt_descripcion.addKeyListener(this);
        txt_descripcion.addFocusListener(this);
        chk_percepcion.addItemListener(this);
        chk_percepcion.addKeyListener(this);
        chk_percepcion.addFocusListener(this);
        chk_retencion.addItemListener(this);
        chk_retencion.addKeyListener(this);
        chk_retencion.addFocusListener(this);
        chk_buen_contrib.addItemListener(this);
        chk_buen_contrib.addKeyListener(this);
        chk_buen_contrib.addFocusListener(this);
        tableProv.getSelectionModel().addListSelectionListener(this);
        tableProv.addMouseListener(this);
        tableProv.addKeyListener(this);
    }
    
    private JPanel getPanelFilter() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlp = new JPanel();
        pnlPrinc.add(pnlp, BorderLayout.WEST);
        pnlPrinc.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);
        
        JLabel lbl_codigo = new JLabel("Código");
        lbl_codigo.setFont(new Font("Verdana", 0, 10));
        pnlp.add(lbl_codigo);
        
        txt_codigo = new JTextField();
        txt_codigo.setDocument(new IntegerDocument(10));
        txt_codigo.setColumns(10);
        gbc.gridx = 1;
        pnlp.add(txt_codigo, gbc);
        
        JLabel lbl_numero = new JLabel("DNI/RUC");
        gbc.gridx = 2;
        pnlp.add(lbl_numero, gbc);
        
        txt_numero = new JTextField();
        txt_numero.setDocument(new IntegerDocument(11));
        txt_numero.setColumns(10);
        gbc.gridx = 3;
        pnlp.add(txt_numero, gbc);
        
        JLabel lbl_descripcion = new JLabel("R. Social");
        gbc.gridx = 4;
        pnlp.add(lbl_descripcion, gbc);
        
        txt_descripcion = new JTextField();
        txt_descripcion.setDocument(new UpperCaseDocument(100));
        txt_descripcion.setColumns(10);
        gbc.gridx = 5;
        pnlp.add(txt_descripcion, gbc);
        
        gbc.gridx = 0;
        gbc.gridy = 1;
        
        chk_percepcion = new JCheckBox("Ag Percepcion");
        chk_percepcion.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_percepcion.setOpaque(false);
        pnlp.add(chk_percepcion, gbc);
        
        chk_retencion = new JCheckBox("Ag Retencion");
        chk_retencion.setHorizontalTextPosition(SwingConstants.RIGHT);
        chk_retencion.setOpaque(false);
        gbc.gridx = 1;
        pnlp.add(chk_retencion, gbc);
        
        chk_buen_contrib = new JCheckBox("Buen Contribuyente");
        chk_buen_contrib.setHorizontalTextPosition(SwingConstants.RIGHT);
        gbc.gridx = 2;
        chk_buen_contrib.setOpaque(false);
        pnlp.add(chk_buen_contrib, gbc);
        
        return pnlPrinc;
    }
    
    public void cargarTabla() {
        try {
            RnProveedor regla = new RnProveedor(path);
            modeloOrdenadoProv.setRowFilter(null);
            modeltableProv.clearTable();
            modeltableProv.agregarListProv(regla.listarProveedor("", ""));
            modeloOrdenadoProv.setRowFilter(getFilter());
            tableProv.setAllColumnPreferredWidth();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Proveedor", JOptionPane.OK_OPTION);
        }
    }
    
    private RowFilter getFilter() {
        List filters = new ArrayList();
        
        if (txt_codigo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_codigo.getText().trim() + ".*", 1));
        }
        if (txt_numero.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_numero.getText().trim() + ".*", 9));
        }
        if (txt_descripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcion.getText().trim() + ".*", 3));
        }
        if (chk_percepcion.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "S" + ".*", 11));
        }
        if (chk_retencion.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "S" + ".*", 12));
        }
        if (chk_buen_contrib.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "S" + ".*", 13));
        }
        
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        
        return fooBarFilter;
    }
    
    private void setScrollValueView(int row) {
        scrollProv.getVerticalScrollBar().setValue(tableProv.getRowHeight() * row);
    }
    
    private void filtrar() {
        modeloOrdenadoProv.setRowFilter(getFilter());
        tableProv.setAllColumnPreferredWidth();
        
        if (tableProv.getRowCount() > 0) {
            tableProv.setRowSelectionInterval(0, 0);
        }
    }
    
    @Override
    public void setValueSearch(Object valor, Component comp) {
    }
    
    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterProveedorNuevo register = new RegisterProveedorNuevo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }
    
    @Override
    public void controlModify() {
        if (tableProv.getRowCount() == 0 || tableProv.getSelectedRow() < 0) {
            return;
        }
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        
        RegisterProveedorNuevo register = new RegisterProveedorNuevo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        
        if (register.setModeRegister(Register.UPDATE)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }
    
    @Override
    public void controlEliminate() {
    }
    
    @Override
    public void controlNullify() {
    }
    
    @Override
    public void controlClone() {
    }
    
    @Override
    public void controlDetails() {
    }
    
    @Override
    public void controlSearch() {
    }
    
    @Override
    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Proveedor Nuevo");
        ExportExcel.exportar(tableProv, parameters);
        
    }
    
    @Override
    public void controlPrint(boolean view) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
    
    @Override
    public void controlClose() {
        dispose();
        doDefaultCloseAction();
    }
    
    @Override
    public void controlRefresh() {
        cargarTabla();
        if (tableProv.getRowCount() > 0) {
            tableProv.setRowSelectionInterval(0, 0);
        }
    }
    
    @Override
    public void refreshTitleName() {
    }
    
    @Override
    public void selectFirstRow() {
        if (tableProv.getRowCount() > 0) {
            tableProv.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }
    
    @Override
    public void selectPreviusRow() {
        if (tableProv.getRowCount() > 0) {
            if (tableProv.getSelectedRow() > 0) {
                int row = tableProv.getSelectedRow() - 1;
                tableProv.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }
    
    @Override
    public void selectNextRow() {
        if (tableProv.getRowCount() > 0) {
            if (tableProv.getSelectedRow() < tableProv.getRowCount() - 1) {
                int row = tableProv.getSelectedRow() + 1;
                tableProv.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }
    
    @Override
    public void selectLastRow() {
        if (tableProv.getRowCount() > 0) {
            int rowCount = tableProv.getRowCount() - 1;
            tableProv.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }
    
    @Override
    public int getSelectedRow() {
        return tableProv.getSelectedRow();
    }
    
    @Override
    public int getRowCount() {
        return tableProv.getRowCount();
    }
    
    @Override
    public void selectFirstPage() {
    }
    
    @Override
    public void selectPreviusPage() {
    }
    
    @Override
    public void selectNextPage() {
    }
    
    @Override
    public void selectLastPage() {
    }
    
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
        if (row >= 0) {
            tableProv.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }
    
    @Override
    public void setSelectedRow(String clave, int column) {
    }
    
    @Override
    public Object getSelectedValue(int column) {
        int visibleRowIndex = tableProv.getSelectedRow();
        int realRowIndex = tableProv.convertRowIndexToModel(visibleRowIndex);
        
        return modeltableProv.getValueAt(realRowIndex, column);
    }
    
    @Override
    public Object getSelectedValue(String column) {
        return null;
    }
    
    @Override
    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }
    
    @Override
    public void windowOpened(WindowEvent e) {
    }
    
    @Override
    public void windowClosing(WindowEvent e) {
    }
    
    @Override
    public void windowClosed(WindowEvent e) {
    }
    
    @Override
    public void windowIconified(WindowEvent e) {
    }
    
    @Override
    public void windowDeiconified(WindowEvent e) {
    }
    
    @Override
    public void windowActivated(WindowEvent e) {
    }
    
    @Override
    public void windowDeactivated(WindowEvent e) {
    }
    
    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_codigo) {
            txt_codigo.selectAll();
        }
        if (e.getSource() == txt_numero) {
            txt_numero.selectAll();
        }
        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
        }
    }
    
    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_codigo && txt_codigo.getText().trim().length() > 0) {
        }
    }
    
    @Override
    public void keyTyped(KeyEvent e) {
    }
    
    @Override
    public void keyPressed(KeyEvent e) {
    }
    
    @Override
    public void keyReleased(KeyEvent e) {
        if ((e.getKeyCode() == KeyEvent.VK_DOWN) || (e.getKeyCode() == KeyEvent.VK_UP) || (e.getKeyCode() == KeyEvent.VK_PAGE_DOWN) || (e.getKeyCode() == KeyEvent.VK_PAGE_UP)) {
        }
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_codigo)) {
                filtrar();
            }
            if ((e.getSource() == txt_numero)) {
                filtrar();
            }
            if ((e.getSource() == txt_descripcion)) {
                filtrar();
            }
        }
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
    }
    
    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getItemSelectable() == chk_percepcion) {
            filtrar();
        }
        if (e.getItemSelectable() == chk_retencion) {
            filtrar();
        }
        if (e.getItemSelectable() == chk_buen_contrib) {
            filtrar();
        }
    }
    
    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 1) {
            if (e.getSource() == tableProv) {
                if (tableProv.getRowCount() > 0) {
                }
            }
        }
    }
    
    @Override
    public void mousePressed(MouseEvent e) {
    }
    
    @Override
    public void mouseReleased(MouseEvent e) {
    }
    
    @Override
    public void mouseEntered(MouseEvent e) {
    }
    
    @Override
    public void mouseExited(MouseEvent e) {
    }
}
