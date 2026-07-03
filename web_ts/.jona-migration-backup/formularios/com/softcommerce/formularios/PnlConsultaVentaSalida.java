package com.softcommerce.formularios;

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

public class PnlConsultaVentaSalida extends JInternalFrame implements KeyListener, FocusListener, ActionListener {

    private java.net.URL path;
    private Main frmMain;
    private Usuario usuario;
    private Gif gif;
    private JComboBox cboTipoDoc;
    private JComboBox cboTipoDocVenta;
    private JComboBox cboItem;
    private JComboBox cboItemDespacho;
    private JComboBox cboItemDespachoPedido;
    private JComboBox cboItemDespachoCotizacion;
    private JComboBox cboItemDevolucion;
    private JComboBox cboItemNC;
    private JTextField txtSerie;
    private JTextField txtPreimpreso;
    private JTextField txtSerieVenta;
    private JTextField txtPreimpresoVenta;
    private JButton btnBuscar;
    private JButton btnExportarResVta;
    private JButton btnExportarResPedido;
    private JButton btnExportarResCotizacion;
    private JButton btnExportarResDesp;
    private JButton btnExportarDetDesp;
    private JButton btnExportarDespacho;
    private JButton btnExportarDespachoPedido;
    private JButton btnExportarDespachoCotizacion;
    private JButton btnExportarDevolucion;
    private JButton btnExportarNC;
    private JButton btnBuscarVenta;
    private CTable tableDoc;
    private CTable tableDocVenta;
    private CTable tableDocPedido;
    private CTable tableDocCotizacion;
    private CTable tableResumen;
    private CTable tableResumenVenta;
    private CTable tableResumenPedido;
    private CTable tableResumenCotizacion;
    private CTable tableDetalle;
    private CTable tableDespacho;
    private CTable tableDespachoPedido;
    private CTable tableDespachoCotizacion;
    private CTable tableDevolucion;
    private CTable tableNC;
    private DefaultTableModel modeloDoc;
    private DefaultTableModel modeloDocVenta;
    private DefaultTableModel modeloDocPedido;
    private DefaultTableModel modeloDocCotizacion;
    private DefaultTableModel modeloResumen;
    private DefaultTableModel modeloResumenVenta;
    private DefaultTableModel modeloResumenPedido;
    private DefaultTableModel modeloResumenCotizacion;
    private DefaultTableModel modeloDetalle;
    private DefaultTableModel modeloDespacho;
    private DefaultTableModel modeloDespachoPedido;
    private DefaultTableModel modeloDespachoCotizacion;
    private DefaultTableModel modeloDevolucion;
    private DefaultTableModel modeloNC;
    private TableRowSorter modeloOrdenadoDetalle;
    private TableRowSorter modeloOrdenadoDespacho;
    private TableRowSorter modeloOrdenadoDespachoPedido;
    private TableRowSorter modeloOrdenadoDespachoCotizacion;
    private TableRowSorter modeloOrdenadoDevolucion;
    private TableRowSorter modeloOrdenadoNC;
    private JTabbedPane tabbGral;
    private JTextField txtSeriePedido;
    private JTextField txtPreimpresoPedido;
    private JTextField txtSerieCotizacion;
    private JTextField txtPreimpresoCotizacion;
    private JButton btnBuscarPedido;
    private JButton btnBuscarCotizacion;

    public PnlConsultaVentaSalida(String title, java.net.URL path, Main frm, Usuario usuario) {
        super(title);
        this.path = path;
        this.frmMain = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
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

    private void loadCombo() {
        try {
            this.loadTipoDocumento();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadTipoDocumento() throws Exception {
        try {
            RnTipoDocVenta regla_TipoDoc = new RnTipoDocVenta(path);
            List<BeanTipoDocVenta> allTipo = regla_TipoDoc.listarTipoDocVenta("", "", "", "A", "VE", "", "");
            cboTipoDocVenta.removeAllItems();
            Iterator<BeanTipoDocVenta> iterador = allTipo.iterator();
            while (iterador.hasNext()) {
                BeanTipoDocVenta bean = iterador.next();
                if (bean.getIdTipoDoc().equalsIgnoreCase("CO")) {
                    continue;
                }
                cboTipoDocVenta.addItem(new ItemObject(bean.getIdTipoDoc(), bean.getDescripcion()));
            }
            cboTipoDocVenta.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private JPanel getPnlVenta() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(pnlFilterVenta(), BorderLayout.NORTH);
        pnl.add(pnlTableVenta(), BorderLayout.CENTER);
        pnl.add(pnlTabbVenta(), BorderLayout.SOUTH);
        return pnl;
    }

    private JPanel getPnlDespacho() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(pnlFilter(), BorderLayout.NORTH);
        pnl.add(pnlTable(), BorderLayout.CENTER);
        pnl.add(pnlTabb(), BorderLayout.SOUTH);
        return pnl;
    }

    private JPanel getPnlPedido() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlFilterPedido(), BorderLayout.NORTH);
        pnl.add(pnlTablePedido(), BorderLayout.CENTER);
        pnl.add(pnlTabbPedido(), BorderLayout.SOUTH);
        return pnl;
    }

    private JPanel getPnlFilterPedido() {
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

    private JPanel getPnlCotizacion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlFilterCotizacion(), BorderLayout.NORTH);
        pnl.add(pnlTableCotizacion(), BorderLayout.CENTER);
        pnl.add(pnlTabbCotizacion(), BorderLayout.SOUTH);
        return pnl;
    }

    private JPanel getPnlFilterCotizacion() {
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

    private JPanel pnlFilter() {
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

    private JPanel pnlFilterVenta() {
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

    private JPanel pnlFilterDetalle() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnl.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        JLabel lblITem = new JLabel("Producto:");
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblITem, gbc);
        cboItem = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboItem, gbc);
        btnExportarDetDesp = new JButton("Exportar", gif.EXCEL);
        gbc.gridx = 2;
        pnlFiltro.add(btnExportarDetDesp, gbc);
        return pnl;
    }

    private JPanel pnlFilterDespacho() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnl.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        JLabel lblITem = new JLabel("Producto:");
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblITem, gbc);
        cboItemDespacho = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboItemDespacho, gbc);
        btnExportarDespacho = new JButton("Exportar", gif.EXCEL);
        gbc.gridx = 2;
        pnlFiltro.add(btnExportarDespacho, gbc);
        return pnl;
    }

    private JPanel pnlFilterDespachoCotizacion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnl.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        JLabel lblITem = new JLabel("Producto:");
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblITem, gbc);
        cboItemDespachoCotizacion = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboItemDespachoCotizacion, gbc);
        btnExportarDespachoCotizacion = new JButton("Exportar", gif.EXCEL);
        gbc.gridx = 2;
        pnlFiltro.add(btnExportarDespachoCotizacion, gbc);
        return pnl;
    }

    private JPanel pnlFilterDespachoPedido() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnl.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        JLabel lblITem = new JLabel("Producto:");
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblITem, gbc);
        cboItemDespachoPedido = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboItemDespachoPedido, gbc);
        btnExportarDespachoPedido = new JButton("Exportar", gif.EXCEL);
        gbc.gridx = 2;
        pnlFiltro.add(btnExportarDespachoPedido, gbc);
        return pnl;
    }

    private JPanel pnlFilterDevolucion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnl.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        JLabel lblITem = new JLabel("Producto:");
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblITem, gbc);
        cboItemDevolucion = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboItemDevolucion, gbc);
        btnExportarDevolucion = new JButton("Exportar", gif.EXCEL);
        gbc.gridx = 2;
        pnlFiltro.add(btnExportarDevolucion, gbc);
        return pnl;
    }

    private JPanel pnlFilterNC() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlFiltro = new JPanel();
        pnl.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        JLabel lblITem = new JLabel("Producto:");
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblITem, gbc);
        cboItemNC = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboItemNC, gbc);
        btnExportarNC = new JButton("Exportar", gif.EXCEL);
        gbc.gridx = 2;
        pnlFiltro.add(btnExportarNC, gbc);
        return pnl;
    }

    private JPanel pnlTable() {
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

    private JPanel pnlTableVenta() {
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

    private JPanel pnlTablePedido() {
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

    private JPanel pnlTableCotizacion() {
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

    private JPanel pnlTabb() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        tabb.add("Resumen", pnlTableResumen());
        tabb.add("Detalle", pnlTableDetalle());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel pnlTabbVenta() {
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

    private JPanel pnlTabbPedido() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        tabb.add("Resumen", pnlTableResumenPedido());
        tabb.add("Despacho", pnlTableDespachoPedido());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel pnlTabbCotizacion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        tabb.add("Resumen", pnlTableResumenCotizacion());
        tabb.add("Despacho", pnlTableDespachoCotizacion());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel pnlTableResumen() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableResumen = new CTable();
        inicialiceModeloResumen();
        tableResumen.setAllTableNoEditable();
        tableResumen.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableResumen);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        btnExportarResDesp = new JButton("Exportar", gif.EXCEL);
        pnlNorth.add(btnExportarResDesp);
        pnl.add(pnlNorth, BorderLayout.NORTH);
        return pnl;
    }

    private JPanel pnlTableResumenVenta() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableResumenVenta = new CTable();
        inicialiceModeloResumenVenta();
        tableResumenVenta.setAllTableNoEditable();
        tableResumenVenta.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableResumenVenta);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        btnExportarResVta = new JButton("Exportar", gif.EXCEL);
        pnlNorth.add(btnExportarResVta);
        pnl.add(pnlNorth, BorderLayout.NORTH);
        return pnl;
    }

    private JPanel pnlTableResumenPedido() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableResumenPedido = new CTable();
        inicialiceModeloResumenPedido();
        tableResumenPedido.setAllTableNoEditable();
        tableResumenPedido.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableResumenPedido);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        btnExportarResPedido = new JButton("Exportar", gif.EXCEL);
        pnlNorth.add(btnExportarResPedido);
        pnl.add(pnlNorth, BorderLayout.NORTH);
        return pnl;
    }

    private JPanel pnlTableResumenCotizacion() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        tableResumenCotizacion = new CTable();
        inicialiceModeloResumenCotizacion();
        tableResumenCotizacion.setAllTableNoEditable();
        tableResumenCotizacion.setAllColumnPreferredWidthNvo(15);
        JScrollPane scrollCxC = new JScrollPane(tableResumenCotizacion);
        scrollCxC.setPreferredSize(new Dimension(800, 200));
        pnl.add(scrollCxC, BorderLayout.CENTER);
        JPanel pnlNorth = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        btnExportarResCotizacion = new JButton("Exportar", gif.EXCEL);
        pnlNorth.add(btnExportarResCotizacion);
        pnl.add(pnlNorth, BorderLayout.NORTH);
        return pnl;
    }

    private JPanel pnlTableDetalle() {
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

    private JPanel pnlTableDespacho() {
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

    private JPanel pnlTableDespachoPedido() {
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

    private JPanel pnlTableDespachoCotizacion() {
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

    private JPanel pnlTableDevolucion() {
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

    private JPanel pnlTableNC() {
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

    private void inicialiceModeloDoc() {
        String columnas[] = {"COD.", "F. EMISION", "RAZON SOCIAL", "Nº DOCUMENTO"};
        modeloDoc = new DefaultTableModel(null, columnas);
        tableDoc.setModel(modeloDoc);
    }

    private void inicialiceModeloDocVenta() {
        String columnas[] = {"COD.", "F. EMISION", "RAZON SOCIAL", "Nº DOCUMENTO", "ESTADO"};
        modeloDocVenta = new DefaultTableModel(null, columnas);
        tableDocVenta.setModel(modeloDocVenta);
    }

    private void inicialiceModeloDocPedido() {
        String columnas[] = {"COD.", "F. EMISION", "RAZON SOCIAL", "Nº DOCUMENTO", "ESTADO"};
        modeloDocPedido = new DefaultTableModel(null, columnas);
        tableDocPedido.setModel(modeloDocPedido);
    }

    private void inicialiceModeloDocCotizacion() {
        String columnas[] = {"COD.", "F. EMISION", "RAZON SOCIAL", "Nº DOCUMENTO", "ESTADO"};
        modeloDocCotizacion = new DefaultTableModel(null, columnas);
        tableDocCotizacion.setModel(modeloDocCotizacion);
    }

    private void inicialiceModeloResumen() {
        String columnas[] = {"ID_ITEM", "PRODUCTO", "ALMACEN", "CANTIDAD"};
        modeloResumen = new DefaultTableModel(null, columnas);
        tableResumen.setModel(modeloResumen);
    }

    private void inicialiceModeloResumenVenta() {
        String columnas[] = {"COD.", "COD. ITEM", "ITEM", "CANTIDAD", "DESPACHADO", "SALDO", "ALMACEN"};
        modeloResumenVenta = new DefaultTableModel(null, columnas);
        tableResumenVenta.setModel(modeloResumenVenta);
    }

    private void inicialiceModeloResumenPedido() {
        String columnas[] = {"COD.", "COD. ITEM", "ITEM", "CANTIDAD", "DESPACHADO", "SALDO", "ALMACEN", "ESTADO"};
        modeloResumenPedido = new DefaultTableModel(null, columnas);
        tableResumenPedido.setModel(modeloResumenPedido);
    }

    private void inicialiceModeloResumenCotizacion() {
        String columnas[] = {"COD.", "COD. ITEM", "ITEM", "CANTIDAD", "DESPACHADO", "SALDO", "ALMACEN"};
        modeloResumenCotizacion = new DefaultTableModel(null, columnas);
        tableResumenCotizacion.setModel(modeloResumenCotizacion);
    }

    private void inicialiceModeloDetalle() {
        String columnas[] = {"F_EMISION", "DOCUMENTO", "ID_ITEM", "PRODUCTO", "ALMACEN", "CANTIDAD"};
        modeloDetalle = new DefaultTableModel(null, columnas);
        modeloOrdenadoDetalle = new TableRowSorter(modeloDetalle);
        tableDetalle.setRowSorter(modeloOrdenadoDetalle);
        tableDetalle.setModel(modeloDetalle);
    }

    private void inicialiceModeloDespacho() {
        String columnas[] = {"FECHA", "Nº DOC.", "ALMACEN", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloDespacho = new DefaultTableModel(null, columnas);
        modeloOrdenadoDespacho = new TableRowSorter(modeloDespacho);
        tableDespacho.setRowSorter(modeloOrdenadoDespacho);
        tableDespacho.setModel(modeloDespacho);
    }

    private void inicialiceModeloDespachoPedido() {
        String columnas[] = {"FECHA", "Nº DOC.", "CLIENTE", "ALMACEN", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloDespachoPedido = new DefaultTableModel(null, columnas);
        modeloOrdenadoDespachoPedido = new TableRowSorter(modeloDespachoPedido);
        tableDespachoPedido.setRowSorter(modeloOrdenadoDespachoPedido);
        tableDespachoPedido.setModel(modeloDespachoPedido);
    }

    private void inicialiceModeloDespachoCotizacion() {
        String columnas[] = {"FECHA", "Nº DOC.", "CLIENTE", "ALMACEN", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloDespachoCotizacion = new DefaultTableModel(null, columnas);
        modeloOrdenadoDespachoCotizacion = new TableRowSorter(modeloDespachoCotizacion);
        tableDespachoCotizacion.setRowSorter(modeloOrdenadoDespachoCotizacion);
        tableDespachoCotizacion.setModel(modeloDespachoCotizacion);
    }

    private void inicialiceModeloDevolucion() {
        String columnas[] = {"FECHA", "Nº DOC.", "ALMACEN", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloDevolucion = new DefaultTableModel(null, columnas);
        modeloOrdenadoDevolucion = new TableRowSorter(modeloDevolucion);
        tableDevolucion.setRowSorter(modeloOrdenadoDevolucion);
        tableDevolucion.setModel(modeloDevolucion);
    }

    private void inicialiceModeloNC() {
        String columnas[] = {"FECHA", "NOTA CREDITO", "COD. ITEM", "ITEM", "DESPACHADO"};
        modeloNC = new DefaultTableModel(null, columnas);
        modeloOrdenadoNC = new TableRowSorter(modeloNC);
        tableNC.setRowSorter(modeloOrdenadoNC);
        tableNC.setModel(modeloNC);
    }

    private void configurarInternal() {
        pack();
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setMinimumSize(new Dimension(800, 400));
        setMaximumSize(new Dimension(1355, 592));
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private void initListener() {
        txtSerie.addKeyListener(this);
        txtSerie.addFocusListener(this);
        txtPreimpreso.addKeyListener(this);
        txtPreimpreso.addFocusListener(this);
        txtSerieVenta.addKeyListener(this);
        txtSerieVenta.addFocusListener(this);
        txtPreimpresoVenta.addKeyListener(this);
        txtPreimpresoVenta.addFocusListener(this);
        btnBuscar.addActionListener(this);
        btnExportarDespacho.addActionListener(this);
        btnExportarDevolucion.addActionListener(this);
        btnExportarNC.addActionListener(this);
        btnBuscarVenta.addActionListener(this);
        cboItem.addActionListener(this);
        cboItemDespachoCotizacion.addActionListener(this);
        cboItemDespachoPedido.addActionListener(this);
        cboItemDespacho.addActionListener(this);
        cboItemDevolucion.addActionListener(this);
        cboItemNC.addActionListener(this);
        txtSeriePedido.addFocusListener(this);
        txtPreimpresoPedido.addFocusListener(this);
        btnBuscarPedido.addActionListener(this);
        txtSerieCotizacion.addFocusListener(this);
        txtPreimpresoCotizacion.addFocusListener(this);
        btnBuscarCotizacion.addActionListener(this);
        btnExportarResVta.addActionListener(this);
        btnExportarResDesp.addActionListener(this);
        btnExportarDetDesp.addActionListener(this);
        btnExportarResPedido.addActionListener(this);
        btnExportarResCotizacion.addActionListener(this);
        btnExportarDespachoCotizacion.addActionListener(this);
        btnExportarDespachoPedido.addActionListener(this);
    }

    private void buscarDocumento() {
        try {
            if (txtSerie.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Serie");
                txtSerie.requestFocus();
                return;
            }
            if (txtPreimpreso.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Serie");
                txtPreimpreso.requestFocus();
                return;
            }
            ItemObject tipoDoc = (ItemObject) this.cboTipoDoc.getSelectedItem();
            RnConsultas logic = new RnConsultas(path);
            List<RegContaCab> lista = logic.listarSalidaVenta(tipoDoc.getId(), txtSerie.getText().trim(), txtPreimpreso.getText().trim());
            if (lista.isEmpty()) {
                JOptionPane.showMessageDialog(this, "No se encontraron datos");
            }
            inicialiceModeloDoc();
            SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
            for (int i = 0; i < lista.size(); i++) {
                Object[] data = new Object[4];
                RegContaCab beanRegContaCab = (RegContaCab) lista.get(i);
                data[0] = beanRegContaCab.getId_regconta();
                data[1] = formato.format(beanRegContaCab.getF_emision());
                data[2] = beanRegContaCab.getTmp_anexo();
                data[3] = beanRegContaCab.getId_tipo_doc() + "/" + beanRegContaCab.getSerie() + "-" + beanRegContaCab.getPreimpreso();
                modeloDoc.addRow(data);
            }
            tableDoc.setAllColumnPreferredWidthNvo(15);
            if (tableDoc.getRowCount() > 0) {
                tableDoc.setRowSelectionInterval(0, 0);
                buscarDocumentoResumen();
                buscarDocumentoDetalle();
            } else {
                inicialiceModeloResumen();
                inicialiceModeloDetalle();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void buscarDocumentoVenta() {
        try {
            if (txtSerieVenta.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Serie");
                txtSerieVenta.requestFocus();
                return;
            }
            if (txtPreimpresoVenta.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Preimpreso");
                txtPreimpresoVenta.requestFocus();
                return;
            }
            ItemObject tipoDoc = (ItemObject) this.cboTipoDocVenta.getSelectedItem();
            LogicVentas logic = new LogicVentas();
            List<RegContaCab> lista = logic.buscaVentaSeriePreimpreso(tipoDoc.getId(), txtSerieVenta.getText().trim(), txtPreimpresoVenta.getText().trim());
            inicialiceModeloDocVenta();
            if (lista.isEmpty()) {
                JOptionPane.showMessageDialog(this, "No se encontraron datos");
            }
            SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
            for (int i = 0; i < lista.size(); i++) {
                Object[] data = new Object[5];
                RegContaCab beanRegContaCab = (RegContaCab) lista.get(i);
                data[0] = beanRegContaCab.getId_regconta();
                data[1] = formato.format(beanRegContaCab.getF_emision());
                data[2] = beanRegContaCab.getTmp_anexo();
                data[3] = beanRegContaCab.getSerie() + "-" + beanRegContaCab.getPreimpreso();
                data[4] = beanRegContaCab.getEstado();
                modeloDocVenta.addRow(data);
            }
            tableDocVenta.setAllColumnPreferredWidthNvo(15);
            if (tableDocVenta.getRowCount() > 0) {
                tableDocVenta.setRowSelectionInterval(0, 0);
                buscarDocumentoResumenVenta();
                buscarDocumentoDespacho();
                buscarDocumentoDevolucion();
                buscarDocumentoNC();
            } else {
                inicialiceModeloResumenVenta();
                inicialiceModeloDespacho();
                inicialiceModeloDevolucion();
                inicialiceModeloNC();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void buscarDocumentoPedido() {
        try {
            if (txtSeriePedido.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Serie");
                txtSeriePedido.requestFocus();
                return;
            }
            if (txtPreimpresoPedido.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Preimpreso");
                txtPreimpresoPedido.requestFocus();
                return;
            }
            RnPedidoCab logic = new RnPedidoCab(path);
            List<BeanPedidoCab> lista = logic.listarPedido(null, null, "", txtSeriePedido.getText().trim(), txtPreimpresoPedido.getText().trim());
            inicialiceModeloDocPedido();
            if (lista.isEmpty()) {
                JOptionPane.showMessageDialog(this, "No se encontraron datos");
            }
            SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
            for (int i = 0; i < lista.size(); i++) {
                Object[] data = new Object[5];
                BeanPedidoCab beanPedido = (BeanPedidoCab) lista.get(i);
                data[0] = beanPedido.getId_pedido();
                data[1] = formato.format(beanPedido.getF_emision());
                data[2] = beanPedido.getBeanCliente().getDescripcion();
                data[3] = beanPedido.getSerie() + "-" + beanPedido.getPreimpreso();
                data[4] = beanPedido.getBeanEstadoDocumento().getDescripcion();
                modeloDocPedido.addRow(data);
            }
            tableDocPedido.setAllColumnPreferredWidthNvo(15);
            if (tableDocPedido.getRowCount() > 0) {
                tableDocPedido.setRowSelectionInterval(0, 0);
                buscarDocumentoResumenPedido();
                buscarDocumentoDespachoPedido();
            } else {
                inicialiceModeloResumenPedido();
                inicialiceModeloDespachoPedido();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void buscarDocumentoCotizacion() {
        try {
            if (txtSerieCotizacion.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Serie");
                txtSerieCotizacion.requestFocus();
                return;
            }
            if (txtPreimpresoCotizacion.getText().trim().length() == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Preimpreso");
                txtPreimpresoCotizacion.requestFocus();
                return;
            }
            RnCotizacionCab logic = new RnCotizacionCab(path);
            List<BeanCotizacionCab> lista = logic.listarCotizacion(null, null, "", txtSerieCotizacion.getText().trim(), txtPreimpresoCotizacion.getText().trim());
            inicialiceModeloDocCotizacion();
            if (lista.isEmpty()) {
                JOptionPane.showMessageDialog(this, "No se encontraron datos");
            }
            SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
            for (int i = 0; i < lista.size(); i++) {
                Object[] data = new Object[5];
                BeanCotizacionCab beanCotizacion = (BeanCotizacionCab) lista.get(i);
                data[0] = beanCotizacion.getIdCotizacion();
                data[1] = formato.format(beanCotizacion.getFEmision());
                data[2] = beanCotizacion.getBeanCliente().getDescripcion();
                data[3] = beanCotizacion.getSerie() + "-" + beanCotizacion.getPreimpreso();
                data[4] = beanCotizacion.getBeanEstadoDocumento().getDescripcion();
                modeloDocCotizacion.addRow(data);
            }
            tableDocCotizacion.setAllColumnPreferredWidthNvo(15);
            if (tableDocCotizacion.getRowCount() > 0) {
                tableDocCotizacion.setRowSelectionInterval(0, 0);
                buscarDocumentoResumenCotizacion();
                buscarDocumentoDespachoCotizacion();
            } else {
                inicialiceModeloResumenCotizacion();
                inicialiceModeloDespachoCotizacion();
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void buscarDocumentoResumen() throws Exception {
        try {
            if (tableDoc.getSelectedRow() >= 0) {
                Map<String, Item> mapItem = new HashMap<String, Item>();
                RnConsultas logic = new RnConsultas(path);
                List<RegContaItem> lista = logic.listarSalidaVentaResumen(tableDoc.getValueAt(tableDoc.getSelectedRow(), 0).toString());
                inicialiceModeloResumen();
                Item beanItem;
                for (int i = 0; i < lista.size(); i++) {
                    beanItem = new Item();
                    Object[] data = new Object[4];
                    RegContaItem beanRegContaItem = (RegContaItem) lista.get(i);
                    data[0] = beanRegContaItem.getId_item();
                    data[1] = beanRegContaItem.getDescripcion_item();
                    data[2] = beanRegContaItem.getAlmacen();
                    data[3] = beanRegContaItem.getCantidad();
                    modeloResumen.addRow(data);
                    beanItem.setId_item(beanRegContaItem.getId_item());
                    beanItem.setDescripcion(beanRegContaItem.getDescripcion_item());
                    mapItem.put(beanItem.getId_item(), beanItem);
                }
                tableResumen.setAllColumnPreferredWidthNvo(15);
                Iterator it = mapItem.keySet().iterator();
                cboItem.removeAllItems();
                cboItem.addItem(new ItemObject("", "--- SELECCIONE ---"));
                while (it.hasNext()) {
                    beanItem = (Item) mapItem.get(it.next());
                    cboItem.addItem(new ItemObject(beanItem.getId_item(), beanItem.getDescripcion()));
                }
                cboItem.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarDocumentoResumenVenta() throws Exception {
        try {
            if (tableDocVenta.getSelectedRow() >= 0) {
                Map<String, Item> mapItem = new HashMap<String, Item>();
                LogicVentas logic = new LogicVentas();
                List<RegContaItem> lista = logic.buscaDetalleResumen(tableDocVenta.getValueAt(tableDocVenta.getSelectedRow(), 0).toString());
                inicialiceModeloResumenVenta();
                Item beanItem;
                for (int i = 0; i < lista.size(); i++) {
                    beanItem = new Item();
                    Object[] data = new Object[7];
                    RegContaItem beanRegContaItem = (RegContaItem) lista.get(i);
                    data[0] = beanRegContaItem.getId_detalle();
                    data[1] = Constans.IS_BUSQUEDA_ITEM_ALTERNO ? beanRegContaItem.getIdAlterno() : beanRegContaItem.getId_item();
                    data[2] = beanRegContaItem.getDescripcion_item();
                    data[3] = beanRegContaItem.getCantidad();
                    data[4] = beanRegContaItem.getDespachado();
                    data[5] = beanRegContaItem.getSaldo();
                    data[6] = beanRegContaItem.getAlmacen();
                    modeloResumenVenta.addRow(data);
                    beanItem.setId_item(beanRegContaItem.getId_item());
                    beanItem.setId_alterno(beanRegContaItem.getIdAlterno());
                    beanItem.setDescripcion(beanRegContaItem.getDescripcion_item());
                    mapItem.put(beanItem.getId_item(), beanItem);
                }
                tableResumenVenta.setAllColumnPreferredWidthNvo(15);
                Iterator it = mapItem.keySet().iterator();
                cboItemDespacho.removeAllItems();
                cboItemDespacho.addItem(new ItemObject("", "--- SELECCIONE ---"));
                cboItemDevolucion.removeAllItems();
                cboItemDevolucion.addItem(new ItemObject("", "--- SELECCIONE ---"));
                cboItemNC.removeAllItems();
                cboItemNC.addItem(new ItemObject("", "--- SELECCIONE ---"));
                while (it.hasNext()) {
                    beanItem = (Item) mapItem.get(it.next());
                    String idItem = Constans.IS_BUSQUEDA_ITEM_ALTERNO ? beanItem.getId_alterno() : beanItem.getId_item();
                    cboItemDespacho.addItem(new ItemObject(idItem, beanItem.getDescripcion()));
                    cboItemDevolucion.addItem(new ItemObject(idItem, beanItem.getDescripcion()));
                    cboItemNC.addItem(new ItemObject(idItem, beanItem.getDescripcion()));
                }
                cboItemDespacho.setSelectedIndex(0);
                cboItemDevolucion.setSelectedIndex(0);
                cboItemNC.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarDocumentoResumenPedido() throws Exception {
        try {
            if (tableDocPedido.getSelectedRow() >= 0) {
                Map<String, Item> mapItem = new HashMap<String, Item>();
                RnPedidoCab logic = new RnPedidoCab(path);
                List<BeanPedidoDet> lista = logic.detallePedido(Integer.parseInt(tableDocPedido.getValueAt(tableDocPedido.getSelectedRow(), 0).toString()));
                inicialiceModeloResumenPedido();
                Item beanItem;
                for (int i = 0; i < lista.size(); i++) {
                    beanItem = new Item();
                    Object[] data = new Object[8];
                    BeanPedidoDet bean = (BeanPedidoDet) lista.get(i);
                    data[0] = bean.getId_pedido_det();
                    data[1] = bean.getBeanItem().getIdItem();
                    data[2] = bean.getBeanItem().getDescripcion();
                    data[3] = bean.getCantidad();
                    data[4] = bean.getCantDesp();
                    data[5] = bean.getCantidad().subtract(bean.getCantDesp());
                    data[6] = bean.getBeanAlmacen().getDescripcion();
                    data[7] = bean.getEstado();
                    modeloResumenPedido.addRow(data);
                    beanItem.setId_item(bean.getBeanItem().getIdItem());
                    beanItem.setDescripcion(bean.getBeanItem().getDescripcion());
                    mapItem.put(beanItem.getId_item(), beanItem);
                }
                tableResumenPedido.setAllColumnPreferredWidthNvo(15);
                Iterator it = mapItem.keySet().iterator();
                cboItemDespachoPedido.removeAllItems();
                cboItemDespachoPedido.addItem(new ItemObject("", "--- SELECCIONE ---"));
                while (it.hasNext()) {
                    beanItem = (Item) mapItem.get(it.next());
                    cboItemDespachoPedido.addItem(new ItemObject(beanItem.getId_item(), beanItem.getDescripcion()));
                }
                cboItemDespachoPedido.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarDocumentoResumenCotizacion() throws Exception {
        try {
            if (tableDocCotizacion.getSelectedRow() >= 0) {
                Map<String, Item> mapItem = new HashMap<String, Item>();
                RnCotizacionCab logic = new RnCotizacionCab(path);
                List<BeanCotizacionDet> lista = logic.detalleCotizacion(Integer.parseInt(tableDocCotizacion.getValueAt(tableDocCotizacion.getSelectedRow(), 0).toString()));
                inicialiceModeloResumenCotizacion();
                Item beanItem;
                for (int i = 0; i < lista.size(); i++) {
                    beanItem = new Item();
                    Object[] data = new Object[7];
                    BeanCotizacionDet bean = (BeanCotizacionDet) lista.get(i);
                    data[0] = bean.getIdCotizacionDet();
                    data[1] = bean.getBeanItem().getIdItem();
                    data[2] = bean.getBeanItem().getDescripcion();
                    data[3] = bean.getCantidad();
                    data[4] = bean.getCantDesp();
                    data[5] = bean.getCantidad().subtract(bean.getCantDesp());
                    data[6] = bean.getBeanAlmacen().getDescripcion();
                    modeloResumenCotizacion.addRow(data);
                    beanItem.setId_item(bean.getBeanItem().getIdItem());
                    beanItem.setDescripcion(bean.getBeanItem().getDescripcion());
                    mapItem.put(beanItem.getId_item(), beanItem);
                }
                tableResumenCotizacion.setAllColumnPreferredWidthNvo(15);
                Iterator it = mapItem.keySet().iterator();
                cboItemDespachoCotizacion.removeAllItems();
                cboItemDespachoCotizacion.addItem(new ItemObject("", "--- SELECCIONE ---"));
                while (it.hasNext()) {
                    beanItem = (Item) mapItem.get(it.next());
                    cboItemDespachoCotizacion.addItem(new ItemObject(beanItem.getId_item(), beanItem.getDescripcion()));
                }
                cboItemDespachoCotizacion.setSelectedIndex(0);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarDocumentoDetalle() throws Exception {
        try {
            if (tableDoc.getSelectedRow() >= 0) {
                RnConsultas logic = new RnConsultas(path);
                List<RegContaItem> lista = logic.listarSalidaVentaDetalle(tableDoc.getValueAt(tableDoc.getSelectedRow(), 0).toString());
                inicialiceModeloDetalle();
                SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
                for (int i = 0; i < lista.size(); i++) {
                    Object[] data = new Object[6];
                    RegContaItem beanRegContaItem = (RegContaItem) lista.get(i);
                    data[0] = formato.format(beanRegContaItem.getFechaEmision());
                    data[1] = beanRegContaItem.getTipo_doc() + "/" + beanRegContaItem.getSerie() + "-" + beanRegContaItem.getPreimpreso();
                    data[2] = beanRegContaItem.getId_item();
                    data[3] = beanRegContaItem.getDescripcion_item();
                    data[4] = beanRegContaItem.getAlmacen();
                    data[5] = beanRegContaItem.getCantidad();
                    modeloDetalle.addRow(data);
                }
                tableDetalle.setAllColumnPreferredWidthNvo(15);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarDocumentoDespacho() throws Exception {
        try {
            if (tableDocVenta.getSelectedRow() >= 0) {
                LogicVentas logic = new LogicVentas();
                List<RegContaItem> lista = logic.buscaDetallexItem(tableDocVenta.getValueAt(tableDocVenta.getSelectedRow(), 0).toString(), "");
                inicialiceModeloDespacho();
                SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
                for (int i = 0; i < lista.size(); i++) {
                    Object[] data = new Object[6];
                    RegContaItem beanRegContaItem = (RegContaItem) lista.get(i);
                    if (beanRegContaItem.getFechaEmision() == null) {
                        data[0] = "";
                    } else {
                        data[0] = formato.format(beanRegContaItem.getFechaEmision());
                    }
                    data[1] = "[" + beanRegContaItem.getTipo_doc() + "] " + beanRegContaItem.getSerie() + "-" + beanRegContaItem.getPreimpreso();
                    data[2] = beanRegContaItem.getAlmacen();
                    data[3] = Constans.IS_BUSQUEDA_ITEM_ALTERNO ? beanRegContaItem.getIdAlterno() : beanRegContaItem.getId_item();
                    data[4] = beanRegContaItem.getDescripcion_item();
                    data[5] = beanRegContaItem.getDespachado();
                    modeloDespacho.addRow(data);
                }
                tableDespacho.setAllColumnPreferredWidthNvo(15);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarDocumentoDespachoPedido() throws Exception {
        try {
            if (tableDocPedido.getSelectedRow() >= 0) {
                RnPedidoCab logic = new RnPedidoCab(path);
                List<RegContaItem> lista = logic.detallePedidoDespacho(Integer.parseInt(tableDocPedido.getValueAt(tableDocPedido.getSelectedRow(), 0).toString()));
                inicialiceModeloDespachoPedido();
                SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
                for (int i = 0; i < lista.size(); i++) {
                    Object[] data = new Object[7];
                    RegContaItem beanRegContaItem = (RegContaItem) lista.get(i);
                    if (beanRegContaItem.getFechaEmision() == null) {
                        data[0] = "";
                    } else {
                        data[0] = formato.format(beanRegContaItem.getFechaEmision());
                    }
                    data[1] = "[" + beanRegContaItem.getTipo_doc() + "] " + beanRegContaItem.getSerie() + "-" + beanRegContaItem.getPreimpreso();
                    data[2] = beanRegContaItem.getId_cuenta();
                    data[3] = beanRegContaItem.getAlmacen();
                    data[4] = beanRegContaItem.getId_item();
                    data[5] = beanRegContaItem.getDescripcion_item();
                    data[6] = beanRegContaItem.getDespachado();
                    modeloDespachoPedido.addRow(data);
                }
                tableDespachoPedido.setAllColumnPreferredWidthNvo(15);
            }
        } catch (NumberFormatException | SQLException e) {
            throw e;
        }
    }

    private void buscarDocumentoDespachoCotizacion() throws Exception {
        try {
            if (tableDocCotizacion.getSelectedRow() >= 0) {
                RnCotizacionCab logic = new RnCotizacionCab(path);
                List<RegContaItem> lista = logic.detalleCotizacionDespacho(Integer.parseInt(tableDocCotizacion.getValueAt(tableDocCotizacion.getSelectedRow(), 0).toString()));
                inicialiceModeloDespachoCotizacion();
                SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
                for (int i = 0; i < lista.size(); i++) {
                    Object[] data = new Object[7];
                    RegContaItem beanRegContaItem = (RegContaItem) lista.get(i);
                    if (beanRegContaItem.getFechaEmision() == null) {
                        data[0] = "";
                    } else {
                        data[0] = formato.format(beanRegContaItem.getFechaEmision());
                    }
                    data[1] = "[" + beanRegContaItem.getTipo_doc() + "] " + beanRegContaItem.getSerie() + "-" + beanRegContaItem.getPreimpreso();
                    data[2] = beanRegContaItem.getId_cuenta();
                    data[3] = beanRegContaItem.getAlmacen();
                    data[4] = beanRegContaItem.getId_item();
                    data[5] = beanRegContaItem.getDescripcion_item();
                    data[6] = beanRegContaItem.getDespachado();
                    modeloDespachoCotizacion.addRow(data);
                }
                tableDespachoCotizacion.setAllColumnPreferredWidthNvo(15);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarDocumentoDevolucion() throws Exception {
        try {
            if (tableDocVenta.getSelectedRow() >= 0) {
                LogicVentas logic = new LogicVentas();
                List<RegContaItem> lista = logic.buscaDevolucionxItem(tableDocVenta.getValueAt(tableDocVenta.getSelectedRow(), 0).toString(), "");
                inicialiceModeloDevolucion();
                SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
                for (int i = 0; i < lista.size(); i++) {
                    Object[] data = new Object[6];
                    RegContaItem beanRegContaItem = (RegContaItem) lista.get(i);
                    if (beanRegContaItem.getFechaEmision().toString().isEmpty() == false) {
                        data[0] = formato.format(beanRegContaItem.getFechaEmision());
                    } else {
                        data[0] = "";
                    }
                    data[1] = "[" + beanRegContaItem.getTipo_doc() + "] " + beanRegContaItem.getSerie() + "-" + beanRegContaItem.getPreimpreso();
                    data[2] = beanRegContaItem.getAlmacen();
                    data[3] = Constans.IS_BUSQUEDA_ITEM_ALTERNO ? beanRegContaItem.getIdAlterno() : beanRegContaItem.getId_item();
                    data[4] = beanRegContaItem.getDescripcion_item();
                    data[5] = beanRegContaItem.getDespachado();
                    modeloDevolucion.addRow(data);
                }
                tableDevolucion.setAllColumnPreferredWidthNvo(15);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarDocumentoNC() throws Exception {
        try {
            if (tableDocVenta.getSelectedRow() >= 0) {
                LogicVentas logic = new LogicVentas();
                List<RegContaItem> lista = logic.buscaDetalleNCDespachar(tableDocVenta.getValueAt(tableDocVenta.getSelectedRow(), 0).toString(), "");
                inicialiceModeloNC();
                SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
                for (int i = 0; i < lista.size(); i++) {
                    Object[] data = new Object[5];
                    RegContaItem beanRegContaItem = (RegContaItem) lista.get(i);
                    if (beanRegContaItem.getFechaEmision().toString().isEmpty() == false) {
                        data[0] = formato.format(beanRegContaItem.getFechaEmision());
                    } else {
                        data[0] = "";
                    }
                    data[1] = "[" + beanRegContaItem.getTipo_doc() + "] " + beanRegContaItem.getSerie() + "-" + beanRegContaItem.getPreimpreso();
                    data[2] = Constans.IS_BUSQUEDA_ITEM_ALTERNO ? beanRegContaItem.getIdAlterno() : beanRegContaItem.getId_item();
                    data[3] = beanRegContaItem.getDescripcion_item();
                    data[4] = beanRegContaItem.getDespachado();
                    modeloNC.addRow(data);
                }
                tableNC.setAllColumnPreferredWidthNvo(15);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void filtrarDetalle() {
        modeloOrdenadoDetalle.setRowFilter(getFilterDetalle());
    }

    private void filtrarDespacho() {
        modeloOrdenadoDespacho.setRowFilter(getFilterDespacho());
    }

    private void filtrarDespachoPedido() {
        modeloOrdenadoDespachoPedido.setRowFilter(getFilterDespachoPedido());
    }

    private void filtrarDespachoCotizacion() {
        modeloOrdenadoDespachoCotizacion.setRowFilter(getFilterDespachoCotizacion());
    }

    private void filtrarDevolucion() {
        modeloOrdenadoDevolucion.setRowFilter(getFilterDevolucion());
    }

    private void filtrarNC() {
        modeloOrdenadoNC.setRowFilter(getFilterNC());
    }

    private RowFilter getFilterDetalle() {
        List filters = new ArrayList();
        if (cboItem.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItem.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 2));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    private RowFilter getFilterDespacho() {
        List filters = new ArrayList();
        if (cboItemDespacho.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemDespacho.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 3));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    private RowFilter getFilterDespachoPedido() {
        List filters = new ArrayList();
        if (cboItemDespachoPedido.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemDespachoPedido.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 4));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    private RowFilter getFilterDespachoCotizacion() {
        List filters = new ArrayList();
        if (cboItemDespachoCotizacion.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemDespachoCotizacion.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 4));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    private RowFilter getFilterDevolucion() {
        List filters = new ArrayList();
        if (cboItemDevolucion.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemDevolucion.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 3));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    private RowFilter getFilterNC() {
        List filters = new ArrayList();
        if (cboItemNC.getSelectedIndex() > 0) {
            ItemObject item = (ItemObject) this.cboItemNC.getSelectedItem();
            filters.add(RowFilter.regexFilter(".*" + item.getId() + ".*", 2));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    private void exportar(String nombre, CTable table, Map parameters) {
        try {
            File archivo = File.createTempFile(nombre + (new Date(Main.fechaActualServer.getTime())).getTime(), ".xlsx");
            archivo.deleteOnExit();
            parameters.put(0, usuario.getDescriempresa());
            parameters.put(1, "Ruc: " + usuario.getRuc());
            ExportarToExcel export = new ExportarToExcel(archivo, table, parameters);
            if (export.exportarJTableToExcelParam()) {
                JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
            }
        } catch (IOException | HeadlessException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
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
