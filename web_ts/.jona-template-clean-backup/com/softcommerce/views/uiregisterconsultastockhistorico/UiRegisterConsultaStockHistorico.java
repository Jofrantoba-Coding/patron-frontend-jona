package com.softcommerce.views.uiregisterconsultastockhistorico;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.StockAlmacen;
import com.softcommerce.beans.StockAlmacenItem;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTamano;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.StockLaboratorio;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.StockHistoricoTableModel;
import com.softcommerce.general.tablas.StockItemAlmacenTableModel;
import com.softcommerce.general.tablas.StockLaboratorioReservaTableModel;
import com.softcommerce.general.tablas.StockLaboratorioTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.reglasnegocio.RnTamano;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
import com.softcommerce.report.Reporte;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportarToExcel;
import com.softcommerce.util.render.CellRendererLabelVence;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.beans.PropertyVetoException;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDesktopPane;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.ListSelectionModel;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class UiRegisterConsultaStockHistorico
        extends JHInternalDialog
        implements InterUiRegisterConsultaStockHistorico, KeyListener, ActionListener,
        FocusListener, ChangeListener {

    private static final long serialVersionUID = 1L;
    protected JComboBox cboMarca;
    protected List<BeanMarca> xMarca;
    protected JComboBox cboMonto;
    protected JComboBox cboFamilia;
    protected List<BeanFamilia> xFamilia;
    protected JComboBox cboSubFamilia;
    protected List<BeanSubFamilia> xSubFamilia;
    protected JComboBox cboAlmacen;
    protected List<Almacen> xAlmacen;
    protected JComboBox cboPuntoVenta;
    protected List<PuntoVenta> xPuntoVenta;
    protected JComboBox cboLocalidad;
    protected List<Localidad> xLocalidad;
    protected JTextField txtDescripcionItem;
    protected JTextField txtIdItem;
    protected JTextField txtMonto;
    protected JButton btnNuevo;
    protected JButton btnBuscar;
    protected JButton btnRecalculaStock;
    protected JButton btnKardexFisico;
    protected JButton btnExportarExcel;
    protected JButton btnGenerarReporte;
    protected JButton btnDetalle;
    protected JButton btnSalir;
    protected StockHistoricoTableModel mdl_stock2;
    protected StockLaboratorioTableModel mdlStockLaboratorio;
    protected StockLaboratorioTableModel mdlStockLote;
    protected StockLaboratorioReservaTableModel mdlStockLoteReserva;
    protected StockItemAlmacenTableModel modelStock;
    protected TableRowSorter<StockItemAlmacenTableModel> modeloOrdenadoStock;
    protected TableRowSorter<StockHistoricoTableModel> modeloOrdenadoStockHist;
    protected TableRowSorter<StockLaboratorioTableModel> modeloOrdenadoStockLab;
    protected TableRowSorter<StockLaboratorioTableModel> modeloOrdenadoStockLote;
    protected TableRowSorter<StockLaboratorioReservaTableModel> modeloOrdenadoStockLoteReserva;
    protected CTable tbl_inventario2;
    protected CTable tblStockLaboratorio;
    protected JTable tblStockLote;
    protected JTable tblStockLoteReserva;
    protected JTable tableStock;
    protected final Main frm;
    protected Gif gif;
    protected Usuario usuario = new Usuario();
    protected JDateChooser dcFechaFin;
    protected List<StockAlmacen> listPrueba;
    protected JTabbedPane tabb;
    protected JComboBox cboUm;
    protected List<BeanUnidadMedida> xUm;
    protected List<BeanTamano> xtamano;
    protected JComboBox cboTamano;
    protected final Logger logger = Logger.getLogger(UiRegisterConsultaStockHistorico.class);

    public UiRegisterConsultaStockHistorico(String title, Main frm, JDesktopPane jdp, Usuario usuario) {
        super(title);
        this.frm = frm;
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        addKeyListener(this);

        gif = new Gif();

        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        pnlPrincipal.add(getpnlFiltro(), BorderLayout.NORTH);
        pnlPrincipal.add(getPnlOpciones(), BorderLayout.SOUTH);
        pnlPrincipal.add(getPnlCenter(), BorderLayout.CENTER);
        setResizable(true);
        setClosable(true);
        //setSize(1020, 555);
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
        setPanel(pnlPrincipal);
    }

    protected JPanel getpnlFiltro() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        pnl.add(getPnlFiltrosLeft(), BorderLayout.WEST);
        return pnl;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        tabb = new JTabbedPane();
        tabb.addChangeListener(this);
        tabb.add("STOCK", getPnlCenterStock());
        tabb.add("STOCK ALMACENES", getPnlCenterStockAlmacenItem());
        if (Constans.ISBOTICA) {
            tabb.add("STOCK LABORATORIO", getPnlCenterStockLaboratorio());
            tabb.add("STOCK LOTE", getPnlCenterStockLote());
            tabb.add("STOCK LOTE - RESERVA", getPnlCenterStockLoteReserva());
        }
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlCenterStock() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        mdl_stock2 = new StockHistoricoTableModel();
        tbl_inventario2 = new CTable();
        tbl_inventario2.setModel(mdl_stock2);
        modeloOrdenadoStockHist = new TableRowSorter(mdl_stock2);
        tbl_inventario2.setRowSorter(modeloOrdenadoStockHist);
        tbl_inventario2.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tbl_inventario2.setAllTableNoEditable();
        tbl_inventario2.setNoVisibleColumn(1);
        tbl_inventario2.setNoVisibleColumn(4);
        tbl_inventario2.setNoVisibleColumn(6);
        tbl_inventario2.setNoVisibleColumn(8);
        tbl_inventario2.setNoVisibleColumn(10);
        tbl_inventario2.setNoVisibleColumn(12);
        tbl_inventario2.setNoVisibleColumn(15);
        tbl_inventario2.setAllColumnPreferredWidth();

        JScrollPane jsp = new JScrollPane(tbl_inventario2);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlCenterStockLaboratorio() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        mdlStockLaboratorio = new StockLaboratorioTableModel(20, frm.getDateServer());
        tblStockLaboratorio = new CTable();
        tblStockLaboratorio.setModel(mdlStockLaboratorio);
        modeloOrdenadoStockLab = new TableRowSorter(mdlStockLaboratorio);
        tblStockLaboratorio.setRowSorter(modeloOrdenadoStockLab);
        tblStockLaboratorio.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tblStockLaboratorio.setAllTableNoEditable();
        tblStockLaboratorio.setNoVisibleColumn(1);
        tblStockLaboratorio.setNoVisibleColumn(4);
        tblStockLaboratorio.setNoVisibleColumn(6);
        tblStockLaboratorio.setNoVisibleColumn(8);
        tblStockLaboratorio.setNoVisibleColumn(10);
        tblStockLaboratorio.setNoVisibleColumn(12);
        tblStockLaboratorio.setNoVisibleColumn(15);
        tblStockLaboratorio.setNoVisibleColumn(16);
        tblStockLaboratorio.setNoVisibleColumn(18);
        tblStockLaboratorio.setAllColumnPreferredWidth();

        JScrollPane jsp = new JScrollPane(tblStockLaboratorio);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlCenterStockLote() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        mdlStockLote = new StockLaboratorioTableModel(25, frm.getDateServer());
        tblStockLote = new JTable();
        tblStockLote.setFont(new Font("Tahoma", Font.PLAIN, 11));
        tblStockLote.setRowHeight(19);
        tblStockLote.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        tblStockLote.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tblStockLote.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        tblStockLote.setModel(mdlStockLote);
        for (int i = 0; i < mdlStockLote.getColumnCount(); i++) {
            tblStockLote.getColumnModel().getColumn(i).setCellRenderer(new CellRendererLabelVence(24));
        }
        modeloOrdenadoStockLote = new TableRowSorter(mdlStockLote);
        tblStockLote.setRowSorter(modeloOrdenadoStockLote);
        tblStockLote.setFont(new Font(Font.SANS_SERIF, 0, 11));
        List<Integer> listColumns = new ArrayList();
        listColumns.add(1);
        listColumns.add(4);
        listColumns.add(6);
        listColumns.add(8);
        listColumns.add(10);
        listColumns.add(12);
        listColumns.add(15);
        listColumns.add(16);
        listColumns.add(18);
        listColumns.add(24);
        CTableFx.minimizeWidthColumn(tblStockLote, listColumns);
        CTableFx.setAllColumnPreferredWidth(tblStockLote);
        JScrollPane jsp = new JScrollPane(tblStockLote);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }
    
    protected JPanel getPnlCenterStockLoteReserva() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        mdlStockLoteReserva= new StockLaboratorioReservaTableModel(27, frm.getDateServer());
        tblStockLoteReserva = new JTable();
        tblStockLoteReserva.setFont(new Font("Tahoma", Font.PLAIN, 11));
        tblStockLoteReserva.setRowHeight(19);
        tblStockLoteReserva.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        tblStockLoteReserva.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tblStockLoteReserva.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        tblStockLoteReserva.setModel(mdlStockLoteReserva);
        for (int i = 0; i < mdlStockLoteReserva.getColumnCount(); i++) {
            tblStockLoteReserva.getColumnModel().getColumn(i).setCellRenderer(new CellRendererLabelVence(26));
        }
        modeloOrdenadoStockLoteReserva = new TableRowSorter(mdlStockLoteReserva);
        tblStockLoteReserva.setRowSorter(modeloOrdenadoStockLoteReserva);
        tblStockLoteReserva.setFont(new Font(Font.SANS_SERIF, 0, 11));
        List<Integer> listColumns = new ArrayList();
        listColumns.add(1);
        listColumns.add(4);
        listColumns.add(6);
        listColumns.add(8);
        listColumns.add(10);
        listColumns.add(12);
        listColumns.add(17);
        listColumns.add(18);
        listColumns.add(20);
        listColumns.add(26);
        CTableFx.minimizeWidthColumn(tblStockLoteReserva, listColumns);
        CTableFx.setAllColumnPreferredWidth(tblStockLoteReserva);
        JScrollPane jsp = new JScrollPane(tblStockLoteReserva);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlCenterStockAlmacenItem() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modelStock = new StockItemAlmacenTableModel();
        tableStock = new JTable();
        tableStock.setFont(new Font("Tahoma", Font.PLAIN, 11));
        tableStock.setRowHeight(19);
        tableStock.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        tableStock.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tableStock.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        modeloOrdenadoStock = new TableRowSorter(modelStock);
        tableStock.setRowSorter(modeloOrdenadoStock);
        //tableStock.setAllTableNoEditable();

        JScrollPane jsp = new JScrollPane(tableStock);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlOpciones() {
        return null;
    }

    protected JPanel getPnlFiltrosLeft() {
        JPanel pnlFiltro = new JPanel();
        pnlFiltro.setLayout(new GridBagLayout());
        pnlFiltro.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();

        cboLocalidad = new JComboBox();
        cboLocalidad.addActionListener(this);
        cboLocalidad.setEnabled(false);
        cboLocalidad.setVisible(false);

        JLabel lblPuntoVenta = new JLabel("P.Venta");
        lblPuntoVenta.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblPuntoVenta, gbc);

        cboPuntoVenta = new JComboBox();
        cboPuntoVenta.addActionListener(this);
        cboPuntoVenta.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridwidth = 3;
        pnlFiltro.add(cboPuntoVenta, gbc);
        gbc.gridwidth = 1;

        JLabel lbl_Almacen = new JLabel("Almacén");
        lbl_Almacen.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lbl_Almacen, gbc);

        cboAlmacen = new JComboBox();
        cboAlmacen.addActionListener(this);
        cboAlmacen.addKeyListener(this);
        gbc.gridx = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboAlmacen, gbc);
        gbc.fill = GridBagConstraints.NONE;

        btnNuevo = new JButton(gif.BUSCAR);
        btnNuevo.setHorizontalTextPosition(SwingConstants.RIGHT);
        btnNuevo.setToolTipText("Filtrar");
        btnNuevo.setText("Filtrar");
        btnNuevo.setContentAreaFilled(true);
        btnNuevo.setBorderPainted(true);
        btnNuevo.setFocusable(true);
        btnNuevo.setFocusPainted(false);
        btnNuevo.addActionListener(this);
        btnNuevo.addKeyListener(this);
        gbc.gridx = 6;
        pnlFiltro.add(this.btnNuevo, gbc);

        btnBuscar = new JButton(gif.DETAIL16);
        btnBuscar.setHorizontalTextPosition(SwingConstants.RIGHT);
        btnBuscar.setText("Ver detalle");
        btnBuscar.setToolTipText("Ver Detalle");
        btnBuscar.setContentAreaFilled(true);
        btnBuscar.setBorderPainted(true);
        btnBuscar.setFocusable(true);
        btnBuscar.setFocusPainted(false);
        btnBuscar.addActionListener(this);
        btnBuscar.addKeyListener(this);
        gbc.gridx = 7;
        gbc.anchor = GridBagConstraints.WEST;
        pnlFiltro.add(this.btnBuscar, gbc);

        JLabel lbl_familia = new JLabel("Familia");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlFiltro.add(lbl_familia, gbc);

        cboFamilia = new JComboBox();
        cboFamilia.addActionListener(this);
        cboFamilia.addKeyListener(this);
        gbc.gridwidth = 3;
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboFamilia, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        lbl_subfamilia.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lbl_subfamilia, gbc);

        cboSubFamilia = new JComboBox();
        cboSubFamilia.addActionListener(this);
        cboSubFamilia.addKeyListener(this);
        gbc.gridx = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboSubFamilia, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblMarca = new JLabel("Marca");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 6;
        pnlFiltro.add(lblMarca, gbc);

        cboMarca = new JComboBox();
        cboMarca.addKeyListener(this);
        cboMarca.addActionListener(this);
        gbc.gridx = 7;
        pnlFiltro.add(cboMarca, gbc);

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlFiltro.add(lbl_CodigoItem, gbc);

        txtIdItem = new JTextField();
        txtIdItem.addKeyListener(this);
        txtIdItem.addFocusListener(this);
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            txtIdItem.setDocument(new UpperCaseNumberDocument(30));
        } else {
            txtIdItem.setDocument(new IntegerDocument(6));
        }
        txtIdItem.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(txtIdItem, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        JLabel lblUm = new JLabel("U.M.");
        lblUm.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lblUm, gbc);

        cboUm = new JComboBox();
        cboUm.addActionListener(this);
        gbc.gridx = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboUm, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 6;
        pnlFiltro.add(lblItem, gbc);

        txtDescripcionItem = new JTextField();
        txtDescripcionItem.setFont(new Font("Garamond", 0, 14));
        txtDescripcionItem.setDocument(new UpperCaseNumberDocument(255));
        txtDescripcionItem.addFocusListener(this);
        txtDescripcionItem.addKeyListener(this);
        gbc.gridx = 7;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(txtDescripcionItem, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblMonto = new JLabel("Cant Fisica");
        lblMonto.setDisplayedMnemonic('o');
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnlFiltro.add(lblMonto, gbc);

        cboMonto = new JComboBox();
        cboMonto.addItem("=");
        cboMonto.addItem("<>");
        cboMonto.addItem("<");
        cboMonto.addItem("<=");
        cboMonto.addItem(">");
        cboMonto.addItem(">=");
        cboMonto.addActionListener(this);
        gbc.gridx = 1;
        pnlFiltro.add(cboMonto, gbc);

        txtMonto = new JTextField();
        txtMonto.addKeyListener(this);
        txtMonto.setColumns(3);
        txtMonto.setDocument(new DoubleDocument());
        txtMonto.addFocusListener(this);
        txtMonto.addKeyListener(this);
        txtMonto.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 2;
        pnlFiltro.add(txtMonto, gbc);

        JLabel lblTamano = new JLabel("Tamaño");
        lblTamano.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lblTamano, gbc);

        cboTamano = new JComboBox();
        cboTamano.addKeyListener(this);
        cboTamano.addActionListener(this);
        gbc.gridx = 5;
        pnlFiltro.add(cboTamano, gbc);

        JLabel lblFechaFin = new JLabel("F FIN");
        lblFechaFin.setDisplayedMnemonic('a');
        gbc.gridx = 6;
        pnlFiltro.add(lblFechaFin, gbc);

        dcFechaFin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaFin.getJCalendar().addFocusListener(this);
        dcFechaFin.getJCalendar().addKeyListener(this);
        dcFechaFin.getCalendarButton().addActionListener(this);
        dcFechaFin.addKeyListener(this);
        dcFechaFin.addFocusListener(this);
        ((JTextField) dcFechaFin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechaFin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        gbc.gridx = 7;
        pnlFiltro.add(dcFechaFin, gbc);

        return pnlFiltro;
    }

    protected void loadUnidadMedida() {
    }

    protected void loadTamano() {
    }

    protected void loadLocalidad(String xcodEmpres) {
    }

    protected void loadPuntoVenta(String xcodLocalidad) {
    }

    public void loadAlmacen(String xcodPuntoventa) {
    }

    public void loadFamilia() {
    }

    public void loadSubFamilia(String xcodfamilia) {
    }

    public void loadMarca() {
    }

    protected void regularizarStock() {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtIdItem && txtIdItem.getText().trim().length() > 0) {
            if (!Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
                String serie = "000000" + txtIdItem.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 6, serie.length());
                txtIdItem.setText(nuevaserie);
            }
            this.filtrarGeneral();
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (e.getSource().equals(btnRecalculaStock)) {
            this.regularizarStock();
        }

        if (e.getSource() == dcFechaFin.getCalendarButton()) {
            Calendar inicioCal = Calendar.getInstance();
            inicioCal.set(Integer.parseInt(frm.getAnio()), 0, 1, 0, 0);
            Calendar finCal = Calendar.getInstance();
            finCal.set(Integer.parseInt(frm.getAnio()), 11, 31, 23, 59);
            dcFechaFin.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
        }

        if (cboFamilia == e.getSource()) {
            if (cboFamilia.getItemCount() > 0) {
                if (cboFamilia.getSelectedIndex() == 0) {
                    cboSubFamilia.removeAllItems();
                    cboSubFamilia.setEnabled(false);
                } else {
                    cboSubFamilia.setEnabled(true);
                    loadSubFamilia(xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia());
                }
                this.filtrarGeneral();
            }
        }

        if (cboSubFamilia == e.getSource()) {
            this.filtrarGeneral();
        }
        if (cboMarca == e.getSource()) {
            this.filtrarGeneral();
        }
        if (cboUm == e.getSource()) {
            this.filtrarGeneral();
        }
        if (cboTamano == e.getSource()) {
            this.filtrarGeneral();
        }
        if (cboAlmacen == e.getSource()) {
            if (tabb.getSelectedIndex() == 0) {
                filtrarStockHistorico();
            }
        }
        if (cboMonto == e.getSource()) {
            if (tabb.getSelectedIndex() == 0) {
                filtrarStockHistorico();
            }
        }

        if (cboLocalidad == e.getSource()) {
            if (cboLocalidad.getItemCount() > 0) {
                if (cboLocalidad.getSelectedIndex() == 0) {
                    cboPuntoVenta.removeAllItems();
                    cboAlmacen.removeAllItems();
                } else {
                    loadPuntoVenta(xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cboPuntoVenta == e.getSource()) {
            if (cboPuntoVenta.getItemCount() > 0) {
                if (cboPuntoVenta.getSelectedIndex() == 0) {
                    cboAlmacen.removeAllItems();
                    cboAlmacen.setEnabled(false);
                } else {
                    cboAlmacen.setEnabled(true);
                    loadAlmacen(xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta());
                }
                if (tabb.getSelectedIndex() == 0) {
                    filtrarStockHistorico();
                }
            }
        }

        if (e.getSource() == btnGenerarReporte) {
            generarReporte(false);
        }

        if (e.getSource().equals(btnExportarExcel)) {
            this.exportarExcel();
        }

        if (e.getSource() == btnSalir) {
            dispose();
            doDefaultCloseAction();
        }

        if (e.getSource() == btnKardexFisico) {
            if ((tbl_inventario2.getSelectedRow() >= 0) || (tbl_inventario2.getSelectedRow() >= 0)) {
                showKardexFisico();
            }
        }
        if (e.getSource().equals(btnDetalle)) {
            if (tabb.getSelectedIndex() == 3) {
                showDetalleLote();
            } else if (tabb.getSelectedIndex() == 4) {
                showDetalleReserva();
            }            
        }

        if (e.getSource() == btnBuscar) {
            if (tabb.getSelectedIndex() == 0) {
                cargarTabla();
            } else if (tabb.getSelectedIndex() == 1) {
                cargarItemAlmacenes();
            } else if (tabb.getSelectedIndex() == 2) {
                cargarItemLaboratorio();
            } else if (tabb.getSelectedIndex() == 3) {
                cargarItemLote();
            } else if (tabb.getSelectedIndex() == 4) {
                cargarItemLoteReserva();
            }
        }

        if (e.getSource() == btnNuevo) {
            limpiarFiltro();
        }
    }

    protected void exportarExcel() {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    protected void generarReporte(boolean flag) {
    }

    protected String getParametro() {
        String parametro = " SELECT "
                + "S.ID_ITEM "
                + ",S.QTY_FISICA "
                + ",S.QTY_COMPROMETIDA "
                + ",S.QTY_RESERVADA "
                + ",S.QTY_TRANSITO "
                + ",S.ID_EMPRESA "
                + ",S.ID_LOCALIDAD "
                + ",S.ID_ALMACEN "
                + ",A.ID_PUNTO_VENTA "
                + ",A.DESCRIPCION AS ALMACEN "
                + ",MA.DESCRIPCION AS MARCA "
                + ",F.DESCRIPCION AS FAMILIA "
                + ",NVL(TRIM(U.ABREV),' ') AS UNIDAD_MEDIDA "
                + ",I.ID_ALTERNO "
                + ",I.DESCRIPCION AS PRODUCTO "
                + ",I.ID_FAMILIA "
                + ",I.ID_SUB_FAMILIA"
                + ",I.ID_MARCA "
                + " ,I.UM_VENTA "
                + " ,NVL(UP.CANTIDADHISTORICA,0) AS CANTIDADHISTORICA  "
                + "FROM STOCK S  "
                + "LEFT JOIN ALMACEN A ON S.ID_ALMACEN = A.ID_ALMACEN  "
                + "LEFT JOIN ITEM I ON S.ID_ITEM = I.ID_ITEM  "
                + "LEFT JOIN MARCA MA ON I.ID_MARCA = MA.ID_MARCA   "
                + "LEFT JOIN FAMILIA F ON I.ID_FAMILIA = F.ID_FAMILIA   "
                + "LEFT JOIN UNIDAD_MEDIDA U ON S.ID_UM = U.ID_UM "
                + " LEFT JOIN ( "
                + " SELECT MD.ID_ALMACEN AS ALMACEN "
                + " ,MD.ID_ITEM AS ITEM,SUM(CASE WHEN MD.TIPO = 'E' THEN MD.CANTIDAD ELSE -1*MD.CANTIDAD END) AS CANTIDADHISTORICA "
                + " FROM MOV_INVENTARIO_DET MD "
                + " LEFT JOIN MOV_INVENTARIO_CAB MC ON MD.ID_MOVIMIENTO = MC.ID_MOVIMIENTO "
                + " WHERE MC.\"_ESTADO\" = 'A' ";
        parametro += " AND MD.\"_ESTADO\" = 'A' "
                + " AND MC.ID_ESTADO <> '001' "
                + " GROUP BY MD.ID_ALMACEN, MD.ID_ITEM "
                + " ) UP ON S.ID_ALMACEN = UP.ALMACEN AND S.ID_ITEM = UP.ITEM "
                + "WHERE 1 = 1 AND S.\"_ESTADO\" = 'A' AND I.\"_ESTADO\" = 'A'  ";

        parametro = parametro + " AND S.ID_EMPRESA = \'" + usuario.getCodempresa() + "\' ";

        if (cboLocalidad.getSelectedIndex() > 0) {
            parametro = parametro + " AND S.ID_LOCALIDAD = \'" + xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad() + "\' ";
        }

        if (cboPuntoVenta.getSelectedIndex() > 0) {
            parametro = parametro + " AND A.ID_PUNTO_VENTA = \'" + xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta() + "\' ";
        }

        if (cboAlmacen.getSelectedIndex() > 0) {
            parametro = parametro + " AND A.ID_ALMACEN = \'" + xAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen() + "\' ";
        }

        if (txtIdItem.getText().trim().length() > 0) {
            parametro = parametro + " AND I.ID_ITEM LIKE \'%" + txtIdItem.getText().trim() + "%\' ";
        }

        if (txtDescripcionItem.getText().trim().length() > 0) {
            parametro = parametro + " AND I.DESCRIPCION LIKE \'%" + txtDescripcionItem.getText().trim() + "%\' ";
        }

        if (cboFamilia.getSelectedIndex() > 0) {
            parametro = parametro + " AND I.ID_FAMILIA = \'" + xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + "\' ";
        }

        if (cboSubFamilia.getSelectedIndex() > 0) {
            parametro = parametro + " AND I.ID_SUB_FAMILIA = \'" + xSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + "\' ";
        }

        if (cboMarca.getSelectedIndex() > 0) {
            parametro = parametro + " AND I.ID_MARCA = \'" + xMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + "\' ";
        }

        parametro += " ORDER BY I.DESCRIPCION";

        return parametro;
    }

    protected String getIdPuntoVenta() {
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            return xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta();
        }
        return "";
    }

    protected String getIdAlmacen() {
        if (cboAlmacen.getSelectedIndex() > 0) {
            return xAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen();
        }
        return "";
    }

    public void cargarItemAlmacenes() {
    }

    protected void cargarTabla() {
    }

    protected String getIdLocalidad() {
        if (cboLocalidad.getSelectedIndex() > 0) {
            return xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad();
        }
        return "";
    }

    protected void cargarItemLaboratorio() {
    }

    protected void cargarItemLote() {
    }
    
    protected void cargarItemLoteReserva() {
    }

    public void cargarLocalidad(String xcodiLocalidad) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
    }

    protected void filtrarStockItemAlmacen() {
    }

    protected void filtrarStockHistorico() {
    }

    protected void filtrarStockLaboratorio() {
    }

    protected void filtrarStockLote() {
    }
    
    protected void filtrarStockLoteReserva() {
    }

    protected RowFilter getFilterStock() {
        List filters = new ArrayList();
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcionItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcionItem.getText().trim() + ".*", 1));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 2));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 4));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 6));
        }
        if (cboUm.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xUm.get(cboUm.getSelectedIndex() - 1).getIdUm() + ".*", 8));
        }
        if (cboTamano.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xtamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() + ".*", 10));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;

    }

    protected RowFilter getFilterStockHist() {
        List filters = new ArrayList();
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcionItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcionItem.getText().trim() + ".*", 3));
        }
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 15));
        }
        if (cboAlmacen.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen() + ".*", 1));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 4));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 6));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 8));
        }
        if (cboUm.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xUm.get(cboUm.getSelectedIndex() - 1).getIdUm() + ".*", 10));
        }
        if (cboTamano.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xtamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() + ".*", 12));
        }
        if (txtMonto.getText().trim().length() > 0) {
            BigDecimal saldo = new BigDecimal(txtMonto.getText().trim());
            if (cboMonto.getSelectedIndex() == 0) {
                filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.EQUAL, saldo, 14));
            } else if (cboMonto.getSelectedIndex() == 1) {
                filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.NOT_EQUAL, saldo, 14));
            } else if (cboMonto.getSelectedIndex() == 2) {
                filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.BEFORE, saldo, 14));
            } else if (cboMonto.getSelectedIndex() == 3) {
            } else if (cboMonto.getSelectedIndex() == 4) {
                filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.AFTER, saldo, 14));
            } else if (cboMonto.getSelectedIndex() == 5) {
            }
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;

    }

    protected RowFilter getFilterStockLaboratorio() {
        List filters = new ArrayList();
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcionItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcionItem.getText().trim() + ".*", 3));
        }
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 15));
        }
        if (cboAlmacen.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen() + ".*", 1));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 4));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 6));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 8));
        }
        if (cboUm.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xUm.get(cboUm.getSelectedIndex() - 1).getIdUm() + ".*", 10));
        }
        if (cboTamano.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xtamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() + ".*", 12));
        }
        if (txtMonto.getText().trim().length() > 0) {
            BigDecimal saldo = new BigDecimal(txtMonto.getText().trim());
            switch (cboMonto.getSelectedIndex()) {
                case 0:
                    filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.EQUAL, saldo, 14));
                    break;
                case 1:
                    filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.NOT_EQUAL, saldo, 14));
                    break;
                case 2:
                    filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.BEFORE, saldo, 14));
                    break;
                case 3:
                    break;
                case 4:
                    filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.AFTER, saldo, 14));
                    break;
                case 5:
                    break;
                default:
                    break;
            }
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;

    }
    
    protected RowFilter getFilterStockLaboratorioReserva() {
        List filters = new ArrayList();
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcionItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcionItem.getText().trim() + ".*", 3));
        }
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 17));
        }
        if (cboAlmacen.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen() + ".*", 1));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 4));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 6));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 8));
        }
        if (cboUm.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xUm.get(cboUm.getSelectedIndex() - 1).getIdUm() + ".*", 10));
        }
        if (cboTamano.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xtamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() + ".*", 12));
        }
        if (txtMonto.getText().trim().length() > 0) {
            BigDecimal saldo = new BigDecimal(txtMonto.getText().trim());
            switch (cboMonto.getSelectedIndex()) {
                case 0:
                    filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.EQUAL, saldo, 14));
                    break;
                case 1:
                    filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.NOT_EQUAL, saldo, 14));
                    break;
                case 2:
                    filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.BEFORE, saldo, 14));
                    break;
                case 3:
                    break;
                case 4:
                    filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.AFTER, saldo, 14));
                    break;
                case 5:
                    break;
                default:
                    break;
            }
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;

    }

    public void cargarDatos() {
    }

    protected BigDecimal getValList(String id_item, String id_almacen) throws Exception {
        try {
            for (int i = 0; i < listPrueba.size(); i++) {
                StockAlmacen beanStockAlmacen = (StockAlmacen) listPrueba.get(i);
                if (beanStockAlmacen.getId_item().equals(id_item) && beanStockAlmacen.getId_almacen().equals(id_almacen)) {
                    return beanStockAlmacen.getSaldo();
                }
            }
            return new BigDecimal(BigInteger.ZERO);
        } catch (Exception e) {
            throw e;
        }
    }

    public void limpiarFiltro() {
    }

    protected void showKardexFisico() {
    }

    protected void showDetalleLote() {
    }
    
    protected void showDetalleReserva() {
    }

    protected StockLaboratorio getStockModel(boolean isNumeroLote) {
        if (isNumeroLote) {
            return this.getStockLote();
        }
        return this.getStockLaboratorio();
    }
    
    protected StockLaboratorio getStockReservaModel() {
        return this.getStockLaboratorioReserva();
    }

    protected StockLaboratorio getStockLaboratorio() {
        if (tblStockLaboratorio.getSelectedRow() < 0) {
            return null;
        }
        return mdlStockLaboratorio.getStockLaboratorio(tblStockLaboratorio.convertRowIndexToModel(tblStockLaboratorio.getSelectedRow()));
    }
    
    
    protected StockLaboratorio getStockLaboratorioReserva() {
        if (tblStockLoteReserva.getSelectedRow() < 0) {
            return null;
        }
        return mdlStockLoteReserva.getStockLaboratorio(tblStockLoteReserva.convertRowIndexToModel(tblStockLoteReserva.getSelectedRow()));
    }
    
    protected StockLaboratorio getStockLote() {
        if (tblStockLote.getSelectedRow() < 0) {
            return null;
        }
        return mdlStockLote.getStockLaboratorio(tblStockLote.convertRowIndexToModel(tblStockLote.getSelectedRow()));
    }

    protected void changeTab() {
        switch (tabb.getSelectedIndex()) {
            case 0:
                this.showHideElements(true, true, false);
                break;
            case 1:
                this.showHideElements(false, false, false);
                break;
            case 2:
            case 3:
            case 4:
                this.showHideElements(true, false, true);
                break;
            default:
                break;
        }
    }

    protected void showHideElements(boolean swMonto, boolean swBoton, boolean swDetalle) {
    }

    @Override
    public void selectInternalFrame() {
        try {
            setSelected(true);
        } catch (PropertyVetoException e) {
        }
    }

    protected void filtrarGeneral() {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if (e.getSource() == txtDescripcionItem || e.getSource() == txtIdItem) {
                this.filtrarGeneral();
            }
            if (e.getSource() == txtMonto) {
                if (tabb.getSelectedIndex() == 0) {
                    filtrarStockHistorico();
                }
            }
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    public void controlClose() {
    }

    @Override
    public void stateChanged(ChangeEvent e) {
        if (e.getSource() == tabb) {
            changeTab();
        }
    }
}
