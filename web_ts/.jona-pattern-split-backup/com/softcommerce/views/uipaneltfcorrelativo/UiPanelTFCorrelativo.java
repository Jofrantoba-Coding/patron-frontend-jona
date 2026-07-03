/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfcorrelativo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.PopupMenuView;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.tablas.CorrelativoTableModel;
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
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
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
public class UiPanelTFCorrelativo
        extends JHInternalFrame
        implements InterUiPanelTFCorrelativo, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    private static final long serialVersionUID = 1L;
    public CTable table;
    public CorrelativoTableModel modeltable;
    public TableRowSorter<CorrelativoTableModel> modeloOrdenado;
    public JScrollPane scroll;
    private JTextField txtCodigo;
    private JTextField txt_serie;
    private JComboBox cbLocali;
    private List<Localidad> xlocali;
    private JComboBox cbTipodoc;
    private List<BeanTipoDocVenta> xtipodoc;
    private JComboBox cb_PuntoVenta;
    private List<PuntoVenta> xpuntoventa;
    private Usuario usuario;
    private JFrame frame;
    private Date fechaInicio;
    private Date fechaFin;

    public UiPanelTFCorrelativo(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFCorrelativo(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        modeltable = new CorrelativoTableModel();
        modeloOrdenado = new TableRowSorter<CorrelativoTableModel>(modeltable);
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
        table.setNoVisibleColumn(3);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(6);

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
        //panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.NORTH);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);
    }

    public JPanel getPanelFilter() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.setBorder(new LineBorder(new Color(130, 135, 144)));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(10, 2, 5, 2);

        JLabel lblCodigo = new JLabel("Código");
        lblCodigo.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCodigo, gbc);

        gbc.gridx = 1;
        txtCodigo = new JTextField();
        txtCodigo.addKeyListener(this);
        txtCodigo.addFocusListener(this);
        txtCodigo.setDocument(new IntegerDocument(5));
        txtCodigo.setFont(new Font("Garamond", 0, 14));
        txtCodigo.setColumns(4);
        pnl.add(txtCodigo, gbc);

        gbc.gridx = 2;
        JLabel lblLocalidad = new JLabel("Localidad");
        pnl.add(lblLocalidad, gbc);

        gbc.gridx = 3;
        cbLocali = new JComboBox();
        cbLocali.addActionListener(this);
        cbLocali.addKeyListener(this);
        pnl.add(cbLocali, gbc);

        gbc.gridx = 4;
        JLabel lblPtoVenta = new JLabel("Punto de Venta");
        pnl.add(lblPtoVenta, gbc);

        gbc.gridx = 5;
        cb_PuntoVenta = new JComboBox();
        cb_PuntoVenta.addActionListener(this);
        cb_PuntoVenta.setEnabled(false);
        cb_PuntoVenta.addKeyListener(this);
        pnl.add(cb_PuntoVenta, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.insets = new Insets(5, 2, 10, 2);
        JLabel lbl_tipodoc = new JLabel("T Documento");
        pnl.add(lbl_tipodoc, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 3;
        cbTipodoc = new JComboBox();
        cbTipodoc.addActionListener(this);
        cbTipodoc.addKeyListener(this);
        pnl.add(cbTipodoc, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 4;
        JLabel lblSerie = new JLabel("Serie");
        lblSerie.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblSerie, gbc);

        gbc.gridx = 5;
        txt_serie = new JTextField();
        txt_serie.addFocusListener(this);
        txt_serie.addKeyListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setFont(new Font("Garamond", 0, 14));
        txt_serie.setColumns(3);
        pnl.add(txt_serie, gbc);

        return pnlPrinc;
    }

    @Override
    public void controlReport(boolean export) {
        if (table.getRowCount() == 0) {
            return;
        }

        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Correlativo");
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
            if ((e.getSource() == txtCodigo)
                    || (e.getSource() == txt_serie)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>();

        if (txtCodigo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtCodigo.getText().trim() + ".*", 1));
        }

        if (cbLocali.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xlocali.get(cbLocali.getSelectedIndex() - 1).getId_localidad() + ".*", 2));
        }

        if (cbTipodoc.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xtipodoc.get(cbTipodoc.getSelectedIndex() - 1).getIdTipoDoc() + ".*", 6));
        }

        if (cb_PuntoVenta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xpuntoventa.get(cb_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 4));
        }

        if (txt_serie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_serie.getText().trim() + ".*", 8));
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    public void cargarFiltro() {
        loadLocalidad(usuario.getCodempresa());
        loadTipoDocumento();
    }

    private void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (xlocali != null) {
                xlocali.clear();
            } else {
                xlocali = new ArrayList<Localidad>();
            }

            xlocali.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cbLocali.removeAllItems();
            cbLocali.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < xlocali.size(); i++) {
                cbLocali.addItem(xlocali.get(i).getDescripcion());
            }

            cbLocali.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadTipoDocumento() {
        try {
            RnTipoDocVenta regla_TipoDoc = new RnTipoDocVenta(path);

            if (xtipodoc != null) {
                xtipodoc.clear();
            } else {
                xtipodoc = new ArrayList<BeanTipoDocVenta>();
            }

            xtipodoc.addAll(regla_TipoDoc.listarTipoDocVenta("", "", "", "A", "", "", ""));

            cbTipodoc.removeAllItems();
            cbTipodoc.addItem("--- Seleccione Tipo de Documento ---");

            for (int i = 0; i < xtipodoc.size(); i++) {
                cbTipodoc.addItem(xtipodoc.get(i).getDescripcion());
            }

            cbTipodoc.setSelectedIndex(0);
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
                xpuntoventa = new ArrayList<PuntoVenta>();
            }

            xpuntoventa.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cb_PuntoVenta.removeAllItems();
            cb_PuntoVenta.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xpuntoventa.size(); i++) {
                cb_PuntoVenta.addItem(xpuntoventa.get(i).getDescripcion_puntoventa());
            }

            cb_PuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txtCodigo) {
            txtCodigo.selectAll();
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

        RegisterCorrelativo register = new RegisterCorrelativo(frame, usuario);
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

        RegisterCorrelativo register = new RegisterCorrelativo(frame, usuario);
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

        RegisterCorrelativo register = new RegisterCorrelativo(frame, usuario);
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

        RegisterCorrelativo register = new RegisterCorrelativo(frame, usuario);
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

        RegisterCorrelativo register = new RegisterCorrelativo(frame, usuario);
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
            RnCorrelativo regla = new RnCorrelativo(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            modeltable.agregarVectorcorrelativo(regla.listar("", "", ""));
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtCodigo && txtCodigo.getText().trim().length() > 0) {
            String serie = "00000" + txtCodigo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 5, serie.length());
            txtCodigo.setText(nuevaserie);
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
            if (e.getSource() == txtCodigo) {
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
