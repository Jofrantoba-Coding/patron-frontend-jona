package com.softcommerce.views.uipnlconsultaventasalida;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanCotizacionCab;
import com.softcommerce.beans.BeanCotizacionDet;
import com.softcommerce.beans.BeanPedidoCab;
import com.softcommerce.beans.BeanPedidoDet;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.Item;
import com.softcommerce.beans.RegContaCab;
import com.softcommerce.beans.RegContaItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicVentas;
import com.softcommerce.reglasnegocio.RnCotizacionCab;
import com.softcommerce.reglasnegocio.RnPedidoCab;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExportarToExcel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;

public class UiPnlConsultaVentaSalida extends JInternalFrame implements InterUiPnlConsultaVentaSalida, KeyListener, FocusListener, ActionListener {

    protected java.net.URL path;
    protected Main frmMain;
    protected Usuario usuario;
    protected Gif gif;
    protected JComboBox cboTipoDoc;
    protected JComboBox cboTipoDocVenta;
    protected JComboBox cboItem;
    protected JComboBox cboItemDespacho;
    protected JComboBox cboItemDespachoPedido;
    protected JComboBox cboItemDespachoCotizacion;
    protected JComboBox cboItemDevolucion;
    protected JComboBox cboItemNC;
    protected JTextField txtSerie;
    protected JTextField txtPreimpreso;
    protected JTextField txtSerieVenta;
    protected JTextField txtPreimpresoVenta;
    protected JButton btnBuscar;
    protected JButton btnExportarResVta;
    protected JButton btnExportarResPedido;
    protected JButton btnExportarResCotizacion;
    protected JButton btnExportarResDesp;
    protected JButton btnExportarDetDesp;
    protected JButton btnExportarDespacho;
    protected JButton btnExportarDespachoPedido;
    protected JButton btnExportarDespachoCotizacion;
    protected JButton btnExportarDevolucion;
    protected JButton btnExportarNC;
    protected JButton btnBuscarVenta;
    protected CTable tableDoc;
    protected CTable tableDocVenta;
    protected CTable tableDocPedido;
    protected CTable tableDocCotizacion;
    protected CTable tableResumen;
    protected CTable tableResumenVenta;
    protected CTable tableResumenPedido;
    protected CTable tableResumenCotizacion;
    protected CTable tableDetalle;
    protected CTable tableDespacho;
    protected CTable tableDespachoPedido;
    protected CTable tableDespachoCotizacion;
    protected CTable tableDevolucion;
    protected CTable tableNC;
    protected DefaultTableModel modeloDoc;
    protected DefaultTableModel modeloDocVenta;
    protected DefaultTableModel modeloDocPedido;
    protected DefaultTableModel modeloDocCotizacion;
    protected DefaultTableModel modeloResumen;
    protected DefaultTableModel modeloResumenVenta;
    protected DefaultTableModel modeloResumenPedido;
    protected DefaultTableModel modeloResumenCotizacion;
    protected DefaultTableModel modeloDetalle;
    protected DefaultTableModel modeloDespacho;
    protected DefaultTableModel modeloDespachoPedido;
    protected DefaultTableModel modeloDespachoCotizacion;
    protected DefaultTableModel modeloDevolucion;
    protected DefaultTableModel modeloNC;
    protected TableRowSorter modeloOrdenadoDetalle;
    protected TableRowSorter modeloOrdenadoDespacho;
    protected TableRowSorter modeloOrdenadoDespachoPedido;
    protected TableRowSorter modeloOrdenadoDespachoCotizacion;
    protected TableRowSorter modeloOrdenadoDevolucion;
    protected TableRowSorter modeloOrdenadoNC;
    protected JTabbedPane tabbGral;
    protected JTextField txtSeriePedido;
    protected JTextField txtPreimpresoPedido;
    protected JTextField txtSerieCotizacion;
    protected JTextField txtPreimpresoCotizacion;
    protected JButton btnBuscarPedido;
    protected JButton btnBuscarCotizacion;

    public UiPnlConsultaVentaSalida(String title, java.net.URL path, Main frm, Usuario usuario) {
        super(title);
        this.path = path;
        this.frmMain = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    protected void inicialize() {
        gif = new Gif();
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        getContentPane().add(pnlPrincipal);
        tabbGral = new JTabbedPane();
        pnlPrincipal.add(tabbGral, BorderLayout.CENTER);
        tabbGral.add("Ventas", getPnlVenta());
        tabbGral.add("Despacho", getPnlDespacho());
        tabbGral.add("Pedido", getPnlPedido());
        tabbGral.add("Cotizacion", getPnlCotizacion());
        this.loadCombo();
        configurarInternal();
        pack();
    }

    protected void loadCombo() {
    }

    protected void loadTipoDocumento() throws Exception {
    }

    protected JPanel getPnlVenta() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(pnlFilterVenta(), BorderLayout.NORTH);
        pnl.add(pnlTableVenta(), BorderLayout.CENTER);
        pnl.add(pnlTabbVenta(), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlDespacho() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(pnlFilter(), BorderLayout.NORTH);
        pnl.add(pnlTable(), BorderLayout.CENTER);
        pnl.add(pnlTabb(), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlPedido() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlFilterPedido(), BorderLayout.NORTH);
        pnl.add(pnlTablePedido(), BorderLayout.CENTER);
        pnl.add(pnlTabbPedido(), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlFilterPedido() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        JLabel lblDocumento = new JLabel("Documento");
        pnl.add(lblDocumento);
        txtSeriePedido = new JTextField();
        txtSeriePedido.setColumns(5);
        pnl.add(txtSeriePedido);
        txtPreimpresoPedido = new JTextField();
        txtPreimpresoPedido.setColumns(10);
        txtPreimpresoPedido.setDocument(new IntegerDocument(10));
        pnl.add(txtPreimpresoPedido);
        btnBuscarPedido = new JButton("Buscar", gif.SEARCH16);
        pnl.add(btnBuscarPedido);
        return pnl;
    }

    protected JPanel getPnlCotizacion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlFilterCotizacion(), BorderLayout.NORTH);
        pnl.add(pnlTableCotizacion(), BorderLayout.CENTER);
        pnl.add(pnlTabbCotizacion(), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlFilterCotizacion() {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        JLabel lblDocumento = new JLabel("Documento");
        pnl.add(lblDocumento);
        txtSerieCotizacion = new JTextField();
        txtSerieCotizacion.setColumns(5);
        pnl.add(txtSerieCotizacion);
        txtPreimpresoCotizacion = new JTextField();
        txtPreimpresoCotizacion.setColumns(10);
        txtPreimpresoCotizacion.setDocument(new IntegerDocument(10));
        pnl.add(txtPreimpresoCotizacion);
        btnBuscarCotizacion = new JButton("Buscar", gif.SEARCH16);
        pnl.add(btnBuscarCotizacion);
        return pnl;
    }

    protected JPanel pnlFilter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnl.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        JLabel lblTipoDoc = new JLabel("Documento:");
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblTipoDoc, gbc);
        cboTipoDoc = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboTipoDoc, gbc);
        cboTipoDoc.addItem(new ItemObject("09", "GUIA DE REMISION - REMITENTE"));
        cboTipoDoc.addItem(new ItemObject("NS", "ORDEN DE RECOJO"));
        txtSerie = new JTextField();
        txtSerie.setColumns(5);
        gbc.gridx = 2;
        pnlFiltro.add(txtSerie, gbc);
        txtPreimpreso = new JTextField();
        txtPreimpreso.setColumns(10);
        txtPreimpreso.setDocument(new IntegerDocument(10));
        gbc.gridx = 3;
        pnlFiltro.add(txtPreimpreso, gbc);
        btnBuscar = new JButton("Buscar", gif.SEARCH16);
        gbc.gridx = 4;
        pnlFiltro.add(btnBuscar, gbc);
        return pnl;
    }

    protected JPanel pnlFilterVenta() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnl.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        JLabel lblTipoDoc = new JLabel("Documento:");
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblTipoDoc, gbc);
        cboTipoDocVenta = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboTipoDocVenta, gbc);
        txtSerieVenta = new JTextField();
        txtSerieVenta.setColumns(5);
        gbc.gridx = 2;
        pnlFiltro.add(txtSerieVenta, gbc);
        txtPreimpresoVenta = new JTextField();
        txtPreimpresoVenta.setColumns(10);
        txtPreimpresoVenta.setDocument(new IntegerDocument(10));
        gbc.gridx = 3;
        pnlFiltro.add(txtPreimpresoVenta, gbc);
        btnBuscarVenta = new JButton("Buscar", gif.SEARCH16);
        gbc.gridx = 4;
        pnlFiltro.add(btnBuscarVenta, gbc);
        return pnl;
    }

    protected JPanel pnlFilterDetalle() {
        return null;
    }

    protected JPanel pnlFilterDespacho() {
        return null;
    }

    protected JPanel pnlFilterDespachoCotizacion() {
        return null;
    }

    protected JPanel pnlFilterDespachoPedido() {
        return null;
    }

    protected JPanel pnlFilterDevolucion() {
        return null;
    }

    protected JPanel pnlFilterNC() {
        return null;
    }

    protected JPanel pnlTable() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDoc = new CTable();
        inicialiceModeloDoc();
        tableDoc.setAllTableNoEditable();
        tableDoc.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDoc);
        scrollCxC.setPreferredSize(new Dimension(800, 70));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel pnlTableVenta() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDocVenta = new CTable();
        inicialiceModeloDocVenta();
        tableDocVenta.setAllTableNoEditable();
        tableDocVenta.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDocVenta);
        scrollCxC.setPreferredSize(new Dimension(800, 70));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel pnlTablePedido() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDocPedido = new CTable();
        inicialiceModeloDocPedido();
        tableDocPedido.setAllTableNoEditable();
        tableDocPedido.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDocPedido);
        scrollCxC.setPreferredSize(new Dimension(800, 70));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel pnlTableCotizacion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDocCotizacion = new CTable();
        inicialiceModeloDocCotizacion();
        tableDocCotizacion.setAllTableNoEditable();
        tableDocCotizacion.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDocCotizacion);
        scrollCxC.setPreferredSize(new Dimension(800, 70));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel pnlTabb() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        tabb.add("Resumen", pnlTableResumen());
        tabb.add("Detalle", pnlTableDetalle());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel pnlTabbVenta() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        tabb.add("Resumen", pnlTableResumenVenta());
        tabb.add("Despacho", pnlTableDespacho());
        tabb.add("Devoluciones", pnlTableDevolucion());
        tabb.add("NC - Despachar", pnlTableNC());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel pnlTabbPedido() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        tabb.add("Resumen", pnlTableResumenPedido());
        tabb.add("Despacho", pnlTableDespachoPedido());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel pnlTabbCotizacion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        tabb.add("Resumen", pnlTableResumenCotizacion());
        tabb.add("Despacho", pnlTableDespachoCotizacion());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel pnlTableResumen() {
        return null;
    }

    protected JPanel pnlTableResumenVenta() {
        return null;
    }

    protected JPanel pnlTableResumenPedido() {
        return null;
    }

    protected JPanel pnlTableResumenCotizacion() {
        return null;
    }

    protected JPanel pnlTableDetalle() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDetalle = new CTable();
        inicialiceModeloDetalle();
        tableDetalle.setAllTableNoEditable();
        tableDetalle.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDetalle);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        pnl.add(pnlFilterDetalle(), BorderLayout.NORTH);
        return pnl;
    }

    protected JPanel pnlTableDespacho() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDespacho = new CTable();
        inicialiceModeloDespacho();
        tableDespacho.setAllTableNoEditable();
        tableDespacho.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDespacho);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        pnl.add(pnlFilterDespacho(), BorderLayout.NORTH);
        return pnl;
    }

    protected JPanel pnlTableDespachoPedido() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDespachoPedido = new CTable();
        inicialiceModeloDespachoPedido();
        tableDespachoPedido.setAllTableNoEditable();
        tableDespachoPedido.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDespachoPedido);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        pnl.add(pnlFilterDespachoPedido(), BorderLayout.NORTH);
        return pnl;
    }

    protected JPanel pnlTableDespachoCotizacion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDespachoCotizacion = new CTable();
        inicialiceModeloDespachoCotizacion();
        tableDespachoCotizacion.setAllTableNoEditable();
        tableDespachoCotizacion.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDespachoCotizacion);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        pnl.add(pnlFilterDespachoCotizacion(), BorderLayout.NORTH);
        return pnl;
    }

    protected JPanel pnlTableDevolucion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableDevolucion = new CTable();
        inicialiceModeloDevolucion();
        tableDevolucion.setAllTableNoEditable();
        tableDevolucion.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableDevolucion);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        pnl.add(pnlFilterDevolucion(), BorderLayout.NORTH);
        return pnl;
    }

    protected JPanel pnlTableNC() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableNC = new CTable();
        inicialiceModeloNC();
        tableNC.setAllTableNoEditable();
        tableNC.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableNC);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        pnl.add(pnlFilterNC(), BorderLayout.NORTH);
        return pnl;
    }

    protected void inicialiceModeloDoc() {
        String columnas[] = {"COD.", "F. EMISION", "RAZON SOCIAL", "Nº DOCUMENTO"};
        modeloDoc = new DefaultTableModel(null, columnas);
        tableDoc.setModel(modeloDoc);
    }

    protected void inicialiceModeloDocVenta() {
        String columnas[] = {"COD.", "F. EMISION", "RAZON SOCIAL", "Nº DOCUMENTO", "ESTADO"};
        modeloDocVenta = new DefaultTableModel(null, columnas);
        tableDocVenta.setModel(modeloDocVenta);
    }

    protected void inicialiceModeloDocPedido() {
        String columnas[] = {"COD.", "F. EMISION", "RAZON SOCIAL", "Nº DOCUMENTO", "ESTADO"};
        modeloDocPedido = new DefaultTableModel(null, columnas);
        tableDocPedido.setModel(modeloDocPedido);
    }

    protected void inicialiceModeloDocCotizacion() {
        String columnas[] = {"COD.", "F. EMISION", "RAZON SOCIAL", "Nº DOCUMENTO", "ESTADO"};
        modeloDocCotizacion = new DefaultTableModel(null, columnas);
        tableDocCotizacion.setModel(modeloDocCotizacion);
    }

    protected void inicialiceModeloResumen() {
        String columnas[] = {"ID_ITEM", "PRODUCTO", "ALMACEN", "CANTIDAD"};
        modeloResumen = new DefaultTableModel(null, columnas);
        tableResumen.setModel(modeloResumen);
    }

    protected void inicialiceModeloResumenVenta() {
        String columnas[] = {"COD.", "COD. ITEM", "ITEM", "CANTIDAD", "DESPACHADO", "SALDO", "ALMACEN"};
        modeloResumenVenta = new DefaultTableModel(null, columnas);
        tableResumenVenta.setModel(modeloResumenVenta);
    }

    protected void inicialiceModeloResumenPedido() {
        String columnas[] = {"COD.", "COD. ITEM", "ITEM", "CANTIDAD", "DESPACHADO", "SALDO", "ALMACEN", "ESTADO"};
        modeloResumenPedido = new DefaultTableModel(null, columnas);
        tableResumenPedido.setModel(modeloResumenPedido);
    }

    protected void inicialiceModeloResumenCotizacion() {
        String columnas[] = {"COD.", "COD. ITEM", "ITEM", "CANTIDAD", "DESPACHADO", "SALDO", "ALMACEN"};
        modeloResumenCotizacion = new DefaultTableModel(null, columnas);
        tableResumenCotizacion.setModel(modeloResumenCotizacion);
    }

    protected void inicialiceModeloDetalle() {
        String columnas[] = {"F_EMISION", "DOCUMENTO", "ID_ITEM", "PRODUCTO", "ALMACEN", "CANTIDAD"};
        modeloDetalle = new DefaultTableModel(null, columnas);
        modeloOrdenadoDetalle = new TableRowSorter(modeloDetalle);
        tableDetalle.setRowSorter(modeloOrdenadoDetalle);
        tableDetalle.setModel(modeloDetalle);
    }

    protected void inicialiceModeloDespacho() {
        String columnas[] = {"FECHA", "Nº DOC.", "ALMACEN", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloDespacho = new DefaultTableModel(null, columnas);
        modeloOrdenadoDespacho = new TableRowSorter(modeloDespacho);
        tableDespacho.setRowSorter(modeloOrdenadoDespacho);
        tableDespacho.setModel(modeloDespacho);
    }

    protected void inicialiceModeloDespachoPedido() {
        String columnas[] = {"FECHA", "Nº DOC.", "CLIENTE", "ALMACEN", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloDespachoPedido = new DefaultTableModel(null, columnas);
        modeloOrdenadoDespachoPedido = new TableRowSorter(modeloDespachoPedido);
        tableDespachoPedido.setRowSorter(modeloOrdenadoDespachoPedido);
        tableDespachoPedido.setModel(modeloDespachoPedido);
    }

    protected void inicialiceModeloDespachoCotizacion() {
        String columnas[] = {"FECHA", "Nº DOC.", "CLIENTE", "ALMACEN", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloDespachoCotizacion = new DefaultTableModel(null, columnas);
        modeloOrdenadoDespachoCotizacion = new TableRowSorter(modeloDespachoCotizacion);
        tableDespachoCotizacion.setRowSorter(modeloOrdenadoDespachoCotizacion);
        tableDespachoCotizacion.setModel(modeloDespachoCotizacion);
    }

    protected void inicialiceModeloDevolucion() {
        String columnas[] = {"FECHA", "Nº DOC.", "ALMACEN", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloDevolucion = new DefaultTableModel(null, columnas);
        modeloOrdenadoDevolucion = new TableRowSorter(modeloDevolucion);
        tableDevolucion.setRowSorter(modeloOrdenadoDevolucion);
        tableDevolucion.setModel(modeloDevolucion);
    }

    protected void inicialiceModeloNC() {
        String columnas[] = {"FECHA", "NOTA CREDITO", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloNC = new DefaultTableModel(null, columnas);
        modeloOrdenadoNC = new TableRowSorter(modeloNC);
        tableNC.setRowSorter(modeloOrdenadoNC);
        tableNC.setModel(modeloNC);
    }

    protected void configurarInternal() {
        pack();
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setMinimumSize(new Dimension(800, 400));
        setMaximumSize(new Dimension(1355, 592));
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    protected void initListener() {
    }

    protected void buscarDocumento() {
    }

    protected void buscarDocumentoVenta() {
    }

    protected void buscarDocumentoPedido() {
    }

    protected void buscarDocumentoCotizacion() {
    }

    protected void buscarDocumentoResumen() throws Exception {
    }

    protected void buscarDocumentoResumenVenta() throws Exception {
    }

    protected void buscarDocumentoResumenPedido() throws Exception {
    }

    protected void buscarDocumentoResumenCotizacion() throws Exception {
    }

    protected void buscarDocumentoDetalle() throws Exception {
    }

    protected void buscarDocumentoDespacho() throws Exception {
    }

    protected void buscarDocumentoDespachoPedido() throws Exception {
    }

    protected void buscarDocumentoDespachoCotizacion() throws Exception {
    }

    protected void buscarDocumentoDevolucion() throws Exception {
    }

    protected void buscarDocumentoNC() throws Exception {
    }

    protected void filtrarDetalle() {
    }

    protected void filtrarDespacho() {
    }

    protected void filtrarDespachoPedido() {
    }

    protected void filtrarDespachoCotizacion() {
    }

    protected void filtrarDevolucion() {
    }

    protected void filtrarNC() {
    }

    protected RowFilter getFilterDetalle() {
        List filters = new ArrayList();
        if (cboItem.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItem.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 2));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected RowFilter getFilterDespacho() {
        List filters = new ArrayList();
        if (cboItemDespacho.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemDespacho.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 3));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected RowFilter getFilterDespachoPedido() {
        List filters = new ArrayList();
        if (cboItemDespachoPedido.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemDespachoPedido.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 4));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected RowFilter getFilterDespachoCotizacion() {
        List filters = new ArrayList();
        if (cboItemDespachoCotizacion.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemDespachoCotizacion.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 4));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected RowFilter getFilterDevolucion() {
        List filters = new ArrayList();
        if (cboItemDevolucion.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemDevolucion.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 3));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected RowFilter getFilterNC() {
        List filters = new ArrayList();
        if (cboItemNC.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemNC.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 2));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected void exportar(String nombre, CTable table, Map parameters) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txtSerie) {
            txtSerie.selectAll();
        }
        if (e.getSource() == txtSeriePedido) {
            txtSeriePedido.selectAll();
        }
        if (e.getSource() == txtSerieCotizacion) {
            txtSerieCotizacion.selectAll();
        }
        if (e.getSource() == txtPreimpreso) {
            txtPreimpreso.selectAll();
        }
        if (e.getSource() == txtPreimpresoCotizacion) {
            txtPreimpresoCotizacion.selectAll();
        }
        if (e.getSource() == txtPreimpresoPedido) {
            txtPreimpresoPedido.selectAll();
        }
        if (e.getSource() == txtSerieVenta) {
            txtSerieVenta.selectAll();
        }
        if (e.getSource() == txtPreimpresoVenta) {
            txtPreimpresoVenta.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtPreimpreso) {
            if (txtPreimpreso.getText().trim().length() > 0) {
                String serie = "0000000000" + txtPreimpreso.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 10, serie.length());
                txtPreimpreso.setText(nuevaserie);
            }
        }
        if (e.getSource() == txtPreimpresoVenta) {
            if (txtPreimpresoVenta.getText().trim().length() > 0) {
                String serie = "0000000000" + txtPreimpresoVenta.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 10, serie.length());
                txtPreimpresoVenta.setText(nuevaserie);
            }
        }
        if (e.getSource() == txtPreimpresoPedido) {
            if (txtPreimpresoPedido.getText().trim().length() > 0) {
                String serie = "0000000000" + txtPreimpresoPedido.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 10, serie.length());
                txtPreimpresoPedido.setText(nuevaserie);
            }
        }
        if (e.getSource() == txtPreimpresoCotizacion) {
            if (txtPreimpresoCotizacion.getText().trim().length() > 0) {
                String serie = "0000000000" + txtPreimpresoCotizacion.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 10, serie.length());
                txtPreimpresoCotizacion.setText(nuevaserie);
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnBuscar) {
            buscarDocumento();
        }
        if (e.getSource() == btnBuscarVenta) {
            buscarDocumentoVenta();
        }
        if (e.getSource() == btnBuscarPedido) {
            buscarDocumentoPedido();
        }
        if (e.getSource() == btnBuscarCotizacion) {
            buscarDocumentoCotizacion();
        }
        if (e.getSource() == cboItem) {
            filtrarDetalle();
        }
        if (e.getSource() == cboItemDespacho) {
            filtrarDespacho();
        }
        if (e.getSource() == cboItemDespachoPedido) {
            filtrarDespachoPedido();
        }
        if (e.getSource() == cboItemDespachoCotizacion) {
            filtrarDespachoCotizacion();
        }
        if (e.getSource() == cboItemDevolucion) {
            filtrarDevolucion();
        }
        if (e.getSource() == cboItemNC) {
            filtrarNC();
        }
        if (e.getSource() == btnExportarResVta) {
            Map parameters = new HashMap();
            parameters.put(2, "Resumen Venta");
            exportar("Venta", tableResumenVenta, parameters);
        }
        if (e.getSource() == btnExportarResDesp) {
            Map parameters = new HashMap();
            parameters.put(2, "Resumen Despacho");
            exportar("Despacho", tableResumen, parameters);
        }
        if (e.getSource() == btnExportarResPedido) {
            Map parameters = new HashMap();
            parameters.put(2, "Resumen Pedido");
            exportar("Pedido", tableResumenPedido, parameters);
        }
        if (e.getSource() == btnExportarResCotizacion) {
            Map parameters = new HashMap();
            parameters.put(2, "Resumen Cotizacion");
            exportar("Cotizacion", tableResumenCotizacion, parameters);
        }
        if (e.getSource() == btnExportarDetDesp) {
            Map parameters = new HashMap();
            parameters.put(2, "Detalle Despacho");
            exportar("DetalleDespacho", tableDetalle, parameters);
        }
        if (e.getSource() == btnExportarDespacho) {
            Map parameters = new HashMap();
            parameters.put(2, "Reporte Despacho");
            exportar("Despacho", tableDespacho, parameters);
        }
        if (e.getSource() == btnExportarDespachoPedido) {
            Map parameters = new HashMap();
            parameters.put(2, "Reporte Despacho Pedido");
            exportar("DespachoPedido", tableDespachoPedido, parameters);
        }
        if (e.getSource() == btnExportarDespachoCotizacion) {
            Map parameters = new HashMap();
            parameters.put(2, "Reporte Despacho Cotizacion");
            exportar("DespachoCotizacion", tableDespachoCotizacion, parameters);
        }
        if (e.getSource() == btnExportarDevolucion) {
            Map parameters = new HashMap();
            parameters.put(2, "Reporte Devolucion");
            exportar("Devolucion", tableDevolucion, parameters);
        }
        if (e.getSource() == btnExportarNC) {
            Map parameters = new HashMap();
            parameters.put(2, "Reporte Nota de Credito");
            exportar("NC", tableNC, parameters);
        }
    }
}
