/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfitem;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.TipoVentaEnum;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.ItemTableModel;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPreciosCab;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.Util;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFItem
        extends JHInternalFrame
        implements InterUiPanelTFItem, ListSelectionListener, FocusListener, KeyListener, ItemListener {

    private static final long serialVersionUID = 1L;
    public CTable table;
    public ItemTableModel modeltable;
    public TableRowSorter<ItemTableModel> modeloOrdenado;
    private JTextField txtIdItem;
    private JTextField txtDescripcion;
    private JTextField txtClienteItemColor;
    private JTextField txtCodCliente;
    private JTextField txtIdAlterno;
    private List<BeanMarca> xmarca;
    private JComboBox cboMarca;
    private JComboBox cboSubFamilia;
    private JComboBox cboFamilia;
    private final Usuario usuario;
    private JScrollPane scroll;
    private final Main frame;
    private Date fechaInicio;
    private Date fechaFin;
    private JCheckBox chkIncluyePercepcion;
    private JCheckBox chkNoIncluyePercepcion;
    private JCheckBox chkTieneHijos;
    private final Logger logger = Logger.getLogger(UiPanelTFItem.class);

    public UiPanelTFItem(String title, Main frame, Usuario usuario) {
        super(title + "- UiPanelTFItem");
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFItem(String title, Main frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2),
                vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPanelTFItem(String title, Main frame, Usuario usuario, boolean Vendedor) {
        super(title + "- UiPanelTFItem", false, false, false, false, false, false, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        modeltable = new ItemTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

        table.setNoVisibleColumn(8);
        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(12);
        table.setNoVisibleColumn(14);
        if (Constans.TIPO_VENTA.compareTo(TipoVentaEnum.COSTO.getValue()) == 0 || Constans.IS_ITEM_BY_CLIENTE_COLOR) {
            table.setNoVisibleColumn(4);
            table.setNoVisibleColumn(6);
            table.setNoVisibleColumn(7);
            table.setNoVisibleColumn(9);
            table.setNoVisibleColumn(11);
            table.setNoVisibleColumn(13);
        } else {
            table.setNoVisibleColumn(16);
            table.setNoVisibleColumn(17);
            table.setNoVisibleColumn(18);
            table.setNoVisibleColumn(19);
            table.setNoVisibleColumn(20);
            table.setNoVisibleColumn(21);
        }
        if (!Constans.IS_ITEM_BY_CLIENTE) {
            table.setNoVisibleColumn(15);
        }
        if (!Constans.IS_ITEM_BY_CLIENTE_COLOR) {
            table.setNoVisibleColumn(22);
        }
        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                e.getKeyCode();
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
        pnlaux.add(panel, BorderLayout.NORTH);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);
    }

    public JPanel getPanelFilter() {
        JPanel pnlPinc = new JPanel(new BorderLayout());
        JPanel pnlp = new JPanel();
        pnlPinc.add(pnlp, BorderLayout.WEST);
        pnlPinc.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.weightx = 1.0;
        gbc.weighty = 1.0;

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        lbl_CodigoItem.setHorizontalAlignment(SwingConstants.RIGHT);
        addGrid(pnlp, gbc, 0, 0, lbl_CodigoItem);

        txtIdItem = new JTextField();
        txtIdItem.setColumns(7);
        txtIdItem.addKeyListener(this);
        txtIdItem.setDocument(new UpperCaseNumberDocument());
        txtIdItem.addFocusListener(this);
        txtIdItem.setFont(new Font("Garamond", 0, 14));
        addGrid(pnlp, gbc, 1, 0, txtIdItem);

        JLabel lbl_CodigoAlterno = new JLabel("Código Alt.");
        lbl_CodigoAlterno.setFont(new Font("Verdana", 0, 11));
        lbl_CodigoAlterno.setHorizontalAlignment(SwingConstants.RIGHT);
        pnlp.add(lbl_CodigoAlterno);
        addGrid(pnlp, gbc, 2, 0, lbl_CodigoAlterno);

        txtIdAlterno = new JTextField();
        txtIdAlterno.setColumns(7);
        txtIdAlterno.addFocusListener(this);
        txtIdAlterno.addKeyListener(this);
        txtIdAlterno.setDocument(new UpperCaseNumberDocument());
        txtIdAlterno.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txtIdAlterno);
        addGrid(pnlp, gbc, 3, 0, txtIdAlterno);

        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        lblItem.setHorizontalAlignment(SwingConstants.RIGHT);
        addGrid(pnlp, gbc, 4, 0, lblItem);

        txtDescripcion = new JTextField();
        txtDescripcion.setColumns(30);
        txtDescripcion.addFocusListener(this);
        txtDescripcion.setFont(new Font("Garamond", 0, 14));
        txtDescripcion.setDocument(new UpperCaseNumberDocument(255));
        txtDescripcion.addKeyListener(this);
        addGrid(pnlp, gbc, 5, 0, txtDescripcion);

        JLabel lblCodCliente = new JLabel("Cod Cliente");
        lblCodCliente.setFont(new Font("Verdana", 0, 11));
        lblCodCliente.setHorizontalAlignment(SwingConstants.RIGHT);

        txtCodCliente = new JTextField();
        txtCodCliente.setColumns(10);
        txtCodCliente.addFocusListener(this);
        txtCodCliente.setFont(new Font("Garamond", 0, 14));
        txtCodCliente.setDocument(new UpperCaseNumberDocument(255));
        txtCodCliente.addKeyListener(this);

        JLabel lbl_familia = new JLabel("Familia");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setHorizontalAlignment(SwingConstants.RIGHT);

        cboFamilia = new JComboBox();
        cboFamilia.addItemListener(this);
        cboFamilia.addKeyListener(this);

        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        lbl_subfamilia.setFont(new Font("Verdana", 0, 11));
        lbl_subfamilia.setHorizontalAlignment(SwingConstants.RIGHT);

        cboSubFamilia = new JComboBox();
        cboSubFamilia.addItemListener(this);
        cboSubFamilia.setEnabled(false);
        cboSubFamilia.addKeyListener(this);

        JLabel lblMarca = new JLabel("Marca");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        lblMarca.setHorizontalAlignment(SwingConstants.RIGHT);

        cboMarca = new JComboBox();
        cboMarca.addKeyListener(this);
        cboMarca.addItemListener(this);

        chkIncluyePercepcion = new JCheckBox("Con Percepcion");
        chkIncluyePercepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        chkIncluyePercepcion.addItemListener(this);
        chkIncluyePercepcion.setFont(new Font("Verdana", 1, 10));
        chkIncluyePercepcion.addKeyListener(this);
        chkIncluyePercepcion.setHorizontalTextPosition(SwingConstants.RIGHT);
        chkIncluyePercepcion.addFocusListener(this);
        chkIncluyePercepcion.setOpaque(false);

        chkNoIncluyePercepcion = new JCheckBox("Sin Percepcion");
        chkNoIncluyePercepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        chkNoIncluyePercepcion.addItemListener(this);
        chkNoIncluyePercepcion.setFont(new Font("Verdana", 1, 10));
        chkNoIncluyePercepcion.addKeyListener(this);
        chkNoIncluyePercepcion.setHorizontalTextPosition(SwingConstants.RIGHT);
        chkNoIncluyePercepcion.addFocusListener(this);
        chkNoIncluyePercepcion.setOpaque(false);

        chkTieneHijos = new JCheckBox("Conversion");
        chkTieneHijos.setHorizontalAlignment(SwingConstants.RIGHT);
        chkTieneHijos.addItemListener(this);
        chkTieneHijos.setFont(new Font("Verdana", 1, 10));
        chkTieneHijos.addKeyListener(this);
        chkTieneHijos.setHorizontalTextPosition(SwingConstants.RIGHT);
        chkTieneHijos.addFocusListener(this);
        chkTieneHijos.setOpaque(false);
        if (Constans.TIPO_VENTA.compareTo(TipoVentaEnum.COSTO.getValue()) != 0) {
            addGrid(pnlp, gbc, 0, 1, lbl_familia);
            addGrid(pnlp, gbc, 1, 1, cboFamilia);
            addGrid(pnlp, gbc, 2, 1, lbl_subfamilia);
            addGrid(pnlp, gbc, 3, 1, cboSubFamilia);
            addGrid(pnlp, gbc, 4, 1, lblMarca);
            addGrid(pnlp, gbc, 5, 1, cboMarca);
            addGrid(pnlp, gbc, 1, 2, chkIncluyePercepcion);
            addGrid(pnlp, gbc, 2, 2, chkNoIncluyePercepcion);
            addGrid(pnlp, gbc, 3, 2, chkTieneHijos);
        } else {
            addGrid(pnlp, gbc, 6, 0, lblCodCliente);
            addGrid(pnlp, gbc, 7, 0, txtCodCliente);
        }

        JLabel lblCliente = new JLabel("Cliente");
        lblItem.setFont(new Font("Verdana", 0, 11));
        lblItem.setHorizontalAlignment(SwingConstants.RIGHT);

        txtClienteItemColor = new JTextField();
        txtClienteItemColor.setColumns(20);
        txtClienteItemColor.addFocusListener(this);
        txtClienteItemColor.setFont(new Font("Garamond", 0, 14));
        txtClienteItemColor.setDocument(new UpperCaseNumberDocument(255));
        txtClienteItemColor.addKeyListener(this);
        if (Constans.IS_ITEM_BY_CLIENTE_COLOR) {
            addGrid(pnlp, gbc, 6, 0, lblCliente);
            addGrid(pnlp, gbc, 7, 0, txtClienteItemColor);
        }

        return pnlPinc;
    }

    private void addGrid(JPanel pnl, GridBagConstraints gbc, int x, int y, JComponent component) {
        gbc.gridx = x;
        gbc.gridy = y;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(component, gbc);
    }

    @Override
    public void controlReport(boolean export) {
        if (table.getRowCount() == 0) {
            return;
        }

        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Item");
        ExportExcel.exportar(table, parameters);
    }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    @Override
    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    //tania
    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txtDescripcion)
                    || (e.getSource() == txtIdAlterno)
                    || (e.getSource() == txtClienteItemColor)
                    || (e.getSource() == txtIdItem)
                    || (e.getSource() == txtCodCliente)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>();

        if (txtDescripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcion.getText().trim() + ".*", 3));
        }
        if (txtClienteItemColor.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtClienteItemColor.getText().trim() + ".*", 22));
        }
        if (txtCodCliente.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtCodCliente.getText().trim() + ".*", 15));
        }

        int posIdItem = 1;
        int posIdAlterno = 2;
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            posIdItem = 2;
            posIdAlterno = 1;
        }

        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", posIdItem));
        }

        if (txtIdAlterno.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdAlterno.getText().trim() + ".*", posIdAlterno));
        }

        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xmarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 12));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + this.getIdFamilia() + ".*", 8));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + this.getIdSubFamilia() + ".*", 10));
        }

        if (chkIncluyePercepcion.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "S" + ".*", 7));
        }

        if (chkNoIncluyePercepcion.isSelected()) {
            filters.add(RowFilter.regexFilter(".*" + "N" + ".*", 7));
        }

        if (chkTieneHijos.isSelected()) {
            filters.add(RowFilter.numberFilter(ComparisonType.AFTER, 0, 14));
        }

        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    @Override
    public void cargarFiltro() {
        try {
            loadMarca();
            LoadComboItem.loadComboFamilia(path, cboFamilia, usuario);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadMarca() {
        try {
            RnMarca regla_Marca = new RnMarca(path);

            if (xmarca != null) {
                xmarca.clear();
            } else {
                xmarca = new ArrayList<BeanMarca>();
            }

            xmarca.addAll(regla_Marca.listarGeneral(usuario.getCodempresa()));

            cboMarca.removeAllItems();
            cboMarca.addItem("--- TODOS ---");

            for (Integer i = 0; i < xmarca.size(); i++) {
                cboMarca.addItem(xmarca.get(i).getDescripcion());
            }

            cboMarca.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadSubFamilia() {
        try {
            cboSubFamilia.removeAllItems();
            String idFamilia = this.getIdFamilia();
            if (Util.isBlank(idFamilia)) {
                cboSubFamilia.setEnabled(false);
                return;
            }
            cboSubFamilia.setEnabled(true);
            LoadComboItem.loadComboFamilia(path, cboSubFamilia, idFamilia);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getIdFamilia() {
        BeanFamilia beanFamilia = (BeanFamilia) LoadComboItem.getObjectCombo(cboFamilia);
        if (beanFamilia == null) {
            return "";
        }
        return beanFamilia.getIdFamilia();
    }

    private String getIdSubFamilia() {
        BeanSubFamilia beanSubFamilia = (BeanSubFamilia) LoadComboItem.getObjectCombo(cboSubFamilia);
        if (beanSubFamilia == null) {
            return "";
        }
        return beanSubFamilia.getIdSubFamilia();
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        JHDialog register = this.getRegister();
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        register.setFecha(fechaInicio, fechaFin);
        register.setModeRegister(Register.INSERT);
        register.setVisible(true);
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    private JHDialog getRegister() {
        if (Constans.IS_ITEM_RESUMEN) {
            return new RegisterItemResumen(frame, usuario);
        }
        return new RegisterItem(frame, usuario);
    }

    @Override
    public void controlModify() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        RegisterItem register = new RegisterItem(frame, usuario);
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

        RegisterItem register = new RegisterItem(frame, usuario);
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
    }

    @Override
    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }

        setCursor(new Cursor(Cursor.WAIT_CURSOR));

        //RegisterItem register = new RegisterItem(frame, usuario);
        RegisterItem register = new RegisterItem(frame, usuario);
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

    @Override
    public void cargarTabla() {
        try {
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            modeltable.agregarListItem(this.getListItem());
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private List<BeanItem> getListItem() throws Exception {
        try {
            RnItem regla = new RnItem(path);
            List<BeanItem> lista = regla.listItem("");
            if (Constans.TIPO_VENTA.compareTo(TipoVentaEnum.COSTO.getValue()) == 0 || Constans.IS_ITEM_BY_CLIENTE_COLOR) {
                this.setPrecioToItem(lista);
            }
            return lista;
        } catch (Exception e) {
            throw e;
        }
    }

    private void setPrecioToItem(List<BeanItem> listaItem) throws Exception {
        try {
            RnPreciosCab regla = new RnPreciosCab(path);
            List<BeanPrecioItem> listaPrecio = regla.listarPrecios(usuario.getCodempresa(), usuario.getCodlocalidad());
            for (BeanItem beanItem : listaItem) {
                beanItem.setBeanPrecioItem(this.getPrecioItem(listaPrecio, beanItem.getIdItem()));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private BeanPrecioItem getPrecioItem(List<BeanPrecioItem> listaPrecio, String idItem) {
        Iterator<BeanPrecioItem> i = listaPrecio.iterator();
        while (i.hasNext()) {
            BeanPrecioItem precio = i.next();
            if (precio.getIdItem().equals(idItem)) {
                i.remove();
                return precio;
            }
        }
        return new BeanPrecioItem();
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtIdItem && txtIdItem.getText().trim().length() > 0) {
            if (!Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
                String serie = "000000" + txtIdItem.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 6, serie.length());

                txtIdItem.setText(nuevaserie);
            }

            filtrar();
        }

        if (e.getSource() == txtIdAlterno && txtIdAlterno.getText().trim().length() > 0) {
            if (!Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
                String serie = "000000" + txtIdAlterno.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 6, serie.length());

                txtIdAlterno.setText(nuevaserie);
            }

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtIdItem) {
                txtIdAlterno.requestFocus();
            }

            if (e.getSource() == txtIdAlterno) {
                txtDescripcion.requestFocus();
            }

            if (e.getSource() == txtDescripcion) {
                cboFamilia.requestFocus();
            }

            if (e.getSource() == cboFamilia) {
                if (cboSubFamilia.isEnabled()) {
                    cboSubFamilia.requestFocus();
                } else {
                    cboMarca.requestFocus();
                }
            }

            if (e.getSource() == cboSubFamilia) {
                cboMarca.requestFocus();
            }

            if (e.getSource() == cboMarca) {
                chkIncluyePercepcion.requestFocus();
            }

            if (e.getSource() == chkIncluyePercepcion) {
                chkNoIncluyePercepcion.requestFocus();
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean is_Selected;
        is_Selected = (e.getStateChange() == ItemEvent.SELECTED);
        if (e.getItemSelectable() == chkIncluyePercepcion) {
            if (is_Selected) {
                chkNoIncluyePercepcion.setSelected(false);
            }
            filtrar();
        }

        if (e.getItemSelectable() == chkNoIncluyePercepcion) {
            if (is_Selected) {
                chkIncluyePercepcion.setSelected(false);
            }
            filtrar();
        }
        if (e.getItemSelectable() == chkTieneHijos) {
            filtrar();
        }
        if (cboFamilia == e.getSource()) {
            loadSubFamilia();
            filtrar();
        }

        if (e.getSource() == cboSubFamilia) {
            filtrar();
        }

        if (e.getSource() == cboMarca) {
            filtrar();
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
}
