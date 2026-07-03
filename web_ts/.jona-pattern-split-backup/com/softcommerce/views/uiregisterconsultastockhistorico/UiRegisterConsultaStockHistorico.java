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
    private JComboBox cboMarca;
    private List<BeanMarca> xMarca;
    private JComboBox cboMonto;
    private JComboBox cboFamilia;
    private List<BeanFamilia> xFamilia;
    private JComboBox cboSubFamilia;
    private List<BeanSubFamilia> xSubFamilia;
    private JComboBox cboAlmacen;
    private List<Almacen> xAlmacen;
    private JComboBox cboPuntoVenta;
    private List<PuntoVenta> xPuntoVenta;
    private JComboBox cboLocalidad;
    private List<Localidad> xLocalidad;
    private JTextField txtDescripcionItem;
    private JTextField txtIdItem;
    private JTextField txtMonto;
    private JButton btnNuevo;
    private JButton btnBuscar;
    private JButton btnRecalculaStock;
    private JButton btnKardexFisico;
    private JButton btnExportarExcel;
    private JButton btnGenerarReporte;
    private JButton btnDetalle;
    private JButton btnSalir;
    private StockHistoricoTableModel mdl_stock2;
    private StockLaboratorioTableModel mdlStockLaboratorio;
    private StockLaboratorioTableModel mdlStockLote;
    private StockLaboratorioReservaTableModel mdlStockLoteReserva;
    private StockItemAlmacenTableModel modelStock;
    private TableRowSorter<StockItemAlmacenTableModel> modeloOrdenadoStock;
    private TableRowSorter<StockHistoricoTableModel> modeloOrdenadoStockHist;
    private TableRowSorter<StockLaboratorioTableModel> modeloOrdenadoStockLab;
    private TableRowSorter<StockLaboratorioTableModel> modeloOrdenadoStockLote;
    private TableRowSorter<StockLaboratorioReservaTableModel> modeloOrdenadoStockLoteReserva;
    private CTable tbl_inventario2;
    private CTable tblStockLaboratorio;
    private JTable tblStockLote;
    private JTable tblStockLoteReserva;
    private JTable tableStock;
    private final Main frm;
    private Gif gif;
    private Usuario usuario = new Usuario();
    private JDateChooser dcFechaFin;
    private List<StockAlmacen> listPrueba;
    private JTabbedPane tabb;
    private JComboBox cboUm;
    private List<BeanUnidadMedida> xUm;
    private List<BeanTamano> xtamano;
    private JComboBox cboTamano;
    private final Logger logger = Logger.getLogger(UiRegisterConsultaStockHistorico.class);

    public UiRegisterConsultaStockHistorico(String title, Main frm, JDesktopPane jdp, Usuario usuario) {
        super(title);
        this.frm = frm;
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
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

    private JPanel getpnlFiltro() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        pnl.add(getPnlFiltrosLeft(), BorderLayout.WEST);
        return pnl;
    }

    private JPanel getPnlCenter() {
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

    private JPanel getPnlCenterStock() {
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

    private JPanel getPnlCenterStockLaboratorio() {
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

    private JPanel getPnlCenterStockLote() {
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
    
    private JPanel getPnlCenterStockLoteReserva() {
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

    private JPanel getPnlCenterStockAlmacenItem() {
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

    private JPanel getPnlOpciones() {
        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(245, 245, 245));
        btnSalir = new JButton("Salir", gif.CANCEL16);
        btnSalir.setMnemonic('C');
        btnSalir.setHorizontalAlignment(SwingConstants.LEFT);
        btnSalir.setIconTextGap(10);
        btnSalir.addActionListener(this);
        btnSalir.setFont(new Font("Verdana", 1, 10));
        btnSalir.setOpaque(false);
        btnSalir.addKeyListener(this);
        btnSalir.setFocusPainted(false);
        pnl.add(btnSalir);

        btnExportarExcel = new JButton("Exportar a excel", gif.EXCEL);
        btnExportarExcel.setMnemonic('B');
        btnExportarExcel.setHorizontalAlignment(SwingConstants.LEFT);
        btnExportarExcel.setIconTextGap(10);
        btnExportarExcel.addActionListener(this);
        btnExportarExcel.setFont(new Font("Verdana", 1, 10));
        btnExportarExcel.setOpaque(false);
        btnExportarExcel.addKeyListener(this);
        btnExportarExcel.setFocusPainted(false);
        pnl.add(btnExportarExcel);

        btnGenerarReporte = new JButton("Generar Reporte", gif.REPORT16);
        btnGenerarReporte.setMnemonic('B');
        btnGenerarReporte.setHorizontalAlignment(SwingConstants.LEFT);
        btnGenerarReporte.setIconTextGap(10);
        btnGenerarReporte.addActionListener(this);
        btnGenerarReporte.setFont(new Font("Verdana", 1, 10));
        btnGenerarReporte.setOpaque(false);
        btnGenerarReporte.addKeyListener(this);
        btnGenerarReporte.setFocusPainted(false);
        pnl.add(btnGenerarReporte);

        btnDetalle = new JButton("Detalle", gif.REPORT16);
        btnDetalle.setMnemonic('D');
        btnDetalle.setHorizontalAlignment(SwingConstants.LEFT);
        btnDetalle.setIconTextGap(10);
        btnDetalle.addActionListener(this);
        btnDetalle.setFont(new Font("Verdana", 1, 10));
        btnDetalle.setOpaque(false);
        btnDetalle.addKeyListener(this);
        btnDetalle.setFocusPainted(false);
        pnl.add(btnDetalle);

        btnKardexFisico = new JButton("Ver Kardex", gif.FOLDER_FILES);
        btnKardexFisico.setMnemonic('B');
        btnKardexFisico.setHorizontalAlignment(SwingConstants.LEFT);
        btnKardexFisico.setIconTextGap(10);
        btnKardexFisico.addActionListener(this);
        btnKardexFisico.setFont(new Font("Verdana", 1, 10));
        btnKardexFisico.setOpaque(false);
        btnKardexFisico.addKeyListener(this);
        btnKardexFisico.setFocusPainted(false);
        pnl.add(btnKardexFisico);

        btnRecalculaStock = new JButton("Recalcula Stock", gif.REFRESH16);
        btnRecalculaStock.setMnemonic('R');
        btnRecalculaStock.setHorizontalAlignment(SwingConstants.LEFT);
        btnRecalculaStock.setIconTextGap(10);
        btnRecalculaStock.addActionListener(this);
        btnRecalculaStock.setFont(new Font("Verdana", 1, 10));
        btnRecalculaStock.setOpaque(false);
        btnRecalculaStock.addKeyListener(this);
        btnRecalculaStock.setFocusPainted(false);
        pnl.add(btnRecalculaStock);

        return pnl;
    }

    private JPanel getPnlFiltrosLeft() {
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

    private void loadUnidadMedida() {
        try {
            RnUnidadMedida reglaUnidadMedida = new RnUnidadMedida(path);
            if (xUm != null) {
                xUm.clear();
            } else {
                xUm = new ArrayList<BeanUnidadMedida>();
            }

            xUm.addAll(reglaUnidadMedida.listar("", "", "", usuario.getCodempresa()));

            cboUm.removeAllItems();
            cboUm.addItem("--- Seleccione U.M. ---");

            for (Integer i = 0; i < xUm.size(); i++) {
                cboUm.addItem(xUm.get(i).getAbreviatura());
            }

            cboUm.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadTamano() {
        try {
            RnTamano regla_Tamano = new RnTamano(path);

            if (xtamano != null) {
                xtamano.clear();
            } else {
                xtamano = new ArrayList<BeanTamano>();
            }

            xtamano.addAll(regla_Tamano.listarGeneral(usuario.getCodempresa()));

            cboTamano.removeAllItems();
            cboTamano.addItem("--- Seleccione un Tamaño ---");

            for (int i = 0; i < xtamano.size(); i++) {
                cboTamano.addItem(xtamano.get(i).getDescripcion());
            }

            cboTamano.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (xLocalidad != null) {
                xLocalidad.clear();
            } else {
                xLocalidad = new ArrayList<Localidad>(10);
            }

            xLocalidad.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cboLocalidad.removeAllItems();
            cboLocalidad.addItem("--- Seleccione una Localidad ---");

            for (int i = 0; i < xLocalidad.size(); i++) {
                cboLocalidad.addItem(xLocalidad.get(i).getDescripcion());
            }

            cboLocalidad.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xPuntoVenta != null) {
                xPuntoVenta.clear();
            } else {
                xPuntoVenta = new ArrayList<PuntoVenta>(10);
            }

            xPuntoVenta.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", "A"));

            cboPuntoVenta.removeAllItems();
            cboPuntoVenta.addItem("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xPuntoVenta.size(); i++) {
                cboPuntoVenta.addItem(xPuntoVenta.get(i).getDescripcion_puntoventa());
            }

            cboPuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadAlmacen(String xcodPuntoventa) {
        try {
            RnAlmacen regla_Almacen = new RnAlmacen(path);

            if (xAlmacen != null) {
                xAlmacen.clear();
            } else {
                xAlmacen = new ArrayList<Almacen>(10);
            }

            xAlmacen.addAll(regla_Almacen.listar("", "", xcodPuntoventa));

            cboAlmacen.removeAllItems();
            cboAlmacen.addItem("--- Seleccione un Almacen ---");

            for (int i = 0; i < xAlmacen.size(); i++) {
                cboAlmacen.addItem(xAlmacen.get(i).getDescripcion());
            }

            cboAlmacen.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadFamilia() {
        try {
            RnFamilia regla_Familia = new RnFamilia(path);

            if (xFamilia != null) {
                xFamilia.clear();
            } else {
                xFamilia = new ArrayList<BeanFamilia>();
            }
            List listFamilia = regla_Familia.listarFamiliaItem("S");
            xFamilia.addAll(listFamilia);

            cboFamilia.removeAllItems();
            cboFamilia.addItem("--- Seleccione una Familia ---");

            for (int i = 0; i < xFamilia.size(); i++) {
                cboFamilia.addItem(xFamilia.get(i).getDescripcion());
            }

            cboFamilia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadSubFamilia(String xcodfamilia) {
        try {
            BeanSubFamilia s = new BeanSubFamilia();
            BeanFamilia beanFamilia = new BeanFamilia();
            beanFamilia.setIdFamilia(xcodfamilia);
            s.setBeanFamilia(beanFamilia);

            RnSubFamilia regla_SubFamilia = new RnSubFamilia(path);

            if (xSubFamilia != null) {
                xSubFamilia.clear();
            } else {
                xSubFamilia = new ArrayList<BeanSubFamilia>(10);
            }

            xSubFamilia.addAll(regla_SubFamilia.listar(s));

            cboSubFamilia.removeAllItems();
            cboSubFamilia.addItem("--- Seleccione una SubFamilia ---");

            for (int i = 0; i < xSubFamilia.size(); i++) {
                cboSubFamilia.addItem(xSubFamilia.get(i).getDescripcion());
            }

            cboSubFamilia.setSelectedIndex(0);
        } catch (Exception e) {
        }
    }

    public void loadMarca() {
        try {
            RnMarca regla_Marca = new RnMarca(path);

            if (xMarca != null) {
                xMarca.clear();
            } else {
                xMarca = new ArrayList<BeanMarca>(10);
            }

            xMarca.addAll(regla_Marca.listarGeneral(usuario.getCodempresa()));

            cboMarca.removeAllItems();
            cboMarca.addItem("--- Seleccione una Marca ---");

            for (int i = 0; i < xMarca.size(); i++) {
                cboMarca.addItem(xMarca.get(i).getDescripcion());
            }

            cboMarca.setSelectedIndex(0);
        } catch (Exception e) {
        }
    }

    private void regularizarStock() {
        try {
            LogicStock logic = new LogicStock(this.path);
            logic.regularizarStock(Main.anio);
            System.out.println(Main.anio);
            JOptionPane.showMessageDialog(this, "Recalculo generado correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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

    private void exportarExcel() {
        try {
            File archivo = File.createTempFile("StockHistorico" + (new Date(Main.fechaActualServer.getTime())).getTime(), ".xlsx");
            archivo.deleteOnExit();
            ExportarToExcel export;
            Map parameters = new HashMap();
            parameters.put(0, usuario.getDescriempresa());
            parameters.put(1, "Ruc: " + usuario.getRuc());
            if (tabb.getSelectedIndex() == 0) {
                parameters.put(2, "Reporte Stock");
                export = new ExportarToExcel(archivo, tbl_inventario2, parameters);
            } else if (tabb.getSelectedIndex() == 1) {
                parameters.put(2, "Reporte Stock Almacenes");
                export = new ExportarToExcel(archivo, tableStock, parameters);
            } else if (tabb.getSelectedIndex() == 2) {
                parameters.put(2, "Reporte Stock Laboratorio");
                export = new ExportarToExcel(archivo, tblStockLaboratorio, parameters);
            } else {
                parameters.put(2, "Reporte Stock Lote");
                export = new ExportarToExcel(archivo, tblStockLote, parameters);
            }

            if (export.exportarJTableToExcelParam()) {
                JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
            }
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(null, ex.getMessage());
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    private void generarReporte(boolean flag) {
        try {
            Reporte report = new Reporte(path);
            report.generarReporte("KardexHistorico", getParametro(), "", "", "", "", "", true, flag, "Reporte Kardex Histórico");
        } catch (Exception ex) {
        }
    }

    private String getParametro() {
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

    private String getIdPuntoVenta() {
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            return xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta();
        }
        return "";
    }

    private String getIdAlmacen() {
        if (cboAlmacen.getSelectedIndex() > 0) {
            return xAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen();
        }
        return "";
    }

    public void cargarItemAlmacenes() {
        try {
            tableStock.setRowSorter(null);
            //tableStock.setModel(null);
            modelStock = new StockItemAlmacenTableModel();
            modeloOrdenadoStock = new TableRowSorter(modelStock);
            tableStock.setRowSorter(modeloOrdenadoStock);
            RnStock logicStock = new RnStock(path);
            String idPuntoVenta = this.getIdPuntoVenta();
            String idAlmacen = this.getIdAlmacen();
            Map<Integer, ArrayList> mapPrueba = logicStock.listStockItemAlmacenes(new java.sql.Date(dcFechaFin.getDate().getTime()), idPuntoVenta, idAlmacen);
            listPrueba = mapPrueba.get(1);
            List<StockAlmacenItem> listPruebaAlmacen = mapPrueba.get(2);
            Map<String, StockAlmacen> mapAlmacen = new HashMap<String, StockAlmacen>();
            HashMap<String, BigDecimal> mapValor = new HashMap<String, BigDecimal>();
            for (int i = 0; i < listPrueba.size(); i++) {
                StockAlmacen beanStockAlmacen = (StockAlmacen) listPrueba.get(i);
                mapValor.put(beanStockAlmacen.getId_item() + "-" + beanStockAlmacen.getId_almacen(), beanStockAlmacen.getSaldo());
                mapAlmacen.put(beanStockAlmacen.getId_item(), beanStockAlmacen);
            }
            modelStock.agregarHashMap(mapValor);
            List<StockAlmacen> listaAlmacen = new ArrayList<StockAlmacen>();
            Iterator it = mapAlmacen.keySet().iterator();
            BigDecimal sum;
            BigDecimal saldo;
            List<StockAlmacenItem> listItemAlmacen;
            while (it.hasNext()) {
                listItemAlmacen = new ArrayList<StockAlmacenItem>();
                StockAlmacen beanStockAlmacen = (StockAlmacen) mapAlmacen.get(it.next());
                sum = new BigDecimal(BigInteger.ZERO);
                for (int j = 0; j < listPruebaAlmacen.size(); j++) {
                    StockAlmacenItem beanStockAlmacenItem = (StockAlmacenItem) listPruebaAlmacen.get(j);
                    saldo = getValList(beanStockAlmacen.getId_item(), beanStockAlmacenItem.getId_almacen());
                    beanStockAlmacenItem.setSaldo(saldo);
                    listItemAlmacen.add(beanStockAlmacenItem);
                    sum = sum.add(saldo);
                }
                beanStockAlmacen.setListStockAlmacenItem(listItemAlmacen);
                beanStockAlmacen.setSaldo(sum);
                listaAlmacen.add(beanStockAlmacen);
            }
            modelStock.agregarListStockAlmacenItem(listPruebaAlmacen);
            modelStock.agregarListStockAlmacen(listaAlmacen);
            tableStock.setModel(modelStock);
            List<Integer> listColumns = new ArrayList();
            listColumns.add(2);
            listColumns.add(4);
            listColumns.add(6);
            listColumns.add(8);
            listColumns.add(10);
            CTableFx.minimizeWidthColumn(tableStock, listColumns);
            for (int i = 12; i <= 12 + listPruebaAlmacen.size(); i++) {
                CTableFx.alignRightColumnTable(tableStock, i);
            }
            filtrarStockItemAlmacen();
            //tabb.setSelectedIndex(1);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTabla() {
        try {
            RnStock regla = new RnStock(path);
            String id_localidad;
            id_localidad = cboLocalidad.getSelectedIndex() > 0 ? xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad() : "";
            List<StockAlmacen> listStock = regla.listStock(new java.sql.Date(dcFechaFin.getDate().getTime()), id_localidad);
            mdl_stock2.agregarListStockAlmacen(listStock);
            tbl_inventario2.setAllColumnPreferredWidth();
            filtrarStockHistorico();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private String getIdLocalidad() {
        if (cboLocalidad.getSelectedIndex() > 0) {
            return xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad();
        }
        return "";
    }

    private void cargarItemLaboratorio() {
        try {
            RnStock regla = new RnStock(path);
            String idLocalidad = this.getIdLocalidad();
            modeloOrdenadoStockLab.setRowFilter(null);
            List<StockLaboratorio> listStock = regla.listStockLaboratorio(new java.sql.Date(dcFechaFin.getDate().getTime()), idLocalidad);
            mdlStockLaboratorio.agregarListStockLaboratorio(listStock);
            tblStockLaboratorio.setAllColumnPreferredWidth();
            filtrarStockLaboratorio();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarItemLote() {
        try {
            RnStock regla = new RnStock(path);
            String idLocalidad = this.getIdLocalidad();
            modeloOrdenadoStockLote.setRowFilter(null);
            List<StockLaboratorio> listStock = regla.listStockLote(new java.sql.Date(dcFechaFin.getDate().getTime()), idLocalidad);
            mdlStockLote.agregarListStockLaboratorio(listStock);
            CTableFx.setAllColumnPreferredWidth(tblStockLote);
            filtrarStockLote();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }
    
    private void cargarItemLoteReserva() {
        try {
            RnStock regla = new RnStock(path);
            String idLocalidad = this.getIdLocalidad();
            modeloOrdenadoStockLoteReserva.setRowFilter(null);
            List<StockLaboratorio> listStock = regla.listStockLoteReserva(new java.sql.Date(dcFechaFin.getDate().getTime()), idLocalidad);
            mdlStockLoteReserva.agregarListStockLaboratorio(listStock);
            CTableFx.setAllColumnPreferredWidth(tblStockLoteReserva);
            filtrarStockLoteReserva();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void cargarLocalidad(String xcodiLocalidad) {
        if (xLocalidad != null) {
            for (int i = 0; i < xLocalidad.size(); i++) {
                if (xLocalidad.get(i).getId_localidad().equals(xcodiLocalidad)) {
                    cboLocalidad.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
        if (xPuntoVenta != null && !codPuntoVenta.isEmpty()) {
            for (int i = 0; i < xPuntoVenta.size(); i++) {
                if (xPuntoVenta.get(i).getId_punto_venta().equals(codPuntoVenta)) {
                    cboPuntoVenta.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    private void filtrarStockItemAlmacen() {
        modeloOrdenadoStock.setRowFilter(getFilterStock());
        CTableFx.setAllColumnPreferredWidth(tableStock);
    }

    private void filtrarStockHistorico() {
        modeloOrdenadoStockHist.setRowFilter(getFilterStockHist());
        tbl_inventario2.setAllColumnPreferredWidth();
    }

    private void filtrarStockLaboratorio() {
        modeloOrdenadoStockLab.setRowFilter(getFilterStockLaboratorio());
        tblStockLaboratorio.setAllColumnPreferredWidth();
    }

    private void filtrarStockLote() {
        modeloOrdenadoStockLote.setRowFilter(getFilterStockLaboratorio());
        CTableFx.setAllColumnPreferredWidth(tblStockLote);
    }
    
    private void filtrarStockLoteReserva() {
        modeloOrdenadoStockLoteReserva.setRowFilter(getFilterStockLaboratorioReserva());
        CTableFx.setAllColumnPreferredWidth(tblStockLoteReserva);
    }

    private RowFilter getFilterStock() {
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

    private RowFilter getFilterStockHist() {
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

    private RowFilter getFilterStockLaboratorio() {
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
    
    private RowFilter getFilterStockLaboratorioReserva() {
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
        loadLocalidad(usuario.getCodempresa());
        loadFamilia();
        loadMarca();
        cargarLocalidad(usuario.getCodlocalidad());
        loadUnidadMedida();
        loadTamano();
        limpiarFiltro();
    }

    private BigDecimal getValList(String id_item, String id_almacen) throws Exception {
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
        cargarPuntoVenta(usuario.getCodpuntoventa());
        if (cboAlmacen.getItemCount() > 1) {
            cboAlmacen.setSelectedIndex(1);
        }
        cboFamilia.setSelectedIndex(0);
        cboMarca.setSelectedIndex(0);
        txtDescripcionItem.setText("");
        cboUm.setSelectedIndex(0);
        cboTamano.setSelectedIndex(0);
        txtIdItem.setText("");
        cboMonto.setSelectedItem(">");
        txtMonto.setText("0.0");

        Calendar inicioCal = Calendar.getInstance();
        inicioCal.set(Integer.parseInt(frm.getAnio()), 0, 1, 0, 0);
        Calendar finCal = Calendar.getInstance();
        finCal.set(Integer.parseInt(frm.getAnio()), 11, 31, 23, 59);
        dcFechaFin.setDate(finCal.getTime());
        dcFechaFin.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
        dcFechaFin.updateUI();
    }

    private void showKardexFisico() {
        RegisterConsultaKardex kardex = new RegisterConsultaKardex(frm, path);
        StockAlmacen stockAlmacen = mdl_stock2.getStockAlmacen(tbl_inventario2.convertRowIndexToModel(tbl_inventario2.getSelectedRow()));
        kardex.showKardex(stockAlmacen.getId_item(), stockAlmacen.getId_almacen());
    }

    private void showDetalleLote() {
        StockLaboratorio stockLaboratorio = this.getStockModel(tabb.getSelectedIndex() == 3);
        if (stockLaboratorio == null) {
            return;
        }
        FormLoteMovimiento formLote = new FormLoteMovimiento(frm, path, stockLaboratorio, dcFechaFin.getDate(),"M");
        formLote.loadData();
        formLote.setVisible(true);
    }
    
    private void showDetalleReserva() {
        StockLaboratorio stockLaboratorio = this.getStockReservaModel();
        if (stockLaboratorio == null) {
            return;
        }
        if(stockLaboratorio.getBeanStockAlmacen().getReserva().compareTo(BigDecimal.ZERO)==0){
            JOptionPane.showMessageDialog(null, "No hay reservas para este lote");
            return;
        }
        FormLoteMovimiento formLote = new FormLoteMovimiento(frm, path, stockLaboratorio, dcFechaFin.getDate(),"R");
        formLote.loadData();
        formLote.setVisible(true);
    }

    private StockLaboratorio getStockModel(boolean isNumeroLote) {
        if (isNumeroLote) {
            return this.getStockLote();
        }
        return this.getStockLaboratorio();
    }
    
    private StockLaboratorio getStockReservaModel() {
        return this.getStockLaboratorioReserva();
    }

    private StockLaboratorio getStockLaboratorio() {
        if (tblStockLaboratorio.getSelectedRow() < 0) {
            return null;
        }
        return mdlStockLaboratorio.getStockLaboratorio(tblStockLaboratorio.convertRowIndexToModel(tblStockLaboratorio.getSelectedRow()));
    }
    
    
    private StockLaboratorio getStockLaboratorioReserva() {
        if (tblStockLoteReserva.getSelectedRow() < 0) {
            return null;
        }
        return mdlStockLoteReserva.getStockLaboratorio(tblStockLoteReserva.convertRowIndexToModel(tblStockLoteReserva.getSelectedRow()));
    }
    
    private StockLaboratorio getStockLote() {
        if (tblStockLote.getSelectedRow() < 0) {
            return null;
        }
        return mdlStockLote.getStockLaboratorio(tblStockLote.convertRowIndexToModel(tblStockLote.getSelectedRow()));
    }

    private void changeTab() {
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

    private void showHideElements(boolean swMonto, boolean swBoton, boolean swDetalle) {
        txtMonto.setEnabled(swMonto);
        cboMonto.setEnabled(swMonto);
        btnGenerarReporte.setVisible(swBoton);
        btnKardexFisico.setVisible(swBoton);
        btnDetalle.setVisible(swDetalle);
    }

    @Override
    public void selectInternalFrame() {
        try {
            setSelected(true);
        } catch (PropertyVetoException e) {
        }
    }

    private void filtrarGeneral() {
        switch (tabb.getSelectedIndex()) {
            case 0:
                filtrarStockHistorico();
                break;
            case 1:
                filtrarStockItemAlmacen();
                break;
            case 2:
                filtrarStockLaboratorio();
                break;
            case 3:
                filtrarStockLote();
                break;
            case 4:
                filtrarStockLoteReserva();
                break;
            default:
                break;
        }
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
