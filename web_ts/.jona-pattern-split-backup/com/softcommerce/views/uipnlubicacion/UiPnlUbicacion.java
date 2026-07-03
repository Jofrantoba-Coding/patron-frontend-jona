package com.softcommerce.views.uipnlubicacion;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.JHInternalFrame;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JPanel;
import javax.swing.RowFilter;
import javax.swing.event.ListSelectionEvent;
import com.softcommerce.general.controles.CTable;
import java.awt.BorderLayout;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import javax.swing.event.ListSelectionListener;
import javax.swing.JFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.event.MouseEvent;
import com.softcommerce.general.tablas.UbicacionTableModel;
import com.softcommerce.reglasnegocio.RnUbicacion;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.Util;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.Color;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseListener;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import org.apache.log4j.Logger;

public class UiPnlUbicacion
        extends JHInternalFrame
        implements InterUiPnlUbicacion, ListSelectionListener, MouseListener, KeyListener, ItemListener, FocusListener {

    private final Logger logger = Logger.getLogger(UiPnlUbicacion.class);

    public CTable table;
    public UbicacionTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    private final Usuario usuario;
    private final JFrame frame;
    private JComboBox cboLocalidad;
    private JComboBox cboPuntoVenta;
    private JComboBox cboAlmacen;
    private JTextField txtDescripcion;

    public UiPnlUbicacion(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPnlUbicacion(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2),
                vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6),
                vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        modeltable = new UbicacionTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        scroll = new JScrollPane(table);
        table.setNoVisibleColumn(1);
        table.setNoVisibleColumn(3);
        table.setNoVisibleColumn(5);
        table.setNoVisibleColumn(7);

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout());
        pnlaux.add(getPanelFilter(), BorderLayout.NORTH);
        pnlaux.add(scroll, BorderLayout.CENTER);
        this.initListener();
        this.setTable(pnlaux);
    }

    private void initListener() {
        table.addMouseListener(this);
        table.getSelectionModel().addListSelectionListener(this);
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        cboAlmacen.addItemListener(this);
        cboPuntoVenta.addItemListener(this);
        cboLocalidad.addItemListener(this);
    }

    public JPanel getPanelFilter() {
        JPanel pnlPinc = new JPanel();
        pnlPinc.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlPinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel(new GridBagLayout());
        pnlPinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblLocalidad = new JLabel("Localidad");
        pnl.add(lblLocalidad, gbc);
        gbc.gridx = 1;
        cboLocalidad = new JComboBox();
        pnl.add(cboLocalidad, gbc);

        gbc.gridx = 2;
        JLabel lblPuntoVenta = new JLabel("PuntoVenta");
        pnl.add(lblPuntoVenta, gbc);
        gbc.gridx = 3;
        cboPuntoVenta = new JComboBox();
        pnl.add(cboPuntoVenta, gbc);

        gbc.gridy = 1;
        gbc.gridx = 0;
        JLabel lblAlmacen = new JLabel("Almacen");
        pnl.add(lblAlmacen, gbc);
        gbc.gridx = 1;
        cboAlmacen = new JComboBox();
        pnl.add(cboAlmacen, gbc);

        gbc.gridx = 2;
        JLabel lblUbicacion = new JLabel("Ubicacion");
        pnl.add(lblUbicacion, gbc);
        gbc.gridx = 3;
        txtDescripcion = new JTextField();
        txtDescripcion.setColumns(20);
        txtDescripcion.setDocument(new UpperCaseNumberDocument(50));
        pnl.add(txtDescripcion, gbc);
        return pnlPinc;
    }

    private void changeLocalidad() throws Exception {
        try {
            String idLocalidad = LoadComboItem.getIdCombo(cboLocalidad);
            cboPuntoVenta.removeAllItems();
            if (Util.isBlank(idLocalidad)) {
                return;
            }
            LoadCombo.loadPuntoVenta(idLocalidad, cboPuntoVenta, this.path, Constans.ITEM_INIT);
        } catch (Exception e) {
            throw e;
        }
    }

    private void changePuntoVenta() throws Exception {
        try {
            String idPuntoVenta = LoadComboItem.getIdCombo(cboPuntoVenta);
            cboAlmacen.removeAllItems();
            if (Util.isBlank(idPuntoVenta)) {
                return;
            }
            LoadCombo.loadAlmacen(idPuntoVenta, cboAlmacen, path, usuario);
        } catch (Exception e) {
            throw e;
        }
    }

    private void changeAlmacen() {
    }

    @Override
    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Lista de Ubicaciones");
        ExportExcel.exportar(table, parameters);
    }

    public void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    public RowFilter<Object, Object> getFilter() {
        List<RowFilter<Object, Object>> filters = new ArrayList<RowFilter<Object, Object>>();
        String idLocalidad = LoadComboItem.getIdCombo(cboLocalidad);
        if (!Util.isBlank(idLocalidad)) {
            filters.add(RowFilter.regexFilter(idLocalidad, 7));
        }
        String idPuntoVenta = LoadComboItem.getIdCombo(cboPuntoVenta);
        if (!Util.isBlank(idPuntoVenta)) {
            filters.add(RowFilter.regexFilter(idPuntoVenta, 5));
        }
        String idAlmacen = LoadComboItem.getIdCombo(cboAlmacen);
        if (!Util.isBlank(idAlmacen)) {
            filters.add(RowFilter.regexFilter(idAlmacen, 3));
        }
        if (!Util.isBlank(txtDescripcion.getText().trim())) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcion.getText().trim() + ".*", 2));
        }
        RowFilter<Object, Object> fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    @Override
    public void cargarFiltro() {
        try {
            LoadCombo.loadLocalidad(cboLocalidad, path);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void controlPrint(boolean view) {
    }

    private RegisterUbicacion getRegisterUbicacion() {
        RegisterUbicacion register = new RegisterUbicacion(frame, usuario);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);
        return register;
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterUbicacion register = this.getRegisterUbicacion();
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
        RegisterUbicacion register = this.getRegisterUbicacion();
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
    }

    @Override
    public void controlEliminate() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterUbicacion register = this.getRegisterUbicacion();
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
        RegisterUbicacion register = this.getRegisterUbicacion();
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
            RnUbicacion regla = new RnUbicacion(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            modeltable.agregarListUbicacion(regla.listarUbicacion(0, ""));
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 2) {
            controlDetails();
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

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if (e.getSource().equals(txtDescripcion)) {
                filtrar();
            }
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(cboLocalidad)) {
                this.changeLocalidad();
                filtrar();
            }
            if (e.getSource().equals(cboPuntoVenta)) {
                this.changePuntoVenta();
                filtrar();
            }
            if (e.getSource().equals(cboAlmacen)) {
                this.changeAlmacen();
                filtrar();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}
