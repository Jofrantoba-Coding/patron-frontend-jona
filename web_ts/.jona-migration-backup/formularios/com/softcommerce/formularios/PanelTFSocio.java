/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.tablas.SocioTableModel;
import com.softcommerce.reglasnegocio.RnCliente;
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
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;
//import com.softcommerce.report.Reporte;

/**
 *
 * @author Team Develtrex
 */
public class PanelTFSocio extends JHInternalFrame implements View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener, MouseListener {

    public CTable tableSocio;
    public SocioTableModel modeltableSocio;
    public TableRowSorter modeloOrdenadoSocio;
    private JScrollPane scrollSocio;
    private JFrame frame;
    private Usuario usuario;
    private JTextField txt_codigo;
    private JTextField txt_numero;
    private JTextField txt_descripcion;

    public PanelTFSocio(String title, JFrame frame, Usuario usuario) {
        super(title, true, true, true, false, false, true, true, false, true, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
        initListener();
    }

    public PanelTFSocio(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
        initListener();
    }

    private void inicialize() {
        modeltableSocio = new SocioTableModel();
        modeloOrdenadoSocio = new TableRowSorter(modeltableSocio);
        tableSocio = new CTable();
        tableSocio.setRowSorter(modeloOrdenadoSocio);
        tableSocio.setModel(modeltableSocio);
        tableSocio.setAllTableNoEditable();
        tableSocio.setAllColumnNoResizable();
        tableSocio.setRendererColumnZero();
        tableSocio.setAllColumnPreferredWidth();
        tableSocio.setNoVisibleColumn(2);
        tableSocio.setNoVisibleColumn(4);
        tableSocio.setNoVisibleColumn(5);
        tableSocio.setNoVisibleColumn(6);
        tableSocio.setNoVisibleColumn(7);
        tableSocio.setNoVisibleColumn(8);
        scrollSocio = new JScrollPane(tableSocio);

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));
        pnlaux.add(getPanelFilter(), BorderLayout.NORTH);

        scrollSocio.setPreferredSize(new Dimension(1200, 400));
        pnlaux.add(scrollSocio, BorderLayout.CENTER);
        //tableCliente.setColumnMinWidth(2, 350);
        //tableCliente.setColumnMaxWidth(2, 350);
        setTable(pnlaux);
    }

    private void initListener() {
        txt_codigo.addKeyListener(this);
        txt_codigo.addFocusListener(this);
        txt_numero.addKeyListener(this);
        txt_numero.addFocusListener(this);
        txt_descripcion.addKeyListener(this);
        txt_descripcion.addFocusListener(this);
        tableSocio.getSelectionModel().addListSelectionListener(this);
        tableSocio.addMouseListener(this);
        tableSocio.addKeyListener(this);
    }

    private JPanel getPanelFilter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlp = new JPanel();
        pnl.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lbl_codigo = new JLabel("Código");
        lbl_codigo.setFont(new Font("Verdana", 0, 10));
        pnlp.add(lbl_codigo, gbc);

        txt_codigo = new JTextField();
        txt_codigo.setDocument(new IntegerDocument(10));
        txt_codigo.setFont(new Font("Garamond", 0, 14));
        txt_codigo.setColumns(7);
        gbc.gridx = 1;
        pnlp.add(txt_codigo, gbc);

        JLabel lbl_numero = new JLabel("DNI/RUC");
        lbl_numero.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnlp.add(lbl_numero, gbc);

        txt_numero = new JTextField();
        txt_numero.setDocument(new IntegerDocument(11));
        txt_numero.setFont(new Font("Garamond", 0, 14));
        txt_numero.setColumns(7);
        gbc.gridx = 3;
        pnlp.add(txt_numero, gbc);

        JLabel lbl_descripcion = new JLabel("R. Social");
        lbl_descripcion.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlp.add(lbl_descripcion, gbc);

        txt_descripcion = new JTextField();
        txt_descripcion.setDocument(new UpperCaseDocument(100));
        txt_descripcion.setFont(new Font("Garamond", 0, 14));
        txt_descripcion.setColumns(14);
        gbc.gridx = 5;
        pnlp.add(txt_descripcion, gbc);

        pnl.add(pnlp, BorderLayout.WEST);
        return pnl;
    }

    public void cargarTabla() {
        try {
            RnCliente regla = new RnCliente(path);
            modeloOrdenadoSocio.setRowFilter(null);
            modeltableSocio.clearTable();
            List listSocio=regla.listarSocio(0, "");
            modeltableSocio.agregarListSocio(listSocio);
            modeloOrdenadoSocio.setRowFilter(getFilter());
            tableSocio.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Socio", JOptionPane.OK_OPTION);
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

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    private void setScrollValueView(int row) {
        scrollSocio.getVerticalScrollBar().setValue(tableSocio.getRowHeight() * row);
    }

    private void filtrar() {
        modeloOrdenadoSocio.setRowFilter(getFilter());
        tableSocio.setAllColumnPreferredWidth();
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterSocio register = new RegisterSocio(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlModify() {
        if (tableSocio.getRowCount() == 0 || tableSocio.getSelectedRow() < 0) {
            return;
        }
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterSocio register = new RegisterSocio(frame, usuario);
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
        if (tableSocio.getRowCount() == 0 || tableSocio.getSelectedRow() < 0) {
            return;
        }
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterSocio register = new RegisterSocio(frame, usuario);
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
    public void controlSearch() {
    }

    @Override
    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Socio");
        ExportExcel.exportar(tableSocio, parameters);

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
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void selectFirstRow() {
        if (tableSocio.getRowCount() > 0) {
            tableSocio.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    @Override
    public void selectPreviusRow() {
        if (tableSocio.getRowCount() > 0) {
            if (tableSocio.getSelectedRow() > 0) {
                int row = tableSocio.getSelectedRow() - 1;
                tableSocio.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectNextRow() {
        if (tableSocio.getRowCount() > 0) {
            if (tableSocio.getSelectedRow() < tableSocio.getRowCount() - 1) {
                int row = tableSocio.getSelectedRow() + 1;
                tableSocio.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectLastRow() {
        if (tableSocio.getRowCount() > 0) {
            int rowCount = tableSocio.getRowCount() - 1;
            tableSocio.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    @Override
    public int getSelectedRow() {
        return tableSocio.getSelectedRow();
    }

    @Override
    public int getRowCount() {
        return tableSocio.getRowCount();
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
            tableSocio.setRowSelectionInterval(row, 0);
            setScrollValueView(row);
        }
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(int column) {
        int visibleRowIndex = tableSocio.getSelectedRow();
        int realRowIndex = tableSocio.convertRowIndexToModel(visibleRowIndex);

        return modeltableSocio.getValueAt(realRowIndex, column);
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
    }

    @Override
    public void mouseClicked(MouseEvent e) {
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
