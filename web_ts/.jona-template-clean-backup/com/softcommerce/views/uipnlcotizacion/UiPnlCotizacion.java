/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlcotizacion;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanCotizacionCab;
import com.softcommerce.beans.BeanCotizacionCuenta;
import com.softcommerce.beans.BeanPuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.CotizacionTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.report.ConvertNumberToLetter;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.Exportar;
import com.softcommerce.util.ExportarToExcel;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.Imagenes;
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
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.swing.JComboBox;
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
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.apache.log4j.Logger;

public class UiPnlCotizacion 
        extends JHInternalFrame implements InterUiPnlCotizacion, ListSelectionListener, FocusListener, KeyListener, ActionListener, PropertyChangeListener {

    protected CTable table;
    protected CotizacionTableModel modeltable;
    protected TableRowSorter modeloOrdenado;
    protected JFrame frame;
    protected Usuario usuario;
    protected JTextField txt_codigo;
    protected JTextField txt_serie;
    protected JTextField txt_preimpreso;
    protected JTextField txt_cliente;
    protected JTextField txt_docCliente;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected JScrollPane scroll;
    protected Date fechaInicio;
    protected Date fechaFin;
    protected JComboBox cboFormato;
    protected JComboBox cboPtoVta;
    protected List<BeanPuntoVenta> xPtoVta;
    protected final Logger logger = Logger.getLogger(UiPnlCotizacion.class);

    public UiPnlCotizacion(String title, JFrame frame, Usuario usuario) {
        super(title, true, true, true, false, false, true, true, false, false, false, false, true, true);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    public UiPnlCotizacion(String title, JFrame frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        Gif gif = new Gif();
        super.getPnlControl().getCbSearch().setText("Autorizar");        
        super.getPnlControl().getCbSearch().setIcon(gif.autorizar);
        //super.getPnlControl().getCbSearch().setIcon((new Imagenes()).getIconSeguridad());
        modeltable = new CotizacionTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        scroll = new JScrollPane(table);
        table.setNoVisibleColumn(3);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(8);
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

    protected void loadCombo() {
    }

    protected void loadPtoVta() throws Exception {
    }

    protected void initListener() {
        table.getSelectionModel().addListSelectionListener(this);
        txt_codigo.addKeyListener(this);
        txt_codigo.addFocusListener(this);
        txt_serie.addKeyListener(this);
        txt_serie.addFocusListener(this);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.addFocusListener(this);
        txt_cliente.addKeyListener(this);
        txt_cliente.addFocusListener(this);
        txt_docCliente.addKeyListener(this);
        txt_docCliente.addFocusListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addPropertyChangeListener(this);
        dc_fechainicio.addPropertyChangeListener(this);
        cboPtoVta.addActionListener(this);
    }

    protected JPanel getPanelFilter() {
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

        JLabel lblDocumento = new JLabel("Documento");
        lblDocumento.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnl.add(lblDocumento, gbc);

        txt_serie = new JTextField();
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 3;
        pnl.add(txt_serie, gbc);
        txt_preimpreso = new JTextField();
        txt_preimpreso.setColumns(8);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 4;
        pnl.add(txt_preimpreso, gbc);

        JLabel lblformato = new JLabel("Formato");
        lblformato.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 5;
        pnl.add(lblformato, gbc);

        cboFormato = new JComboBox();
        cboFormato.addItem("SIMPLE");
        cboFormato.addItem("ESPECIAL");
        gbc.gridx = 6;
        pnl.add(cboFormato, gbc);

        JLabel lblPtoVta = new JLabel("Pto Vta");
        lblPtoVta.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 7;
        pnl.add(lblPtoVta, gbc);

        cboPtoVta = new JComboBox();
        gbc.gridx = 8;
        pnl.add(cboPtoVta, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblCliente = new JLabel("Cliente");
        lblCliente.setFont(new Font("Verdana", 0, 11));
        pnl.add(lblCliente, gbc);

        txt_cliente = new JTextField();
        txt_cliente.setDocument(new UpperCaseNumberDocument(100));
        txt_cliente.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 1;
        gbc.gridwidth = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txt_cliente, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        JLabel lblNum = new JLabel("RUC/DNI");
        lblNum.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 5;
        pnl.add(lblNum, gbc);

        txt_docCliente = new JTextField();
        txt_docCliente.setColumns(11);
        txt_docCliente.setDocument(new IntegerDocument(11));
        txt_docCliente.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 6;
        pnl.add(txt_docCliente, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;

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

    @Override
    public void cargarTabla() {
    }

    protected RowFilter getFilter() {
        return null;
    }

    protected void filtrar() {
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        dc_fechainicio.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechafin.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechainicio.setDate(fechaInicio);
        dc_fechafin.setDate(fechaFin);
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    protected void exportarExcel() throws Exception {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void controlAdd() {
    }

    @Override
    public void controlModify() {
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
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlClose() {
    }

    @Override
    public void controlRefresh() {
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
        return null;
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
    public void focusGained(FocusEvent e) {

        if (e.getSource() == txt_codigo) {
            txt_codigo.selectAll();
        }
        if (e.getSource() == txt_cliente) {
            txt_cliente.selectAll();
        }
        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }
        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }
        if (e.getSource() == txt_docCliente) {
            txt_docCliente.selectAll();
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
            if (e.getSource() == txt_codigo || e.getSource() == txt_serie || e.getSource() == txt_preimpreso
                    || e.getSource() == txt_cliente || e.getSource() == txt_docCliente) {
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
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), fechaFin);
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        if ((evt.getSource() == dc_fechainicio)
                || (evt.getSource() == dc_fechafin)) {
            filtrar();
        }
    }
}
