/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.Register;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import com.softcommerce.general.controles.IntegerDocument;
import java.awt.Color;
import java.awt.Font;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;
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
import com.softcommerce.general.tablas.TrabajadorPuntoVentaTableModel;
import com.softcommerce.general.controles.PopupMenuView;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.formularios.RegisterTrabajadorPuntoVenta;
import com.softcommerce.general.controles.UpperCaseDocument;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.WindowEvent;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import java.util.Date;
import javax.swing.JFrame;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.reglasnegocio.rn_TrabajadorPuntoVenta;
import com.softcommerce.util.render.CellRender;
import com.softcommerce.util.ExportExcel;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JOptionPane;

/**
 *
 * @author TOSHIBA
 */
public class PanelTFTrabajadorPuntoVenta extends JHInternalFrame implements ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener {

    public CTable table;
    public TrabajadorPuntoVentaTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    private JTextField txt_idtrabajadorpuntoventa;
    private JTextField txt_nombretrabajador;
    private JComboBox cbLocali;
    private Vector vtrLocalidad;
    private Vector<Localidad> xlocali;
    private JComboBox cbo_idtipotrabajador;
    private Vector vtr_idtipotrabajador;
    private Vector<BeanTipoTrabajador> x_idtipotrabajador;
    private JComboBox cb_PuntoVenta;
    private Vector vtrPuntoVenta;
    private Vector<PuntoVenta> xpuntoventa;
    private Usuario usuario;
    private JScrollPane scroll;
    private int registro_inicial = 1;
    private int numero_registros = 99;
    private int total_registros;
    private int total_paginas;
    private JFrame frame;
    private Date fechaInicio;
    private Date fechaFin;

    public PanelTFTrabajadorPuntoVenta(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }
    public PanelTFTrabajadorPuntoVenta(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        modeltable = new TrabajadorPuntoVentaTableModel();
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

        table.setNoVisibleColumn(6);
        table.setNoVisibleColumn(7);
        table.setNoVisibleColumn(8);
        table.setNoVisibleColumn(9);
        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(11);
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
        this.table.getColumnModel().getColumn(6).setCellRenderer(new CellRender());

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
        panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.CENTER);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.SOUTH);

        setTable(pnlaux);
    }

    public JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(null);

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setBounds(25, 25, 40, 20);
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_CodigoItem);

        txt_idtrabajadorpuntoventa = new JTextField();
        txt_idtrabajadorpuntoventa.setBounds(80, 25, 90, 20);
        txt_idtrabajadorpuntoventa.addKeyListener(this);
        txt_idtrabajadorpuntoventa.addFocusListener(this);
        txt_idtrabajadorpuntoventa.setDocument(new IntegerDocument(5));
        txt_idtrabajadorpuntoventa.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idtrabajadorpuntoventa);

        JLabel lbl_Localidad = new JLabel("Localidad");
        lbl_Localidad.setBounds(210, 25, 50, 20);
        pnlp.add(lbl_Localidad);

        vtrLocalidad = new Vector();
        cbLocali = new JComboBox(vtrLocalidad);
        cbLocali.setBounds(265, 25, 205, 20);
        cbLocali.addActionListener(this);
        cbLocali.addKeyListener(this);
        pnlp.add(cbLocali);

        JLabel lbl_LocalDespacho = new JLabel("Punto de Venta");
        lbl_LocalDespacho.setBounds(530, 25, 80, 20);
        pnlp.add(lbl_LocalDespacho);

        vtrPuntoVenta = new Vector();
        cb_PuntoVenta = new JComboBox(vtrPuntoVenta);
        cb_PuntoVenta.setBounds(615, 25, 205, 20);
        cb_PuntoVenta.addActionListener(this);
        cb_PuntoVenta.setEnabled(false);
        cb_PuntoVenta.addKeyListener(this);
        pnlp.add(cb_PuntoVenta);

        JLabel lbl_tipotrabajador = new JLabel("Area");
        lbl_tipotrabajador.setBounds(890, 25, 40, 20);
        pnlp.add(lbl_tipotrabajador);

        vtr_idtipotrabajador = new Vector();
        cbo_idtipotrabajador = new JComboBox(vtr_idtipotrabajador);
        cbo_idtipotrabajador.setBounds(930, 25, 205, 20);
        cbo_idtipotrabajador.addActionListener(this);
        cbo_idtipotrabajador.addKeyListener(this);
        pnlp.add(cbo_idtipotrabajador);

        JLabel lbl_nombretrabajador = new JLabel("Trabajador");
        lbl_nombretrabajador.setBounds(25, 55, 70, 20);
        lbl_nombretrabajador.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_nombretrabajador);

        txt_nombretrabajador = new JTextField();
        txt_nombretrabajador.setBounds(95, 55, 350, 20);
        txt_nombretrabajador.addKeyListener(this);
        txt_nombretrabajador.addFocusListener(this);
        txt_nombretrabajador.setDocument(new UpperCaseDocument(200));
        txt_nombretrabajador.setFont(new Font("Verdana", 0, 10));
        pnlp.add(txt_nombretrabajador);

        return pnlp;
    }

    private String getParametro() {
        String parametro = "";

        return parametro;
    }

    public void controlReport(boolean export) {
        if (table.getRowCount() == 0) {
            return;
        }

        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Trabajador Punto Venta");
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

    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_nombretrabajador)
                    || (e.getSource() == txt_idtrabajadorpuntoventa)) {
                filtrar();
            }
        }
    }

    public RowFilter getFilter() {
        List filters = new ArrayList();

        if (txt_idtrabajadorpuntoventa.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_idtrabajadorpuntoventa.getText().trim() + ".*", 1));
        }

        if (txt_nombretrabajador.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_nombretrabajador.getText().trim() + ".*", 4));
        }

        if (cbLocali.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xlocali.get(cbLocali.getSelectedIndex() - 1).getId_localidad() + ".*", 17));
        }

        if (cbo_idtipotrabajador.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + x_idtipotrabajador.get(cbo_idtipotrabajador.getSelectedIndex() - 1).getId_tipo_trabajador()+ ".*", 6));
        }

        if (cb_PuntoVenta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xpuntoventa.get(cb_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 14));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void cargarFiltro() {
        loadLocalidad(usuario.getCodempresa());
        loadTipoTrabajador();
    }

    private void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (xlocali != null) {
                xlocali.clear();
            } else {
                xlocali = new Vector<Localidad>();
            }

            xlocali.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cbLocali.removeAllItems();
            vtrLocalidad.removeAllElements();
            vtrLocalidad.addElement("--- Seleccione una Localidad ---");

            for (int i = 0; i < xlocali.size(); i++) {
                vtrLocalidad.addElement(xlocali.get(i).getDescripcion());
            }

            cbLocali.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadTipoTrabajador() {
        try {
            RnTipoTrabajador regla_TipoTrabajador = new RnTipoTrabajador(path);

            if (x_idtipotrabajador != null) {
                x_idtipotrabajador.clear();
            } else {
                x_idtipotrabajador = new Vector<BeanTipoTrabajador>();
            }

            x_idtipotrabajador.addAll(regla_TipoTrabajador.listarTipoTrabajador("", "A"));

            cbo_idtipotrabajador.removeAllItems();
            vtr_idtipotrabajador.removeAllElements();
            vtr_idtipotrabajador.addElement("--- TODOS ---");

            for (int i = 0; i < x_idtipotrabajador.size(); i++) {
                vtr_idtipotrabajador.addElement(x_idtipotrabajador.get(i).getDescripcion());
            }

            cbo_idtipotrabajador.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xpuntoventa != null) {
                xpuntoventa.clear();
            } else {
                xpuntoventa = new Vector<PuntoVenta>();
            }

            xpuntoventa.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cb_PuntoVenta.removeAllItems();
            vtrPuntoVenta.removeAllElements();
            vtrPuntoVenta.addElement("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xpuntoventa.size(); i++) {
                vtrPuntoVenta.addElement(xpuntoventa.get(i).getDescripcion_puntoventa());
            }

            cb_PuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_idtrabajadorpuntoventa) {
            txt_idtrabajadorpuntoventa.selectAll();
        }

        if (e.getSource() == txt_nombretrabajador) {
            txt_nombretrabajador.selectAll();
        }
    }

    public void actionPerformed(ActionEvent e) {
        if (cbLocali == e.getSource()) {
            if (vtrLocalidad.size() > 0) {
                if (cbLocali.getSelectedIndex() >= 0) {
                    if (cbLocali.getSelectedIndex() == 0) {
                        cb_PuntoVenta.removeAllItems();
                        cb_PuntoVenta.setEnabled(false);
                    } else {
                        cb_PuntoVenta.setEnabled(true);
                        loadPuntoVenta(xlocali.get(cbLocali.getSelectedIndex() - 1).getId_localidad());
                    }

                    filtrar();
                }
            }
        }

        if (e.getSource() == cb_PuntoVenta) {
            if (vtrPuntoVenta.size() > 0) {
                if (cb_PuntoVenta.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cbo_idtipotrabajador) {
            if (vtr_idtipotrabajador.size() > 0) {
                if (cbo_idtipotrabajador.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    public void controlPrint(boolean view) {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        try {
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTrabajadorPuntoVenta register = new RegisterTrabajadorPuntoVenta(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTrabajadorPuntoVenta register = new RegisterTrabajadorPuntoVenta(frame, usuario);
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

    public void controlNullify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    public void controlEliminate() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTrabajadorPuntoVenta register = new RegisterTrabajadorPuntoVenta(frame, usuario);
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

    public void controlClone() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTrabajadorPuntoVenta register = new RegisterTrabajadorPuntoVenta(frame, usuario);
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

    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterTrabajadorPuntoVenta register = new RegisterTrabajadorPuntoVenta(frame, usuario);
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

    public void controlClose() {
        dispose();
        doDefaultCloseAction();
    }

    public void controlRefresh() {
        cargarTabla();
    }

    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return modeltable.getValueAt(realRowIndex, column);
    }

    public void setSelectedRow(int row) {
        if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }

    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    public void selectNextRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() < table.getRowCount() - 1) {
                int row = table.getSelectedRow() + 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    public void selectPreviusRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() > 0) {
                int row = table.getSelectedRow() - 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    public void selectLastRow() {
        if (table.getRowCount() > 0) {
            int rowCount = table.getRowCount() - 1;
            table.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    public void selectFirstRow() {
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    public int getRowCount() {
        return table.getRowCount();
    }

    public void cargarTabla() {
        rn_TrabajadorPuntoVenta regla = new rn_TrabajadorPuntoVenta(path);
        modeloOrdenado.setRowFilter(null);
        modeltable.clearTable();
        modeltable.agregarVectortrabajador(regla.listarGeneral(usuario.getCodempresa()));
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();
    }

    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idtrabajadorpuntoventa && txt_idtrabajadorpuntoventa.getText().trim().length() > 0) {
            String serie = "00000" + txt_idtrabajadorpuntoventa.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 5, serie.length());

            txt_idtrabajadorpuntoventa.setText(nuevaserie);

            filtrar();
        }
    }

    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idtrabajadorpuntoventa) {
                cbLocali.requestFocus();
            }

            if (e.getSource() == cbLocali) {
                if (cb_PuntoVenta.isEnabled()) {
                    cb_PuntoVenta.requestFocus();
                } else {
                    cbo_idtipotrabajador.requestFocus();
                }
            }

            if (e.getSource() == cb_PuntoVenta) {
                cbo_idtipotrabajador.requestFocus();
            }

            if (e.getSource() == cbo_idtipotrabajador) {
                txt_nombretrabajador.requestFocus();
            }
        }
    }

    public void selectLastPage() {
    }

    public void selectFirstPage() {
    }

    public int getPageCount() {
        return 0;
    }

    public int getSelectedPage() {
        return 0;
    }

    public void windowOpened(WindowEvent e) {
    }

    public void windowClosing(WindowEvent e) {
    }

    public void windowClosed(WindowEvent e) {
    }

    public void windowIconified(WindowEvent e) {
    }

    public void windowDeiconified(WindowEvent e) {
    }

    public void windowActivated(WindowEvent e) {
    }

    public void windowDeactivated(WindowEvent e) {
    }

    public void keyTyped(KeyEvent e) {
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    public void refreshTitleName() {
    }

    public void controlSearch() {
    }

    public void setSelectedRow(String clave, int column) {
    }

    public Object getSelectedValue(String column) {
        return null;
    }

    public void selectPreviusPage() {
    }

    public void selectNextPage() {
    }
}