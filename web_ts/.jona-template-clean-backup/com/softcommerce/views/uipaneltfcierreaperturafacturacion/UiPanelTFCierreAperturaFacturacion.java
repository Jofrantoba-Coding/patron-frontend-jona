/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfcierreaperturafacturacion;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.CierreFacturacion;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.JHInternalFrame;
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
import com.softcommerce.formularios.RegisterCierreAperturaFacturacion;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.Date;
import com.softcommerce.reglasnegocio.rn_CierreFacturacion;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.general.tablas.CierreAperturaFacturacionTableModel;
import com.softcommerce.util.ExportExcel;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JOptionPane;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFCierreAperturaFacturacion extends JHInternalFrame implements InterUiPanelTFCierreAperturaFacturacion, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    public CTable table;
    public CierreAperturaFacturacionTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    protected JTextField txt_idanexo;
    protected JTextField txt_serie;
    protected JComboBox cbLocali;
    protected List<Localidad> xlocali;
    protected JComboBox cb_PuntoVenta;
    protected List<PuntoVenta> xpuntoventa;
    protected Usuario usuario;
    protected int registro_inicial = 1;
    protected int numero_registros = 29;
    protected int total_registros;
    protected int total_paginas;
    protected JFrame frame;
    protected Date fechaInicio;
    protected Date fechaFin;

    public UiPanelTFCierreAperturaFacturacion(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFCierreAperturaFacturacion(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new CierreAperturaFacturacionTableModel();
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

        JLabel lbl_CodigoItem = new JLabel("Cod");
        lbl_CodigoItem.setBounds(25, 25, 40, 20);
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_CodigoItem);

        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(80, 25, 90, 20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setDocument(new IntegerDocument(3));
        txt_idanexo.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idanexo);

        JLabel lbl_Localidad = new JLabel("Local");
        lbl_Localidad.setBounds(260, 25, 40, 20);
        pnlp.add(lbl_Localidad);

        cbLocali = new JComboBox();
        cbLocali.setBounds(305, 25, 205, 20);
        cbLocali.addActionListener(this);
        cbLocali.addKeyListener(this);
        pnlp.add(cbLocali);

        JLabel lbl_LocalDespacho = new JLabel("P Venta");
        lbl_LocalDespacho.setBounds(600, 25, 40, 20);
        pnlp.add(lbl_LocalDespacho);

        cb_PuntoVenta = new JComboBox();
        cb_PuntoVenta.setBounds(645, 25, 205, 20);
        cb_PuntoVenta.addActionListener(this);
        cb_PuntoVenta.setEnabled(false);
        cb_PuntoVenta.addKeyListener(this);
        pnlp.add(cb_PuntoVenta);

        JLabel lbl_CodigoAlterno = new JLabel("Desc");
        lbl_CodigoAlterno.setBounds(25, 55, 70, 20);
        lbl_CodigoAlterno.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_CodigoAlterno);

        txt_serie = new JTextField();
        txt_serie.setBounds(80, 55, 360, 20);
        txt_serie.addFocusListener(this);
        txt_serie.addKeyListener(this);
        txt_serie.setDocument(new UpperCaseNumberDocument(255));
        txt_serie.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_serie);

        return pnlp;
    }

    protected String getParametro() {
        String parametro = " ";

        return parametro;
    }

    @Override
    public void controlReport(boolean export) {
    }

    public void filtrar() {
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_idanexo)
                    || (e.getSource() == txt_serie)) {
                filtrar();
            }
        }
    }

    public RowFilter getFilter() {
        return null;
    }

    public void cargarFiltro() {
    }

    protected void loadLocalidad(String xcodEmpres) {
    }

    protected void loadPuntoVenta(String xcodLocalidad) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txt_idanexo) {
            txt_idanexo.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbLocali == e.getSource()) {
            if (cbLocali.getItemCount() > 0) {
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
            if (cb_PuntoVenta.getItemCount() > 0) {
                if (cb_PuntoVenta.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlAdd() {
    }

    @Override
    public void controlModify() {
    }

    @Override
    public void controlNullify() {
    }

    @Override
    public void controlEliminate() {
    }

    @Override
    public void controlClone() {
    }

    @Override
    public void controlDetails() {
    }

    @Override
    public void controlClose() {
    }

    @Override
    public void controlRefresh() {
    }

    @Override
    public Object getSelectedValue(int column) {
        return null;
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
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idanexo && txt_idanexo.getText().trim().length() > 0) {
            String serie = "000" + txt_idanexo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 3, serie.length());

            txt_idanexo.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idanexo) {
                cbLocali.requestFocus();
            }

            if (e.getSource() == cbLocali) {
                if (cb_PuntoVenta.isEnabled()) {
                    cb_PuntoVenta.requestFocus();
                } else {
                    txt_serie.requestFocus();
                }
            }

            if (e.getSource() == cb_PuntoVenta) {
                txt_serie.requestFocus();
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
