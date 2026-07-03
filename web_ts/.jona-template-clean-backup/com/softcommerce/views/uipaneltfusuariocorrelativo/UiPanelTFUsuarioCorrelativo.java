/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfusuariocorrelativo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.PopupMenuView;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.tablas.UsuarioCorrelativoTableModel;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.FormatObject;
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
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.swing.JComboBox;
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

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFUsuarioCorrelativo extends JHInternalFrame implements InterUiPanelTFUsuarioCorrelativo, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener {

    private static final long serialVersionUID = 1L;
    protected CTable table;
    protected UsuarioCorrelativoTableModel modeltable;
    protected TableRowSorter<UsuarioCorrelativoTableModel> modeloOrdenado;
    protected JTextField txt_idanexo;
    protected JTextField txt_usuario;
    protected JTextField txt_serie;
    protected JComboBox cbLocali;
    protected List<Localidad> xlocali;
    protected JComboBox cbTipodoc;
    protected List<BeanTipoDocVenta> xtipodoc;
    protected JComboBox cb_PuntoVenta;
    protected List<PuntoVenta> xpuntoventa;
    protected JComboBox cbo_condicionpago;
    protected Usuario usuario;
    protected JScrollPane scroll;
    protected int registro_inicial = 1;
    protected int numero_registros = 99;
    protected int total_registros;
    protected int total_paginas;
    protected JFrame frame;
    protected Date fechaInicio;
    protected Date fechaFin;

    public UiPanelTFUsuarioCorrelativo(String title, JFrame frame, Usuario usuario) {
        super(title, true, true, true, false, true, true, false, true, true, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFUsuarioCorrelativo(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new UsuarioCorrelativoTableModel();
        modeloOrdenado = new TableRowSorter<UsuarioCorrelativoTableModel>(modeltable);
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

        table.setNoVisibleColumn(7);
        table.setNoVisibleColumn(8);
        table.setNoVisibleColumn(9);
        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(11);

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

        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(80, 25, 90, 20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setDocument(new IntegerDocument(5));
        txt_idanexo.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idanexo);

        JLabel lbl_Localidad = new JLabel("Localidad");
        lbl_Localidad.setBounds(210, 25, 50, 20);
        pnlp.add(lbl_Localidad);

        cbLocali = new JComboBox();
        cbLocali.setBounds(265, 25, 205, 20);
        cbLocali.addActionListener(this);
        cbLocali.addKeyListener(this);
        pnlp.add(cbLocali);

        JLabel lbl_LocalDespacho = new JLabel("P Venta");
        lbl_LocalDespacho.setBounds(515, 25, 50, 20);
        pnlp.add(lbl_LocalDespacho);

        cb_PuntoVenta = new JComboBox();
        cb_PuntoVenta.setBounds(565, 25, 205, 20);
        cb_PuntoVenta.addActionListener(this);
        cb_PuntoVenta.setEnabled(false);
        cb_PuntoVenta.addKeyListener(this);
        pnlp.add(cb_PuntoVenta);

        JLabel lbl_tipodoc = new JLabel("T Documento");
        lbl_tipodoc.setBounds(25, 55, 65, 20);
        pnlp.add(lbl_tipodoc);

        cbTipodoc = new JComboBox();
        cbTipodoc.setBounds(90, 55, 205, 20);
        cbTipodoc.addActionListener(this);
        cbTipodoc.addKeyListener(this);
        pnlp.add(cbTipodoc);

        JLabel lbl_CodigoAlterno = new JLabel("Serie");
        lbl_CodigoAlterno.setBounds(320, 55, 35, 20);
        lbl_CodigoAlterno.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_CodigoAlterno);

        txt_serie = new JTextField();
        txt_serie.setBounds(355, 55, 90, 20);
        txt_serie.addFocusListener(this);
        txt_serie.addKeyListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_serie);

        JLabel lbl_condpago = new JLabel("T Pago");
        lbl_condpago.setBounds(485, 55, 40, 20);
        pnlp.add(lbl_condpago);

        cbo_condicionpago = new JComboBox();
        cbo_condicionpago.setBounds(525, 55, 100, 20);
        cbo_condicionpago.addKeyListener(this);
        cbo_condicionpago.addActionListener(this);
        pnlp.add(cbo_condicionpago);

        JLabel lbl_usuario = new JLabel("Usuario");
        lbl_usuario.setBounds(660, 55, 50, 20);
        lbl_usuario.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lbl_usuario);

        txt_usuario = new JTextField();
        txt_usuario.setBounds(710, 55, 120, 20);
        txt_usuario.addFocusListener(this);
        txt_usuario.addKeyListener(this);
        txt_usuario.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_usuario);

        return pnlp;
    }

    protected String getParametro() {
        String parametro = "";

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
            if ((e.getSource() == txt_usuario)
                    || (e.getSource() == txt_serie)
                    || (e.getSource() == txt_idanexo)) {
                filtrar();
            }
        }
    }

    @SuppressWarnings("unchecked")
    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>(10);

        if (txt_idanexo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_idanexo.getText().trim() + ".*", 1));
        }

        if (txt_usuario.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_usuario.getText().trim() + ".*", 4));
        }

        if (txt_serie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_serie.getText().trim() + ".*", 6));
        }

        if (cbLocali.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xlocali.get(cbLocali.getSelectedIndex() - 1).getId_localidad() + ".*", 9));
        }

        if (cbTipodoc.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xtipodoc.get(cbTipodoc.getSelectedIndex() - 1).getIdTipoDoc() + ".*", 11));
        }

        if (cb_PuntoVenta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xpuntoventa.get(cb_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 10));
        }

        if (cbo_condicionpago.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + cbo_condicionpago.getSelectedItem().toString() + ".*", 12));
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void cargarFiltro() {
    }

    public void loadCondPago() {
    }

    protected void loadLocalidad(String xcodEmpres) {
    }

    public void loadTipoDocumento() {
    }

    protected void loadPuntoVenta(String xcodLocalidad) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_idanexo) {
            txt_idanexo.selectAll();
        }

        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txt_usuario) {
            txt_usuario.selectAll();
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

        if (e.getSource() == cbTipodoc) {
            if (cbTipodoc.getItemCount() > 0) {
                if (cbTipodoc.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }

        if (e.getSource() == cbo_condicionpago) {
            if (cbo_condicionpago.getItemCount() > 0) {
                if (cbo_condicionpago.getSelectedIndex() >= 0) {
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
            String serie = "00000" + txt_idanexo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 5, serie.length());

            txt_idanexo.setText(nuevaserie);

            filtrar();
        }
        if (e.getSource().equals(txt_serie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
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
                    cbTipodoc.requestFocus();
                }
            }

            if (e.getSource() == cb_PuntoVenta) {
                cbTipodoc.requestFocus();
            }

            if (e.getSource() == cbTipodoc) {
                txt_usuario.requestFocus();
            }

            if (e.getSource() == txt_usuario) {
                txt_serie.requestFocus();
            }

            if (e.getSource() == txt_serie) {
                cbo_condicionpago.requestFocus();
            }
        }
    }

    @Override
    public void selectLastPage() {
    }

    @Override
    public void selectFirstPage() {
    }

    @Override
    public int getPageCount() {
        return 0;
    }

    @Override
    public int getSelectedPage() {
        return 0;
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
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void selectPreviusPage() {
    }

    @Override
    public void selectNextPage() {
    }
    protected static final Logger LOG = Logger.getLogger(UiPanelTFUsuarioCorrelativo.class.getName());
}