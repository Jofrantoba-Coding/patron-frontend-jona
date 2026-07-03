/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlreparto;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanProgramacionReparto;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.RepartoTableModel;
import com.softcommerce.reglasnegocio.RnReparto;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.ExportarToExcel;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import java.awt.BorderLayout;
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
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
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
import javax.swing.RowFilter.ComparisonType;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiPnlReparto extends JHInternalFrame implements InterUiPnlReparto, ListSelectionListener, WindowListener, FocusListener, KeyListener, ActionListener, ItemListener, MouseListener, PropertyChangeListener {

    private CTable table;
    private RepartoTableModel modeltable;
    private TableRowSorter modeloOrdenado;
    private JFrame frame;
    private Usuario usuario;
    private JTextField txt_codigo;
    private JDateChooser dc_fechainicio;
    private JDateChooser dc_fechafin;
    private JScrollPane scroll;
    private Date fechaInicio;
    private Date fechaFin;

    public UiPnlReparto(String title, JFrame frame, Usuario usuario) {
        super(title, true, true, true, false, false, true, true, false, false, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPnlReparto(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    private void inicialize() {
        //super.getPnlControl().getCbSearch().setText("Autorizar");
        super.getPnlControl().getCbClone().setText("Pedidos");
        modeltable = new RepartoTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        scroll = new JScrollPane(table);
        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));
        JPanel panel = getPanelFilter();
        //panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.NORTH);

        scroll.setPreferredSize(new Dimension(1200, 380));
        pnlaux.add(scroll, BorderLayout.CENTER);

        setTable(pnlaux);
        initListener();
    }

    private void loadCombo() {
        try {
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void initListener() {
        table.getSelectionModel().addListSelectionListener(this);
        txt_codigo.addKeyListener(this);
        txt_codigo.addFocusListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addPropertyChangeListener(this);
        dc_fechainicio.addPropertyChangeListener(this);
    }

    private JPanel getPanelFilter() {
        //JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 14, 5));
        JPanel pnlGral = new JPanel();
        pnlGral.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlGral.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lblCodigo = new JLabel("Código");
        lblCodigo.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCodigo, gbc);

        txt_codigo = new JTextField();
        txt_codigo.setColumns(7);
        txt_codigo.setDocument(new IntegerDocument(6));
        txt_codigo.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 1;
        pnl.add(txt_codigo, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;

        JLabel lblInicio = new JLabel("F Inicio");
        lblInicio.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblInicio, gbc);
        gbc.gridx = 1;
        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechainicio, gbc);

        gbc.gridx = 2;
        JLabel lblFin = new JLabel("F Fin");
        lblFin.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblFin, gbc);
        gbc.gridx = 3;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dc_fechafin, gbc);

        return pnlGral;
    }

    public void cargarTabla() {
        try {
            loadCombo();
            RnReparto logic = new RnReparto(path);
            modeloOrdenado.setRowFilter(null);
            modeltable.clearTable();
            List<BeanProgramacionReparto> lista = logic.listarProgReparto(new java.sql.Date(dc_fechainicio.getDate().getTime()), new java.sql.Date(dc_fechafin.getDate().getTime()));
            modeltable.agregarListReparto(lista);
            modeloOrdenado.setRowFilter(getFilter());
            table.setAllColumnPreferredWidth();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sunat", JOptionPane.OK_OPTION);
        }
    }

    private RowFilter getFilter() {
        List filters = new ArrayList();

        if (txt_codigo.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_codigo.getText().trim() + ".*", 0));
        }
        if (!((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText().equals("__/__/____")
                && !((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText().equals("__/__/____")) {
            if (DateTime.isValidDate(((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).getText())
                    && DateTime.isValidDate(((JTextFieldDateEditor) dc_fechafin.getDateEditor()).getText())) {
                filters.add(RowFilter.dateFilter(ComparisonType.AFTER, DateTime.getDateMinusOrPlus(dc_fechainicio.getDate(), -1), 1));
                filters.add(RowFilter.dateFilter(ComparisonType.BEFORE, DateTime.getDateMinusOrPlus(dc_fechafin.getDate(), 1), 1));
            }
        }

        RowFilter fooBarFilter = RowFilter.andFilter(filters);

        return fooBarFilter;
    }

    private void filtrar() {
        modeloOrdenado.setRowFilter(getFilter());
        table.setAllColumnPreferredWidth();

        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
        }
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        dc_fechainicio.setSelectableDateRange(fechaInicio, fechaFin);
        //dc_fechafin.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechainicio.setDate(fechaInicio);
        dc_fechafin.setDate(fechaFin);
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    private void exportarExcel() throws Exception {
        try {
            File archivo = File.createTempFile("ReporteCotizacion" + (new Date()).getTime(), ".xlsx");
            archivo.deleteOnExit();
            Map parameters = new HashMap();
            parameters.put(0, usuario.getDescriempresa());
            parameters.put(1, "Ruc: " + usuario.getRuc());
            parameters.put(2, "Reporte de Cotizaciones");
            ExportarToExcel export = new ExportarToExcel(archivo, table, parameters);
            if (export.exportarJTableToExcelParam()) {
                JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
            }
            /*} catch (IOException ex) {
             Logger.getLogger(PanelTFBoleta.class.getName()).log(Level.SEVERE, null, ex);
             JOptionPane.showMessageDialog(null, ex.getMessage());*/
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void controlAdd() {
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        try {
            RegisterProgReparto register = new RegisterProgReparto(frame, usuario, path, null);
            register.setPath(path);
            register.setRowSelection(this);
            register.setView(this);
            register.setModeRegister(Register.INSERT);
            register.setVisible(true);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlModify() {
        /*if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
         return;
         }
         int visibleRowIndex = table.getSelectedRow();
         if (visibleRowIndex < 0) {
         return;
         }
         int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
         BeanPedidoCab beanPedido = modeltable.getPedido(realRowIndex);
         if (!(beanPedido.getBeanEstadoDocumento().getId_estado().equals("003") || beanPedido.getBeanEstadoDocumento().getId_estado().equals("004"))) {
         JOptionPane.showMessageDialog(this, "NO SE PUEDE MODIFICAR DOCUMENTO, \nESTADO: " + beanPedido.getBeanEstadoDocumento().getDescripcion());
         return;
         }
         setCursor(new Cursor(Cursor.WAIT_CURSOR));
         RegisterPedidoDet register = new RegisterPedidoDet(frame, usuario, beanPedido);
         register.setPath(path);
         register.setRowSelection(this);
         register.setView(this);

         if (register.setModeRegister(Register.UPDATE)) {
         register.setSwOpcUpdate(0);
         register.setVisible(true);
         } else {
         controlRefresh();
         register.dispose();
         }
         setCursor(new Cursor(Cursor.DEFAULT_CURSOR));*/
    }

    @Override
    public void controlEliminate() {
        /*if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
         return;
         }
         int visibleRowIndex = table.getSelectedRow();
         if (visibleRowIndex < 0) {
         return;
         }
         int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
         BeanPedidoCab beanPedido = modeltable.getPedido(realRowIndex);
         if (beanPedido.getBeanEstadoDocumento().getId_estado().equals("004") || beanPedido.getBeanEstadoDocumento().getId_estado().equals("005") || beanPedido.getBeanEstadoDocumento().getId_estado().equals("008")) {
         JOptionPane.showMessageDialog(this, "NO SE PUEDE ELIMINAR DOCUMENTO, \nESTADO: " + beanPedido.getBeanEstadoDocumento().getDescripcion());
         return;
         }
         setCursor(new Cursor(Cursor.WAIT_CURSOR));
         RegisterPedidoDet register = new RegisterPedidoDet(frame, usuario, beanPedido);
         register.setPath(path);
         register.setRowSelection(this);
         register.setView(this);

         if (register.setModeRegister(Register.DELETE)) {
         register.setVisible(true);
         } else {
         controlRefresh();
         register.dispose();
         }
         setCursor(new Cursor(Cursor.DEFAULT_CURSOR));*/
    }

    @Override
    public void controlNullify() {
        /*if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
         return;
         }
         int visibleRowIndex = table.getSelectedRow();
         if (visibleRowIndex < 0) {
         return;
         }
         int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
         BeanPedidoCab beanPedido = modeltable.getPedido(realRowIndex);
         if (beanPedido.getBeanEstadoDocumento().getId_estado().equals("001")) {
         JOptionPane.showMessageDialog(this, "DOCUMENTO YA SE ENCUENTRA ANULADO");
         return;
         }
         if (!beanPedido.getBeanEstadoDocumento().getId_estado().equals("003")) {
         JOptionPane.showMessageDialog(this, "NO SE PUEDE ANULAR DOCUMENTO, \nESTADO: " + beanPedido.getBeanEstadoDocumento().getDescripcion());
         return;
         }
         setCursor(new Cursor(Cursor.WAIT_CURSOR));
         RegisterPedidoDet register = new RegisterPedidoDet(frame, usuario, beanPedido);
         register.setPath(path);
         register.setRowSelection(this);
         register.setView(this);

         if (register.setModeRegister(Register.ANULAR)) {
         register.setVisible(true);
         } else {
         controlRefresh();
         register.dispose();
         }

         setCursor(new Cursor(Cursor.DEFAULT_CURSOR));*/
    }

    @Override
    public void controlClone() {
        /*if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
         return;
         }
         int visibleRowIndex = table.getSelectedRow();
         if (visibleRowIndex < 0) {
         return;
         }
         int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
         BeanPedidoCab beanPedido = modeltable.getPedido(realRowIndex);
         if (!(beanPedido.getBeanEstadoDocumento().getId_estado().equals("003") || beanPedido.getBeanEstadoDocumento().getId_estado().equals("004"))) {
         JOptionPane.showMessageDialog(this, "NO SE PUEDE CERRAR DOCUMENTO, \nESTADO: " + beanPedido.getBeanEstadoDocumento().getDescripcion());
         return;
         }
         setCursor(new Cursor(Cursor.WAIT_CURSOR));
         RegisterPedidoDet register = new RegisterPedidoDet(frame, usuario, beanPedido);
         register.setPath(path);
         register.setRowSelection(this);
         register.setView(this);

         if (register.setModeRegister(Register.UPDATE)) {
         register.setSwOpcUpdate(2);
         register.setVisible(true);
         } else {
         controlRefresh();
         register.dispose();
         }

         setCursor(new Cursor(Cursor.DEFAULT_CURSOR));*/
    }

    @Override
    public void controlDetails() {
        if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
            return;
        }
        int visibleRowIndex = table.getSelectedRow();
        if (visibleRowIndex < 0) {
            return;
        }
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
        BeanProgramacionReparto beanReparto = modeltable.getReparto(realRowIndex);
        setCursor(new Cursor(Cursor.WAIT_CURSOR));
        RegisterProgReparto register = new RegisterProgReparto(frame, usuario, this.path, beanReparto);
        register.setPath(path);
        register.setRowSelection(this);
        register.setView(this);

        if (register.setModeRegister(Register.DETAIL)) {
            register.setVisible(true);
        } else {
            controlRefresh();
            register.dispose();
        }

        setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
    }

    @Override
    public void controlSearch() {
        /*if (table.getRowCount() == 0 || table.getSelectedRow() < 0) {
         return;
         }
         int visibleRowIndex = table.getSelectedRow();
         if (visibleRowIndex < 0) {
         return;
         }
         int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);
         BeanPedidoCab beanPedido = modeltable.getPedido(realRowIndex);
         if (!(beanPedido.getBeanEstadoDocumento().getId_estado().equals("003") || beanPedido.getBeanEstadoDocumento().getId_estado().equals("004"))) {
         JOptionPane.showMessageDialog(this, "NO SE PUEDE AUTORIZAR DOCUMENTO, \nESTADO: " + beanPedido.getBeanEstadoDocumento().getDescripcion());
         return;
         }
         setCursor(new Cursor(Cursor.WAIT_CURSOR));
         RegisterPedidoDet register = new RegisterPedidoDet(frame, usuario, beanPedido);
         register.setPath(path);
         register.setRowSelection(this);
         register.setView(this);

         if (register.setModeRegister(Register.UPDATE)) {
         register.setSwOpcUpdate(1);
         register.setVisible(true);
         } else {
         controlRefresh();
         register.dispose();
         }

         setCursor(new Cursor(Cursor.DEFAULT_CURSOR));*/
    }

    @Override
    public void controlReport(boolean export) {
        Map parameters = new HashMap();
        parameters.put(0, usuario.getDescriempresa());
        parameters.put(1, "Ruc: " + usuario.getRuc());
        parameters.put(2, "Reparto");
        ExportExcel.exportar(table, parameters);
    }

    @Override
    public void controlPrint(boolean view) {
        try {
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
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
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    @Override
    public void selectPreviusRow() {
    }

    @Override
    public void selectNextRow() {
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
    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    @Override
    public int getRowCount() {
        return table.getRowCount();
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
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(int column) {
        int visibleRowIndex = table.getSelectedRow();
        int realRowIndex = table.convertRowIndexToModel(visibleRowIndex);

        return modeltable.getValueAt(realRowIndex, column);
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
        throw new UnsupportedOperationException("Not supported yet.");
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
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_codigo) {
                //txt_descripcion.requestFocus();
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if (e.getSource() == txt_codigo) {
                filtrar();
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(fechaInicio, dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            //dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), fechaFin);
        }
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

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        if ((evt.getSource() == dc_fechainicio)
                || (evt.getSource() == dc_fechafin)) {
            filtrar();
        }
    }
}
