/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltftransportista;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import com.softcommerce.general.controles.CTable;
import java.awt.BorderLayout;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.PopupMenuView;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.WindowEvent;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import javax.swing.JFrame;
import com.softcommerce.general.controles.Register;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.Date;
import com.softcommerce.general.tablas.AnexoTableModel;
import com.softcommerce.util.ExportExcel;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.JToolBar;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFTransportista extends JHInternalFrame implements InterUiPanelTFTransportista, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    public CTable table;
    public AnexoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    private JTextField txt_idanexo;
    private JTextField txt_descripcionanexo;
    private JTextField txt_tmpruc;
    private JComboBox cbo_tipopersona;
    private Usuario usuario;
    private int registro_inicial = 1;
    private int numero_registros = 29;
    private int total_registros;
    private int total_paginas;
    private JFrame frame;
    private Date fechaInicio;
    private Date fechaFin;

    public UiPanelTFTransportista(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFTransportista(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFTransportista(String title, JFrame frame, Usuario usuario, boolean vendedor) {
        super(title , true, true, false, false, false, true, false, true, true, true, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        modeltable = new AnexoTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        PopupMenuView popupmenu = new PopupMenuView();
        popupmenu.setControl(this);
        table.setComponentPopupMenu(popupmenu);
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

        table.setNoVisibleColumn(2);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(5);
        table.setNoVisibleColumn(6);
        table.setNoVisibleColumn(7);
        table.setNoVisibleColumn(9);
        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(12);
        table.setNoVisibleColumn(13);
        table.setNoVisibleColumn(14);
        table.setNoVisibleColumn(15);
        table.setNoVisibleColumn(16);
        table.setNoVisibleColumn(17);
        table.setNoVisibleColumn(18);
        table.setNoVisibleColumn(19);
        table.setNoVisibleColumn(20);
        table.setNoVisibleColumn(21);
        table.setNoVisibleColumn(22);
        table.setNoVisibleColumn(23);
        table.setNoVisibleColumn(24);
        table.setNoVisibleColumn(25);
        table.setNoVisibleColumn(26);
        table.setNoVisibleColumn(27);
        table.setNoVisibleColumn(28);
        table.setNoVisibleColumn(29);
        table.setNoVisibleColumn(35);
        table.setNoVisibleColumn(34);
        table.setNoVisibleColumn(33);

        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));

        JPanel panel = getPanelFilter();
        /*panel.setPreferredSize(new Dimension(1200, 100));
        comentado por @jofrantoba
        */
        pnlaux.add(panel, BorderLayout.NORTH);

        //scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);
    }

    /*public JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(null);

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setBounds(25, 25, 40, 20);
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_CodigoItem);

        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(80, 25, 90, 20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_idanexo.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idanexo);

        JLabel lbl_CodigoAlterno = new JLabel("DNI/RUC");
        lbl_CodigoAlterno.setBounds(210, 25, 70, 20);
        lbl_CodigoAlterno.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_CodigoAlterno);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(275, 25, 90, 20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.addKeyListener(this);
        txt_tmpruc.setDocument(new UpperCaseNumberDocument(255));
        txt_tmpruc.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_tmpruc);

        JLabel lblItem = new JLabel("R. Social");
        lblItem.setFont(new Font("Verdana", 0, 11));
        lblItem.setBounds(425, 25, 50, 20);
        pnlp.add(lblItem);

        txt_descripcionanexo = new JTextField();
        txt_descripcionanexo.setBounds(485, 25, 360, 20);
        txt_descripcionanexo.addFocusListener(this);
        txt_descripcionanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionanexo.setFont(new Font("Garamond", 0, 14));
        txt_descripcionanexo.addKeyListener(this);
        pnlp.add(txt_descripcionanexo);

        JLabel lbl_familia = new JLabel("T. Persona");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(870, 25, 65, 20);
        pnlp.add(lbl_familia);

        cbo_tipopersona = new JComboBox();
        cbo_tipopersona.setBounds(935, 25, 180, 20);
        cbo_tipopersona.addActionListener(this);
        cbo_tipopersona.addKeyListener(this);
        pnlp.add(cbo_tipopersona);

        return pnlp;
    }*/
    
    public JPanel getPanelFilter()
    {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130,135,144)));
        pnlp.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;        

        JToolBar tool1=new JToolBar();
        tool1.setFloatable(false);
        JToolBar tool2=new JToolBar();
        tool2.setFloatable(false);
        
        addGrid(pnlp, gbc, 0, 0, tool1);
        addGrid(pnlp, gbc, 0, 1, tool2);
        
        JLabel lbl_CodigoItem = new JLabel("Código");
        //lbl_CodigoItem.setBounds(25,25,40,20);
        lbl_CodigoItem.setFont(new Font("Verdana",0,11));
        //pnlp.add(lbl_CodigoItem);
        tool1.add(lbl_CodigoItem);

        txt_idanexo = new JTextField(8);
	//txt_idanexo.setBounds(80,25,90,20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_idanexo.setFont(new Font("Garamond",0,14));
        //pnlp.add(txt_idanexo);
        tool1.add(txt_idanexo);
        tool1.addSeparator(new Dimension(20, 20));

        JLabel lbl_CodigoAlterno = new JLabel("DNI/RUC");
        //lbl_CodigoAlterno.setBounds(210,25,70,20);
        lbl_CodigoAlterno.setFont(new Font("Verdana",0,11));
        //pnlp.add(lbl_CodigoAlterno);
        tool1.add(lbl_CodigoAlterno);

        txt_tmpruc = new JTextField(13);
	//txt_tmpruc.setBounds(275,25,90,20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.addKeyListener(this);
        txt_tmpruc.setDocument(new UpperCaseNumberDocument(255));
        txt_tmpruc.setFont(new Font("Garamond",0,14));
        //pnlp.add(txt_tmpruc);
        tool1.add(txt_tmpruc);
        tool1.addSeparator(new Dimension(20, 20));

        JLabel lblItem= new JLabel("R. Social");
        lblItem.setFont(new Font("Verdana",0,11));
        //lblItem.setBounds(425,25,50,20);
        //pnlp.add(lblItem);
        tool1.add(lblItem);

        txt_descripcionanexo= new JTextField(20);
        //txt_descripcionanexo.setBounds(485,25,360,20);
        txt_descripcionanexo.addFocusListener(this);
        txt_descripcionanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcionanexo.setFont(new Font("Garamond",0,14));
        txt_descripcionanexo.addKeyListener(this);
        //pnlp.add(txt_descripcionanexo);
        tool1.add(txt_descripcionanexo);

        JLabel lbl_familia = new JLabel("T. Persona");
        lbl_familia.setFont(new Font("Verdana",0,11));
        //lbl_familia.setBounds(870,25,65,20);
        //pnlp.add(lbl_familia);
        tool2.add(lbl_familia);

        cbo_tipopersona = new JComboBox();
        //cbo_tipopersona.setBounds(935,25,180,20);
        cbo_tipopersona.addActionListener(this);
        cbo_tipopersona.addKeyListener(this);
        cbo_tipopersona.setMaximumSize(new Dimension(250, 25));
        cbo_tipopersona.setPreferredSize(new Dimension(250, 25));
        //pnlp.add(cbo_tipopersona);
        tool2.add(cbo_tipopersona);
        
        return pnlp;
    }
    
    private void addGrid(JPanel pnl,GridBagConstraints gbc, int x, int y, JComponent component) {
        gbc.gridx = x;
        gbc.gridy = y;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(component, gbc);
    } 

    @Override
    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Transportista");
        ExportExcel.exportar(table, parameters);
    }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_descripcionanexo)
                    || (e.getSource() == txt_tmpruc)
                    || (e.getSource() == txt_idanexo)) {
                filtrar();
            }
        }
    }

    public RowFilter getFilter() {
        List filters = new ArrayList();

        if (txt_descripcionanexo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcionanexo.getText().trim() + ".*", 3));
        }

        if (txt_idanexo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_idanexo.getText().trim() + ".*", 1));
        }

        if (txt_tmpruc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_tmpruc.getText().trim() + ".*", 8));
        }

        if (cbo_tipopersona.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + (cbo_tipopersona.getSelectedItem().equals("NATURAL") ? "N" : "J") + ".*", 2));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void cargarFiltro() {
        loadCondPago();
    }

    public void loadCondPago() {
        cbo_tipopersona.addItem("--- SELECCIONE T. PERSONA ---");
        cbo_tipopersona.addItem("NATURAL");
        cbo_tipopersona.addItem("JURIDICA");
        cbo_tipopersona.setSelectedIndex(0);
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_descripcionanexo) {
            txt_descripcionanexo.selectAll();
        }

        if (e.getSource() == txt_tmpruc) {
            txt_tmpruc.selectAll();
        }

        if (e.getSource() == txt_idanexo) {
            txt_idanexo.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == cbo_tipopersona) {
            if (cbo_tipopersona.getItemCount() > 0) {
                if (cbo_tipopersona.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void controlPrint(boolean view) {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        try {
        } catch (Exception ex) {
        }
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTransportistaNuevo register = new RegisterTransportistaNuevo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTransportistaNuevo register = new RegisterTransportistaNuevo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);

        if (register.setModeRegister(Register.UPDATE)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlNullify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlEliminate() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTransportistaNuevo register = new RegisterTransportistaNuevo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);

        if (register.setModeRegister(Register.DELETE)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlClone() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTransportistaNuevo register = new RegisterTransportistaNuevo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);

        if (register.setModeRegister(Register.CLONE)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTransportistaNuevo register = new RegisterTransportistaNuevo(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);

        if (register.setModeRegister(Register.DETAIL)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
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
    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return modeltable.getValueAt(realRowIndex, column);
    }

    @Override
    public void setSelectedRow(int row) {
        if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }

    @Override
    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    @Override
    public void selectNextRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() < table.getRowCount() - 1) {
                int row = table.getSelectedRow() + 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectPreviusRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() > 0) {
                int row = table.getSelectedRow() - 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectLastRow() {
        if (table.getRowCount() > 0) {
            int rowCount = table.getRowCount() - 1;
            table.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    @Override
    public void selectFirstRow() {
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    @Override
    public int getRowCount() {
        return table.getRowCount();
    }

    public void cargarTabla() {
        try {
            /*Anexo a = new Anexo();
             a.setId_tipo_anexo("6");
             a.setNumero_inicial(-1);
             a.setNumero_final(-1);
             a.setId_empresa(usuario.getCodempresa());*/


            RnAnexo regla = new RnAnexo(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            List<Anexo> listAnexo = regla.listAnexo("6", "", "", "", "");
            modeltable.agregarVectorAnexo(listAnexo);
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idanexo && txt_idanexo.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idanexo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idanexo.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idanexo) {
                txt_tmpruc.requestFocus();
            }

            if (e.getSource() == txt_tmpruc) {
                txt_descripcionanexo.requestFocus();
            }

            if (e.getSource() == txt_descripcionanexo) {
                cbo_tipopersona.requestFocus();
            }
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void controlSearch() {
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
    public void setValueSearch(Object valor, Component comp) {
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
}
